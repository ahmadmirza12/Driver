import {StyleSheet, TouchableOpacity} from 'react-native';

import CustomText from '../../../../components/CustomText';

import {COLORS} from '../../../../utils/COLORS';
import fonts from '../../../../assets/fonts';

const Item = ({title, onPress, selected}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[
        styles.mainContainer,
        {
          backgroundColor: selected ? COLORS.primaryColor : 'transparent',
          borderColor: selected ? COLORS.primaryColor : COLORS.white,
        },
      ]}>
      <CustomText label={title} fontFamily={fonts.bold} fontSize={18} />
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: 100,
    borderWidth: 2,
    marginBottom: 15,
    height: 45,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
});
