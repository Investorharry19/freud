import { useCallback, useRef, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  useWindowDimensions,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import { useAppTheme } from "../../../components/theme/theme-provider";

const COLORS = {
  error: "#D93C3C",
};

// Replace with your 23 avatars
const AVATARS: ImageSourcePropType[] = [
  require("../../../assets/avatars/avatar-1.jpg"),
  require("../../../assets/avatars/avatar-2.jpg"),
  require("../../../assets/avatars/avatar-3.jpg"),
  require("../../../assets/avatars/avatar-4.jpg"),
  require("../../../assets/avatars/avatar-5.jpg"),
];

const ITEM_SIZE = 150;
const GAP = 20;
const SNAP = ITEM_SIZE + GAP;
const UPLOAD_SIZE = 150;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<ImageSourcePropType>,
);

/* ---------- Pressable with spring scale ---------- */

function ScalePressable({
  onPress,
  children,
  style,
  scaleTo = 0.95,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  style?: any;
  scaleTo?: number;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(scaleTo, { damping: 15 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 12 }))}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

/* ---------- Carousel item ---------- */

function AvatarItem({
  source,
  index,
  scrollX,
  onPress,
  inactiveTileColor,
  selectedTileColor,
}: {
  source: ImageSourcePropType;
  index: number;
  scrollX: SharedValue<number>;
  onPress: (index: number) => void;
  inactiveTileColor: string;
  selectedTileColor: string;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * SNAP, index * SNAP, (index + 1) * SNAP];
    return {
      transform: [
        { translateY: interpolate(scrollX.value, input, [30, 0, 30], "clamp") },
        { scale: interpolate(scrollX.value, input, [0.96, 1, 0.96], "clamp") },
      ],
      backgroundColor: interpolateColor(scrollX.value, input, [
        inactiveTileColor,
        selectedTileColor,
        inactiveTileColor,
      ]),
    };
  });

  return (
    <Pressable onPress={() => onPress(index)}>
      <Animated.View
        style={[
          {
            width: ITEM_SIZE,
            height: ITEM_SIZE,
            borderRadius: 60,
            borderCurve: "continuous",
            overflow: "hidden",
          },
          animatedStyle,
        ]}
      >
        <Image
          source={source}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </Animated.View>
    </Pressable>
  );
}

/* ---------- Screen ---------- */

export default function SelectAvatar() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { colors } = useAppTheme();

  const listRef = useRef<FlatList<ImageSourcePropType>>(null);
  const scrollX = useSharedValue(0);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [uploadedUri, setUploadedUri] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const sidePadding = (width - ITEM_SIZE) / 2;

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SNAP);
    setSelectedIndex(Math.min(Math.max(index, 0), AVATARS.length - 1));
    // Picking a premade avatar replaces any uploaded photo
    setUploadedUri(null);
    setUploadError(null);
  };

  const scrollToAvatar = useCallback((index: number) => {
    listRef.current?.scrollToOffset({ offset: index * SNAP, animated: true });
  }, []);

  const pickImage = async () => {
    setUploadError(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setUploadError("Please allow photo access to upload a picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (result.canceled) return;
    const asset = result.assets[0];

    if (asset.mimeType && !ALLOWED_TYPES.includes(asset.mimeType)) {
      setUploadError("Only jpg and png files are allowed.");
      return;
    }
    if (asset.fileSize && asset.fileSize > MAX_FILE_BYTES) {
      setUploadError("That file is larger than 5mb.");
      return;
    }

    setUploadedUri(asset.uri);
  };

  const handleContinue = () => {
    const avatar = uploadedUri
      ? { type: "upload", uri: uploadedUri }
      : { type: "premade", index: selectedIndex };
    console.log("Selected avatar:", avatar);
    // router.push({ pathname: "/your-next-route", params: { ... } });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
    >
      {/* ---------- Header ---------- */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          paddingHorizontal: 26,
          paddingTop: 12,
        }}
      >
        <ScalePressable
          onPress={() => router.back()}
          style={{
            height: 50,
            width: 50,
            borderRadius: 15,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="chevron-left" size={25} color={colors.icon} />
        </ScalePressable>
        <ThemedText
          variant="heading"
          style={{ fontSize: 20, color: colors.heading }}
        >
          Assessment
        </ThemedText>
      </Animated.View>

      {/* ---------- Avatar carousel ---------- */}
      <Animated.View
        entering={FadeIn.delay(100).duration(500)}
        style={{ marginTop: 28, height: ITEM_SIZE + 40 }}
      >
        <AnimatedFlatList
          ref={listRef}
          data={AVATARS}
          keyExtractor={(_, i) => `avatar-${i}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP}
          decelerationRate="fast"
          disableIntervalMomentum
          scrollEventThrottle={16}
          onScroll={onScroll}
          onMomentumScrollEnd={onMomentumEnd}
          contentContainerStyle={{ paddingHorizontal: sidePadding }}
          ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
          getItemLayout={(_, index) => ({
            length: SNAP,
            offset: SNAP * index,
            index,
          })}
          renderItem={({ item, index }) => (
            <AvatarItem
              source={item}
              index={index}
              scrollX={scrollX}
              onPress={scrollToAvatar}
              inactiveTileColor={colors.border}
              selectedTileColor={colors.heading}
            />
          )}
        />
      </Animated.View>

      {/* ---------- Heading ---------- */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(450)}
        style={{ alignItems: "center", paddingHorizontal: 32, marginTop: 20 }}
      >
        <ThemedText
          variant="heading"
          style={{
            fontSize: 30,
            lineHeight: 46,
            color: colors.heading,
            textAlign: "center",
          }}
        >
          Select your Avatar
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 17,
            lineHeight: 30,
            color: colors.mutedText,
            fontWeight: "600",
            textAlign: "center",
            marginTop: 14,
          }}
        >
          We have {AVATARS.length} custom premade avatars, or you can upload
          profile locally
        </ThemedText>
      </Animated.View>

      {/* ---------- Upload ---------- */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(450)}
        style={{ alignItems: "center", marginTop: 40, flex: 1 }}
      >
        <ScalePressable
          onPress={pickImage}
          style={{
            height: UPLOAD_SIZE,
            width: UPLOAD_SIZE,
            borderRadius: UPLOAD_SIZE / 2,
            borderWidth: 1.5,
            borderStyle: uploadedUri ? "solid" : "dashed",
            borderColor: colors.heading,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {uploadedUri ? (
            <Animated.Image
              key={uploadedUri}
              entering={FadeIn.duration(300)}
              source={{ uri: uploadedUri }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <Feather name="upload" size={35} color={colors.icon} />
          )}
        </ScalePressable>

        <ThemedText
          style={{
            fontSize: 17,
            color: colors.heading,
            marginTop: 28,
          }}
        >
          {uploadedUri ? "Tap to change photo" : "or Upload from Local File"}
        </ThemedText>

        {uploadError ? (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <ThemedText
              style={{
                fontSize: 16,
                color: COLORS.error,
                fontWeight: "600",
                marginTop: 12,
              }}
            >
              {uploadError}
            </ThemedText>
          </Animated.View>
        ) : (
          <ThemedText
            style={{
              fontSize: 18,
              color: colors.mutedText,
              fontWeight: "600",
              marginTop: 12,
            }}
          >
            Max 5mb, Format: jpg,png
          </ThemedText>
        )}
      </Animated.View>

      {/* ---------- Continue ---------- */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(450)}
        style={{
          paddingHorizontal: 26,
          paddingBottom: insets.bottom + 16,
        }}
      >
        <ScalePressable
          onPress={handleContinue}
          scaleTo={0.97}
          style={{
            height: 60,
            borderRadius: 25,
            backgroundColor: colors.heading,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
          }}
        >
          <ThemedText
            variant="heading"
            style={{ color: colors.surface, fontSize: 16 }}
          >
            Continue
          </ThemedText>
          <Feather name="arrow-right" size={28} color={colors.surface} />
        </ScalePressable>
      </Animated.View>
    </View>
  );
}
