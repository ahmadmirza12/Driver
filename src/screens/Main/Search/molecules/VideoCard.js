import {StyleSheet, TouchableOpacity, View} from 'react-native';

import CustomText from '../../../../components/CustomText';
import ImageFast from '../../../../components/ImageFast';
import Icons from '../../../../components/Icons';

import {Images} from '../../../../assets/images';
import {COLORS} from '../../../../utils/COLORS';
import fonts from '../../../../assets/fonts';

const VideoCard = ({onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={styles.mainContainer}>
      <ImageFast source={Images.placeholderImage} style={styles.image} />
      <View style={styles.secondContainer}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <View style={[styles.row, {gap: 8}]}>
            <ImageFast source={Images.placeholderUser} style={styles.user} />
            <CustomText
              label="Football"
              fontSize={18}
              fontFamily={fonts.bold}
            />
          </View>
          <Icons
            family="AntDesign"
            name="arrowright"
            size={20}
            color={COLORS.white}
          />
        </View>
        <CustomText
          label="John vs Doe"
          color={COLORS.tabIcon}
          marginTop={10}
          marginBottom={10}
        />
        <View style={styles.view}>
          <Icons family="Feather" name="eye" color={COLORS.white} />
          <CustomText label="2.4K" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VideoCard;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  image: {
    width: '42%',
    height: 90,
    borderRadius: 12,
  },
  secondContainer: {
    width: '55%',
    height: '100%',
  },
  user: {
    width: 24,
    height: 24,
    borderRadius: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  view: {
    width: '30%',
    height: 24,
    backgroundColor: COLORS.darkGray,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
});
