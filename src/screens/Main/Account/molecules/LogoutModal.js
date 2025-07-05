import {useNavigation} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';

import CustomButton from '../../../../components/CustomButton';
import CustomModal from '../../../../components/CustomModal';
import CustomText from '../../../../components/CustomText';
import ImageFast from '../../../../components/ImageFast';

import {PNGIcons} from '../../../../assets/images/icons';
import {COLORS} from '../../../../utils/COLORS';
import fonts from '../../../../assets/fonts';

const LogoutModal = ({isVisible, onDisable, isLogout}) => {
  const navigation = useNavigation();
  return (
    <CustomModal isChange isVisible={isVisible} onDisable={onDisable}>
      <View style={styles.mainContainer}>
        <ImageFast
          source={isLogout ? PNGIcons.logout : PNGIcons.delete}
          style={styles.icon}
          resizeMode="contain"
        />

        <CustomText
          label={isLogout ? 'Logout' : 'Delete Your Account?'}
          color={COLORS.red}
          fontFamily={fonts.bold}
          fontSize={24}
          marginBottom={20}
        />
        <View style={styles.border} />
        <CustomText
          label={
            isLogout
              ? 'Are you sure you want to log out?'
              : 'Are you sure you want to delete your account? This action is irreversible, and all your data will be permanently removed.'
          }
          fontFamily={fonts.bold}
          fontSize={18}
          marginBottom={20}
          textAlign="center"
        />
        <View style={styles.row}>
          <CustomButton
            title="Cancel"
            width="48%"
            backgroundColor="transparent"
            borderWidth={1}
            borderColor={COLORS.white}
            onPress={onDisable}
          />
          <CustomButton
            title={isLogout ? 'Yes, Logout' : 'Delete Account'}
            width="48%"
            backgroundColor={COLORS.red}
            onPress={() => {
              onDisable();
              setTimeout(() => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'AuthStack',
                    },
                  ],
                });
              }, 500);
            }}
          />
        </View>
      </View>
    </CustomModal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderTopRightRadius: 44,
    borderTopLeftRadius: 44,
  },
  icon: {
    width: 96,
    height: 96,
    marginBottom: 20,
  },
  border: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.darkGray,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
});
