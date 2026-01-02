import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import CustomButton from "@/components/CustomButton";

const FindRide = () => {
  const [selectedPickUp, setSelectedPickUp] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [selectedRideType, setSelectedRideType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isPickUpModalVisible, setPickUpModalVisible] = useState(false);
  const [isDestinationModalVisible, setDestinationModalVisible] =
    useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);

  const pickUpOptions = [
    "BMSCE Front Gate",
    "National College Metro Station",
    "Ramakrishna Math Bus Stop",
  ];

  const destinationOptions = [
    "BMSCE Front Gate",
    "National College Metro Station",
    "Ramakrishna Math Bus Stop",
  ];

  const rideOptions = [
    {
      type: "Car-Mini",
      fare: "₹80",
      image: require("@/assets/images/carmini.png"),
    },
    {
      type: "Car-Premium",
      fare: "₹90",
      image: require("@/assets/images/carpremium.png"),
    },
    {
      type: "Auto",
      fare: "₹65",
      image: require("@/assets/images/auto.png"),
    },
    {
      type: "Two-Wheeler",
      fare: "₹40",
      image: require("@/assets/images/twoWheeler.png"),
    },
  ];

  const handleSearchRides = async () => {
    if (!selectedPickUp || !selectedDestination || !selectedRideType) return;

    setLoading(true);

    try {
      await fetch("https://mad-backend-urin.onrender.com/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: 1,
          start_location: selectedPickUp,
          end_location: selectedDestination,
          transport_type: selectedRideType,
        }),
      });

      // if (!response.ok) throw new Error("Failed to book ride");

      setConfirmationVisible(true);

      // Reset selections on success
      setSelectedPickUp("");
      setSelectedDestination("");
      setSelectedRideType("");
    } catch (error) {
      alert("Error booking ride: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mapContainer}>
          <Image
            source={require("@/assets/images/finalBMSmap.png")}
            style={styles.overlayImage}
          />
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setPickUpModalVisible(true)}
          >
            <Text>{selectedPickUp || "Select Pick-up Location"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setDestinationModalVisible(true)}
          >
            <Text>{selectedDestination || "Select Destination"}</Text>
          </TouchableOpacity>
        </View>

        {/* Ride Selection */}
        <View style={styles.rideListContainer}>
          <Text style={styles.sectionTitle}>Choose Ride Type</Text>
          <FlatList
            data={rideOptions}
            keyExtractor={(item) => item.type}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedRideType(item.type)}
                style={[
                  styles.rideOption,
                  selectedRideType === item.type && styles.rideOptionSelected,
                ]}
              >
                <Image source={item.image} style={styles.rideImage} />
                <View>
                  <Text>{item.type}</Text>
                  <Text style={{ color: "#666" }}>{item.fare}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Confirm Booking Button */}
        <View style={{ paddingHorizontal: 20, marginVertical: 20 }}>
          <CustomButton
            title={loading ? "Booking..." : "Confirm Booking"}
            onPress={handleSearchRides}
            disabled={
              loading ||
              !selectedPickUp ||
              !selectedDestination ||
              !selectedRideType
            }
          />
        </View>
      </ScrollView>

      {/* Pick-up Modal */}
      <Modal
        visible={isPickUpModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPickUpModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Pick-up Location</Text>
            <FlatList
              data={pickUpOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedPickUp(item);
                    setPickUpModalVisible(false);
                  }}
                  style={styles.modalItem}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setPickUpModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Destination Modal */}
      <Modal
        visible={isDestinationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDestinationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Destination</Text>
            <FlatList
              data={destinationOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDestination(item);
                    setDestinationModalVisible(false);
                  }}
                  style={styles.modalItem}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setDestinationModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={isConfirmationVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmationVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { alignItems: "center" }]}>
            <Text style={{ fontSize: 20, marginBottom: 15 }}>
              Booking Confirmed!
            </Text>
            <CustomButton
              title="OK"
              onPress={() => setConfirmationVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContainer: { flexGrow: 1 },
  mapContainer: { height: 350 },
  overlayImage: {
    position: "absolute",
    top: 0,
    left: -12,
    width: "100%",
    height: "100%",
    opacity: 0.7,
    resizeMode: "cover",
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  inputBox: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  rideListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  rideOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 0,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  rideOptionSelected: {
    backgroundColor: "#ddd",
  },
  rideImage: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ff6347",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default FindRide;
