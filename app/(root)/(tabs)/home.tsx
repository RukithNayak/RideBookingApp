import { useUser, useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";

const TAB_BAR_HEIGHT = 80; // adjust to your tab bar height or more

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const {
    data: recentRides,
    loading,
    error,
  } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleFindRideRedirect = () => {
    router.push("/find-ride");
  };

  return (
    <SafeAreaView className="bg-general-500 flex-1">
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item, index) => index.toString()}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT, // This is essential!
        }}
        ListHeaderComponent={
          <>
            <View className="flex flex-row items-center justify-between mt-6 mb-6">
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

            <TouchableOpacity
              onPress={handleFindRideRedirect}
              className="bg-white px-4 py-4 rounded-xl shadow-md shadow-neutral-300 mb-6"
            >
              <Text className="text-gray-700 text-base">
                {"Where do you want to go?"}
              </Text>
            </TouchableOpacity>

            <Text className="text-xl font-JakartaBold mt-2 mb-0">
              Your current location
            </Text>

            <View className="flex flex-row items-center bg-transparent h-[380px]">
              <Map />
            </View>

            {/* Optional offers section */}

            <Text className="text-xl font-JakartaBold mt-7 mb-3">
              {/*Recent Rides*/}
            </Text>
          </>
        }
        // Add footer with blank space = tab bar height
        ListFooterComponent={<View style={{ height: TAB_BAR_HEIGHT }} />}
      />
    </SafeAreaView>
  );
};

export default Home;
