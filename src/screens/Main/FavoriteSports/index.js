import {StyleSheet, View} from 'react-native';
import {useState} from 'react';

import ScreenWrapper from '../../../components/ScreenWrapper';
import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';

import Item from './molecules/Item';

import {Images} from '../../../assets/images';
import {COLORS} from '../../../utils/COLORS';
import fonts from '../../../assets/fonts';

const FavoriteSports = ({navigation}) => {
  const [selected, setSelected] = useState('');
  const array = [
    {
      icon: Images.placeholderUser,
      title: 'Football',
    },
    {
      icon: Images.placeholderUser,
      title: 'Basketball',
    },
    {
      icon: Images.placeholderUser,
      title: 'Tennis',
    },
    {
      icon: Images.placeholderUser,
      title: 'Cricket',
    },
    {
      icon: Images.placeholderUser,
      title: 'Baseball',
    },
    {
      icon: Images.placeholderUser,
      title: 'Hockey',
    },
  ];
  return (
    <ScreenWrapper
      scrollEnabled
      footerUnScrollable={() => (
        <View style={styles.header}>
          <CustomButton title="Save" onPress={() => navigation.goBack()} />
        </View>
      )}
      headerUnScrollable={() => <Header title="Select Your Favorite Sports" />}>
      <CustomText
        label="Choose the sports you love. This helps us personalize your experience."
        marginBottom={20}
        marginTop={10}
        fontFamily={fonts.medium}
        fontSize={18}
      />
      <View style={styles.row}>
        {array.map((item, i) => (
          <Item
            key={i}
            title={item.title}
            icon={item.icon}
            selected={item.title == selected}
            onPress={() => setSelected(item.title)}
          />
        ))}
      </View>
    </ScreenWrapper>
  );
};

export default FavoriteSports;

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: COLORS.bg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});
