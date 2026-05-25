import { useMemo, useState } from 'react';

const STORAGE_KEY = 'summer-math-battle-v1';

const rewardCatalog = [
  '🍫 Chocolate', '🎵 Pick music in the car', '🧋 Bubble tea', '🥡 Pick takeout', '🚗 DoorDash delivery',
  '🍽️ Restaurant with mom', '🍔 Restaurant with dad', '🎬 Movie', '🧗 Rock climbing', '☕ Starbucks card',
  '🍎 Apple gift card', '🎮 PlayStation card', '📱 Device day with no classes',
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

const missions = [
  { name: 'Math Facts', icon: '⚡', diff: 'easy' },
  { name: 'Weak Skill', icon: '🧠', diff: 'hard' },
  { name: 'Word Problems', icon: '📘', diff: 'medium' },
  { name: 'Money Mission', icon: '💰', diff: 'medium' },
  { name: 'Battle Challenge', icon: '🏆', diff: 'hard' },
  { name: 'Review & Reflect', icon: '🔥', diff: 'easy' },
];

function AvatarCard({ child }) {
  const isKatya = child.name === 'Katya';
  return (
    <div className={`hero-card ${child.theme}`}>
      <div className="avatar-stage">
        <div className={`avatar aura ${child.theme}`} />
        <div className={`avatar-body ${child.theme}`}>
          <div className={`hair ${isKatya ? 'katya' : 'alex'}`} />
          <div className="face">
            <span className="eye" />
            <span className="eye" />
            <span className="smile">{isKatya ? '▭▭▭' : '◡'}</span>
          </div>
          <div className={`hoodie ${child.theme}`} />
          <div className="gear">{isKatya ? '🔦  📂' : '🎮  ⚔️'}</div>
        </div>
      </div>
      <div className="hero-meta">
        <h2>{child.name} · {child.role}</h2>
        <p>{isKatya ? 'Mystery Portal Detective • Neon Clue Hunter' : 'Neon Battle Commander • Tactical Logic Arena'}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [state, setState] = useLocalState();
  const [tab, setTab] = useState('Home Dashboard');

  const total = useMemo(() => Object.values(state.children).map((c) => c.minutes).reduce((a, b) => a + b, 0), [state]);

  const requestReward = (child, reward) => setState((s) => ({
    ...s,
    rewardRequests: [...s.rewardRequests, { child, reward: reward.name, status: 'Pending parent approval' }],
  }));

  const completeMission = (id) => setState((s) => {
    const child = s.children[id];
    const updated = {
      ...child,
      missions: Math.min(6, child.missions + 1),
      minutes: Math.min(60, child.minutes + (s.dayType === 'Weekend' ? 7 : 10)),
      xp: child.xp + 25,
      coins: child.coins + 15,
    };
    return { ...s, children: { ...s.children, [id]: updated } };
  });

  return (
    <div className="app">
      <div className="particles" />
      <header>
        <h1>Summer Math Battle Tutor</h1>
        <p className="sub">Premium Learning Arena · Build Skills · Earn Rewards · Protect Streaks</p>
        <div className="event-banner">🎉 EVENT: Double XP Weekend + Mystery Chest Drops</div>
        <div className="controls">
          {['Home Dashboard', 'Daily Missions', 'Math Facts Trainer', 'Battle Mode', 'Money Lab', 'Reward Store', 'Grant Prize', 'Parent Dashboard'].map((item) => (
            <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>
          ))}
          <button className="mode" onClick={() => setState((s) => ({ ...s, dayType: s.dayType === 'Weekday' ? 'Weekend' : 'Weekday' }))}>Mode: {state.dayType}</button>
        </div>
      </header>

      {tab === 'Home Dashboard' && (
        <section className="grid two">
          {Object.entries(state.children).map(([id, c]) => {
            const xpPct = Math.min(100, (c.xp % 500) / 5);
            const missionPct = Math.round((c.missions / 6) * 100);
            return (
              <article key={id} className={`card ${c.theme}`}>
                <AvatarCard child={c} />
                <div className="stats-row">
                  <span className="badge lvl">⭐ Lvl {c.level}</span>
                  <span className="badge coin">🪙 {c.coins}</span>
                  <span className="badge streak">🔥 {c.streak}</span>
                </div>
                <p className="label">XP Progress</p>
                <div className="xp-wrap giant"><div className="xp-bar" style={{ width: `${xpPct}%` }} /></div>
                <div className="ring-line"><span>Mission Ring</span><strong>{missionPct}%</strong></div>
                <div className="progress-ring"><div style={{ '--p': `${missionPct}%` }} /></div>
                <div className="row"><button onClick={() => completeMission(id)}>+ Complete Mission</button><button>Sibling Challenge</button></div>
                <div className="row"><button>Grant Prize Panel</button><button>Reward Store Shortcut</button></div>
                <button>Parent Dashboard Shortcut</button>
              </article>
            );
          })}
          <article className="card overview">
            <h2>Today’s Goal Command Center</h2>
            <p className="big">{total}/120 Minutes Complete</p>
            <div className="notif">✨ Floating Reward: Effort Bonus Ready</div>
            <div className="mission-grid">
              {missions.map((m) => <div key={m.name} className={`mission-card ${m.diff}`}><p>{m.icon} {m.name}</p></div>)}
            </div>
            <div className="chest">🎁 Animated Grant Prize Chest</div>
            <p className="quote">“Good try. Let’s fix the step.”</p>
            <p>Streak protection active · Catch-up missions allowed</p>
            <div className="badge-row"><span>🏅 Accuracy</span><span>🛠️ Correction Hero</span><span>🚀 No-Give-Up</span></div>
            <div className="vs">Alex ⚡ VS ⚡ Katya</div>
            <div className="weekend">Weekend Event Panel: Lighter missions + bonus coins.</div>
          </article>
        </section>
      )}

      {tab === 'Daily Missions' && <section className="grid two">{Object.values(state.children).map((c) => <article key={c.name} className={`card ${c.theme}`}><h2>{c.name} Quest Deck</h2><div className="mission-grid">{missions.map((m, i) => <div key={m.name} className={`mission-card ${m.diff}`}><p>{m.icon} <strong>{m.name}</strong></p><p>{state.dayType === 'Weekend' ? '7' : '10'} min · {['I','II','III','IV','V','VI'][i]}</p><div className="mini"><span style={{ width: `${Math.min(100, c.missions * 16)}%` }} /></div></div>)}</div></article>)}</section>}

      {tab === 'Math Facts Trainer' && <section className="grid two">{Object.values(state.children).map((c) => <article key={c.name} className={`card ${c.theme}`}><h2>Facts Arena · {c.name}</h2><p>Multiplication 1–12 · Division Facts · Speed Round · Missing Number · Mixed Quiz</p><div className="dots">{c.masteryDots.map((d) => <span key={d.n} className={`dot s${d.score}`}>{d.n}</span>)}</div><p>Weak facts tracked for targeted replay.</p></article>)}</section>}

      {tab === 'Battle Mode' && <section className="card"><h2>Battle Mode: Sibling Lightning Arena</h2><div className="battle"><div><h3>Alex Rank: Platinum Commander</h3><p>Effort + Accuracy + Improvement + Mission completion</p></div><div className="divider">⚡ VS ⚡</div><div><h3>Katya Rank: Shadow Detective</h3><p>Team bonus mode + persistence multipliers</p></div></div><p>Alex bonus: Check Before Submit +10 when corrected before final answer.</p></section>}

      {tab === 'Money Lab' && <section className="card"><h2>Money Lab</h2><p>Saving · Spending · Needs vs Wants · Budgeting · Delayed Gratification · Simple interest later</p><p>Economy token: Math Coins.</p></section>}

      {tab === 'Reward Store' && <section><div className="section-head"><h2>Game Reward Store</h2><p>Rarity glow · premium shelf · surprise shelf</p></div><section className="grid three">{rewardCatalog.map((r, idx) => <article key={r.id} className={`card reward ${idx > 9 ? 'premium' : ''}`}><h3>{r.name}</h3><p className="coin-tag">{r.cost} Math Coins</p><p>{idx % 3 === 0 ? 'Legendary' : idx % 3 === 1 ? 'Epic' : 'Rare'}</p><div className="row"><button onClick={() => requestReward('Alex', r)}>Request for Alex</button><button onClick={() => requestReward('Katya', r)}>Request for Katya</button></div><p>Requires parent approval.</p></article>)}</section></section>}

      {tab === 'Grant Prize' && <section className="card"><h2>Grant Prize System</h2><div className="chest huge">🎁 Mystery Chest · Tap to Claim</div><div className="confetti">🎉 ✨ 🎊 ✨ 🎉</div><ul><li>Surprise reward box</li><li>Mom bonus</li><li>Effort bonus</li><li>Correction bonus</li><li>No-giving-up bonus</li><li>Double XP weekend</li></ul></section>}

      {tab === 'Parent Dashboard' && <section className="card"><h2>Parent Dashboard</h2><div className="analytics"><div className="panel"><h3>Minutes Chart</h3>{Object.values(state.children).map((c)=><div key={c.name}><p>{c.name}</p><div className="xp-wrap"><div className="xp-bar" style={{ width: `${(c.minutes/60)*100}%` }} /></div></div>)}</div><div className="panel"><h3>Streak Analytics</h3>{Object.values(state.children).map((c)=><p key={c.name}>{c.name}: 🔥 {c.streak} protected</p>)}</div></div>{Object.values(state.children).map((c)=><div className="parent-row" key={c.name}><p><strong>{c.name}:</strong> {c.minutes} min · {c.missions}/6 · XP {c.xp} · Coins {c.coins}</p><p>Weak: {c.weakSkills.join(', ')}</p><p>Strongest today: Word Problems · Mistakes corrected: {Math.floor(c.missions * 1.5)}</p><p>Focus tomorrow: {c.weakSkills[0]} + confidence reps.</p></div>)}<h3>Reward Requests</h3>{state.rewardRequests.length===0?<p>None yet.</p>:state.rewardRequests.map((r,i)=><p key={i}>📝 {r.child}: {r.reward} · {r.status}</p>)}</section>}

      <footer>Original mystery world only. English-only V1. localStorage active.</footer>
    </div>
  );
}
