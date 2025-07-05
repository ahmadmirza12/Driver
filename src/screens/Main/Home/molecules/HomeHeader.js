import {useNavigation} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {useState} from 'react';

import SuccessModal from '../../../../components/SuccessModal';
import CustomButton from '../../../../components/CustomButton';
import ImageFast from '../../../../components/ImageFast';

import CreateRoomModal from './CreateRoomModal';

import {Images} from '../../../../assets/images';
import {COLORS} from '../../../../utils/COLORS';
import fonts from '../../../../assets/fonts';

const HomeHeader = () => {
  const navigation = useNavigation();
  const [isCreateRoomModal, setCreateRoomModal] = useState(false);
  const [isCreateRoomSuccess, setCreateRoomSuccess] = useState(false);
  return (
    <View style={styles.mainContainer}>
      <ImageFast
        source={Images.headerLogo}
        style={styles.logo}
        resizeMode="contain"
      />
      <CustomButton
        title="Create Room"
        backgroundColor={COLORS.white}
        color={COLORS.black}
        width="35%"
        height={38}
        fontFamily={fonts.semiBold}
        onPress={() => setCreateRoomModal(true)}
      />
      <CreateRoomModal
        isVisible={isCreateRoomModal}
        onDisable={() => setCreateRoomModal(false)}
        onPress={() => {
          setCreateRoomModal(false);
          setTimeout(() => {
            setCreateRoomSuccess(true);
          }, 500);
        }}
      />
      <SuccessModal
        isVisible={isCreateRoomSuccess}
        title="Congratulations!"
        desc="Your room is Successfully created."
        buttonTitle="Close"
        source={Images.success3}
        onPress={() => {
          setCreateRoomSuccess(false);
          setTimeout(() => {
            navigation.navigate('RoomSetting');
          }, 500);
        }}
      />
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: COLORS.primaryColor,
  },
  logo: {
    width: '55%',
    height: 38,
  },
});
