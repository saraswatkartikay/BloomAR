export class GestureEngine {
  constructor(){this.prevCenter=null;this.current={name:"waiting",open:false,spread:0,pinch:false,velocity:0};}
  update(hands){
    if(!hands?.length){this.current={name:"waiting",open:false,spread:0,pinch:false,velocity:0};return this.current;}
    const lm=hands[0];
    const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
    const palm=dist(lm[0],lm[9])||.1;
    const tips=[8,12,16,20], pips=[6,10,14,18];
    let extended=0;
    for(let i=0;i<4;i++) if(dist(lm[tips[i]],lm[0])>dist(lm[pips[i]],lm[0])*1.06) extended++;
    const spread=(dist(lm[8],lm[20])+dist(lm[12],lm[16]))/(palm*3.2);
    const pinch=dist(lm[4],lm[8])/palm<.48;
    const cx=(lm[0].x+lm[5].x+lm[9].x+lm[13].x+lm[17].x)/5, cy=(lm[0].y+lm[5].y+lm[9].y+lm[13].y+lm[17].y)/5;
    let velocity=0;
    if(this.prevCenter) velocity=Math.hypot(cx-this.prevCenter.x,cy-this.prevCenter.y)/palm;
    this.prevCenter={x:cx,y:cy};
    const open=extended>=3;
    let name=open?(spread>.85?"spread":"open"):(extended<=1?"closed":"neutral");
    if(pinch && !open) name="pinch";
    this.current={name,open,spread,pinch,velocity,extended,palm};
    return this.current;
  }
}