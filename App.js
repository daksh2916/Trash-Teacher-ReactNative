import { StyleSheet, Text, View } from "react-native";

import Navigation from "./components/navigate";
export default function App() {
  return (
    <View style={styles.container}>
      {/* <Login /> */}
      <Navigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
  },
});
