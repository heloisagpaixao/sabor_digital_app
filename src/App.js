import { SafeAreaProvider, AuthProvider } from "react-native-safe-area-context"
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
