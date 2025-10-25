import React, { useState, useCallback, useEffect } from "react";

const VALID_URL = "https://capitaloneoffers.com/c1-offers";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [offerCount, setOfferCount] = useState<number>(0);
  const [filterMultipliers, setFilterMultipliers] = useState<boolean>(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    totalTime: number;
    loadingTime: number;
    processingTime: number;
    domTime: number;
    tilesProcessed: number;
    multipliersFiltered: number;
  } | null>(null);

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
    // Performance tracking
    const startTime = performance.now();
    let loadingStartTime = 0;
    let processingStartTime = 0;
    let domStartTime = 0;
    
    // Pre-compile regex patterns for better performance
    const MULTIPLIER_REGEX = /(\d+)X\s*miles/i;
    const MILES_REGEX = /(?:Up to )?([0-9,]+)\s*miles/i;
    
    function parseMileageValue(text: string): number {
      // Optimized parsing - check for multiplier first (most common)
      const multiplierMatch = text.match(MULTIPLIER_REGEX);
      if (multiplierMatch) {
        return parseInt(multiplierMatch[1], 10) * 1000;
      }
      
      // Then check for regular miles
      const milesMatch = text.match(MILES_REGEX);
      if (milesMatch) {
        return parseInt(milesMatch[1].replace(/,/g, ""), 10);
      }
      
      return 0;
    }

    async function loadAllTiles() {
      loadingStartTime = performance.now();
      let attempts = 0;
      const maxAttempts = 20;
      
      // Cache button selector for better performance
      const buttonSelector = "button";
      
      while (true) {
        // Optimized: Use querySelectorAll with cached selector
        const buttons = document.querySelectorAll(buttonSelector);
        const viewMoreButton = Array.from(buttons)
          .find((button) => button.textContent === "View More Offers");
        
        if (!viewMoreButton) break;
        
        (viewMoreButton as HTMLButtonElement).click();
        
        // Adaptive delay - start fast, slow down if needed
        const delay = attempts < 5 ? 150 : 200;
        await new Promise((resolve) => setTimeout(resolve, delay));
        
        attempts++;
        if (attempts >= maxAttempts) break;
      }
    }

    async function sortByMiles() {
      processingStartTime = performance.now();
      
      // Optimized container finding - try most common selectors first
      const containerSelectors = [
        ".grid.justify-between.content-stretch.items-stretch.h-full.w-full.gap-4",
        ".grid.justify-center.gap-4.h-full.w-full", 
        ".grid.gap-4",
        "[class*='grid'][class*='gap']"
      ];
      
      let mainContainer: HTMLElement | null = null;
      for (const selector of containerSelectors) {
        mainContainer = document.querySelector(selector) as HTMLElement;
        if (mainContainer) break;
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

      // Revert to original working tile collection
      const standardTiles = mainContainer.querySelectorAll(".standard-tile");
      const styledTiles = mainContainer.querySelectorAll('div.flex > div[style*="border-radius"][style*="background-color"]');
      const allTiles = [...standardTiles, ...styledTiles];
      
      if (allTiles.length === 0) {
        alert("Found container but no offer tiles.");
        return 0;
      }

      // Optimized tile processing with caching
      const tilesWithMiles = [];
      const MULTIPLIER_DETECTION_REGEX = /\d+X/i; // Cache regex for multiplier detection
      
      for (let i = 0; i < allTiles.length; i++) {
        const tile = allTiles[i];
        const parent = tile.parentElement as HTMLElement | null;
        
        // Optimized mileage extraction with early exit
        let mileageDiv = tile.querySelector('div[style*="color"]');
        if (!mileageDiv) {
          mileageDiv = tile.querySelector('div[style*="background-color: rgb(37, 129, 14)"]');
        }
        
        const mileageText = mileageDiv?.textContent || "0 miles";
        const mileageValue = parseMileageValue(mileageText);
        const isMultiplier = MULTIPLIER_DETECTION_REGEX.test(mileageText);
        
        tilesWithMiles.push({ element: parent, mileage: mileageValue, isMultiplier });
      }

      // Filter out multipliers if option is enabled
      const filteredTiles = filterMultipliers 
        ? tilesWithMiles.filter(tile => !tile.isMultiplier)
        : tilesWithMiles;

      // Optimized DOM manipulation with batching
      domStartTime = performance.now();
      const sorted = filteredTiles.sort((a, b) => b.mileage - a.mileage);
      
      // Batch DOM operations for better performance
      const elementsToReset = [];
      const elementsToHide = [];
      const elementsToOrder = [];
      
      // Collect all DOM operations first
      tilesWithMiles.forEach((tile) => {
        if (tile.element) {
          elementsToReset.push(tile.element);
        }
      });
      
      if (filterMultipliers) {
        tilesWithMiles.forEach((tile) => {
          if (tile.isMultiplier && tile.element) {
            elementsToHide.push(tile.element);
          }
        });
      }
      
      sorted.forEach((item, index) => {
        if (item.element) {
          elementsToOrder.push({ element: item.element, order: index });
        }
      });
      
      // Execute DOM operations in batches
      elementsToReset.forEach(element => {
        element.style.order = '';
        element.style.display = '';
      });
      
      elementsToHide.forEach(element => {
        element.style.display = 'none';
      });
      
      elementsToOrder.forEach(({ element, order }) => {
        element.style.order = String(order);
      });

      const domEndTime = performance.now();
      const endTime = performance.now();
      
      // Calculate performance metrics
      const loadingTime = processingStartTime - loadingStartTime;
      const processingTime = domStartTime - processingStartTime;
      const domTime = domEndTime - domStartTime;
      const totalTime = endTime - startTime;
      const multipliersFiltered = tilesWithMiles.length - filteredTiles.length;
      
      return {
        count: filteredTiles.length,
        metrics: {
          totalTime: Math.round(totalTime),
          loadingTime: Math.round(loadingTime),
          processingTime: Math.round(processingTime),
          domTime: Math.round(domTime),
          tilesProcessed: tilesWithMiles.length,
          multipliersFiltered: multipliersFiltered
        }
      };
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
        const data = results[0].result as { count: number; metrics: any };
        setOfferCount(data.count);
        setPerformanceMetrics(data.metrics);
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
          {performanceMetrics && (
            <div style={{
              marginTop: '8px',
              padding: '8px',
              backgroundColor: '#e7f3ff',
              color: '#004085',
              border: '1px solid #b8daff',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>⚡ Performance Report</div>
              <div>Total Time: {performanceMetrics.totalTime}ms</div>
              <div>Loading: {performanceMetrics.loadingTime}ms | Processing: {performanceMetrics.processingTime}ms | DOM: {performanceMetrics.domTime}ms</div>
              <div>Tiles: {performanceMetrics.tilesProcessed} | Filtered: {performanceMetrics.multipliersFiltered}</div>
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
