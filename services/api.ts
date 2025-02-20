import axios from 'axios';

const BASE_URL = 'https://statistics.kilimo.go.ke/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data
const MOCK_MARKET_PRICES: MarketPriceResponse[] = [
  {
    commodity: 'Dry Maize',
    classification: 'White Maize',
    grade: 'Grade 1',
    sex: '-',
    market: 'Kitale',
    wholesale: 45.00,
    retail: 52.00,
    supplyVolume: 2500,
    county: 'Trans Nzoia',
    date: '2024-03-20',
  },
  {
    commodity: 'Beans',
    classification: 'Rose Coco',
    grade: 'Grade 1',
    sex: '-',
    market: 'Eldoret',
    wholesale: 120.00,
    retail: 140.00,
    supplyVolume: 1200,
    county: 'Uasin Gishu',
    date: '2024-03-20',
  },
  {
    commodity: 'Rice',
    classification: 'Pishori',
    grade: 'Grade 1',
    sex: '-',
    market: 'Mwea',
    wholesale: 180.00,
    retail: 200.00,
    supplyVolume: 3000,
    county: 'Kirinyaga',
    date: '2024-03-20',
  },
  {
    commodity: 'Potatoes',
    classification: 'Irish',
    grade: 'Grade 1',
    sex: '-',
    market: 'Nakuru',
    wholesale: 35.00,
    retail: 45.00,
    supplyVolume: 4000,
    county: 'Nakuru',
    date: '2024-03-20',
  },
  {
    commodity: 'Tomatoes',
    classification: 'Fresh',
    grade: 'Grade 1',
    sex: '-',
    market: 'Karatina',
    wholesale: 80.00,
    retail: 100.00,
    supplyVolume: 1500,
    county: 'Nyeri',
    date: '2024-03-20',
  }
];

const MOCK_COMMODITIES = [
  'Dry Maize',
  'Beans',
  'Rice',
  'Potatoes',
  'Tomatoes',
  'Onions',
  'Cabbage',
  'Carrots'
];

const MOCK_MARKETS = [
  'Kitale',
  'Eldoret',
  'Mwea',
  'Nakuru',
  'Karatina',
  'Nairobi',
  'Mombasa',
  'Kisumu'
];

export interface MarketPriceResponse {
  commodity: string;
  classification: string;
  grade: string;
  sex: string;
  market: string;
  wholesale: number;
  retail: number;
  supplyVolume: number;
  county: string;
  date: string;
}

export interface TopSellingResponse {
  id: string;
  name: string;
  price: number;
  quantity: number;
  county: string;
}

class KilimoAPI {
  // Fetch market prices with filters
  async getMarketPrices(filters?: {
    product?: string;
    market?: string;
    county?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      // Mock implementation
      let filteredData = [...MOCK_MARKET_PRICES];
      
      const product = filters?.product;
      const market = filters?.market;
      
      if (product && product !== 'Select Product') {
        filteredData = filteredData.filter(item => 
          item.commodity.toLowerCase() === product.toLowerCase()
        );
      }
      
      if (market && market !== 'Select Market') {
        filteredData = filteredData.filter(item => 
          item.market.toLowerCase() === market.toLowerCase()
        );
      }

      const startIndex = ((filters?.page || 1) - 1) * (filters?.limit || 10);
      const endIndex = startIndex + (filters?.limit || 10);
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        total: filteredData.length,
        page: filters?.page || 1,
        limit: filters?.limit || 10
      };
    } catch (error) {
      console.error('Error fetching market prices:', error);
      throw error;
    }
  }

  // Fetch top selling items by county
  async getTopSellingItems(county: string) {
    try {
      // Mock implementation
      return [
        {
          id: '1',
          name: 'Dry Maize',
          price: 45.00,
          quantity: 2500,
          county: county,
        },
        {
          id: '2',
          name: 'Beans',
          price: 120.00,
          quantity: 1200,
          county: county,
        },
        {
          id: '3',
          name: 'Rice',
          price: 180.00,
          quantity: 3000,
          county: county,
        }
      ];
    } catch (error) {
      console.error('Error fetching top selling items:', error);
      throw error;
    }
  }

  // Fetch market highlights
  async getMarketHighlights() {
    try {
      // Return a subset of market prices as highlights
      return MOCK_MARKET_PRICES.slice(0, 3);
    } catch (error) {
      console.error('Error fetching market highlights:', error);
      throw error;
    }
  }

  // Fetch available commodities for filtering
  async getCommodities() {
    try {
      return MOCK_COMMODITIES;
    } catch (error) {
      console.error('Error fetching commodities:', error);
      throw error;
    }
  }

  // Fetch available markets
  async getMarkets() {
    try {
      return MOCK_MARKETS;
    } catch (error) {
      console.error('Error fetching markets:', error);
      throw error;
    }
  }

  // Get export URL for Excel download
  async getExportUrl(filters?: {
    product?: string;
    market?: string;
    county?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<string> {
    try {
      const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
      return `${BASE_URL}/export?${queryParams}`;
    } catch (error) {
      console.error('Error generating export URL:', error);
      throw error;
    }
  }
}

export const kilimoAPI = new KilimoAPI(); 