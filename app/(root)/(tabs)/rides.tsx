import React, { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Ride {
  id: number;
  start_location: string;
  end_location: string;
  transport_type: string;
}

const Rides = () => {
  const [rides, setRides] = useState<Ride[]>([]);

  const fetchRides = async () => {
    try {
      const response = await fetch(
        "https://mad-backend-urin.onrender.com/rides",
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Rides:", data);
      setRides(data.rides || data); // adjust depending on response format
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <SafeAreaView className="flex-1 px-5">
      <Text style={{ fontSize: 30, marginVertical: 10, marginBottom: 20 }}>
        Ride History
      </Text>

      <FlatList
        data={rides}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 12,
              padding: 12,
              backgroundColor: "#fff",
              borderRadius: 8,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {item.start_location} → {item.end_location}
            </Text>
            <Text>Transport: {item.transport_type}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No rides booked yet.</Text>}
      />
    </SafeAreaView>
  );
};

export default Rides;
