import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { get } from '../../../services/ApiRequest';
import { useNavigation } from '@react-navigation/native';
export default function ChatList() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (dateString) => {
    if (!dateString) return 'No time';
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getmessages = async () => {
    try {
      const response = await get("chat/chats");
      setMessages(response.data?.data?.chats || []);
    } catch (error) {
      console.log(error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getmessages();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#1F5546" barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Message</Text>
          <AntDesign name="left" size={20} color="transparent" />
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading messages...</Text>
        </View>
      </View>
    );
  }

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
      {(messages || []).map((chat) => {
        const other = chat.otherParticipants?.[0];
      
        return (
          <View key={chat._id} style={styles.chatContainer}>
            <TouchableOpacity
              style={styles.chatCard}
              onPress={() => navigation.navigate('Chats', { userId: other._id, userName: other.name })}
            >
              <Image
                source={require('../../../assets/images/Roger.png')}
                style={styles.image}
              />
              <View style={styles.chatContent}>
                <View style={styles.chatTopRow}>
                  <Text style={styles.name}>{other.name}</Text>
                  <Text style={styles.time}>{formatTime(chat.lastMessageTime)}</Text>
                </View>
                <Text style={styles.message}>
                  {typeof chat.lastMessage === 'string' 
                    ? chat.lastMessage 
                    : chat.lastMessage?.content || chat.lastMessage?.text || 'No messages yet'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
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
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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