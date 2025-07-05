import { StyleSheet, View } from 'react-native';

import CustomText from '../../../../components/CustomText';
import ImageFast from '../../../../components/ImageFast';
import UserLive from '../../../../components/UserLive';

import fonts from '../../../../assets/fonts';
import { Images } from '../../../../assets/images';

const ProfileCard = () => {
  return (
    <View style={styles.mainContainer}>
      <UserLive isLive />
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
            label="Followerydchyjvbk"
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
    gap: 10,
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
