import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Chats() {
  const navigation = useNavigation();

  const [messages, setMessages] = useState([
    { id: '1', text: 'Hey there!', sender: 'other' },
    { id: '2', text: 'Hi! How can I help you?', sender: 'me' },
    { id: '3', text: 'I have a question about my ride.', sender: 'other' },
    { id: '4', text: 'Sure, go ahead!', sender: 'me' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      text: input,
      sender: 'me',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  const renderItem = ({ item }) => {
    const isMe = item.sender === 'me';
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="white" />
          </TouchableOpacity>
          <Image
            source={require('../../../assets/images/Roger.png')} 
            style={styles.avatar}
          />
          <Text style={styles.userName}>John Doe</Text>
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          style={styles.textInput}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    width: '100%',
    height: 114,
    backgroundColor: '#1F5546',
    paddingTop: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 90, 
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10, 
  },
  chatList: {
    padding: 12,
    flexGrow: 1,
  },
  messageContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: '75%',
  },
  myMessage: {
    backgroundColor: '#DCF8C5',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: '#000',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    bottom:20
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#1F5546',
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
});
