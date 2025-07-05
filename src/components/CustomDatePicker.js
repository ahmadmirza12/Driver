import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

import CustomText from "./CustomText";

import fonts from "../assets/fonts";
import { COLORS } from "../utils/COLORS";

const CustomDatePicker = ({
  value,
  setValue,
  error,
  withLabel,
  labelColor,
  placeholder = "Date",
  type = "date", // 'date' | 'time'
}) => {
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios"); // keep open on iOS
    if (selectedDate) {
      setValue(selectedDate);
    }
  };

  return (
    <View>
      {withLabel && (
        <CustomText
          label={withLabel}
          marginBottom={8}
          color={labelColor || COLORS.white}
          fontFamily={fonts.semiBold}
          fontSize={16}
        />
      )}

      <TouchableOpacity
        onPress={() => setShow(true)}
        style={[
          styles.mainContainer,
          {
            marginBottom: error ? 5 : 15,
            borderColor: error ? COLORS.red : "transparent",
          },
        ]}
      >
        <CustomText
          label={
            value
              ? moment(value).format(type === "date" ? "DD/MM/YYYY" : "h:mm A")
              : placeholder
          }
          color={value ? COLORS.white : "#9E9E9E"}
        />
      </TouchableOpacity>

      {error && (
        <CustomText
          label={error}
          color={COLORS.red}
          fontFamily={fonts.semiBold}
          fontSize={10}
          marginBottom={15}
        />
      )}

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode={type}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
          style={{ backgroundColor: COLORS.inputBg }}
        />
      )}
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 20,
    height: 56,
    width: "100%",
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    justifyContent: "center",
  },
});
