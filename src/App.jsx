import { useMemo, useState } from 'react';

const STORAGE_KEY = 'summer-math-battle-v1';

const starter = {
  dayType: 'Weekday',
  children: {
    alex: { name: 'Alex', role: 'Battle Commander', level: 7, xp: 645, xpMax: 800, coins: 305, streak: 11, minutes: 34, missions: 4 },
    katya: { name: 'Katya', role: 'Mystery Detective', level: 4, xp: 435, xpMax: 600, coins: 205, streak: 9, minutes: 28, missions: 3 },
  },
  rewardRequests: [],
};

const rewardCatalog = [
  'Chocolate', 'Bubble Tea', 'DoorDash', 'Movie', 'Restaurant with mom', 'Restaurant with dad',
  'Starbucks card', 'Apple gift card', 'PlayStation card', 'Device day', 'Rock climbing',
].map((name, i) => ({ id: i + 1, name, cost: (i + 1) * 40 }));

const missions = [
  { n: 'Speed Round', xp: 50, c: '#ffd84d' },
  { n: 'Logic Battle', xp: 60, c: '#b66dff' },
  { n: 'Money Lab', xp: 50, c: '#52e48a' },
  { n: 'Mystery Case', xp: 60, c: '#47bfff' },
  { n: 'Boss Battle', xp: 80, c: '#ff5672' },
  { n: 'Streak Saver', xp: 40, c: '#ff9a3d' },
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

function Hero({ child, theme, onComplete }) {
  const xpPct = Math.round((child.xp / child.xpMax) * 100);
  const isKatya = child.name === 'Katya';
  return (
    <article className={`hero ${theme}`}>
      <div className="avatar-zone">
        <div className="xp-ring" style={{ '--pct': `${xpPct}%` }}>
          <div className="avatar-body">
            <div className={`hair ${isKatya ? 'katya' : 'alex'}`} />
            <div className="face"><span className="eye" /><span className="eye" /><span className="mouth">{isKatya ? '▭▭▭' : '◡'}</span></div>
            <div className={`coat ${theme}`} />
            <div className="prop">{isKatya ? '🔦  📂' : '⚔️  🎮'}</div>
          </div>
        </div>
      </div>
      <div className="hero-meta">
        <h2>{child.name}</h2>
        <p>{child.role}</p>
        <div className="chips"><span>Lv {child.level}</span><span>🪙 {child.coins}</span><span>🔥 {child.streak}</span></div>
        <div className="bar"><span style={{ width: `${xpPct}%` }} /></div>
        <p className="rank">{isKatya ? 'Detective Rank: Shadow Sleuth' : 'Battle Rank: Neon Commander'}</p>
        <button onClick={onComplete}>View Profile</button>
      </div>
    </article>
  );
}

export default function App() {
  const [state, setState] = useLocalState();
  const [tab, setTab] = useState('Home');
  const total = useMemo(() => state.children.alex.minutes + state.children.katya.minutes, [state]);

  const completeMission = (id) => setState((s) => {
    const c = s.children[id];
    const u = { ...c, missions: Math.min(6, c.missions + 1), minutes: Math.min(60, c.minutes + (s.dayType === 'Weekend' ? 7 : 10)), xp: c.xp + 25, coins: c.coins + 15 };
    return { ...s, children: { ...s.children, [id]: u } };
  });

  const requestReward = (child, reward) => setState((s) => ({ ...s, rewardRequests: [...s.rewardRequests, { child, reward: reward.name, status: 'Pending parent approval' }] }));

  return (
    <div className="game-root">
      <style>{`
      .game-root{min-height:100vh;padding:1rem;background:radial-gradient(circle,#0a0f2a 0,#000 100%);color:#eaf2ff;font-family:Segoe UI,sans-serif}
      .hud{display:grid;grid-template-columns:1fr auto auto;gap:.6rem;align-items:center;padding:.75rem 1rem;background:rgba(10,10,30,.92);border:1px solid #3fa5ff44;border-radius:14px;box-shadow:0 0 20px #00aaff33}
      .logo{font-weight:900;letter-spacing:1px}.tabs{display:flex;gap:.4rem;flex-wrap:wrap}.tabs button,.hero button,.card button{background:linear-gradient(135deg,#2a3f9f,#6e2993);border:1px solid #90a8ff66;color:#fff;padding:.5rem .7rem;border-radius:10px}
      .tabs button.active{background:linear-gradient(135deg,#1cb4ff,#ff4ea3)}.counters{display:flex;gap:.35rem}.pill{padding:.35rem .6rem;background:#18214f;border-radius:999px}
      .event{margin:.8rem 0;padding:1rem;border-radius:14px;border:1px solid #ffd85f77;background:linear-gradient(90deg,#22163f,#411628);box-shadow:0 0 20px #ffd85f33;display:flex;justify-content:space-between;align-items:center}
      .event h3{margin:0;color:#ffd85f}.layout{display:grid;grid-template-columns:1fr 1fr;gap:.9rem}
      .hero{border-radius:16px;padding:1rem;display:grid;grid-template-columns:220px 1fr;gap:1rem;min-height:340px;position:relative;overflow:hidden}
      .hero.alex{background:linear-gradient(180deg,#001a37,#000d1c);box-shadow:inset 0 0 40px #00b4ff22}.hero.katya{background:linear-gradient(180deg,#1c0012,#0e0008);box-shadow:inset 0 0 40px #ff006e22}
      .avatar-zone{display:grid;place-items:center}.xp-ring{width:200px;height:200px;border-radius:50%;background:conic-gradient(#56e7ff var(--pct),#253062 0);display:grid;place-items:center;animation:pulse 2s infinite}
      .avatar-body{width:168px;height:168px;border-radius:50%;background:linear-gradient(180deg,#1a2250,#0f142d);display:grid;place-items:center;position:relative}
      .hair{position:absolute;top:24px;width:96px;background:#ffdc6f}.hair.alex{height:44px;clip-path:polygon(0 85%,12% 18%,24% 74%,36% 12%,52% 67%,67% 18%,81% 74%,100% 28%,100% 100%,0 100%)}.hair.katya{height:46px;border-radius:36px 36px 20px 20px;box-shadow:inset 0 -7px #e4ba54}
      .face{margin-top:10px;width:84px;height:76px;border-radius:40px;background:#ffd8c1;display:flex;gap:10px;justify-content:center;align-content:flex-start;flex-wrap:wrap;padding-top:17px}.eye{width:11px;height:11px;border-radius:50%;background:#2da9ff;box-shadow:0 0 8px #2da9ff}.mouth{width:100%;text-align:center}
      .coat{width:106px;height:44px;border-radius:12px}.coat.alex{background:linear-gradient(180deg,#49b2ff,#1a2e6a)}.coat.katya{background:linear-gradient(180deg,#ff5aae,#6d2658)}.prop{font-size:.85rem}
      .hero-meta h2{margin:0;font-size:2rem}.chips{display:flex;gap:.4rem;flex-wrap:wrap}.chips span{padding:.3rem .5rem;border-radius:999px;background:#1f2a60}.bar{height:12px;background:#172255;border-radius:999px;overflow:hidden}.bar span{display:block;height:100%;background:linear-gradient(90deg,#35dbff,#65ff9d)}
      .rank{opacity:.9}.grid-missions{margin-top:.9rem;padding:1rem;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid #ffffff1f}
      .m-head{display:flex;justify-content:space-between;align-items:center}.m-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem}
      .tile{padding:.7rem;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid var(--c);box-shadow:0 0 14px color-mix(in oklab,var(--c),transparent 75%);position:relative;transition:.2s}.tile:hover{transform:translateY(-4px)}.ok{position:absolute;right:8px;top:8px;width:18px;height:18px;border-radius:50%;background:#2ce06d;color:#041;display:grid;place-items:center;font-weight:900}
      .lower{margin-top:.9rem;display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem}.card{padding:1rem;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid #ffffff1f}
      .quote{border:1px dashed #ff4aa488;color:#ff78be;font-style:italic}.store{margin-top:1rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.7rem}
      @keyframes pulse{50%{transform:scale(1.03)}}
      @media (max-width:1000px){.layout,.m-grid,.lower{grid-template-columns:1fr}}
      `}</style>

      <header className="hud">
        <div className="logo">SUMMER MATH BATTLE TUTOR</div>
        <nav className="tabs">
          {['Home','Missions','Battle','Money Lab','Store','Grant Prize','Parent'].map((n)=> <button key={n} className={tab===n?'active':''} onClick={()=>setTab(n)}>{n}</button>)}
        </nav>
        <div className="counters"><span className="pill">🪙 {state.children.alex.coins + state.children.katya.coins}</span><span className="pill">✨ {state.children.alex.xp + state.children.katya.xp}</span><span className="pill">🔔 3</span><span className="pill">⚙</span></div>
      </header>

      {tab === 'Home' && <>
        <section className="event"><div><small>WEEKEND EVENT</small><h3>DOUBLE XP WEEKEND</h3><div style={{color:'#66ff9f'}}>Mystery & Battle Boost</div></div><div style={{fontSize:'1.5rem',fontWeight:900,color:'#ff62be'}}>2d 14h 26m</div></section>
        <section className="layout">
          <Hero child={state.children.alex} theme="alex" onComplete={() => completeMission('alex')} />
          <Hero child={state.children.katya} theme="katya" onComplete={() => completeMission('katya')} />
        </section>

        <section className="grid-missions">
          <div className="m-head"><h3>Today's Missions</h3><strong style={{color:'#6dff99'}}>6/6 Completed ✓</strong></div>
          <div className="m-grid">{missions.map((m)=><article key={m.n} className="tile" style={{ '--c': m.c }}><div className="ok">✓</div><h4>{m.n}</h4><p>5/5 • XP {m.xp}</p></article>)}</div>
        </section>

        <section className="lower">
          <article className="card"><h3>Sibling Battle Arena</h3><p>Alex {state.children.alex.xp} XP VS {state.children.katya.xp} XP Katya</p></article>
          <article className="card"><h3>Grant Prize Chest</h3><button>Claim Prize</button></article>
          <article className="card"><h3>Next Reward</h3><p>Bubble Tea at 1,500 XP</p><div className="bar"><span style={{width:'83.3%'}} /></div></article>
          <article className="card"><h3>Achievements</h3><p>First Win • Streak 7 • Math Genius • Team Player</p></article>
          <article className="card"><h3>Upcoming Events</h3><p>2X Weekend: May 24–26</p><p>Mystery Challenge: May 31</p></article>
          <article className="card quote"><h3>Katya Motivation</h3><p>“Friends don't lie. Numbers don't either. Keep solving.”</p></article>
        </section>
      </>}

      {tab === 'Missions' && <section className="card"><h2>Daily Missions</h2><p>Total minutes today: {total}/120</p></section>}
      {tab === 'Battle' && <section className="card"><h2>Battle Mode</h2><p>Alex bonus: Check Before Submit +10</p></section>}
      {tab === 'Money Lab' && <section className="card"><h2>Money Lab</h2><p>Saving, spending, needs vs wants, budgeting.</p></section>}
      {tab === 'Store' && <section className="store">{rewardCatalog.map((r)=><article key={r.id} className="card"><h4>{r.name}</h4><p>🪙 {r.cost}</p><button onClick={()=>requestReward('Alex',r)}>Request Alex</button><button onClick={()=>requestReward('Katya',r)}>Request Katya</button></article>)}</section>}
      {tab === 'Grant Prize' && <section className="card"><h2>Grant Prize System</h2><button>Claim Prize</button></section>}
      {tab === 'Parent' && <section className="card"><h2>Parent Dashboard</h2>{Object.values(state.children).map((c)=><p key={c.name}>{c.name}: {c.minutes} min · {c.missions}/6 · XP {c.xp} · Coins {c.coins}</p>)}<h3>Reward Requests</h3>{state.rewardRequests.length===0?<p>None yet.</p>:state.rewardRequests.map((r,i)=><p key={i}>{r.child}: {r.reward} · {r.status}</p>)}</section>}
    </div>
  );
}
