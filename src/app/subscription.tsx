import { useState } from "react";
import { router } from "expo-router";
import { ThemedText } from "../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppChoice,
  AppPage,
} from "../../components/screens/app-ui";

export default function Subscription() {
  const [plan, setPlan] = useState("Annual");
  const [notice, setNotice] = useState("");

  return (
    <AppPage
      title="Make space for yourself"
      subtitle="Explore optional plans. No payment is processed in this demo."
    >
      <AppCard style={{ backgroundColor: "#E6ECD8" }}>
        <ThemedText variant="heading" style={{ fontSize: 22 }}>
          Freud Plus
        </ThemedText>
        <ThemedText style={{ marginTop: 8 }}>
          A sample plan card for expanded guided practices and progress
          insights.
        </ThemedText>
      </AppCard>
      {["Monthly", "Annual"].map((item) => (
        <AppChoice
          key={item}
          label={item}
          detail={item === "Annual" ? "Best value · billed yearly" : "Billed monthly"}
          selected={plan === item}
          onPress={() => setPlan(item)}
        />
      ))}
      <AppButton
        label={`Continue with ${plan}`}
        onPress={() => setNotice("Demo only: connect a store purchase provider to subscribe.")}
      />
      <AppButton
        label="Restore purchases"
        secondary
        onPress={() => setNotice("No purchases are linked to this demo account.")}
      />
      {notice ? <ThemedText>{notice}</ThemedText> : null}
      <AppButton
        label="Manage plan"
        secondary
        onPress={() => router.push("/subscription/manage")}
      />
    </AppPage>
  );
}
