import { useState } from "react";
import { Footer, Header } from "./components/chrome";
import { Tool, type Launch } from "./components/tool";
import { IsIsNot, Log, Science } from "./components/sections";
import { useLocalStorage } from "./hooks";
import { type SessionEntry } from "./data";

export default function App() {
  const [log, setLog] = useLocalStorage<SessionEntry[]>("ppis-log-v1", []);
  const [launch, setLaunch] = useState<Launch | null>(null);

  return (
    <div className="min-h-screen font-body text-white bg-bg">
      <Header sessionCount={log.length} />
      <main>
        <Tool
          onLogged={(e) => setLog((prev) => [e, ...prev])}
          launch={launch}
        />
        <Science />
        <Log entries={log} onClear={() => setLog([])} />
        <IsIsNot />
      </main>
      <Footer />
    </div>
  );
}
