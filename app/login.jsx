import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // Import icon

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State để theo dõi trạng thái xem mật khẩu

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://192.168.1.7:8080/users/login/", //My IP at home (should change)
        {
          username: email,
          password: password,
        }
      );

      if (response.status === 200) {
        await AsyncStorage.setItem("token", response.data.access_token);
        router.replace("/");
      } else {
        setError("Đăng nhập thất bại");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={toggleShowPassword}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#9ca3af"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text style={styles.link} onPress={() => router.replace("/register")}>
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#1f2937",
    padding: 24,
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#374151",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  error: {
    color: "#f87171",
    textAlign: "center",
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#d1d5db",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    color: "#fff",
    backgroundColor: "#374151",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerText: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 16,
    fontSize: 13,
  },
  link: {
    color: "#6366f1",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#374151",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4b5563",
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    color: "#fff",
    paddingVertical: 10,
  },
  eyeIcon: {
    padding: 8,
  },
});
