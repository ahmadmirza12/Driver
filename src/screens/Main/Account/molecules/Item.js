import {StyleSheet, View, TouchableOpacity} from 'react-native';

import CustomText from '../../../../components/CustomText';
import ImageFast from '../../../../components/ImageFast';
import Icons from '../../../../components/Icons';

import {COLORS} from '../../../../utils/COLORS';
import fonts from '../../../../assets/fonts';

const Item = ({icon, title, hideArrow, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={styles.mainContainer}>
      <View style={styles.row}>
        <ImageFast source={icon} style={styles.icon} resizeMode="contain" />
        <CustomText label={title} fontFamily={fonts.bold} fontSize={20} />
      </View>
      {hideArrow ? null : (
        <Icons
          family="Entypo"
          name="chevron-right"
          size={22}
          color={COLORS.white}
        />
      )}
    </TouchableOpacity>
  );
};

export default Item;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  icon: {
    width: 56,
    height: 56,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
