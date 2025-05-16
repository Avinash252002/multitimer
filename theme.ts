// theme.ts
import { createTheme } from "@rneui/themed";

export const lightTheme = createTheme({
  mode: "light",
  lightColors: {
    primary: "#1E90FF",
    background: "#F5F5F5",
  },
  components: {
    Button: {
      radius: 8,
    },
    Card: {
      containerStyle: {
        borderRadius: 10,
      },
    },
  },
});

export const darkTheme = createTheme({
  mode: "dark",
  darkColors: {
    primary: "#BB86FC",
    background: "#121212",
  },
  components: {
    Button: {
      radius: 8,
    },
    Card: {
      containerStyle: {
        borderRadius: 10,
        backgroundColor: "#1e1e1e",
      },
    },
  },
});
