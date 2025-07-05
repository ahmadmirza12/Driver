import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomText from '../../../components/CustomText';

export default function Privacy() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#1F5546"
        barStyle="light-content"
        translucent={false}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Privacy Policy</Text>
        <AntDesign name="left" size={20} color="transparent" />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <CustomText
          label="1. Types of Data We Collect"
          fontSize={18}
          fontWeight="500"
        />
        <CustomText
          label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          fontSize={13}
          fontWeight="400"
          marginTop={10}
          lineHeight={20}
          color="#BDBDBD"
        />

        <CustomText
          label="2. Use of Your Personal Data"
          fontSize={18}
          fontWeight="500"
          marginTop={15}
        />
        <CustomText
          label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          fontSize={13}
          fontWeight="400"
          marginTop={10}
          lineHeight={20}
          color="#BDBDBD"
        />

        <CustomText
          label="3. Disclosure"
          fontSize={18}
          fontWeight="500"
          marginTop={15}
        />
        <CustomText
          label="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          fontSize={13}
          fontWeight="400"
          marginTop={10}
          lineHeight={20}
          color="#BDBDBD"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F6F2',
  },
  header: {
    backgroundColor: '#1F5546',
    height: 114,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 20,
  },
});
