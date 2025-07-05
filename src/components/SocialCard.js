import {StyleSheet, TouchableOpacity, View} from 'react-native';

import CustomText from './CustomText';
import ImageFast from './ImageFast';

import {ToastMessage} from '../utils/ToastMessage';
import {PNGIcons} from '../assets/images/icons';
import {Images} from '../assets/images';
import {COLORS} from '../utils/COLORS';
import fonts from '../assets/fonts';

const SocialCard = () => {
  const likes = [
    {icon: '❤️', title: '10K'},
    {icon: '🏆', title: '9K'},
    {icon: '🤩', title: '900'},
    {icon: '😡', title: '2K'},
  ];
  return (
    <View style={styles.mainContainer}>
      <View style={styles.row}>
        <View style={styles.userContainer}>
          <ImageFast source={Images.placeholderImage} style={styles.user} />
          <View>
            <CustomText label="Jed’s Room" />
            <CustomText label="@jed21" />
          </View>
        </View>
        <ImageFast
          source={PNGIcons.share}
          style={styles.share}
          resizeMode="contain"
          onPress={() => ToastMessage('Share')}
        />
      </View>
      <CustomText
        label="The 3 finalists for the 2024-25 NBA Most Valuable Player Award.🏆"
        fontFamily={fonts.semiBold}
        fontSize={16}
        numberOfLines={2}
        marginBottom={10}
        marginTop={10}
      />
      <ImageFast source={Images.placeholderImage} style={styles.image} />
      <View style={styles.likeContainer}>
        {likes?.map((item, i) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => ToastMessage('Like')}
            key={i}
            style={styles.like}>
            <CustomText label={item?.icon} fontSize={26} />
            <CustomText label={item?.title} marginTop={3} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SocialCard;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    borderBottomWidth: 0.4,
    borderBottomColor: COLORS.white,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  user: {
    width: 46,
    height: 46,
    borderRadius: 8,
  },
  share: {
    width: 28,
    height: 28,
  },
  image: {
    width: '100%',
    height: 255,
    borderRadius: 10,
  },
  like: {
    alignItems: 'center',
    marginRight: 10,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});
