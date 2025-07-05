import { useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { PNGIcons } from '../../../assets/images/icons';
import UploadImage from '../../../components/UploadImage';

const Account = ({ navigation }) => {
  const [isModal, setModal] = useState(false);
  const [isLogout, setLogout] = useState(false);

  const array = [
    {
      icon: PNGIcons.Edit,
      title: 'Edit Profile',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: PNGIcons.Earning,
      title: 'Earnings',
      onPress: () => navigation.navigate('Earning'),
    },
    {
      icon: PNGIcons.Payment,
      title: 'Payment Method',
      onPress: () => navigation.navigate('PaymentMethod'),
    },
    {
      icon: PNGIcons.Help,
      title: 'Help & Support',
      onPress: () => navigation.navigate('HelpSupport'),
    },
        {
      icon: PNGIcons.Setting,
      title: 'App Setting',
      onPress: () => navigation.navigate('AppSetting'),
    },
    {
      icon: PNGIcons.Payment,
      title: 'Privacy Policy',
      onPress: () => navigation.navigate('Privacy'),
    },
    {
      icon: PNGIcons.IconLogout,
      title: 'Logout',
      onPress: () => {
        setLogout(true);
        setModal(true);
      },
      hideArrow: true,
    },

  ];

  return (
    <View style={{flex:1,backgroundColor:'#E8F6F2'}}>
      <StatusBar
        backgroundColor="#1F5546"
        barStyle="light-content"
        translucent={false}
      />

      <View style={styles.header}>
        <TouchableOpacity>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.EarningText}>Account</Text>
        <AntDesign name="left" size={20} color="transparent" />
      </View>
<ScrollView>
      <UploadImage/>

      <View style={styles.Name}>
        <Text style={styles.UserNameText}>Madison Smith</Text>
        <Text style={styles.EmailText}>madisons@example.com</Text>
      </View>

      <View style={styles.Card}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Total Jobs</Text>
        </View>

        <View style={[styles.statBox, styles.middleBox]}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Completed Jobs</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Pending Jobs</Text>
        </View>
      </View>
    <View style={{paddingHorizontal:20}}>
      <Text style={{fontSize:13,fontWeight:"500",bottom:10}}>Account Settings</Text>
    </View>
      {array.map((item, i) => (
        <TouchableOpacity key={i} onPress={item.onPress} style={styles.listItem}>
          <View style={styles.itemLeft}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.itemText}>{item.title}</Text>
          </View>
          {!item.hideArrow && (
            <AntDesign name="right" size={18} color="#ccc" />
          )}
        </TouchableOpacity>
      ))}
      </ScrollView>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
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
  EarningText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  Name: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  UserNameText: {
    fontSize: 20,
    fontWeight: '500',
  },
  EmailText: {
    fontSize: 13,
    color: 'gray',
  },
  Card: {
    flexDirection: 'row',
    backgroundColor: '#1F5546',
    borderRadius: 10,
    overflow: 'hidden',
    margin: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  middleBox: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#296957',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  statLabel: {
    fontSize: 10,
    color: '#D6D6D6',
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 15,
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: 15,
    color: '#333',
  },
});
