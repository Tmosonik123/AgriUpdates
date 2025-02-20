import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setSettings } from '../store/settingsSlice';
import { CountySettings } from '../types/settings';

const COUNTIES = [
  'Baringo',
  'Bomet',
  'Bungoma',
  'Busia',
  'Elgeyo Marakwet',
  'Embu',
  'Garissa',
  'Homa Bay',
  'Isiolo',
  'Kajiado',
  'Kakamega',
  'Kericho',
  'Kiambu',
  'Kilifi',
  'Kirinyaga',
  'Kisii',
  'Kisumu',
  'Kitui',
  'Kwale',
  'Laikipia',
  'Lamu',
  'Machakos',
  'Makueni',
  'Mandera',
  'Marsabit',
  'Meru',
  'Migori',
  'Mombasa',
  'Murang\'a',
  'Nairobi',
  'Nakuru',
  'Nandi',
  'Narok',
  'Nyamira',
  'Nyandarua',
  'Nyeri',
  'Samburu',
  'Siaya',
  'Taita Taveta',
  'Tana River',
  'Tharaka Nithi',
  'Trans Nzoia',
  'Turkana',
  'Uasin Gishu',
  'Vihiga',
  'Wajir',
  'West Pokot'
];

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { settings } = useSelector((state: RootState) => state.settings);
  const [selectedCounty, setSelectedCounty] = useState(settings.selectedCounty);

  const handleCountySelect = (county: string) => {
    setSelectedCounty(county);
    const newSettings: CountySettings = {
      selectedCounty: county,
    };
    dispatch(setSettings(newSettings));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Select your county</Text>
      <ScrollView style={styles.countyList}>
        {COUNTIES.map((county) => (
          <TouchableOpacity
            key={county}
            style={[
              styles.countyItem,
              county === selectedCounty && styles.selectedCounty,
            ]}
            onPress={() => handleCountySelect(county)}
          >
            <Text
              style={[
                styles.countyText,
                county === selectedCounty && styles.selectedCountyText,
              ]}
            >
              {county}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  countyList: {
    flex: 1,
  },
  countyItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedCounty: {
    backgroundColor: '#e3f2fd',
  },
  countyText: {
    fontSize: 16,
  },
  selectedCountyText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
}); 