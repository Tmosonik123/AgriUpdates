import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { kilimoAPI, MarketPriceResponse } from '../services/api';

const PRIMARY_GREEN = '#4CAF50';
const LIGHT_GREEN = '#E8F5E9';
const DARK_GREEN = '#2E7D32';

const ITEMS_PER_PAGE = 10;

export default function MarketPricesPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MarketPriceResponse[]>([]);
  const [commodities, setCommodities] = useState<string[]>([]);
  const [markets, setMarkets] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({
    product: '',
    market: '',
    county: '',
    entries: '10',
  });

  // Fetch initial data and filter options
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [commoditiesResponse, marketsResponse] = await Promise.all([
          kilimoAPI.getCommodities(),
          kilimoAPI.getMarkets(),
        ]);
        setCommodities(['Select Product', ...commoditiesResponse]);
        setMarkets(['Select Market', ...marketsResponse]);
      } catch (error) {
        console.error('Error fetching filter options:', error);
        Alert.alert('Error', 'Failed to load filter options. Please try again.');
      }
    };

    fetchInitialData();
  }, []);

  // Fetch market prices when filters or page changes
  useEffect(() => {
    const fetchMarketPrices = async () => {
      try {
        setLoading(true);
        const response = await kilimoAPI.getMarketPrices({
          ...filters,
          page: currentPage,
          limit: parseInt(filters.entries),
        });
        setData(response.data);
        setTotalPages(Math.ceil(response.total / parseInt(filters.entries)));
      } catch (error) {
        console.error('Error fetching market prices:', error);
        Alert.alert('Error', 'Failed to load market prices. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketPrices();

    // Set up polling for real-time updates (every 5 minutes)
    const pollInterval = setInterval(fetchMarketPrices, 5 * 60 * 1000);

    return () => clearInterval(pollInterval);
  }, [filters, currentPage]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const exportUrl = await kilimoAPI.getExportUrl(filters);
      if (exportUrl) {
        await Linking.openURL(exportUrl);
      } else {
        Alert.alert('Error', 'Failed to generate export URL.');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Pressable
          key={i}
          style={[styles.pageButton, i === currentPage && styles.pageButtonActive]}
          onPress={() => setCurrentPage(i)}
        >
          <Text
            style={i === currentPage ? styles.pageButtonTextActive : styles.pageButtonText}
          >
            {i}
          </Text>
        </Pressable>
      );
    }

    return (
      <View style={styles.pagination}>
        {currentPage > 1 && (
          <Pressable
            style={styles.pageButton}
            onPress={() => setCurrentPage(currentPage - 1)}
          >
            <Text style={styles.pageButtonText}>←</Text>
          </Pressable>
        )}
        {startPage > 1 && <Text style={styles.pageButtonText}>...</Text>}
        {pages}
        {endPage < totalPages && <Text style={styles.pageButtonText}>...</Text>}
        {currentPage < totalPages && (
          <Pressable
            style={styles.pageButton}
            onPress={() => setCurrentPage(currentPage + 1)}
          >
            <Text style={styles.pageButtonText}>→</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color={DARK_GREEN} />
        </Pressable>
        <Text style={styles.title}>Market Prices</Text>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Product</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.product}
                onValueChange={(value) => {
                  setFilters({ ...filters, product: value });
                  setCurrentPage(1);
                }}
                style={styles.picker}
              >
                {commodities.map((item) => (
                  <Picker.Item key={item} label={item} value={item} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Market</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.market}
                onValueChange={(value) => {
                  setFilters({ ...filters, market: value });
                  setCurrentPage(1);
                }}
                style={styles.picker}
              >
                {markets.map((item) => (
                  <Picker.Item key={item} label={item} value={item} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Entries</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.entries}
                onValueChange={(value) => {
                  setFilters({ ...filters, entries: value });
                  setCurrentPage(1);
                }}
                style={styles.picker}
              >
                <Picker.Item label="10" value="10" />
                <Picker.Item label="25" value="25" />
                <Picker.Item label="50" value="50" />
                <Picker.Item label="100" value="100" />
              </Picker>
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.exportButton, exporting && styles.exportButtonDisabled]}
          onPress={handleExport}
          disabled={exporting}
        >
          {exporting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <FontAwesome name="file-excel-o" size={16} color="#fff" />
              <Text style={styles.exportButtonText}>Export to Excel</Text>
            </>
          )}
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_GREEN} />
        </View>
      ) : (
        <>
          <ScrollView horizontal style={styles.tableContainer}>
            <View>
              <View style={styles.headerRow}>
                <Text style={[styles.headerCell, styles.commodityCol]}>Commodity</Text>
                <Text style={[styles.headerCell, styles.classificationCol]}>Classification</Text>
                <Text style={[styles.headerCell, styles.gradeCol]}>Grade</Text>
                <Text style={[styles.headerCell, styles.sexCol]}>Sex</Text>
                <Text style={[styles.headerCell, styles.marketCol]}>Market</Text>
                <Text style={[styles.headerCell, styles.priceCol]}>Wholesale</Text>
                <Text style={[styles.headerCell, styles.priceCol]}>Retail</Text>
                <Text style={[styles.headerCell, styles.supplyCol]}>Supply Volume</Text>
                <Text style={[styles.headerCell, styles.countyCol]}>County</Text>
                <Text style={[styles.headerCell, styles.dateCol]}>Date</Text>
              </View>
              <ScrollView>
                {data.map((item, index) => (
                  <View key={index} style={[styles.row, index % 2 === 0 && styles.evenRow]}>
                    <Text style={[styles.cell, styles.commodityCol]}>{item.commodity}</Text>
                    <Text style={[styles.cell, styles.classificationCol]}>
                      {item.classification}
                    </Text>
                    <Text style={[styles.cell, styles.gradeCol]}>{item.grade}</Text>
                    <Text style={[styles.cell, styles.sexCol]}>{item.sex}</Text>
                    <Text style={[styles.cell, styles.marketCol]}>{item.market}</Text>
                    <Text style={[styles.cell, styles.priceCol]}>{item.wholesale}</Text>
                    <Text style={[styles.cell, styles.priceCol]}>{item.retail}</Text>
                    <Text style={[styles.cell, styles.supplyCol]}>{item.supplyVolume}</Text>
                    <Text style={[styles.cell, styles.countyCol]}>{item.county}</Text>
                    <Text style={[styles.cell, styles.dateCol]}>{item.date}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
          {renderPagination()}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_GREEN,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: LIGHT_GREEN,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  filterItem: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    color: DARK_GREEN,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  picker: {
    height: 40,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_GREEN,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tableContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 12,
  },
  evenRow: {
    backgroundColor: '#FAFAFA',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 14,
    color: DARK_GREEN,
    paddingHorizontal: 12,
  },
  cell: {
    fontSize: 14,
    color: '#424242',
    paddingHorizontal: 12,
  },
  commodityCol: { width: 120 },
  classificationCol: { width: 120 },
  gradeCol: { width: 80 },
  sexCol: { width: 80 },
  marketCol: { width: 150 },
  priceCol: { width: 100 },
  supplyCol: { width: 120 },
  countyCol: { width: 120 },
  dateCol: { width: 100 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  pageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pageButtonActive: {
    backgroundColor: PRIMARY_GREEN,
    borderColor: PRIMARY_GREEN,
  },
  pageButtonText: {
    color: DARK_GREEN,
    fontSize: 14,
  },
  pageButtonTextActive: {
    color: '#fff',
    fontSize: 14,
  },
  exportButtonDisabled: {
    opacity: 0.7,
  },
}); 