import {StyleSheet, TouchableOpacity, View} from 'react-native';

import Icons from './Icons';

import {COLORS} from '../utils/COLORS';

const CustomCheckbox = ({value, onValueChange}) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}>
      <View style={[styles.checkbox, value && styles.checked]}>
        {value && (
          <Icons name="check" family="AntDesign" size={16} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primaryColor,
    marginRight: 10,
    overflow: 'hidden',
  },
  checkbox: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: COLORS.primaryColor,
  },
});

export default CustomCheckbox;
