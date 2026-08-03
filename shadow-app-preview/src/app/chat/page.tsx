import DemoShell from "@/components/DemoShell";
import { FAKE_MESSAGES, FAKE_USER } from "@/lib/fakeData";

export default function ChatPreview() {
  return (
    <DemoShell>
      <div className="bg-cyber-grid relative flex min-h-0 min-w-0 flex-1 flex-col bg-gradient-to-b from-bg-main to-bg-nav p-6">
        <header className="animate-fade-in-up mb-5 flex items-center justify-between rounded-2xl border border-bg-input bg-bg-panel px-6 py-4 shadow-[0_0_25px_-12px_var(--border-glow)]">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              <span className="bg-gradient-to-r from-accent to-green bg-clip-text text-transparent"># Global</span>
            </h1>
            <p className="text-xs text-text-muted">Signed in as {FAKE_USER.nickname} · OWNER</p>
          </div>
          <span className="rounded-full border border-green px-4 py-2 text-xs font-bold text-green opacity-50">INVITE USER</span>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {FAKE_MESSAGES.map((m) => (
            <div key={m.id} className="animate-fade-in-up flex items-start gap-3 rounded-lg">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-bg-nav"
                style={{ backgroundColor: m.color }}
              >
                {m.sender.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex max-w-[720px] flex-col items-start">
                <div className="mb-1 flex items-center gap-2 px-1 text-xs">
                  <span className="font-bold" style={{ color: m.color }}>
                    {m.sender}
                  </span>
                  <span className="text-text-muted">{m.time}</span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm ${
                    m.sender === FAKE_USER.nickname
                      ? "border border-accent/30 bg-bg-panel shadow-[0_0_18px_-10px_var(--border-glow)]"
                      : "bg-bubble-other"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-3 rounded-2xl border border-bg-input bg-bg-panel px-5 py-3 opacity-70">
            <span className="text-base">📎</span>
            <span className="flex-1 text-sm text-text-muted">Preview only - message sending is disabled</span>
            <span className="shrink-0 rounded-full bg-bg-input px-5 py-2 text-sm font-bold text-text-muted">Send</span>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
