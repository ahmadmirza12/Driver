import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import CustomText from './CustomText';
import Icons from './Icons';
import ImageFast from './ImageFast';

import fonts from '../assets/fonts';
import { Images } from '../assets/images';
import i18n from '../language/i18n';
import { COLORS } from '../utils/COLORS';

const CustomInput = ({
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType,
  multiline,
  maxLength,
  placeholderTextColor,
  editable,
  textAlignVertical,
  marginBottom,
  height = 56,
  autoCapitalize,
  error,
  isFocus,
  isBlur,
  width,
  onEndEditing,
  autoFocus,
  ref,
  borderRadius,
  marginTop,
  withLabel,
  isError,
  labelColor,
  borderColor = COLORS.inputBg,
  borderWidth,
  search,
  backgroundColor,
  inputStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePass, setHidePass] = useState(true);

  const handleFocus = () => {
    setIsFocused(true);
    isFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    isBlur?.();
  };

  return (
    <View style={{width: width || '100%'}}>
      {withLabel && (
        <CustomText
          label={withLabel}
          // marginBottom={8}
          color={labelColor || COLORS.black}
          fontFamily={fonts.semiBold}
          fontSize={16}
        />
      )}
      <View
        style={[
          styles.mainContainer,
          inputStyle,
          {
            marginBottom: error ? 5 : marginBottom || 15,
            marginTop,
            borderColor:
              error || isError
                ? COLORS.red
                : isFocused
                ? COLORS.primaryColor
                : borderColor,
            borderWidth: borderWidth || 1,
            height: height ? height : multiline ? 180 : 56,
            width: width || '100%',
            borderRadius: borderRadius || 12,
            paddingLeft: 20,
            backgroundColor: backgroundColor || COLORS.inputBg,
          },
        ]}>
        {search ? (
          <Icons
            family="Octicons"
            name="search"
            size={22}
            color={COLORS.gray}
          />
        ) : null}
        <TextInput
          ref={ref}
          placeholder={i18n.t(placeholder)}
          style={[
            styles.input,
            {
              width: secureTextEntry ? '91%' : '99%',
              paddingVertical: multiline ? 18 : 0,
              paddingLeft: search ? 8 : 0,
            },
            inputStyle,
          ]}
          secureTextEntry={secureTextEntry ? (hidePass ? true : false) : false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          onEndEditing={onEndEditing}
          maxLength={maxLength}
          placeholderTextColor={placeholderTextColor || '#9E9E9E'}
          editable={editable}
          textAlignVertical={multiline ? 'top' : textAlignVertical}
          autoCapitalize={autoCapitalize}
          autoFocus={autoFocus}
        />

        {secureTextEntry && (
          <ImageFast
            source={!hidePass ? Images.eye : Images.eyeLine}
            resizeMode="contain"
            style={{
              position: 'absolute',
              right: 17,
              width: 16,
              height: 16,
            }}
            onPress={() => setHidePass(!hidePass)}
          />
        )}
      </View>
      {error && (
        <CustomText
          label={error}
          color={COLORS.red}
          fontFamily={fonts.semiBold}
          fontSize={10}
          marginBottom={10}
        />
      )}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  input: {
    height: '100%',
    padding: 0,
    margin: 0,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: COLORS.black,
  },
});
