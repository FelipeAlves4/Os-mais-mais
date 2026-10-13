/* OS ZÉ MANÉS • MARANATA V3 • sem dependências */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const motionSafe=typeof window.matchMedia!=='function'||!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const timeline=$('scrollProgress');
if(timeline){
  let scheduled=false;
  function updateProgress(){
    const height=document.documentElement.scrollHeight-window.innerHeight;
    const pct=height>0?Math.min(1,Math.max(0,window.scrollY/height)):0;
    timeline.style.transform='scaleX('+pct+')';
    scheduled=false;
  }
  document.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress)}},{passive:true});
  window.addEventListener('resize',updateProgress,{passive:true});updateProgress();
}

/* Revelação cinematográfica: ocorre sob solicitação do visitante ou após 1000 pontos locais. */
const portal=$('auraPortal'), launch=$('awakeningButton'), exit=$('portalClose'), exitAlt=$('portalExit');
let restoreFocus=null;
function showPortal(){
  if(!portal||!portal.hidden)return;
  restoreFocus=document.activeElement;
  portal.hidden=false;
  document.body.classList.add('portal-open');
  exit?.focus();
}
function hidePortal(){
  if(!portal||portal.hidden)return;
  portal.hidden=true;
  document.body.classList.remove('portal-open');
  if(restoreFocus&&typeof restoreFocus.focus==='function')restoreFocus.focus();
}
launch?.addEventListener('click',showPortal);
exit?.addEventListener('click',hidePortal);
exitAlt?.addEventListener('click',hidePortal);
portal?.addEventListener('click',event=>{if(event.target===portal)hidePortal();});
document.addEventListener('keydown',event=>{
  if(!portal||portal.hidden)return;
  if(event.key==='Escape'){event.preventDefault();hidePortal();}
  if(event.key==='Tab'){
    const items=[...portal.querySelectorAll('button:not(:disabled),a[href]')].filter(el=>el.getClientRects().length>0);
    if(!items.length)return;
    const first=items[0],last=items[items.length-1];
    if(event.shiftKey&&document.activeElement===first){last.focus();event.preventDefault();}
    else if(!event.shiftKey&&document.activeElement===last){first.focus();event.preventDefault();}
  }
});
const auraCounter=$('score');
if(auraCounter&&typeof MutationObserver!=='undefined'){
  let prev=Number((auraCounter.textContent||'').replace(/\D/g,''))||0;
  const observer=new MutationObserver(()=>{
    const count=Number((auraCounter.textContent||'').replace(/\D/g,''))||0;
    if(count>=1000&&prev<1000&&portal?.hidden){
      // A pessoa terminou uma conquista explicitamente iniciada no minigame.
      showPortal();
    }
    prev=count;
  });
  observer.observe(auraCounter,{subtree:true,childList:true,characterData:true});
}

/* Arena: quiz bíblico do pré-campa, sem afirmar promessas de vitória em competições. */
const quiz=[
  {question:'Davi enfrentou Golias confiando principalmente em quem?',options:['Na armadura de Saul','No Senhor','Na fama que ganharia'],correct:1,verse:'1 Samuel 17:45–47',explain:'Davi afirmou que a batalha pertencia ao Senhor.'},
  {question:'O que a expressão “Maranata” nos lembra?',options:['“Vem, Senhor!”','Que nunca perderemos jogos','Que somos melhores que os outros'],correct:0,verse:'1 Coríntios 16:22',explain:'A expressão aramaica remete à esperança na vinda de Cristo.'},
  {question:'Qual mandamento Jesus deu aos discípulos?',options:['Competir para ser o maior','Amar uns aos outros','Ignorar os que erram'],correct:1,verse:'João 13:34',explain:'Jesus ensinou o amor como marca dos seus seguidores.'},
  {question:'Qual atitude combina com a união dos irmãos?',options:['Ajudar e incentivar a equipe','Humilhar quem perder','Desistir de quem errou'],correct:0,verse:'Salmos 133:1',explain:'A comunhão é motivo de alegria e cuidado mútuo.'}
];
const panel=$('arenaPanel'),qCounter=$('arenaRound'),qProgress=$('arenaFill'),qTitle=$('arenaQuestion'),qOptions=$('arenaOptions'),qResponse=$('arenaFeedback'),qNext=$('arenaNext'),qFinish=$('arenaFinish');
let round=0, hits=0, chosen=false;
function showRound(){
  if(!panel||!qTitle||!qOptions)return;
  if(round>=quiz.length){showFinish();return;}
  const item=quiz[round];
  chosen=false;qCounter.textContent='RODADA '+(round+1)+' / '+quiz.length;
  qProgress.style.width=((round+1)/quiz.length*100)+'%';
  qTitle.textContent=item.question;
  qOptions.replaceChildren();
  item.options.forEach((option,index)=>{
    const button=document.createElement('button');
    button.type='button';button.className='arena-option';
    button.textContent=String.fromCharCode(65+index)+' — '+option;
    button.addEventListener('click',()=>chooseAnswer(index));
    qOptions.appendChild(button);
  });
  qResponse.textContent='';
  qNext.hidden=true;
}
function chooseAnswer(index){
  if(chosen||round>=quiz.length)return;chosen=true;
  const item=quiz[round],correct=index===item.correct;
  if(correct)hits++;
  [...qOptions.children].forEach((button,i)=>{
    button.disabled=true;
    if(i===item.correct)button.classList.add('is-right');
    else if(i===index)button.classList.add('is-wrong');
  });
  qResponse.textContent=(correct?'✅ Acertou! ':'💗 Quase lá! ')+item.explain+' ('+item.verse+')';
  qNext.hidden=false;qNext.textContent=round===quiz.length-1?'VER RESULTADO ✦':'PRÓXIMA RODADA →';
}
function showFinish(){
  const score=$('arenaResult'),headline=$('arenaResultTitle');
  if(qFinish){qFinish.hidden=false;}
  const play=$('arenaPlaying');if(play)play.hidden=true;
  if(score)score.textContent='Você acertou '+hits+' de '+quiz.length+' perguntas.';
  if(headline)headline.textContent=hits===4?'GABARITOU, LENDA!':hits>=2?'A TROPA TÁ FORTE!':'CONTINUE NA PALAVRA!';
  qCounter.textContent='ARENA CONCLUÍDA';qProgress.style.width='100%';
}
qNext?.addEventListener('click',()=>{round++;showRound();});
$('arenaRestart')?.addEventListener('click',()=>{
  round=0;hits=0;
  if(qFinish)qFinish.hidden=true;
  $('arenaPlaying').hidden=false;showRound();
});
$('arenaShare')?.addEventListener('click',async()=>{
  const msg='🐆✝️ Fiz '+hits+'/'+quiz.length+' na Arena Bíblica dos Zé Manés! Nossa resenha é grande, Cristo é maior. '+location.origin+location.pathname+'#arena';
  if(navigator.share){try{await navigator.share({title:'Arena Bíblica dos Zé Manés',text:msg});return;}catch(e){if(e.name==='AbortError')return;}}
  try{await navigator.clipboard.writeText(msg);displayNotice('Resultado copiado para compartilhar!');}
  catch{window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer');}
});
showRound();
function displayNotice(message){
  const note=$('v3Notice');
  if(!note)return;
  note.textContent=message;note.hidden=false;
  window.setTimeout(()=>{note.hidden=true;},3800);
}

/* Cartão: nome fica só no dispositivo. Exportação PNG + compartilhamento nativo quando houver. */
const nickname=$('auraNickname'),nicknamePreview=$('auraNicknamePreview'),download=$('downloadAuraCard'),shareCard=$('shareAuraCard');
const cleanName=value=>(value||'').replace(/[\r\n\t<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,22);
nickname?.addEventListener('input',()=>{
  if(nicknamePreview)nicknamePreview.textContent=(cleanName(nickname.value)||'VOCÊ').toLocaleUpperCase('pt-BR');
});
async function makeCard(){
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  if(!ctx)throw Error('Canvas indisponível');
  canvas.width=1080;canvas.height=1350;
  const gradient=ctx.createLinearGradient(0,0,1080,1350);
  gradient.addColorStop(0,'#2a092d');gradient.addColorStop(.58,'#9c1666');gradient.addColorStop(1,'#100519');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,1080,1350);
  try{
    const image=new Image();image.decoding='async';image.src='assets/pantera-original.webp';
    await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;if(image.complete&&image.naturalWidth)resolve();});
    const ratio=Math.max(1080/image.naturalWidth,1350/image.naturalHeight);
    const dw=image.naturalWidth*ratio,dh=image.naturalHeight*ratio;
    ctx.drawImage(image,(1080-dw)/2,(1350-dh)/2,dw,dh);
  }catch{
    // Fallback sem download externo: permanece o gradiente original.
  }
  const overlay=ctx.createLinearGradient(0,330,0,1350);
  overlay.addColorStop(0,'rgba(9,0,12,0)');
  overlay.addColorStop(.62,'rgba(16,0,18,.35)');
  overlay.addColorStop(1,'rgba(12,0,14,.98)');
  ctx.fillStyle=overlay;ctx.fillRect(0,0,1080,1350);
  ctx.textAlign='center';
  ctx.shadowColor='#f622a4';ctx.shadowBlur=17;
  ctx.fillStyle='#ffe5f5';ctx.font='900 34px system-ui, sans-serif';
  ctx.fillText('✦ MARANATA 2026 • GRUPO ROSA ✦',540,94);
  ctx.shadowBlur=0;
  const name=(cleanName(nickname?.value)||'VOCÊ').toLocaleUpperCase('pt-BR');
  let fontSize=name.length>14?64:name.length>10?78:102;
  ctx.font='1000 '+fontSize+'px system-ui, sans-serif';ctx.textAlign='center';ctx.fillStyle='#ffffff';
  while(ctx.measureText(name).width>1000&&fontSize>38){fontSize-=4;ctx.font='1000 '+fontSize+'px system-ui, sans-serif';}
  ctx.shadowColor='#130015';ctx.shadowBlur=16;
  ctx.fillText(name,540,1110);
  ctx.shadowBlur=0;
  ctx.font='900 51px system-ui, sans-serif';ctx.fillStyle='#ff7bcc';ctx.fillText('TROPA DOS ZÉ MANÉS',540,1190);
  ctx.font='700 33px system-ui, sans-serif';ctx.fillStyle='#fff1cf';
  ctx.fillText('A RESENHA É NOSSA. A GLÓRIA É DE DEUS!',540,1260);
  return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Não foi possível gerar a imagem')),'image/png'));
}
async function createAndShare(share){
  const btn=share?shareCard:download;
  if(btn){btn.disabled=true;btn.setAttribute('aria-busy','true');}
  try{
    const blob=await makeCard(), filename='ze-manes-maranata-2026.png';
    const file=new File([blob],filename,{type:'image/png'});
    if(share&&navigator.share&&navigator.canShare?.({files:[file]})){
      try{await navigator.share({files:[file],title:'Os Zé Manés — Maranata 2026',text:'🐆✝️ Resenha no máximo, Cristo em primeiro lugar!'});return;}
      catch(e){if(e.name==='AbortError')return;}
    }
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=filename;a.hidden=true;document.body.append(a);a.click();a.remove();
    window.setTimeout(()=>URL.revokeObjectURL(url),5000);
    displayNotice(share?'Imagem salva! Envie no WhatsApp.':'Seu card foi baixado!');
  }catch(e){displayNotice('Não foi possível gerar o card neste navegador. Tente novamente.');}
  finally{if(btn){btn.disabled=false;btn.removeAttribute('aria-busy');}}
}
download?.addEventListener('click',()=>createAndShare(false));
shareCard?.addEventListener('click',()=>createAndShare(true));
})();
