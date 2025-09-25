async function getJSON(p){const r=await fetch(p,{cache:'no-store'});if(!r.ok)throw new Error(p+':'+r.status);return r.json()}
function chip(label,pass){const s=document.createElement('span');s.className='chip '+(pass?'pass':'fail');s.textContent=label;return s}
function byDateDesc(a,b){return (a.date>b.date?-1:1)}
(async ()=>{
  const manifest=await getJSON('data/manifest.json'); // {logs:[{path,date,plant}]}
  manifest.logs.sort(byDateDesc);
  const list=document.getElementById('loglist');
  manifest.logs.forEach(x=>{
    const li=document.createElement('li');
    const a=document.createElement('a');a.href=x.path;a.textContent=`${x.date} — ${x.plant}`;
    li.appendChild(a);list.appendChild(li);
  });
  if(manifest.logs.length){
    const latestPath=manifest.logs[0].path;
    const p=await getJSON(latestPath);
    const t=document.getElementById('latest');
    const ok=(v,[lo,hi])=>v>=lo&&v<=hi;
    const c=document.createElement('div');
    c.append(
      chip(`PPFDavg ${p.derived.ppfd_avg}`, p.derived.ppfd_avg>=800),
      chip(`VPD ${p.derived.vpd_leaf_kpa}`, ok(p.derived.vpd_leaf_kpa,[1.0,1.3])),
      chip(`Uniformity ${p.derived.uniformity}`, p.derived.uniformity>=0.85),
      chip(`CV ${p.derived.cv_pct}%`, p.derived.cv_pct<=15)
    );
    t.innerHTML=`<h2>Latest — ${p.date} • ${p.plant_id}</h2>`;
    t.appendChild(c);
    const pre=document.createElement('pre');pre.textContent=JSON.stringify(p,null,2);t.appendChild(pre);
    const note=document.createElement('div');note.className='small';
    note.textContent='Gate chips are illustrative; tune thresholds in app.js as needed.';
    t.appendChild(note);
  }
})().catch(e=>{document.getElementById('latest').textContent='Load error: '+e.message});
