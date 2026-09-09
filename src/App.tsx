import { useState } from "react";
import { Footer, Header } from "./components/chrome";
import { Tool, type Launch } from "./components/tool";
import { IsIsNot, Log } from "./components/sections";
import { useLocalStorage } from "./hooks";
import { CITATIONS, type SessionEntry } from "./data";

export default function App() {
  const [log, setLog] = useLocalStorage<SessionEntry[]>("ppis-log-v1", []);
  const [launch, setLaunch] = useState<Launch | null>(null);

  return (
    <div className="min-h-screen font-body text-ink bg-cream">
      <Header sessionCount={log.length} />
      <main>
        <Tool
          onLogged={(e) => setLog((prev) => [e, ...prev])}
          launch={launch}
        />
        <Log entries={log} onClear={() => setLog([])} />
        <IsIsNot />
      </main>
      <Footer citations={CITATIONS} />
    </div>
  );
}
