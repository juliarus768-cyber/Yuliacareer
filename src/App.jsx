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
    alex: { name: 'Alex', role: 'Battle Commander', theme: 'blue', level: 7, xp: 520, coins: 230, streak: 11, weakSkills: ['Fractions', 'BEDMAS', 'Long Division', 'Facts Recall'], minutes: 34, missions: 4, masteryDots: [1,2,3,4,5,6,7,8,9,10,11,12].map((n)=>({n,score:n<8?3:n<10?2:1})) },
    katya: { name: 'Katya', role: 'Mystery Detective', theme: 'pink', level: 4, xp: 410, coins: 190, streak: 9, weakSkills: ['Subtraction Fluency', 'Multiplication Facts', 'Long Division Basics'], minutes: 28, missions: 3, masteryDots: [1,2,3,4,5,6,7,8,9,10,11,12].map((n)=>({n,score:n<5?2:1})) },
  }, rewardRequests: [],
};

const nav = [
  ['🏠', 'Home Dashboard'], ['🗺️', 'Daily Missions'], ['⚔️', 'Battle Mode'], ['💸', 'Money Lab'],
  ['🛍️', 'Reward Store'], ['🎁', 'Grant Prize'], ['👨‍👩‍👧‍👦', 'Parent Dashboard'],
];

const missionTiles = [
  ['⚡', 'Speed Round', '5/5', '+90 XP', 'rare'],
  ['🧠', 'Logic Battle', '4/5', '+120 XP', 'epic'],
  ['💰', 'Money Lab', '5/5', '+100 XP', 'rare'],
  ['🕵️', 'Mystery Case', '3/5', '+140 XP', 'epic'],
  ['🏆', 'Boss Battle', '2/5', '+180 XP', 'legend'],
  ['🔥', 'Streak Saver', '5/5', '+80 XP', 'rare'],
];

function useLocalState() {
  const [state, setState] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : starter;
  });
  const update = (next) => setState((prev) => {
    const value = typeof next === 'function' ? next(prev) : next;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    return value;
  });
  return [state, update];
}

function Hero({ child, onComplete }) {
  const isKatya = child.name === 'Katya';
  const xpPct = Math.min(100, (child.xp % 500) / 5);
  return <article className={`hero ${child.theme}`}>
    <div className="hero-bg" />
    <div className="avatar-wrap">
      <div className="xp-ring" style={{ '--pct': `${xpPct}%` }}>
        <div className="avatar">
          <div className={`hair ${isKatya ? 'katya' : 'alex'}`} />
          <div className="face"><span className="eye" /><span className="eye" /><span className="mouth">{isKatya ? '▭▭▭' : '◡'}</span></div>
          <div className={`hoodie ${child.theme}`} />
          <div className="gear">{isKatya ? '🔦 📂' : '⚔️ 🎮'}</div>
        </div>
      </div>
    </div>
    <div className="hero-info">
      <h2>{child.name}</h2>
      <p>{child.role}</p>
      <div className="hero-badges"><span>Lv {child.level}</span><span>🪙 {child.coins}</span><span className="flame">🔥 {child.streak}</span></div>
      <div className="xp"><span style={{ width: `${xpPct}%` }} /></div>
      <p className="rank">{isKatya ? 'Detective Rank: Shadow Sleuth' : 'Battle Rank: Neon Commander'}</p>
      <button onClick={onComplete}>View Profile</button>
    </div>
  </article>;
}

export default function App() {
  const [state, setState] = useLocalState();
  const [tab, setTab] = useState('Home Dashboard');
  const total = useMemo(() => Object.values(state.children).map((c) => c.minutes).reduce((a, b) => a + b, 0), [state]);
  const requestReward = (child, reward) => setState((s) => ({ ...s, rewardRequests: [...s.rewardRequests, { child, reward: reward.name, status: 'Pending parent approval' }] }));
  const completeMission = (id) => setState((s) => {
    const c = s.children[id];
    const u = { ...c, missions: Math.min(6, c.missions + 1), minutes: Math.min(60, c.minutes + (s.dayType === 'Weekend' ? 7 : 10)), xp: c.xp + 25, coins: c.coins + 15 };
    return { ...s, children: { ...s.children, [id]: u } };
  });

  return <div className="app">
    <div className="particles" />
    <header className="topbar glass">
      <div><h1>Summer Math Battle Tutor</h1></div>
      <nav>{nav.map(([i, t]) => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{i} {t.replace(' Dashboard','')}</button>)}</nav>
      <div className="topstats"><span>🪙 {state.children.alex.coins + state.children.katya.coins}</span><span>✨ {state.children.alex.xp + state.children.katya.xp}</span><span>🔔 3</span><span>⚙️</span></div>
    </header>

    {tab === 'Home Dashboard' && <>
      <section className="event-banner glass"><strong>DOUBLE XP WEEKEND</strong><span>⏳ 22:14:09 left</span><span>Original spooky forest signal event</span></section>
      <section className="home-grid">
        <Hero child={state.children.alex} onComplete={() => completeMission('alex')} />
        <Hero child={state.children.katya} onComplete={() => completeMission('katya')} />
      </section>
      <section className="status-grid">
        <article className="glass widget"><h3>🔥 Daily Streak</h3><p>Shield Active</p><div className="xp"><span style={{ width: '88%' }} /></div></article>
        <article className="glass widget"><h3>🎯 Today’s Goal</h3><p>{total}/120 min</p><div className="xp"><span style={{ width: `${Math.min(100, total / 1.2)}%` }} /></div></article>
        <article className="glass widget"><h3>🤝 Team Bonus</h3><p>+25 XP if both finish 6 missions</p><div className="xp"><span style={{ width: '66%' }} /></div></article>
      </section>
      <section className="missions glass">
        <h3>Today’s Missions</h3>
        <div className="mission-grid">{missionTiles.map(([ic, nm, pr, xp, rr]) => <article key={nm} className={`tile ${rr}`}><h4>{ic} {nm}</h4><p>{pr} · {xp}</p><span>✅</span></article>)}</div>
      </section>
      <section className="lower-grid">
        <article className="glass panel"><h3>⚔️ Sibling Battle Arena</h3><p>Alex {state.children.alex.xp} VS {state.children.katya.xp} Katya</p></article>
        <article className="glass panel chest"><h3>🎁 Grant Prize Chest</h3><button>Claim Prize</button></article>
        <article className="glass panel"><h3>🧋 Next Reward</h3><p>Bubble Tea unlock at 240 coins</p></article>
        <article className="glass panel"><h3>🏅 Achievements</h3><p>Accuracy · Effort · Fix Hero · No Give Up</p></article>
        <article className="glass panel"><h3>📅 Upcoming Events</h3><p>Weekend quest raid + double XP</p></article>
        <article className="glass panel quote"><h3>Katya Motivation</h3><p>“Friends don’t lie. Numbers don’t either. Keep solving.”</p></article>
      </section>
    </>}

    {tab === 'Daily Missions' && <section className="mission-grid">{missionTiles.map(([ic, nm, pr, xp, rr]) => <article key={nm} className={`tile ${rr}`}><h4>{ic} {nm}</h4><p>{pr} · {xp}</p></article>)}</section>}
    {tab === 'Battle Mode' && <section className="glass panel"><h2>Battle Arena</h2><p>Alex bonus: Check Before Submit +10</p></section>}
    {tab === 'Money Lab' && <section className="glass panel"><h2>Money Lab</h2><p>Saving, spending, needs vs wants, budgeting.</p></section>}
    {tab === 'Reward Store' && <section className="store-grid">{rewardCatalog.map((r, idx) => <article key={r.id} className={`glass store ${idx > 9 ? 'premium' : ''}`}><h4>{r.name}</h4><p>🪙 {r.cost}</p><div><button onClick={() => requestReward('Alex', r)}>Alex</button><button onClick={() => requestReward('Katya', r)}>Katya</button></div></article>)}</section>}
    {tab === 'Grant Prize' && <section className="glass panel chest"><h2>Mystery Chest</h2><button>Claim Prize</button></section>}
    {tab === 'Parent Dashboard' && <section className="glass panel"><h2>Parent Dashboard</h2>{Object.values(state.children).map((c) => <p key={c.name}>{c.name}: {c.minutes} min · {c.missions}/6 · XP {c.xp} · Coins {c.coins}</p>)}<h3>Reward Requests</h3>{state.rewardRequests.length===0?<p>None yet.</p>:state.rewardRequests.map((r,i)=><p key={i}>{r.child}: {r.reward} · {r.status}</p>)}</section>}
  </div>;
}
