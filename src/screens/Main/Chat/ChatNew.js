import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useRef, useCallback } from "react";
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
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { get } from '../../../services/ApiRequest';
import { useSocket } from '../../../components/SocketProvider';
import { useSelector } from 'react-redux';

export default function Chat({ route, navigation }) {
  const { userId, userName } = route.params || {};
  const auth = useSelector(state => state.data);
  const currentUserId = auth.user?.id;
  
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef(null);
  const { socket, isConnected } = useSocket();
  const timeoutRef = useRef({});
  const retryAttempts = useRef({});

  // Fetch messages when component mounts or userId changes
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
        const chatData = response.data?.data?.chat;
        const messagesData = response.data?.data?.messages || [];

        if (chatData) {
          const fetchedChatId = chatData._id;
          setChatId(fetchedChatId);
          console.log('💬 Chat ID:', fetchedChatId);
          
          const normalized = messagesData.map((msg) => ({
            id: msg._id || msg.id,
            senderId: msg.senderId?._id || msg.senderId,
            content: msg.formattedContent || msg.content,
            createdAt: msg.createdAt,
            status: msg.status || 'sent',
          }));
          
          console.log(`✅ Total messages loaded: ${normalized.length}`);
          setMessages(normalized);
        }
      } catch (error) {
        console.error('❌ Error fetching messages:', error);
        Alert.alert("Error", "Failed to load messages");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      console.log('🚨 New message received:', message);
      
      const senderId = message.senderId?._id || message.senderId || message.from;
      
      // Check if message is for this chat
      if (senderId !== userId && senderId !== currentUserId) {
        console.log('❌ Ignoring message not for this chat');
        return;
      }

      const normalizedMessage = {
        id: message._id || message.id || `msg_${Date.now()}`,
        senderId,
        content: message.formattedContent || message.content || message.text,
        createdAt: message.createdAt || message.timestamp || new Date().toISOString(),
        status: senderId === currentUserId ? 'sent' : 'received',
      };

      setMessages(prev => {
        // Check for duplicate message
        const isDuplicate = prev.some(msg => 
          msg.id === normalizedMessage.id || 
          (msg.content === normalizedMessage.content && 
           Math.abs(new Date(msg.createdAt) - new Date(normalizedMessage.createdAt)) < 1000)
        );
        
        if (isDuplicate) {
          console.log('🔄 Ignoring duplicate message');
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

    // Join chat room if we have a chatId
    if (chatId) {
      console.log('🚪 Joining chat room:', chatId);
      socket.emit('joinChat', { chatId });
    }

    // Set up event listeners
    socket.on('new_message', handleNewMessage);
    socket.on('message', handleNewMessage); // Fallback event name

    // Clean up
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message', handleNewMessage);
      
      if (chatId) {
        console.log('🚪 Leaving chat room:', chatId);
        socket.emit('leaveChat', { chatId });
      }
    };
  }, [socket, chatId, currentUserId, userId]);

  // Send message function with retry logic
  const sendMessage = useCallback(async () => {
    if (!input.trim()) {
      console.log('⚠️ Cannot send empty message');
      return;
    }
    
    if (!socket || !isConnected) {
      console.log('❌ Socket not connected, cannot send message');
      Alert.alert("Connection Error", "Not connected to server. Please check your connection and try again.");
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
      tempId,
    };

    console.log('📤 Sending message:', {
      to: userId,
      from: currentUserId,
      content: messageContent,
      tempId,
    });

    // Optimistically update local state
    setMessages(prev => [...prev, newMsg]);
    setInput(""); // Clear input immediately
    setIsSending(true);

    // Clear any existing timeout for this message
    if (timeoutRef.current?.[tempId]) {
      clearTimeout(timeoutRef.current[tempId]);
    }

    // Set timeout for message acknowledgment (5 seconds)
    timeoutRef.current = {
      ...timeoutRef.current,
      [tempId]: setTimeout(() => {
        setMessages(prev => prev.map(msg => {
          if (msg.id === tempId && msg.status === 'sending') {
            console.log('⏱️ No acknowledgment received within 5 seconds for message:', tempId);
            return { ...msg, status: 'failed', error: 'No response from server' };
          }
          return msg;
        }));
      }, 5000)
    };

    try {
      await new Promise((resolve, reject) => {
        const socketPayload = {
          otherUserId: userId,
          content: messageContent,
          messageType: 'text',
          tempId,
        };
        
        console.log('🔌 Emitting to socket:', JSON.stringify(socketPayload, null, 2));
        
        socket.emit('send_message', socketPayload, (acknowledgment) => {
          // Clear the timeout since we got an acknowledgment
          if (timeoutRef.current?.[tempId]) {
            clearTimeout(timeoutRef.current[tempId]);
            delete timeoutRef.current[tempId];
          }
          
          console.log('📬 Message acknowledgment:', JSON.stringify(acknowledgment, null, 2));
          
          if (!acknowledgment) {
            console.error('❌ Empty acknowledgment received');
            throw new Error('No acknowledgment received from server');
          }
          
          // If new chat created, update chatId
          const newChatId = acknowledgment?.chatId || acknowledgment?.chat?._id || acknowledgment?.chat || null;
          if (newChatId && !chatId) {
            setChatId(newChatId);
            console.log('💬 New chat ID set from acknowledgment:', newChatId);
          }
          
          if (acknowledgment.success || acknowledgment.message || acknowledgment._id) {
            // Update message status to sent
            const serverId = acknowledgment.messageId || acknowledgment._id || acknowledgment.message?._id || tempId;
            const serverTimestamp = acknowledgment.createdAt || acknowledgment.message?.createdAt || acknowledgment.timestamp || timestamp;
            
            setMessages(prev => prev.map(msg => {
              if (msg.id === tempId || msg.tempId === tempId) {
                console.log(`✅ Updating message status to sent: ${serverId}`);
                return { 
                  ...msg, 
                  id: serverId,
                  status: 'sent',
                  _id: serverId,
                  tempId: undefined, // Remove tempId once we have a server ID
                  createdAt: serverTimestamp,
                  updatedAt: serverTimestamp
                };
              }
              return msg;
            }));
            
            resolve();
          } else {
            const errorMessage = acknowledgment.error || acknowledgment.message || 'Failed to send message';
            console.error('❌ Message failed:', errorMessage);
            throw new Error(errorMessage);
          }
        });
      });
    } catch (error) {
      console.error('❌ Error sending message:', error.message);
      
      setMessages(prev => prev.map(msg => 
        msg.id === tempId || msg.tempId === tempId
          ? { 
              ...msg, 
              status: 'failed', 
              error: error.message || 'Failed to send message' 
            }
          : msg
      ));
      
      // Don't show alert for timeouts as we're showing it in the UI
      if (!error.message.includes('timeout') && !error.message.includes('No acknowledgment')) {
        Alert.alert("Error", `Failed to send message: ${error.message}`);
      }
    } finally {
      setIsSending(false);
      
      // Scroll to bottom after state updates
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [socket, isConnected, userId, currentUserId, input, chatId]);
  
  // Retry sending a failed message
  const retryMessage = useCallback((message) => {
    if (!message) return;
    
    // Increment retry attempt count
    const attempt = (retryAttempts.current[message.tempId] || 0) + 1;
    retryAttempts.current[message.tempId] = attempt;
    
    if (attempt > 3) {
      Alert.alert("Error", "Maximum retry attempts reached. Please try again later.");
      return;
    }
    
    console.log(`🔄 Retrying message (attempt ${attempt}):`, message.tempId);
    
    // Update message status to 'sending' again
    setMessages(prev => prev.map(msg => 
      msg.id === message.id || msg.tempId === message.tempId
        ? { 
            ...msg, 
            status: 'sending', 
            error: undefined,
            updatedAt: new Date().toISOString()
          }
        : msg
    ));
    
    // Set the input and trigger send
    setInput(message.content);
    
    // Small delay to ensure state updates before sending
    setTimeout(() => {
      sendMessage();
    }, 100);
  }, [sendMessage]);

  // Render message status icon
  const renderMessageStatus = (status) => {
    switch (status) {
      case 'sending':
        return <ActivityIndicator size="small" color="#999" style={styles.statusIcon} />;
      case 'sent':
        return <Ionicons name="checkmark-done" size={16} color="#4CAF50" style={styles.statusIcon} />;
      case 'delivered':
        return <Ionicons name="checkmark-done" size={16} color="#2196F3" style={styles.statusIcon} />;
      case 'read':
        return <Ionicons name="checkmark-done" size={16} color="#2196F3" style={styles.statusIcon} />;
      case 'failed':
        return <Ionicons name="alert-circle" size={16} color="#F44336" style={styles.statusIcon} />;
      default:
        return null;
    }
  };

  // Render a single message item
  const renderItem = ({ item }) => {
    const isMe = item.senderId === currentUserId;
    const isFailed = item.status === 'failed';
    
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
          isFailed && styles.failedMessage,
        ]}
      >
        <View style={styles.messageContent}>
          <Text style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.otherMessageText,
            isFailed && styles.failedMessageText,
          ]}>
            {item.content}
          </Text>
          
          {isFailed && (
            <TouchableOpacity 
              onPress={() => retryMessage(item)}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.metaRow}>
          {item.createdAt && (
            <Text style={[
              styles.timestamp,
              isMe && styles.timestampMe
            ]}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
          {isMe && renderMessageStatus(item.status)}
        </View>
      </View>
    );
  };

  // Render the header with user info and connection status
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userName || 'Chat'}</Text>
        <View style={styles.statusContainer}>
          <View 
            style={[
              styles.statusDot, 
              isConnected ? styles.statusOnline : styles.statusOffline
            ]} 
          />
          <Text style={styles.statusText}>
            {isConnected ? 'Online' : 'Connecting...'}
          </Text>
        </View>
      </View>
      
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="call-outline" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="videocam-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render the message input area
  const renderInput = () => (
    <View style={styles.inputContainer}>
      <TouchableOpacity style={styles.attachmentButton}>
        <Ionicons name="attach-outline" size={24} color="#000" />
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={input}
        onChangeText={setInput}
        onSubmitEditing={sendMessage}
        placeholderTextColor="#999"
        multiline
        editable={isConnected && !isSending}
      />
      
      {isSending ? (
        <View style={styles.sendButton}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      ) : (
        <TouchableOpacity 
          style={[styles.sendButton, (!input.trim() || !isConnected) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || !isConnected}
        >
          <Ionicons 
            name="send" 
            size={22} 
            color={input.trim() && isConnected ? "#007AFF" : "#ccc"} 
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      {renderHeader()}
      
      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.tempId}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading messages...' : 'No messages yet'}
            </Text>
          </View>
        }
      />
      
      {/* Input */}
      {renderInput()}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: Platform.OS === 'ios' ? 40 : 15,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusOnline: {
    backgroundColor: '#4CAF50',
  },
  statusOffline: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    marginLeft: 15,
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 15,
    paddingBottom: 80,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 15,
    padding: 12,
    borderRadius: 15,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 5,
    marginRight: 5,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderTopLeftRadius: 5,
    marginLeft: 5,
  },
  failedMessage: {
    opacity: 0.8,
  },
  messageContent: {
    maxWidth: '100%',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#000',
  },
  otherMessageText: {
    color: '#000',
  },
  failedMessageText: {
    color: '#F44336',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(0, 0, 0, 0.45)',
    marginRight: 4,
  },
  timestampMe: {
    color: 'rgba(0, 0, 0, 0.45)',
  },
  statusIcon: {
    marginLeft: 4,
  },
  retryButton: {
    marginTop: 4,
    padding: 4,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  retryText: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  attachmentButton: {
    padding: 8,
    marginRight: 5,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    fontSize: 16,
    color: '#000',
  },
  sendButton: {
    padding: 8,
    marginLeft: 5,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
