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
  { name: 'Math Facts', icon: '⚡' },
  { name: 'Weak Skill', icon: '🎯' },
  { name: 'Word Problems', icon: '📘' },
  { name: 'Money Mission', icon: '💰' },
  { name: 'Battle Challenge', icon: '🛡️' },
  { name: 'Review & Reflect', icon: '🧠' },
];

function AvatarCard({ child }) {
  return (
    <div className={`avatar-card ${child.theme}`}>
      <div className={`avatar-illustration ${child.theme}`}>
        <div className="hair" />
        <div className="face">
          <span className="eye left" />
          <span className="eye right" />
          {child.name === 'Katya' && <span className="braces">▭▭▭</span>}
        </div>
        <div className="outfit" />
        {child.name === 'Katya' ? <div className="prop">🔦 📂</div> : <div className="prop">⚔️ 🎮</div>}
      </div>
      <div>
        <h2>{child.name} · {child.role}</h2>
        <p className="tagline">{child.name === 'Alex' ? 'Blue Neon Battle Mode' : 'Portal Mystery Case Files'}</p>
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
      <header>
        <h1>🌟 Summer Math Battle Tutor</h1>
        <div className="controls">
          {['Home Dashboard', 'Daily Missions', 'Math Facts Trainer', 'Battle Mode', 'Money Lab', 'Reward Store', 'Grant Prize', 'Parent Dashboard'].map((item) => (
            <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>
          ))}
          <button className="mode" onClick={() => setState((s) => ({ ...s, dayType: s.dayType === 'Weekday' ? 'Weekend' : 'Weekday' }))}>🗓️ Mode: {state.dayType}</button>
        </div>
      </header>

      {tab === 'Home Dashboard' && <section className="grid two">{Object.entries(state.children).map(([id, c]) => (
        <article key={id} className={`card ${c.theme}`}>
          <AvatarCard child={c} />
          <p>Level <strong>{c.level}</strong> · XP <strong>{c.xp}</strong></p>
          <div className="xp-wrap"><div className="xp-bar" style={{ width: `${Math.min(100, (c.xp % 500) / 5)}%` }} /></div>
          <p><span className="badge coin">🪙 {c.coins} Math Coins</span> <span className="badge streak">🔥 Streak Shield {c.streak}</span></p>
          <p>Daily progress: {c.minutes}/60 min · {c.missions}/6 missions</p>
          <div className="row"><button onClick={() => completeMission(id)}>✅ Complete Mission</button><button>⚔️ Sibling Challenge</button></div>
          <div className="row"><button>🎁 Grant Prize Panel</button><button>🛍️ Reward Store Shortcut</button></div>
          <button>👨‍👩‍👧‍👦 Parent Dashboard Shortcut</button>
        </article>
      ))}<article className="card overview"><h2>🎉 Combined Daily Goal</h2><p>{total}/120 minutes complete</p><p>Praise rule: “Good try. Let’s fix the step.”</p><p>🛡️ Streak protection active. Catch-up missions allowed.</p></article></section>}

      {tab === 'Daily Missions' && <section className="grid two">{Object.values(state.children).map((c) => <article key={c.name} className={`card ${c.theme}`}><h2>{c.name} Mission Board</h2><div className="mission-grid">{missions.map((m) => <div key={m.name} className="mission-card"><p>{m.icon} <strong>{m.name}</strong></p><p>{state.dayType === 'Weekend' ? '7' : '10'} min</p></div>)}</div><p>Goal: {state.dayType === 'Weekend' ? '42 minutes lighter mode' : '60 minutes'}</p></article>)}</section>}

      {tab === 'Math Facts Trainer' && <section className="grid two">{Object.values(state.children).map((c) => <article key={c.name} className={`card ${c.theme}`}><h2>🧮 {c.name} Facts Trainer</h2><p>Modes: Multiplication 1–12, Division Facts, Speed Round, Missing Number, Mixed Quiz</p><div className="dots">{c.masteryDots.map((d) => <span key={d.n} className={`dot s${d.score}`}>{d.n}</span>)}</div><p>Weak facts are tracked for targeted replay.</p></article>)}</section>}

      {tab === 'Battle Mode' && <section className="card"><h2>⚔️ Sibling Battle Arena</h2><p>Scoring balances effort + accuracy + improvement + mission completion.</p><p>Alex bonus: Check Before Submit +10 when corrected before final answer.</p><p>Katya boost: Clue Finder reward for persistence and corrections.</p></section>}

      {tab === 'Money Lab' && <section className="card"><h2>💸 Money Lab</h2><p>Practice saving, spending, needs vs wants, budgeting, delayed gratification. Simple interest comes later.</p><p>Economy token: Math Coins.</p></section>}

      {tab === 'Reward Store' && <section className="grid three">{rewardCatalog.map((r) => <article key={r.id} className="card reward"><h3>{r.name}</h3><p className="coin-tag">{r.cost} Math Coins</p><div className="row"><button onClick={() => requestReward('Alex', r)}>Request for Alex</button><button onClick={() => requestReward('Katya', r)}>Request for Katya</button></div><p>Requires parent approval.</p></article>)}</section>}

      {tab === 'Grant Prize' && <section className="card"><h2>🎁 Grant Prize System</h2><div className="mystery-box">✨ Mystery Box ✨</div><ul><li>🎉 Surprise reward box</li><li>💖 Mom bonus</li><li>💪 Effort bonus</li><li>🛠️ Correction bonus</li><li>🚀 No-giving-up bonus</li><li>⚡ Double XP weekend</li></ul></section>}

      {tab === 'Parent Dashboard' && <section className="card"><h2>📊 Parent Dashboard</h2><p>Daily report includes minutes completed, missions completed, points earned, weak skills, strongest skill today, mistakes corrected, reward requests, and tomorrow focus.</p>{Object.values(state.children).map((c)=><div className="parent-row" key={c.name}><p><strong>{c.name}:</strong> {c.minutes} min · {c.missions}/6 missions · XP {c.xp} · Coins {c.coins}</p><p>Weak: {c.weakSkills.join(', ')}</p><p>Strongest today: Word Problems · Mistakes corrected: {Math.floor(c.missions * 1.5)}</p></div>)}<h3>Reward Requests</h3>{state.rewardRequests.length===0?<p>None yet.</p>:state.rewardRequests.map((r,i)=><p key={i}>📝 {r.child}: {r.reward} · {r.status}</p>)}</section>}

      <footer>Katya avatar style note: blonde, blue eyes, short curls, braces (original mystery theme only). English-only V1.</footer>
    </div>
  );
}
