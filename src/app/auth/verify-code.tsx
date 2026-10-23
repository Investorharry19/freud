import { useState } from "react";
import { TextInput } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
} from "../../../components/screens/app-ui";

export default function VerifyCode() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const verify = () => {
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit demo code.");
      return;
    }
    if (code !== "123456") {
      setError("That code does not match. For the demo, use 123456.");
      return;
    }
    setError("");
    router.push("/auth/reset-password");
  };

  return (
    <AppPage
      title="Verify your email"
      subtitle="Enter the 6-digit code sent to your recovery email."
    >
      <AppCard>
        <ThemedText>
          Demo mode: use code 123456. No email or SMS is sent.
        </ThemedText>
      </AppCard>
      <TextInput
        value={code}
        onChangeText={(value) => {
          setCode(value.replace(/\D/g, "").slice(0, 6));
          setError("");
        }}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="000000"
        accessibilityLabel="Verification code"
        style={{
          padding: 18,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#E8DECF",
          backgroundColor: "#FFFFFF",
          fontSize: 24,
          letterSpacing: 8,
          textAlign: "center",
        }}
      />
      {error ? <ThemedText style={{ color: "#C9541A" }}>{error}</ThemedText> : null}
      <AppButton label="Verify code" onPress={verify} />
    </AppPage>
  );
}
