import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import CustomText from './CustomText';
import Icons from './Icons';
import ImageFast from './ImageFast';

import fonts from '../assets/fonts';
import { PNGIcons } from '../assets/images/icons';
import { COLORS } from '../utils/COLORS';

const Header = ({
  title,
  hideBackArrow,
  onBackPress,
  textColor,
  backgroundColor,
  marginTop,
  fontFamily,
  marginBottom,
  onChatPress,
  onSharePress,
}) => {
  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.mainContainer,
        {
          backgroundColor,
          marginTop,
          marginBottom,
        },
      ]}>
      <View style={styles.row}>
        {hideBackArrow ? null : (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.backIcon}
            onPress={
              onBackPress
                ? onBackPress
                : () => {
                    if (navigation.canGoBack()) navigation.goBack();
                  }
            }>
            <Icons
              family="AntDesign"
              name="left"
              size={22}
              color={textColor || COLORS.black}
              
            />
          </TouchableOpacity>
        )}
        <CustomText
          label={title}
          color={textColor ? textColor : COLORS.black}
          fontFamily={fontFamily || fonts.bold}
          textTransform="capitalize"
          fontSize={26}
          width={300}
          marginTop={10}
          fontWeight={'bold'}
        />
      </View>
      <View style={styles.row}>
        {onSharePress ? (
          <ImageFast
            source={PNGIcons.share}
            style={styles.icon}
            resizeMode="contain"
            onPress={onSharePress}
          />
        ) : null}
        {onChatPress ? (
          <ImageFast
            source={PNGIcons.chat}
            style={styles.icon}
            resizeMode="contain"
            onPress={onChatPress}
          />
        ) : null}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    padding:20
  },
  backIcon: {
    width: 50,
    height: 20,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },

});
