import { Platform, StyleSheet } from 'react-native';

import CustomText from './CustomText';

import fonts from '../assets/fonts';
import { COLORS } from '../utils/COLORS';

const DualText = ({ title, secondTitle, marginBottom, marginTop, onPress }) => {
  return (
    <CustomText
      color={COLORS.black}
      alignSelf="center"
      marginTop={198}
      label={title}
      fontSize={16}
    >
      <CustomText
        label={secondTitle}
        color="#1F5546" 
        onPress={onPress}
        fontFamily={fonts.semiBold}
        marginBottom={Platform.OS === 'android' ? -5 : -4}
        fontSize={16}
      />
    </CustomText>
  );
};

export default DualText;

const styles = StyleSheet.create({});
