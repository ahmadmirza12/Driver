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
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
      >
        <View style={styles.inputContent}>
          <CountryPicker
            withFlag
            withFilter
            withCountryNameButton
            withAlphaFilter
            withCallingCode
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
          <AntDesign name="down" size={16} color="#888" />
        </View>
      </TouchableOpacity>


      {/* Country Picker Modal */}
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
    height: 30
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
