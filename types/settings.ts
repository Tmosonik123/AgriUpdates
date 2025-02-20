export interface CountySettings {
  selectedCounty: string;
}

export interface SettingsState {
  settings: CountySettings;
  isLoading: boolean;
  error: string | null;
}

export interface TopSellingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  county: string;
  imageUrl?: string;
} 