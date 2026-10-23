import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import {
  AppButton,
  AppChoice,
  AppPage,
  APP_COLORS,
} from "../../../components/screens/app-ui";
import { demoActions } from "../../../components/screens/demo-store";

const MOODS = ["Calm", "Happy", "Reflective", "Anxious", "Low"];

export default function MoodCheckIn() {
  const [mood, setMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState("");

  const save = () => {
    if (!mood) return;
    demoActions.addMood({ mood, intensity, note: note.trim() });
    router.replace("/mood/history");
  };

  return (
    <AppPage
      title="Check in with yourself"
      subtitle="There is no right or wrong way to feel."
    >
      {MOODS.map((item) => (
        <AppChoice
          key={item}
          label={item}
          selected={mood === item}
          onPress={() => setMood(item)}
        />
      ))}
      <ThemedText variant="heading" style={{ fontSize: 18 }}>
        How strong does it feel? {intensity}/5
      </ThemedText>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Pressable
            key={value}
            onPress={() => setIntensity(value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: intensity === value }}
            accessibilityLabel={`Intensity ${value}`}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                intensity === value ? APP_COLORS.greenSoft : APP_COLORS.white,
              borderWidth: 1,
              borderColor:
                intensity === value ? APP_COLORS.green : APP_COLORS.border,
            }}
          >
            <ThemedText>{value}</ThemedText>
          </Pressable>
        ))}
      </View>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Add a note (optional)"
        accessibilityLabel="Optional mood note"
        multiline
        maxLength={280}
        style={{
          minHeight: 90,
          padding: 16,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: APP_COLORS.border,
          backgroundColor: APP_COLORS.white,
          textAlignVertical: "top",
        }}
      />
      <AppButton label="Save check-in" onPress={save} disabled={!mood} />
    </AppPage>
  );
}
