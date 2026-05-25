import { useMemo, useState } from 'react';

const STORAGE_KEY = 'summer-math-battle-v1';

const defaultAlex = { name: 'Alex', level: 7, xp: 645, xpMax: 800, coins: 305, streak: 11, rank: 'Battle Rank' };
const defaultKatya = { name: 'Katya', level: 4, xp: 435, xpMax: 600, coins: 205, streak: 9, rank: 'Detective Rank' };

const NAV_ITEMS = [
  ['home', 'Home'], ['missions', 'Missions'], ['battle', 'Battle'], ['money', 'Money Lab'],
  ['store', 'Store'], ['prize', 'Grant Prize'], ['parent', 'Parent'],
];

const MISSIONS = [
  { name: 'SPEED ROUND', progress: '5/5 ✓', xp: 50, rarity: '#ffd700', icon: 'bolt' },
  { name: 'LOGIC BATTLE', progress: '5/5 ✓', xp: 60, rarity: '#bb66ff', icon: 'brain' },
  { name: 'MONEY LAB', progress: '5/5 ✓', xp: 50, rarity: '#38d87f', icon: 'dollar' },
  { name: 'MYSTERY CASE', progress: '5/5 ✓', xp: 60, rarity: '#3db7ff', icon: 'search' },
  { name: 'BOSS BATTLE', progress: '5/5 ✓', xp: 80, rarity: '#ff3e58', icon: 'skull' },
  { name: 'STREAK SAVER', progress: '5/5 ✓', xp: 40, rarity: '#ff8c32', icon: 'flame' },
];

function Icon({ type }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 };
  if (type === 'coin') return <svg {...common}><circle cx="12" cy="12" r="8"/><path d="M9 12h6M12 9v6"/></svg>;
  if (type === 'shield') return <svg {...common}><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z"/></svg>;
  if (type === 'bell') return <svg {...common}><path d="M6 9a6 6 0 1112 0v5l2 2H4l2-2z"/><path d="M10 19a2 2 0 004 0"/></svg>;
  if (type === 'gear') return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1 1 0 00.2 1.1l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1 1 0 00-1.1-.2 1 1 0 00-.6.9V20a2 2 0 01-4 0v-.2a1 1 0 00-.6-.9 1 1 0 00-1.1.2l-.1.1A2 2 0 016.5 19l.1-.1a1 1 0 00.2-1.1 1 1 0 00-.9-.6H6a2 2 0 010-4h.2a1 1 0 00.9-.6 1 1 0 00-.2-1.1L6.8 9.6A2 2 0 019.6 6.8l.1.1a1 1 0 001.1.2h.1a1 1 0 00.6-.9V6a2 2 0 014 0v.2a1 1 0 00.6.9h.1a1 1 0 001.1-.2l.1-.1a2 2 0 012.8 2.8l-.1.1a1 1 0 00-.2 1.1v.1a1 1 0 00.9.6H20a2 2 0 010 4h-.2a1 1 0 00-.9.6z"/></svg>;
  if (type === 'bolt') return <svg {...common}><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>;
  if (type === 'brain') return <svg {...common}><path d="M9 8a3 3 0 016 0 3 3 0 013 3v1a3 3 0 01-3 3h-6a3 3 0 01-3-3v-1a3 3 0 013-3z"/></svg>;
  if (type === 'dollar') return <svg {...common}><path d="M12 3v18M16 7c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.2 2.5 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3"/></svg>;
  if (type === 'search') return <svg {...common}><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/></svg>;
  if (type === 'skull') return <svg {...common}><path d="M8 15v3M16 15v3"/><rect x="7" y="4" width="10" height="12" rx="5"/><circle cx="10" cy="10" r="1"/><circle cx="14" cy="10" r="1"/></svg>;
  if (type === 'flame') return <svg {...common}><path d="M12 3c2 3 4 4 4 8a4 4 0 11-8 0c0-2 1-4 4-8z"/></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="9"/></svg>;
}

export default function HomeDashboard({ alexData = defaultAlex, katyaData = defaultKatya, onNavigate }) {
  const [active, setActive] = useState('home');
  const [state, setState] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { rewardRequests: [] };
  });
  const totalXp = alexData.xp + katyaData.xp;
  const progress = useMemo(() => Math.round((98 / 120) * 100), []);
  const navClick = (key, label) => { setActive(key); if (onNavigate) onNavigate(label); };

  return <div className="hd-root">
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@400;600;700&display=swap');
      .hd-root{font-family:Rajdhani,sans-serif;color:#eaf3ff;background:radial-gradient(circle,#0a0a1a 0%,#000 100%);min-height:100vh}
      .orbit{font-family:Orbitron,sans-serif}.particles{position:fixed;inset:0;pointer-events:none;z-index:0}.particles span{position:absolute;bottom:-10vh;border-radius:50%;opacity:.3;animation:float linear infinite}
      @keyframes float{from{transform:translateY(100vh)}to{transform:translateY(-10vh)}}
      .top{position:sticky;top:0;z-index:5;height:60px;background:rgba(10,10,30,.95);border-bottom:1px solid #00b4ff22;backdrop-filter:blur(12px);display:grid;grid-template-columns:260px 1fr 340px;align-items:center;padding:0 12px}
      .logoShield{display:flex;align-items:center;gap:8px;color:#9edfff}.logoShield svg{filter:drop-shadow(0 0 8px #00b4ff66)}
      .logoTxt small{display:block;font-size:9px}.logoTxt b{font:900 15px Orbitron;display:block}
      .tabs{display:flex;gap:6px;justify-content:center}.tab{display:flex;flex-direction:column;align-items:center;font-size:13px;color:#8c9ab0;border:1px solid transparent;padding:4px 8px;border-radius:999px;background:none}.tab.active{background:#00b4ff33;color:#fff}.tab:hover{border-color:#00b4ff66;box-shadow:0 0 12px #00b4ff33}
      .right{display:flex;gap:8px;justify-content:flex-end}.chip{display:flex;align-items:center;gap:5px;padding:5px 8px;border-radius:999px;background:#151a2e;font:600 13px Orbitron}.coin{color:#ffd700}.xp{color:#ba78ff}.iconBtn{position:relative;background:#151a2e;padding:6px;border-radius:50%}.badge{position:absolute;right:-3px;top:-3px;background:#ff3b43;border-radius:50%;font:700 10px Orbitron;padding:2px 4px}
      .layout{position:relative;z-index:1;display:grid;grid-template-columns:280px minmax(0,680px) 280px;gap:14px;padding:14px;justify-content:center}
      .hero{border-radius:14px;padding:10px;position:relative;animation:borderGlow 2s infinite alternate}.hero.alex{background:linear-gradient(180deg,#001833,#000d1a);border-left:2px solid #00b4ff;box-shadow:inset -20px 0 40px #00b4ff11}.hero.katya{background:linear-gradient(180deg,#1a0011,#0d0008);border-right:2px solid #ff006e;box-shadow:inset 20px 0 40px #ff006e11}
      @keyframes borderGlow{from{box-shadow:0 0 8px #00b4ff33}to{box-shadow:0 0 18px #00b4ff99}}
      .avatarZone{height:55%;min-height:320px;position:relative;border-radius:12px;overflow:hidden;background:radial-gradient(circle,#00b4ff44,transparent 60%)}.katya .avatarZone{background:radial-gradient(circle,#ff006e44,transparent 60%)}
      .letters{position:absolute;inset:0;opacity:.08;font:11px monospace;letter-spacing:6px;color:#fff;padding:12px}
      .char{position:absolute;left:50%;top:18px;transform:translateX(-50%);width:190px;height:290px}.head{width:90px;height:95px;background:#ffd6b5;border-radius:44px;margin:0 auto;position:relative;z-index:2}.hairA,.hairK{position:absolute;top:-24px;left:50%;transform:translateX(-50%);width:110px;height:52px;background:#ffd700}.hairA{clip-path:polygon(0 80%,10% 20%,25% 70%,40% 10%,55% 65%,70% 18%,85% 72%,100% 30%,100% 100%,0 100%)}.hairK{border-radius:38px 38px 20px 20px;box-shadow:inset 0 -8px 0 #e3b84b}
      .eyes{display:flex;justify-content:center;gap:18px;padding-top:36px}.eyes i{width:11px;height:11px;border-radius:50%;background:#00b4ff;box-shadow:0 0 8px #00b4ff}.mouth{font:700 12px Orbitron;text-align:center;padding-top:8px;color:#fff}.body{width:140px;height:130px;margin:-10px auto 0;border-radius:18px;background:#1a284c;position:relative}.katya .body{background:#422924}.arms:before,.arms:after{content:'';position:absolute;top:48px;width:70px;height:18px;background:#1e2d57;border-radius:12px}.arms:before{left:-12px;transform:rotate(18deg)}.arms:after{right:-12px;transform:rotate(-18deg)}
      .shield{position:absolute;left:50%;top:56px;transform:translateX(-50%)} .flash{position:absolute;right:-8px;bottom:22px}
      .level{position:absolute;right:8px;bottom:8px;clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);background:#c9a20b;color:#111;padding:8px 12px;text-align:center;border:1px solid #ffd700aa;box-shadow:0 0 10px #ffd70066}
      .nameA{font:900 28px Orbitron;text-shadow:0 0 12px #00b4ff}.nameK{font:900 28px Orbitron;text-shadow:0 0 12px #ff006e}.title{font:700 13px Rajdhani;letter-spacing:3px}.titleA{color:#00b4ff}.titleK{color:#ff006e}
      .stats{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid #ffffff1c;border-bottom:1px solid #ffffff1c;margin:8px 0}.stats div{padding:6px;text-align:center}.stats div+div{border-left:1px solid #ffffff1a}
      .barWrap{margin:8px 0}.barLbl{text-align:right}.barBg{height:8px;border-radius:999px;background:#001122}.fillA,.fillK{height:100%;border-radius:999px;animation:xpPulse 2s infinite}.fillA{background:linear-gradient(90deg,#00b4ff,#0044ff)}.fillK{background:linear-gradient(90deg,#ff006e,#9900ff)}
      @keyframes xpPulse{0%,100%{box-shadow:0 0 4px currentColor}50%{box-shadow:0 0 12px currentColor}}
      .btn{width:100%;padding:9px;border-radius:8px;background:transparent;font:700 13px Orbitron}.btnA{border:1px solid #00b4ff;color:#00b4ff}.btnA:hover{background:#00b4ff22;box-shadow:0 0 16px #00b4ff66}.btnK{border:1px solid #ff006e;color:#ff006e}.btnK:hover{background:#ff006e22;box-shadow:0 0 16px #ff006e66}
      .quote{margin-top:10px;border:1px dashed #ff006e44;box-shadow:0 0 12px #ff006e33;padding:8px;border-radius:8px;color:#ff006e;font-style:italic;font-size:15px}
      .center{display:flex;flex-direction:column;gap:12px}.event{height:100px;border:1px solid #ffd70055;border-radius:12px;box-shadow:0 0 24px #ffd70033;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(90deg,#1b1238,#3a0f22);position:relative;overflow:hidden}.event:before{content:'';position:absolute;bottom:-6px;left:0;right:0;height:34px;background:repeating-linear-gradient(100deg,#000 0 8px,#151515 8px 14px);clip-path:polygon(0 90%,8% 40%,14% 95%,22% 48%,30% 96%,38% 42%,46% 98%,54% 45%,62% 96%,70% 50%,78% 98%,86% 44%,94% 96%,100% 60%,100% 100%,0 100%);opacity:.5}
      .tower{position:absolute;right:18px;bottom:20px;width:16px;height:40px;background:#222}.tower:before{content:'';position:absolute;top:-10px;left:-8px;width:32px;height:10px;background:#333}
      .event h2{margin:0;color:#ffd700;text-shadow:0 0 8px #ffd700,0 0 24px #ffd70066;font:900 34px Orbitron}.count{font:700 28px Orbitron;color:#ff50b7}.cursor{animation:blink 1s steps(1) infinite}@keyframes blink{50%{opacity:0}}
      .widgets{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.card,.mission,.panel,.upcoming{background:rgba(255,255,255,.04);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.08);border-radius:12px;transition:transform .2s,box-shadow .2s}.card:hover,.mission:hover,.panel:hover{transform:translateY(-4px);box-shadow:0 8px 32px #00b4ff44}
      .card{padding:10px}.streakIcon{width:38px;height:38px;background:linear-gradient(#ff8a00,#ffd35c);clip-path:polygon(50% 0,70% 30%,58% 45%,76% 62%,52% 100%,35% 70%,42% 50%,30% 30%);animation:flicker 1.2s infinite}@keyframes flicker{50%{filter:hue-rotate(24deg) brightness(1.08);transform:scale(1.05)}}
      .missionsHead{display:flex;justify-content:space-between}.grid6{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.mission{height:130px;padding:8px;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:space-between}.mission .ok{position:absolute;right:6px;top:6px;background:#24e36d;width:18px;height:18px;border-radius:50%;display:grid;place-items:center;color:#001}
      .missions svg{color:inherit}.lower3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.panel{padding:10px}.vs{display:grid;grid-template-columns:1fr auto 1fr;align-items:center}.rot{font:900 28px Orbitron;color:#ff435a;animation:spin 3s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
      .chestWrap{position:relative;display:grid;place-items:center;margin:8px 0}.chestSvg{animation:floatChest 2s ease-in-out infinite,glowChest 3s infinite}@keyframes floatChest{50%{transform:translateY(-4px)}}@keyframes glowChest{0%,100%{filter:drop-shadow(0 0 8px #7b5cff)}50%{filter:drop-shadow(0 0 14px #ffd700)}}
      .spark{position:absolute;width:4px;height:4px;border-radius:50%;background:#ffd700;animation:sparkle 1.8s infinite}@keyframes sparkle{0%,100%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(1)}}
      .ach{display:flex;gap:8px;flex-wrap:wrap}.badgeHex{position:relative;width:52px;height:52px;clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);display:grid;place-items:center}.tip{display:none;position:absolute;top:-40px;left:50%;transform:translateX(-50%);background:#0c1228;border:1px solid #5f78be;padding:4px 6px;border-radius:6px;white-space:nowrap}.badgeHex:hover .tip{display:block}
      .upcoming{padding:10px}.rowEv{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;padding:6px 0}.pill{padding:2px 8px;border-radius:999px}
      @media (max-width:1279px){.layout{grid-template-columns:280px minmax(0,1fr)}.hero.katya{grid-column:1/3}.top{grid-template-columns:220px 1fr 240px}}
      @media (max-width:767px){.layout{grid-template-columns:1fr}.hero.katya{grid-column:auto}.top{position:static;grid-template-columns:1fr;gap:8px;height:auto;padding:8px}.tabs{flex-wrap:wrap}.widgets,.grid6,.lower3{grid-template-columns:1fr}}
    `}</style>

    <div className="particles">{Array.from({ length: 12 }).map((_, i) => <span key={i} style={{ left: `${5 + i * 8}%`, width: 2 + (i % 4), height: 2 + (i % 4), background: i % 2 ? '#ff006e' : '#00b4ff', animationDuration: `${8 + i}s`, animationDelay: `${-i % 5}s` }} />)}</div>

    <header className="top">
      <div className="logoShield"><svg width="42" height="42" viewBox="0 0 40 40" fill="none"><path d="M20 3l14 6v10c0 10-6 15-14 18C12 34 6 29 6 19V9l14-6z" stroke="#00b4ff"/></svg><div className="logoTxt"><small>SUMMER</small><b>MATH BATTLE</b><small>TUTOR</small></div></div>
      <nav className="tabs">{NAV_ITEMS.map(([k, label]) => <button className={`tab ${active === k ? 'active' : ''}`} key={k} onClick={() => navClick(k, label)}><Icon type={k === 'home' ? 'shield' : 'bolt'} /><span>{label}</span></button>)}</nav>
      <div className="right"><div className="chip coin"><Icon type="coin" />230 Math Coins</div><div className="chip xp"><Icon type="shield" />1,250 Total XP</div><div className="iconBtn"><Icon type="bell" /><span className="badge">3</span></div><div className="iconBtn"><Icon type="gear" /></div></div>
    </header>

    <main className="layout">
      <section className="hero alex">
        <div className="avatarZone"><div className="char"><div className="head"><div className="hairA" /><div className="eyes"><i /><i /></div><div className="mouth">◡</div></div><div className="body"><div className="arms" /><svg className="shield" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 6-4 9-8 11-4-2-8-5-8-11V5l8-3z" fill="#00b4ff"/></svg></div></div><div className="level"><div style={{fontSize:10}}>LEVEL</div><div className="orbit" style={{fontSize:22}}>{alexData.level}</div></div></div>
        <div className="nameA">ALEX</div><div className="title titleA">BATTLE COMMANDER</div>
        <div className="stats"><div><div className="orbit" style={{color:'#ffd700'}}>{alexData.coins}</div><small>COINS</small></div><div><div className="orbit" style={{color:'#ff9a3c'}}>{alexData.streak}</div><small>STREAK</small></div><div><div className="orbit" style={{color:'#00b4ff'}}>A</div><small>{alexData.rank}</small></div></div>
        <div className="barWrap"><div className="barLbl">XP {alexData.xp} / {alexData.xpMax}</div><div className="barBg"><div className="fillA" style={{ width: `${(alexData.xp / alexData.xpMax) * 100}%`, color:'#00b4ff' }} /></div></div>
        <button className="btn btnA">VIEW PROFILE</button>
      </section>

      <section className="center">
        <article className="event"><div><div style={{fontSize:11,color:'#c3c3c3'}}>WEEKEND EVENT</div><h2>DOUBLE XP</h2><div style={{color:'#4dff85'}}>2X XP ALL WEEKEND!</div></div><div><div style={{fontSize:11}}>ENDS IN</div><div className="count">2d 14h 26m<span className="cursor">_</span></div></div><div className="tower"/></article>
        <div className="widgets">
          <article className="card"><div className="streakIcon"/><div className="orbit" style={{fontSize:36,color:'#ffd700'}}>11</div><div>DAY STREAK</div><small>Keep it up! You're on fire!</small></article>
          <article className="card"><Icon type="shield" /><div className="orbit">TODAY'S GOAL</div><div className="orbit">98 / 120 minutes</div><div className="barBg"><div className="fillA" style={{width:`${progress}%`,color:'#00b4ff'}}/></div></article>
          <article className="card"><svg width="24" height="24" viewBox="0 0 24 24"><circle cx="8" cy="8" r="3" fill="#78ffb2"/><circle cx="16" cy="9" r="3" fill="#78ffb2"/><path d="M4 19c1-3 4-4 7-4s6 1 9 4" stroke="#78ffb2"/></svg><div className="orbit">TEAM BONUS</div><small>Work together for</small><div className="orbit" style={{fontSize:26,color:'#65ff9d'}}>+15% XP!</div></article>
        </div>
        <section className="missions"><div className="missionsHead"><h3 className="orbit">TODAY'S MISSIONS</h3><div style={{color:'#66ff99'}}>6/6 Completed ✓</div></div><div className="grid6">{MISSIONS.map((m) => <article key={m.name} className="mission" style={{ borderColor: `${m.rarity}aa`, boxShadow: `0 0 14px ${m.rarity}22`, color: m.rarity }}><div className="ok">✓</div><Icon type={m.icon} /><div className="orbit" style={{fontSize:12,color:'#fff'}}>{m.name}</div><div>{m.progress}</div><div className="orbit" style={{color:'#ffd700'}}>XP {m.xp}</div></article>)}</div></section>
        <div className="lower3">
          <article className="panel"><h4 className="orbit" style={{color:'#ffd700'}}>SIBLING BATTLE ARENA</h4><small>See who's the real MVP!</small><div className="vs"><div><div style={{color:'#00b4ff'}}>ALEX</div><div className="orbit">1,250 XP</div></div><div className="rot">VS</div><div><div style={{color:'#ff4ca8'}}>KATYA</div><div className="orbit">980 XP</div></div></div><button className="btn" style={{border:'1px solid #ffd700',color:'#ffd700'}}>VIEW BATTLE ARENA</button></article>
          <article className="panel"><h4 className="orbit" style={{color:'#ffd700'}}>GRANT PRIZE CHEST</h4><small>Win mystery rewards!</small><div className="chestWrap">{[0,1,2,3,4,5].map((i)=><span key={i} className="spark" style={{left:['50%','70%','78%','50%','22%','30%'][i],top:['5%','22%','55%','80%','55%','22%'][i],animationDelay:`${i*.2}s`}} />)}<svg className="chestSvg" width="90" height="80" viewBox="0 0 90 80"><rect x="10" y="20" width="70" height="26" rx="8" fill="#7b4d1d"/><rect x="10" y="42" width="70" height="28" rx="6" fill="#9a6528"/><circle cx="45" cy="54" r="7" fill="#e6b74d"/><text x="45" y="58" fontSize="12" textAnchor="middle" fill="#3a2200">?</text></svg></div><button className="btn" style={{background:'linear-gradient(90deg,#ffd76a,#f3b400)',color:'#201300'}}>CLAIM PRIZE</button></article>
          <article className="panel"><h4 className="orbit">NEXT REWARD</h4><small>At 1,500 XP</small><svg width="80" height="90" viewBox="0 0 80 90"><rect x="25" y="20" width="30" height="52" rx="8" fill="#c8a4ff"/><circle cx="45" cy="12" r="4" fill="#9f7fff"/><path d="M44 12V2" stroke="#9f7fff"/><circle cx="32" cy="62" r="3" fill="#5a2d7d"/><circle cx="40" cy="66" r="3" fill="#5a2d7d"/><circle cx="48" cy="62" r="3" fill="#5a2d7d"/></svg><div className="orbit" style={{color:'#ffd700'}}>BUBBLE TEA</div><div className="barBg"><div className="fillK" style={{width:'83.3%',color:'#c56bff'}}/></div><div>1,250 / 1,500 XP</div></article>
        </div>
        <section className="panel"><div className="orbit" style={{marginBottom:8}}>ACHIEVEMENTS</div><div className="ach">{['FIRST WIN','STREAK 7','MATH GENIUS','EARLY BIRD','TEAM PLAYER','PERFECTIONIST'].map((b,i)=><div className="badgeHex" key={b} style={{background:['#2f6fff','#ff8a2d','#8d4cff','#19b5b5','#32b45a','#d43755'][i]}}><span>{['★','🔥','🎓','⏰','👥','🎯'][i]}</span><div className="tip">{b} · Badge unlocked</div></div>)}</div></section>
        <aside className="upcoming"><div className="orbit">UPCOMING EVENTS</div><div className="rowEv"><span className="pill" style={{background:'#6c46ff'}}>2X</span><span>DOUBLE XP WEEKEND</span><span>May 24 – May 26</span></div><hr style={{borderColor:'#ffffff22'}}/><div className="rowEv"><span className="pill" style={{background:'#25b7aa'}}>?</span><span>MYSTERY CHALLENGE</span><span>May 31</span></div></aside>
      </section>

      <section className="hero katya">
        <div className="avatarZone"><div className="letters">ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ</div><div className="char"><div className="head"><div className="hairK" /><div className="eyes"><i /><i /></div><div className="mouth">▭▭▭</div></div><div className="body"><svg className="flash" width="34" height="20" viewBox="0 0 34 20"><rect x="2" y="7" width="12" height="6" rx="2" fill="#ddd"/><path d="M14 10l18-6v12z" fill="#fff3a8" opacity=".7"/></svg></div></div><div className="level"><div style={{fontSize:10}}>LEVEL</div><div className="orbit" style={{fontSize:22}}>{katyaData.level}</div></div></div>
        <div className="nameK">KATYA</div><div className="title titleK">MYSTERY DETECTIVE</div>
        <div className="stats"><div><div className="orbit" style={{color:'#ffd700'}}>{katyaData.coins}</div><small>COINS</small></div><div><div className="orbit" style={{color:'#ff9a3c'}}>{katyaData.streak}</div><small>STREAK</small></div><div><div className="orbit" style={{color:'#ff59bd'}}>D</div><small>{katyaData.rank}</small></div></div>
        <div className="barWrap"><div className="barLbl">XP {katyaData.xp} / {katyaData.xpMax}</div><div className="barBg"><div className="fillK" style={{ width: `${(katyaData.xp / katyaData.xpMax) * 100}%`, color:'#ff006e' }} /></div></div>
        <button className="btn btnK">VIEW PROFILE</button>
        <div className="quote">Friends don't lie. Numbers don't either. Keep solving.</div>
      </section>
    </main>
  </div>;
}
