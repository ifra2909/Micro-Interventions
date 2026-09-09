import { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Footer, Header } from "./components/chrome";
import { Tool, type Launch } from "./components/tool";
import { IsIsNot, Log, Science } from "./components/sections";
import { SciencePage } from "./components/SciencePage";
import { useLocalStorage } from "./hooks";
import { type SessionEntry } from "./data";

export default function App() {
  const [log, setLog] = useLocalStorage<SessionEntry[]>("ppis-log-v1", []);
  const [launch, setLaunch] = useState<Launch | null>(null);

  return (
    <HashRouter>
      <div className="min-h-screen font-body text-white bg-bg">
        <Header sessionCount={log.length} />
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <Tool
                  onLogged={(e) => setLog((prev) => [e, ...prev])}
                  launch={launch}
                />
                <Science />
                <Log entries={log} onClear={() => setLog([])} />
                <IsIsNot />
              </main>
            }
          />
          <Route path="/science" element={<SciencePage />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
}
