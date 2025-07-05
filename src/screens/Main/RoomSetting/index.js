import {StyleSheet, View} from 'react-native';
import {useState} from 'react';

import ScreenWrapper from '../../../components/ScreenWrapper';
import UploadImageUI from '../../../components/UploadImageUI';
import CustomButton from '../../../components/CustomButton';
import UploadImage from '../../../components/UploadImage';
import CustomText from '../../../components/CustomText';
import SocialLink from '../../../components/SocialLink';
import Header from '../../../components/Header';

import CreateRoomModal from '../Home/molecules/CreateRoomModal';
import ProfileCard from './molecules/ProfileCard';

import {ToastMessage} from '../../../utils/ToastMessage';
import {COLORS} from '../../../utils/COLORS';
import fonts from '../../../assets/fonts';

const RoomSetting = ({navigation}) => {
  const [coverImage, setCoverImage] = useState('');
  const [isEditRoomModal, setEditRoomModal] = useState(false);
  return (
    <ScreenWrapper
      footerUnScrollable={() => (
        <View style={[styles.row, {padding: 20}]}>
          <CustomButton
            width="48%"
            title="Schedule event"
            backgroundColor="transparent"
            borderWidth={1}
            borderColor={COLORS.white}
            onPress={() => navigation.navigate('ScheduleEvent')}
          />
          <CustomButton
            width="48%"
            title="Go Live"
            onPress={() => navigation.navigate('GoLive')}
          />
        </View>
      )}
      headerUnScrollable={() => (
        <Header
          onChatPress={() => ToastMessage('Chat')}
          onSharePress={() => ToastMessage('Share')}
        />
      )}>
      <UploadImage
        handleChange={img => setCoverImage(img.path)}
        renderButton={onPress => (
          <UploadImageUI
            onPress={onPress}
            image={coverImage}
            marginTop={10}
            marginBottom={20}
          />
        )}
      />
      <ProfileCard />
      <CustomText
        marginTop={10}
        fontFamily={fonts.medium}
        marginBottom={20}
        label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud."
      />
      <SocialLink marginBottom={20} />
      <View style={styles.row}>
        <CustomButton
          width="48%"
          height={43}
          title="Chat"
          backgroundColor="transparent"
          borderWidth={2}
          borderColor={COLORS.white}
        />
        <CustomButton
          width="48%"
          height={43}
          title="Setting"
          onPress={() => setEditRoomModal(true)}
        />
      </View>

      <CreateRoomModal
        isEdit
        isVisible={isEditRoomModal}
        onDisable={() => setEditRoomModal(false)}
        onPress={() => {
          setEditRoomModal(false);
          ToastMessage('Room Setting Saved');
        }}
      />
    </ScreenWrapper>
  );
};

export default RoomSetting;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
