import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    phone_nummer: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8080/users/register/", form);
      router.replace("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {["username", "password", "email", "first_name", "phone_nummer"].map(
          (field) => (
            <View key={field} style={styles.inputGroup}>
              <Text style={styles.label}>
                {field.replace("_", " ").toUpperCase()}
              </Text>
              <TextInput
                style={styles.input}
                value={form[field]}
                onChangeText={(text) => handleChange(field, text)}
                placeholder={`Enter your ${field}`}
                placeholderTextColor="#9ca3af"
                secureTextEntry={field === "password"}
                autoCapitalize="none"
              />
            </View>
          )
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text style={styles.link} onPress={() => router.replace("/")}>
            Sign in
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
  error: { color: "#f87171", textAlign: "center", marginBottom: 12 },
  inputGroup: { marginBottom: 16 },
  label: { color: "#d1d5db", marginBottom: 6, fontWeight: "600" },
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
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  footerText: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 16,
    fontSize: 13,
  },
  link: { color: "#6366f1" },
});
