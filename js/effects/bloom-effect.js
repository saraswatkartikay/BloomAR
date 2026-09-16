const TAU=Math.PI*2;
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>1-Math.pow(1-t,3);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

class Flower {
  constructor(anchorIndex, seed){
    this.anchorIndex=anchorIndex; this.seed=seed; this.x=0;this.y=0;this.tx=0;this.ty=0;
    this.progress=0;this.bloom=0;this.life=0;this.branch=0;this.phase=Math.random()*TAU;this.scale=.85+Math.random()*.35;
    this.particles=[];this.born=false;
  }
  reset(){this.progress=0;this.bloom=0;this.life=0;this.born=false;this.particles=[];}
  update(anchor,g,dt){
    if(!anchor)return;
    this.tx=anchor.x;this.ty=anchor.y;
    const follow=1-Math.pow(.0008,dt);
    this.x=lerp(this.x||this.tx,this.tx,follow);this.y=lerp(this.y||this.ty,this.ty,follow);
    const targetProgress=g.name==="closed"?0.35:1;
    const targetBloom=g.name==="closed"?0.05:1;
    this.progress=lerp(this.progress,targetProgress,1-Math.pow(.008,dt));
    this.bloom=lerp(this.bloom,targetBloom,1-Math.pow(.004,dt));
    this.life=Math.min(1,this.life+dt*.65);
    if(this.bloom>.82&&!this.born){this.born=true;this.spawnBurst();}
    for(const p of this.particles){p.vy+=18*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.a-=dt*.7;}
    this.particles=this.particles.filter(p=>p.a>0);
  }
  spawnBurst(){for(let i=0;i<8;i++){const a=Math.random()*TAU,s=18+Math.random()*30;this.particles.push({x:this.x,y:this.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,a:1,r:1+Math.random()*2})}}
  drawStem(ctx,base){
    const t=ease(clamp(this.progress,0,1)),dx=this.x-base.x,dy=this.y-base.y;
    const len=Math.hypot(dx,dy),nx=-dy/(len||1),ny=dx/(len||1),curve=Math.sin(this.seed*8)*Math.min(45,len*.22);
    const ex=lerp(base.x,this.x,t),ey=lerp(base.y,this.y,t),cx=(base.x+ex)/2+nx*curve,cy=(base.y+ey)/2+ny*curve;
    ctx.save();ctx.lineCap="round";ctx.lineWidth=Math.max(2,base.size||4);ctx.strokeStyle="rgba(72,225,153,.88)";ctx.shadowBlur=9;ctx.shadowColor="rgba(52,236,160,.5)";
    ctx.beginPath();ctx.moveTo(base.x,base.y);ctx.quadraticCurveTo(cx,cy,ex,ey);ctx.stroke();ctx.restore();
    this.drawLeaf(ctx,lerp(base.x,ex,.55),lerp(base.y,ey,.55),curve*.018);
  }
  drawLeaf(ctx,x,y,rot){
    ctx.save();ctx.translate(x,y);ctx.rotate(rot+.8);
    ctx.fillStyle="rgba(67,196,126,.9)";ctx.shadowBlur=8;ctx.shadowColor="rgba(50,220,145,.4)";
    ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(12,-9,24,-7,29,0);ctx.bezierCurveTo(20,8,9,9,0,0);ctx.fill();ctx.restore();
  }
  drawFlower(ctx){
    const b=ease(clamp(this.bloom,0,1)),s=(12+10*b)*this.scale, pulse=1+Math.sin(this.phase+performance.now()*.0012)*.025;
    ctx.save();ctx.translate(this.x,this.y);ctx.scale(pulse,pulse);ctx.globalAlpha=clamp(this.life*2,0,1);
    ctx.shadowBlur=18+18*b;ctx.shadowColor="rgba(255,64,126,.65)";
    for(let layer=0;layer<2;layer++){
      const petals=6,rad=s*(1+layer*.12),petalW=s*(.72+layer*.05);
      ctx.fillStyle=layer===0?"rgba(255,58,119,.95)":"rgba(255,111,151,.92)";
      for(let i=0;i<petals;i++){const a=i*TAU/petals+layer*.15;ctx.save();ctx.rotate(a);ctx.beginPath();ctx.ellipse(0,-rad*b,petalW*.52,petalW*.85*b+.5,0,0,TAU);ctx.fill();ctx.restore();}
    }
    ctx.shadowBlur=8;ctx.fillStyle="#ffd85e";ctx.beginPath();ctx.arc(0,0,s*.26*b+.8,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(255,245,180,.8)";ctx.beginPath();ctx.arc(-s*.07,-s*.08,s*.07,0,TAU);ctx.fill();
    ctx.restore();
    for(const p of this.particles){ctx.save();ctx.globalAlpha=p.a;ctx.fillStyle="#ffd5e4";ctx.shadowBlur=10;ctx.shadowColor="#ff7ca5";ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,TAU);ctx.fill();ctx.restore();}
  }
}

export class BloomEffect {
  constructor(){this.flowers=[];this.time=0;this.ctx=null;this.lastHands=[];this.ready=false;this.base={};}
  async initialize(){this.reset();this.ready=true;}
  reset(){this.flowers=[];for(let i=0;i<4;i++)this.flowers.push(new Flower([8,12,16,20][i],Math.random()));}
  update({hands,gesture,dt,width,height}){this.ctx=arguments[0].ctx;this.time+=dt;this.lastHands=hands||[];
    if(!hands?.length)return;
    const lm=hands[0],baseLm=lm[0];
    const base={x:(1-baseLm.x)*width,y:baseLm.y*height,size:Math.max(3,width*.004)};
    this.base=base;
    const indices=[8,12,16,20];
    for(let i=0;i<this.flowers.length;i++){
      const tip=lm[indices[i]];const anchor={x:(1-tip.x)*width,y:tip.y*height};
      // Offset the base downward toward the palm to create an organic stem rather than a fingertip line.
      const dx=anchor.x-base.x,dy=anchor.y-base.y,len=Math.hypot(dx,dy)||1;
      const bx=anchor.x-dx*.18,by=anchor.y-dy*.18;
      this.flowers[i].update(anchor,gesture,dt);
      this.flowers[i].drawBase={x:bx,y:by,size:base.size};
    }
  }
  render({ctx}){
    if(!ctx)return;
    for(const f of this.flowers){if(f.drawBase)f.drawStem(ctx,f.drawBase);}
    for(const f of this.flowers)f.drawFlower(ctx);
    // Subtle hand aura, intentionally local to the palm.
    if(this.lastHands[0]){
      const lm=this.lastHands[0][9],w=ctx.canvas.width,h=ctx.canvas.height,x=(1-lm.x)*w,y=lm.y*h;
      const g=ctx.createRadialGradient(x,y,0,x,y,Math.min(w,h)*.12);g.addColorStop(0,"rgba(255,86,145,.12)");g.addColorStop(1,"rgba(255,86,145,0)");
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,Math.min(w,h)*.12,0,TAU);ctx.fill();
    }
  }
  onGesture(g){this.lastGesture=g;}
  destroy(){this.flowers=[];}
}