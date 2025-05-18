import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Clock, Tag } from "lucide-react-native";
import { useTimers } from "@/context/TimerContext";
import { formatTime, timeAgo } from "@/utils/timerUtils";
import EmptyState from "@/components/EmptyState";
import ExportButton from "@/components/ExportButton";
import { useTheme } from "@/context/ThemeContext";
import { darkTheme, lightTheme } from "@/styles/theme";
export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { timerLogs } = useTimers();
  const { theme } = useTheme();
  const colors = theme === "light" ? lightTheme : darkTheme;

  // Sort logs by completion time (newest first)
  const sortedLogs = [...timerLogs].sort(
    (a, b) => b.completedAt - a.completedAt
  );

  if (timerLogs.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, backgroundColor: colors.background },
        ]}
      >
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Timer History
          </Text>
        </View>
        <EmptyState type="history" />
      </View>
    );
  }

  

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors.background },
      ]}
    >
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Timer History
        </Text>
      </View>
      <ExportButton timerLogs={timerLogs} />
      <FlatList
        data={sortedLogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View
            style={[
              styles.historyItem,
              {
                backgroundColor: colors.background,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <View style={styles.itemHeader}>
              <Text style={[styles.itemName, { color: colors.text }]}>
                {item.name}
              </Text>
              <View style={styles.categoryTag}>
                <Tag size={14} color="#6A5ACD" />
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>

            <View style={styles.itemDetails}>
              <View style={styles.detailItem}>
                <Clock size={16} color="#666" />
                <Text
                  style={[styles.detailText, { color: colors.textSecondary }]}
                >
                  {formatTime(item.duration, "full")}
                </Text>
              </View>

              <Text style={styles.timeAgo}>{timeAgo(item.completedAt)}</Text>
            </View>
          </View>
        )}
      />

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    color: "#333",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for bottom tabs
  },
  historyItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#6A5ACD",
    marginLeft: 4,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  timeAgo: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#999",
  },
});
