
(() => {
'use strict';
const $=id=>document.getElementById(id),c=$('gameCanvas'),g=c.getContext('2d');
const W=420,H=720,PY=575,LANES=[92,210,328],DURATION=65;
const scenes=[['FLORESTA DA RESENHA','#220b39','#a72f82'],['PONTE DA UNIÃO','#171a47','#7351b6'],['TRILHA DA CORAGEM','#31132e','#dc6d97'],['PORTÕES DO MARANATA','#50144a','#ffb36e']];
const quiz=[
 {q:'Segundo João 13:34, o que Jesus ensinou?',a:['Amar uns aos outros','Ser o maior de todos','Abandonar quem errou'],correct:0,ref:'JOÃO 13:34',why:'Jesus ensinou o amor entre as pessoas.'},
 {q:'O que a expressão “Maranata” nos lembra?',a:['Que venceremos qualquer jogo','“Vem, Senhor!”','Que ninguém pode errar'],correct:1,ref:'1 CORÍNTIOS 16:22',why:'Maranata expressa a esperança na vinda do Senhor.'},
 {q:'Segundo Salmos 133:1, o que é bom?',a:['Viver em união','Humilhar quem perdeu','Ganhar mais curtidas'],correct:0,ref:'SALMOS 133:1',why:'É bom que os irmãos vivam em união.'}
];
const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
let mode='ready',lane=1,laneX=LANES[1],elapsed=0,spawnTimer=.6,life=3,score=0,combo=0,shield=false,immune=0;
let objs=[],particles=[],qindex=0,answered=false,animation=0,last=0,best=0,sfx=true,ac=null,toaster=0,gesture=null;
// V2: power-up de pontuação, colecionáveis especiais e missões de uma partida.
let feverCharge=0,feverTime=0,totalStars=0,totalSixSeven=0,maxCombo=0,quizCorrect=0,fxTexts=[];
let missionClaimed={stars:false,combo:false,quiz:false};
const FEVER_GOAL=10,FEVER_SECONDS=7;

try{best=Math.max(0,Number(localStorage.getItem('auraRunBest2026'))||0)}catch{}
$('bestScore').textContent=best;
function stage(){return elapsed<20?0:elapsed<41?1:elapsed<56?2:3}
function resize(){const dpr=Math.min(2,devicePixelRatio||1);c.width=Math.max(1,Math.round(c.clientWidth*dpr));c.height=Math.max(1,Math.round(c.clientHeight*dpr));g.setTransform(c.width/W,0,0,c.height/H,0,0)}
window.addEventListener('resize',resize,{passive:true});if('ResizeObserver'in window)new ResizeObserver(resize).observe(c);resize();
function note(hz=550,d=.08){if(!sfx)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ac||=new AC();if(ac.state==='suspended')ac.resume().catch(()=>{});const o=ac.createOscillator(),v=ac.createGain();o.type='triangle';o.frequency.value=hz;v.gain.setValueAtTime(.035,ac.currentTime);v.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.connect(v).connect(ac.destination);o.start();o.stop(ac.currentTime+d+.01)}catch{}}
function vibrate(n=15){if(!reduced&&navigator.vibrate)navigator.vibrate(n)}
function notify(t){const el=$('gameToast');el.textContent=t;el.classList.add('show');clearTimeout(toaster);toaster=setTimeout(()=>el.classList.remove('show'),1700)}
function hud(){
 $('score').textContent=score.toLocaleString('pt-BR');
 $('timer').textContent=Math.max(0,Math.ceil(DURATION-elapsed));
 $('hearts').textContent=('♥ '.repeat(life)+'♡ '.repeat(3-life)).trim();
 $('zoneName').textContent=scenes[stage()][0];
 $('comboText').textContent=feverTime>0?'⚡ AURA ×3':shield?'🛡 ESCUDO ATIVO':'COMBO ×'+Math.max(1,1+Math.floor(combo/4));
 const active=feverTime>0;
 $('game').classList.toggle('fever-on',active);
 $('feverText').textContent=active?'⚡ AURA SUPREMA ATIVA!':'✦ CARREGANDO AURA';
 $('feverCount').textContent=active?feverTime.toFixed(1)+'s':feverCharge+'/'+FEVER_GOAL;
 $('feverFill').style.width=(active?100*feverTime/FEVER_SECONDS:100*feverCharge/FEVER_GOAL)+'%';
}
function missions(){
 const values=[
  ['missionStars',totalStars,12,'✦','ESTRELAS','stars'],
  ['missionStreak',maxCombo,6,'🔥','COMBO','combo'],
  ['missionQuiz',quizCorrect,2,'✝️','RESPOSTAS','quiz']
 ];
 for(const [id,value,goal,icon,label,key] of values){
   const done=value>=goal;
   $(id).textContent=icon+' '+Math.min(value,goal)+'/'+goal+' '+label+(done?' ✓':'');
   $(id).classList.toggle('done',done);
   if(done&&!missionClaimed[key]){
     missionClaimed[key]=true;score+=100;notice('🏅 MISSÃO '+label+'! +100 AURA');note(1050,.14);
     popText(laneX,PY-120,'MISSÃO +100','#ffe7a8');
   }
 }
}
function popText(x,y,text,color='#ffe5ad'){
 if(reduced)return;
 if(fxTexts.length>14)fxTexts.shift();
 fxTexts.push({x,y,text,color,time:.72});
}
function activateFever(){
 feverCharge=0;feverTime=FEVER_SECONDS;
 const burstFx=$('feverAnnounce');
 burstFx.classList.remove('show');
 void burstFx.offsetWidth;
 burstFx.classList.add('show');
 burst(laneX,PY,'#fff2c1',24);
 notice('⚡ AURA SUPREMA! ESTRELAS ×3');
 note(920,.18);vibrate(40);
}
function hidePanels(){for(const id of ['startOverlay','quizOverlay','pauseOverlay','endOverlay'])$(id).hidden=true}
function reset(){
 mode='running';lane=1;laneX=LANES[1];elapsed=0;spawnTimer=.55;life=3;score=0;combo=0;shield=false;immune=0;
 feverCharge=0;feverTime=0;totalStars=0;totalSixSeven=0;maxCombo=0;quizCorrect=0;fxTexts=[];
 missionClaimed={stars:false,combo:false,quiz:false};
 $('feverAnnounce').classList.remove('show');
 objs=[];particles=[];qindex=0;answered=false;animation=0;hidePanels();
 $('pauseButton').disabled=false;$('pauseButton').textContent='Ⅱ';$('pauseButton').setAttribute('aria-label','Pausar o jogo');
 hud();missions();note(730);vibrate(20)
}
$('startButton').addEventListener('click',reset);
$('playAgain').addEventListener('click',reset);
function pause(){if(mode!=='running')return;mode='paused';$('pauseOverlay').hidden=false;$('pauseButton').textContent='▶'}
function resume(){if(mode!=='paused')return;mode='running';$('pauseOverlay').hidden=true;$('pauseButton').textContent='Ⅱ';last=performance.now()}
$('pauseButton').addEventListener('click',()=>mode==='running'?pause():resume());
$('resumeButton').addEventListener('click',resume);
$('exitButton').addEventListener('click',reset);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
function move(d){if(mode!=='running')return;const next=Math.max(0,Math.min(2,lane+d));if(next!==lane){lane=next;note(320+lane*110,.04);vibrate(10)}}
$('leftButton').addEventListener('click',()=>move(-1));
$('rightButton').addEventListener('click',()=>move(1));
document.addEventListener('keydown',e=>{
 if(mode==='quiz')return;
 const k=e.key.toLowerCase();
 if(k==='arrowleft'||k==='a'){if(mode==='running'){e.preventDefault();move(-1)}}
 else if(k==='arrowright'||k==='d'){if(mode==='running'){e.preventDefault();move(1)}}
 else if(k==='p'||e.code==='Space'){if(mode==='running'||mode==='paused'){e.preventDefault();mode==='running'?pause():resume()}}
});
c.addEventListener('pointerdown',e=>{if(mode==='running')gesture={x:e.clientX,y:e.clientY}});
c.addEventListener('pointerup',e=>{
 if(!gesture||mode!=='running'){gesture=null;return}
 const dx=e.clientX-gesture.x;
 if(Math.abs(dx)>25)move(dx>0?1:-1);
 else{const pos=(e.clientX-c.getBoundingClientRect().left)/c.clientWidth;if(pos<.38)move(-1);if(pos>.62)move(1)}
 gesture=null;
});
c.addEventListener('pointercancel',()=>{gesture=null});
function setAudioButton(){$('soundButton').textContent=sfx?'♫':'♪';$('soundButton').setAttribute('aria-pressed',String(sfx));$('soundButton').setAttribute('aria-label',sfx?'Silenciar som':'Ativar som')}
$('soundButton').addEventListener('click',()=>{sfx=!sfx;setAudioButton();note(800)});
setAudioButton();
function showQuiz(){
 mode='quiz';answered=false;
 const q=quiz[qindex],container=$('quizChoices');
 $('quizProgress').textContent='📖 DESAFIO BÍBLICO '+(qindex+1)+'/3';
 $('quizQuestion').textContent=q.q;$('quizReference').textContent=q.ref;
 $('quizFeedback').textContent='Escolha uma alternativa.';container.replaceChildren();$('quizNext').hidden=true;
 q.a.forEach((a,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String.fromCharCode(65+i)+' — '+a;b.addEventListener('click',()=>answer(i));container.appendChild(b)});
 $('quizOverlay').hidden=false;container.firstElementChild?.focus();note(800,.13)
}
function answer(i){
 if(answered||mode!=='quiz')return;answered=true;const q=quiz[qindex],correct=i===q.correct;
 [...$('quizChoices').children].forEach((b,j)=>{b.disabled=true;if(j===q.correct)b.classList.add('correct');else if(j===i)b.classList.add('wrong')});
 if(correct){score+=75;quizCorrect++;note(1100,.19);$('quizFeedback').textContent='✅ +75 aura! '+q.why;missions()}
 else{$('quizFeedback').textContent='💗 Tudo bem! '+q.why;note(310,.16)}
 hud();$('quizNext').hidden=false;$('quizNext').focus()
}
$('quizNext').addEventListener('click',()=>{
 if(mode!=='quiz'||!answered)return;
 qindex++;$('quizOverlay').hidden=true;mode='running';last=performance.now()
});
function record(){if(score>best){best=score;$('bestScore').textContent=best.toLocaleString('pt-BR');try{localStorage.setItem('auraRunBest2026',String(best))}catch{}}}
function finish(won){
 if(mode==='ended')return;mode='ended';$('pauseButton').disabled=true;record();
 $('endIcon').textContent=won?'🏆':'💗';$('endTag').textContent=won?'MARANATA ALCANÇADO':'NOVA CHANCE';
 $('endTitle').textContent=won?'PANTERA LENDÁRIA!':'A RESENHA CONTINUA!';
 $('finalScore').textContent=score.toLocaleString('pt-BR');
 const awards=$('endMissions');
 awards.replaceChildren();
 const list=[
  ['✦ '+totalStars+' ESTRELAS',true],
  ['🔥 COMBO '+maxCombo,maxCombo>=6],
  ['6️⃣7️⃣ '+totalSixSeven+' SIX SEVEN',totalSixSeven>0],
  ['✝️ '+quizCorrect+'/3 ACERTOS',quizCorrect>=2]
 ];
 for(const [label,earned] of list){
   const chip=document.createElement('span');chip.textContent=label;
   if(earned)chip.classList.add('earned');
   awards.appendChild(chip);
 }
 $('endMessage').textContent=won?'Você chegou ao Maranata! O mais importante é caminhar em amizade e fé.':'Sua corrida terminou, mas a brincadeira continua! Vamos tentar mais uma?';
 $('endOverlay').hidden=false;note(won?1150:300,.23)
}
$('shareButton').addEventListener('click',async()=>{
 const link=new URL('./',location.href).href;
 const msg='🐆💗 Farmei '+score.toLocaleString('pt-BR')+' pontos no AURA RUN dos Zé Manés! Você supera? Maranata 2026 • Cristo em primeiro lugar! '+link;
 try{if(navigator.share){await navigator.share({title:'AURA RUN — Os Zé Manés',text:msg});return}}catch(e){if(e.name==='AbortError')return}
 try{await navigator.clipboard.writeText(msg);notify('DESAFIO COPIADO!')}catch{window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer')}
});

/* Gera um pôster de aura em PNG local: nenhuma pontuação ou imagem é enviada a servidores. */
$('saveCardButton').addEventListener('click',async()=>{
 const button=$('saveCardButton');button.disabled=true;button.textContent='⌛ GERANDO CARD...';
 try{
  const pic=document.createElement('canvas');pic.width=1080;pic.height=1350;
  const p=pic.getContext('2d');if(!p)throw Error('Canvas não suportado');
  const bg=p.createLinearGradient(0,0,1080,1350);
  bg.addColorStop(0,'#170a35');bg.addColorStop(.55,'#a21972');bg.addColorStop(1,'#1b081f');
  p.fillStyle=bg;p.fillRect(0,0,1080,1350);
  const art=await new Promise(resolve=>{
   const image=new Image();image.decoding='async';
   image.onload=()=>resolve(image);image.onerror=()=>resolve(null);
   image.src='../assets/pantera-original.webp';
   if(image.complete&&image.naturalWidth)resolve(image);
  });
  if(art){
    const ratio=Math.max(1080/art.naturalWidth,1050/art.naturalHeight);
    const w=art.naturalWidth*ratio,h=art.naturalHeight*ratio;
    p.drawImage(art,(1080-w)/2,(1050-h)/2,w,h);
  }
  const veil=p.createLinearGradient(0,200,0,1350);
  veil.addColorStop(0,'#12001608');veil.addColorStop(.52,'#1200163c');veil.addColorStop(.79,'#18051be9');veil.addColorStop(1,'#08040eea');
  p.fillStyle=veil;p.fillRect(0,0,1080,1350);
  p.textAlign='center';p.textBaseline='middle';
  p.shadowColor='#e80c94';p.shadowBlur=20;
  p.fillStyle='#ffe6f6';p.font='1000 43px system-ui,sans-serif';
  p.fillText('✦ MARANATA 2026 • GRUPO ROSA ✦',540,94);
  p.shadowBlur=0;
  p.font='1000 110px system-ui,sans-serif';p.fillStyle='#fff';p.fillText('AURA RUN',540,976);
  p.font='900 47px system-ui,sans-serif';p.fillStyle='#ffafd9';p.fillText('OS ZÉ MANÉS',540,1052);
  p.font='1000 106px system-ui,sans-serif';p.fillStyle='#fff2c1';p.fillText(score.toLocaleString('pt-BR'),540,1171);
  p.font='900 30px system-ui,sans-serif';p.fillStyle='#ffe9f5';p.fillText('PONTOS DE AURA • COMBO '+maxCombo,540,1232);
  p.font='700 24px system-ui,sans-serif';p.fillStyle='#fff2ca';p.fillText('A RESENHA É NOSSA. A GLÓRIA É DE DEUS!',540,1305);
  const blob=await new Promise((resolve,reject)=>pic.toBlob(b=>b?resolve(b):reject(Error('Falha no PNG')),'image/png'));
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='aura-run-ze-manes-'+score+'.png';a.hidden=true;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),9000);
  notify('🐆 CARD SALVO! MANDE NO GRUPO');
 }catch(e){notify('NÃO FOI POSSÍVEL GERAR O CARD');}
 finally{button.disabled=false;button.textContent='🖼️ SALVAR CARD DE AURA';}
});

function rand(a,b){return a+Math.random()*(b-a)}
function spawn(){
 const lanes=[0,1,2].sort(()=>Math.random()-.5),count=Math.random()<.34?2:1;
 for(let i=0;i<count;i++){const p=Math.random(),type=p<.37?'rock':p>.988?'shield':p>.93?'sixseven':'aura';objs.push({type,lane:lanes[i],y:-40-i*18,used:false})}
}
function burst(x,y,color,n=10){if(reduced)return;for(let i=0;i<n;i++){const a=rand(0,Math.PI*2),s=rand(45,145);particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:rand(.2,.55),color})}}
function hit(item){
 item.used=true;const x=LANES[item.lane];
 if(item.type==='aura'){
  const multiplier=Math.min(4,1+Math.floor(combo/4))*(feverTime>0?3:1);
  const plus=10*multiplier;
  score+=plus;combo++;totalStars++;maxCombo=Math.max(maxCombo,combo);
  burst(x,PY,feverTime>0?'#ffedbd':'#ff9ada',feverTime>0?18:10);
  popText(x,PY-65,'+'+plus,feverTime>0?'#fff1b3':'#ffe0f5');
  note(590+Math.min(11,combo)*31);
  if(feverTime<=0){
    feverCharge=Math.min(FEVER_GOAL,feverCharge+1);
    if(feverCharge>=FEVER_GOAL)activateFever();
  }
  missions();
 }
 else if(item.type==='sixseven'){
  const plus=feverTime>0?201:67;score+=plus;totalSixSeven++;combo++;maxCombo=Math.max(maxCombo,combo);
  burst(x,PY,'#ffe8b0',24);popText(x,PY-82,'SIX SEVEN +'+plus,'#ffe4a6');
  note(830,.12);vibrate(35);notify('🐆 SIX SEVEN! +'+plus+' AURA');
  missions();
 }
 else if(item.type==='shield'){shield=true;score+=20;burst(x,PY,'#9defff');notify('🛡 ESCUDO COLETADO!');note(960,.15)}
 else if(shield){shield=false;burst(x,PY,'#a0f5ff');notify('🛡 ESCUDO PROTEGEU!');note(450,.13)}
 else if(immune<=0){life--;combo=0;immune=1.2;burst(x,PY,'#ff5c97');notify('💗 DESVIE DOS OBSTÁCULOS!');note(180,.23);vibrate(65);if(life<=0)finish(false)}
 hud()
}
function update(dt){
 if(mode!=='running')return;
 elapsed+=dt;animation+=dt;immune=Math.max(0,immune-dt);feverTime=Math.max(0,feverTime-dt);
 laneX+=(LANES[lane]-laneX)*Math.min(1,dt*18);
 spawnTimer-=dt;
 if(spawnTimer<=0){spawn();spawnTimer=Math.max(.52,.89-elapsed*.004)*rand(.86,1.18)}
 const speed=248+elapsed*2.1;
 for(const item of objs){
  item.y+=speed*dt;
  const magnet=feverTime>0&&item.type!=='rock'&&Math.abs(item.lane-lane)<=1;
  if(!item.used&&(item.lane===lane||magnet)&&Math.abs(item.y-PY)<(magnet?42:30)){
    hit(item);
    if(mode!=='running')break;
  }
}
 objs=objs.filter(o=>!o.used&&o.y<H+50);
 for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=100*dt;p.t-=dt}
 particles=particles.filter(p=>p.t>0);
 for(const t of fxTexts){t.y-=42*dt;t.time-=dt}
 fxTexts=fxTexts.filter(t=>t.time>0);
 hud();
 if(mode!=='running')return;
 if(qindex<3&&elapsed>=[20,41,56][qindex]){showQuiz();return}
 if(elapsed>=DURATION)finish(true)
}
function rounded(x,y,w,h,r,color){g.fillStyle=color;g.beginPath();g.roundRect(x,y,w,h,r);g.fill()}
function sparkle(x,y,r,color,rot=0){g.save();g.translate(x,y);g.rotate(rot);g.fillStyle=color;g.beginPath();g.moveTo(0,-r);g.quadraticCurveTo(r*.12,-r*.12,r,0);g.quadraticCurveTo(r*.12,r*.12,0,r);g.quadraticCurveTo(-r*.12,r*.12,-r,0);g.quadraticCurveTo(-r*.12,-r*.12,0,-r);g.fill();g.restore()}
function background(){
 const st=stage(),scene=scenes[st],grad=g.createLinearGradient(0,0,0,H);
 grad.addColorStop(0,scene[1]);grad.addColorStop(.55,scene[2]);grad.addColorStop(1,'#170b24');g.fillStyle=grad;g.fillRect(0,0,W,H);
 g.fillStyle='#ffedda25';g.beginPath();g.arc(337,165,105,0,Math.PI*2);g.fill();
 for(let i=0;i<29;i++){const x=(i*73+14)%W,y=(i*131+animation*(i%3+1)*12)%H;sparkle(x,y,i%5?2:4,'#ffe1f565')}
 g.fillStyle='#250c30b9';g.beginPath();g.moveTo(0,310);
 for(let x=0;x<=W+42;x+=42)g.lineTo(x,265+36*Math.sin(x*.024+st));
 g.lineTo(W,H);g.lineTo(0,H);g.fill();
 if(feverTime>0&&!reduced){
   g.save();g.strokeStyle='#ffecbe6a';g.lineWidth=2;
   for(let i=0;i<16;i++){
      const x=(i*97)%W;
      const y=((i*169+animation*420)%(H+130))-65;
      g.beginPath();g.moveTo(x,y);g.lineTo(x-13,y+75);g.stroke();
   }
   g.restore();
 }
 if(st===3){g.strokeStyle='#ffeeb49c';g.lineWidth=9;g.beginPath();g.moveTo(337,183);g.lineTo(337,261);g.moveTo(313,208);g.lineTo(361,208);g.stroke()}
 const road=g.createLinearGradient(0,0,W,0);road.addColorStop(0,'#21132fe9');road.addColorStop(.5,'#36163eea');road.addColorStop(1,'#21132fe9');
 g.fillStyle=road;g.beginPath();g.moveTo(70,0);g.lineTo(350,0);g.lineTo(415,H);g.lineTo(5,H);g.closePath();g.fill();
 g.strokeStyle='#ff93d353';g.lineWidth=3;g.beginPath();g.moveTo(70,0);g.lineTo(5,H);g.moveTo(350,0);g.lineTo(415,H);g.stroke();
 g.strokeStyle='#ffbbdc5c';g.lineWidth=2;g.setLineDash([26,35]);g.lineDashOffset=-animation*150;
 for(const x of [140,280]){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke()}g.setLineDash([]);
 for(let i=0;i<10;i++){const y=(i*97+animation*110)%(H+50)-50;g.strokeStyle='#ff83c61d';g.lineWidth=2;g.beginPath();g.moveTo(30,y);g.lineTo(390,y);g.stroke();
 g.fillStyle=i%2?'#9b3890':'#642572';for(const x of [19,401]){g.beginPath();g.ellipse(x,y,8+i%3,14,0,0,Math.PI*2);g.fill()}}
}
function rock(x,y){
 g.save();g.translate(x,y);g.shadowColor='#000';g.shadowBlur=12;g.fillStyle='#6d4c78';g.strokeStyle='#c8a9d2';g.lineWidth=3;
 g.beginPath();g.moveTo(-27,15);g.lineTo(-17,-18);g.lineTo(5,-27);g.lineTo(29,-5);g.lineTo(24,23);g.closePath();g.fill();g.stroke();
 g.fillStyle='#9f7dac';g.beginPath();g.moveTo(-14,-12);g.lineTo(2,-20);g.lineTo(7,-4);g.lineTo(-17,0);g.fill();g.restore()
}
function gem(x,y,t){
 g.save();g.translate(x,y);const p=reduced?1:1+Math.sin(t*8)*.08;g.scale(p,p);
 const rad=g.createRadialGradient(0,0,4,0,0,38);rad.addColorStop(0,'#fff6e8');rad.addColorStop(.4,'#fd60cdbb');rad.addColorStop(1,'#ff37aa00');
 g.fillStyle=rad;g.beginPath();g.arc(0,0,38,0,Math.PI*2);g.fill();sparkle(0,0,22,'#ffe8fa',Math.PI/4);sparkle(0,0,13,'#ff48bd',Math.PI/4);g.restore()
}
function drawSixSeven(x,y,t){
 g.save();g.translate(x,y);
 if(!reduced)g.rotate(Math.sin(t*5)*.08);
 const glow=g.createRadialGradient(0,0,5,0,0,46);
 glow.addColorStop(0,'#fff7d1');glow.addColorStop(.5,'#ff66ce99');glow.addColorStop(1,'#ff47ba00');
 g.fillStyle=glow;g.beginPath();g.arc(0,0,48,0,Math.PI*2);g.fill();
 g.fillStyle='#500e58';g.strokeStyle='#fff3c0';g.lineWidth=4;
 g.beginPath();g.roundRect(-29,-28,58,55,15);g.fill();g.stroke();
 g.fillStyle='#fff8d7';g.textAlign='center';g.font='1000 27px system-ui';
 g.fillText('67',0,10);sparkle(-26,-28,9,'#fff1b8',t*.8);sparkle(29,24,7,'#ffb5ee');
 g.restore();
}
function shieldArt(x,y){g.save();g.translate(x,y);g.shadowColor='#a6efff';g.shadowBlur=19;g.fillStyle='#3fbfd9';g.strokeStyle='#f5ffff';g.lineWidth=3;g.beginPath();g.moveTo(0,-25);g.lineTo(20,-17);g.lineTo(16,10);g.quadraticCurveTo(0,28,0,28);g.quadraticCurveTo(-18,15,-18,10);g.lineTo(-20,-17);g.closePath();g.fill();g.stroke();sparkle(0,0,10,'#fff');g.restore()}
function cat(t){
 const bob=mode==='running'&&!reduced?Math.sin(t*17)*3:0;
 g.save();g.translate(laneX,PY+bob);
 if(immune>0&&Math.floor(immune*12)%2===0)g.globalAlpha=.5;
 g.fillStyle='#07010b65';g.beginPath();g.ellipse(0,37,40,10,0,0,Math.PI*2);g.fill();
 if(feverTime>0){
 g.save();
 const halo=g.createRadialGradient(0,0,12,0,0,80);
 halo.addColorStop(0,'#fffdc25c');halo.addColorStop(.55,'#ff5db472');halo.addColorStop(1,'#ff2f9700');
 g.fillStyle=halo;g.beginPath();g.arc(0,0,80,0,Math.PI*2);g.fill();
 g.strokeStyle='#fff4c3';g.lineWidth=3;
 g.beginPath();g.arc(0,0,50+Math.sin(t*13)*4,0,Math.PI*2);g.stroke();
 g.restore();
 }
 if(shield){g.strokeStyle='#91f4ffba';g.lineWidth=5;g.shadowColor='#a6efff';g.shadowBlur=24;g.beginPath();g.arc(0,0,54,0,Math.PI*2);g.stroke();g.shadowBlur=0}
 // tail, paws, shirt, arms
 g.strokeStyle='#a81278';g.lineWidth=15;g.lineCap='round';g.beginPath();g.moveTo(21,24);g.bezierCurveTo(66,25,65,-10,40,-12);g.stroke();g.strokeStyle='#fb67bf';g.lineWidth=10;g.stroke();
 rounded(-28,25,23,18,8,'#fd65ba');rounded(6,25,23,18,8,'#fd65ba');
 g.fillStyle='#100917';g.strokeStyle='#e351af';g.lineWidth=3;g.beginPath();g.ellipse(0,9,34,36,0,0,Math.PI*2);g.fill();g.stroke();
 g.font='1000 16px system-ui';g.textAlign='center';g.fillStyle='#fff';g.fillText('AURA',0,16);
 g.strokeStyle='#ec4da9';g.lineWidth=14;g.beginPath();g.moveTo(-25,0);g.lineTo(-40,21);g.moveTo(25,0);g.lineTo(40,21);g.stroke();
 for(const x of [-40,40]){g.fillStyle='#ff8dd0';g.beginPath();g.arc(x,21,10,0,Math.PI*2);g.fill()}
 // head and ears
 g.fillStyle='#fc68bc';g.strokeStyle='#9a1265';g.lineWidth=3;g.beginPath();g.moveTo(-33,-36);g.lineTo(-42,-75);g.lineTo(-8,-56);g.lineTo(8,-56);g.lineTo(42,-75);g.lineTo(33,-36);g.closePath();g.fill();g.stroke();
 g.fillStyle='#ffd0e9';g.beginPath();g.moveTo(-31,-54);g.lineTo(-36,-65);g.lineTo(-20,-56);g.moveTo(31,-54);g.lineTo(36,-65);g.lineTo(20,-56);g.fill();
 g.fillStyle='#ff74c4';g.beginPath();g.ellipse(0,-37,40,34,0,0,Math.PI*2);g.fill();
 g.fillStyle='#fff0ec';g.beginPath();g.ellipse(0,-21,23,13,0,0,Math.PI*2);g.fill();
 g.fillStyle='#d31f86';g.beginPath();g.moveTo(-8,-30);g.lineTo(9,-30);g.lineTo(0,-21);g.fill();
 g.strokeStyle='#a42870';g.lineWidth=2;g.beginPath();g.arc(0,-19,9,0,Math.PI);g.stroke();
 g.fillStyle='#090512';g.strokeStyle='#301036';g.lineWidth=4;g.beginPath();g.roundRect(-35,-51,32,20,6);g.roundRect(3,-51,32,20,6);g.fill();g.stroke();
 g.beginPath();g.moveTo(-3,-43);g.lineTo(4,-43);g.stroke();g.strokeStyle='#ffdbf0';g.lineWidth=2;
 g.beginPath();g.moveTo(-25,-45);g.lineTo(-12,-48);g.moveTo(14,-45);g.lineTo(26,-48);g.stroke();g.restore()
}
function draw(){
 g.setTransform(c.width/W,0,0,c.height/H,0,0);
 background();
 for(const item of objs){if(item.used)continue;const x=LANES[item.lane];if(item.type==='rock')rock(x,item.y);else if(item.type==='shield')shieldArt(x,item.y);else if(item.type==='sixseven')drawSixSeven(x,item.y,animation);else gem(x,item.y,animation)}
 cat(animation);
 for(const p of particles){g.globalAlpha=Math.max(0,Math.min(1,p.t/.4));g.fillStyle=p.color;g.beginPath();g.arc(p.x,p.y,3.5,0,Math.PI*2);g.fill()}
 g.globalAlpha=1;
 for(const t of fxTexts){
   g.save();g.globalAlpha=Math.min(1,t.time*2);
   g.textAlign='center';g.font='1000 19px system-ui';g.lineWidth=4;g.strokeStyle='#1c0726';g.fillStyle=t.color;
   g.strokeText(t.text,t.x,t.y);g.fillText(t.text,t.x,t.y);g.restore();
 }
}
function frame(stamp){const dt=last?Math.min(.05,Math.max(0,(stamp-last)/1000)):0;last=stamp;if(!document.hidden){if(mode==='running')update(dt);else if(mode==='ready'&&!reduced)animation+=dt*.3;draw()}requestAnimationFrame(frame)}
hud();missions();requestAnimationFrame(frame);
})();
