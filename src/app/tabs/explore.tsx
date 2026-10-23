import { Pressable, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import TabPage from "../../../components/tabs/tab-page";

const COLORS = {
  white: "#FFFFFF",
  brown: "#2E1F17",
  grey: "#7A716C",
  green: "#8FA66A",
  greenSoft: "#E6ECD8",
  orange: "#DE6420",
  orangeSoft: "#FBE3D3",
  border: "#E8DECF",
};

export default function Practices() {
  return (
    <TabPage
      title="Mindful practices"
      subtitle="Small moments of care to help you find your calm."
    >
      <Pressable
        onPress={() => router.push("/meditations/breathe-out")}
        accessibilityRole="button"
        accessibilityLabel="Start Breathe Out, a grounding breathing practice"
        style={({ pressed }) => ({
          minHeight: 220,
          borderRadius: 30,
          padding: 24,
          backgroundColor: COLORS.orange,
          justifyContent: "space-between",
          opacity: pressed ? 0.94 : 1,
        })}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
        >
          <Ionicons name="leaf" size={25} color={COLORS.white} />
        </View>
        <View>
          <ThemedText
            style={{ fontSize: 27, color: COLORS.white }}
            variant="heading"
          >
            Breathe Out
          </ThemedText>
          <ThemedText style={{ color: COLORS.white, marginTop: 4 }}>
            Grounding Pranayama
          </ThemedText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <ThemedText
              style={{ fontSize: 17, color: COLORS.white }}
              variant="heading"
            >
              Start practice
            </ThemedText>
            <Feather
              name="arrow-right"
              size={20}
              color={COLORS.white}
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>
      </Pressable>

      <ThemedText
        style={{ fontSize: 23, color: COLORS.brown, marginTop: 30 }}
        variant="heading"
      >
        Explore by intention
      </ThemedText>
      <Pressable
        onPress={() => router.push("/meditations")}
        accessibilityRole="button"
        style={({ pressed }) => ({
          minHeight: 54,
          borderRadius: 27,
          marginTop: 14,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.brown,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <ThemedText
          style={{ color: COLORS.white, fontSize: 17 }}
          variant="heading"
        >
          Browse all practices
        </ThemedText>
      </Pressable>
      <Pressable
        onPress={() => router.push("/meditations?intention=Sleep")}
        accessibilityRole="button"
        style={{
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.border,
          backgroundColor: COLORS.white,
          padding: 20,
          marginTop: 14,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: COLORS.greenSoft,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <Ionicons name="moon" size={24} color={COLORS.green} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText
            style={{ fontSize: 19, color: COLORS.brown }}
            variant="heading"
          >
            Unwind and reset
          </ThemedText>
          <ThemedText style={{ color: COLORS.grey, marginTop: 3 }}>
            Take a quiet moment for yourself.
          </ThemedText>
        </View>
      </Pressable>

      <Pressable
        onPress={() => router.push("/mood/check-in")}
        accessibilityRole="button"
        style={{
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.border,
          backgroundColor: COLORS.orangeSoft,
          padding: 20,
          marginTop: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: COLORS.white,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <Ionicons name="heart" size={24} color={COLORS.orange} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText
            style={{ fontSize: 19, color: COLORS.brown }}
            variant="heading"
          >
            Check in with yourself
          </ThemedText>
          <ThemedText style={{ color: COLORS.grey, marginTop: 3 }}>
            Notice what you need today.
          </ThemedText>
        </View>
      </Pressable>
    </TabPage>
  );
}
