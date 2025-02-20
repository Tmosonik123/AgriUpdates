import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const PRIMARY_GREEN = '#4CAF50';
const LIGHT_GREEN = '#E8F5E9';
const DARK_GREEN = '#2E7D32';

interface MarketEntry {
  commodity: string;
  market: string;
  county: string;
  wholesale: number;
  retail: number;
  supply: number;
}

interface MarketTableProps {
  data: MarketEntry[];
}

export const MarketTable: React.FC<MarketTableProps> = ({ data }) => {
  const handleViewAll = () => {
    router.push('/market-prices');
  };

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>MARKET HIGHLIGHT</Text>
          <Pressable style={styles.viewAllButton} onPress={handleViewAll}>
            <Text style={styles.viewAllText}>View all</Text>
            <FontAwesome name="angle-right" size={16} color={PRIMARY_GREEN} />
          </Pressable>
        </View>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No market data available</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>MARKET HIGHLIGHT</Text>
        <Pressable style={styles.viewAllButton} onPress={handleViewAll}>
          <Text style={styles.viewAllText}>View all</Text>
          <FontAwesome name="angle-right" size={16} color={PRIMARY_GREEN} />
        </Pressable>
      </View>
      <ScrollView horizontal>
        <View>
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, styles.commodityCol]}>Commodity</Text>
            <Text style={[styles.headerCell, styles.marketCol]}>Market</Text>
            <Text style={[styles.headerCell, styles.countyCol]}>County</Text>
            <Text style={[styles.headerCell, styles.priceCol]}>Wholesale(KES/kg)</Text>
            <Text style={[styles.headerCell, styles.priceCol]}>Retail(KES/kg)</Text>
            <Text style={[styles.headerCell, styles.supplyCol]}>Supply(kg)</Text>
          </View>
          <ScrollView style={styles.tableBody}>
            {data.map((entry, index) => (
              <View key={index} style={[styles.row, index % 2 === 0 && styles.evenRow]}>
                <Text style={[styles.cell, styles.commodityCol]}>{entry.commodity}</Text>
                <Text style={[styles.cell, styles.marketCol]}>{entry.market}</Text>
                <Text style={[styles.cell, styles.countyCol]}>{entry.county}</Text>
                <Text style={[styles.cell, styles.priceCol]}>{entry.wholesale?.toFixed(2) ?? '0.00'}</Text>
                <Text style={[styles.cell, styles.priceCol]}>{entry.retail?.toFixed(2) ?? '0.00'}</Text>
                <Text style={[styles.cell, styles.supplyCol]}>{entry.supply?.toFixed(2) ?? '0.00'}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_GREEN,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: PRIMARY_GREEN,
    fontSize: 14,
    marginRight: 4,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
    color: DARK_GREEN,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'left',
    paddingHorizontal: 10,
  },
  cell: {
    fontSize: 14,
    textAlign: 'left',
    paddingHorizontal: 10,
    color: '#424242',
  },
  commodityCol: {
    width: 150,
  },
  marketCol: {
    width: 120,
  },
  countyCol: {
    width: 120,
  },
  priceCol: {
    width: 100,
  },
  supplyCol: {
    width: 100,
  },
  tableBody: {
    maxHeight: 300,
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    color: '#757575',
    fontSize: 16,
  },
});