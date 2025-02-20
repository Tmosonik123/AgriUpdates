import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Pressable,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { TopSellingItem } from '../types/settings';
import { MarketTable } from '../components/MarketTable';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { kilimoAPI, MarketPriceResponse } from '../services/api';

const PRIMARY_GREEN = '#4CAF50';
const LIGHT_GREEN = '#E8F5E9';
const DARK_GREEN = '#2E7D32';

export default function HomePage() {
  const { settings } = useSelector((state: RootState) => state.settings);
  const [topItems, setTopItems] = useState<TopSellingItem[]>([]);
  const [marketData, setMarketData] = useState<MarketPriceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both top selling items and market highlights in parallel
        const [topItemsResponse, marketHighlightsResponse] = await Promise.all([
          settings.selectedCounty ? kilimoAPI.getTopSellingItems(settings.selectedCounty) : [],
          kilimoAPI.getMarketHighlights(),
        ]);

        setTopItems(topItemsResponse);
        setMarketData(marketHighlightsResponse);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling for real-time updates (every 5 minutes)
    const pollInterval = setInterval(fetchData, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(pollInterval);
  }, [settings.selectedCounty]);

  const getIconName = (itemName: string) => {
    const iconMap: { [key: string]: string } = {
      'MAIZE': 'seedling',
      'TILAPIA': 'fish',
      'IRISH POTATO': 'apple-alt',
      'BEANS': 'seedling',
      'SUKUMA WIKI': 'leaf',
      'BEEF': 'cow',
      'RICE': 'seedling',
      'TOMATOES': 'apple-alt',
      'ONIONS': 'apple-alt',
      'WHEAT': 'seedling',
    };
    return iconMap[itemName] || 'shopping-basket';
  };

  const handleViewMore = () => {
    router.push('/market-prices');
  };

  if (!settings.selectedCounty) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please select your county in settings</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={PRIMARY_GREEN} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => setError(null)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Top Selling Items in {settings.selectedCounty}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsContainer}>
        {topItems.map((item) => (
          <Pressable key={item.id} style={styles.card}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name={getIconName(item.name)} size={24} color={PRIMARY_GREEN} />
            </View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.county}>{item.county}</Text>
            <Text style={styles.price}>{item.price.toFixed(2)} KES/KG</Text>
          </Pressable>
        ))}
        {topItems.length > 0 && (
          <Pressable style={[styles.card, styles.viewMoreCard]} onPress={handleViewMore}>
            <Text style={styles.viewMoreText}>View more →</Text>
          </Pressable>
        )}
        {topItems.length === 0 && (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No top selling items in {settings.selectedCounty}</Text>
          </View>
        )}
      </ScrollView>

      <Text style={[styles.headerText, styles.marketHeader]}>Market Highlights</Text>
      <MarketTable data={marketData} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_GREEN,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_GREEN,
    padding: 20,
    paddingBottom: 0,
  },
  cardsContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: LIGHT_GREEN,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: LIGHT_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: DARK_GREEN,
  },
  county: {
    fontSize: 14,
    color: PRIMARY_GREEN,
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: DARK_GREEN,
  },
  viewMoreCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_GREEN,
    borderColor: PRIMARY_GREEN,
    borderWidth: 1,
  },
  viewMoreText: {
    color: PRIMARY_GREEN,
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: DARK_GREEN,
    padding: 20,
  },
  error: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
    padding: 20,
  },
  noDataContainer: {
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    color: DARK_GREEN,
    fontSize: 16,
    textAlign: 'center',
  },
  marketHeader: {
    marginTop: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 