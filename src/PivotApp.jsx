import { useState, useRef, useCallback, useEffect } from "react";

const C = {
  bg: "#07080d",
  surface: "#0d1018",
  surfaceAlt: "#131720",
  border: "#1c2230",
  borderHover: "#2a3347",
  gold: "#c8973c",
  goldLight: "#e0b25a",
  goldGlow: "rgba(200,151,60,0.15)",
  text: "#ede8de",
  muted: "#5a6478",
  mutedLight: "#8a96aa",
  error: "#e05252",
};

const TABS = [
  { label: "Resume", key: "resume", icon: "📄" },
  { label: "Cover Letter", key: "coverLetter", icon: "✉️" },
  { label: "LinkedIn About", key: "linkedinAbout", icon: "💼" },
  { label: "Talking Points", key: "interviewTalkingPoints", icon: "🎯" },
];

const inputStyle = {
  width: "100%",
  background: C.surfaceAlt,
  border: `1px solid ${C.border}`,
  borderRadius: "8px",
  padding: "10px 14px",
  color: C.text,
  fontFamily: "'DM Sans', system-ui, sans-serif",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: C.mutedLight,
  marginBottom: "6px",
};

function Field({ label, value, onChange, placeholder, textarea, rows = 3, optional }) {
  const [focused, setFocused] = useState(false);
  const style = {
    ...inputStyle,
    borderColor: focused ? C.gold : C.border,
    resize: textarea ? "vertical" : undefined,
    minHeight: textarea ? `${rows * 24 + 20}px` : undefined,
  };
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>
        {label}
        {optional && <span style={{ color: C.muted, fontWeight: 400, marginLeft: 6, textTransform: "none", letterSpacing: 0 }}>optional</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={style}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={style}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      )}
    </div>
  );
}

function LoadingSpinner() {
  const [dots, setDots] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const messages = [
    "Analyzing your background",
    "Mapping transferable skills",
    "Crafting your pivot narrative",
    "Writing your resume",
    "Drafting your cover letter",
    "Polishing your LinkedIn story",
    "Building your talking points",
    "Almost ready",
  ];

  useEffect(() => {
    const d = setInterval(() => setDots(p => p.length >= 3 ? "" : p + "."), 400);
    const m = setInterval(() => setMsgIndex(p => (p + 1) % messages.length), 2200);
    return () => { clearInterval(d); clearInterval(m); };
  }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: C.bg, gap: "32px",
    }}>
      <div style={{ position: "relative", width: 72, height: 72 }}>
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          border: `2px solid ${C.border}`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          border: `2px solid transparent`,
          borderTopColor: C.gold,
          animation: "spin 1s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: "16px",
          borderRadius: "50%",
          border: `1px solid transparent`,
          borderTopColor: C.goldLight,
          animation: "spin 0.6s linear infinite reverse",
        }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "16px", color: C.text, fontWeight: 500, marginBottom: 8 }}>
          {messages[msgIndex]}{dots}
        </div>
        <div style={{ fontSize: "12px", color: C.muted }}>Generating your full pivot package</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ResultsView({ results, onReset }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentTab = TABS[activeTab];
  const content = results[currentTab.key];
  const displayText = Array.isArray(content) ? content.join("\n\n") : content;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        padding: "20px 32px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "18px", fontFamily: "'DM Serif Display', Georgia, serif", color: C.gold }}>pivot</span>
          <span style={{
            fontSize: "11px", padding: "2px 8px",
            background: "rgba(200,151,60,0.1)", border: `1px solid rgba(200,151,60,0.25)`,
            borderRadius: "20px", color: C.gold, letterSpacing: "0.06em",
          }}>PACKAGE READY</span>
        </div>
        <button onClick={onReset} style={{
          background: "transparent", border: `1px solid ${C.border}`,
          borderRadius: "8px", padding: "6px 14px", color: C.mutedLight,
          cursor: "pointer", fontSize: "13px", fontFamily: "'DM Sans', system-ui, sans-serif",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.target.style.borderColor = C.borderHover; e.target.style.color = C.text; }}
          onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.mutedLight; }}
        >← Start Over</button>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Tab sidebar */}
        <div style={{
          width: 200, borderRight: `1px solid ${C.border}`,
          padding: "24px 16px", flexShrink: 0,
        }}>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: C.muted, marginBottom: 12, paddingLeft: 8 }}>YOUR PACKAGE</div>
          {TABS.map((tab, i) => (
            <button key={tab.key} onClick={() => setActiveTab(i)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: "8px", border: "none",
              background: activeTab === i ? "rgba(200,151,60,0.1)" : "transparent",
              color: activeTab === i ? C.goldLight : C.mutedLight,
              cursor: "pointer", fontSize: "13px", fontWeight: activeTab === i ? 600 : 400,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              textAlign: "left", transition: "all 0.15s",
              borderLeft: activeTab === i ? `2px solid ${C.gold}` : "2px solid transparent",
            }}
              onMouseEnter={e => { if (activeTab !== i) e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { if (activeTab !== i) e.currentTarget.style.color = C.mutedLight; }}
            >
              <span style={{ fontSize: 15 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflow: "auto", padding: "32px 40px", position: "relative" }}>
          <div style={{ maxWidth: 740, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "22px", fontWeight: 400, color: C.text, margin: 0,
              }}>{currentTab.icon} {currentTab.label}</h2>
              <button onClick={handleCopy} style={{
                background: copied ? "rgba(200,151,60,0.15)" : "transparent",
                border: `1px solid ${copied ? C.gold : C.border}`,
                borderRadius: "8px", padding: "6px 14px",
                color: copied ? C.gold : C.mutedLight,
                cursor: "pointer", fontSize: "12px", fontWeight: 500,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                transition: "all 0.2s", letterSpacing: "0.02em",
              }}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>

            {Array.isArray(content) ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {content.map((point, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 16, alignItems: "flex-start",
                    background: C.surfaceAlt, borderRadius: "10px",
                    padding: "16px 20px", border: `1px solid ${C.border}`,
                  }}>
                    <span style={{
                      flexShrink: 0, width: 26, height: 26,
                      background: "rgba(200,151,60,0.1)", border: `1px solid rgba(200,151,60,0.25)`,
                      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: 700, color: C.gold,
                    }}>{i + 1}</span>
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.7, color: C.text }}>{point}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: C.surfaceAlt, borderRadius: "12px",
                padding: "28px 32px", border: `1px solid ${C.border}`,
                fontSize: "13.5px", lineHeight: "1.85",
                color: C.text, whiteSpace: "pre-wrap", fontFamily: "'DM Sans', system-ui, sans-serif",
              }}>
                {content}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PivotApp() {
  const [phase, setPhase] = useState("input");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeBase64, setResumeBase64] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    currentRole: "", targetRole: "", targetCompany: "",
    yearsExp: "", keyWins: "", whyPivoting: "",
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  const handleFile = useCallback((file) => {
    if (!file || file.type !== "application/pdf") return;
    setResumeFile(file);
    const reader = new FileReader();
    reader.onload = () => setResumeBase64(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  }, []);

  const update = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const handleGenerate = async () => {
    if (!form.currentRole.trim() || !form.targetRole.trim()) {
      setError("Current role and target role are required to generate your package.");
      return;
    }
    setError(null);
    setPhase("loading");

    try {
      const userContent = [];
      if (resumeBase64) {
        userContent.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: resumeBase64 } });
      }
      userContent.push({
        type: "text",
        text: `Create a complete career pivot package for this professional.

Current Role: ${form.currentRole}
Target Role: ${form.targetRole}
${form.targetCompany ? `Target Company: ${form.targetCompany}` : ""}
${form.yearsExp ? `Years of Experience: ${form.yearsExp}` : ""}
${form.keyWins ? `Key Wins & Skills: ${form.keyWins}` : ""}
${form.whyPivoting ? `Motivation for Pivot: ${form.whyPivoting}` : ""}
${resumeBase64 ? "Resume PDF attached above — use this as the primary source for their experience." : "No resume uploaded — use the details provided."}

Return ONLY a valid JSON object with exactly these keys:
{
  "resume": "full polished resume as plain text. Use ALL CAPS for section headers like 'EXPERIENCE', 'SKILLS', etc. Use line breaks for formatting. Make it ATS-friendly and tailored to the target role.",
  "coverLetter": "compelling 3-paragraph cover letter. Open with the pivot narrative, connect their transferable experience, close with enthusiasm. Authentic, not generic.",
  "linkedinAbout": "LinkedIn About section in first person. 3-4 paragraphs. Conversational and warm but professional. Tells the pivot story compellingly. Under 2600 characters.",
  "interviewTalkingPoints": ["6 specific talking points as strings, each 2-3 sentences. Each point bridges a specific skill or experience from their current background to a concrete need in the target role."]
}

Make every section specific and genuinely useful for this exact pivot. Reframe powerfully.`,
      });

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: "You are an elite career pivot strategist and executive resume writer. You help professionals powerfully reframe their experience for new roles. You write with specificity, clarity, and authentic voice. ALWAYS return ONLY valid JSON — no preamble, no explanation, no markdown code fences. Just the raw JSON object.",
          messages: [{ role: "user", content: userContent }],
        }),
      });

      const data = await resp.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const clean = text.replace(/^```json\s*/m, "").replace(/```\s*$/m, "").trim();
      const parsed = JSON.parse(clean);
      setResults(parsed);
      setPhase("results");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setPhase("input");
    }
  };

  if (phase === "loading") return <LoadingSpinner />;
  if (phase === "results" && results) return <ResultsView results={results} onReset={() => { setPhase("input"); setResults(null); }} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: ${C.muted} !important; }
        textarea { font-family: 'DM Sans', system-ui, sans-serif !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>

      {/* Nav */}
      <div style={{
        padding: "20px 40px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center",
      }}>
        <span style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "22px", color: C.gold, letterSpacing: "-0.01em",
        }}>pivot</span>
        <span style={{ color: C.muted, fontSize: "13px", marginLeft: 12 }}>career transition toolkit</span>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 40px" }}>
        {/* Hero */}
        <div style={{ marginBottom: 48, maxWidth: 560 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(32px, 5vw, 46px)", fontWeight: 400,
            lineHeight: 1.2, color: C.text, margin: "0 0 16px",
          }}>
            Your background is<br />
            <span style={{ color: C.gold }}>already the story.</span>
          </h1>
          <p style={{ fontSize: "16px", color: C.mutedLight, lineHeight: 1.6, margin: 0 }}>
            Tell us where you've been and where you're going. We'll generate your complete pivot package — resume, cover letter, LinkedIn, and interview talking points — in under a minute.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
          {/* Left: Upload */}
          <div>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleFile && ((e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); })}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              style={{
                border: `2px dashed ${dragOver ? C.gold : resumeFile ? C.gold : C.border}`,
                borderRadius: "14px", padding: "40px 24px",
                background: dragOver ? C.goldGlow : resumeFile ? "rgba(200,151,60,0.05)" : C.surfaceAlt,
                cursor: "pointer", textAlign: "center",
                transition: "all 0.2s", marginBottom: 24,
              }}
            >
              <input
                ref={fileInputRef} type="file" accept=".pdf"
                style={{ display: "none" }}
                onChange={e => handleFile(e.target.files[0])}
              />
              {resumeFile ? (
                <>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: C.goldLight, marginBottom: 4 }}>{resumeFile.name}</div>
                  <div style={{ fontSize: "12px", color: C.muted }}>Click to replace</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📎</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: C.text, marginBottom: 6 }}>Drop your resume here</div>
                  <div style={{ fontSize: "12px", color: C.muted }}>PDF only · Click to browse</div>
                </>
              )}
            </div>

            <div style={{
              background: C.surfaceAlt, borderRadius: "12px",
              padding: "16px 20px", border: `1px solid ${C.border}`,
              fontSize: "12px", color: C.mutedLight, lineHeight: 1.6,
            }}>
              <strong style={{ color: C.text, display: "block", marginBottom: 6 }}>No resume? No problem.</strong>
              Fill in the form and we'll build everything from scratch. A resume helps us be more specific, but the form alone works great.
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <Field label="Current Role / Title" value={form.currentRole} onChange={update("currentRole")} placeholder="e.g. Account Executive" />
            <Field label="Target Role" value={form.targetRole} onChange={update("targetRole")} placeholder="e.g. Product Manager" />
            <Field label="Target Company" value={form.targetCompany} onChange={update("targetCompany")} placeholder="e.g. Salesforce" optional />
            <Field label="Years of Experience" value={form.yearsExp} onChange={update("yearsExp")} placeholder="e.g. 7 years" optional />
            <Field label="Key Wins & Skills" value={form.keyWins} onChange={update("keyWins")} placeholder="e.g. Closed $2M in ARR, managed 40+ enterprise accounts, led cross-functional product rollouts..." textarea rows={3} optional />
            <Field label="Why Are You Making This Pivot?" value={form.whyPivoting} onChange={update("whyPivoting")} placeholder="e.g. I've been the voice of the customer in every sales role — I want to be the one building the product they need." textarea rows={3} optional />
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: 24, padding: "12px 16px",
            background: "rgba(224,82,82,0.08)", border: `1px solid rgba(224,82,82,0.25)`,
            borderRadius: "8px", color: C.error, fontSize: "13px",
          }}>{error}</div>
        )}

        <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleGenerate}
            style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              border: "none", borderRadius: "10px",
              padding: "14px 36px", cursor: "pointer",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: "15px", fontWeight: 600, color: "#07080d",
              letterSpacing: "0.01em",
              boxShadow: `0 4px 24px rgba(200,151,60,0.25)`,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            Generate My Pivot Package →
          </button>
        </div>

        <p style={{ textAlign: "right", fontSize: "11px", color: C.muted, marginTop: 10 }}>
          Takes ~30–60 seconds · All 4 sections generated at once
        </p>
      </div>
    </div>
  );
}
