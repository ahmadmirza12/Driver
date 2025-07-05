import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

import UploadImage from '../../../../components/UploadImage';
import CustomText from '../../../../components/CustomText';
import ImageFast from '../../../../components/ImageFast';

import {tabIcons} from '../../../../assets/images/tabIcons';
import {Images} from '../../../../assets/images';
import {COLORS} from '../../../../utils/COLORS';
import fonts from '../../../../assets/fonts';

const ProfileCard = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.profileContainer}>
        <Image
          source={tabIcons.room}
          style={styles.profile}
          resizeMode="contain"
        />
        <UploadImage
          handleChange={img => console.log(img.path)}
          renderButton={onPress => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={onPress}
              style={styles.cameraContainer}>
              <ImageFast
                source={Images.camera}
                style={styles.camera}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        />
      </View>
      <View>
        <View style={[styles.row, {marginBottom: 10}]}>
          <CustomText
            label="Soccer Match Room"
            fontFamily={fonts.bold}
            fontSize={20}
          />
          <ImageFast
            source={Images.check}
            style={styles.check}
            resizeMode="contain"
          />
        </View>
        <View style={styles.row}>
          <CustomText label="265K" fontFamily={fonts.semiBold} />
          <CustomText
            label="Followers"
            fontFamily={fonts.medium}
            marginLeft={5}
          />
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  profileContainer: {
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: COLORS.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    width: 40,
    height: 40,
    tintColor: COLORS.white,
  },
  cameraContainer: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: COLORS.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -3,
    right: -8,
    borderWidth: 1,
    borderColor: COLORS.bg,
  },
  camera: {
    width: 19,
    height: 19,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  check: {
    width: 18,
    height: 18,
    marginLeft: 5,
  },
});
