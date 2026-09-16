export class ARCore {
  constructor({video, canvas, onResults, onStatus}) {
    this.video=video; this.canvas=canvas; this.ctx=canvas.getContext("2d");
    this.onResults=onResults; this.onStatus=onStatus;
    this.running=false; this.camera=null; this.hands=null; this.lastVideoTime=-1;
    this.fps=0; this.frameCounter=0; this.fpsStart=performance.now();
  }
  async init(){
    if(!window.Hands || !window.Camera) throw new Error("MediaPipe libraries did not load.");
    this.hands=new window.Hands({locateFile:file=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
    this.hands.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:.65,minTrackingConfidence:.62});
    this.hands.onResults(r=>this.handleResults(r));
  }
  async start(){
    if(this.running)return;
    if(!this.hands) await this.init();
    this.onStatus?.("requesting");
    this.camera=new window.Camera(this.video,{onFrame:async()=>{if(this.running) await this.hands.send({image:this.video})},width:1280,height:720});
    await this.camera.start();
    this.running=true;
    this.onStatus?.("running");
  }
  stop(){
    this.running=false;
    const stream=this.video.srcObject;
    if(stream) stream.getTracks().forEach(t=>t.stop());
    this.video.srcObject=null;
    this.onStatus?.("idle");
  }
  handleResults(results){
    if(!results.image || !this.running)return;
    const w=results.image.videoWidth||1280,h=results.image.videoHeight||720;
    if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
    const ctx=this.ctx;
    ctx.save();
    ctx.clearRect(0,0,w,h);
    // Mirror the camera into the render canvas. All effect coordinates are mirrored too.
    ctx.translate(w,0); ctx.scale(-1,1); ctx.drawImage(results.image,0,0,w,h); ctx.restore();
    const now=performance.now(); this.frameCounter++;
    if(now-this.fpsStart>=500){this.fps=Math.round(this.frameCounter*1000/(now-this.fpsStart));this.frameCounter=0;this.fpsStart=now;}
    this.onResults?.({...results, width:w,height:h,fps:this.fps,ctx});
  }
  toCanvasPoint(lm,w,h){return {x:(1-lm.x)*w,y:lm.y*h,z:lm.z||0};}
}