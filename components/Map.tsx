import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import type { LocationObjectCoords } from "expo-location";

const GEOAPIFY_API_KEY = "cadb7d82e5b6443080cdc2d73547c3b1"; // Replace this

const Map = () => {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [zoom, setZoom] = useState(15); // default zoom level

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Location permission denied.");
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } catch (err) {
        setErrorMsg("Error fetching location.");
        console.error(err);
      }
    })();
  }, []);

  const handleZoomIn = () => {
    if (zoom < 20) setZoom((prev) => prev + 1);
  };

  const handleZoomOut = () => {
    if (zoom > 1) setZoom((prev) => prev - 1);
  };

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Getting current location...</Text>
      </View>
    );
  }

  const { latitude, longitude } = location;
  const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=1400&height=800&center=lonlat:${longitude},${latitude}&zoom=${zoom}&marker=lonlat:${longitude},${latitude};color:%23ff0000;size:large&apiKey=${GEOAPIFY_API_KEY}`;

  return (
    <View style={styles.container}>
      <Image source={{ uri: mapUrl }} style={styles.map} />
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleZoomIn} style={styles.zoomBtn}>
          <Text style={styles.zoomText}>＋</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleZoomOut} style={styles.zoomBtn}>
          <Text style={styles.zoomText}>－</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    position: "relative",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    alignItems: "center",
    width: 365,
    height: 340, // Increased height here for a longer map image
    borderRadius: 12,
    resizeMode: "cover",
  },
  controls: {
    position: "absolute",
    right: 10,
    top: 10,
    flexDirection: "column",
  },
  zoomBtn: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 8,
    marginVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  zoomText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Map;
