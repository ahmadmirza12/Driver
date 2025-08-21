import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native-web";
import { Platform } from "react-native";
import { useNavigation } from "expo-router";
import { del, get, put } from "../../../services/ApiRequest";

const Notifications = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications from API
  const getNotification = async () => {
    setLoading(true);
    try {
      const response = await get("notifications");
      console.log("Notifications API Response:", response.data.data);
      const apiData = response.data?.data?.notifications || [];
      const processedNotifications = apiData.map((notification) => ({
        id: notification._id,
        title: notification.title,
        message: notification.message,
        timestamp: formatRelativeTime(notification.createdAt),
        isRead: notification.isRead,
        type: notification.type || "general",
      }));
      // console.log("Processed Notifications:", processedNotifications);
      setNotifications(processedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      Alert.alert("Error", "Failed to fetch notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotification();
  }, []);

  // Format date to relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    return "Just now";
  };

  // Mark single notification as read
  const markAsRead = async (_id) => {
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === _id
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // API call
      await put(`notifications/${_id}/read`);
      console.log("Notification marked as read successfully.", _id);

      // Refresh notifications
      await getNotification();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      Alert.alert("Error", "Failed to mark notification as read.");
      await getNotification();
    }
  };

  // Delete single notification
  const handleDeleteNotification = (_id) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteNotification(_id),
        },
      ]
    );
  };
  const deleteNotification = async (_id) => {
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== _id)
      );

      // API call
      await del(`notifications/${_id}`);
      console.log("Notification deleted successfully.", _id);
      // Refresh notifications
      await getNotification();
    } catch (error) {
      console.error("Error deleting notification:", error);
      Alert.alert("Error", "Failed to delete notification.");
      await getNotification();
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await put("notifications/read-all");
      console.log(
        "Mark all notifications as read successfully.",
        response.data
      );

      // Refresh notifications
      await getNotification();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      
    }
  };



  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_assigned":
        return "🚗";
      case "reminder":
        return "⏰";
    }
  };

  // Render individual notification item
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification,
      ]}
      onPress={() => !item.isRead && markAsRead(item.id)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationIcon}>
            {getNotificationIcon(item.type)}
          </Text>
          <View style={styles.notificationTextContainer}>
            <Text
              style={[
                styles.notificationTitle,
                !item.isRead && styles.unreadText,
              ]}
            >
              {item.title}
            </Text>
            <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
          </View>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <View style={styles.notificationActions}>
          {!item.isRead && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => markAsRead(item.id)}
            >
              <Text style={styles.actionButtonText}>Mark as Read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteNotification(item.id)}
          >
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Empty state component
  const EmptyNotifications = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🔔</Text>
      <Text style={styles.emptyStateTitle}>No Notifications</Text>
      <Text style={styles.emptyStateMessage}>
        You're all caught up! New notifications will appear here.
      </Text>
    </View>
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1F5546" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Notifications ({notifications.length})
        </Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {notifications.length > 0 && (
        <View style={styles.actionBar}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={markAllAsRead}
            >
              <Text style={styles.headerButtonText}>
                Mark All Read ({unreadCount})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyNotifications}
        refreshing={loading}
        onRefresh={getNotification}
      />
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F6F2",
    paddingTop: Platform.OS === "android" ? 35 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
  },
  unreadBadge: {
    backgroundColor: "#dc3545",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionBar: {
    flexDirection: "row",
    paddingHorizontal: 20,

    gap: 10,
  },
  headerButton: {
    backgroundColor: "#1F5546",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  headerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  deleteAllButton: {
    backgroundColor: "#dc3545",
  },
  deleteAllButtonText: {
    color: "#fff",
  },
  listContainer: {
    paddingVertical: 10,
    flexGrow: 1,
  },
  notificationItem: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
    padding: 16,
    
  },
  unreadNotification: {
    backgroundColor: "#f8f9ff",
    borderLeftWidth: 4,
    borderLeftColor: "#1F5546",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 2,
  },
  unreadText: {
    fontWeight: "bold",
  },
  notificationTimestamp: {
    fontSize: 12,
    color: "#6c757d",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1F5546",
    marginTop: 6,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
    marginBottom: 12,
    marginLeft: 32,
  },
  notificationActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  actionButtonText: {
    fontSize: 12,
    color: "#495057",
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "#fff5f5",
    borderColor: "#fecaca",
  },
  deleteButtonText: {
    color: "#dc3545",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#495057",
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
