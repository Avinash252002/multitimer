import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useAppSelector } from "@/redux/hooks"; // Make sure this exists

export default function TabTwoScreen() {
  const completedTimers = useAppSelector((state) =>
    state.timers.timers.filter((timer) => timer.status === "Completed")
  );

  const formatDate = (isoString?: string) => {
    if (!isoString) return "Unknown";
    const date = new Date(isoString);
    return date.toLocaleString(); // You can customize formatting here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Completed Timers</Text>
      {completedTimers.length === 0 ? (
        <Text style={styles.empty}>No completed timers yet.</Text>
      ) : (
        <FlatList
          data={completedTimers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.timerItem}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>Category: {item.category}</Text>
              <Text style={styles.duration}>Duration: {item.duration}s</Text>
              <Text style={styles.completedAt}>
                Completed at: {formatDate(item.completedAt)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  timerItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: "600" },
  category: { fontSize: 14, color: "#555" },
  duration: { fontSize: 14, color: "#888" },
  completedAt: { fontSize: 14, color: "#444", marginTop: 4 },
});
