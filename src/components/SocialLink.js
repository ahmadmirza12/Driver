import {StyleSheet, View} from 'react-native';

import ImageFast from './ImageFast';

import {ToastMessage} from '../utils/ToastMessage';
import {PNGIcons} from '../assets/images/icons';

const SocialLink = ({marginBottom}) => {
  const array = [
    {
      icon: PNGIcons.radit,
      onPress: () => ToastMessage('Reddit'),
    },
    {
      icon: PNGIcons.youtube,
      onPress: () => ToastMessage('Youtube'),
    },
    {
      icon: PNGIcons.twitter,
      onPress: () => ToastMessage('Twitter'),
    },
    {
      icon: PNGIcons.insta,
      onPress: () => ToastMessage('Instagram'),
    },
    {
      icon: PNGIcons.facebook,
      onPress: () => ToastMessage('Facebook'),
    },
    {
      icon: PNGIcons.telegram,
      onPress: () => ToastMessage('Telegram'),
    },
  ];
  return (
    <View style={[styles.mainContainer, {marginBottom}]}>
      {array.map((item, i) => (
        <ImageFast
          key={i}
          source={item.icon}
          style={styles.icon}
          resizeMode="contain"
          onPress={item.onPress}
        />
      ))}
    </View>
  );
};

export default SocialLink;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
