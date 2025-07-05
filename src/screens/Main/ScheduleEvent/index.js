import {StyleSheet} from 'react-native';
import {useState} from 'react';

import CustomDatePicker from '../../../components/CustomDatePicker';
import ScreenWrapper from '../../../components/ScreenWrapper';
import UploadImageUI from '../../../components/UploadImageUI';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import UploadImage from '../../../components/UploadImage';
import CustomText from '../../../components/CustomText';
import ImageFast from '../../../components/ImageFast';
import Header from '../../../components/Header';

import {Images} from '../../../assets/images';
import fonts from '../../../assets/fonts';

const ScheduleEvent = () => {
  const [thumbnail, setThumbnail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const array = [
    {
      withLabel: 'Date',
      value: date,
      setValue: setDate,
    },
    {
      withLabel: 'Time',
      value: time,
      setValue: setTime,
    },
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
      headerUnScrollable={() => <Header title="Schedule Event" />}>
      <ImageFast
        source={Images.schedule}
        style={styles.live}
        resizeMode="contain"
      />
      <CustomText
        label="Schedule Event"
        fontFamily={fonts.bold}
        fontSize={32}
        alignSelf="center"
      />

      {array.map((item, i) =>
        i == 0 || i == 1 ? (
          <CustomDatePicker
            withLabel={item.withLabel}
            key={i}
            value={item.value}
            setValue={item.setValue}
            placeholder="Select"
            type={i == 0 ? 'date' : 'time'}
          />
        ) : (
          <CustomInput
            key={i}
            placeholder="Enter"
            withLabel={item.withLabel}
            multiline={item.multiline}
            height={item.height}
          />
        ),
      )}
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
      <CustomButton title="Save" marginBottom={30} />
    </ScreenWrapper>
  );
};

export default ScheduleEvent;

const styles = StyleSheet.create({
  live: {
    width: 172,
    height: 104,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
});
