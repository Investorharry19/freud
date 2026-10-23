import { useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import BottomTabBar, {
  BOTTOM_TAB_BAR_HEIGHT,
} from "../../../components/navigation/bottom-tab-bar";
import Fonts from "../../../constants/fonts";
import OptionCard from "../../../components/generic/option-card";

const COLORS = {
  background: "#FAF6F0",
  card: "#F1E9DD",
  cardBorder: "#E8DECF",
  white: "#FFFFFF",
  green: "#8FA66A",
  greenSoft: "#E6ECD8",
  greenDark: "#6F8A4B",
  brown: "#2E1F17",
  brownMid: "#4F3422",
  orange: "#DE6420",
  orangeDeep: "#C9541A",
  orangeSoft: "#FBE3D3",
  chipBorder: "#EADFCF",
  grey: "#7A716C",
  greyLight: "#A39A94",
  border: "#EFE6DA",
  shadow: "#000000",
};

const expressions = [
  {
    name: "worst",
    image: require("../../../assets/sleep-worst.png"),
  },
  {
    name: "poor",
    image: require("../../../assets/sleep-poor.png"),
  },
  {
    name: "fair",
    image: require("../../../assets/sleep-fair.png"),
  },
  {
    name: "good",
    image: require("../../../assets/sleep-good.png"),
  },
  {
    name: "excellent",
    image: require("../../../assets/sleep-excellent.png"),
  },
];

const dailyJourney = [
  {
    label: "This is label one",
    selected: true,
  },
  {
    label: "This is label two",
    selected: false,
  },
  {
    label: "This is label three",
    selected: false,
  },
  {
    label: "This is label four",
    selected: false,
  },
];

const BUTTON_HEIGHT = 50;
type Mood = "calm" | "happy" | "reflective" | "anxious";

const MOODS: {
  value: Mood;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: "calm", label: "Calm", icon: "leaf" },
  { value: "happy", label: "Happy", icon: "sunny" },
  { value: "reflective", label: "Reflective", icon: "moon" },
  { value: "anxious", label: "Anxious", icon: "rainy" },
];

type Exercise = {
  id: string;
  tag: string;
  tagIcon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  tone: "orange" | "green";
  progress?: string; // only audio exercises have a player
};

const EXERCISES: Exercise[] = [
  {
    id: "breathe-out",
    tag: "Sound: Chirping Birds",
    tagIcon: "musical-notes",
    title: "Breathe Out",
    subtitle: "Grounding Pranayama",
    tone: "orange",
    progress: "05:02 / 25:00",
  },
  {
    id: "insights",
    tag: "AI Emotion Insights",
    tagIcon: "stats-chart",
    title: "Intelligent Tracking",
    subtitle: "82% Positive shifts",
    tone: "green",
  },
];

type Task = {
  id: string;
  title: string;
  meta: string;
  status: "done" | "active" | "upcoming";
  trailing?: string;
};

const TASKS: Task[] = [
  {
    id: "morning",
    title: "Morning Clarity Meditation",
    meta: "Completed at 8:15 AM • 10 mins",
    status: "done",
    trailing: "+20 xp",
  },
  {
    id: "midday",
    title: "Midday Emotion Check-in",
    meta: "Ready to start • 3 mins",
    status: "active",
  },
  {
    id: "evening",
    title: "Evening Freud Dream Journal",
    meta: "Scheduled at 9:30 PM • 5 mins",
    status: "upcoming",
    trailing: "Tonight",
  },
];

export default function Home() {
  const insets = useSafeAreaInsets();

  const [mood, setMood] = useState<Mood>("calm");

  const completed = TASKS.filter((t) => t.status === "done").length;

  // Plain render helpers (called as functions, not used as components)
  const renderMood = (m: (typeof MOODS)[number]) => {
    const active = mood === m.value;

    return (
      <Pressable
        key={m.value}
        onPress={() => setMood(m.value)}
        accessibilityRole="radio"
        accessibilityState={{ selected: active }}
        accessibilityLabel={m.label}
        style={({ pressed }) => ({
          height: 52,
          paddingHorizontal: 20,
          borderRadius: 26,
          borderWidth: 1.5,
          borderColor: active ? COLORS.green : COLORS.chipBorder,
          backgroundColor: active ? COLORS.green : COLORS.background,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Ionicons
          name={m.icon}
          size={20}
          color={active ? COLORS.white : COLORS.brown}
        />
        <ThemedText
          style={{
            fontSize: 18,
            color: active ? COLORS.white : COLORS.brown,
          }}
          variant="heading"
        >
          {m.label}
        </ThemedText>
      </Pressable>
    );
  };

  const renderExercise = (item: Exercise) => {
    const bg = item.tone === "orange" ? COLORS.orange : COLORS.green;

    return (
      <Pressable
        key={item.id}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.subtitle}`}
        style={({ pressed }) => ({
          width: 270,
          height: 255,
          borderRadius: 36,
          backgroundColor: bg,
          padding: 20,
          overflow: "hidden",
          opacity: pressed ? 0.95 : 1,
        })}
      >
        {/* Decorative circle */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: -70,
            bottom: -60,
            width: 190,
            height: 190,
            borderRadius: 95,
            backgroundColor: "rgba(255,255,255,0.12)",
          }}
        />

        {/* Tag */}
        <View
          style={{
            alignSelf: "flex-start",
            height: 36,
            paddingHorizontal: 14,
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.2)",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Ionicons name={item.tagIcon} size={14} color={COLORS.white} />
          <ThemedText
            style={{ fontSize: 14, color: COLORS.white }}
            variant="heading"
          >
            {item.tag}
          </ThemedText>
        </View>

        <ThemedText
          style={{ fontSize: 28, color: COLORS.white, marginTop: 20 }}
          variant="heading"
          numberOfLines={1}
        >
          {item.title}
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 17,
            color: "rgba(255,255,255,0.75)",
            marginTop: 2,
            fontFamily: Fonts.regular,
          }}
          variant="heading"
        >
          {item.subtitle}
        </ThemedText>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: "rgba(255,255,255,0.3)",
            marginTop: 22,
          }}
        />

        {/* Footer: audio player or mini bar chart */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {item.progress ? (
            <>
              <ThemedText
                style={{ fontSize: 18, color: COLORS.white }}
                variant="heading"
              >
                {item.progress}
              </ThemedText>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: COLORS.white,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="play"
                  size={22}
                  color={COLORS.orange}
                  style={{ marginLeft: 3 }}
                />
              </View>
            </>
          ) : (
            <View
              style={{ flexDirection: "row", alignItems: "flex-end", gap: 6 }}
            >
              {[14, 22, 18, 42, 30].map((h, i) => (
                <View
                  key={i}
                  style={{
                    width: 10,
                    height: h,
                    borderRadius: 5,
                    backgroundColor:
                      i === 3 ? COLORS.white : "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  const renderTask = (task: Task) => {
    const isDone = task.status === "done";
    const isActive = task.status === "active";

    return (
      <View
        key={task.id}
        style={{
          marginTop: 14,
          minHeight: 88,
          borderRadius: 30,
          borderWidth: isActive ? 2 : 1,
          borderColor: isActive ? COLORS.orangeSoft : COLORS.border,
          backgroundColor: isActive ? COLORS.white : "#FDFBF8",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 14,
          gap: 16,
          overflow: "hidden",
        }}
      >
        {isActive && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 6,
              backgroundColor: COLORS.orange,
            }}
          />
        )}

        {/* Status icon */}
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: isDone
              ? COLORS.greenSoft
              : isActive
                ? COLORS.orangeSoft
                : COLORS.card,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isDone ? (
            <Feather name="check" size={22} color={COLORS.green} />
          ) : isActive ? (
            <Ionicons
              name="play"
              size={20}
              color={COLORS.orange}
              style={{ marginLeft: 2 }}
            />
          ) : (
            <Ionicons name="moon" size={20} color="#E0B84A" />
          )}
        </View>

        {/* Text */}
        <View style={{ flex: 1 }}>
          <ThemedText
            style={{
              fontSize: 19,
              color: isDone ? COLORS.grey : COLORS.brown,
              textDecorationLine: isDone ? "line-through" : "none",
            }}
            variant="heading"
          >
            {task.title}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 15,
              marginTop: 2,
              color: isActive ? COLORS.orange : COLORS.greyLight,
              fontFamily: Fonts.regular,
            }}
            variant="heading"
          >
            {task.meta}
          </ThemedText>
        </View>

        {/* Trailing */}
        {isActive ? (
          <Pressable
            onPress={() => {
              router.push("/mood/check-in");
            }}
            accessibilityRole="button"
            accessibilityLabel={`Start ${task.title}`}
            hitSlop={8}
            style={({ pressed }) => ({
              height: 44,
              paddingHorizontal: 20,
              borderRadius: 22,
              backgroundColor: COLORS.brown,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <ThemedText
              style={{ fontSize: 17, color: COLORS.white }}
              variant="heading"
            >
              Start
            </ThemedText>
          </Pressable>
        ) : task.trailing ? (
          <ThemedText
            style={{
              fontSize: 18,
              color: isDone ? COLORS.green : COLORS.greyLight,
            }}
            variant="heading"
          >
            {task.trailing}
          </ThemedText>
        ) : null}
      </View>
    );
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        overflow: "hidden",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: insets.top + 16,
          paddingBottom: BOTTOM_TAB_BAR_HEIGHT + insets.bottom + 32,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",

            justifyContent: "space-between",
          }}
        >
          <View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 2,
                  borderRadius: 100,
                  borderWidth: 2,
                  borderColor: COLORS.orange,
                  width: 68,
                  height: 68,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../../assets/female-avatar.jpg")}
                  style={{
                    height: 60,
                    width: 60,
                    borderRadius: 100,
                  }}
                />
              </View>
              <Animated.View>
                <ThemedText
                  variant="heading"
                  style={{ fontSize: 24, color: COLORS.brown }}
                >
                  Hello Maggie
                </ThemedText>
                <ThemedText style={{ fontSize: 15, color: COLORS.brown }}>
                  How is your mind today?
                </ThemedText>
              </Animated.View>
            </View>
          </View>
          {/* Notifications */}
          <Pressable
            onPress={() => {
              router.push("/reminders");
            }}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={({ pressed }) => ({
              marginLeft: 10,
              borderColor: COLORS.border,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons
              name="notifications-outline"
              size={30}
              color={COLORS.brown}
            />
            <View
              style={{
                position: "absolute",
                top: -1,
                right: 5,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: COLORS.orange,
                borderWidth: 2,
                borderColor: COLORS.white,
              }}
            />
          </Pressable>
        </View>

        <View
          style={{
            marginTop: 24,
            backgroundColor: COLORS.white,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            padding: 16,
            borderRadius: 30,
            alignItems: "center",
            gap: 16,
          }}
        >
          <ThemedText
            variant="heading"
            style={{ fontSize: 20, color: COLORS.brown }}
          >
            How are you feeling today?
          </ThemedText>
          <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
            {expressions.map((expression) => (
              <Pressable
                key={expression.name}
                onPress={() => router.push("/mood/check-in")}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  alignItems: "center",
                })}
              >
                <Image
                  source={expression.image}
                  style={{ width: 50, height: 50 }}
                />
                <ThemedText> {expression.name} </ThemedText>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => router.push("/mood/check-in")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderWidth: 1,
              borderColor: COLORS.brownMid,
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <ThemedText
              variant="body"
              style={{ fontSize: 18, color: COLORS.brown }}
            >
              Log your mood
            </ThemedText>
          </Pressable>
        </View>

        <View
          style={{
            marginTop: 32,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            backgroundColor: COLORS.green + "95",
            padding: 16,
            borderRadius: 30,
          }}
        >
          <Image
            source={require("../../../assets/freud_ai.png")}
            style={{
              width: 40,
              height: 40,
              transform: [{ scaleX: -1 }],
            }}
          />
          <View>
            <ThemedText
              variant="heading"
              style={{ color: COLORS.white, fontSize: 15 }}
            >
              Need to talk?
            </ThemedText>
            <ThemedText style={{ color: COLORS.white, fontSize: 13 }}>
              Chat with freud ai
            </ThemedText>
          </View>
          <Pressable
            onPress={() => router.push("/tabs/ai-chat")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginLeft: "auto",
              backgroundColor: COLORS.brown,
              paddingVertical: 5,
              paddingHorizontal: 15,
              borderRadius: 50,
            }}
          >
            <ThemedText style={{ color: COLORS.white, fontSize: 13 }}>
              Start chatting
            </ThemedText>
            <Ionicons
              name="arrow-forward"
              size={20}
              color={COLORS.white}
              style={{ marginLeft: "auto" }}
            />
          </Pressable>
        </View>

        <View
          style={{
            marginTop: 30,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 25,
            }}
          >
            <ThemedText style={{ fontSize: 25 }}>Today&apos;s Journey</ThemedText>
            <ThemedText
              style={{
                fontSize: 15,
                backgroundColor: COLORS.greenSoft,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 40,
              }}
            >
              {" "}
              1 of 4 completed
            </ThemedText>
          </View>
          <View style={{ gap: 8 }}>
            {dailyJourney.map((journey, index) => {
              return (
                <OptionCard
                  key={index}
                  label={journey.label}
                  icon={journey.selected ? "check-circle" : "dots-circle"}
                  selected={journey.selected}
                  onPress={() =>
                    router.push(
                      index === 0 ? "/meditations" : "/mood/check-in",
                    )
                  }
                />
              );
            })}
          </View>
        </View>

        {/* Mood prompt */}
        {/* <View
          style={{
            marginTop: 28,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText
            style={{ flex: 1, fontSize: 24, color: COLORS.brown }}
            variant="heading"
          >
            How is your mind feeling today?
          </ThemedText>
          <Pressable
            hitSlop={8}
            onPress={() => {
              // TODO: router.push("/mood/log")
            }}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <ThemedText
              style={{ fontSize: 18, color: COLORS.orange }}
              variant="heading"
            >
              Log
            </ThemedText>
            <Feather name="arrow-right" size={16} color={COLORS.orange} />
          </Pressable>
        </View> */}

        {/* Mood chips (full-bleed so they scroll under the screen edge) */}
        {/* <ScrollView
          horizontal
          accessibilityRole="radiogroup"
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 16, marginHorizontal: -16 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        >
          {MOODS.map(renderMood)}
        </ScrollView> */}

        {/* AI companion card */}
        {/* <View
          style={{
            marginTop: 20,
            borderRadius: 44,
            backgroundColor: COLORS.card,
            borderWidth: 1.5,
            borderColor: COLORS.cardBorder,
            padding: 24,
            overflow: "hidden",
          }}
        >
          
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: -60,
              right: -80,
              width: 300,
              height: 300,
              borderRadius: 150,
              backgroundColor: "#EADFCC",
            }}
          />

          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1.25 }}>
              <View
                style={{
                  alignSelf: "flex-start",
                  height: 36,
                  paddingHorizontal: 14,
                  borderRadius: 18,
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: COLORS.cardBorder,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: COLORS.green,
                  }}
                />
                <ThemedText
                  style={{ fontSize: 14, color: COLORS.brown }}
                  variant="heading"
                >
                  AI COMPANION ACTIVE
                </ThemedText>
              </View>

              <ThemedText
                style={{
                  fontSize: 30,
                  lineHeight: 38,
                  color: COLORS.brown,
                  marginTop: 18,
                }}
                variant="heading"
              >
                Personalize Your Mental Health State
              </ThemedText>
            </View>

         
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../../assets/auth-screen-logo.png")}
                resizeMode="contain"
                style={{ width: 130, height: 160 }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 4,
                  right: 0,
                  height: 30,
                  paddingHorizontal: 12,
                  borderRadius: 15,
                  backgroundColor: COLORS.orange,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Ionicons name="bulb" size={13} color={COLORS.white} />
                <ThemedText
                  style={{ fontSize: 14, color: COLORS.white }}
                  variant="heading"
                >
                  AI
                </ThemedText>
              </View>
            </View>
          </View>

          <ThemedText
            style={{
              fontSize: 19,
              lineHeight: 28,
              color: COLORS.grey,
              marginTop: 14,
              maxWidth: "70%",
              fontFamily: Fonts.regular,
            }}
            variant="heading"
          >
            "Ready for our daily 3-minute mental decompression?"
          </ThemedText>

          <View
            style={{
              marginTop: 16,
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              onPress={() => router.push("/tabs/ai-chat")}
              accessibilityRole="button"
              style={({ pressed }) => ({
                height: BUTTON_HEIGHT + 6,
                paddingHorizontal: 28,
                borderRadius: (BUTTON_HEIGHT + 6) / 2,
                backgroundColor: COLORS.brown,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <ThemedText
                style={{ fontSize: 19, color: COLORS.white }}
                variant="heading"
              >
                Talk with Freud
              </ThemedText>
              <Feather name="arrow-right" size={20} color={COLORS.white} />
            </Pressable>

            <View
              style={{
                height: 38,
                paddingHorizontal: 14,
                borderRadius: 19,
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderColor: COLORS.cardBorder,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#2BB673",
                }}
              />
              <ThemedText
                style={{ fontSize: 16, color: COLORS.brown }}
                variant="heading"
              >
                Listening
              </ThemedText>
            </View>
          </View>
        </View> */}

        {/* Mindful Exercises */}
        {/* <View
          style={{
            marginTop: 36,
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <View>
            <ThemedText
              style={{ fontSize: 28, color: COLORS.brown }}
              variant="heading"
            >
              Mindful Exercises
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 18,
                color: COLORS.grey,
                marginTop: 2,
                fontFamily: Fonts.regular,
              }}
              variant="heading"
            >
              Curated for your calm state
            </ThemedText>
          </View>
          <Pressable
            hitSlop={8}
            onPress={() => {
              // TODO: router.push("/exercises")
            }}
          >
            <ThemedText
              style={{ fontSize: 18, color: COLORS.brown }}
              variant="heading"
            >
              View all ({EXERCISES.length + 10})
            </ThemedText>
          </Pressable>
        </View> */}

        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={270 + 16}
          decelerationRate="fast"
          style={{ marginTop: 20, marginHorizontal: -16 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        >
          {EXERCISES.map(renderExercise)}
        </ScrollView> */}

        {/* Today's Mindful Path */}
        {/* <View
          style={{
            marginTop: 36,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText
            style={{ fontSize: 28, color: COLORS.brown }}
            variant="heading"
          >
            Today’s Mindful Path
          </ThemedText>
          <ThemedText
            style={{ fontSize: 18, color: COLORS.greenDark }}
            variant="heading"
          >
            {completed} of {TASKS.length} Completed
          </ThemedText>
        </View> */}

        {/* <View style={{ marginTop: 6 }}>{TASKS.map(renderTask)}</View> */}

        {/* Progress note */}
        {/* <View
          style={{
            marginTop: 24,
            borderRadius: 30,
            borderWidth: 1.5,
            borderColor: "#D5DFC0",
            backgroundColor: COLORS.greenSoft,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          <View
            style={{
              width: 62,
              height: 62,
              borderRadius: 20,
              backgroundColor: COLORS.green,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="leaf" size={30} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText
              style={{ fontSize: 20, color: COLORS.brown }}
              variant="heading"
            >
              You're making steady progress!
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 17,
                lineHeight: 24,
                marginTop: 2,
                color: COLORS.grey,
                fontFamily: Fonts.regular,
              }}
              variant="heading"
            >
              Alex, you spent 18 more mindful minutes today compared to last
              Thursday.
            </ThemedText>
          </View>
        </View> */}
      </ScrollView>

      <BottomTabBar />
    </Animated.View>
  );
}
