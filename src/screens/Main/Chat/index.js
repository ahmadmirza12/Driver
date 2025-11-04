// Driver-side: screens/Chats.js (React Native)
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
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { get } from "../../../services/ApiRequest";
import { useSocket } from "../../../components/SocketProvider";
import { useSelector } from "react-redux";

const Chats = ({ route, navigation }) => {
  const { userId, userName } = route.params || {};
  const auth = useSelector((state) => state.data);
  const currentUserId = auth.user?.id;

  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);
  const { socket } = useSocket();

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) {
        console.log("⚠️ No userId provided");
        setLoading(false);
        return;
      }

      try {
        console.log("📡 Fetching messages for userId:", userId);
        const response = await get(`chat/chats/${userId}`);

        const chatData = response.data?.data?.chat;
        const messagesData = response.data?.data?.messages || [];

        if (chatData) {
          const fetchedChatId = chatData._id;
          setChatId(fetchedChatId);
          console.log("💬 Chat ID:", fetchedChatId);

          // Normalize messages
          const normalized = messagesData.map((msg) => {
            const senderId = msg.senderId?._id || msg.senderId;

            return {
              id: msg._id || msg.id,
              senderId: senderId,
              content: msg.formattedContent || msg.content,
              createdAt: msg.createdAt,
              status: msg.status || "sent",
            };
          });

          console.log(`✅ Loaded ${normalized.length} messages`);
          setMessages(normalized);

          // Initial scroll to bottom after loading messages
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }, 100);
        }
      } catch (error) {
        console.error("❌ Error fetching messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !socket.connected || !userId || !currentUserId) {
      console.log("⚠️ Socket not ready:", {
        socket: !!socket,
        connected: socket?.connected,
        userId,
        currentUserId,
      });
      return;
    }

    console.log("🎧 Setting up socket listeners. Socket ID:", socket.id);

    const handleNewMessage = (message) => {
      console.log("📩 New message received:", JSON.stringify(message, null, 2));

      if (!message) {
        console.error("❌ Received empty message");
        return;
      }

      const senderId =
        message.senderId?._id ||
        message.senderId ||
        message.sender ||
        message.from;

      if (!senderId) {
        console.error("❌ No senderId in message:", message);
        return;
      }

      // Check if message belongs to this chat
      if (senderId !== currentUserId && senderId !== userId) {
        console.log("❌ Message not for this chat. Sender:", senderId);
        return;
      }

      const normalizedMessage = {
        id: message._id || message.id || `temp-${Date.now()}`,
        senderId: senderId,
        content:
          message.formattedContent || message.content || message.text || "",
        createdAt:
          message.createdAt || message.timestamp || new Date().toISOString(),
        status: senderId === currentUserId ? "sent" : "received",
      };

      setMessages((prev) => {
        // Update optimistic message if it exists
        const optimisticIndex = prev.findIndex(
          (msg) =>
            msg.status === "sending" &&
            msg.senderId === currentUserId &&
            msg.content === normalizedMessage.content &&
            Math.abs(
              new Date(msg.createdAt).getTime() -
                new Date(normalizedMessage.createdAt).getTime()
            ) < 5000
        );

        if (optimisticIndex !== -1) {
          console.log(
            "🔄 Updating optimistic message at index:",
            optimisticIndex
          );
          const updated = [...prev];
          updated[optimisticIndex] = normalizedMessage;
          return updated;
        }

        // Check for duplicates
        if (prev.some((msg) => msg.id === normalizedMessage.id)) {
          console.log("⚠️ Duplicate message ignored:", normalizedMessage.id);
          return prev;
        }

        console.log("➕ Adding new message to chat");
        return [...prev, normalizedMessage];
      });

      // Auto-scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    // Listen for new messages
    socket.on("new_message", handleNewMessage);

    // Cleanup
    return () => {
      console.log("🧹 Removing socket listeners");
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, currentUserId, userId]);

  // Send message function
  const sendMessage = useCallback(() => {
    if (!input.trim()) {
      console.log("⚠️ Cannot send empty message");
      return;
    }

    if (!socket || !socket.connected) {
      console.log("❌ Socket not connected");
      return;
    }

    const messageContent = input.trim();
    const tempId = `temp-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const optimisticMsg = {
      id: tempId,
      senderId: currentUserId,
      content: messageContent,
      createdAt: timestamp,
      status: "sending",
      tempId,
    };

    // Add optimistic message
    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    const socketPayload = {
      otherUserId: userId,
      content: messageContent,
      messageType: "text",
    };

    console.log("📤 Sending message via socket:", socketPayload);

    // Emit with timeout and acknowledgment
    socket.timeout(1000).emit("send_message", socketPayload, (response) => {
      console.log("✅ Message sent successfully:", response);
      if (response) {
        console.log("✅ Message sent successfully:", response);

        // Update optimistic message with server data
        const serverId = response._id || response.message?._id || tempId;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, id: serverId, status: "sent" } : msg
          )
        );

        if (response.chatId && !chatId) {
          setChatId(response.chatId);
        }
      } else {
        console.error("❌ Server rejected message:", response);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...msg, status: "failed", error: "Server error" }
              : msg
          )
        );
      }
    });
  }, [socket, userId, currentUserId, input, chatId]);

  const renderMessageStatus = (status) => {
    switch (status) {
      case "sent":
        return (
          <Ionicons
            name="checkmark-done"
            size={16}
            color="#4CAF50"
            style={styles.statusIcon}
          />
        );
      case "delivered":
        return (
          <Ionicons
            name="checkmark-done"
            size={16}
            color="#2196F3"
            style={styles.statusIcon}
          />
        );
      case "read":
        return (
          <Ionicons
            name="checkmark-done"
            size={16}
            color="#2196F3"
            style={styles.statusIcon}
          />
        );
      default:
        return null;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.backRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Image
          source={require("../../../assets/images/Roger.png")}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{userName || "Unknown"}</Text>
        {socket.connected && (
          <View style={styles.connectionIndicator}>
            <View style={styles.connectedDot} />
          </View>
        )}
      </View>
    </View>
  );

  const renderInput = () => (
    <View style={styles.inputBar}>
      <TextInput
        style={styles.textInput}
        value={input}
        onChangeText={setInput}
        placeholder={socket.connected ? "Type a message..." : "Connecting..."}
        multiline
        onSubmitEditing={sendMessage}
        editable={socket.connected}
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
          (!input.trim() || !socket.connected) && styles.sendButtonDisabled,
        ]}
        onPress={sendMessage}
        disabled={!input.trim() || !socket.connected}
      >
        <AntDesign name="right" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    const isMe = item.senderId === currentUserId;
    const isFailed = item.status === "failed";

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
          isFailed && styles.failedMessage,
        ]}
      >
        <View style={styles.messageContent}>
          <Text
            style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.otherMessageText,
              isFailed && styles.failedMessageText,
            ]}
          >
            {item.content}
          </Text>
        </View>

        <View style={styles.metaRow}>
          {item.createdAt && (
            <Text style={[styles.timestamp, isMe && styles.timestampMe]}>
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
          {isMe && item.status && renderMessageStatus(item.status)}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#1F5546" barStyle="light-content" />
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F5546" />
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1F5546" />
      {renderHeader()}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.tempId}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        }
      />

      {renderInput()}
    </KeyboardAvoidingView>
  );
};

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
    flex: 1,
  },
  connectionIndicator: {
    marginLeft: "auto",
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  messagesContainer: {
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
  messageContent: {
    maxWidth: "100%",
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
  failedMessage: {
    opacity: 0.7,
    borderWidth: 1,
    borderColor: "#F44336",
  },
  failedMessageText: {
    color: "#F44336",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
    color: "#666",
  },
  timestampMe: {
    color: "#d0d0d0",
  },
  statusIcon: {
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
});

export default Chats;
