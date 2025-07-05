import { StyleSheet, View } from 'react-native';

import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';
import ImageFast from '../../../components/ImageFast';
import ScreenWrapper from '../../../components/ScreenWrapper';
import SocialLink from '../../../components/SocialLink';

import Card from '../Home/molecules/Card';

import fonts from '../../../assets/fonts';
import { Images } from '../../../assets/images';
import { COLORS } from '../../../utils/COLORS';
import { ToastMessage } from '../../../utils/ToastMessage';
import VideoCard from '../Search/molecules/VideoCard';

const RoomDetail = ({route}) => {
  const isVideo = route.params?.isVideo;
  return (
    <ScreenWrapper
      scrollEnabled
      headerUnScrollable={() => (
        <Header onSharePress={() => ToastMessage('Share')} />
      )}>
      <ImageFast source={Images.placeholderImage} style={styles.image} />
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
        <CustomButton width="48%" height={43} title="Joined" />
      </View>
      <CustomText
        label="Replays"
        fontFamily={fonts.bold}
        fontSize={19}
        marginTop={10}
        marginBottom={20}
      />
      <Card
        hideJoin
        width="100%"
        marginBottom={15}
        marginRight={0}
        hideButton={isVideo}
      />
      {isVideo
        ? [0, 1, 3, 4, 5, 6].map(item => <VideoCard key={item} />)
        : null}
    </ScreenWrapper>
  );
};

export default RoomDetail;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 127,
    borderRadius: 12,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
