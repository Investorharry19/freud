import { useState } from "react";
import { router } from "expo-router";
import { ThemedText } from "../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
  AppChoice,
} from "../../components/screens/app-ui";
import { demoActions } from "../../components/screens/demo-store";

export default function DeleteAccount() {
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <AppPage
      title={done ? "Demo data cleared" : "Delete account"}
      subtitle={
        done
          ? "The local demo data has been cleared from this running session."
          : "Account deletion is irreversible. Review carefully before continuing."
      }
    >
      {!done ? (
        <>
          <AppCard>
            <ThemedText>
              This prototype has no real account backend. Confirming clears its
              in-memory mood, session, saved, and downloaded data.
            </ThemedText>
          </AppCard>
          <AppChoice
            label="I understand this cannot be undone"
            selected={confirmed}
            onPress={() => setConfirmed((value) => !value)}
          />
          <AppButton
            label="Clear demo data"
            disabled={!confirmed}
            onPress={() => {
              demoActions.clear();
              setDone(true);
            }}
          />
        </>
      ) : (
        <AppButton
          label="Return to Home"
          onPress={() => router.replace("/tabs/home")}
        />
      )}
    </AppPage>
  );
}
