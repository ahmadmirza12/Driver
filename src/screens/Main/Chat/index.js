import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useRef } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  Alert,
} from "react-native";
import { get } from '../../../services/ApiRequest';
import { useSocket } from '../../../components/SocketProvider';
import { useSelector } from 'react-redux';

export default function Chats({ route, navigation }) {
  const { userId, userName } = route.params || {};
  const auth = useSelector(state => state.data);
  const currentUserId = auth.user?.id;
  
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);
  const socket = useSocket();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) {
        console.log('⚠️ No userId provided');
        setLoading(false);
        return;
      }
      try {
        console.log('📡 Fetching messages for user:', userId);
        const response = await get(`chat/chats/${userId}`);
        // console.log('📦 Full API Response:', JSON.stringify(response.data, null, 2));
        
        const chatData = response.data?.data?.chat;
        const messagesData = response.data?.data?.messages || [];

        if (chatData) {
          const fetchedChatId = chatData._id;
          setChatId(fetchedChatId);
          console.log('💬 Chat ID:', fetchedChatId);
          
          // Normalize messages using the same structure
          const normalized = messagesData.map((msg) => {
            const senderId = msg.senderId?._id || msg.senderId;
            
            return {
              id: msg._id || msg.id,
              senderId: senderId,
              content: msg.formattedContent || msg.content,
              createdAt: msg.createdAt,
              status: msg.status || 'sent',
            };
          });
          
          console.log(`✅ Total messages loaded: ${normalized.length}`);
          setMessages(normalized);
        }
      } catch (error) {
        console.error('❌ Error fetching messages:', error);
        console.error('Error details:', error.response?.data || error.message);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  useEffect(() => {
    if (!socket) {
      console.log('⚠️ Socket not available');
      return;
    }

    console.log('🔌 Socket status:', socket.connected ? 'Connected' : 'Disconnected');
    console.log('🔌 Socket ID:', socket.id);
    console.log('🔌 Current User ID:', currentUserId);
    console.log('🔌 Chat User ID:', userId);

    const handleConnect = () => {
      console.log('✅ Socket connected successfully');
      console.log('🔌 Socket ID on connect:', socket.id);
      if (currentUserId) {
        console.log('🚪 Joining user room:', currentUserId);
        socket.emit('join', { userId: currentUserId }, (response) => {
          console.log('Join room response:', response);
        });
      }
    };

    const handleDisconnect = (reason) => {
      console.log('🔌 Socket disconnected. Reason:', reason);
    };

    const handleNewMessage = (message) => {
      console.log('🚨 handleNewMessage triggered with:', JSON.stringify(message, null, 2));
      
      const senderId = message.senderId?._id || message.senderId || message.sender || message.from;
      
      // Check if message is for this chat
      if (senderId !== currentUserId && senderId !== userId) {
        console.log('❌ Ignoring message not for this chat. Sender:', senderId, 'Expected:', userId + ' or ' + currentUserId);
        return;
      }

      const normalizedMessage = {
        id: message._id || message.id || Date.now().toString(),
        senderId: senderId,
        content: message.formattedContent || message.content || message.text,
        createdAt: message.createdAt || message.timestamp || new Date().toISOString(),
        status: senderId === currentUserId ? 'sent' : 'received',
      };

      setMessages((prev) => {
        // Check for duplicate optimistic message
        const existingIndex = prev.findIndex(
          (msg) =>
            msg.status === 'sending' &&
            msg.senderId === currentUserId &&
            msg.content === normalizedMessage.content &&
            Math.abs(new Date(msg.createdAt).getTime() - new Date(normalizedMessage.createdAt).getTime()) < 3000
        );

        if (existingIndex !== -1) {
          console.log('🔄 Updating optimistic message with server confirmation. Found at index:', existingIndex);
          const updated = [...prev];
          updated[existingIndex] = normalizedMessage;
          return updated;
        }

        // Check if message already exists by ID
        const isDuplicate = prev.some(msg => msg.id === normalizedMessage.id);
        if (isDuplicate) {
          console.log('❌ Ignoring duplicate message ID:', normalizedMessage.id);
          return prev;
        }
 
        console.log('➕ Adding new message to chat');
        return [...prev, normalizedMessage];
      });

      // Scroll to bottom after receiving a new message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    // Add error handler
    const handleError = (error) => {
      console.error('❌ Socket error:', error);
    };

    // Add catch-all listener for debugging
    const handleAny = (eventName, ...args) => {
      console.log(`📡 [${eventName}]`, args);
    };

    // Attach listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleError);
    socket.on('error', handleError);
    socket.onAny(handleAny);
    
    // Message handler - check both 'new_message' and 'message' events
    socket.on('new_message', handleNewMessage);
    socket.on('message', handleNewMessage); // Some servers might use 'message' instead

    // Join chat room if we have a chatId
    if (chatId) {
      console.log('🚪 Joining chat room:', chatId);
      socket.emit('joinChat', { chatId });
    }

    // Check if already connected
    if (socket.connected) {
      console.log('🔌 Socket already connected, initializing...');
      handleConnect();
    }

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up socket listeners');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Remove all listeners to prevent memory leaks
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleError);
      socket.off('error', handleError);
      socket.off('new_message', handleNewMessage);
      socket.off('message', handleNewMessage);
      socket.offAny(handleAny);
      
      // Leave chat room if we have a chatId
      if (chatId) {
        console.log('🚪 Leaving chat room:', chatId);
        socket.emit('leaveChat', { chatId });
      }
    };
  }, [socket, currentUserId, chatId, userId]);

  const sendMessage = () => {
    if (!input.trim()) {
      console.log('⚠️ Cannot send empty message');
      return;
    }
    
    if (!socket || !socket.connected) {
      console.log('❌ Socket not connected, cannot send message');
      Alert.alert("Connection Error", "Not connected to server. Please check your connection.");
      return;
    }
    
    if (!userId) {
      console.log('❌ Missing userId, cannot send message');
      Alert.alert("Error", "Invalid recipient");
      return;
    }

    const messageContent = input.trim();
    const tempId = `temp_${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    const newMsg = {
      id: tempId,
      senderId: currentUserId,
      content: messageContent,
      createdAt: timestamp,
      status: 'sending',
    };

    console.log('📤 Sending message:', {
      to: userId,
      from: currentUserId,
      content: messageContent,
    });

    // Optimistically update local state
    setMessages((prev) => [...prev, newMsg]);
    console.log('✅ Message added to local state (optimistic)');

    // Clear input immediately
    setInput("");

    const socketPayload = {
      otherUserId: userId,
      content: messageContent,
      messageType: 'text',
    };
    
    console.log('🔌 Emitting to socket:', JSON.stringify(socketPayload, null, 2));
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for message acknowledgment
    timeoutRef.current = setTimeout(() => {
      setMessages(prev => prev.map(msg => {
        if (msg.id === tempId && msg.status !== 'sent' && msg.status !== 'delivered') {
          console.log('⏱️ No acknowledgment received within 5 seconds, marking as sent');
          return { ...msg, status: 'sent' };
        }
        return msg;
      }));
    }, 5000);
    
    // Emit with acknowledgment callback
    socket.emit('send_message', socketPayload, (acknowledgment) => {
      // Clear the timeout since we got an acknowledgment
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      console.log('📬 Message acknowledgment:', JSON.stringify(acknowledgment, null, 2));
      
      // If new chat created, update chatId
      const newChatId = acknowledgment?.chatId || acknowledgment?.chat?._id || acknowledgment?.chat || null;
      if (newChatId && !chatId) {
        setChatId(newChatId);
        console.log('💬 New chat ID set from acknowledgment:', newChatId);
      }
      
      if (acknowledgment?.success || acknowledgment?.message || acknowledgment?._id) {
        // Update message status to sent
        const serverId = acknowledgment.messageId || acknowledgment._id || acknowledgment.message?._id;
        const serverTimestamp = acknowledgment.createdAt || acknowledgment.message?.createdAt || acknowledgment.timestamp || new Date().toISOString();
        
        setMessages(prev => prev.map(msg => {
          if (msg.id === tempId || msg._id === serverId) {
            console.log(`✅ Updating message status to sent: ${serverId}`);
            return { 
              ...msg, 
              status: 'sent', 
              id: serverId || msg.id,
              _id: serverId || msg._id,
              createdAt: serverTimestamp,
              updatedAt: serverTimestamp
            };
          }
          return msg;
        }));
        console.log('✅ Message sent successfully');
      } else if (acknowledgment?.error || acknowledgment?.success === false) {
        // Mark message as failed
        console.log('❌ Message failed:', acknowledgment?.error || acknowledgment?.message);
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? { ...msg, status: 'failed' } : msg
        ));
        
        Alert.alert("Message Failed", acknowledgment?.error || acknowledgment?.message || "Failed to send message. Please try again.");
      } else {
        // No clear success/failure, assume sent
        console.log('⚠️ Ambiguous acknowledgment, assuming success');
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? { ...msg, status: 'sent' } : msg
        ));
      }
    });

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderItem = ({ item }) => {
    // Determine if message is from current user based on senderId
    // Messages from userId (the other person) go LEFT
    // Messages from currentUserId (me) go RIGHT
    const isMe = item.senderId !== userId;
    
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={[
          styles.messageText,
          isMe ? styles.myMessageText : styles.otherMessageText
        ]}>
          {item.content}
        </Text>
        <View style={styles.metaRow}>
          {item.createdAt && (
            <Text style={[
              styles.timestamp,
              isMe && styles.timestampMe
            ]}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
          {isMe && item.status && (
            <Text style={styles.statusIndicator}>
              {item.status === 'sending' && '🕐'}
              {item.status === 'sent' && '✓'}
              {item.status === 'delivered' && '✓✓'}
              {item.status === 'read' && '✓✓'}
              {item.status === 'failed' && '❌'}
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#1F5546" barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.backRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="left" size={20} color="white" />
            </TouchableOpacity>
            <Image
              source={require("../../../assets/images/Roger.png")}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{userName || 'Unknown'}</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading chat...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1F5546" barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="white" />
          </TouchableOpacity>
          <Image
            source={require("../../../assets/images/Roger.png")}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{userName || 'Unknown'}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id || item._id || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation! 💬</Text>
          </View>
        }
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
        }}
      />

      <View style={styles.inputBar}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          style={styles.textInput}
          onSubmitEditing={sendMessage}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity 
          onPress={sendMessage} 
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          disabled={!input.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  header: {
    width: "100%",
    height: 80,
    backgroundColor: "#1F5546",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 90,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    maxWidth: "75%",
  },
  myMessage: {
    backgroundColor: "#1F5546",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
  },
  myMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#000",
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
    color: "#666",
  },
  timestampMe: {
    color: "#d0d0d0",
  },
  statusIndicator: {
    fontSize: 10,
    marginLeft: 4,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#1F5546",
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});