import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Timer {
  id: string;
  name: string;
  duration: number;
  remaining: number;
  category: string;
  status: "Idle" | "Running" | "Paused" | "Completed";
  completedAt?: string;
}

interface TimersState {
  timers: Timer[];
}

const initialState: TimersState = {
  timers: [],
};

const saveToStorage = (timers: Timer[]) => {
  AsyncStorage.setItem("timers", JSON.stringify(timers));
};

const timersSlice = createSlice({
  name: "timers",
  initialState,
  reducers: {
    loadTimers(state, action: PayloadAction<Timer[]>) {
      state.timers = action.payload;
    },
    addTimer(
      state,
      action: PayloadAction<{
        name: string;
        duration: number;
        category: string;
      }>
    ) {
      const timer: Timer = {
        id: nanoid(),
        ...action.payload,
        status: "Idle",
        remaining: action.payload.duration,
      };
      state.timers.push(timer);
      saveToStorage(state.timers);
    },
    updateTimerStatus(
      state,
      action: PayloadAction<{ id: string; status: Timer["status"] }>
    ) {
      const timer = state.timers.find((t) => t.id === action.payload.id);
      if (timer) {
        timer.status = action.payload.status;
        saveToStorage(state.timers);
      }
    },
    tickTimer(state, action: PayloadAction<string>) {
      const timer = state.timers.find((t) => t.id === action.payload);
      if (timer && timer.remaining > 0) {
        timer.remaining -= 1;
        if (timer.remaining === 0) {
          timer.status = "Completed";
          timer.completedAt = new Date().toISOString();
        }

        saveToStorage(state.timers);
      }
    },
    resetTimer(state, action: PayloadAction<string>) {
      const timer = state.timers.find((t) => t.id === action.payload);
      if (timer) {
        timer.remaining = timer.duration;
        timer.status = "Idle";
        saveToStorage(state.timers);
      }
    },
    removeTimer(state, action: PayloadAction<string>) {
      state.timers = state.timers.filter((t) => t.id !== action.payload);
      AsyncStorage.setItem("timers", JSON.stringify(state.timers));
    },
    bulkAction(
      state,
      action: PayloadAction<{
        category: string;
        type: "start" | "pause" | "reset";
      }>
    ) {
      state.timers.forEach((timer) => {
        if (timer.category === action.payload.category) {
          if (action.payload.type === "start") timer.status = "Running";
          else if (action.payload.type === "pause") timer.status = "Paused";
          else if (action.payload.type === "reset") {
            timer.remaining = timer.duration;
            timer.status = "Idle";
          }
        }
      });
      saveToStorage(state.timers);
    },
  },
});

export const {
  loadTimers,
  addTimer,
  updateTimerStatus,
  tickTimer,
  resetTimer,
  bulkAction,
  removeTimer,
} = timersSlice.actions;
export default timersSlice.reducer;
