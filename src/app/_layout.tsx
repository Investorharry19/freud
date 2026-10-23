import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "../../components/theme/theme-provider";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Fredoka-Regular": require("../../fonts/Fredoka-Regular.ttf"),
    "Fredoka-Medium": require("../../fonts/Fredoka-Medium.ttf"),
    "Fredoka-Bold": require("../../fonts/Fredoka-Bold.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
