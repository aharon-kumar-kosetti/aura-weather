import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity, ArrowDown, ArrowRight, Bell, Check, ChevronRight, Cloud,
  CloudLightning, CloudRain, Crosshair, Database, Gauge, Layers3, Map,
  Pause, Play, Radio, Radar, Satellite, ScanLine, ShieldAlert, SlidersHorizontal,
  Waves, Wind, Zap, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Explore Architecture | StormSense" },
    { name: "description", content: "Explore the seven-stage flow behind StormSense weather intelligence, from atmospheric observations to public alerts." },
    { property: "og:title", content: "Explore Architecture | StormSense" },
    { property: "og:description", content: "An interactive look at how weather observations become actionable warnings in seven stages." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

type Stage = { title: string; short: string; description: string; icon: LucideIcon; tools: { name: string; icon: LucideIcon }[]; signal: string; readout: string };
const stages: Stage[] = [
  { title: "Data Sources", short: "Observe", description: "A network of independent feeds captures the atmosphere as it changes.", icon: Satellite, tools: [{ name: "Weather radar", icon: Radar }, { name: "Satellite", icon: Satellite }, { name: "Lightning networks", icon: Zap }, { name: "Weather stations", icon: Gauge }, { name: "Ocean data", icon: Waves }, { name: "Atmospheric models", icon: Cloud }], signal: "6 source families", readout: "Broad atmospheric coverage" },
  { title: "Data Ingestion", short: "Stream", description: "Incoming observations are synchronized into a continuous, time-aware stream.", icon: Radio, tools: [{ name: "Real-time streams", icon: Radio }], signal: "Continuous", readout: "Fresh observations arrive" },
  { title: "Processing", short: "Prepare", description: "Signals are cleaned, normalized and aligned across geography and time.", icon: SlidersHorizontal, tools: [{ name: "Data cleaning", icon: ScanLine }, { name: "Normalization", icon: SlidersHorizontal }, { name: "Spatial processing", icon: Crosshair }, { name: "Temporal processing", icon: Activity }], signal: "4 processing passes", readout: "Comparable, reliable inputs" },
  { title: "Intelligence Engine", short: "Understand", description: "Pattern recognition connects storm cells, movement and likely severity.", icon: Layers3, tools: [{ name: "Storm detection", icon: CloudLightning }, { name: "Pattern recognition", icon: Layers3 }, { name: "Movement tracking", icon: Wind }, { name: "Intensity estimation", icon: Gauge }], signal: "4 analysis layers", readout: "Weather patterns identified" },
  { title: "Nowcast Engine", short: "Predict", description: "Short-range projections show where conditions may move next.", icon: CloudRain, tools: [{ name: "0–15 min", icon: Gauge }, { name: "15–30 min", icon: Gauge }, { name: "30–60 min", icon: Gauge }], signal: "0–60 min horizon", readout: "Near-term outlook generated" },
  { title: "Alert Engine", short: "Evaluate", description: "Risk, confidence and location determine the right warning at the right time.", icon: ShieldAlert, tools: [{ name: "Risk detection", icon: ShieldAlert }, { name: "Confidence scoring", icon: Gauge }, { name: "Geographic targeting", icon: Crosshair }], signal: "Targeted alerts", readout: "Decision threshold assessed" },
  { title: "User Experience", short: "Act", description: "The result reaches people through clear dashboards, maps and notifications.", icon: Bell, tools: [{ name: "Command centre", icon: Activity }, { name: "Maps", icon: Map }, { name: "Alerts & notifications", icon: Bell }, { name: "Public dashboard", icon: Database }], signal: "Actionable output", readout: "People are informed" },
];

const sources = [
  { title: "Weather Radar", icon: Radar, type: "REMOTE SENSING", text: "Doppler reflectivity volumes reveal precipitation cores, hail spikes and storm structure." },
  { title: "INSAT / Satellite", icon: Satellite, type: "REMOTE SENSING", text: "Thermal infrared imagery provides cloud-top temperature, convective growth and cirrus tracking." },
  { title: "Lightning Detection", icon: Zap, type: "GROUND NETWORK", text: "Cloud-to-ground and in-cloud stroke detection feeds time-sensitive alerts." },
  { title: "Automatic Weather Stations", icon: Gauge, type: "IN-SITU", text: "Surface pressure, temperature, humidity and wind observations anchor model calibration." },
  { title: "Rain Gauges", icon: CloudRain, type: "IN-SITU", text: "Point accumulation measurements validate radar-derived rainfall estimates." },
  { title: "Numerical Weather Prediction", icon: Cloud, type: "MODEL DATA", text: "Background atmospheric fields supply CAPE, shear and moisture for the intelligence layer." },
  { title: "Ocean / Coastal Data", icon: Waves, type: "MARINE", text: "Sea-surface conditions support cyclone and coastal wind nowcasts." },
];

const series = {
  Rainfall: { unit: "mm/hr", color: "var(--chart-navy)", points: [18, 24, 22, 35, 48, 42, 57, 73, 68, 85, 78, 92], icon: CloudRain },
  Wind: { unit: "km/h", color: "var(--chart-green)", points: [24, 31, 36, 33, 44, 51, 48, 55, 62, 69, 65, 73], icon: Wind },
  Lightning: { unit: "strikes", color: "var(--chart-saffron)", points: [8, 14, 11, 25, 21, 35, 29, 48, 55, 49, 70, 82], icon: Zap },
};
type Metric = keyof typeof series;
const steps = ["Weather observation", "Storm detected", "Risk calculated", "Region identified", "Alert generated", "User notified"];

function Chart({ metric, selected, onSelect }: { metric: Metric; selected: number; onSelect: (index: number) => void }) {
  const data = series[metric];
  const coordinates = data.points.map((value, i) => ({ x: 36 + i * 52, y: 150 - value * 1.18 }));
  const line = coordinates.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  const area = `${line} L${coordinates[coordinates.length - 1]?.x ?? 608} 160 L36 160 Z`;
  return <div className="chart-wrap">
    <div className="chart-value"><span>{data.points[selected] ?? 0}</span> <small>{data.unit}</small><em>at +{selected * 5} min</em></div>
    <svg className="signal-chart" viewBox="0 0 650 185" role="img" aria-label={`${metric} forecast trend; select a point for its value`}>
      <defs><linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={data.color} stopOpacity=".26"/><stop offset="100%" stopColor={data.color} stopOpacity="0"/></linearGradient></defs>
      {[40, 80, 120, 160].map(y => <line key={y} x1="36" y1={y} x2="608" y2={y} stroke="var(--chart-grid)" strokeDasharray="3 6" />)}
      <path d={area} fill="url(#area-fill)" /><path d={line} fill="none" stroke={data.color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <line x1={coordinates[selected]?.x ?? 36} x2={coordinates[selected]?.x ?? 36} y1="24" y2="160" stroke={data.color} strokeOpacity=".45" strokeDasharray="3 5" />
      {coordinates.map((p, i) => <g key={i} onClick={() => onSelect(i)} className="chart-point" role="button" tabIndex={0} aria-label={`${i * 5} minutes, ${data.points[i]} ${data.unit}`} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(i); } }}><circle cx={p.x} cy={p.y} r="14" fill="transparent" /><circle cx={p.x} cy={p.y} r={selected === i ? 6 : 3} fill={selected === i ? "var(--chart-surface)" : data.color} stroke={data.color} strokeWidth={selected === i ? 3 : 0} /></g>)}
    </svg>
    <div className="chart-axis"><span>NOW</span><span>+15 MIN</span><span>+30 MIN</span><span>+45 MIN</span><span>+60 MIN</span></div>
  </div>;
}

function Index() {
  const [activeStage, setActiveStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [metric, setMetric] = useState<Metric>("Rainfall");
  const [selectedPoint, setSelectedPoint] = useState(8);
  const [activeStep, setActiveStep] = useState(4);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActiveStage(current => (current + 1) % stages.length), 4200);
    return () => window.clearInterval(timer);
  }, [playing]);
  const stage = stages[activeStage] ?? stages[0];
  if (!stage) return null;
  return <div className="site-shell">
    <header className="site-header"><div className="nav-inner">
      <a href="#top" className="brand" aria-label="StormSense home"><span className="brand-mark"><Activity size={19}/></span><span><strong>STORMSENSE</strong><small>WEATHER INTELLIGENCE · INDIA</small></span></a>
      <nav aria-label="Main navigation"><a href="#overview">OVERVIEW</a><a href="#intelligence">INTELLIGENCE</a><a href="#architecture" className="nav-active">EXPLORE ARCHITECTURE</a></nav>
      <div className="nav-location"><span className="live-dot"/> LIVE <span className="nav-divider"/> <Map size={13}/> INDIA</div>
    </div></header>

    <main id="top">
      <section className="title-band"><div className="container title-content"><div className="eyebrow light">SYSTEM OVERVIEW <span className="eyebrow-line"/></div><h1>Explore Architecture<span className="title-period">.</span></h1><p>The system behind weather intelligence — from the first signal to the final alert.</p></div></section>

      <section id="architecture" className="flow-section section-band"><div className="container">
        <div className="section-heading"><div><div className="eyebrow">END-TO-END FLOW <span className="eyebrow-line"/></div><h2>How an observation becomes a warning</h2><p>Seven stages turn raw atmospheric signals into a public alert.</p></div><div className="flow-controls"><span className="flow-counter">STAGE <strong>{String(activeStage + 1).padStart(2, "0")}</strong> / 07</span><Button variant="outline" size="icon" aria-label={playing ? "Pause flow animation" : "Play flow animation"} title={playing ? "Pause flow" : "Play flow"} onClick={() => setPlaying(!playing)}>{playing ? <Pause/> : <Play/>}</Button></div></div>
        <div className="flow-board">
          <div className="flow-list">{stages.map((item, index) => <Button key={item.title} variant="ghost" onClick={() => { setActiveStage(index); setPlaying(false); }} className={`flow-row ${activeStage === index ? "is-active" : ""}`} aria-pressed={activeStage === index}>
            <span className="stage-index"><span>STAGE {String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong></span>
            <span className="stage-track"><i className="track-dot"/></span>
            <span className="stage-content"><span className="stage-content-top"><span className="stage-summary"><item.icon size={17}/><span>{item.short}</span></span>{activeStage === index && <span className="active-caption">CURRENT STAGE <ChevronRight size={13}/></span>}</span><span className="tool-list">{item.tools.map(tool => <span className="tool-pill" key={tool.name}><tool.icon size={13}/>{tool.name}</span>)}</span></span>
          </Button>)}</div>
          <div className="flow-detail" aria-live="polite"><div className="detail-top"><span className="detail-number">0{activeStage + 1} / 07</span><stage.icon size={27}/></div><div><div className="eyebrow light">{stage.short.toUpperCase()} / {stage.title.toUpperCase()}</div><h3>{stage.title}</h3><p>{stage.description}</p></div><div className="detail-foot"><span><small>SIGNAL</small><strong>{stage.signal}</strong></span><span><small>OUTCOME</small><strong>{stage.readout}</strong></span></div><div className="detail-progress">{stages.map((item, index) => <Button key={item.title} variant="ghost" aria-label={`Go to stage ${index + 1}: ${item.title}`} title={item.title} className={activeStage === index ? "on" : ""} onClick={() => { setActiveStage(index); setPlaying(false); }}/>)}</div></div>
        </div><p className="section-note">Select any stage to follow a signal through the system. <ArrowDown size={13}/></p>
      </div></section>

      <section id="overview" className="sources-section section-band"><div className="container"><div className="section-heading"><div><div className="eyebrow">INPUTS <span className="eyebrow-line"/></div><h2>A multi-source view of the atmosphere</h2><p>Each source is an example of a configurable input — StormSense adapts to the feeds available.</p></div><span className="section-index">01 / INPUTS</span></div><div className="source-grid">{sources.map((source, i) => <div className="source-item" key={source.title}><div className="source-top"><source.icon size={22}/><span>{String(i + 1).padStart(2, "0")}</span></div><h3>{source.title}</h3><span className="source-type">{source.type} · EXAMPLE SOURCE</span><p>{source.text}</p></div>)}</div></div></section>

      <section id="intelligence" className="intelligence-section section-band"><div className="container"><div className="section-heading"><div><div className="eyebrow">INTELLIGENCE <span className="eyebrow-line"/></div><h2>The Nowcast Engine</h2><p>Atmospheric pattern recognition and short-range projection, working together.</p></div><span className="section-index">02 / ANALYSIS</span></div>
        <div className="engine-panel"><div className="engine-intro"><span className="engine-icon"><Layers3 size={24}/></span><div><strong>STORMSENSE ENGINE</strong><small>AI-ASSISTED ATMOSPHERIC INTELLIGENCE</small></div><span className="engine-live"><span className="live-dot"/> SIMULATION</span></div><div className="engine-modules">{[{ icon: Radar, label: "Storm detection" }, { icon: Crosshair, label: "Cell tracking" }, { icon: Wind, label: "Motion estimation" }, { icon: CloudRain, label: "Rainfall prediction" }, { icon: Zap, label: "Lightning prediction" }, { icon: ShieldAlert, label: "Severity classification" }, { icon: Gauge, label: "Confidence estimation" }].map(module => <span key={module.label}><module.icon size={16}/>{module.label}</span>)}</div></div>
        <div className="visualization"><div className="viz-heading"><div><span className="eyebrow">FORECAST SIGNAL / ILLUSTRATIVE DATA</span><h3>Short-range trend</h3></div><div className="metric-tabs" role="group" aria-label="Forecast metric">{(Object.keys(series) as Metric[]).map(name => { const Icon = series[name].icon; return <Button key={name} variant="ghost" aria-pressed={metric === name} className={metric === name ? "selected" : ""} onClick={() => { setMetric(name); setSelectedPoint(8); }}><Icon size={15}/>{name}</Button>; })}</div></div><Chart metric={metric} selected={selectedPoint} onSelect={setSelectedPoint}/><div className="viz-foot"><span><span className="live-dot"/> MODEL WINDOW · NEXT 60 MINUTES</span><span>Select a point on the timeline to inspect its value <ArrowRight size={14}/></span></div></div>
      </div></section>

      <section className="decision-section section-band"><div className="container"><div className="section-heading"><div><div className="eyebrow">DECISION SUPPORT <span className="eyebrow-line"/></div><h2>From data to decision</h2><p>Every alert traces a complete, auditable chain from raw observation to notification.</p></div><span className="section-index">03 / ACTION</span></div><div className="decision-steps">{steps.map((step, i) => <div className="decision-step-wrap" key={step}><Button variant="outline" className={`decision-step ${activeStep === i ? "selected" : ""}`} onClick={() => setActiveStep(i)} aria-pressed={activeStep === i}><span>{String(i + 1).padStart(2, "0")}</span>{step}</Button>{i < steps.length - 1 && <ArrowRight className="step-arrow" size={16}/>}</div>)}</div>
        <div className="alert-example"><div className="alert-main"><div className="eyebrow">ILLUSTRATIVE SCENARIO · STEP {String(activeStep + 1).padStart(2, "0")}</div><h3><ShieldAlert size={18}/> SEVERE THUNDERSTORM</h3><p>{["Radar and satellite feeds register a fast-growing convective cell near Visakhapatnam.", "The intelligence engine identifies a strengthening storm cell and begins tracking its motion.", "Observed structure and movement are combined to estimate local risk and forecast confidence.", "The likely impact area is narrowed to Visakhapatnam Region, Andhra Pradesh.", "A warning is drafted when severity and confidence pass the alert threshold.", "The warning is delivered through the command centre, maps and notifications."][activeStep]}</p></div><div className="alert-facts"><div><span>LOCATION</span><strong>Visakhapatnam Region, Andhra Pradesh</strong></div><div><span>EXPECTED</span><strong>Next 30–45 minutes</strong></div><div><span>CONFIDENCE</span><strong>92% · illustrative</strong></div><div><span>STATUS</span><strong className="status-text"><span className="live-dot"/> Monitoring</strong></div></div></div>
      </div></section>
    </main>
    <footer className="footer"><div className="container footer-main"><div><div className="footer-logo">STORMSENSE</div><div className="footer-kicker">REAL-TIME WEATHER INTELLIGENCE<br/>& NOWCASTING</div><p>Observe. Predict. Act. Real-time monitoring and short-range prediction for severe weather — when every minute matters.</p><p>StormSense is an independent platform and is not a Government of India organisation.</p></div><div><strong>PLATFORM</strong><a href="#top">Home</a><a href="#intelligence">Intelligence</a><a href="#architecture">Explore Architecture</a></div><div><strong>EXPLORE</strong><a href="#overview">Data Sources</a><a href="#intelligence">Nowcast Engine</a><a href="#architecture">System Flow</a></div><div><strong>REGION</strong><span><Map size={14}/> India</span><span><Check size={14}/> Illustrative experience</span></div></div><div className="container footer-bottom"><span>© 2026 StormSense</span><span>Built for weather intelligence, public awareness and operational decision support.</span></div></footer>
  </div>;
}
