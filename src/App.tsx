import { useState } from "react";
import CosmicScene from "./scenes/CosmicScene";
import EarthListeningPanel from "./components/ui/EarthListeningPanel";

function App() {
  const [earthSelected, setEarthSelected] =
    useState(false);

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        background: "#02030a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CosmicScene
        onEarthSelect={() => {
          setEarthSelected(true);
        }}
      />

      <EarthListeningPanel
        visible={earthSelected}
        onClose={() => {
          setEarthSelected(false);
        }}
      />
    </main>
  );
}

export default App;