import { Provider } from "react-redux";
import { store } from "@/redux/store";
import AppLayout from "./AppLayout"; // 👈 separate file or inline component

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppLayout />
    </Provider>
  );
}
