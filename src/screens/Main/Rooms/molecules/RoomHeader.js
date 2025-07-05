import {StyleSheet, View} from 'react-native';

import CustomButton from '../../../../components/CustomButton';
import CustomText from '../../../../components/CustomText';

import {COLORS} from '../../../../utils/COLORS';
import fonts from '../../../../assets/fonts';

const RoomHeader = () => {
  return (
    <View style={styles.mainContainer}>
      <CustomText label="Rooms" fontSize={24} fontFamily={fonts.bold} />
      <CustomButton
        title="Create Room"
        width="35%"
        height={38}
        color={COLORS.black}
        backgroundColor={COLORS.white}
      />
    </View>
  );
};

export default RoomHeader;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
});
