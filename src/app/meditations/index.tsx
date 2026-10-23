import { useMemo, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import {
  AppCard,
  AppPage,
  APP_COLORS,
  SectionTitle,
} from "../../../components/screens/app-ui";
import { PRACTICES } from "../../../components/screens/demo-store";

const FILTERS = ["All", "Stress", "Focus", "Sleep", "Self-compassion"] as const;
const STYLES = ["Any style", "Guided", "Breathing", "Sleep"] as const;
const LENGTHS = ["Any length", "Under 10 min", "10+ min"] as const;

export default function MeditationLibrary() {
  const { intention } = useLocalSearchParams<{ intention?: string }>();
  const initialFilter =
    FILTERS.find((item) => item === intention) ?? FILTERS[0];
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>(initialFilter);
  const [styleFilter, setStyleFilter] =
    useState<(typeof STYLES)[number]>("Any style");
  const [lengthFilter, setLengthFilter] =
    useState<(typeof LENGTHS)[number]>("Any length");
  const [search, setSearch] = useState("");
  const practices = useMemo(
    () =>
      PRACTICES.filter(
        (practice) =>
          (filter === "All" || practice.intention === filter) &&
          (styleFilter === "Any style" || practice.style === styleFilter) &&
          (lengthFilter === "Any length" ||
            (lengthFilter === "Under 10 min"
              ? practice.duration < 10
              : practice.duration >= 10)) &&
          `${practice.title} ${practice.subtitle} ${practice.intention}`
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
      ),
    [filter, lengthFilter, search, styleFilter],
  );

  return (
    <AppPage
      title="Meditation library"
      subtitle="Choose a practice that meets you where you are."
    >
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search practices"
        accessibilityLabel="Search meditations"
        returnKeyType="search"
        style={{
          borderRadius: 16,
          borderWidth: 1,
          borderColor: APP_COLORS.border,
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: APP_COLORS.white,
          fontSize: 16,
        }}
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {FILTERS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === item }}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor:
                filter === item ? APP_COLORS.greenSoft : APP_COLORS.white,
              borderWidth: 1,
              borderColor: filter === item ? APP_COLORS.green : APP_COLORS.border,
            }}
          >
            <ThemedText>{item}</ThemedText>
          </Pressable>
        ))}
      </View>
      <ThemedText variant="heading" style={{ fontSize: 17 }}>
        Style
      </ThemedText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {STYLES.map((item) => (
          <Pressable
            key={item}
            onPress={() => setStyleFilter(item)}
            accessibilityRole="button"
            accessibilityState={{ selected: styleFilter === item }}
            style={{
              paddingHorizontal: 13,
              paddingVertical: 9,
              borderRadius: 18,
              backgroundColor:
                styleFilter === item ? APP_COLORS.greenSoft : APP_COLORS.white,
              borderWidth: 1,
              borderColor:
                styleFilter === item ? APP_COLORS.green : APP_COLORS.border,
            }}
          >
            <ThemedText>{item}</ThemedText>
          </Pressable>
        ))}
      </View>
      <ThemedText variant="heading" style={{ fontSize: 17 }}>
        Duration
      </ThemedText>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {LENGTHS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setLengthFilter(item)}
            accessibilityRole="button"
            accessibilityState={{ selected: lengthFilter === item }}
            style={{
              paddingHorizontal: 13,
              paddingVertical: 9,
              borderRadius: 18,
              backgroundColor:
                lengthFilter === item ? APP_COLORS.greenSoft : APP_COLORS.white,
              borderWidth: 1,
              borderColor:
                lengthFilter === item ? APP_COLORS.green : APP_COLORS.border,
            }}
          >
            <ThemedText>{item}</ThemedText>
          </Pressable>
        ))}
      </View>
      <SectionTitle>{practices.length} practices</SectionTitle>
      {practices.map((practice) => (
        <Pressable
          key={practice.id}
          onPress={() => router.push(`/meditations/${practice.id}`)}
          accessibilityRole="button"
        >
          <AppCard>
            <ThemedText variant="heading" style={{ fontSize: 20 }}>
              {practice.title}
            </ThemedText>
            <ThemedText style={{ marginTop: 4 }}>
              {practice.subtitle}
            </ThemedText>
            <ThemedText style={{ marginTop: 10, color: APP_COLORS.green }}>
              {practice.duration} min · {practice.style} · {practice.intention}
            </ThemedText>
          </AppCard>
        </Pressable>
      ))}
      {practices.length === 0 ? (
        <AppCard>
          <ThemedText variant="heading">No matches yet</ThemedText>
          <ThemedText style={{ marginTop: 5 }}>
            Try a different search or intention.
          </ThemedText>
        </AppCard>
      ) : null}
    </AppPage>
  );
}
