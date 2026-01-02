import { useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";

export default function SaveUserToDB() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    fetch("https://your-api-url.com/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.fullName || "No Name",
        email: user.primaryEmailAddress?.emailAddress || "no-email@example.com",
        clerkId: user.id,
      }),
    }).catch((error) => {
      console.log("Failed to save user:", error);
    });
  }, [user]);

  return null;
}
