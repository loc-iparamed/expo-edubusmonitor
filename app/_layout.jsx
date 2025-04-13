import { useEffect, useState, useCallback } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  const checkAuth = useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    const inAuthGroup = segments[0] === "login" || segments[0] === "register";

    if (token) {
      setAuthenticated(true);
      if (!loading && segments[0] !== "welcome") {
        router.replace("/welcome");
      } else if (inAuthGroup && !loading) {
        router.replace("/welcome");
      }
    } else {
      setAuthenticated(false);
      if (!loading && !inAuthGroup) {
        router.replace("/login");
      }
    }
    setLoading(false);
  }, [segments, router, loading]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      {authenticated ? (
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="login" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
