import {StyleSheet, View} from 'react-native';
import {useState} from 'react';

import ScreenWrapper from '../../../components/ScreenWrapper';
import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';

import Item from './molecules/Item';

import {COLORS} from '../../../utils/COLORS';
import fonts from '../../../assets/fonts';

const FavoriteLeagues = ({navigation, route}) => {
  const isTeam = route.params?.isTeam;
  const [selected, setSelected] = useState([]);
  const leagues = [
    'Premier League',
    'The League',
    'NFL',
    'IPL',
    'UFC',
    'Champions League',
    'Architecture',
    'Major League Soccer',
    'Bundesliga',
    'Writing',
    'UEFA Champions League',
    'PSL',
    'IPP',
    'EuroLeague',
  ];
  const teams = [
    'Manchester United',
    'Miami Heat',
    'New England Patriots',
    'Liverpool',
    'Mumbai Indians',
    'Real Madrid',
    'Los Angeles Lakers',
    'Juventus',
    'New York Knights',
    'Red Devils FC',
    'Golden Eagles',
    'Chicago Hawks',
    'Los Angeles Stars',
    'Blue Lions',
    'Silver Wolves',
    'Miami Sharks',
    'Dallas Rangers',
    'Green Falcons',
  ];

  const array = isTeam ? teams : leagues;

  return (
    <ScreenWrapper
      scrollEnabled
      footerUnScrollable={() => (
        <View style={styles.header}>
          <CustomButton title="Save" onPress={() => navigation.goBack()} />
        </View>
      )}
      headerUnScrollable={() => (
        <Header
          title={`Choose Your Favorite ${isTeam ? 'Teams' : 'Leagues'}`}
        />
      )}>
      <CustomText
        label={
          isTeam
            ? 'Pick the teams you support. You can always update this later.'
            : 'Pick the leagues you follow. We’ll prioritize content from these.'
        }
        marginBottom={20}
        marginTop={10}
        fontFamily={fonts.medium}
        fontSize={18}
      />
      <View style={styles.row}>
        {array.map((item, i) => {
          const isSelected = selected.includes(item);
          return (
            <Item
              key={i}
              title={item}
              selected={isSelected}
              onPress={() => {
                if (isSelected) {
                  setSelected(prev => prev.filter(val => val !== item));
                } else {
                  setSelected(prev => [...prev, item]);
                }
              }}
            />
          );
        })}
      </View>
    </ScreenWrapper>
  );
};

export default FavoriteLeagues;

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: COLORS.bg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
});
