import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import TimerItem from "./TimerItem";
import { useDispatch } from "react-redux";
import { bulkAction, Timer } from "../redux/slices/timerSlice";

export default function CategorySection({
  category,
  timers,
}: {
  category: string;
  timers: Timer[];
}) {
  const [expanded, setExpanded] = useState(true);
  const dispatch = useDispatch();

  const handleBulk = (type: "start" | "pause" | "reset") =>
    dispatch(bulkAction({ category, type }));

  const allCompleted = timers.every((timer) => timer.status === "Completed");
  const allPaused = timers.every((timer) => timer.status === "Paused");
  const allRunning = timers.every((timer) => timer.status === "Running");

  return (
    <View style={styles.section}>
      <Text style={styles.title} onPress={() => setExpanded(!expanded)}>
        {category}
      </Text>
      {expanded && (
        <>
          {timers.map((timer) => (
            <TimerItem key={timer.id} timer={timer} />
          ))}
          ;
          <View style={styles.bulkButtons}>
            {timers.some(
              (t) => t.status === "Idle" || t.status === "Paused"
            ) && (
              <Button title="Start All" onPress={() => handleBulk("start")} />
            )}

            {timers.some((t) => t.status === "Running") && (
              <Button title="Pause All" onPress={() => handleBulk("pause")} />
            )}

            <Button title="Reset All" onPress={() => handleBulk("reset")} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold" },
  bulkButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
