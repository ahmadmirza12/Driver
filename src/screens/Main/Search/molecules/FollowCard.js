import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useState} from 'react';

import CustomButton from '../../../../components/CustomButton';
import CustomText from '../../../../components/CustomText';
import UserLive from '../../../../components/UserLive';

import {PNGIcons} from '../../../../assets/images/icons';
import {COLORS} from '../../../../utils/COLORS';
import fonts from '../../../../assets/fonts';

const FollowCard = ({isFollow = false, onPress}) => {
  const [followState, setFollowState] = useState(isFollow);
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={styles.mainContainer}>
      <View style={styles.row}>
        <UserLive isLive />
        <View style={{marginTop: -15}}>
          <CustomText
            label="Soccer Match"
            fontFamily={fonts.bold}
            fontSize={20}
            marginBottom={8}
          />
          <CustomText label="265K Followers" fontFamily={fonts.semiBold} />
        </View>
      </View>
      <CustomButton
        title={followState ? 'Unfollow' : 'Follow'}
        width={110}
        height={38}
        borderRadius={8}
        icon={followState ? false : PNGIcons.user}
        backgroundColor={followState ? 'transparent' : COLORS.primaryColor}
        borderWidth={2}
        borderColor={followState ? COLORS.white : 'transparent'}
        onPress={() => setFollowState(!followState)}
      />
    </TouchableOpacity>
  );
};

export default FollowCard;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
