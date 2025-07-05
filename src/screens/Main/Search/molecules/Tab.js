import {useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  View,
} from 'react-native';

import CustomText from '../../../../components/CustomText';
import {COLORS} from '../../../../utils/COLORS';
import fonts from '../../../../assets/fonts';

const {width} = Dimensions.get('window');
const tabWidth = width / 2 - 18;

const Tab = ({tab, setTab, array, marginTop}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const toValue = tab === 'Room' || tab === 'FAQ' ? 0 : tabWidth;
    Animated.timing(translateX, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [tab]);

  return (
    <View style={[styles.mainContainer, {marginTop}]}>
      {(array?.length ? array : ['Room', 'Videos']).map(item => (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setTab(item)}
          key={item}
          style={styles.item}>
          <CustomText
            label={item}
            fontSize={18}
            fontFamily={fonts.semiBold}
            color={item === tab ? COLORS.white : '#616161'}
          />
        </TouchableOpacity>
      ))}

      <Animated.View
        style={[
          styles.border,
          {
            transform: [{translateX}],
          },
        ]}
      />
    </View>
  );
};

export default Tab;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.darkGray,
    paddingBottom: 15,
    position: 'relative',
  },
  item: {
    width: '50%',
    alignItems: 'center',
  },
  border: {
    width: '50%',
    height: 4,
    backgroundColor: COLORS.white,
    position: 'absolute',
    bottom: -3,
    borderRadius: 100,
  },
});
