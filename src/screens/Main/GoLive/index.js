import { useState } from 'react';
import { StyleSheet } from 'react-native';

import CustomInput from '../../../components/CustomInput';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';
import ImageFast from '../../../components/ImageFast';
import ScreenWrapper from '../../../components/ScreenWrapper';
import UploadImage from '../../../components/UploadImage';
import UploadImageUI from '../../../components/UploadImageUI';

import fonts from '../../../assets/fonts';
import { Images } from '../../../assets/images';
import CustomButton from '../../../components/CustomButton';

const GoLive = () => {
  const [thumbnail, setThumbnail] = useState('');
  const array = [
    {
      withLabel: 'Title',
    },
    {
      withLabel: 'Description',
      multiline: true,
      height: 133,
    },
    {
      withLabel: 'Sport',
    },
    {
      withLabel: 'Team 1',
    },
    {
      withLabel: 'Team 2',
    },
  ];
  return (
    <ScreenWrapper
      scrollEnabled
      headerUnScrollable={() => <Header title="Go Lfyguiive" />}>
      <ImageFast
        source={Images.live}
        style={styles.live}
        resizeMode="contain"
      />
      <CustomText
        label="Go Live Now!"
        fontFamily={fonts.bold}
        fontSize={32}
        alignSelf="center"
      />

      {array.map((item, i) => (
        <CustomInput
          key={i}
          placeholder="Enter"
          withLabel={item.withLabel}
          multiline={item.multiline}
          height={item.height}
        />
      ))}
      <CustomText
        label="Thumbnail"
        marginBottom={8}
        fontFamily={fonts.semiBold}
        fontSize={16}
      />
      <UploadImage
        handleChange={img => setThumbnail(img.path)}
        renderButton={onPress => (
          <UploadImageUI
            onPress={onPress}
            image={thumbnail}
            marginTop={10}
            marginBottom={20}
          />
        )}
      />
      <CustomButton title="Go Live" marginBottom={30} />
    </ScreenWrapper>
  );
};

export default GoLive;

const styles = StyleSheet.create({
  live: {
    width: 172,
    height: 104,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
});
