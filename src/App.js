import { SafeAreaProvider } from "react-native";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <HomeScreen />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
