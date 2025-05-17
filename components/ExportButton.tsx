import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  View,
} from "react-native";
import { Download } from "lucide-react-native";
import { TimerLog } from "@/types";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

interface ExportButtonProps {
  timerLogs: TimerLog[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ timerLogs }) => {
  const exportData = async () => {
    try {
      const jsonData = JSON.stringify(timerLogs, null, 2);

      const fileUri =
        FileSystem.documentDirectory + `timer-history-${Date.now()}.json`;

      // Write file to device
      await FileSystem.writeAsStringAsync(fileUri, jsonData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Share the file (opens native share dialog)
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/json",
        dialogTitle: "Export Timer History",
      });
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={exportData}>
      <Download size={18} color="#fff" />
      <Text style={styles.buttonText}>Export History</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: '#6A5ACD',
    marginTop: 16,
    marginEnd: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    transitionDuration: "200ms",
  },
  buttonText: {
    fontFamily: "Inter-SemiBold",
    color: "#fff",
    fontSize: 14,
    marginLeft: 8,
  },
});

export default ExportButton;
