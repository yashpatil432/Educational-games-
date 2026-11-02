/* =====================================================================
   HEADER — shared by all Yogi-Mahi games
   (The Baby's Journey, Myth-Buster and every new game)

   THIS FILE IS THE ONLY COPY. Edit it, refresh the browser, and every
   game shows the change. Works when a game is opened by double-clicking
   it AND when it is on a website.

   HOW TO EDIT: everything between the two backticks  `  below is plain
   HTML (with its <style> and <script>). Change it exactly as you would an
   .html file. Just don't type a backtick ` or ${ inside it.

   A game loads it with this line, as the first thing after <body>:
       <script src="../shared/header.js"></script>

   What it gives you
     • Yogi-Mahi logo on the left, sound button 🔊/🔇 on the right,
       fixed to the top of every screen, no background strip.
     • Tapping the sound button opens "Audio settings":
         Voice On/Off · Sound effects On/Off · Volume · Exit game · Done
     • Exit game asks "Are you sure you want to exit?"
       (No, keep playing / Yes, exit), then shows "Thanks for playing!"
       with the logo and a Play again button.
     • Settings are remembered on the device.

   A game gives each screen top padding of
     calc(var(--safeT) + var(--headH) + 6px)  so nothing hides under it,
   and connects to the header (all optional):
     SiteHeader.init({
       storageKey: 'myGame.sound',          // where settings are remembered
       defaults: {voiceOn, effectsOn, volume},
       onChange: function(s, what){ ... },  // s = {voiceOn, effectsOn, volume}
                                            // what = 'init'|'voice'|'effects'|'volume'|'set'
       onVolumeDone: function(s){ ... },    // volume slider let go
       onTap: function(what){ ... },        // 'open'|'voice'|'effects'|'done'|'exit'|'exitNo'|'again'
       onExit: function(){ ... },           // stop voices, timers
       onPlayAgain: function(){ ... }       // back to the game's home screen
     });
     SiteHeader.get();  SiteHeader.set({voiceOn:true});
     SiteHeader.open(); SiteHeader.close(); SiteHeader.isOpen();
   ===================================================================== */
document.write(String.raw`
<style id="site-header-css">
:root{
  --safeT:env(safe-area-inset-top,0px);
  --headH:clamp(54px,8dvh,66px);
  --headGutter:clamp(10px,2vw,22px);
  --sh-ink:#38364f; --sh-muted:#77738e; --sh-line:#e8e3f2;
  --sh-primary:#6b52e0; --sh-primary-dark:#4633b4;
  --sh-green:#1f9d63; --sh-red:#c0324a;
}

/* ---------- the bar ---------- */
.site-header{position:fixed; top:0; left:0; right:0; z-index:1400;
  height:calc(var(--headH) + var(--safeT));
  padding:var(--safeT) var(--headGutter) 0;
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  pointer-events:none;}
.site-header > *{pointer-events:auto;}
.site-header__logo{display:block; height:clamp(28px,4.8dvh,40px); width:auto;
  aspect-ratio:493/109; flex:none; pointer-events:none;
  -webkit-user-select:none; user-select:none;
  filter:drop-shadow(0 2px 4px rgba(20,20,60,.14));}
.site-header__actions{display:flex; align-items:center; gap:8px; flex:none;}
.site-header__btn{width:46px; height:46px; flex:none; display:grid; place-items:center;
  padding:0; margin:0; cursor:pointer; font-size:20px; line-height:1;
  background:#fff; color:var(--sh-ink); border:2px solid var(--sh-line); border-radius:50%;
  box-shadow:0 3px 0 #e2dcf0, 0 6px 14px rgba(40,30,90,.14);
  transition:transform .12s ease, border-color .15s ease, background .15s ease;}
.site-header__btn:hover{border-color:var(--sh-primary);}
.site-header__btn:active{transform:translateY(2px);}
.site-header__btn:focus-visible{outline:3px solid var(--sh-primary); outline-offset:3px;}
.site-header__btn[aria-pressed="false"]{background:#f1eef8;}

/* ---------- Audio settings + exit windows ---------- */
.sh-overlay{position:fixed; inset:0; z-index:1350; display:flex; align-items:center; justify-content:center;
  padding:calc(var(--safeT) + var(--headH) + 6px) 14px calc(env(safe-area-inset-bottom,0px) + 14px);
  background:rgba(40,32,72,.42); -webkit-backdrop-filter:blur(3px); backdrop-filter:blur(3px);}
.sh-overlay[hidden]{display:none;}
.sh-panel{width:100%; max-width:400px; max-height:100%; overflow:auto; background:#fff;
  border-radius:24px; box-shadow:0 24px 60px rgba(40,30,80,.28);
  padding:clamp(18px,3dvh,26px) clamp(18px,3vw,26px);
  display:flex; flex-direction:column; gap:0; box-sizing:border-box;
  font-family:inherit; color:var(--sh-ink); text-align:left;}
.sh-panel h2{margin:0 0 6px; text-align:center; color:var(--sh-primary-dark);
  font-size:clamp(20px,3dvh,24px); line-height:1.2;}
.sh-note{margin:0 0 6px; text-align:center; font-weight:700; color:var(--sh-muted); font-size:15px;}
.sh-row{display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:10px 4px; border-bottom:2px solid #f1eef8; font-weight:800; font-size:16px;}
.sh-row--vol{border-bottom:0;}
.sh-row--vol input{flex:1 1 auto; min-width:0; accent-color:var(--sh-primary);}
.sh-row--vol .sh-val{min-width:44px; text-align:right; color:var(--sh-muted); font-size:14px;}
.sh-switch{min-width:76px; padding:8px 18px; border-radius:999px; cursor:pointer; font:inherit;
  font-size:15px; font-weight:800; border:2px solid var(--sh-green); background:#e3f7ec; color:#14603c;}
.sh-switch[aria-pressed="false"]{border-color:var(--sh-line); background:#f1eef8; color:var(--sh-muted);}
.sh-btn{width:100%; min-height:50px; margin-top:10px; border-radius:16px; cursor:pointer;
  font:inherit; font-size:17px; font-weight:800; border:2px solid transparent;
  background:var(--sh-primary); color:#fff; box-shadow:0 4px 0 var(--sh-primary-dark);}
.sh-btn:active{transform:translateY(2px);}
.sh-btn--ghost{background:#fff; color:var(--sh-primary-dark); border-color:var(--sh-line); box-shadow:none;}
.sh-btn--exit{background:#fff; color:var(--sh-red); border-color:#f0bfca; box-shadow:0 4px 0 #f0bfca;}
.sh-btn:focus-visible,.sh-switch:focus-visible{outline:3px solid var(--sh-primary); outline-offset:3px;}
.sh-bye-logo{display:block; width:min(220px,70%); height:auto; aspect-ratio:493/109; margin:0 auto 10px;}

@media (max-width:600px){
  :root{--headH:52px;}
  .site-header__logo{height:26px;}
  .site-header__btn{width:42px; height:42px; font-size:18px;}
}
</style>

<header class="site-header">
  <img class="site-header__logo" alt="Yogi-Mahi" src="data:image/png;base64,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">
  <div class="site-header__actions">
    <button class="site-header__btn" id="siteSound" type="button" aria-pressed="true"
            aria-haspopup="dialog" aria-label="Audio settings. Sound is on." title="Audio settings">🔊 </button>
  </div>
  </header>


<div class="sh-overlay" id="shSettings" role="dialog" aria-modal="true" aria-labelledby="shSettingsTitle" hidden>
  <div class="sh-panel">
    <h2 id="shSettingsTitle">Audio settings</h2>
    <div class="sh-row"><span>Voice</span><button class="sh-switch" id="shVoice" type="button" aria-pressed="true">On</button></div>
    <div class="sh-row"><span>Sound effects</span><button class="sh-switch" id="shFx" type="button" aria-pressed="true">On</button></div>
    <label class="sh-row sh-row--vol"><span>Volume</span>
      <input type="range" id="shVol" min="0" max="1" step="0.05" value="1" aria-label="Volume">
      <span class="sh-val" id="shVolVal">100%</span></label>
    <button class="sh-btn sh-btn--exit" id="shExit" type="button">🚪 Exit game</button>
    <button class="sh-btn sh-btn--ghost" id="shDone" type="button">Done</button>
  </div>
</div>

<div class="sh-overlay" id="shExitAsk" role="dialog" aria-modal="true" aria-labelledby="shExitTitle" hidden>
  <div class="sh-panel">
    <h2 id="shExitTitle">Are you sure you want to exit?</h2>
    <p class="sh-note">This round will not be saved.</p>
    <button class="sh-btn sh-btn--ghost" id="shExitNo" type="button">No, keep playing</button>
    <button class="sh-btn sh-btn--exit" id="shExitYes" type="button">Yes, exit</button>
  </div>
</div>

<div class="sh-overlay" id="shBye" role="dialog" aria-modal="true" aria-labelledby="shByeTitle" hidden>
  <div class="sh-panel">
    <img class="sh-bye-logo" alt="Yogi-Mahi" src="data:image/png;base64,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">
    <h2 id="shByeTitle">Thanks for playing!</h2>
    <p class="sh-note">You can close this tab now, or start again whenever you like.</p>
    <button class="sh-btn" id="shByeAgain" type="button">🔄 Play again</button>
  </div>
</div>

<script id="site-header-js">
window.SiteHeader = (function(){
  var $ = function(id){ return document.getElementById(id); };
  var btn = $('siteSound'), settings = $('shSettings'), exitAsk = $('shExitAsk'), bye = $('shBye');
  var voiceSw = $('shVoice'), fxSw = $('shFx'), vol = $('shVol'), volVal = $('shVolVal');
  var doneBtn = $('shDone'), exitBtn = $('shExit'), noBtn = $('shExitNo'), yesBtn = $('shExitYes'), againBtn = $('shByeAgain');

  var state = { voiceOn:true, effectsOn:true, volume:1 };
  var opts = { storageKey:'yogiMahi.sound', onChange:null, onVolumeDone:null, onTap:null, onExit:null, onPlayAgain:null };
  var lastFocus = null;

  function call(fn){ if(typeof fn !== 'function') return;
    try{ fn.apply(null, Array.prototype.slice.call(arguments, 1)); }catch(e){ if(window.console) console.error(e); } }
  function clampVol(v){ v = Number(v); return isNaN(v) ? 1 : Math.min(1, Math.max(0, v)); }
  function apply(v){
    if(!v) return;
    if(typeof v.voiceOn === 'boolean') state.voiceOn = v.voiceOn;
    if(typeof v.effectsOn === 'boolean') state.effectsOn = v.effectsOn;
    if(typeof v.volume === 'number') state.volume = clampVol(v.volume);
  }
  function read(){ try{ return JSON.parse(localStorage.getItem(opts.storageKey) || 'null'); }catch(e){ return null; } }
  function save(){
    try{                                   // keep any other keys the game stores alongside
      var v = read(); if(!v || typeof v !== 'object') v = {};
      v.voiceOn = state.voiceOn; v.effectsOn = state.effectsOn; v.volume = state.volume;
      localStorage.setItem(opts.storageKey, JSON.stringify(v));
    }catch(e){}
  }
  function sw(el, on){ el.setAttribute('aria-pressed', String(on)); el.textContent = on ? 'On' : 'Off'; }
  function paint(){
    var on = state.voiceOn || state.effectsOn;
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Audio settings. Sound is on.' : 'Audio settings. Sound is off.');
    btn.textContent = on ? '🔊' : '🔇';
    sw(voiceSw, state.voiceOn); sw(fxSw, state.effectsOn);
    vol.value = state.volume; volVal.textContent = Math.round(state.volume * 100) + '%';
  }
  function get(){ return { voiceOn:state.voiceOn, effectsOn:state.effectsOn, volume:state.volume }; }
  function changed(what){ paint(); save(); call(opts.onChange, get(), what); }
  function tap(what){ call(opts.onTap, what); }

  function show(el, focusEl){ el.hidden = false;
    setTimeout(function(){ try{ (focusEl || el.querySelector('button')).focus({preventScroll:true}); }catch(e){} }, 30); }
  function hide(el){ el.hidden = true; }
  function back(){ if(lastFocus && lastFocus.focus) try{ lastFocus.focus({preventScroll:true}); }catch(e){} }
  function isOpen(){ return !settings.hidden || !exitAsk.hidden || !bye.hidden; }

  function open(){ lastFocus = document.activeElement; paint(); show(settings, doneBtn); }
  function close(){ hide(settings); back(); }
  function keepPlaying(){ hide(exitAsk); back(); }

  btn.addEventListener('click', function(){ open(); tap('open'); });
  voiceSw.addEventListener('click', function(){ state.voiceOn = !state.voiceOn; changed('voice'); tap('voice'); });
  fxSw.addEventListener('click', function(){ state.effectsOn = !state.effectsOn; changed('effects'); tap('effects'); });
  vol.addEventListener('input', function(){ state.volume = clampVol(this.value); changed('volume'); });
  vol.addEventListener('change', function(){ call(opts.onVolumeDone, get()); });
  doneBtn.addEventListener('click', function(){ close(); tap('done'); });
  settings.addEventListener('click', function(e){ if(e.target === settings) close(); });
  exitBtn.addEventListener('click', function(){ tap('exit'); hide(settings); show(exitAsk, noBtn); });
  noBtn.addEventListener('click', function(){ tap('exitNo'); keepPlaying(); });
  exitAsk.addEventListener('click', function(e){ if(e.target === exitAsk){ tap('exitNo'); keepPlaying(); } });
  yesBtn.addEventListener('click', function(){
    hide(exitAsk);
    call(opts.onExit);
    try{ window.close(); }catch(e){}          // works only if a script opened the tab
    show(bye, againBtn);
  });
  againBtn.addEventListener('click', function(){ hide(bye); tap('again'); call(opts.onPlayAgain); });

  /* Escape closes the header's windows first, before the game sees it. */
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Escape') return;
    if(!exitAsk.hidden){ e.stopImmediatePropagation(); tap('exitNo'); keepPlaying(); }
    else if(!settings.hidden){ e.stopImmediatePropagation(); close(); }
    else if(!bye.hidden){ e.stopImmediatePropagation(); }
  }, true);

  paint();
  return {
    init:function(o){ o = o || {};
      for(var k in o) if(k !== 'defaults') opts[k] = o[k];
      apply(o.defaults);
      apply(read());
      paint(); call(opts.onChange, get(), 'init'); },
    get:get,
    set:function(v){ apply(v); changed('set'); },
    open:open,
    close:close,
    isOpen:isOpen
  };
})();
</script>
`);
