import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import {
  updateTimerStatus,
  resetTimer,
  Timer,
} from "../redux/slices/timerSlice";

export default function TimerItem({ timer }: { timer: Timer }) {
  const dispatch = useDispatch();
  const progress = timer.remaining / timer.duration;

  return (
    <View style={styles.item}>
      <Text>{timer.name}</Text>
      <Text>Status: {timer.status}</Text>
      <Text>Remaining: {timer.remaining}s</Text>

      <View style={styles.buttons}>
        {(timer.status === "Idle" || timer.status === "Paused") && (
          <Button
            title="Start"
            onPress={() =>
              dispatch(updateTimerStatus({ id: timer.id, status: "Running" }))
            }
          />
        )}

        {timer.status === "Running" && (
          <Button
            title="Pause"
            onPress={() =>
              dispatch(updateTimerStatus({ id: timer.id, status: "Paused" }))
            }
          />
        )}

        <Button title="Reset" onPress={() => dispatch(resetTimer(timer.id))} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  progress: { height: 10, marginTop: 5 },
});
