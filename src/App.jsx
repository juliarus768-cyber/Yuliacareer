import { useState } from 'react';
import HomeDashboard from './HomeDashboard';

const STORAGE_KEY = 'summer-math-battle-v1';

const rewardCatalog = [
  '🍫 Chocolate', '🎵 Car DJ Pass', '🧋 Bubble Tea', '🥡 Pick Takeout', '🚗 DoorDash Delivery',
  '🍽️ Dinner with Mom', '🍔 Dinner with Dad', '🎬 Movie Night', '🧗 Rock Climbing', '☕ Starbucks Card',
  '🍎 Apple Gift Card', '🎮 PlayStation Card', '📱 Device Day',
].map((name, i) => ({ id: i + 1, name, cost: (i + 1) * 40 }));

const starter = {
  dayType: 'Weekday',
  children: {
    alex: { name: 'Alex', role: 'Battle Commander', level: 7, xp: 645, xpMax: 800, coins: 305, streak: 11, weakSkills: ['Fractions', 'BEDMAS', 'Long Division', 'Facts Recall'], minutes: 34, missions: 4 },
    katya: { name: 'Katya', role: 'Mystery Detective', level: 4, xp: 435, xpMax: 600, coins: 205, streak: 9, weakSkills: ['Subtraction Fluency', 'Multiplication Facts', 'Long Division Basics'], minutes: 28, missions: 3 },
  },
  rewardRequests: [],
};

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

export default function App() {
  const [state, setState] = useLocalState();
  const [tab, setTab] = useState('Home Dashboard');

  const requestReward = (child, reward) => setState((s) => ({
    ...s,
    rewardRequests: [...s.rewardRequests, { child, reward: reward.name, status: 'Pending parent approval' }],
  }));

  return (
    <div>
      {tab === 'Home Dashboard' && (
        <HomeDashboard
          alexData={state.children.alex}
          katyaData={state.children.katya}
          onNavigate={(label) => {
            const map = {
              Home: 'Home Dashboard',
              Missions: 'Daily Missions',
              Battle: 'Battle Mode',
              'Money Lab': 'Money Lab',
              Store: 'Reward Store',
              'Grant Prize': 'Grant Prize',
              Parent: 'Parent Dashboard',
            };
            if (map[label]) setTab(map[label]);
          }}
        />
      )}

      {tab !== 'Home Dashboard' && (
        <div className="app" style={{ padding: '1rem', color: '#eaf3ff' }}>
          <button onClick={() => setTab('Home Dashboard')} style={{ marginBottom: '1rem' }}>← Back to Home HUD</button>
          {tab === 'Daily Missions' && <section className="glass panel"><h2>Daily Missions</h2><p>Mission system active. Continue from Home HUD mission tiles.</p></section>}
          {tab === 'Battle Mode' && <section className="glass panel"><h2>Battle Arena</h2><p>Alex bonus: Check Before Submit +10</p></section>}
          {tab === 'Money Lab' && <section className="glass panel"><h2>Money Lab</h2><p>Saving, spending, needs vs wants, budgeting.</p></section>}
          {tab === 'Reward Store' && <section className="store-grid">{rewardCatalog.map((r, idx) => <article key={r.id} className={`glass store ${idx > 9 ? 'premium' : ''}`}><h4>{r.name}</h4><p>🪙 {r.cost}</p><div><button onClick={() => requestReward('Alex', r)}>Alex</button><button onClick={() => requestReward('Katya', r)}>Katya</button></div></article>)}</section>}
          {tab === 'Grant Prize' && <section className="glass panel chest"><h2>Mystery Chest</h2><button>Claim Prize</button></section>}
          {tab === 'Parent Dashboard' && <section className="glass panel"><h2>Parent Dashboard</h2>{Object.values(state.children).map((c) => <p key={c.name}>{c.name}: {c.minutes} min · {c.missions}/6 · XP {c.xp} · Coins {c.coins}</p>)}<h3>Reward Requests</h3>{state.rewardRequests.length===0?<p>None yet.</p>:state.rewardRequests.map((r,i)=><p key={i}>{r.child}: {r.reward} · {r.status}</p>)}</section>}
        </div>
      )}
    </div>
  );
}
