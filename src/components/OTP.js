import { StyleSheet, Text, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import fonts from '../assets/fonts';
import { COLORS } from '../utils/COLORS';

const CELL_COUNT = 4;

const OTPComponent = ({ value, setValue }) => {
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Code</Text>

      <View style={styles.container}>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              onLayout={getCellOnLayoutHandler(index)}
              style={styles.cellBox}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default OTPComponent;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 8,
  },
  container: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  codeFieldRoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cellBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 20,
    color: COLORS.black,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
});
