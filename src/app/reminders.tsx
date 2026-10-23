import { useState } from "react";
import { Pressable, View } from "react-native";
import { ThemedText } from "../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
  APP_COLORS,
} from "../../components/screens/app-ui";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Reminders() {
  const [enabled, setEnabled] = useState(true);
  const [days, setDays] = useState([true, true, true, true, true, false, false]);
  const [time, setTime] = useState("08:00");
  const [saved, setSaved] = useState(false);

  return (
    <AppPage
      title="Practice reminders"
      subtitle="Choose a gentle nudge that fits your routine."
    >
      <Pressable
        onPress={() => {
          setEnabled((value) => !value);
          setSaved(false);
        }}
        accessibilityRole="switch"
        accessibilityState={{ checked: enabled }}
      >
        <AppCard>
          <ThemedText variant="heading">
            Reminders {enabled ? "On" : "Off"}
          </ThemedText>
          <ThemedText style={{ marginTop: 4 }}>
            {enabled ? "Tap to pause reminders" : "Tap to turn reminders on"}
          </ThemedText>
        </AppCard>
      </Pressable>
      <ThemedText variant="heading" style={{ fontSize: 20 }}>
        Repeat on
      </ThemedText>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {DAYS.map((day, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setSaved(false);
              setDays((current) =>
                current.map((selected, dayIndex) =>
                  dayIndex === index ? !selected : selected,
                ),
              );
            }}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: days[index] }}
            accessibilityLabel={DAYS[index]}
            style={{
              minWidth: 40,
              height: 42,
              paddingHorizontal: 5,
              borderRadius: 21,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: days[index]
                ? APP_COLORS.greenSoft
                : APP_COLORS.white,
              borderWidth: 1,
              borderColor: APP_COLORS.border,
            }}
          >
            <ThemedText>{day.slice(0, 1)}</ThemedText>
          </Pressable>
        ))}
      </View>
      <ThemedText variant="heading" style={{ fontSize: 20 }}>
        Reminder time
      </ThemedText>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {["07:00", "08:00", "21:00"].map((value) => (
          <Pressable
            key={value}
            onPress={() => {
              setTime(value);
              setSaved(false);
            }}
          >
            <AppCard
              style={{
                borderColor:
                  time === value ? APP_COLORS.green : APP_COLORS.border,
                backgroundColor:
                  time === value ? APP_COLORS.greenSoft : APP_COLORS.white,
              }}
            >
              <ThemedText>{value}</ThemedText>
            </AppCard>
          </Pressable>
        ))}
      </View>
      <AppCard>
        <ThemedText>
          Device notifications are not scheduled in this demo.
        </ThemedText>
      </AppCard>
      <AppButton
        label={saved ? "Reminder saved" : "Save reminder"}
        onPress={() => setSaved(true)}
        disabled={!days.some(Boolean) && enabled}
      />
      {saved ? (
        <ThemedText style={{ textAlign: "center" }}>
          {enabled
            ? `Demo reminder set for ${DAYS.filter((_, index) => days[index]).join(", ")} at ${time}. Device notifications are not scheduled.`
            : "Reminders are paused."}
        </ThemedText>
      ) : null}
    </AppPage>
  );
}
