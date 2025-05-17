import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CategoryGroup from "@/components/CategoryGroup";
import CompletionModal from "@/components/CompletionModal";
import HalfwayAlertModal from "@/components/HalfwayAlertModal";
import EmptyState from "@/components/EmptyState";
import { useTimers } from "@/context/TimerContext";
import { Timer } from "@/types";
import CategoryFilter from "@/components/CategoryFilter";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { darkTheme, lightTheme } from "@/styles/theme";

export default function TimersScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const colors = theme === "light" ? lightTheme : darkTheme;
  const {
    timers,
    categories,
    expandedCategories,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleCategoryExpand,
    startAllTimersInCategory,
    pauseAllTimersInCategory,
    resetAllTimersInCategory,
    markHalfwayTriggered,
  } = useTimers();

  const [completedTimer, setCompletedTimer] = useState<Timer | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [halfwayAlertTimer, setHalfwayAlertTimer] = useState<Timer | null>(
    null
  );
  const [showHalfwayAlert, setShowHalfwayAlert] = useState(false);

  const handleShowCompletionModal = (timer: Timer) => {
    // Only show if not already showing for this timer
    if (
      !showCompletionModal ||
      (completedTimer && completedTimer.id !== timer.id)
    ) {
      setCompletedTimer(timer);
      setShowCompletionModal(true);
    }
  };

  const handleHalfwayAlert = (timer: Timer) => {
    if (!timer.halfwayAlertTriggered) {
      setHalfwayAlertTimer(timer);
      setShowHalfwayAlert(true);
      markHalfwayTriggered(timer.id);
    }
  };

  const closeCompletionModal = () => {
    setShowCompletionModal(false);
  };

  const closeHalfwayAlert = () => {
    setShowHalfwayAlert(false);
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter timers by selected category
  const filteredTimers = selectedCategory
    ? timers.filter((timer) => timer.category === selectedCategory)
    : timers;

  // Group timers by category
  const timersByCategory = categories.reduce<Record<string, Timer[]>>(
    (acc, category) => {
      acc[category] = filteredTimers.filter(
        (timer) => timer.category === category
      );
      return acc;
    },
    {}
  );

  if (timers.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, backgroundColor: colors.background },
        ]}
      >
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>Timer App</Text>
          <ThemeToggle />
        </View>
        <EmptyState type="timers" />
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
        <Text style={[styles.title, { color: colors.text }]}>Timer App</Text>
        <ThemeToggle />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        {categories.map(
          (category) =>
            timersByCategory[category] &&
            timersByCategory[category].length > 0 && (
              <CategoryGroup
                key={category}
                category={category}
                timers={timersByCategory[category]}
                isExpanded={expandedCategories.includes(category)}
                onToggleExpand={toggleCategoryExpand}
                onStartAll={startAllTimersInCategory}
                onPauseAll={pauseAllTimersInCategory}
                onResetAll={resetAllTimersInCategory}
                onStart={startTimer}
                onPause={pauseTimer}
                onReset={resetTimer}
                onShowCompletionModal={handleShowCompletionModal}
                onHalfwayAlert={handleHalfwayAlert}
              />
            )
        )}
      </ScrollView>

      <CompletionModal
        visible={showCompletionModal}
        timer={completedTimer}
        onClose={closeCompletionModal}
      />

      <HalfwayAlertModal
        visible={showHalfwayAlert}
        timer={halfwayAlertTimer}
        onClose={closeHalfwayAlert}
      />

      <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100, // Extra padding for bottom tabs
  },
});
