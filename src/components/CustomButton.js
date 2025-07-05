import { useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';

import CustomText from './CustomText';

import fonts from '../assets/fonts';
import { COLORS } from '../utils/COLORS';

const CustomButton = ({
  onPress,
  title,
  disabled,
  loading,
  customStyle,
  customText,
  marginBottom,
  marginTop,
  backgroundColor,
  color,
  width = '100%',
  height = 52,
  borderRadius = 12,
  justifyContent = 'center',
  alignItems = 'center',
  flexDirection = 'row',
  alignSelf = 'center',
  fontSize,
  indicatorColor,
  marginRight,
  borderWidth,
  borderColor,
  fontFamily,
  loadingSize,
  mainStyle,
  icon,
  icnWidth,
  icnHeight,
}) => {
  const [animation] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(animation, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animation, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[mainStyle, {transform: [{scale: animation}], width, alignSelf}]}>
      <TouchableOpacity
        disabled={loading || disabled}
        activeOpacity={0.6}
        style={[
          {
            backgroundColor: disabled
              ? COLORS.btnColor
              : backgroundColor
              ? backgroundColor
              : COLORS.btnColor,
            marginTop,
            marginBottom,
            width: '100%',
            height,
            borderRadius,
            flexDirection,
            alignItems,
            justifyContent,
            marginRight,
            borderWidth,
            borderColor,
          },
          customStyle,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        {loading && (
          <ActivityIndicator
            size={loadingSize || 25}
            color={indicatorColor || COLORS.white}
          />
        )}
        {icon && (
          <Image
            source={icon}
            style={{
              width: icnWidth || 20,
              height: icnHeight || 20,
              resizeMode: 'contain',
              marginRight: 5,
            }}
          />
        )}

        {!loading && (
          <CustomText
            textStyle={customText}
            label={title}
            color={color || COLORS.white}
            fontFamily={fontFamily || fonts.medium}
            fontSize={fontSize || 15}
            textTransform={'capitalize'}
            lineHeight={22}
            marginTop={-2}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CustomButton;
