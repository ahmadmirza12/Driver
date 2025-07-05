import {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
  View,
} from 'react-native';

import ScreenWrapper from '../../../components/ScreenWrapper';
import CustomButton from '../../../components/CustomButton';
import SuccessModal from '../../../components/SuccessModal';
import UploadImage from '../../../components/UploadImage';
import CustomInput from '../../../components/CustomInput';
import ImageFast from '../../../components/ImageFast';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';

import {Images} from '../../../assets/images';
import {COLORS} from '../../../utils/COLORS';

const Profile = ({navigation}) => {
  const keyboardHeight = new Animated.Value(0);

  const [name, setName] = useState('');
  const [profile, setProfile] = useState('');
  const [isModal, setModal] = useState(false);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', event => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }).start();
    });
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', event => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    });
    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);
  return (
    <ScreenWrapper
      scrollEnabled
      footerUnScrollable={() => (
        <Animated.View
          style={{marginBottom: keyboardHeight, paddingHorizontal: 20}}>
          <CustomButton
            title="Continue"
            marginBottom={30}
            onPress={() => setModal(true)}
          />
        </Animated.View>
      )}
      headerUnScrollable={() => <Header title="Fill Your Profile" />}>
      <View style={styles.profileContainer}>
        <ImageFast
          source={profile ? {uri: profile} : Images.placeholderUser}
          style={styles.profile}
        />
        <UploadImage
          handleChange={img => setProfile(img.path)}
          renderButton={onPress => (
            <TouchableOpacity
              onPress={onPress}
              style={styles.edit}
              activeOpacity={0.6}>
              <Icons
                family="MaterialIcons"
                name="edit"
                color={COLORS.white}
                size={18}
              />
            </TouchableOpacity>
          )}
        />
      </View>

      <CustomInput placeholder="Enter" value={name} onChangeText={setName} />
      <SuccessModal
        isVisible={isModal}
        source={Images.success1}
        title="Congratulations!"
        desc="Your account is ready to use. You will be redirected to the Home page in a few seconds."
        buttonTitle="Go to Home"
        onPress={() => {
          setModal(false);
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'MainStack',
                },
              ],
            });
          }, 500);
        }}
      />
    </ScreenWrapper>
  );
};

export default Profile;
const styles = StyleSheet.create({
  profileContainer: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  profile: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  edit: {
    width: 33,
    height: 33,
    borderRadius: 10,
    backgroundColor: COLORS.primaryColor,
    right: 8,
    position: 'absolute',
    bottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
