import { useUser, useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);

  const destinationOptions = [
    "BMSCE Gate",
    "National College Metro Station",
    "Ramakrishna Math Bus Stop",
  ];

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleSelectDestination = (destination: string) => {
    setModalVisible(false); // Close modal after selection
    router.push({
      pathname: "/find-ride",
      params: { destination },
    });
  };

  const {
    data: recentRides,
    loading,
    error,
  } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item, index) => index.toString()}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaExtraBold">
                Welcome {user?.firstName}👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>

            {/* Where do you want to go button */}
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="bg-white px-4 py-3 rounded-xl shadow-md shadow-neutral-300 mb-5"
            >
              <Text className="text-gray-700 text-base">
                Where do you want to go?
              </Text>
            </TouchableOpacity>

            {/* Destination selection modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View className="flex-1 justify-center items-center bg-black/40 px-5">
                <View className="bg-white w-full rounded-2xl p-5 space-y-3">
                  {destinationOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      className="bg-general-100 p-3 rounded-xl"
                      onPress={() => handleSelectDestination(option)}
                    >
                      <Text className="text-center text-base text-general-900">
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <Pressable onPress={() => setModalVisible(false)}>
                    <Text className="text-center text-red-500 mt-2">
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Your current location
            </Text>
            <View className="flex flex-row items-center bg-transparent h-[300px]">
              <Map />
            </View>

            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent Rides
            </Text>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default Home;
