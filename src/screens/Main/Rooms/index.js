import { AntDesign } from '@expo/vector-icons';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ChatList({ navigation }) {
  const chats = [
    { id: 1, name: 'Roger Jeson', message: 'Please pick me fast', time: '1 min ago' },
    { id: 2, name: 'Wade Warren', message: 'thank you', time: '1 hour ago' },
    { id: 3, name: 'Jenny Wilson', message: 'great ride', time: '59 min ago' },
    { id: 4, name: 'Aelene McCoy', message: 'can you send me your num', time: '1 hour ago' },
    { id: 5, name: 'Eleanor Pena', message: 'Following you', time: '1 hour ago' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1F5546" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Message</Text>
        <AntDesign name="left" size={20} color="transparent" />
      </View>

      {/* Chat List */}
      {chats.map((chat) => (
        <View key={chat.id} style={styles.chatContainer}>
          <TouchableOpacity
            style={styles.chatCard}
            onPress={() => navigation.navigate('Chats', { user: chat.name })}
          >
            <Image
              source={require('../../../assets/images/Roger.png')}
              style={styles.image}
            />
            <View style={styles.chatContent}>
              <View style={styles.chatTopRow}>
                <Text style={styles.name}>{chat.name}</Text>
                <Text style={styles.time}>{chat.time}</Text>
              </View>
              <Text style={styles.message}>{chat.message}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
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
    height: 70,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  chatContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  chatCard: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderColor: '#E5E9EB',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  chatContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  time: {
    fontSize: 12,
    fontWeight: '400',
    color: '#84919A',
  },
  message: {
    fontSize: 12,
    fontWeight: '400',
    color: '#84919A',
    marginTop: 2,
  },
});
