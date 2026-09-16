import {ARCore} from "./ar-core.js";
import {GestureEngine} from "./gesture-engine.js";
import {EffectManager} from "./effect-manager.js";
import {BloomEffect} from "./effects/bloom-effect.js";
import {UI} from "./ui.js";

class BloomARApp {
  constructor(){
    this.video=document.querySelector("#video");this.canvas=document.querySelector("#arCanvas");
    this.ui=new UI();this.gesture=new GestureEngine();this.effects=new EffectManager();
    this.ar=new ARCore({video:this.video,canvas:this.canvas,onResults:r=>this.onFrame(r),onStatus:s=>this.onStatus(s)});
    this.last=performance.now();this.running=false;
    this.commentsKey="bloom-ar-comments-v1";
    this.apiBase="/api";
    this.comments=[];
    this.ui.initInteractions(this);this.effects.register("bloom",new BloomEffect());
    this.renderComments();this.ui.cameraEmpty(true);
    this.loadComments();
  }
  async boot(){try{await this.effects.use("bloom",{});}catch(e){console.error(e);this.ui.toast("Could not initialize the Bloom effect.");}}
  async toggleCamera(){if(this.running){this.ar.stop();this.running=false;this.ui.$("#startBtn").innerHTML="Start experience <span>→</span>";return;}try{await this.ar.start();this.running=true;this.ui.$("#startBtn").innerHTML="Stop experience <span>■</span>";this.ui.cameraEmpty(false);}catch(e){console.error(e);this.ui.setTracking("error","Camera unavailable");this.ui.toast("Camera access was blocked. Allow camera permission and try again.");}}
  onStatus(s){if(s==="requesting")this.ui.setTracking("","Requesting camera…");if(s==="running")this.ui.setTracking("","Camera running");if(s==="idle")this.ui.setTracking("","Camera idle");}
  onFrame(r){
    const now=performance.now(),dt=Math.min(.05,(now-this.last)/1000);this.last=now;
    const hands=r.multiHandLandmarks||[];
    const g=this.gesture.update(hands);
    this.ui.setStats(hands.length,r.fps);this.ui.setGesture(g.name);
    this.ui.setTracking(hands.length?"tracked":"",hands.length?`${hands.length} hand${hands.length>1?"s":""} tracked`:"Camera running · show your hand");
    this.effects.update({hands,gesture:g,dt,width:r.width,height:r.height,ctx:r.ctx});this.effects.gesture(g,{hands});this.effects.render({ctx:r.ctx,hands,gesture:g});
  }
  reset(){this.effects.reset();}
  fullscreen(){const el=document.querySelector("#cameraStage");if(!document.fullscreenElement)el.requestFullscreen?.();else document.exitFullscreen?.();}
  capture(){
    if(!this.running){this.ui.toast("Start the AR experience first.");return;}
    try{this.ui.showCapture(this.canvas.toDataURL("image/png"));}catch(e){this.ui.toast("Capture is not available in this browser.");}
  }
  getComments(){return this.comments||[]}
  async loadComments(){
    try{
      const res=await fetch(`${this.apiBase}/comments`);
      if(!res.ok)throw new Error(`Comments request failed: ${res.status}`);
      this.comments=await res.json();
      this.renderComments();
    }catch(e){console.warn("Community API unavailable",e);}
  }
  async addComment(name,text){
    if(!name||!text)return;
    try{
      const res=await fetch(`${this.apiBase}/comments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,text})});
      if(!res.ok)throw new Error(`Comment request failed: ${res.status}`);
      const comment=await res.json();
      this.comments=[comment,...this.comments];
      this.renderComments();
      this.ui.toast("Your note is live ✦");
    }catch(e){console.error(e);this.ui.toast("Could not post your note. Try again.");}
  }
  async likeComment(id,button){
    try{
      const res=await fetch(`${this.apiBase}/comments/${encodeURIComponent(id)}/like`,{method:"POST"});
      if(!res.ok)throw new Error(`Like request failed: ${res.status}`);
      const updated=await res.json();
      const item=this.comments.find(c=>c.id===id);
      if(item)item.likes=updated.likes;
      this.renderComments();
    }catch(e){
      console.error(e);
      button?.classList.add("liked");
    }
  }
  renderComments(){
    const defaults=[
      {id:"d1",name:"Mira",text:"The bloom animation is so satisfying.",time:Date.now()-1000*60*4,likes:12},
      {id:"d2",name:"Arjun",text:"Need a galaxy filter next!",time:Date.now()-1000*60*27,likes:8},
      {id:"d3",name:"Nova",text:"Can't believe this runs in the browser.",time:Date.now()-1000*60*81,likes:5}
    ];
    const own=this.getComments(),items=[...defaults,...own],feed=document.querySelector("#commentFeed");
    feed.innerHTML=items.map(c=>{const time=c.time||Date.parse(c.createdAt)||Date.now();return `<article class="comment" data-id="${this.escape(c.id)}"><div class="comment-top"><b>${this.escape(c.name)}</b><span>${this.relative(time)}</span></div><p>${this.escape(c.text)}</p><div class="comment-bottom"><button class="like-btn" data-like="${this.escape(c.id)}">♡ ${c.likes||0}</button></div></article>`}).join("");
    document.querySelector("#commentCount").textContent=items.length;
    feed.querySelectorAll("[data-like]").forEach(b=>b.addEventListener("click",()=>{const id=b.dataset.like;if(String(id).startsWith("d")){b.classList.add("liked");b.textContent=`♥ ${(parseInt(b.textContent.replace(/\D/g,""))||0)+1}`;}else this.likeComment(id,b);}));
  }
  relative(t){const s=Math.max(1,Math.floor((Date.now()-t)/1000));if(s<60)return"Just now";if(s<3600)return`${Math.floor(s/60)}m ago`;if(s<86400)return`${Math.floor(s/3600)}h ago`;return`${Math.floor(s/86400)}d ago`}
  escape(v){return v.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
}
const app=new BloomARApp();app.boot();window.BloomAR=app;