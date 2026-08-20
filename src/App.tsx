import { useState } from "react";
import { Ambient, Footer, Header, Marquee } from "./components/chrome";
import { Tool, type Launch } from "./components/tool";
import { HowItWorks, IsIsNot, Library, Log, Science } from "./components/sections";
import { useLocalStorage } from "./hooks";
import { CITATIONS, type SessionEntry } from "./data";

export default function App() {
  const [log, setLog] = useLocalStorage<SessionEntry[]>("ppis-log-v1", []);
  const [launch, setLaunch] = useState<Launch | null>(null);

  return (
    <div className="grain min-h-screen font-body text-ink">
      <Ambient />
      <Header sessionCount={log.length} />
      <main>
        <Tool
          onLogged={(e) => setLog((prev) => [e, ...prev])}
          launch={launch}
        />
        <Marquee />
        <HowItWorks />
        <Science />
        <Library onLaunch={(id) => setLaunch({ id, ts: Date.now() })} />
        <Log entries={log} onClear={() => setLog([])} />
        <IsIsNot />
      </main>
      <Footer citations={CITATIONS} />
    </div>
  );
}
