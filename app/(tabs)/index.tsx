import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  Button,
} from "react-native";

import { useRouter } from "expo-router";

export default function App() {
  return <View style={styles.container}><Text>Welcome to timer</Text></View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "yellow",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: "#000",
    fontSize: 24,
    fontFamily: "Poppins_400Regular",
  },

  distantBox: {
    marginTop: 40, // spacing from the above element
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
