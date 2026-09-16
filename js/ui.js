export class UI {
  constructor(){this.$=s=>document.querySelector(s);this.toastTimer=null;}
  scrollTo(sel){this.$(sel)?.scrollIntoView({behavior:"smooth",block:"start"});}
  toast(msg){const el=this.$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>el.classList.remove("show"),2400);}
  setTracking(state,text){const badge=this.$(".tracking-badge"),dot=this.$("#trackingDot");this.$("#trackingText").textContent=text;badge.classList.toggle("active",state==="tracked");dot.style.background=state==="error"?"#ff5d91":"";}
  setGesture(name){const pretty={waiting:"Waiting for hand",open:"Open hand · Blooming",spread:"Spread fingers · Growing",closed:"Closed hand · Bud mode",neutral:"Move your hand",pinch:"Pinch · Interaction"};this.$("#gestureChip").textContent=pretty[name]||name;this.$("#gestureValue").textContent=name==="waiting"?"—":name;}
  setStats(hands,fps){this.$("#handCount").textContent=hands;this.$("#fpsValue").textContent=fps||"—";this.$("#fpsBadge").textContent=`${fps||"--"} FPS`;}
  cameraEmpty(show){this.$("#emptyState").style.display=show?"grid":"none";}
  showCapture(data){this.$("#captureImage").src=data;this.$("#downloadCapture").href=data;this.$("#captureModal").hidden=false;}
  closeCapture(){this.$("#captureModal").hidden=true;}
  initInteractions(app){
    document.querySelectorAll("[data-scroll]").forEach(b=>b.addEventListener("click",()=>this.scrollTo(b.dataset.scroll)));
    this.$("#startBtn").addEventListener("click",()=>app.toggleCamera());
    this.$("#resetBtn").addEventListener("click",()=>{app.reset();this.toast("Bloom reset ✦")});
    this.$("#fullscreenBtn").addEventListener("click",()=>app.fullscreen());
    this.$("#captureBtn").addEventListener("click",()=>app.capture());
    this.$("#closeCapture").addEventListener("click",()=>this.closeCapture());
    this.$("#closeCapture2").addEventListener("click",()=>this.closeCapture());
    this.$(".capture-backdrop").addEventListener("click",()=>this.closeCapture());
    const ni=this.$("#nameInput"),ci=this.$("#commentInput");ni.addEventListener("input",()=>this.$("#nameCount").textContent=`${ni.value.length}/24`);ci.addEventListener("input",()=>this.$("#commentCountInput").textContent=`${ci.value.length}/240`);
    this.$("#commentForm").addEventListener("submit",e=>{e.preventDefault();app.addComment(ni.value.trim(),ci.value.trim());ni.value="";ci.value="";this.$("#nameCount").textContent="0/24";this.$("#commentCountInput").textContent="0/240";});
  }
}