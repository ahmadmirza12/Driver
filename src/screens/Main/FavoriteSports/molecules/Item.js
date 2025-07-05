import {StyleSheet, TouchableOpacity} from 'react-native';

import CustomText from '../../../../components/CustomText';
import ImageFast from '../../../../components/ImageFast';

import {COLORS} from '../../../../utils/COLORS';
import fonts from '../../../../assets/fonts';

const Item = ({title, icon, onPress, selected}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[
        styles.mainContainer,
        {
          backgroundColor: selected ? '#080839' : COLORS.bg,
          borderColor: selected ? COLORS.primaryColor : COLORS.darkGray,
        },
      ]}>
      <ImageFast source={icon} style={styles.icon} />
      <CustomText
        label={title}
        fontFamily={fonts.bold}
        fontSize={23}
        marginTop={10}
      />
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  mainContainer: {
    width: '48%',
    height: 187,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 82,
    height: 82,
  },
});
