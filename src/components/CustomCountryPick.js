import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

export default function CustomDatePicker() {
  const [countryCode, setCountryCode] = useState('PK');
  const [country, setCountry] = useState({
    name: 'Pakistan',
    flag: '🇵🇰',
  });
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>Country</Text>

      {/* Custom Input Style Picker */}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.inputContent}>
          <Text style={styles.text}>
            {country?.flag && country?.name
              ? `${country.flag}  ${country.name}`
              : 'Choose your country'}
          </Text>
          <AntDesign name="down" size={16} color="#888" />
        </View>
      </TouchableOpacity>

      {/* Country Picker Modal */}
      <CountryPicker
        withFlag
        withFilter
        withCountryNameButton={false}
        withAlphaFilter
        withCallingCode={false}
        withEmoji
        visible={visible}
        onClose={() => setVisible(false)}
        onSelect={(selectedCountry) => {
          setCountryCode(selectedCountry.cca2);
          setCountry({
            name: selectedCountry.name,
            flag: selectedCountry.flag,
          });
        }}
        countryCode={countryCode}
        theme={{ backgroundColor: '#fff' }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginBottom: 10,
  },
  inputContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  inputContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height:30
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
