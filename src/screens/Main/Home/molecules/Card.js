import {StyleSheet, View} from 'react-native';

import CustomButton from '../../../../components/CustomButton';
import CustomText from '../../../../components/CustomText';
import ImageFast from '../../../../components/ImageFast';

import {Images} from '../../../../assets/images';
import {COLORS} from '../../../../utils/COLORS';
import fonts from '../../../../assets/fonts';

const Card = ({
  marginRight = 10,
  width = 280,
  marginBottom,
  hideJoin,
  onOpenPress,
  hideButton,
}) => {
  return (
    <View
      style={[
        styles.mainContainer,
        {marginRight, width, marginBottom, height: hideButton ? 245 : 290},
      ]}>
      <ImageFast source={Images.placeholderImage} style={styles.image} isView />
      <View style={styles.container}>
        <ImageFast source={Images.placeholderUser} style={styles.user} isView />
        <CustomText
          label="Soccer Match Room"
          fontFamily={fonts.bold}
          fontSize={18}
          marginTop={5}
        />
        <CustomText
          fontFamily={fonts.medium}
          numberOfLines={3}
          marginBottom={10}
          marginTop={5}
          label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et doloreu fugiat nulla"
        />
        {hideButton ? null : (
          <View style={styles.row}>
            <CustomButton
              title="Open"
              width={hideJoin ? '100%' : '48%'}
              height={38}
              borderRadius={6}
              backgroundColor={COLORS.white}
              color={COLORS.black}
              onPress={onOpenPress}
            />
            {hideJoin ? null : (
              <CustomButton
                title="Join"
                width="48%"
                height={38}
                borderRadius={6}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#102146',
  },
  image: {
    width: '100%',
    height: 115,
  },
  user: {
    width: 55,
    height: 55,
    borderRadius: 100,
    marginTop: -40,
  },
  container: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
