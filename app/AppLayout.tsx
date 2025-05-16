import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ThemeProvider } from '@rneui/themed';
import { lightTheme, darkTheme } from '@/theme';
import { useAppSelector } from "@/redux/hooks";


SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const [loaded] = useFonts({
    Poppins_400Regular,
  });

  const { theme } = useAppSelector((state) => state.theme);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider theme={currentTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
