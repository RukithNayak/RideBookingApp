import { useUser } from "@clerk/clerk-expo";
import React, { useState, useEffect } from "react";
import { Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import InputField from "@/components/InputField";
import SaveUserToDb from "@/components/SaveUserToDB";

const Profile = () => {
  const { user } = useUser();

  // State for each field's value
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || "",
  );
  const [phone, setPhone] = useState(
    user?.primaryPhoneNumber?.phoneNumber || "",
  );

  // State for edit lock (all inputs locked together)
  const [isDone, setIsDone] = useState(false);

  return (
    <SafeAreaView className="flex-1">
      <SaveUserToDb />

      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-2xl font-JakartaBold my-5">My profile</Text>

        <View className="flex items-center justify-center my-5">
          <Image
            source={{
              uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className="rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
          <InputField
            label="First name"
            placeholder="Enter first name"
            value={firstName}
            onChangeText={setFirstName}
            containerStyle="w-full"
            inputStyle={`p-3.5 ${isDone ? "text-gray-400" : "text-black"}`}
            editable={!isDone}
          />

          <InputField
            label="Last name"
            placeholder="Enter last name"
            value={lastName}
            onChangeText={setLastName}
            containerStyle="w-full"
            inputStyle={`p-3.5 ${isDone ? "text-gray-400" : "text-black"}`}
            editable={!isDone}
          />

          <InputField
            label="Email"
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            containerStyle="w-full"
            inputStyle={`p-3.5 ${isDone ? "text-gray-400" : "text-black"}`}
            editable={!isDone}
          />

          <InputField
            label="Phone"
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            containerStyle="w-full"
            inputStyle={`p-3.5 ${isDone ? "text-gray-400" : "text-black"}`}
            editable={!isDone}
          />

          {/* Done button */}
          {!isDone && (
            <TouchableOpacity
              onPress={() => setIsDone(true)}
              className="mt-4 self-center bg-blue-600 px-6 py-2 rounded-md"
            >
              <Text className="text-white font-semibold text-lg">Done</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
