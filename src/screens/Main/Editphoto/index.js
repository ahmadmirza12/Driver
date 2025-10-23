import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "react-native";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import UploadImageUI from "../../../components/UploadImageUI";
import { put } from "../../../services/ApiRequest";
import CustomButton from "../../../components/CustomButton";
import { showError, showSuccess } from "../../../utils/toast";

const Editphoto = () => {
  const navigation = useNavigation();
  const [documentImages, setDocumentImages] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
    interior: null,
    dashboard: null,
  });
  const [loading, setLoading] = useState(false);

  const handleDocumentUpload = (type) => (url) => {
    console.log(`${type} uploaded:`, url);
    setDocumentImages((prev) => ({
      ...prev,
      [type]: url,
    }));
  };

  const updatedoc = async () => {
    const data = {
      vehiclePhotos: {
        frontUrl: documentImages.front,
        backUrl: documentImages.back,
        leftUrl: documentImages.left,
        rightUrl: documentImages.right,
        interiorUrl: documentImages.interior,
        dashboardUrl: documentImages.dashboard,
      },
    };

    try {
      setLoading(true);
      const response = await put("rider/vehicle/photos", data);
      console.log(response.data);
       showSuccess("Vehicle photos updated successfully");

      navigation.goBack();
    } catch (error) {
      console.error("Error updating documents:", error);
      showError("Failed to update vehicle photos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1F5546" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Vehicle Photos</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Photos</Text>
            <View style={styles.photoRow}>
            <Text style={styles.infoText}>Front</Text>
            <UploadImageUI
              onUploadComplete={handleDocumentUpload("front")}
              initialImage={documentImages.front}
            />
            </View>


            <View style={styles.photoRow}>
            <Text style={styles.infoText}>Back</Text>
            <UploadImageUI
              onUploadComplete={handleDocumentUpload("back")}
              initialImage={documentImages.back}
            />
            </View>


            <View style={styles.photoRow}>
            <Text style={styles.infoText}>Left</Text>
            <UploadImageUI
              onUploadComplete={handleDocumentUpload("left")}
              initialImage={documentImages.left}
            />
            </View>

            <View style={styles.photoRow}>
            <Text style={styles.infoText}>Right</Text>
            <UploadImageUI
              onUploadComplete={handleDocumentUpload("right")}
              initialImage={documentImages.right}
            />
            </View>

            <View style={styles.photoRow}>
            <Text style={styles.infoText}>Interior</Text>
            <UploadImageUI
              onUploadComplete={handleDocumentUpload("interior")}
              initialImage={documentImages.interior}
            />
            </View>

            <View style={styles.photoRow}>
            <Text style={styles.infoText}>Dashboard</Text>
            <UploadImageUI
              onUploadComplete={handleDocumentUpload("dashboard")}
              initialImage={documentImages.dashboard}
            />
            </View>
          </View>

          {/* Save Button */}
          {/* <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={updatedoc}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Saving..." : "Save Photos"}
            </Text>
          </TouchableOpacity> */}


          <CustomButton
            title="Save"
            onPress={updatedoc}
            loading={loading}
            disabled={loading}
           marginBottom={20}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Editphoto;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F6F2",
  },
  header: {
    backgroundColor: "#1F5546",
    height: 114,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F5546",
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#1F5546",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  photoRow: {
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#26433D",
    marginBottom: 10,
  },
});
