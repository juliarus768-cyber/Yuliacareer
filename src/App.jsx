import { useMemo, useState } from 'react';

const STORAGE_KEY = 'summer-math-battle-v1';

const rewardCatalog = [
  '🍫 Chocolate', '🎵 Car DJ Pass', '🧋 Bubble Tea', '🥡 Pick Takeout', '🚗 DoorDash Delivery',
  '🍽️ Dinner with Mom', '🍔 Dinner with Dad', '🎬 Movie Night', '🧗 Rock Climbing', '☕ Starbucks Card',
  '🍎 Apple Gift Card', '🎮 PlayStation Card', '📱 Device Day',
].map((name, i) => ({ id: i + 1, name, cost: (i + 1) * 40 }));

const starter = {
  dayType: 'Weekday',
  children: {
    alex: {
      name: 'Alex', role: 'Battle Commander', theme: 'blue', level: 7, xp: 520, coins: 230, streak: 11,
      weakSkills: ['Fractions', 'BEDMAS', 'Long Division', 'Facts Recall'], minutes: 34, missions: 4,
      masteryDots: [1,2,3,4,5,6,7,8,9,10,11,12].map((n)=>({n,score:n<8?3:n<10?2:1})),
    },
    katya: {
      name: 'Katya', role: 'Mystery Detective', theme: 'pink', level: 4, xp: 410, coins: 190, streak: 9,
      weakSkills: ['Subtraction Fluency', 'Multiplication Facts', 'Long Division Basics'], minutes: 28, missions: 3,
      masteryDots: [1,2,3,4,5,6,7,8,9,10,11,12].map((n)=>({n,score:n<5?2:1})),
    },
  },
  rewardRequests: [],
};

const tabs = ['Home Dashboard', 'Daily Missions', 'Math Facts Trainer', 'Battle Mode', 'Money Lab', 'Reward Store', 'Grant Prize', 'Parent Dashboard'];
const tabIcons = ['🏠', '🗺️', '🧮', '⚔️', '💸', '🛍️', '🎁', '📊'];
const quests = [
  { name: 'Speed Round Surge', icon: '⚡', rarity: 'epic', diff: 'Easy' },
  { name: 'Logic Boss Battle', icon: '🧠', rarity: 'legend', diff: 'Hard' },
  { name: 'Money Lab Raid', icon: '💰', rarity: 'rare', diff: 'Medium' },
  { name: 'Mystery Case Files', icon: '🕵️', rarity: 'epic', diff: 'Medium' },
  { name: 'Streak Saver', icon: '🔥', rarity: 'rare', diff: 'Easy' },
  { name: 'Final Quest Review', icon: '🏆', rarity: 'legend', diff: 'Hard' },
];

function useLocalState() {
  const [state, setState] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : starter;
  });
  const update = (next) => {
    setState((prev) => {
      const value = typeof next === 'function' ? next(prev) : next;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return value;
    });
  };
  return [state, update];
}

function HeroPanel({ child, onComplete }) {
  const isKatya = child.name === 'Katya';
  const xpPct = Math.min(100, (child.xp % 500) / 5);
  const questPct = Math.round((child.missions / 6) * 100);
  return (
    <article className={`hero ${child.theme}`}>
      <div className="portrait-zone">
        <div className={`energy ${child.theme}`} />
        <div className="xp-ring" style={{ '--pct': `${xpPct}%` }}>
          <div className="portrait">
            <div className={`hair ${isKatya ? 'katya' : 'alex'}`} />
            <div className="face"><span className="eye" /><span className="eye" /><span className="mouth">{isKatya ? '▭▭▭' : '◡'}</span></div>
            <div className={`hoodie ${child.theme}`} />
            <div className="prop">{isKatya ? '🔦  📂' : '🎮  ⚔️'}</div>
          </div>
        </div>
        <div className="rank">{isKatya ? 'Mystery Rank: Shadow Sleuth' : 'Battle Rank: Neon Commander'}</div>
      </div>
      <div className="hero-stats">
        <h2>{child.name}</h2>
        <p>{child.role} · Level {child.level}</p>
        <div className="chips"><span>🪙 {child.coins} Coins</span><span className="streak">🔥 {child.streak} Streak</span></div>
        <div className="xp-bar"><span style={{ width: `${xpPct}%` }} /></div>
        <div className="quest-ring-label"><span>Quest Progress</span><strong>{questPct}%</strong></div>
        <div className="actions">
          <button onClick={onComplete}>Complete Quest +</button>
          <button>Enter VS Arena</button>
          <button>Open Prize Chest</button>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [state, setState] = useLocalState();
  const [tab, setTab] = useState('Home Dashboard');
  const total = useMemo(() => Object.values(state.children).map((c) => c.minutes).reduce((a, b) => a + b, 0), [state]);

  const requestReward = (child, reward) => setState((s) => ({ ...s, rewardRequests: [...s.rewardRequests, { child, reward: reward.name, status: 'Pending parent approval' }] }));
  const completeMission = (id) => setState((s) => {
    const child = s.children[id];
    const updated = { ...child, missions: Math.min(6, child.missions + 1), minutes: Math.min(60, child.minutes + (s.dayType === 'Weekend' ? 7 : 10)), xp: child.xp + 25, coins: child.coins + 15 };
    return { ...s, children: { ...s.children, [id]: updated } };
  });

  return (
    <div className="app">
      <div className="bg-layer" />
      <header className="topbar glass">
        <div className="brand"><h1>Summer Math Battle Tutor</h1><p>Level up learning like a real game</p></div>
        <div className="meta"><span>✨ XP {state.children.alex.xp + state.children.katya.xp}</span><span>🪙 Coins {state.children.alex.coins + state.children.katya.coins}</span><span>🔥 Streak Shield Active</span></div>
      </header>

      <nav className="tabs glass">{tabs.map((t, i) => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{tabIcons[i]} {t}</button>)}<button className="mode" onClick={() => setState((s) => ({ ...s, dayType: s.dayType === 'Weekday' ? 'Weekend' : 'Weekday' }))}>🗓️ {state.dayType}</button></nav>

      {tab === 'Home Dashboard' && (
        <section className="home-layout">
          <aside className="left-stack">
            <div className="event-card glass"><h3>⚡ Live Event</h3><p>Double XP weekend + Mystery Portal bonus coins.</p></div>
            <div className="widget glass"><h3>Today’s Goal</h3><p>{total}/120 minutes complete</p><div className="xp-bar"><span style={{ width: `${Math.min(100, (total / 120) * 100)}%` }} /></div></div>
            <div className="widget glass"><h3>Achievement Row</h3><div className="badges"><span>🏅 Accuracy</span><span>🛠️ Fix Hero</span><span>🚀 Never Give Up</span></div></div>
            <div className="widget glass"><h3>Daily Challenge</h3><p>Good try. Let’s fix the step.</p><p>Catch-up missions available.</p></div>
          </aside>

          <main className="heroes">
            <HeroPanel child={state.children.alex} onComplete={() => completeMission('alex')} />
            <HeroPanel child={state.children.katya} onComplete={() => completeMission('katya')} />
          </main>

          <aside className="right-stack">
            <div className="widget glass chest"><h3>🎁 Grant Prize Chest</h3><p>Tap to trigger surprise reward feel.</p><div className="pulse">CLAIM</div></div>
            <div className="widget glass"><h3>Sibling VS</h3><p>Alex ⚡ VS ⚡ Katya</p><p>Effort + accuracy + improvement points.</p></div>
            <div className="widget glass"><h3>Reward Preview</h3><div className="reward-mini"><span>🧋 Bubble Tea</span><span>🎬 Movie Night</span><span>🎮 PlayStation Card</span></div></div>
            <div className="widget glass"><h3>Progress Heatmap</h3><div className="heat">{Array.from({ length: 14 }).map((_, i) => <span key={i} className={`h${(i % 4) + 1}`} />)}</div></div>
          </aside>
        </section>
      )}

      {tab === 'Daily Missions' && <section className="quest-grid">{Object.values(state.children).map((c) => <article key={c.name} className={`glass quest-panel ${c.theme}`}><h2>{c.name} Quest Tracker</h2>{quests.map((q, i) => <div key={q.name} className={`quest ${q.rarity}`}><div><strong>{q.icon} {q.name}</strong><p>{q.diff} · {state.dayType === 'Weekend' ? '7' : '10'} min · Phase {i + 1}</p></div><div className="mini-bar"><span style={{ width: `${Math.min(100, c.missions * 16)}%` }} /></div></div>)}</article>)}</section>}

      {tab === 'Math Facts Trainer' && <section className="quest-grid">{Object.values(state.children).map((c) => <article key={c.name} className={`glass quest-panel ${c.theme}`}><h2>Facts Arena · {c.name}</h2><p>Multiplication 1–12 · Division · Speed · Missing Number · Mixed Quiz</p><div className="dots">{c.masteryDots.map((d) => <span key={d.n} className={`dot s${d.score}`}>{d.n}</span>)}</div></article>)}</section>}

      {tab === 'Battle Mode' && <section className="glass battle"><div><h2>Battle Arena</h2><p>Alex bonus: Check Before Submit +10</p></div><div className="vs">⚡ VS ⚡</div><div><p>Team bonus + effort + correction + mission completion.</p></div></section>}
      {tab === 'Money Lab' && <section className="glass panel"><h2>Money Lab</h2><p>Saving · Spending · Needs vs Wants · Budgeting · Delayed Gratification.</p></section>}

      {tab === 'Reward Store' && <section><div className="store-head"><h2>Reward Store</h2><p>Premium shelf · Surprise shelf · Parent approval required</p></div><div className="store-grid">{rewardCatalog.map((r, idx) => <article key={r.id} className={`glass store-card ${idx > 9 ? 'premium' : ''}`}><h3>{r.name}</h3><p>🪙 {r.cost}</p><p>{idx % 3 === 0 ? 'Legendary' : idx % 3 === 1 ? 'Epic' : 'Rare'}</p><div className="actions"><button onClick={() => requestReward('Alex', r)}>Alex</button><button onClick={() => requestReward('Katya', r)}>Katya</button></div></article>)}</div></section>}

      {tab === 'Grant Prize' && <section className="glass panel"><h2>Grant Prize System</h2><div className="chest-hero">🎁 MYSTERY CHEST</div><p>Surprise reward box · Mom bonus · Effort bonus · Correction bonus · No-giving-up bonus · Double XP weekend</p></section>}

      {tab === 'Parent Dashboard' && <section className="glass panel"><h2>Parent Dashboard</h2><div className="analytics">{Object.values(state.children).map((c) => <div key={c.name} className="ana"><p><strong>{c.name}</strong> {c.minutes} min · {c.missions}/6 · XP {c.xp} · Coins {c.coins}</p><div className="xp-bar"><span style={{ width: `${(c.minutes / 60) * 100}%` }} /></div><p>Weak: {c.weakSkills.join(', ')}</p><p>Strongest today: Word Problems · Mistakes corrected: {Math.floor(c.missions * 1.5)}</p></div>)}</div><h3>Reward Requests</h3>{state.rewardRequests.length === 0 ? <p>None yet.</p> : state.rewardRequests.map((r, i) => <p key={i}>📝 {r.child}: {r.reward} · {r.status}</p>)}</section>}
    </div>
  );
}
