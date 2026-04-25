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

function VCard({v,i,onTopicClick,onUseAsSource,onPin,isPinned,onInspect}){
  var bg=v.pi>=10?"#DC2626":v.pi>=5?"#000":"#38FC1A";
  return <div className="vcard" style={{animation:"fadeUp 0.4s ease "+Math.min(i*0.03,0.6)+"s both",border:isPinned?"2px solid #38FC1A":"none"}}>
    <div onClick={function(){if(onInspect)onInspect(v);else window.open("https://youtube.com/watch?v="+v.id,"_blank")}} style={{cursor:"pointer"}}>
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

function EpCard({ep,i,on,toggle,DATA,onSave,onFindClient,clientResults,clientLoading,onPickClient}){
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
    <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #F3F4F6",display:"flex",gap:12,flexWrap:"wrap"}}>
      {onSave&&<button onClick={function(e){e.stopPropagation();onSave(ep)}} style={{fontSize:11,color:"#38FC1A",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0}}>&#9733; Save concept</button>}
      {onFindClient&&<button onClick={function(e){e.stopPropagation();onFindClient(i,ep)}} disabled={clientLoading} style={{fontSize:11,color:"#785DD9",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0}}>{clientLoading?"Searching...":"&#128269; Find a client for this angle"}</button>}
    </div>
    {clientResults&&clientResults.length>0&&<div style={{marginTop:12,background:"#F9F5FF",borderRadius:10,padding:16,border:"1px solid #E9D5FF"}}>
      <div style={{fontSize:11,color:"#785DD9",fontWeight:700,letterSpacing:"0.06em",marginBottom:10}}>CLIENT GUEST CANDIDATES</div>
      {clientResults.map(function(s,ci){return <div key={s.id} style={{display:"flex",gap:10,alignItems:"center",background:"#FFF",borderRadius:8,padding:"8px 12px",marginBottom:6,cursor:"pointer",border:"1px solid #F3F4F6"}} onClick={function(e){e.stopPropagation();if(onPickClient)onPickClient(s,ep)}}>
        <div style={{flex:"0 0 24px",height:24,borderRadius:6,background:"#785DD9",display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:11,fontWeight:700}}>{ci+1}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:600,color:"#111"}}>{s.owner||s.name}</div>
          <div style={{fontSize:11,color:"#9CA3AF"}}>{s.name}{s.type?" · "+s.type:""}{s.location?" · "+s.location:""}</div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          {s.revenue>0&&<div style={{fontSize:13,fontWeight:700,color:"#785DD9"}}>${fmt(s.revenue)}/mo</div>}
          {s.members>0&&<div style={{fontSize:10,color:"#9CA3AF"}}>{s.members} members</div>}
        </div>
      </div>})}
      <p style={{fontSize:10,color:"#9CA3AF",marginTop:6}}>Click a client to load them as the guest for this angle.</p>
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

function InsightModal({v,mode,onClose,onPin,isPinned,onUseAsSource}){
  var [insight,setInsight]=useState(null);
  var [loading,setLoading]=useState(true);
  var [err,setErr]=useState("");
  useEffect(function(){
    setLoading(true);setInsight(null);setErr("");
    var prompt="You are the executive producer of a top-5 global podcast. You've produced thousands of episodes and understand exactly why certain episodes break out.\n\nAnalyze this episode that performed "+v.pi+"x its channel's median ("+fmt(v.views)+" views vs "+fmt(v.med)+" median):\n\nTitle: \""+v.title+"\"\nChannel: "+v.ch+"\nTopics: "+(v.topics||[]).join(", ")+"\nDate: "+v.date+"\n\n"+(mode==="youtube"?"FORMAT: YouTube video. Focus on packaging (title + thumbnail), click-through psychology, watch time structure, and visual storytelling patterns.":"FORMAT: Audio podcast. Focus on conversational hooks, listener retention, episode structure, and why someone stays for the full episode.")+"\n\nGive your producer breakdown. JSON only, no other text:\n{\"why_it_worked\":\"2-3 sentences on why this specific title/angle outperformed\",\"packaging_pattern\":\"What pattern the title uses (curiosity gap, contrarian, specificity, authority, urgency, etc) and why it triggers clicks\",\"tension\":\"The core tension or conflict that drives engagement\",\"audience_psychology\":\"What need or desire this taps into in the viewer/listener\",\"steal_this\":\"The ONE transferable insight Geronimo Unfiltered should take from this episode. Be specific and actionable.\",\"geronimo_angle\":\"How Doza could adapt this exact pattern for Geronimo's audience of studio owners and operators. Give a specific title example.\"}";
    fetch("/.netlify/functions/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:prompt})}).then(function(r){return r.json()}).then(function(data){
      if(!data.content||!data.content[0]||!data.content[0].text){setErr("Empty response");setLoading(false);return}
      var raw=data.content[0].text.replace(/```json\n?|```\n?/g,"").trim();
      try{setInsight(JSON.parse(raw))}catch(e){var m=raw.match(/\{[\s\S]*\}/);if(m){try{setInsight(JSON.parse(m[0]))}catch(e2){setErr("Parse error")}}else{setErr("Parse error")}}
      setLoading(false);
    }).catch(function(e){setErr(e.message);setLoading(false)});
  },[v.id]);
  var bg=v.pi>=10?"#DC2626":v.pi>=5?"#000":"#38FC1A";
  return <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(12px)"}} onClick={onClose}>
    <div style={{background:"#FFF",borderRadius:20,maxWidth:720,width:"100%",maxHeight:"90vh",overflow:"auto",padding:0,position:"relative",boxShadow:"0 32px 80px rgba(0,0,0,0.15)",animation:"fadeUp 0.3s ease"}} onClick={function(e){e.stopPropagation()}}>
      <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"rgba(0,0,0,0.6)",border:"none",width:36,height:36,borderRadius:10,fontSize:18,color:"#FFF",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>&#10005;</button>
      <div style={{position:"relative",paddingTop:"50%",background:"#111",borderRadius:"20px 20px 0 0",overflow:"hidden"}}>
        <Thumb id={v.id} ch={v.ch}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.9))",padding:"40px 24px 20px"}}>
          <div style={{display:"inline-block",background:bg,color:"#FFF",padding:"4px 12px",borderRadius:8,fontWeight:700,fontSize:14,marginBottom:10}}>{v.pi>=100?v.pi.toFixed(0):v.pi.toFixed(1)}x performance</div>
          <h2 style={{fontSize:22,fontWeight:700,color:"#FFF",lineHeight:1.3}}>{v.title}</h2>
          <div style={{display:"flex",gap:16,marginTop:10}}>
            <span style={{color:"#38FC1A",fontSize:12,fontWeight:600}}>{v.ch}</span>
            <span style={{color:"#9CA3AF",fontSize:12}}>{fmt(v.views)} views</span>
            <span style={{color:"#9CA3AF",fontSize:12}}>Median: {fmt(v.med)}</span>
            <span style={{color:"#9CA3AF",fontSize:12}}>{v.date?v.date.slice(0,10):""}</span>
          </div>
        </div>
      </div>
      <div style={{padding:24}}>
        <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
          <button onClick={function(){window.open("https://youtube.com/watch?v="+v.id,"_blank")}} style={{padding:"10px 20px",borderRadius:8,border:"none",background:"#DC2626",color:"#FFF",fontSize:13,fontWeight:600,cursor:"pointer"}}>&#9654; Watch on YouTube</button>
          <button onClick={function(){if(onPin)onPin(v)}} className="rbtn" style={{borderColor:isPinned?"#38FC1A":"",color:isPinned?"#38FC1A":""}}>{isPinned?"Unpin":"Pin for builder"}</button>
          <button onClick={function(){if(onUseAsSource)onUseAsSource(v);onClose()}} className="rbtn">Use as source</button>
        </div>
        {loading&&<div style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:13,color:"#9CA3AF",marginBottom:8}}>Analyzing as a top podcast producer...</div>
          <div style={{width:200,height:4,background:"#F3F4F6",borderRadius:2,margin:"0 auto",overflow:"hidden"}}><div style={{width:"60%",height:"100%",background:"#38FC1A",borderRadius:2,animation:"shimmer 1.5s infinite"}}/></div>
        </div>}
        {err&&<div style={{background:"#FEF2F2",borderRadius:10,padding:14,color:"#DC2626",fontSize:13}}>{err}</div>}
        {insight&&<div>
          <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.08em",marginBottom:16}}>PRODUCER BREAKDOWN</div>
          <div style={{background:"#000",borderRadius:12,padding:20,marginBottom:16}}>
            <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>WHY IT WORKED</div>
            <p style={{fontSize:15,color:"#FFF",lineHeight:1.6}}>{insight.why_it_worked}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <div style={{background:"#FAFAFA",borderRadius:10,padding:16}}>
              <div style={{fontSize:10,color:"#785DD9",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>PACKAGING PATTERN</div>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.55}}>{insight.packaging_pattern}</p>
            </div>
            <div style={{background:"#FAFAFA",borderRadius:10,padding:16}}>
              <div style={{fontSize:10,color:"#DC2626",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>CORE TENSION</div>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.55}}>{insight.tension}</p>
            </div>
          </div>
          <div style={{background:"#FAFAFA",borderRadius:10,padding:16,marginBottom:16}}>
            <div style={{fontSize:10,color:"#A16207",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>AUDIENCE PSYCHOLOGY</div>
            <p style={{fontSize:13,color:"#374151",lineHeight:1.55}}>{insight.audience_psychology}</p>
          </div>
          <div style={{background:"#F0FDF4",borderRadius:10,padding:16,marginBottom:16,border:"1px solid #DCFCE7"}}>
            <div style={{fontSize:10,color:"#166534",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>STEAL THIS</div>
            <p style={{fontSize:14,color:"#111",lineHeight:1.55,fontWeight:500}}>{insight.steal_this}</p>
          </div>
          <div style={{background:"#000",borderRadius:10,padding:16,border:"1px solid #38FC1A"}}>
            <div style={{fontSize:10,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>GERONIMO ANGLE</div>
            <p style={{fontSize:14,color:"#FFF",lineHeight:1.55}}>{insight.geronimo_angle}</p>
          </div>
        </div>}
      </div>
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
  var [showSplash,setShowSplash]=useState(true);
  var [tab,setTab]=useState("guide");
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
  var [clientResults,setClientResults]=useState({});
  var [clientLoading,setClientLoading]=useState(-1);
  var [inspectVid,setInspectVid]=useState(null);

  var findClientForAngle=async function(idx,ep){
    setClientLoading(idx);
    try{
      var res=await fetch("/.netlify/functions/client-search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:ep.title+" "+ep.hook,metric:"revenue"})});
      var data=await res.json();
      if(data.studios){
        var updated=Object.assign({},clientResults);
        updated[idx]=data.studios;
        setClientResults(updated);
      }else{setError(data.error||"No client results")}
    }catch(e){setError("Client search failed: "+e.message)}
    setClientLoading(-1);
  };

  var pickClientForAngle=function(studio,ep){
    setGName(studio.owner||studio.name);
    setGDesc(studio.type||"Studio owner");
    setGBg(studio.name+" — "+(studio.type||"studio")+" in "+(studio.location||"AU")+". "+(studio.revenue?"$"+fmt(studio.revenue)+"/mo revenue. ":"")+(studio.members?studio.members+" active members. ":"")+"Program: "+(studio.program||"MDS")+". Client since "+(studio.kickoff||"unknown")+". Episode angle: "+ep.title+" — "+ep.hook);
    setIsInt(false);
    setEps([]);setSel([]);setClientResults({});
  };
  var [mode,setMode]=useState("youtube");

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
    var modeCtx=mode==="youtube"?"FORMAT: YouTube video. Optimise for: click-through rate (thumbnail + title packaging), watch time retention, shareability. Each concept needs a scroll-stopping title, a thumbnail concept description, and beats structured for visual storytelling. Think about pattern interrupts, visual hooks, and retention pacing.":"FORMAT: Audio podcast. Optimise for: compelling audio hooks, conversational flow, listener retention through the full episode. Each concept needs an ear-catching title, a strong cold open, and beats structured for conversation depth.";
    var promptText="";
    if(isInt){
      promptText="Geronimo Unfiltered. Host: Doza, a straight-talking business operator.\n"+modeCtx+"\n\nDoza wants to record an INTERNAL episode (no guest) about this topic:\n"+intContext.slice(0,300)+"\n\nBelow are proven videos on related themes. Study WHY they worked and apply those PATTERNS to Doza's take. Each concept MUST reference which specific video it was pulled from using the [ID] in brackets.\n\n5 concepts. JSON only, no other text. Include source_id field with the video ID from the brackets:\n[{\"title\":\"\",\"hook\":\"\",\"why_it_works\":\"\",\"beats\":[\"\",\"\",\"\",\"\"],\"opening\":\"\",\"source\":\"\",\"source_id\":\"\"}]\n\nProven patterns:\n"+ctx+refBlock;
    }else{
      promptText="Geronimo Unfiltered. Host: Doza.\n"+modeCtx+"\n\nGuest: "+gName+" ("+gDesc+")\nBio: "+gBg.slice(0,300)+"\n\nBelow are proven videos. DO NOT copy their topics. Study WHY they worked and apply those PATTERNS to this guest's real background. Each concept MUST reference which specific video it was pulled from using the [ID] in brackets.\n\n5 concepts. JSON only, no other text. Include source_id field with the video ID from the brackets:\n[{\"title\":\"\",\"hook\":\"\",\"why_it_works\":\"\",\"beats\":[\"\",\"\",\"\",\"\"],\"opening\":\"\",\"source\":\"\",\"source_id\":\"\"}]\n\nProven patterns:\n"+ctx+refBlock;
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

  if(loadingData)return <div style={{minHeight:"100vh",background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{textAlign:"center"}}>
      <div style={{width:48,height:48,borderRadius:12,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
        <svg viewBox="0 0 100 100" width="32" height="32"><path d="M15 20 L50 5 L85 20 L85 45 L55 35 L65 50 L50 95 L15 50 Z" fill="#38FC1A"/><path d="M30 35 L50 28 L60 42 L50 55 L30 45 Z" fill="#000"/></svg>
      </div>
      <div style={{color:"#9CA3AF",fontSize:14}}>Loading episodes...</div>
    </div>
  </div>;

  if(showSplash)return <div style={{minHeight:"100vh",background:"#000",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet"/>
    <div style={{maxWidth:640,textAlign:"center"}}>
      <div style={{width:64,height:64,borderRadius:16,background:"#000",border:"1px solid #29292D",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}>
        <svg viewBox="0 0 100 100" width="42" height="42"><path d="M15 20 L50 5 L85 20 L85 45 L55 35 L65 50 L50 95 L15 50 Z" fill="#38FC1A"/><path d="M30 35 L50 28 L60 42 L50 55 L30 45 Z" fill="#000"/></svg>
      </div>
      <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:42,color:"#FFF",letterSpacing:"0.04em",marginBottom:4,lineHeight:1}}>GERONIMO UNFILTERED</h1>
      <p style={{color:"#38FC1A",fontSize:12,fontWeight:600,letterSpacing:"0.2em",marginBottom:32}}>PODCAST RESEARCH ENGINE</p>
      <p style={{color:"#DFDFDF",fontSize:16,lineHeight:1.65,marginBottom:16,fontFamily:"'DM Sans',sans-serif"}}>Find what's already working. Use it to build what's next.</p>
      <p style={{color:"#6B7280",fontSize:14,lineHeight:1.65,marginBottom:40,fontFamily:"'DM Sans',sans-serif"}}>This engine scrapes the full libraries of {CHANNELS.length} top YouTube podcast channels, scores them by performance index, and generates pre-validated episode concepts for Geronimo Unfiltered. Switch between YouTube and Podcast mode for format-specific insights and angles. Browse the library, pin proven videos, and build episode briefs backed by data.</p>
      <div style={{display:"flex",gap:16,justifyContent:"center",marginBottom:32,flexWrap:"wrap"}}>
        {[{v:CHANNELS.length,l:"Channels",c:"#38FC1A"},{v:TOPICS.length,l:"Topics",c:"#FFF"}].map(function(s){return <div key={s.l} style={{background:"#111",borderRadius:12,padding:"16px 24px",border:"1px solid #29292D",minWidth:100}}>
          <div style={{fontSize:28,fontWeight:700,color:s.c,fontFamily:"'DM Sans',sans-serif"}}>{s.v}</div>
          <div style={{fontSize:10,color:"#6B7280",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:4}}>{s.l}</div>
        </div>})}
      </div>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={function(){setShowSplash(false);setTab("library")}} style={{padding:"14px 32px",borderRadius:10,border:"none",background:"#38FC1A",color:"#000",fontSize:15,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all 0.2s"}}>Browse the Library</button>
        <button onClick={function(){setShowSplash(false);setTab("our")}} style={{padding:"14px 32px",borderRadius:10,border:"1px solid #38FC1A",background:"transparent",color:"#38FC1A",fontSize:15,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all 0.2s"}}>Our Podcast</button>
        <button onClick={function(){setShowSplash(false);setTab("builder")}} style={{padding:"14px 32px",borderRadius:10,border:"1px solid #29292D",background:"transparent",color:"#FFF",fontSize:15,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all 0.2s"}}>Build an Episode</button>
        <button onClick={function(){setShowSplash(false);setTab("guide")}} style={{padding:"14px 32px",borderRadius:10,border:"1px solid #29292D",background:"transparent",color:"#6B7280",fontSize:15,fontWeight:500,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all 0.2s"}}>How it Works</button>
      </div>
    </div>
  </div>;

  return <div style={{minHeight:"100vh",background:"#FAFAF9"}}>
    <style>{CSS}</style>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet"/>
    {showBrief&&<DozaBrief sel={sel} eps={eps} gName={gName} gDesc={gDesc} gBg={gBg} intContext={intContext} isInt={isInt} onClose={function(){setShowBrief(false)}} DATA={DATA}/>}
    {inspectVid&&<InsightModal v={inspectVid} mode={mode} onClose={function(){setInspectVid(null)}} onPin={togglePin} isPinned={pinned.some(function(p){return p.id===inspectVid.id})} onUseAsSource={useAsSource}/>}

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
        <div style={{display:"flex",gap:28,alignItems:"center"}}>
          <div style={{display:"inline-flex",background:"#111",borderRadius:8,padding:3,border:"1px solid #29292D"}}>
            {[{v:"youtube",l:"YouTube"},{v:"podcast",l:"Podcast"}].map(function(m){return <button key={m.v} onClick={function(){setMode(m.v)}} style={{padding:"6px 14px",border:"none",borderRadius:6,background:mode===m.v?"#38FC1A":"transparent",color:mode===m.v?"#000":"#6B7280",fontWeight:mode===m.v?700:500,fontSize:11,cursor:"pointer",transition:"all 0.2s",fontFamily:"'DM Sans',sans-serif"}}>{m.l}</button>})}
          </div>
          {[{l:"Episodes",v:DATA.length,c:"#38FC1A"},{l:"Channels",v:CHANNELS.length,c:"#FFF"},{l:"Pinned",v:pinned.length,c:pinned.length>0?"#38FC1A":"#444"},{l:"Saved",v:saved.length,c:"#FEF9C3"}].map(function(s){return <div key={s.l} style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:700,color:s.c}}>{s.v}</div>
            <div style={{fontSize:9,color:"#666",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"}}>{s.l}</div>
          </div>})}
        </div>
      </div>
    </div>

    <div style={{background:"#FFF",borderBottom:"1px solid #F0F0EE",position:"sticky",top:0,zIndex:50}}>
      <div style={{maxWidth:1320,margin:"0 auto",padding:"0 28px",display:"flex",gap:8}}>
        {[{id:"guide",l:"How to Use"},{id:"library",l:"Proven Ideas"},{id:"our",l:mode==="youtube"?"Our YouTube":"Our Podcast"},{id:"builder",l:"Episode Builder"+(pinned.length?" ("+pinned.length+" pinned)":"")},{id:"saved",l:"Saved ("+saved.length+")"}].map(function(t){return <button key={t.id} onClick={function(){setTab(t.id)}} style={{padding:"14px 20px",background:"none",border:"none",borderBottom:tab===t.id?"2px solid #38FC1A":"2px solid transparent",color:tab===t.id?"#111":"#9CA3AF",fontWeight:tab===t.id?600:500,fontSize:14,cursor:"pointer",transition:"all 0.2s"}}>{t.l}</button>})}
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
        <div className="card-grid">{filtered.map(function(v,i){return <VCard key={v.id} v={v} i={i} onTopicClick={function(t){setFTp(fTp===t?"all":t)}} onUseAsSource={useAsSource} onPin={togglePin} isPinned={pinned.some(function(p){return p.id===v.id})} onInspect={setInspectVid}/>})}</div>
      </>}

      {tab==="our"&&<div style={{maxWidth:1320,margin:"0 auto"}}>
        {(function(){
          var ours=DATA.filter(function(v){return v.ch==="Geronimo Unfiltered"});
          if(ours.length===0)return <div style={{textAlign:"center",padding:"60px 20px",color:"#9CA3AF"}}>
            <div style={{fontSize:40,marginBottom:12}}>&#127911;</div>
            <div style={{fontSize:15,fontWeight:600}}>No Geronimo Unfiltered data yet</div>
            <div style={{fontSize:13,marginTop:8}}>Run the scraper to pull in your episodes. Go to GitHub Actions and trigger the Weekly Podcast Scrape.</div>
          </div>;
          var sorted=[].concat(ours).sort(function(a,b){return b.views-a.views});
          var totalViews=ours.reduce(function(a,v){return a+v.views},0);
          var avgViews=Math.round(totalViews/ours.length);
          var topEp=sorted[0];
          var byTopic={};ours.forEach(function(v){(v.topics||[]).forEach(function(t){if(!byTopic[t])byTopic[t]={count:0,views:0};byTopic[t].count++;byTopic[t].views+=v.views})});
          var topTopics=Object.keys(byTopic).sort(function(a,b){return byTopic[b].views/byTopic[b].count-byTopic[a].views/byTopic[a].count});
          return <>
            <div style={{background:"#000",borderRadius:14,padding:20,marginBottom:24}}>
              <div style={{fontSize:12,color:"#38FC1A",fontWeight:700,letterSpacing:"0.08em",marginBottom:6}}>{mode==="youtube"?"YOUTUBE INSIGHTS":"PODCAST INSIGHTS"}</div>
              <p style={{fontSize:14,color:"#DFDFDF",lineHeight:1.6}}>{mode==="youtube"?"Your YouTube channel performance. Study which titles and thumbnails drove the most views. High-PI episodes signal packaging that resonated. Click into them to study the thumbnail design, title structure, and first 30 seconds.":"Your podcast performance across all episodes. High-PI episodes signal topics and angles your audience responds to. Study the framing, guest chemistry, and opening hooks on your top performers."}</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16,marginBottom:28}}>
              {[{l:"Total Episodes",v:ours.length,c:"#38FC1A"},{l:"Total Views",v:fmt(totalViews),c:"#FFF"},{l:"Avg Views",v:fmt(avgViews),c:"#38FC1A"},{l:"Top PI",v:topEp?topEp.pi.toFixed(1)+"x":"",c:"#FFF"}].map(function(s){return <div key={s.l} style={{background:"#000",borderRadius:12,padding:20,border:"1px solid #29292D"}}>
                <div style={{fontSize:28,fontWeight:700,color:s.c}}>{s.v}</div>
                <div style={{fontSize:10,color:"#6B7280",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:4}}>{s.l}</div>
              </div>})}
            </div>
            {topTopics.length>0&&<div style={{background:"#FFF",borderRadius:14,padding:24,marginBottom:24,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
              <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:12}}>{mode==="youtube"?"HIGHEST PERFORMING TOPICS (BY AVG VIEWS)":"BEST PERFORMING TOPICS"}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {topTopics.slice(0,8).map(function(t){var c=TC[t]||{bg:"#F3F4F6",t:"#374151"};return <span key={t} style={{padding:"8px 16px",borderRadius:8,background:c.bg,color:c.t,fontSize:13,fontWeight:600,textTransform:"capitalize"}}>{t.replace(/_/g," ")} ({byTopic[t].count} eps, {fmt(Math.round(byTopic[t].views/byTopic[t].count))} avg)</span>})}
              </div>
            </div>}
            <div style={{fontSize:11,color:"#9CA3AF",fontWeight:700,letterSpacing:"0.06em",marginBottom:12}}>{mode==="youtube"?"ALL EPISODES BY VIEWS — STUDY THE THUMBNAILS AND TITLES":"ALL EPISODES BY VIEWS"}</div>
            <div className="card-grid">{sorted.map(function(v,i){return <VCard key={v.id} v={v} i={i} onTopicClick={function(t){setFTp(t);setTab("library")}} onPin={togglePin} isPinned={pinned.some(function(p){return p.id===v.id})} onInspect={setInspectVid}/>})}</div>
          </>;
        })()}
      </div>}

      {tab==="builder"&&<div style={{maxWidth:720,margin:"0 auto"}}>
        <div style={{display:"inline-flex",background:"#F3F4F6",borderRadius:12,padding:4,marginBottom:28}}>
          {[{v:"guest",l:"Guest Episode"},{v:"internal",l:"Internal Team"}].map(function(o){return <button key={o.l} onClick={function(){setIsInt(o.v==="internal");setEps([]);setSel([]);setMatchPage(0)}} style={{padding:"10px 24px",border:"none",borderRadius:10,background:(o.v==="guest"&&!isInt)||(o.v==="internal"&&isInt)?"#000":"transparent",color:(o.v==="guest"&&!isInt)||(o.v==="internal"&&isInt)?"#38FC1A":"#9CA3AF",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all 0.2s"}}>{o.l}</button>})}
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
        {canGen&&eps.length===0&&<button className="gbtn" onClick={generate} disabled={loading}>{loading?"Generating 5 concepts...":mode==="youtube"?"Generate YouTube Episode Ideas":"Generate Podcast Episode Ideas"}</button>}
        {error&&<div style={{background:"#FEF2F2",borderRadius:12,padding:16,marginBottom:20,color:"#DC2626",fontSize:14,marginTop:16}}>{error}</div>}
        {eps.length>0&&<div style={{marginTop:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em"}}>SELECT CONCEPTS</div>
            {sel.length>0&&<button onClick={function(){setShowBrief(true)}} style={{padding:"10px 24px",borderRadius:10,border:"none",background:"#000",color:"#38FC1A",fontSize:13,fontWeight:600,cursor:"pointer"}}>Present to Doza ({sel.length})</button>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>{eps.map(function(ep,i){return <EpCard key={i} ep={ep} i={i} on={sel.includes(i)} toggle={function(){toggleSel(i)}} DATA={DATA} onSave={doSave} onFindClient={findClientForAngle} clientResults={clientResults[i]||null} clientLoading={clientLoading===i} onPickClient={pickClientForAngle}/>})}</div>
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
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#111",letterSpacing:"0.04em",marginBottom:4}}>HOW TO USE THIS TOOL</h2>
          <p style={{fontSize:15,color:"#6B7280",lineHeight:1.6,marginBottom:24}}>The Podcast Research Engine scrapes {CHANNELS.length} top YouTube podcast channels, scores every episode by performance index, and uses that data to generate pre-validated episode concepts. Everything is backed by what's already proven to work.</p>

          <div style={{background:"#000",borderRadius:12,padding:20,marginBottom:28}}>
            <div style={{fontSize:12,color:"#38FC1A",fontWeight:700,letterSpacing:"0.08em",marginBottom:8}}>THE ENGINE</div>
            <p style={{fontSize:14,color:"#FFF",lineHeight:1.6,marginBottom:12}}>Every week, {CHANNELS.length} channels are scraped automatically. Every video over 10 minutes from the last 2 years is pulled, and each one is scored against its channel's median views. A 5x video got 5 times the views that channel normally gets. That's a signal the topic, angle, or packaging resonated. Currently tracking {DATA.length} proven episodes.</p>
            <p style={{fontSize:14,color:"#DFDFDF",lineHeight:1.6}}>The engine doesn't copy topics. It studies WHY proven videos worked (the tension, the hook, the contrarian angle) and applies those patterns to your guest or topic. Every concept is authentic to the person or idea you're building around.</p>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#DCFCE7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#166534"}}>1</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Proven Ideas (The Library)</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>The full archive of {DATA.length} high-performing podcast episodes. Every card shows the YouTube thumbnail, episode title, channel, performance index, view count, and publish date. Filter by channel, sort by performance/views/date, or use the topic pills to narrow by theme.</p>
              </div>
            </div>
            <div style={{background:"#FAFAFA",borderRadius:10,padding:16,marginLeft:44}}>
              <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>WHAT YOU CAN DO</div>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>Click a card</strong> — opens the YouTube video. Study the thumbnail, title structure, and packaging.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>Topic pills</strong> — click any topic to filter the entire library. Click again to clear. Each pill shows the episode count.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>Pin for builder</strong> — marks a specific video as source material. Pinned videos appear at the top of the Episode Builder and are used as primary sources when generating concepts. Pin as many as you want across different channels.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7}}><strong>Use as source</strong> — jumps straight to Episode Builder with that video pre-loaded as an outlier reference.</p>
            </div>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#F3E8FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#7C3AED"}}>2</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Episode Builder (Guest)</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>For episodes with an external guest. Enter their name, expertise, and paste their full background. The engine matches the guest's background against the full library to surface relevant proven episodes, then generates 5 concepts that are authentic to who the guest is.</p>
              </div>
            </div>
            <div style={{background:"#FAFAFA",borderRadius:10,padding:16,marginLeft:44}}>
              <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>GUEST WORKFLOW</div>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>1.</strong> Enter guest name, expertise, and paste their bio/background. More detail = better angles.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>2.</strong> Optionally filter by topic to narrow matches.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>3.</strong> Review matched episodes (20 at a time). Page through with Next 20 for fresh source material.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>4.</strong> Optionally add an outlier (a video or reference the engine doesn't have).</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>5.</strong> Hit Generate. Each concept comes with a hook, why it works, 4 beats to hit, an opening line in Doza's voice, and which source video it was pulled from (with thumbnail).</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>6.</strong> Select the best concepts and Present to Doza for a formatted brief.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7}}><strong>7.</strong> Save standout concepts. They persist in the Saved tab with the full source video attached.</p>
            </div>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#E0E7FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#4338CA"}}>3</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Episode Builder (Internal Team)</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>For episodes with no guest. Type what you're thinking about discussing and the engine finds proven episodes that validate your idea. Same generation flow as guest episodes.</p>
              </div>
            </div>
            <div style={{background:"#FAFAFA",borderRadius:10,padding:16,marginLeft:44}}>
              <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>PRO TIP</div>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7}}>Click into the source YouTube videos. Study the thumbnail design and title structure. These videos outperformed their channel's median, which means the packaging worked. Replicate the pattern, not the topic.</p>
            </div>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#FEF9C3",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#A16207"}}>4</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Pinning Videos</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>Pin specific videos from the Proven Ideas library to use as primary source material. Pinned videos appear at the top of the Episode Builder in a green-bordered section. When you generate, pinned videos are prioritised as source material. This lets you say "I want to recreate this specific angle" and the engine builds concepts from those exact videos. The tab shows how many you have pinned.</p>
              </div>
            </div>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#D1FAE5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#047857"}}>5</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Saved Concepts + Export</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>Every generated concept has a "Save concept" button. Saved concepts persist across sessions and include the full brief: title, hook, why it works, beats to hit, opening line, and the original source video with its thumbnail, channel, performance index, and view count. Click the source video thumbnail to open it on YouTube.</p>
              </div>
            </div>
            <div style={{background:"#FAFAFA",borderRadius:10,padding:16,marginLeft:44}}>
              <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>EXPORTING</div>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><strong>Export as text</strong> — downloads a formatted .txt file with every saved concept, including the source video YouTube link.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7}}><strong>Export as CSV</strong> — downloads a .csv file that opens in Excel or Google Sheets. Columns for concept title, hook, why it works, beats, opening, source video title, channel, PI, views, URL, and save date.</p>
            </div>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#FFE4E6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#BE123C"}}>6</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Performance Index (PI)</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>The ratio of a video's views to its channel's median views. Normalises across channels so a breakout hit on a small channel is comparable to a big channel's average performer.</p>
              </div>
            </div>
            <div style={{background:"#FAFAFA",borderRadius:10,padding:16,marginLeft:44}}>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><span style={{color:"#38FC1A",fontWeight:700}}>1.5-3x</span> — Solid performer. Above average for that channel.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:4}}><span style={{color:"#000",fontWeight:700}}>5-10x</span> — Strong outlier. The angle or topic hit a nerve.</p>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7}}><span style={{color:"#DC2626",fontWeight:700}}>10x+</span> — Viral. Packaging, topic, and timing all aligned. Study this closely.</p>
            </div>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#38FC1A"}}>7</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Our Podcast (Insights)</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>Shows Geronimo Unfiltered's own YouTube analytics. Total episodes, total views, average views, top PI, and which topics perform best on your own channel. All your episodes are displayed sorted by views so you can see what's working for your audience. Pin your own top performers as source material too.</p>
              </div>
            </div>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#38FC1A"}}>8</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Client Guest Finder</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>After generating concepts, each one has a "Find a client for this angle" button. Click it and the engine queries your Airtable client database for active studios ranked by performance data. The top candidates appear right on the concept card. Click any client to load them as the guest with the angle pre-filled. The flow is: generate the angle first from proven data, then find the client who fits it.</p>
              </div>
            </div>
            <div style={{background:"#FAFAFA",borderRadius:10,padding:16,marginLeft:44}}>
              <div style={{fontSize:11,color:"#38FC1A",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>REQUIRES SETUP</div>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7}}>Add your <strong>AIRTABLE_API_KEY</strong> to Netlify environment variables (Site settings &gt; Environment variables). The function queries active MDS and MDS Pro studios from the Studio Directory table.</p>
            </div>
          </div>

          <div style={{borderBottom:"1px solid #F3F4F6",paddingBottom:24,marginBottom:24}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:16}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#CCFBF1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#0F766E"}}>9</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Adding Channels</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>Edit <strong>scrape.py</strong> on GitHub and add a line to the CHANNELS list: <span style={{fontFamily:"monospace",background:"#F3F4F6",padding:"2px 6px",borderRadius:4,fontSize:12}}>("@HandleName", "Display Name")</span>. Commit and run the scraper from the Actions tab.</p>
              </div>
            </div>
          </div>

          <div>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{flex:"0 0 32px",height:32,borderRadius:8,background:"#F3F4F6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#6B7280"}}>10</div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:6}}>Auto-Refresh</h3>
                <p style={{fontSize:14,color:"#6B7280",lineHeight:1.6}}>The scraper runs every Sunday at 8pm AEST via GitHub Actions. Fresh data from all {CHANNELS.length} channels is pulled, tagged, and deployed to Netlify automatically. Manual scrapes can be triggered anytime from the GitHub Actions tab.</p>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  </div>;
}
