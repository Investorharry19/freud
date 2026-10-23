import { useState } from "react";
import { TextInput, View } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import { AppButton, AppPage } from "../../../components/screens/app-ui";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const fieldStyle = {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8DECF",
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  } as const;
  const reset = () => {
    if (password.length < 8) {
      setError("Use at least 8 characters for your new password.");
      return;
    }
    if (password !== confirm) {
      setError("The passwords do not match.");
      return;
    }
    setError("");
    router.replace("/auth/password-reset-complete");
  };

  return (
    <AppPage
      title="Create a new password"
      subtitle="Choose a password with at least 8 characters."
    >
      <View style={{ gap: 12 }}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="New password"
          secureTextEntry
          autoComplete="new-password"
          accessibilityLabel="New password"
          style={fieldStyle}
        />
        <TextInput
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Confirm new password"
          secureTextEntry
          autoComplete="new-password"
          accessibilityLabel="Confirm new password"
          style={fieldStyle}
        />
      </View>
      {error ? <ThemedText style={{ color: "#C9541A" }}>{error}</ThemedText> : null}
      <AppButton label="Save new password" onPress={reset} />
    </AppPage>
  );
}
