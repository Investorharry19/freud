import { Stack } from "expo-router";

export default function NoTabs() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
