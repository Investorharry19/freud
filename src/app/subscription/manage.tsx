import { useState } from "react";
import { ThemedText } from "../../../components/generic/themed-text";
import { AppButton, AppCard, AppPage } from "../../../components/screens/app-ui";

export default function ManageSubscription() {
  const [notice, setNotice] = useState("You are using the free demo plan.");
  return (
    <AppPage
      title="Your plan"
      subtitle="Manage subscription actions for your account."
    >
      <AppCard>
        <ThemedText variant="heading">Free demo plan</ThemedText>
        <ThemedText style={{ marginTop: 6 }}>
          No active store subscription is connected.
        </ThemedText>
      </AppCard>
      <AppButton
        label="Restore purchases"
        onPress={() => setNotice("No purchases found for this demo account.")}
      />
      <ThemedText>{notice}</ThemedText>
    </AppPage>
  );
}
