(()=>{
'use strict';
const D=window.VN_DATA, $=id=>document.getElementById(id);
const BASE={name:'悠人',node:'p0',line:0,mio:0,akari:0,flags:{},read:{},unlocks:{intro:true},endings:{},profiles:{mio:false,akari:false},ach:{},log:[],route:'common'};
let S=clone(BASE), typing=false, typeTimer=null, auto=false, skip=false, autoTimer=null, currentWasRead=false;
let settings={speed:24,bgm:true,bgmVol:.12,se:true,showAff:true};
let audioCtx=null,musicGain=null,musicOsc=[],musicStarted=false;
const slotKey=i=>'borderline-slot-'+i, quickKey='borderline-quick', autoKey='borderline-auto', metaKey='borderline-meta', settingsKey='borderline-settings';

function clone(x){return JSON.parse(JSON.stringify(x))}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function fmt(s){return String(s||'').replaceAll('{name}',S.name)}
function loadPersistent(){
  try{Object.assign(settings,JSON.parse(localStorage.getItem(settingsKey)||'{}'))}catch(_){}
  try{const m=JSON.parse(localStorage.getItem(metaKey)||'{}');S.read=m.read||{};S.unlocks=m.unlocks||{intro:true};S.endings=m.endings||{};S.profiles=m.profiles||{mio:false,akari:false};S.ach=m.ach||{}}catch(_){}
  applySettings();
}
function persistMeta(){localStorage.setItem(metaKey,JSON.stringify({read:S.read,unlocks:S.unlocks,endings:S.endings,profiles:S.profiles,ach:S.ach}))}
function persistSettings(){localStorage.setItem(settingsKey,JSON.stringify(settings))}
function snapshot(){return clone(S)}
function restore(s){const meta={read:S.read,unlocks:S.unlocks,endings:S.endings,profiles:S.profiles,ach:S.ach};S=Object.assign(clone(BASE),s||{});S.read=Object.assign({},meta.read,S.read||{});S.unlocks=Object.assign({},meta.unlocks,S.unlocks||{});S.endings=Object.assign({},meta.endings,S.endings||{});S.profiles=Object.assign({},meta.profiles,S.profiles||{});S.ach=Object.assign({},meta.ach,S.ach||{});S.log=S.log||[];persistMeta();renderCurrent(true)}
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),1400)}
function achievement(id){
  if(!id||S.ach[id])return;
  const a=D.achievements.find(x=>x.id===id);if(!a)return;S.ach[id]=true;persistMeta();toast('実績解除：'+a.name);se(760,.08)
}
function setBackground(k){$('bg').style.backgroundImage='url("'+D.backgrounds[k]+'")'}
function showChars(list=[]){
  for(const [id,pos] of [['charL','left'],['charC','center'],['charR','right']]){const e=$(id);e.className='char '+pos;e.removeAttribute('src')}
  for(const raw of list||[]){const [id,pos='center',exp='neutral',dim=false]=raw,c=D.characters[id];if(!c)continue;const e=$(pos==='left'?'charL':pos==='right'?'charR':'charC');e.src=c.imgs[exp]||c.imgs.neutral;e.alt=c.name;e.classList.add('show');if(dim)e.classList.add('dim')}
}
function updateAff(){
  $('mioAff').textContent=S.mio;$('akariAff').textContent=S.akari;
  $('mioMeter').style.width=Math.max(0,Math.min(100,S.mio*3.2))+'%';
  $('akariMeter').style.width=Math.max(0,Math.min(100,S.akari*3.2))+'%';
  $('affBox').style.display=settings.showAff?'grid':'none';
}
function node(){return D.nodes[S.node]}
function enterNode(){
  const n=node();if(!n)return;
  $('chapter').textContent=n.ch||'';setBackground(n.bg||'club');showChars(n.chars||[]);
  if(n.unlock){S.unlocks[n.unlock]=true;persistMeta()}
  if(n.ach)achievement(n.ach);
  saveAuto();
}
function renderCurrent(force=false){
  clearTimeout(autoTimer);clearInterval(typeTimer);typing=false;$('choices').innerHTML='';
  const n=node();if(!n){returnTitle();return}
  enterNode();updateAff();
  if(S.line>=n.lines.length){finishNode();return}
  const l=n.lines[S.line];
  if(l.profile){S.profiles[l.profile]=true;achievement(l.profile+'_profile');persistMeta()}
  if(l.chars)showChars(l.chars);
  const speaker=fmt(l.s||'');$('speaker').textContent=speaker||'Narration';
  const txt=fmt(l.t);
  const readId=S.node+':'+S.line;
  currentWasRead=!!S.read[readId];S.read[readId]=true;persistMeta();
  if(!force && settings.speed>0)typeText(txt);else{$('text').textContent=txt;typing=false;afterText()}
  if(!S.log.length||S.log[S.log.length-1].id!==readId){S.log.push({id:readId,s:speaker||'Narration',t:txt});if(S.log.length>120)S.log.shift()}
  saveAuto();
}
function typeText(txt){
  typing=true;$('text').textContent='';let i=0;const delay=Math.max(7,58-settings.speed);
  typeTimer=setInterval(()=>{i++;$('text').textContent=txt.slice(0,i);if(i>=txt.length){clearInterval(typeTimer);typing=false;afterText()}},delay)
}
function completeText(){if(!typing)return false;clearInterval(typeTimer);typing=false;$('text').textContent=fmt(node().lines[S.line].t);afterText();return true}
function afterText(){
  if(skip && currentWasRead)autoTimer=setTimeout(advance,85);
  else if(auto)autoTimer=setTimeout(advance,900+Math.min(1700,$('text').textContent.length*22));
}
function advance(){
  if($('titleScreen').hidden===false||$('modal').hidden===false)return;
  if(completeText())return;
  const n=node();if(!n||S.line>=n.lines.length)return;
  S.line++;
  if(S.line<n.lines.length)renderCurrent();else finishNode();
}
function finishNode(){
  const n=node();if(!n)return;
  if(n.choices&&n.choices.length){showChoices(n.choices);return}
  if(n.ending){showEnding(n.ending);return}
}
function showChoices(cs){
  clearTimeout(autoTimer);$('choices').innerHTML='';
  for(const c of cs){
    if(c.minMio!=null&&S.mio<c.minMio)continue;if(c.minAkari!=null&&S.akari<c.minAkari)continue;
    const b=document.createElement('button');b.className='choice';b.innerHTML=esc(c.t)+(c.hint?'<small>'+esc(c.hint)+'</small>':'');
    b.addEventListener('click',e=>{e.stopPropagation();choose(c)});$('choices').appendChild(b)
  }
}
function choose(c){
  se(520,.045);S.mio+=c.mio||0;S.akari+=c.akari||0;if(c.flag)S.flags[c.flag]=true;if(c.route)S.route=c.route;if(c.ach)achievement(c.ach);
  S.node=c.next;S.line=0;$('choices').innerHTML='';updateAff();renderCurrent()
}
function showEnding(kind){
  let key,title,desc,unlock;
  if(kind==='mio'){
    const good=S.mio>=22&&S.flags.confess;key=good?'mio_good':'mio_normal';title=good?'行間の答え':'未完成の一行';desc=good?'言葉にする勇気を選び、澪と次の物語へ進んだ。':'気持ちは残った。でも、それもまた二人の書きかけの物語。';unlock='mio_end';if(good)achievement('mio_good')
  }else if(kind==='akari'){
    const good=S.akari>=22&&S.flags.confess;key=good?'akari_good':'akari_normal';title=good?'残響の先へ':'フェードアウトのあと';desc=good?'消せない言葉を選び、朱莉と新しい音を重ね始めた。':'答えは保留。それでも編集室にはまた会う約束が残った。';unlock='akari_end';if(good)achievement('akari_good')
  }else{key='common';title='三人の放課後';desc='恋より先に、三人で続けたい場所を見つけた。';unlock='common_end';achievement('common')}
  S.endings[key]=true;S.unlocks[unlock]=true;persistMeta();
  const unique=['common','mio_good','akari_good'].filter(x=>S.endings[x]).length;if(unique>=3)achievement('collector');
  openModal('ending',{title,desc,key});
}
function newGame(){
  const meta={read:S.read,unlocks:S.unlocks,endings:S.endings,profiles:S.profiles,ach:S.ach};
  S=clone(BASE);Object.assign(S,meta);achievement('first');
  $('titleScreen').hidden=true;startMusic();renderCurrent(true)
}
function returnTitle(){$('titleScreen').hidden=false;auto=false;skip=false;syncToggles();stopMusic()}
function saveAuto(){try{localStorage.setItem(autoKey,JSON.stringify(snapshot()))}catch(_){}}
function saveSlot(i){localStorage.setItem(slotKey(i),JSON.stringify(snapshot()));toast('スロット '+i+' に保存しました');renderSlots('save')}
function loadSlot(i){try{const s=JSON.parse(localStorage.getItem(slotKey(i)));if(!s)return toast('空のスロットです');$('modal').hidden=true;$('titleScreen').hidden=true;startMusic();restore(s);toast('ロードしました')}catch(_){toast('ロードに失敗しました')}}
function quickSave(){localStorage.setItem(quickKey,JSON.stringify(snapshot()));toast('クイックセーブしました')}
function quickLoad(){try{const s=JSON.parse(localStorage.getItem(quickKey));if(!s)return toast('クイックセーブがありません');$('titleScreen').hidden=true;startMusic();restore(s);toast('クイックロードしました')}catch(_){toast('ロードに失敗しました')}}
function slotInfo(i){try{return JSON.parse(localStorage.getItem(slotKey(i)))}catch(_){return null}}
function renderSlots(mode){
  $('modalTitle').textContent=mode==='save'?'SAVE':'LOAD';let h='<div class="slots">';
  for(let i=1;i<=6;i++){const s=slotInfo(i);h+='<div class="slot"><strong>SLOT '+i+'</strong><div>'+(s?esc((D.nodes[s.node]?.ch)||s.node)+'<small>'+esc(s.name)+' / 澪 '+s.mio+' / 朱莉 '+s.akari+'</small>':'<span style="color:#777">EMPTY</span>')+'</div><div class="slotActions">'+(mode==='save'?'<button data-save="'+i+'">保存</button>':'<button data-load="'+i+'" '+(!s?'disabled':'')+'>読込</button>')+'</div></div>'}h+='</div>';$('modalBody').innerHTML=h;
  document.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>saveSlot(+b.dataset.save));document.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>loadSlot(+b.dataset.load))
}
function openModal(type,data={}){
  $('modal').hidden=false;
  if(type==='save'||type==='load'){renderSlots(type);return}
  if(type==='backlog'){$('modalTitle').textContent='BACKLOG';$('modalBody').innerHTML='<div class="backlog">'+S.log.slice().reverse().map(x=>'<div class="logEntry"><b>'+esc(x.s)+'</b><p>'+esc(x.t)+'</p></div>').join('')+'</div>';return}
  if(type==='gallery'){renderGallery();return}
  if(type==='profiles'){renderProfiles();return}
  if(type==='achievements'){renderAchievements();return}
  if(type==='settings'){renderSettings();return}
  if(type==='credits'){renderCredits();return}
  if(type==='menu'){renderMenu();return}
  if(type==='ending'){$('modalTitle').textContent='ENDING';$('modalBody').innerHTML='<div class="endingCard"><div class="rank">ENDING UNLOCKED</div><h2>'+esc(data.title)+'</h2><p>'+esc(data.desc)+'</p><button class="mini" id="endingTitle">タイトルへ</button> <button class="mini" id="endingGallery">回想を見る</button></div>';$('endingTitle').onclick=()=>{$('modal').hidden=true;returnTitle()};$('endingGallery').onclick=()=>renderGallery();return}
}
function renderGallery(){
  $('modalTitle').textContent='MEMORIES';
  $('modalBody').innerHTML='<div class="gallery">'+D.gallery.map(g=>{const ok=!!S.unlocks[g.id];return '<div class="galleryItem '+(ok?'':'locked')+'" data-memory="'+g.id+'" style="background-image:url('+D.backgrounds[g.bg]+')"><span>'+(ok?esc(g.name):'？？？')+'</span></div>'}).join('')+'</div>';
  document.querySelectorAll('.galleryItem:not(.locked)').forEach(e=>e.onclick=()=>toast(e.querySelector('span').textContent+' を解放済み'))
}
function renderProfiles(){
  $('modalTitle').textContent='PROFILE';$('modalBody').innerHTML='<div class="profiles">'+['mio','akari'].map(id=>{const c=D.characters[id],ok=S.profiles[id];return '<div class="profile">'+(ok?'<img src="'+c.imgs.smile+'" alt="">':'<div style="display:grid;place-items:center;font-size:48px">?</div>')+'<div><h3>'+(ok?esc(c.name):'？？？')+'</h3><p>'+(ok?'Age '+c.age:'未解放')+'</p><p>'+(ok?esc(c.desc):'本編で出会うとプロフィールが解放されます。')+'</p></div></div>'}).join('')+'</div>'
}
function renderAchievements(){
  $('modalTitle').textContent='ACHIEVEMENTS';$('modalBody').innerHTML='<div class="achievements">'+D.achievements.map(a=>'<div class="achievement '+(S.ach[a.id]?'':'locked')+'"><b>'+(S.ach[a.id]?'★ ':'☆ ')+esc(a.name)+'</b><small>'+esc(S.ach[a.id]?a.desc:'条件未達成')+'</small></div>').join('')+'</div>'
}
function renderSettings(){
  $('modalTitle').textContent='SETTINGS';$('modalBody').innerHTML='<div class="settings">'+
  '<div class="setting"><label>主人公名</label><input id="setName" type="text" maxlength="12" value="'+esc(S.name)+'"></div>'+
  '<div class="setting"><label>文字速度</label><input id="setSpeed" type="range" min="0" max="50" value="'+settings.speed+'"></div>'+
  '<div class="setting"><label>BGM</label><input id="setBgm" type="checkbox" '+(settings.bgm?'checked':'')+'></div>'+
  '<div class="setting"><label>BGM音量</label><input id="setVol" type="range" min="0" max="30" value="'+Math.round(settings.bgmVol*100)+'"></div>'+
  '<div class="setting"><label>選択SE</label><input id="setSe" type="checkbox" '+(settings.se?'checked':'')+'></div>'+
  '<div class="setting"><label>好感度表示</label><input id="setAff" type="checkbox" '+(settings.showAff?'checked':'')+'></div></div>';
  $('setName').onchange=e=>{S.name=e.target.value.trim()||'悠人';saveAuto()};
  $('setSpeed').oninput=e=>{settings.speed=+e.target.value;persistSettings()};
  $('setBgm').onchange=e=>{settings.bgm=e.target.checked;applySettings();persistSettings()};
  $('setVol').oninput=e=>{settings.bgmVol=+e.target.value/100;applySettings();persistSettings()};
  $('setSe').onchange=e=>{settings.se=e.target.checked;persistSettings()};
  $('setAff').onchange=e=>{settings.showAff=e.target.checked;applySettings();persistSettings()}
}
function renderCredits(){
  $('modalTitle').textContent='CREDITS';$('modalBody').innerHTML='<div class="creditList"><p><b>企画・シナリオ・実装</b><br>ChatGPT / OpenAI — このデモのためのオリジナルシナリオ</p><p><b>キャラクター素材</b><br>Linh - Free Character Sprite / FieraRyan — CC0 Public Domain<br>Amber Character Sprite Pack / FieraRyan — CC0 Public Domain</p><p><b>背景素材</b><br>School Hallway / Iletora — CC0 Public Domain<br>School Club Room / Iletora — CC0 Public Domain</p><p>素材配布元：itch.io。ゲーム内ではWeb表示用にリサイズ・WebP変換・表情合成を行っています。</p><p><a href="https://fieraryan.itch.io/linh-sprite" target="_blank" rel="noopener">Linh</a> ・ <a href="https://fieraryan.itch.io/amber-character-sprite-pack" target="_blank" rel="noopener">Amber</a> ・ <a href="https://iletora.itch.io/school-hallway" target="_blank" rel="noopener">Hallway</a> ・ <a href="https://iletora.itch.io/club-room" target="_blank" rel="noopener">Club Room</a></p></div>'
}
function renderMenu(){
  $('modalTitle').textContent='GAME MENU';$('modalBody').innerHTML='<div class="menuBtns"><button data-sub="save">SAVE</button><button data-sub="load">LOAD</button><button data-sub="backlog">BACKLOG</button><button data-sub="settings">SETTINGS</button><button id="toTitle">TITLE</button></div>';
  document.querySelectorAll('[data-sub]').forEach(b=>b.onclick=()=>openModal(b.dataset.sub));$('toTitle').onclick=()=>{$('modal').hidden=true;returnTitle()}
}
function syncToggles(){$('autoBtn').classList.toggle('active',auto);$('skipBtn').classList.toggle('active',skip)}
function applySettings(){
  $('affBox').style.display=settings.showAff?'grid':'none';
  if(musicGain)musicGain.gain.value=settings.bgm?settings.bgmVol:0
}
function startMusic(){
  if(!settings.bgm&&musicStarted)return;
  try{
    audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended')audioCtx.resume();
    if(musicStarted){applySettings();return}
    musicGain=audioCtx.createGain();musicGain.gain.value=settings.bgm?settings.bgmVol:0;musicGain.connect(audioCtx.destination);
    [130.81,196,261.63].forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=i===1?'sine':'triangle';o.frequency.value=f;g.gain.value=[.035,.022,.012][i];o.connect(g);g.connect(musicGain);o.start();musicOsc.push(o)});musicStarted=true
  }catch(_){}
}
function stopMusic(){if(musicGain)musicGain.gain.value=0}
function se(freq=500,dur=.05){
  if(!settings.se)return;try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=freq;o.type='sine';g.gain.value=.035;o.connect(g);g.connect(audioCtx.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);o.stop(audioCtx.currentTime+dur)}catch(_){}
}

$('dialogue').addEventListener('click',e=>{if(e.target.closest('button'))return;advance()});
$('newGame').onclick=newGame;
$('continueBtn').onclick=()=>{try{const s=JSON.parse(localStorage.getItem(autoKey));if(!s)return toast('続きから遊べるデータがありません');$('titleScreen').hidden=true;startMusic();restore(s)}catch(_){toast('データを読み込めませんでした')}};
$('qsave').onclick=e=>{e.stopPropagation();quickSave()};$('qload').onclick=e=>{e.stopPropagation();quickLoad()};
$('autoBtn').onclick=e=>{e.stopPropagation();auto=!auto;if(auto)skip=false;syncToggles();if(auto&&!typing)afterText()};
$('skipBtn').onclick=e=>{e.stopPropagation();skip=!skip;if(skip)auto=false;syncToggles();if(skip&&!typing)afterText()};
document.querySelectorAll('[data-open]').forEach(b=>b.onclick=e=>{e.stopPropagation();openModal(b.dataset.open)});
$('closeModal').onclick=()=>{$('modal').hidden=true};
$('modal').addEventListener('click',e=>{if(e.target===$('modal'))$('modal').hidden=true});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!$('modal').hidden){$('modal').hidden=true;return}
  if($('titleScreen').hidden===false||$('modal').hidden===false)return;
  if(e.code==='Space'||e.code==='Enter'){e.preventDefault();advance()}
  if(e.key.toLowerCase()==='s'&&e.ctrlKey){e.preventDefault();quickSave()}
});
loadPersistent();setBackground('hall');showChars([]);updateAff();syncToggles();
})();
