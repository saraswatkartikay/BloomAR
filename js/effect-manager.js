export class EffectManager {
  constructor(){this.effects=new Map();this.active=null;}
  register(id,effect){this.effects.set(id,effect);return this;}
  async use(id,context){if(this.active){this.active.destroy?.()}const next=this.effects.get(id);if(!next)throw new Error(`Unknown effect: ${id}`);this.active=next;await next.initialize?.(context);}
  update(context){this.active?.update?.(context)}
  render(context){this.active?.render?.(context)}
  gesture(g,context){this.active?.onGesture?.(g,context)}
  reset(){this.active?.reset?.()}
}