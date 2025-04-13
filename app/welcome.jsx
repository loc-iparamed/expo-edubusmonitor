import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { scheduleAlarm, removeAlarm, stopAlarm } from "expo-alarm-module";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Bạn cần cấp quyền thông báo để sử dụng tính năng cảnh báo.");
      }
    };

    requestPermission();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      () => {
        stopAlarm();
        removeAlarm("alarm1");
      }
    );

    return () => {
      subscription.remove(); // cleanup
    };
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  const handleCreateAlarm = async () => {
    const alarmTime = new Date();
    alarmTime.setSeconds(alarmTime.getSeconds() + 5);

    scheduleAlarm({
      uid: "alarm1",
      day: alarmTime,
      title: "⏰ Báo thức",
      description: "Người bị bỏ quên trên xe!",
      showDismiss: true,
      showSnooze: true,
      snoozeInterval: 5,
      repeating: false,
      active: true,
    });

    // Gửi thông báo sau 5 giây
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚨 Báo thức đang kêu!",
        body: "Nhấn vào đây để tắt báo thức!",
        sound: "default",
        vibrate: [0, 500, 500, 500],
      },
      trigger: { seconds: 5 },
    });
  };

  const handleCancelAlarm = () => {
    stopAlarm();
    removeAlarm("alarm1");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Welcome!</Text>
      <Text style={styles.subtitle}>Bạn đã đăng nhập thành công 🎉</Text>

      <TouchableOpacity style={styles.button} onPress={handleCreateAlarm}>
        <Text style={styles.buttonText}>🚨 Đặt báo thức 5s</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={handleCancelAlarm}
      >
        <Text style={styles.buttonText}>❌ Huỷ báo thức</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>🚪 Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 16,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  cancelButton: {
    backgroundColor: "#f59e0b",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
