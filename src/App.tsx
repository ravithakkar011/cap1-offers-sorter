import React, { useState, useCallback, useEffect } from "react";

const VALID_URL = "https://capitaloneoffers.com/c1-offers";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [offerCount, setOfferCount] = useState<number>(0);
  const [filterMultipliers, setFilterMultipliers] = useState<boolean>(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });
  }, []);

  /**
   * Check if "View More Offers" button is present
   */
  function checkNeedsLoading() {
    const btn = Array.from(document.querySelectorAll("button")).find(
      (button) => button.textContent === "View More Offers"
    );
    return !!btn;
  }

  /**
   * Simple script that sorts offers by mileage
   */
  async function injectedScript(filterMultipliers: boolean) {
    function parseMileageValue(text: string): number {
      const cleanedText = text.replace(/\*/g, "").trim();
      const multiplierMatch = cleanedText.match(/(\d+)X miles/i);
      if (multiplierMatch) {
        return parseInt(multiplierMatch[1], 10) * 1000;
      }
      const milesMatch = cleanedText.match(/(?:Up to )?([0-9,]+) miles/i);
      if (milesMatch) {
        return parseInt(milesMatch[1].replace(/,/g, ""), 10);
      }
      return 0;
    }

    async function loadAllTiles() {
      let attempts = 0;
      const maxAttempts = 20;
      while (true) {
        const viewMoreButton = Array.from(document.querySelectorAll("button"))
          .find((button) => button.textContent === "View More Offers");
        if (!viewMoreButton) break;
        (viewMoreButton as HTMLButtonElement).click();
        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
        if (attempts >= maxAttempts) break;
      }
    }

    async function sortByMiles() {
      let mainContainer = document.querySelector(".grid.justify-between.content-stretch.items-stretch.h-full.w-full.gap-4") as HTMLElement | null;
      if (!mainContainer) {
        mainContainer = document.querySelector(".grid.justify-center.gap-4.h-full.w-full") as HTMLElement | null;
      }
      if (!mainContainer) {
        mainContainer = document.querySelector(".grid.gap-4") as HTMLElement | null;
      }
      if (!mainContainer) {
        alert("Could not find offers container.");
        return 0;
      }

      const carouselElement = document.querySelector('.app-page[style*="grid-column"]') as HTMLElement | null;
      if (carouselElement) {
        carouselElement.style.display = "none";
      }

      await loadAllTiles();
      mainContainer.style.display = "grid";

      const standardTiles = mainContainer.querySelectorAll(".standard-tile");
      const styledTiles = mainContainer.querySelectorAll('div.flex > div[style*="border-radius"][style*="background-color"]');
      const allTiles = [...standardTiles, ...styledTiles];
      
      if (allTiles.length === 0) {
        alert("Found container but no offer tiles.");
        return 0;
      }

      const tilesWithMiles = allTiles.map((tile) => {
        const parent = tile.parentElement as HTMLElement | null;
        const mileageDiv = tile.querySelector('div[style*="color"]') || tile.querySelector('div[style*="background-color: rgb(37, 129, 14)"]');
        const mileageText = mileageDiv?.textContent || "0 miles";
        const mileageValue = parseMileageValue(mileageText);
        const isMultiplier = /\d+X/i.test(mileageText);
        return { element: parent, mileage: mileageValue, isMultiplier };
      });

      // Filter out multipliers if option is enabled
      const filteredTiles = filterMultipliers 
        ? tilesWithMiles.filter(tile => !tile.isMultiplier)
        : tilesWithMiles;

      // Reset all tiles first
      tilesWithMiles.forEach((tile) => {
        if (tile.element) {
          tile.element.style.order = '';
          tile.element.style.display = '';
        }
      });

      // Hide multiplier deals if filtering is enabled
      if (filterMultipliers) {
        tilesWithMiles.forEach((tile) => {
          if (tile.isMultiplier && tile.element) {
            tile.element.style.display = 'none';
          }
        });
      }

      // Sort and apply order to visible tiles
      const sorted = filteredTiles.sort((a, b) => b.mileage - a.mileage);
      sorted.forEach((item, index) => {
        if (item.element) {
          item.element.style.order = String(index);
        }
      });

      return filteredTiles.length;
    }

    return await sortByMiles();
  }

  const handleSort = useCallback(async () => {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    
    if (!activeTab?.id) return;

    const [checkResults] = await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: checkNeedsLoading,
    });

    const needsLoading = checkResults.result === true;
    if (needsLoading) {
      setIsLoading(true);
    }

    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: injectedScript,
        args: [filterMultipliers],
      });
      
      if (results && results[0]?.result) {
        const count = results[0].result as number;
        setOfferCount(count);
      }
    } catch (error) {
      console.error("Error executing script:", error);
    } finally {
      if (needsLoading) {
        setIsLoading(false);
      }
    }
  }, [filterMultipliers]);

  const isValidUrl = currentUrl.startsWith(VALID_URL);

  return (
    <div style={{ width: '400px', padding: '20px' }}>
      {isValidUrl ? (
        <div>
          <button
            onClick={handleSort}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {isLoading ? 'Sorting...' : 'Sort Capital One Offers'}
          </button>
          <div style={{ marginTop: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filterMultipliers}
                onChange={(e) => setFilterMultipliers(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Filter out multiplier deals (e.g., "2X miles")
            </label>
          </div>
          {offerCount > 0 && (
            <div style={{
              marginTop: '10px',
              padding: '8px',
              backgroundColor: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              ✓ Sorted {offerCount} offers!
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>This extension only works on the Capital One offers page</p>
          <button
            onClick={() => window.open(VALID_URL, "_blank")}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go to Offers Page
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
