// TypeScript types for Chrome extension messages

export interface SortOffersMessage {
  type: "SORT_OFFERS";
  sortBy: "miles-desc" | "miles-asc";
}

export interface CheckPageMessage {
  type: "CHECK_PAGE";
}

export interface CheckNeedsLoadingMessage {
  type: "CHECK_NEEDS_LOADING";
}

export type ExtensionMessage = 
  | SortOffersMessage 
  | CheckPageMessage 
  | CheckNeedsLoadingMessage;

export interface SortResponse {
  success: boolean;
  message: string;
  count: number;
  loadedMore?: boolean;
}

export interface CheckPageResponse {
  isOffersPage: boolean;
  offerCount: number;
}

export interface CheckLoadingResponse {
  needsLoading: boolean;
}

export interface OfferTile {
  element: HTMLElement;
  mileage: number;
  text: string;
}

