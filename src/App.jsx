import { useState, useMemo, useEffect } from "react";

const fmt=n=>n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e3?(n/1e3).toFixed(n>=1e5?0:1)+"K":n+"";
const TC={business_growth:{bg:"#DCFCE7",t:"#166534"},mindset:{bg:"#F3E8FF",t:"#7C3AED"},health_fitness:{bg:"#D1FAE5",t:"#047857"},relationships:{bg:"#FFE4E6",t:"#BE123C"},money:{bg:"#FEF9C3",t:"#A16207"},leadership:{bg:"#E0E7FF",t:"#4338CA"},personal_story:{bg:"#FFE4E6",t:"#BE123C"},science_research:{bg:"#CCFBF1",t:"#0F766E"},culture_society:{bg:"#F3E8FF",t:"#7C3AED"},marketing:{bg:"#DCFCE7",t:"#166534"},sales:{bg:"#FEF9C3",t:"#A16207"},operations:{bg:"#E0E7FF",t:"#4338CA"},fitness_industry:{bg:"#DCFCE7",t:"#166534"},coaching:{bg:"#FEF9C3",t:"#A16207"},entrepreneurship:{bg:"#FFE4E6",t:"#BE123C"}};

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{background:#FAFAF9;font-family:'DM Sans',sans-serif;color:#111}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
.vcard{background:#FFF;border-radius:14px;overflow:hidden;transition:all 0.35s cubic-bezier(0.19,1,0.22,1);cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,0.04),0 1px 3px rgba(0,0,0,0.02)}
.vcard:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(0,0,0,0.08),0 8px 20px rgba(0,0,0,0.04)}
.pill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:6px;font-size:10px;font-weight:600;font-family:'DM Sans',sans-serif}
.fi{padding:10px 16px;border-radius:10px;border:1px solid #E5E7EB;background:#FFF;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;color:#111;transition:border 0.2s,box-shadow 0.2s}
.fi:focus{border-color:#22C55E;box-shadow:0 0 0 3px rgba(34,197,94,0.1)}
.fs{padding:10px 14px;border-radius:10px;border:1px solid #E5E7EB;background:#FFF;font-size:12px;font-family:'DM Sans',sans-serif;color:#6B7280;cursor:pointer;outline:none}
.fs:focus{border-color:#22C55E}
.gbtn{padding:16px 32px;border-radius:12px;border:none;background:#000;color:#7DF94F;font-size:15px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;width:100%;transition:all 0.25s}
.gbtn:hover{box-shadow:0 8px 24px rgba(0,0,0,0.15);transform:translateY(-1px)}
.gbtn:disabled{background:#F3F4F6;color:#9CA3AF;cursor:wait;transform:none;box-shadow:none}
.epc{background:#FFF;border-radius:12px;border:1px solid #E5E7EB;padding:20px 24px;cursor:pointer;transition:all 0.2s;position:relative}
.epc:hover{border-color:#D1D5DB}
.epc.on{border:2px solid #22C55E;background:#F0FDF4}
`;

function Pill({t}){const c=TC[t]||{bg:"#F3F4F6",t:"#374151"};return <span className="pill" style={{background:c.bg,color:c.t}}>{t.replace(/_/g," ")}</span>;}

function Thumb({id,ch}){
  const [err,setErr]=useState(false);
  const [loaded,setLoaded]=useState(false);
  if(err)return <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#111,#1a1a1a)",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <span style={{color:"#222",fontFamily:"'Bebas Neue',sans-serif",fontSize:36}}>{ch}</span>
  </div>;
  return <>
    {!loaded&&<div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"}}/>}
    <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" onError={()=>setErr(true)} onLoad={()=>setLoaded(true)} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:loaded?1:0,transition:"opacity 0.3s"}}/>
  </>;
}

function VCard({v,i}){
  const bg=v.pi>=10?"#DC2626":v.pi>=5?"#000":"#22C55E";
  return <div className="vcard" onClick={()=>window.open(`https://youtube.com/watch?v=${v.id}`,"_blank")} style={{animation:`fadeUp 0.4s ease ${Math.min(i*0.03,0.6)}s both`}}>
    <div style={{position:"relative",paddingTop:"56.25%",background:"#F3F4F6",overflow:"hidden"}}>
      <Thumb id={v.id} ch={v.ch}/>
      <div style={{position:"absolute",top:12,right:12,background:bg,color:"#FFF",padding:"4px 10px",borderRadius:8,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,zIndex:2,boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
        {v.pi>=100?v.pi.toFixed(0):v.pi.toFixed(1)}x
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.8))",padding:"32px 14px 10px",zIndex:1}}>
        <span style={{color:"#7DF94F",fontSize:10,fontWeight:700,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>{v.ch}</span>
      </div>
    </div>
    <div style={{padding:"14px 16px 16px"}}>
      <h3 style={{fontSize:15,fontWeight:600,lineHeight:1.35,color:"#111",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{v.title}</h3>
      <div style={{display:"flex",gap:16,margin:"12px 0 10px"}}>
        {[{l:"Views",v:fmt(v.views),c:"#111"},{l:"Median",v:fmt(v.med),c:"#9CA3AF"},{l:"Date",v:v.date?.slice(0,7)||"",c:"#D1D5DB"}].map(s=>
          <div key={s.l}><div style={{fontSize:10,color:"#9CA3AF",fontWeight:500,marginBottom:2}}>{s.l}</div><div style={{fontSize:14,fontWeight:700,color:s.c}}>{s.v}</div></div>)}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{(v.topics||[]).map(t=><Pill key={t} t={t}/>)}</div>
    </div>
  </div>;
}

function EpCard({ep,i,on,toggle}){
  return <div className={`epc ${on?"on":""}`} onClick={toggle}>
    {on&&<div style={{position:"absolute",top:16,right:16,width:26,height:26,borderRadius:8,background:"#22C55E",display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:15,fontWeight:700}}>&#10003;</div>}
    <div style={{fontSize:11,color:on?"#22C55E":"#D1D5DB",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>CONCEPT {i+1}</div>
    <h3 style={{fontSize:18,fontWeight:700,color:"#111",lineHeight:1.35,paddingRight:on?36:0,marginBottom:8}}>{ep.title}</h3>
    <p style={{fontSize:14,color:"#6B7280",lineHeight:1.55,marginBottom:12}}>{ep.angle}</p>
    <p style={{fontSize:12,color:"#D1D5DB",fontStyle:"italic",lineHeight:1.4}}>{ep.inspired?.slice(0,150)}</p>
  </div>;
}

function DozaBrief({sel,eps,gName,gDesc,isInt,onClose}){
  const picked=eps.filter((_,i)=>sel.includes(i));
  return <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(12px)"}} onClick={onClose}>
    <div style={{background:"#FFF",borderRadius:20,maxWidth:720,width:"100%",maxHeight:"90vh",overflow:"auto",padding:36,position:"relative",boxShadow:"0 32px 80px rgba(0,0,0,0.12)",animation:"fadeUp 0.3s ease"}} onClick={e=>e.stopPropagation()}>
      <button onClick={onClose} style={{position:"absolute",top:20,right:20,background:"#F3F4F6",border:"none",width:32,height:32,borderRadius:8,fontSize:16,color:"#9CA3AF",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>&#10005;</button>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
        <div style={{width:44,height:44,borderRadius:12,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",color:"#7DF94F",fontSize:24}}>G</div>
        <div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:"#111",letterSpacing:"0.06em"}}>EPISODE BRIEF</div>
          <div style={{fontSize:13,color:"#9CA3AF"}}>{isInt?"Internal Team Episode":"Guest: "+gName}</div>
        </div>
      </div>
      {!isInt&&gDesc&&<div style={{background:"#FAFAFA",borderRadius:12,padding:18,marginBottom:24}}>
        <div style={{fontSize:11,color:"#22C55E",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>GUEST</div>
        <p style={{fontSize:15,color:"#374151",lineHeight:1.55}}><strong style={{color:"#111"}}>{gName}</strong> — {gDesc}</p>
      </div>}
      {picked.map((ep,i)=><div key={i} style={{background:"#FAFAFA",borderRadius:14,padding:24,marginBottom:20}}>
        <div style={{fontSize:11,color:"#22C55E",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>CONCEPT {i+1}</div>
        <h3 style={{fontSize:22,fontWeight:700,color:"#111",lineHeight:1.3,marginBottom:10}}>{ep.title}</h3>
        <p style={{fontSize:15,color:"#4B5563",lineHeight:1.55,marginBottom:20}}>{ep.angle}</p>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:"#9CA3AF",fontWeight:700,letterSpacing:"0.06em",marginBottom:10}}>TALKING POINTS</div>
          {ep.points?.map((p,j)=><div key={j} style={{display:"flex",gap:12,marginBottom:10}}>
            <span style={{flex:"0 0 28px",height:28,borderRadius:8,background:"#000",color:"#7DF94F",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{j+1}</span>
            <p style={{fontSize:15,color:"#374151",lineHeight:1.55,paddingTop:3}}>{p}</p>
          </div>)}
        </div>
        <div style={{background:"#FFF",borderRadius:10,padding:16}}>
          <div style={{fontSize:11,color:"#D1D5DB",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>PRE-VALIDATED BY</div>
          <p style={{fontSize:13,color:"#9CA3AF",fontStyle:"italic",lineHeight:1.55}}>{ep.inspired}</p>
        </div>
      </div>)}
    </div>
  </div>;
}

export default function App(){
  const [DATA,setDATA]=useState([]);
  const [loadingData,setLoadingData]=useState(true);
  const [tab,setTab]=useState("library");
  const [q,setQ]=useState("");
  const [fCh,setFCh]=useState("all");
  const [fTp,setFTp]=useState("all");
  const [sort,setSort]=useState("pi");
  const [isInt,setIsInt]=useState(false);
  const [gName,setGName]=useState("");
  const [gDesc,setGDesc]=useState("");
  const [gTopics,setGTopics]=useState([]);
  const [eps,setEps]=useState([]);
  const [sel,setSel]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [showBrief,setShowBrief]=useState(false);

  useEffect(()=>{
    fetch("/data.json").then(r=>r.json()).then(d=>{setDATA(d);setLoadingData(false)}).catch(()=>setLoadingData(false));
  },[]);

  const CHANNELS=useMemo(()=>[...new Set(DATA.map(v=>v.ch))].sort(),[DATA]);
  const TOPICS=useMemo(()=>[...new Set(DATA.flatMap(v=>v.topics||[]))].sort(),[DATA]);

  const filtered=useMemo(()=>{
    let d=[...DATA];
    if(q){const lq=q.toLowerCase();d=d.filter(v=>v.title.toLowerCase().includes(lq)||v.ch.toLowerCase().includes(lq));}
    if(fCh!=="all")d=d.filter(v=>v.ch===fCh);
    if(fTp!=="all")d=d.filter(v=>(v.topics||[]).includes(fTp));
    if(sort==="pi")d.sort((a,b)=>b.pi-a.pi);
    else if(sort==="views")d.sort((a,b)=>b.views-a.views);
    else d.sort((a,b)=>(b.date||"").localeCompare(a.date||""));
    return d;
  },[DATA,q,fCh,fTp,sort]);

  const matched=useMemo(()=>{
    if(gTopics.length===0)return[];
    return DATA.filter(v=>(v.topics||[]).some(t=>gTopics.includes(t))).sort((a,b)=>b.pi-a.pi).slice(0,10);
  },[DATA,gTopics]);

  const toggleTopic=t=>{setGTopics(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);setEps([]);setSel([]);};
  const toggleSel=i=>setSel(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);

  const generate=async()=>{
    setLoading(true);setError("");setEps([]);setSel([]);
    const ctx=matched.map(v=>`"${v.title}" by ${v.ch} (${v.pi}x, ${fmt(v.views)} views, ${v.date})`).join("\n");
    const gl=isInt?"This is an INTERNAL episode hosted by Doza and the Geronimo team. Focus on topics Doza can speak to from experience running fitness studios.":"GUEST: "+gName+"\nBACKGROUND: "+gDesc;
    try{
      const res=await fetch("/.netlify/functions/generate",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({prompt:`You are an episode planner for the Geronimo Unfiltered Podcast, hosted by Doza (Andrew Handosa). The podcast is for ambitious fitness studio owners.

${gl}

Generate exactly 5 episode concepts inspired by these proven performers. Punchy titles. No fluff.

Return ONLY valid JSON array:
[{"title":"","angle":"","points":["","",""],"inspired":"Name the specific video, channel, performance, and why it works"}]

PROVEN PERFORMERS:
${ctx}`})});
${ctx}`}]})});
      if(!res.ok){setError("API error "+res.status);setLoading(false);return;}
      const data=await res.json();
      if(!data.content?.[0]?.text){setError("Empty response");setLoading(false);return;}
      const raw=data.content[0].text.replace(/```json\n?|```\n?/g,"").trim();
      try{setEps(JSON.parse(raw));}catch(e){const m=raw.match(/\[[\s\S]*\]/);if(m)setEps(JSON.parse(m[0]));else setError("Parse error");}
    }catch(e){setError("Error: "+e.message);}
    setLoading(false);
  };

  const canGen=isInt?gTopics.length>0&&matched.length>0:gName&&gDesc&&gTopics.length>0&&matched.length>0;

  if(loadingData)return <div style={{minHeight:"100vh",background:"#FAFAF9",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{textAlign:"center"}}>
      <div style={{width:48,height:48,borderRadius:12,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",color:"#7DF94F",fontSize:28,margin:"0 auto 16px"}}>G</div>
      <div style={{color:"#9CA3AF",fontSize:14}}>Loading episodes...</div>
    </div>
  </div>;

  return <div style={{minHeight:"100vh",background:"#FAFAF9"}}>
    <style>{CSS}</style>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet"/>
    {showBrief&&<DozaBrief sel={sel} eps={eps} gName={gName} gDesc={gDesc} isInt={isInt} onClose={()=>setShowBrief(false)}/>}

    <div style={{background:"#000",padding:"18px 28px"}}>
      <div style={{maxWidth:1320,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:40,height:40,borderRadius:10,background:"#7DF94F",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",color:"#000",fontSize:24}}>G</div>
          <div>
            <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#FFF",letterSpacing:"0.04em"}}>GERONIMO UNFILTERED</h1>
            <p style={{color:"#7DF94F",fontSize:10,fontWeight:600,letterSpacing:"0.12em"}}>PODCAST RESEARCH ENGINE</p>
          </div>
        </div>
        <div style={{display:"flex",gap:28}}>
          {[{l:"Episodes",v:DATA.length,c:"#7DF94F"},{l:"Channels",v:CHANNELS.length,c:"#FFF"}].map(s=><div key={s.l} style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:700,color:s.c}}>{s.v}</div>
            <div style={{fontSize:9,color:"#666",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>{s.l}</div>
          </div>)}
        </div>
      </div>
    </div>

    <div style={{background:"#FFF",borderBottom:"1px solid #F0F0EE",position:"sticky",top:0,zIndex:50}}>
      <div style={{maxWidth:1320,margin:"0 auto",padding:"0 28px",display:"flex",gap:8}}>
        {[{id:"library",l:"Proven Ideas"},{id:"builder",l:"Episode Builder"}].map(t=>
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"14px 20px",background:"none",border:"none",borderBottom:tab===t.id?"2px solid #22C55E":"2px solid transparent",color:tab===t.id?"#111":"#9CA3AF",fontWeight:tab===t.id?600:500,fontSize:14,cursor:"pointer",transition:"all 0.2s"}}>{t.l}</button>)}
      </div>
    </div>

    <div style={{maxWidth:1320,margin:"0 auto",padding:"28px 28px 80px"}}>
      {tab==="library"&&<>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",marginBottom:24}}>
          <input className="fi" placeholder="Search episodes..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:"1 1 180px",maxWidth:280}}/>
          <select className="fs" value={fCh} onChange={e=>setFCh(e.target.value)}><option value="all">All channels</option>{CHANNELS.map(c=><option key={c} value={c}>{c}</option>)}</select>
          <select className="fs" value={fTp} onChange={e=>setFTp(e.target.value)}><option value="all">All topics</option>{TOPICS.map(t=><option key={t} value={t}>{t.replace(/_/g," ")}</option>)}</select>
          <select className="fs" value={sort} onChange={e=>setSort(e.target.value)}><option value="pi">Performance</option><option value="views">Views</option><option value="date">Recent</option></select>
          <span style={{fontSize:13,color:"#D1D5DB",fontWeight:500}}>{filtered.length} episodes</span>
        </div>
        <div className="card-grid">{filtered.map((v,i)=><VCard key={v.id} v={v} i={i}/>)}</div>
      </>}

      {tab==="builder"&&<div style={{maxWidth:720,margin:"0 auto"}}>
        <div style={{display:"inline-flex",background:"#F3F4F6",borderRadius:12,padding:4,marginBottom:28}}>
          {[{v:false,l:"Guest Episode"},{v:true,l:"Internal Team"}].map(o=>
            <button key={o.l} onClick={()=>{setIsInt(o.v);setEps([]);setSel([]);}} style={{padding:"10px 24px",border:"none",borderRadius:10,background:isInt===o.v?"#000":"transparent",color:isInt===o.v?"#7DF94F":"#9CA3AF",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all 0.2s"}}>{o.l}</button>)}
        </div>
        {!isInt&&<div style={{background:"#FFF",borderRadius:14,padding:24,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <div style={{fontSize:11,color:"#22C55E",fontWeight:700,letterSpacing:"0.06em",marginBottom:12}}>THE GUEST</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <input className="fi" value={gName} onChange={e=>setGName(e.target.value)} placeholder="Guest name"/>
            <input className="fi" value={gDesc} onChange={e=>setGDesc(e.target.value)} placeholder="Their expertise"/>
          </div>
        </div>}
        {isInt&&<div style={{background:"#FFF",borderRadius:14,padding:20,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <p style={{fontSize:14,color:"#6B7280",lineHeight:1.55}}>Internal episode. Doza and the team. Select topics below.</p>
        </div>}
        <div style={{background:"#FFF",borderRadius:14,padding:24,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <div style={{fontSize:11,color:"#22C55E",fontWeight:700,letterSpacing:"0.06em",marginBottom:14}}>TOPICS</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {TOPICS.map(t=>{const on=gTopics.includes(t);const c=TC[t]||{bg:"#F3F4F6",t:"#374151"};
              return <button key={t} onClick={()=>toggleTopic(t)} style={{padding:"8px 16px",borderRadius:8,border:on?"none":"1px solid #E5E7EB",background:on?c.bg:"#FFF",color:on?c.t:"#9CA3AF",fontSize:13,fontWeight:on?600:500,cursor:"pointer",outline:"none",transition:"all 0.15s",textTransform:"capitalize"}}>{t.replace(/_/g," ")}</button>})}
          </div>
        </div>
        {matched.length>0&&<div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:"#D1D5DB",fontWeight:700,letterSpacing:"0.06em",marginBottom:10}}>{matched.length} MATCHED</div>
          {matched.slice(0,5).map(v=><div key={v.id} style={{background:"#FFF",borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",gap:12,alignItems:"center",boxShadow:"0 1px 2px rgba(0,0,0,0.03)"}}>
            <div style={{flex:"0 0 60px",height:40,borderRadius:8,overflow:"hidden",position:"relative",background:"#F3F4F6"}}><Thumb id={v.id} ch={v.ch}/></div>
            <div style={{flex:1,minWidth:0,fontSize:13,fontWeight:600,color:"#111",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{v.title}</div>
            <div style={{fontSize:14,fontWeight:700,color:"#22C55E"}}>{v.pi>=100?v.pi.toFixed(0):v.pi.toFixed(1)}x</div>
          </div>)}
        </div>}
        {canGen&&eps.length===0&&<button className="gbtn" onClick={generate} disabled={loading}>{loading?"Generating...":"Generate Episode Ideas"}</button>}
        {error&&<div style={{background:"#FEF2F2",borderRadius:12,padding:16,marginBottom:20,color:"#DC2626",fontSize:14,marginTop:16}}>{error}</div>}
        {eps.length>0&&<div style={{marginTop:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:11,color:"#22C55E",fontWeight:700,letterSpacing:"0.06em"}}>SELECT CONCEPTS</div>
            {sel.length>0&&<button onClick={()=>setShowBrief(true)} style={{padding:"10px 24px",borderRadius:10,border:"none",background:"#000",color:"#7DF94F",fontSize:13,fontWeight:600,cursor:"pointer"}}>Present to Doza ({sel.length})</button>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>{eps.map((ep,i)=><EpCard key={i} ep={ep} i={i} on={sel.includes(i)} toggle={()=>toggleSel(i)}/>)}</div>
          <button onClick={()=>{setEps([]);setSel([]);}} style={{marginTop:20,padding:"10px 20px",borderRadius:10,border:"1px solid #E5E7EB",background:"#FFF",color:"#9CA3AF",fontSize:13,fontWeight:500,cursor:"pointer"}}>Regenerate</button>
        </div>}
      </div>}
    </div>
  </div>;
}
