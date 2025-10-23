"use client";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import UploadImageUI from "../../../components/UploadImageUI";
import { put } from "../../../services/ApiRequest";
import { showError, showSuccess } from "../../../utils/toast";

const Editdoc = () => {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState({
    grant: null,
    insurance: null,
    evp: null,
  });

  const navigation = useNavigation();
  const handleDocumentUpload = (type) => (url) => {
    console.log(`${type} uploaded:`, url);
    setDocuments((prev) => ({
      ...prev,
      [type]: url,
    }));
  };

  const updatedoc = async () => {
    const data = {
      vehicleDocuments: {
        grantCertificateUrl: documents.grant,
        insuranceUrl: documents.insurance,
        evpUrl: documents.evp,
      },
    };

    try {
      setLoading(true);
      const response = await put("rider/vehicle/documents", data);
      console.log(response.data);
       showSuccess("Vehicle documents updated successfully");
      // Handle success - maybe show a success message or navigate back
      navigation.goBack();
    } catch (error) {
      console.error("Error updating documents:", error);
      showError("Failed to update vehicle documents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1F5546" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Document</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Documents</Text>
            <View style={styles.photoRow}>
              <Text style={styles.infoText}>Grant Certificate</Text>
              <UploadImageUI
                onUploadComplete={handleDocumentUpload("grant")}
                initialImage={documents.grant}
              />
            </View>
            <View style={styles.photoRow}>
              <Text style={styles.infoText}>Insurance</Text>
              <UploadImageUI
                onUploadComplete={handleDocumentUpload("insurance")}
                initialImage={documents.insurance}
              />
            </View>
            <View style={styles.photoRow}>
              <Text style={styles.infoText}>EVP Certificate</Text>
              <UploadImageUI
                onUploadComplete={handleDocumentUpload("evp")}
                initialImage={documents.evp}
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={updatedoc}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Saving..." : "Save Documents"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Editdoc;

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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F5546",
    marginBottom: 15,
  },
  photoRow: {
    gap: 10,
  },
  saveButton: {
    backgroundColor: "#1F5546",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#26433D",
    marginTop: 15,
  },
});
