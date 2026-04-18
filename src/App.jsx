import { useState, useMemo, useEffect } from "react";

var fmt=function(n){return n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e3?(n/1e3).toFixed(n>=1e5?0:1)+"K":n+""};
var TC={business_growth:{bg:"#DCFCE7",t:"#166534"},mindset:{bg:"#F3E8FF",t:"#7C3AED"},health_fitness:{bg:"#D1FAE5",t:"#047857"},relationships:{bg:"#FFE4E6",t:"#BE123C"},money:{bg:"#FEF9C3",t:"#A16207"},leadership:{bg:"#E0E7FF",t:"#4338CA"},personal_story:{bg:"#FFE4E6",t:"#BE123C"},science_research:{bg:"#CCFBF1",t:"#0F766E"},culture_society:{bg:"#F3E8FF",t:"#7C3AED"},marketing:{bg:"#DCFCE7",t:"#166534"},sales:{bg:"#FEF9C3",t:"#A16207"},operations:{bg:"#E0E7FF",t:"#4338CA"},fitness_industry:{bg:"#DCFCE7",t:"#166534"},coaching:{bg:"#FEF9C3",t:"#A16207"},entrepreneurship:{bg:"#FFE4E6",t:"#BE123C"}};

var CSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{background:#FAFAF9;font-family:'DM Sans',sans-serif;color:#111}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
.vcard{background:#FFF;border-radius:14px;overflow:hidden;transition:all 0.35s cubic-bezier(0.19,1,0.22,1);cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,0.04),0 1px 3px rgba(0,0,0,0.02)}
.vcard:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(0,0,0,0.08),0 8px 20px rgba(0,0,0,0.04)}
.tpill{display:inline-flex;align-items:center;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.15s;text-transform:capitalize}
.tpill:hover{opacity:0.85;transform:scale(1.03)}
.spill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:6px;font-size:10px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.15s}
.fi{padding:10px 16px;border-radius:10px;border:1px solid #E5E7EB;background:#FFF;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;color:#111;transition:border 0.2s,box-shadow 0.2s}
.fi:focus{border-color:#38FC1A;box-shadow:0 0 0 3px rgba(56,252,26,0.1)}
.fs{padding:10px 14px;border-radius:10px;border:1px solid #E5E7EB;background:#FFF;font-size:12px;font-family:'DM Sans',sans-serif;color:#6B7280;cursor:pointer;outline:none}
.fs:focus{border-color:#38FC1A}
.gbtn{padding:16px 32px;border-radius:12px;border:none;background:#000;color:#38FC1A;font-size:15px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;width:100%;transition:all 0.25s}
.gbtn:hover{box-shadow:0 8px 24px rgba(0,0,0,0.15);transform:translateY(-1px)}
.gbtn:disabled{background:#F3F4F6;color:#9CA3AF;cursor:wait;transform:none;box-shadow:none}
.rbtn{padding:8px 16px;border-radius:8px;border:1px solid #E5E7EB;background:#FFF;color:#6B7280;font-size:12px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s}
.rbtn:hover{border-color:#38FC1A;color:#111}
.epc{background:#FFF;border-radius:12px;border:1px solid #E5E7EB;padding:20px 24px;transition:all 0.2s;position:relative}
.epc:hover{border-color:#D1D5DB}
.epc.on{border:2px solid #38FC1A;background:#F0FDF4}
.ta{padding:10px 16px;border-radius:10px;border:1px solid #E5E7EB;background:#FFF;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;color:#111;resize:vertical;width:100%;min-height:80px;transition:border 0.2s,box-shadow 0.2s}
.ta:focus{border-color:#38FC1A;box-shadow:0 0 0 3px rgba(56,252,26,0.1)}
.usebtn{padding:4px 10px;border-radius:6px;border:1px solid #E5E7EB;background:#FFF;color:#6B7280;font-size:10px;font-weight:600;cursor:pointer;transition:all 0.15s;white-space:nowrap}
.usebtn:hover{border-color:#38FC1A;color:#38FC1A;background:#F0FDF4}
`;

function Thumb({id,ch}){
  var [err,setErr]=useState(false);
  var [loaded,setLoaded]=useState(false);
  if(err)return <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#111,#1a1a1a)",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <span style={{color:"#222",fontFamily:"'Bebas Neue',sans-serif",fontSize:36}}>{ch}</span>
  </div>;
  return <>
    {!loaded&&<div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"}}/>}
    <img src={"https://i.ytimg.com/vi/"+id+"/hqdefault.jpg"} alt="" onError={function(){setErr(true)}} onLoad={function(){setLoaded(true)}} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:loaded?1:0,transition:"opacity 0.3s"}}/>
  </>;
}

function findSourceVid(ep, DATA){
  if(!DATA||!DATA.length)return null;
  if(ep.source_id){var found=DATA.find(function(v){return v.id===ep.source_id});if(found)return found;}
  if(ep.source){
    var src=ep.source.toLowerCase();
    var best=null;var bestScore=0;
    for(var i=0;i<DATA.length;i++){
      var title=DATA[i].title.toLowerCase();
      var titleWords=title.split(/\s+/);
      var score=titleWords.reduce(function(acc,w){return acc+(w.length>3&&src.includes(w)?1:0)},0);
      if(score>bestScore){bestScore=score;best=DATA[i]}
    }
    if(bestScore>=3)return best;
  }
  return null;
}

function VCard({v,i,onTopicClick,onUseAsSource,onPin,isPinned}){
  var bg=v.pi>=10?"#DC2626":v.pi>=5?"#000":"#38FC1A";
  return <div className="vcard" style={{animation:"fadeUp 0.4s ease "+Math.min(i*0.03,0.6)+"s both",border:isPinned?"2px solid #38FC1A":"none"}}>
    <div onClick={function(){window.open("https://youtube.com/watch?v="+v.id,"_blank")}} style={{cursor:"pointer"}}>
      <div style={{position:"relative",paddingTop:"56.25%",background:"#F3F4F6",overflow:"hidden"}}>
        <Thumb id={v.id} ch={v.ch}/>
        <div style={{position:"absolute",top:12,right:12,background:bg,color:"#FFF",padding:"4px 10px",borderRadius:8,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,zIndex:2,boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
          {v.pi>=100?v.pi.toFixed(0):v.pi.toFixed(1)}x
        </div>
        {isPinned&&<div style={{position:"absolute",top:12,left:12,background:"#38FC1A",color:"#000",padding:"3px 8px",borderRadius:6,fontSize:10,fontWeight:700,zIndex:2}}>PINNED</div>}
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.8))",padding:"32px 14px 10px",zIndex:1}}>
          <span style={{color:"#38FC1A",fontSize:10,fontWeight:700,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>{v.ch}</span>
        </div>
      </div>
      <div style={{padding:"14px 16px 6px"}}>
        <h3 style={{fontSize:15,fontWeight:600,lineHeight:1.35,color:"#111",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{v.title}</h3>
        <div style={{display:"flex",gap:16,margin:"12px 0 10px"}}>
          {[{l:"Views",v:fmt(v.views),c:"#111"},{l:"Median",v:fmt(v.med),c:"#9CA3AF"},{l:"Date",v:v.date?v.date.slice(0,10):"",c:"#D1D5DB"}].map(function(s){return <div key={s.l}><div style={{fontSize:10,color:"#9CA3AF",fontWeight:500,marginBottom:2}}>{s.l}</div><div style={{fontSize:14,fontWeight:700,color:s.c}}>{s.v}</div></div>})}
        </div>
      </div>
    </div>
    <div style={{padding:"0 16px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",flexWrap:"wrap",gap:4}} onClick={function(e){e.stopPropagation()}}>{(v.topics||[]).map(function(t){return <span key={t} className="spill" onClick={function(){if(onTopicClick)onTopicClick(t)}} style={{background:(TC[t]||{bg:"#F3F4F6"}).bg,color:(TC[t]||{t:"#374151"}).t}}>{t.replace(/_/g," ")}</span>})}</div>
      <div style={{display:"flex",gap:6}}>
        {onPin&&<button className="usebtn" onClick={function(e){e.stopPropagation();onPin(v)}} style={{borderColor:isPinned?"#38FC1A":"",color:isPinned?"#38FC1A":""}}>{isPinned?"Unpin":"Pin for builder"}</button>}
        {onUseAsSource&&<button className="usebtn" onClick={function(e){e.stopPropagation();onUseAsSource(v)}}>Use as source</button>}
      </div>
    </div>
  </div>;
}

function EpCard({ep,i,on,toggle,DATA,onSave}){
  var [open,setOpen]=useState(false);
  var srcVid=findSourceVid(ep,DATA);
  return <div className={"epc "+(on?"on":"")}>
    <div onClick={toggle} style={{cursor:"pointer"}}>
      {on&&<div style={{position:"absolute",top:16,right:16,width:26,height:26,borderRadius:8,background:"#38FC1A",display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:15,fontWeight:700}}>&#10003;</div>}
      <div style={{fontSize:11,color:on?"#38FC1A":"#D1D5DB",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>CONCEPT {i+1}</div>
      <h3 style={{fontSize:18,fontWeight:700,color:"#111",lineHeight:1.35,paddingRight:on?36:0,marginBottom:8}}>{ep.title}</h3>
      <p style={{fontSize:14,color:"#6B7280",lineHeight:1.55,marginBottom:8}}>{ep.hook||ep.angle||""}</p>
      {ep.why_it_works&&<p style={{fontSize:13,color:"#9CA3AF",lineHeight:1.5,marginBottom:10}}>{ep.why_it_works}</p>}
    </div>
    {srcVid&&<div onClick={function(){window.open("https://youtube.com/watch?v="+srcVid.id,"_blank")}} style={{display:"flex",gap:10,alignItems:"center",background:"#FAFAFA",borderRadius:8,padding:"8px 12px",marginTop:8,cursor:"pointer",border:"1px solid #F3F4F6"}}>
      <div style={{flex:"0 0 64px",height:40,borderRadius:6,overflow:"hidden",position:"relative",background:"#E5E7EB"}}><Thumb id={srcVid.id} ch={srcVid.ch}/></div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.04em"}}>PULLED FROM</div>
        <div style={{fontSize:12,fontWeight:600,color:"#111",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{srcVid.title}</div>
        <div style={{fontSize:10,color:"#9CA3AF"}}>{srcVid.ch} · {srcVid.pi}x · {fmt(srcVid.views)} views</div>
      </div>
    </div>}
    {!srcVid&&ep.source&&<p style={{fontSize:12,color:"#D1D5DB",fontStyle:"italic",marginTop:8}}>{ep.source}</p>}
    {(ep.beats||ep.opening)&&<div style={{marginTop:12}}>
      <button onClick={function(e){e.stopPropagation();setOpen(!open)}} style={{fontSize:12,color:"#38FC1A",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0}}>{open?"Hide details ":"Show beats & opening "}{open?"\u25B2":"\u25BC"}</button>
      {open&&<div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #F3F4F6"}}>
        {ep.opening&&<div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>OPENING</div>
          <p style={{fontSize:14,color:"#374151",lineHeight:1.55,fontStyle:"italic",background:"#FAFAFA",padding:14,borderRadius:8,borderLeft:"3px solid #38FC1A"}}>{ep.opening}</p>
        </div>}
        {ep.beats&&<div>
          <div style={{fontSize:11,color:"#9CA3AF",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>BEATS TO HIT</div>
          {ep.beats.map(function(b,j){return <div key={j} style={{display:"flex",gap:10,marginBottom:8}}>
            <span style={{flex:"0 0 24px",height:24,borderRadius:6,background:"#000",color:"#38FC1A",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{j+1}</span>
            <p style={{fontSize:14,color:"#374151",lineHeight:1.5,paddingTop:1}}>{b}</p>
          </div>})}
        </div>}
      </div>}
    </div>}
    {onSave&&<div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #F3F4F6"}}>
      <button onClick={function(e){e.stopPropagation();onSave(ep)}} style={{fontSize:11,color:"#38FC1A",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0}}>&#9733; Save concept</button>
    </div>}
  </div>;
}

function DozaBrief({sel,eps,gName,gDesc,gBg,intContext,isInt,onClose,DATA}){
  var picked=eps.filter(function(_,i){return sel.includes(i)});
  return <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(12px)"}} onClick={onClose}>
    <div style={{background:"#FFF",borderRadius:20,maxWidth:760,width:"100%",maxHeight:"90vh",overflow:"auto",padding:36,position:"relative",boxShadow:"0 32px 80px rgba(0,0,0,0.12)",animation:"fadeUp 0.3s ease"}} onClick={function(e){e.stopPropagation()}}>
      <button onClick={onClose} style={{position:"absolute",top:20,right:20,background:"#F3F4F6",border:"none",width:32,height:32,borderRadius:8,fontSize:16,color:"#9CA3AF",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>&#10005;</button>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
        <div style={{width:44,height:44,borderRadius:12,background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg viewBox="0 0 100 100" width="30" height="30"><path d="M15 20 L50 5 L85 20 L85 45 L55 35 L65 50 L50 95 L15 50 Z" fill="#38FC1A"/><path d="M30 35 L50 28 L60 42 L50 55 L30 45 Z" fill="#000"/></svg>
        </div>
        <div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:"#111",letterSpacing:"0.06em"}}>EPISODE BRIEF</div>
          <div style={{fontSize:13,color:"#9CA3AF"}}>{isInt?"Internal Team Episode":"Guest: "+gName}</div>
        </div>
      </div>
      {isInt&&intContext&&<div style={{background:"#FAFAFA",borderRadius:12,padding:18,marginBottom:24}}>
        <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>EPISODE CONTEXT</div>
        <p style={{fontSize:14,color:"#374151",lineHeight:1.55}}>{intContext}</p>
      </div>}
      {!isInt&&(gDesc||gBg)&&<div style={{background:"#FAFAFA",borderRadius:12,padding:18,marginBottom:24}}>
        <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>GUEST</div>
        <p style={{fontSize:15,color:"#374151",lineHeight:1.55}}><strong style={{color:"#111"}}>{gName}</strong> — {gDesc}</p>
        {gBg&&<p style={{fontSize:13,color:"#6B7280",lineHeight:1.5,marginTop:8}}>{gBg}</p>}
      </div>}
      {picked.map(function(ep,i){
        var srcVid=findSourceVid(ep,DATA);
        return <div key={i} style={{background:"#FAFAFA",borderRadius:14,padding:24,marginBottom:20}}>
        <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>CONCEPT {i+1}</div>
        <h3 style={{fontSize:22,fontWeight:700,color:"#111",lineHeight:1.3,marginBottom:6}}>{ep.title}</h3>
        <p style={{fontSize:15,color:"#4B5563",lineHeight:1.55,marginBottom:6}}>{ep.hook||ep.angle||""}</p>
        {ep.why_it_works&&<div style={{background:"#FFF",borderRadius:10,padding:14,marginBottom:16,border:"1px solid #E5E7EB"}}>
          <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:4}}>WHY IT WORKS</div>
          <p style={{fontSize:14,color:"#374151",lineHeight:1.55}}>{ep.why_it_works}</p>
        </div>}
        {srcVid&&<div style={{display:"flex",gap:10,alignItems:"center",background:"#FFF",borderRadius:8,padding:"10px 14px",marginBottom:16,border:"1px solid #E5E7EB",cursor:"pointer"}} onClick={function(){window.open("https://youtube.com/watch?v="+srcVid.id,"_blank")}}>
          <div style={{flex:"0 0 72px",height:46,borderRadius:6,overflow:"hidden",position:"relative",background:"#E5E7EB"}}><Thumb id={srcVid.id} ch={srcVid.ch}/></div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:"#38FC1A",fontWeight:700}}>PULLED FROM</div>
            <div style={{fontSize:13,fontWeight:600,color:"#111"}}>{srcVid.title}</div>
            <div style={{fontSize:11,color:"#9CA3AF"}}>{srcVid.ch} · {srcVid.pi}x · {fmt(srcVid.views)} views</div>
          </div>
        </div>}
        {!srcVid&&ep.source&&<div style={{background:"#FFF",borderRadius:10,padding:14,marginBottom:16,border:"1px solid #E5E7EB"}}>
          <div style={{fontSize:11,color:"#D1D5DB",fontWeight:700,letterSpacing:"0.06em",marginBottom:4}}>INSPIRED BY</div>
          <p style={{fontSize:13,color:"#9CA3AF",fontStyle:"italic"}}>{ep.source}</p>
        </div>}
        {ep.opening&&<div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:"#9CA3AF",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>OPENING</div>
          <p style={{fontSize:15,color:"#374151",lineHeight:1.6,fontStyle:"italic",background:"#FFF",padding:16,borderRadius:10,borderLeft:"3px solid #38FC1A"}}>{ep.opening}</p>
        </div>}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:"#9CA3AF",fontWeight:700,letterSpacing:"0.06em",marginBottom:10}}>BEATS TO HIT</div>
          {(ep.beats||ep.points||[]).map(function(p,j){return <div key={j} style={{display:"flex",gap:12,marginBottom:10}}>
            <span style={{flex:"0 0 28px",height:28,borderRadius:8,background:"#000",color:"#38FC1A",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{j+1}</span>
            <p style={{fontSize:15,color:"#374151",lineHeight:1.55,paddingTop:3}}>{p}</p>
          </div>})}
        </div>
      </div>})}
    </div>
  </div>;
}

function smartMatch(DATA, gName, gDesc, gBg, gTopics) {
  var allText = (gName + " " + gDesc + " " + gBg).toLowerCase();
  var words = allText.split(/\s+/).filter(function(w){return w.length > 3 && !["this","that","with","from","they","their","have","been","will","would","about","which","there","these","those","other","into","also","than","more","some","very","just","when","what","really","people","every","thing","make","know","want","like","good","best","most","over","only","back","first","years","could","should","being","after","going","through","doing","still","getting","around"].includes(w)});
  var scored = DATA.map(function(v) {
    var title = v.title.toLowerCase();
    var topicMatch = gTopics.length > 0 ? ((v.topics || []).some(function(t){return gTopics.includes(t)}) ? 4 : -2) : 0;
    var wordMatch = words.reduce(function(acc, w){return acc + (title.includes(w) ? 1.5 : 0)}, 0);
    var piBonus = Math.min(v.pi * 0.02, 1);
    return { v: v, score: topicMatch + wordMatch + piBonus };
  });
  if(gTopics.length > 0){
    scored = scored.filter(function(s){return (s.v.topics||[]).some(function(t){return gTopics.includes(t)})});
  }
  scored.sort(function(a, b){return b.score - a.score});
  var seen = {};
  var results = [];
  for (var i = 0; i < scored.length; i++) {
    var ch = scored[i].v.ch;
    if (!seen[ch] || seen[ch] < 4) {
      results.push(scored[i].v);
      seen[ch] = (seen[ch] || 0) + 1;
    }
  }
  return results;
}

function loadSaved(){try{var s=window.localStorage.getItem("g_saved_concepts");return s?JSON.parse(s):[];}catch(e){return[]}}
function saveConcepts(list){try{window.localStorage.setItem("g_saved_concepts",JSON.stringify(list))}catch(e){}}

export default function App(){
  var [DATA,setDATA]=useState([]);
  var [loadingData,setLoadingData]=useState(true);
  var [tab,setTab]=useState("library");
  var [q,setQ]=useState("");
  var [fCh,setFCh]=useState("all");
  var [fTp,setFTp]=useState("all");
  var [sort,setSort]=useState("pi");
  var [isInt,setIsInt]=useState(false);
  var [gName,setGName]=useState("");
  var [gDesc,setGDesc]=useState("");
  var [gBg,setGBg]=useState("");
  var [intContext,setIntContext]=useState("");
  var [customRef,setCustomRef]=useState("");
  var [gTopics,setGTopics]=useState([]);
  var [eps,setEps]=useState([]);
  var [sel,setSel]=useState([]);
  var [loading,setLoading]=useState(false);
  var [error,setError]=useState("");
  var [showBrief,setShowBrief]=useState(false);
  var [matchPage,setMatchPage]=useState(0);
  var [saved,setSaved]=useState([]);
  var [pinned,setPinned]=useState([]);

  useEffect(function(){
    fetch("/data.json").then(function(r){return r.json()}).then(function(d){setDATA(d);setLoadingData(false)}).catch(function(){setLoadingData(false)});
    setSaved(loadSaved());
  },[]);

  var CHANNELS=useMemo(function(){return Array.from(new Set(DATA.map(function(v){return v.ch}))).sort()},[DATA]);
  var TOPICS=useMemo(function(){return Array.from(new Set(DATA.flatMap(function(v){return v.topics||[]}))).sort()},[DATA]);
  var topicCounts=useMemo(function(){var c={};DATA.forEach(function(v){(v.topics||[]).forEach(function(t){c[t]=(c[t]||0)+1})});return c},[DATA]);

  var filtered=useMemo(function(){
    var d=[].concat(DATA);
    if(q){var lq=q.toLowerCase();d=d.filter(function(v){return v.title.toLowerCase().includes(lq)||v.ch.toLowerCase().includes(lq)})}
    if(fCh!=="all")d=d.filter(function(v){return v.ch===fCh});
    if(fTp!=="all")d=d.filter(function(v){return(v.topics||[]).includes(fTp)});
    if(sort==="pi")d.sort(function(a,b){return b.pi-a.pi});
    else if(sort==="views")d.sort(function(a,b){return b.views-a.views});
    else d.sort(function(a,b){return(b.date||"").localeCompare(a.date||"")});
    return d;
  },[DATA,q,fCh,fTp,sort]);

  var allMatched=useMemo(function(){
    if(isInt){
      if(!intContext && gTopics.length===0) return [];
      return smartMatch(DATA, "", intContext, intContext, gTopics);
    }
    if(!gName && !gBg && gTopics.length===0) return [];
    return smartMatch(DATA, gName, gDesc, gBg, gTopics);
  },[DATA,gName,gDesc,gBg,gTopics,isInt,intContext]);

  var matched = allMatched.slice(matchPage*20, matchPage*20+20);
  var totalPages = Math.ceil(allMatched.length/20);

  var toggleTopic=function(t){setGTopics(function(p){return p.includes(t)?p.filter(function(x){return x!==t}):[].concat(p,[t])});setEps([]);setSel([]);setMatchPage(0)};
  var toggleSel=function(i){setSel(function(p){return p.includes(i)?p.filter(function(x){return x!==i}):[].concat(p,[i])})};

  var togglePin=function(v){
    setPinned(function(p){
      var exists=p.some(function(x){return x.id===v.id});
      if(exists)return p.filter(function(x){return x.id!==v.id});
      return [].concat(p,[v]);
    });
    setEps([]);setSel([]);
  };

  var useAsSource=function(v){
    setTab("builder");
    setCustomRef("\""+v.title+"\" by "+v.ch+" ("+v.pi+"x performance, "+fmt(v.views)+" views) — https://youtube.com/watch?v="+v.id);
  };

  var doSave=function(ep){
    var srcVid=findSourceVid(ep,DATA);
    var saved_item={
      title:ep.title,
      hook:ep.hook||ep.angle||"",
      why_it_works:ep.why_it_works||"",
      beats:ep.beats||[],
      opening:ep.opening||"",
      source:ep.source||"",
      source_id:ep.source_id||"",
      ts:Date.now()
    };
    if(srcVid){
      saved_item.src_title=srcVid.title;
      saved_item.src_ch=srcVid.ch;
      saved_item.src_id=srcVid.id;
      saved_item.src_pi=srcVid.pi;
      saved_item.src_views=srcVid.views;
    }
    var updated=[].concat(saved,[saved_item]);
    setSaved(updated);
    saveConcepts(updated);
  };

  var generate=async function(){
    setLoading(true);setError("");setEps([]);setSel([]);
    var pinnedCtx=pinned.map(function(v){return "- ["+v.id+"] \""+v.title+"\" ("+v.ch+", "+v.pi+"x) [PINNED - use this as primary source]"}).join("\n");
    var autoCtx=matched.filter(function(v){return!pinned.some(function(p){return p.id===v.id})}).slice(0,Math.max(2,8-pinned.length)).map(function(v){return "- ["+v.id+"] \""+v.title+"\" ("+v.ch+", "+v.pi+"x)"}).join("\n");
    var ctx=pinnedCtx+(pinnedCtx&&autoCtx?"\n":"")+autoCtx;
    var refBlock=customRef?"\nOutlier ref: "+customRef.slice(0,200):"";
    var promptText="";
    if(isInt){
      promptText="Geronimo Unfiltered Podcast. Host: Doza, a straight-talking business operator.\n\nDoza wants to record an INTERNAL episode (no guest) about this topic:\n"+intContext.slice(0,300)+"\n\nBelow are proven videos on related themes. Study WHY they worked and apply those PATTERNS to Doza's take. Each concept MUST reference which specific video it was pulled from using the [ID] in brackets.\n\n5 concepts. JSON only, no other text. Include source_id field with the video ID from the brackets:\n[{\"title\":\"\",\"hook\":\"\",\"why_it_works\":\"\",\"beats\":[\"\",\"\",\"\",\"\"],\"opening\":\"\",\"source\":\"\",\"source_id\":\"\"}]\n\nProven patterns:\n"+ctx+refBlock;
    }else{
      promptText="Geronimo Unfiltered Podcast. Host: Doza.\n\nGuest: "+gName+" ("+gDesc+")\nBio: "+gBg.slice(0,300)+"\n\nBelow are proven videos. DO NOT copy their topics. Study WHY they worked and apply those PATTERNS to this guest's real background. Each concept MUST reference which specific video it was pulled from using the [ID] in brackets.\n\n5 concepts. JSON only, no other text. Include source_id field with the video ID from the brackets:\n[{\"title\":\"\",\"hook\":\"\",\"why_it_works\":\"\",\"beats\":[\"\",\"\",\"\",\"\"],\"opening\":\"\",\"source\":\"\",\"source_id\":\"\"}]\n\nProven patterns:\n"+ctx+refBlock;
    }
    try{
      var res=await fetch("/.netlify/functions/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:promptText})});
      if(!res.ok){setError("API error "+res.status);setLoading(false);return;}
      var data=await res.json();
      if(!data.content||!data.content[0]||!data.content[0].text){setError("Empty response");setLoading(false);return;}
      var raw=data.content[0].text.replace(/```json\n?|```\n?/g,"").trim();
      try{setEps(JSON.parse(raw));}catch(e){var m=raw.match(/\[[\s\S]*\]/);if(m){try{setEps(JSON.parse(m[0]))}catch(e2){setError("Parse error: "+raw.slice(0,120))}}else{setError("Parse error: "+raw.slice(0,120))}}
    }catch(e){setError("Error: "+e.message);}
    setLoading(false);
  };

  var canGen=isInt?(intContext||gTopics.length>0)&&(allMatched.length>0||pinned.length>0):gName&&gBg&&(allMatched.length>0||pinned.length>0);
  var genLabel=pinned.length>0?"Generating from "+pinned.length+" pinned"+(matched.length>0?" + matches "+(matchPage*20+1)+"-"+Math.min((matchPage+1)*20,allMatched.length):""):"Generating from matches "+(matchPage*20+1)+"-"+Math.min((matchPage+1)*20,allMatched.length);

  if(loadingData)return <div style={{minHeight:"100vh",background:"#FAFAF9",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{textAlign:"center"}}>
      <div style={{width:48,height:48,borderRadius:12,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
        <svg viewBox="0 0 100 100" width="32" height="32"><path d="M15 20 L50 5 L85 20 L85 45 L55 35 L65 50 L50 95 L15 50 Z" fill="#38FC1A"/><path d="M30 35 L50 28 L60 42 L50 55 L30 45 Z" fill="#000"/></svg>
      </div>
      <div style={{color:"#9CA3AF",fontSize:14}}>Loading episodes...</div>
    </div>
  </div>;

  return <div style={{minHeight:"100vh",background:"#FAFAF9"}}>
    <style>{CSS}</style>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet"/>
    {showBrief&&<DozaBrief sel={sel} eps={eps} gName={gName} gDesc={gDesc} gBg={gBg} intContext={intContext} isInt={isInt} onClose={function(){setShowBrief(false)}} DATA={DATA}/>}

    <div style={{background:"#000",padding:"18px 28px"}}>
      <div style={{maxWidth:1320,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:40,height:40,borderRadius:10,background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg viewBox="0 0 100 100" width="28" height="28"><path d="M15 20 L50 5 L85 20 L85 45 L55 35 L65 50 L50 95 L15 50 Z" fill="#38FC1A"/><path d="M30 35 L50 28 L60 42 L50 55 L30 45 Z" fill="#000"/></svg>
          </div>
          <div>
            <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#FFF",letterSpacing:"0.04em"}}>GERONIMO UNFILTERED</h1>
            <p style={{color:"#38FC1A",fontSize:10,fontWeight:600,letterSpacing:"0.12em"}}>PODCAST RESEARCH ENGINE</p>
          </div>
        </div>
        <div style={{display:"flex",gap:28}}>
          {[{l:"Episodes",v:DATA.length,c:"#38FC1A"},{l:"Channels",v:CHANNELS.length,c:"#FFF"},{l:"Pinned",v:pinned.length,c:pinned.length>0?"#38FC1A":"#444"},{l:"Saved",v:saved.length,c:"#FEF9C3"}].map(function(s){return <div key={s.l} style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:700,color:s.c}}>{s.v}</div>
            <div style={{fontSize:9,color:"#666",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>{s.l}</div>
          </div>})}
        </div>
      </div>
    </div>

    <div style={{background:"#FFF",borderBottom:"1px solid #F0F0EE",position:"sticky",top:0,zIndex:50}}>
      <div style={{maxWidth:1320,margin:"0 auto",padding:"0 28px",display:"flex",gap:8}}>
        {[{id:"library",l:"Proven Ideas"},{id:"builder",l:"Episode Builder"+(pinned.length?" ("+pinned.length+" pinned)":"")},{id:"saved",l:"Saved ("+saved.length+")"},{id:"guide",l:"How to Use"}].map(function(t){return <button key={t.id} onClick={function(){setTab(t.id)}} style={{padding:"14px 20px",background:"none",border:"none",borderBottom:tab===t.id?"2px solid #38FC1A":"2px solid transparent",color:tab===t.id?"#111":"#9CA3AF",fontWeight:tab===t.id?600:500,fontSize:14,cursor:"pointer",transition:"all 0.2s"}}>{t.l}</button>})}
      </div>
    </div>

    <div style={{maxWidth:1320,margin:"0 auto",padding:"28px 28px 80px"}}>
      {tab==="library"&&<>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",marginBottom:16}}>
          <input className="fi" placeholder="Search episodes..." value={q} onChange={function(e){setQ(e.target.value)}} style={{flex:"1 1 180px",maxWidth:280}}/>
          <select className="fs" value={fCh} onChange={function(e){setFCh(e.target.value)}}><option value="all">All channels</option>{CHANNELS.map(function(c){return <option key={c} value={c}>{c}</option>})}</select>
          <select className="fs" value={sort} onChange={function(e){setSort(e.target.value)}}><option value="pi">Performance</option><option value="views">Views</option><option value="date">Recent</option></select>
          <span style={{fontSize:13,color:"#D1D5DB",fontWeight:500}}>{filtered.length} episodes</span>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:"#9CA3AF",fontWeight:700,letterSpacing:"0.06em",marginBottom:10}}>FILTER BY TOPIC</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {TOPICS.map(function(t){var c=TC[t]||{bg:"#F3F4F6",t:"#374151"};var on=fTp===t;return <span key={t} className="tpill" onClick={function(){setFTp(on?"all":t)}} style={{background:on?c.t:c.bg,color:on?"#FFF":c.t,border:on?"2px solid "+c.t:"1px solid transparent"}}>{t.replace(/_/g," ")} <span style={{opacity:0.6,marginLeft:4,fontSize:10}}>({topicCounts[t]||0})</span></span>})}
            {fTp!=="all"&&<span onClick={function(){setFTp("all")}} style={{fontSize:12,color:"#9CA3AF",cursor:"pointer",padding:"6px 14px",display:"flex",alignItems:"center"}}>Clear</span>}
          </div>
        </div>
        <div className="card-grid">{filtered.map(function(v,i){return <VCard key={v.id} v={v} i={i} onTopicClick={function(t){setFTp(fTp===t?"all":t)}} onUseAsSource={useAsSource} onPin={togglePin} isPinned={pinned.some(function(p){return p.id===v.id})}/>})}</div>
      </>}

      {tab==="builder"&&<div style={{maxWidth:720,margin:"0 auto"}}>
        <div style={{display:"inline-flex",background:"#F3F4F6",borderRadius:12,padding:4,marginBottom:28}}>
          {[{v:false,l:"Guest Episode"},{v:true,l:"Internal Team"}].map(function(o){return <button key={o.l} onClick={function(){setIsInt(o.v);setEps([]);setSel([]);setMatchPage(0)}} style={{padding:"10px 24px",border:"none",borderRadius:10,background:isInt===o.v?"#000":"transparent",color:isInt===o.v?"#38FC1A":"#9CA3AF",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all 0.2s"}}>{o.l}</button>})}
        </div>

        {!isInt&&<div style={{background:"#FFF",borderRadius:14,padding:24,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:12}}>THE GUEST</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <input className="fi" value={gName} onChange={function(e){setGName(e.target.value);setEps([]);setSel([])}} placeholder="Guest name"/>
            <input className="fi" value={gDesc} onChange={function(e){setGDesc(e.target.value);setEps([]);setSel([])}} placeholder="Their expertise"/>
          </div>
          <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>GUEST BACKGROUND</div>
          <textarea className="ta" value={gBg} onChange={function(e){setGBg(e.target.value);setEps([]);setSel([])}} placeholder="Paste their bio, key achievements, what they're known for, their story. The more context, the better the angles."/>
        </div>}

        {isInt&&<div style={{background:"#FFF",borderRadius:14,padding:24,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>WHAT ARE YOU THINKING ABOUT?</div>
          <textarea className="ta" value={intContext} onChange={function(e){setIntContext(e.target.value);setEps([]);setSel([]);setMatchPage(0)}} placeholder="What topic, theme, or idea are you considering? The engine will find proven episodes that validate your idea."/>
        </div>}

        <div style={{background:"#FFF",borderRadius:14,padding:24,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>FILTER BY TOPIC</div>
          <div style={{fontSize:12,color:"#9CA3AF",marginBottom:12}}>Select topics to filter matches from the full {DATA.length} episode library.</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {TOPICS.map(function(t){var on=gTopics.includes(t);var c=TC[t]||{bg:"#F3F4F6",t:"#374151"};
              return <button key={t} onClick={function(){toggleTopic(t)}} style={{padding:"8px 16px",borderRadius:8,border:on?"2px solid "+c.t:"1px solid #E5E7EB",background:on?c.bg:"#FFF",color:on?c.t:"#9CA3AF",fontSize:13,fontWeight:on?600:500,cursor:"pointer",outline:"none",transition:"all 0.15s",textTransform:"capitalize"}}>{t.replace(/_/g," ")} <span style={{opacity:0.5,fontSize:11}}>({topicCounts[t]||0})</span></button>})}
          </div>
        </div>

        {pinned.length>0&&<div style={{background:"#FFF",borderRadius:14,padding:24,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",border:"1px solid #38FC1A"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em"}}>PINNED FROM LIBRARY ({pinned.length})</div>
            <button className="rbtn" onClick={function(){setPinned([]);setEps([]);setSel([])}}>Clear all pins</button>
          </div>
          <div style={{fontSize:12,color:"#9CA3AF",marginBottom:12}}>These episodes will be used as primary source material when generating. Pinned from Proven Ideas.</div>
          {pinned.map(function(v){return <div key={v.id} style={{display:"flex",gap:10,alignItems:"center",background:"#F0FDF4",borderRadius:8,padding:"10px 12px",marginBottom:6,border:"1px solid #DCFCE7"}}>
            <div style={{flex:"0 0 64px",height:42,borderRadius:6,overflow:"hidden",position:"relative",background:"#F3F4F6",cursor:"pointer"}} onClick={function(){window.open("https://youtube.com/watch?v="+v.id,"_blank")}}><Thumb id={v.id} ch={v.ch}/></div>
            <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={function(){window.open("https://youtube.com/watch?v="+v.id,"_blank")}}>
              <div style={{fontSize:13,fontWeight:600,color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.title}</div>
              <div style={{fontSize:11,color:"#9CA3AF"}}>{v.ch} · {v.pi}x · {fmt(v.views)} views</div>
            </div>
            <button onClick={function(){togglePin(v)}} style={{background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",fontSize:14,padding:"4px"}}>&#10005;</button>
          </div>})}
        </div>}

        {allMatched.length>0&&<div style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:11,color:"#D1D5DB",fontWeight:700,letterSpacing:"0.06em"}}>SHOWING {matchPage*20+1}-{Math.min((matchPage+1)*20,allMatched.length)} OF {allMatched.length} MATCHES</div>
            <div style={{display:"flex",gap:8}}>
              {matchPage>0&&<button className="rbtn" onClick={function(){setMatchPage(matchPage-1);setEps([]);setSel([])}}>&#8592; Prev 20</button>}
              {matchPage<totalPages-1&&<button className="rbtn" onClick={function(){setMatchPage(matchPage+1);setEps([]);setSel([])}}>Next 20 &#8594;</button>}
            </div>
          </div>
          {matched.map(function(v){return <div key={v.id} onClick={function(){window.open("https://youtube.com/watch?v="+v.id,"_blank")}} style={{background:"#FFF",borderRadius:10,padding:"12px 14px",marginBottom:8,display:"flex",gap:12,alignItems:"center",boxShadow:"0 1px 2px rgba(0,0,0,0.03)",cursor:"pointer",transition:"all 0.2s",border:"1px solid transparent"}} onMouseEnter={function(e){e.currentTarget.style.borderColor="#E5E7EB"}} onMouseLeave={function(e){e.currentTarget.style.borderColor="transparent"}}>
            <div style={{flex:"0 0 80px",height:52,borderRadius:8,overflow:"hidden",position:"relative",background:"#F3F4F6"}}><Thumb id={v.id} ch={v.ch}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:"#111",overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{v.title}</div>
              <div style={{fontSize:11,color:"#9CA3AF",marginTop:2}}>{v.ch} · {fmt(v.views)} views · {v.date?v.date.slice(0,10):""}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",flexShrink:0}}>
              <div style={{fontSize:14,fontWeight:700,color:"#38FC1A"}}>{v.pi>=100?v.pi.toFixed(0):v.pi.toFixed(1)}x</div>
              <div style={{display:"flex",gap:3,marginTop:3}}>{(v.topics||[]).slice(0,2).map(function(t){return <span key={t} style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:(TC[t]||{bg:"#F3F4F6"}).bg,color:(TC[t]||{t:"#374151"}).t}}>{t.replace(/_/g," ")}</span>})}</div>
            </div>
          </div>})}
        </div>}

        {canGen&&eps.length===0&&<div style={{background:"#FFF",borderRadius:14,padding:24,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>ADD AN OUTLIER <span style={{color:"#D1D5DB",fontWeight:400}}>(optional)</span></div>
          <div style={{fontSize:12,color:"#9CA3AF",marginBottom:12}}>Paste a YouTube link, describe a video, or name a person/channel you think is an outlier.</div>
          <textarea className="ta" value={customRef} onChange={function(e){setCustomRef(e.target.value)}} placeholder="e.g. https://youtube.com/watch?v=... or 'Hormozi's recent video on why most businesses fail at $3M did 2M views in 3 days'"/>
        </div>}

        {canGen&&eps.length===0&&<div style={{textAlign:"center",marginBottom:8}}><span style={{fontSize:11,color:"#9CA3AF"}}>{genLabel}</span></div>}
        {canGen&&eps.length===0&&<button className="gbtn" onClick={generate} disabled={loading}>{loading?"Generating 5 concepts...":"Generate Episode Ideas"}</button>}
        {error&&<div style={{background:"#FEF2F2",borderRadius:12,padding:16,marginBottom:20,color:"#DC2626",fontSize:14,marginTop:16}}>{error}</div>}
        {eps.length>0&&<div style={{marginTop:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em"}}>SELECT CONCEPTS</div>
            {sel.length>0&&<button onClick={function(){setShowBrief(true)}} style={{padding:"10px 24px",borderRadius:10,border:"none",background:"#000",color:"#38FC1A",fontSize:13,fontWeight:600,cursor:"pointer"}}>Present to Doza ({sel.length})</button>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>{eps.map(function(ep,i){return <EpCard key={i} ep={ep} i={i} on={sel.includes(i)} toggle={function(){toggleSel(i)}} DATA={DATA} onSave={doSave}/>})}</div>
          <button onClick={function(){setEps([]);setSel([])}} style={{marginTop:20,padding:"10px 20px",borderRadius:10,border:"1px solid #E5E7EB",background:"#FFF",color:"#9CA3AF",fontSize:13,fontWeight:500,cursor:"pointer"}}>Regenerate</button>
        </div>}
      </div>}

      {tab==="saved"&&<div style={{maxWidth:760,margin:"0 auto"}}>
        {saved.length===0&&<div style={{textAlign:"center",padding:"60px 20px",color:"#9CA3AF"}}>
          <div style={{fontSize:40,marginBottom:12}}>&#9733;</div>
          <div style={{fontSize:15,fontWeight:600}}>No saved concepts yet</div>
          <div style={{fontSize:13,marginTop:8}}>Generate episode ideas and click "Save concept" on the ones you want to keep.</div>
        </div>}
        {saved.length>0&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em"}}>{saved.length} SAVED CONCEPTS</div>
          <div style={{display:"flex",gap:8}}>
            <button className="rbtn" onClick={function(){
              var text=saved.map(function(s,i){
                var lines=["CONCEPT "+(i+1)+": "+s.title,"Hook: "+s.hook];
                if(s.why_it_works)lines.push("Why it works: "+s.why_it_works);
                if(s.beats&&s.beats.length)lines.push("Beats: "+s.beats.join(" | "));
                if(s.opening)lines.push("Opening: "+s.opening);
                if(s.src_title)lines.push("Pulled from: \""+s.src_title+"\" by "+s.src_ch+" ("+s.src_pi+"x, "+fmt(s.src_views)+" views) — https://youtube.com/watch?v="+s.src_id);
                else if(s.source)lines.push("Source: "+s.source);
                lines.push("Saved: "+new Date(s.ts).toLocaleDateString());
                return lines.join("\n");
              }).join("\n\n---\n\n");
              var header="GERONIMO UNFILTERED — SAVED EPISODE CONCEPTS\nExported: "+new Date().toLocaleDateString()+"\n"+saved.length+" concepts\n\n"+"=".repeat(50)+"\n\n";
              var blob=new Blob([header+text],{type:"text/plain"});
              var url=URL.createObjectURL(blob);
              var a=document.createElement("a");a.href=url;a.download="geronimo-saved-concepts.txt";a.click();URL.revokeObjectURL(url);
            }}>Export as text</button>
            <button className="rbtn" onClick={function(){
              var rows=[["Concept","Hook","Why It Works","Beats","Opening","Source Video","Source Channel","Source PI","Source Views","Source URL","Saved Date"]];
              saved.forEach(function(s){rows.push([s.title,s.hook,s.why_it_works||"",(s.beats||[]).join(" | "),s.opening||"",s.src_title||"",s.src_ch||"",s.src_pi||"",s.src_views||"",s.src_id?"https://youtube.com/watch?v="+s.src_id:"",new Date(s.ts).toLocaleDateString()])});
              var csv=rows.map(function(r){return r.map(function(c){return'"'+String(c).replace(/"/g,'""')+'"'}).join(",")}).join("\n");
              var blob=new Blob([csv],{type:"text/csv"});
              var url=URL.createObjectURL(blob);
              var a=document.createElement("a");a.href=url;a.download="geronimo-saved-concepts.csv";a.click();URL.revokeObjectURL(url);
            }}>Export as CSV</button>
            <button className="rbtn" onClick={function(){if(window.confirm("Clear all saved concepts?")){setSaved([]);saveConcepts([])}}}>Clear all</button>
          </div>
        </div>}
        {saved.map(function(s,i){return <div key={i} style={{background:"#FFF",borderRadius:14,border:"1px solid #E5E7EB",padding:24,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:"#9CA3AF",fontWeight:600,marginBottom:4}}>CONCEPT {i+1} · {new Date(s.ts).toLocaleDateString()}</div>
              <h3 style={{fontSize:18,fontWeight:700,color:"#111",lineHeight:1.35,marginBottom:6}}>{s.title}</h3>
              <p style={{fontSize:14,color:"#6B7280",lineHeight:1.55}}>{s.hook}</p>
            </div>
            <button onClick={function(){var u=saved.filter(function(_,j){return j!==i});setSaved(u);saveConcepts(u)}} style={{background:"none",border:"none",color:"#D1D5DB",cursor:"pointer",fontSize:16,padding:"4px",marginLeft:12}}>&#10005;</button>
          </div>
          {s.why_it_works&&<div style={{background:"#FAFAFA",borderRadius:10,padding:14,marginBottom:12}}>
            <div style={{fontSize:10,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:4}}>WHY IT WORKS</div>
            <p style={{fontSize:13,color:"#374151",lineHeight:1.55}}>{s.why_it_works}</p>
          </div>}
          {s.src_id&&<div onClick={function(){window.open("https://youtube.com/watch?v="+s.src_id,"_blank")}} style={{display:"flex",gap:10,alignItems:"center",background:"#FAFAFA",borderRadius:10,padding:"10px 14px",marginBottom:12,cursor:"pointer",border:"1px solid #F3F4F6"}}>
            <div style={{flex:"0 0 72px",height:46,borderRadius:6,overflow:"hidden",position:"relative",background:"#E5E7EB"}}><Thumb id={s.src_id} ch={s.src_ch||""}/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:"#38FC1A",fontWeight:700,letterSpacing:"0.04em"}}>PULLED FROM</div>
              <div style={{fontSize:13,fontWeight:600,color:"#111"}}>{s.src_title}</div>
              <div style={{fontSize:11,color:"#9CA3AF"}}>{s.src_ch} · {s.src_pi}x · {fmt(s.src_views)} views</div>
            </div>
          </div>}
          {!s.src_id&&s.source&&<p style={{fontSize:12,color:"#D1D5DB",fontStyle:"italic",marginBottom:12}}>{s.source}</p>}
          {s.beats&&s.beats.length>0&&<div style={{marginBottom:12}}>
            <div style={{fontSize:10,color:"#9CA3AF",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>BEATS TO HIT</div>
            {s.beats.map(function(b,j){return <div key={j} style={{display:"flex",gap:8,marginBottom:6}}>
              <span style={{flex:"0 0 20px",height:20,borderRadius:4,background:"#000",color:"#38FC1A",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{j+1}</span>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{b}</p>
            </div>})}
          </div>}
          {s.opening&&<div>
            <div style={{fontSize:10,color:"#9CA3AF",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>OPENING</div>
            <p style={{fontSize:13,color:"#374151",lineHeight:1.55,fontStyle:"italic",background:"#FAFAFA",padding:12,borderRadius:8,borderLeft:"3px solid #38FC1A"}}>{s.opening}</p>
          </div>}
        </div>})}
      </div>}

      {tab==="guide"&&<div style={{maxWidth:760,margin:"0 auto"}}>
        <div style={{background:"#FFF",borderRadius:16,padding:32,marginBottom:24,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#111",letterSpacing:"0.04em",marginBottom:4}}>PODCAST RESEARCH ENGINE</h2>
          <p style={{fontSize:15,color:"#6B7280",lineHeight:1.6,marginBottom:24}}>This tool scrapes the top-performing podcast episodes from {CHANNELS.length} major YouTube channels, scores them by performance index, and uses that data to generate pre-validated episode concepts for Geronimo Unfiltered.</p>

          <div style={{background:"#000",borderRadius:12,padding:20,marginBottom:24}}>
            <div style={{fontSize:12,color:"#38FC1A",fontWeight:700,letterSpacing:"0.08em",marginBottom:8}}>HOW IT WORKS</div>
            <p style={{fontSize:14,color:"#FFF",lineHeight:1.6}}>Every week, the engine automatically scrapes {CHANNELS.length} podcast channels via YouTube Data API. It pulls every video over 10 minutes from the last 2 years, calculates each video's performance vs the channel's median (the "PI" score), and keeps the top performers. A video with 5x means it got 5 times the channel's usual views. That's a signal the topic, angle, or packaging resonated.</p>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#DCFCE7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#166534"}}>1</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Proven Ideas (The Library)</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>Browse all {DATA.length} episodes in the database. Filter by channel, sort by performance, views, or recency. Use the topic filter pills to narrow down to specific themes like mindset, money, relationships, etc. Each card shows the YouTube thumbnail, title, performance index, view count, and date.</p>
              </div>
            </div>
            <div style={{background:"#FAFAFA",borderRadius:10,padding:16,marginLeft:44}}>
              <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>KEY ACTIONS</div>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>Click a card</strong> — opens the YouTube video so you can study the thumbnail, title, and packaging</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>Click a topic pill</strong> — filters the entire library to that topic</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>Pin for builder</strong> — selects that specific video as source material for episode generation. Pin multiple to build a custom source set.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7}}><strong>Use as source</strong> — jumps to Episode Builder with that video pre-loaded as an outlier reference</p>
            </div>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#F3E8FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#7C3AED"}}>2</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Episode Builder (Guest Episode)</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>Enter a guest's name, expertise, and background. The more detail you paste into the background field (bio, achievements, story), the more specific the generated angles will be. The engine matches the guest's background against the entire library to find relevant proven performers.</p>
              </div>
            </div>
            <div style={{background:"#FAFAFA",borderRadius:10,padding:16,marginLeft:44}}>
              <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>THE WORKFLOW</div>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>1.</strong> Enter guest name, expertise, and paste their full background</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>2.</strong> Optionally filter by topic to narrow the match pool</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>3.</strong> Review the matched episodes. Page through with Next 20 for more source material.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>4.</strong> Optionally add an outlier video or reference</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>5.</strong> Hit Generate. The AI studies WHY the matched videos performed and applies those patterns to the guest's real background. It does not copy topics. It extracts what made the angle work and builds something authentic to this guest.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>6.</strong> Review 5 concepts. Each shows the hook, why it works, beats to hit, an opening, and which source video it was pulled from (with thumbnail)</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>7.</strong> Select the best and hit "Present to Doza" for a formatted brief</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7}}><strong>8.</strong> Save standout concepts to the Saved tab for later</p>
            </div>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#E0E7FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#4338CA"}}>3</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Episode Builder (Internal Team)</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>For episodes with no guest. Type what you're thinking about discussing and the engine finds proven episodes that validate your idea. Use these for structural inspiration on how to package and angle the topic.</p>
              </div>
            </div>
            <div style={{background:"#FAFAFA",borderRadius:10,padding:16,marginLeft:44}}>
              <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>PRO TIP</div>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7}}>Use the matched videos not just for angle inspiration but also for packaging research. Click into the YouTube video, study the thumbnail design and title structure. These videos outperformed their channel's median, which means their packaging worked. Replicate the pattern, not the topic.</p>
            </div>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#FEF9C3",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#A16207"}}>4</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Pinning Videos</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>When you find specific videos in the library that you want to recreate or use as source material, pin them. Pinned videos appear at the top of the Episode Builder and are used as primary sources when generating. This lets you hand-pick your source set rather than relying on automatic matching alone. Pin across different channels and topics to get diverse angles.</p>
              </div>
            </div>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#FFE4E6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#BE123C"}}>5</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Performance Index (PI)</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>The PI score is the ratio of a video's views to its channel's median views. This normalises across channels so you can compare a niche channel's breakout hit with a massive channel's average performer.</p>
              </div>
            </div>
            <div style={{background:"#FAFAFA",borderRadius:10,padding:16,marginLeft:44}}>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><span style={{color:"#38FC1A",fontWeight:700}}>1.5-3x</span> — Solid performer. Above average for that channel.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><span style={{color:"#000",fontWeight:700}}>5-10x</span> — Strong outlier. Something about this topic or angle hit hard.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7}}><span style={{color:"#DC2626",fontWeight:700}}>10x+</span> — Viral. The packaging, topic, and timing all aligned. Study this closely.</p>
            </div>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#CCFBF1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#0F766E"}}>6</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Adding Channels</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>To add a new YouTube channel, go to the GitHub repo, edit <strong>scrape.py</strong>, and add a line to the CHANNELS list: <span style={{fontFamily:"monospace",background:"#F3F4F6",padding:"2px 6px",borderRadius:4,fontSize:12}}>("@HandleName", "Display Name")</span>. Commit the change and run the scraper from the Actions tab.</p>
              </div>
            </div>
          </div>

          <div>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#F3F4F6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#6B7280"}}>7</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Auto-Refresh</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>The scraper runs automatically every Sunday at 8pm AEST via GitHub Actions. It pulls fresh data from all {CHANNELS.length} channels, tags every episode with topics, and deploys to Netlify. You can also trigger a manual scrape anytime from the GitHub Actions tab.</p>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  </div>;
}
