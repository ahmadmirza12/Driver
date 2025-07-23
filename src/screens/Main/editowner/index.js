import { StatusBar, StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign, MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";

const Editowner = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { profileData } = route.params || {};
  console.log("profileData in Editowner:", profileData);

  const menuItems = [
    {
      id: 1,
      title: "Edit Profile",
      subtitle: "Update personal information",
      icon: "person-outline",
      iconType: "Ionicons",
      color: "#4A90E2",
      route: "EditProfile",
      params: { profileData },
    },
    {
      id: 2,
      title: "Vehicle Specifications",
      subtitle: "Modify vehicle details",
      icon: "car-sport-outline",
      iconType: "Ionicons",
      color: "#F5A623",
      route: "Editspec",
    },
    {
      id: 3,
      title: "Vehicle Document",
      subtitle: "Update documents",
      icon: "document-text-outline",
      iconType: "Ionicons",
      color: "#7ED321",
      route: "Editdoc",
    },
    {
      id: 4,
      title: "Vehicle Photos",
      subtitle: "Manage vehicle images",
      icon: "camera-outline",
      iconType: "Ionicons",
      color: "#D0021B",
      route: "Editphoto",
    },
  ];

  const renderIcon = (iconName, iconType, color, size = 24) => {
    switch (iconType) {
      case "Ionicons":
        return <Ionicons name={iconName} size={size} color={color} />;
      case "MaterialIcons":
        return <MaterialIcons name={iconName} size={size} color={color} />;
      case "FontAwesome5":
        return <FontAwesome5 name={iconName} size={size} color={color} />;
      default:
        return <AntDesign name={iconName} size={size} color={color} />;
    }
  };

  const handleNavigation = (route, params = {}) => {
    try {
      navigation.navigate(route, params);
    } catch (error) {
      console.error("Navigation error:", error.message);
      alert("Failed to navigate. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Owner</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Manage Your Information</Text>
          <Text style={styles.subtitleText}>Select an option below to update your details</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { marginTop: index === 0 ? 0 : 15 }]}
              onPress={() => handleNavigation(item.route, item.params)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                  {renderIcon(item.icon, item.iconType, item.color, 26)}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <AntDesign name="right" size={16} color="#C7C7CC" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

export default Editowner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FFFE",
  },
  header: {
    backgroundColor: "#1F5546",
    height: 100,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    paddingVertical: 25,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F5546",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  menuContainer: {
    paddingBottom: 20,
  },
  menuItem: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 30,
  },
});