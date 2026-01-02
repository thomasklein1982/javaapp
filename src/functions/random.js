export function random(min, max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

export class RandomClazz{
  seed=0
  constructor(seed){
    this.setSeed(seed);
  }
  setSeed(s){
    this.seed=s;
  }
  randomSeeded(){
    this.seed++;
    let z=Math.sin(this.seed)*100;
    return z-Math.floor(z);
  }
  mixArray(a,inplace){
    let o=this.order(0,a.length-1);
    let b=[];
    for(let i=0;i<a.length;i++){
      b.push(a[o[i]]);
    }
    return b;
  }
  order(min,max){
    /*erstellt ein Array mit den Zahlen von min bis max in zufaelliger Reihenfolge:*/
    let a=[];
    for(let i=min;i<=max;i++){
      a.push(i);
    }
    let b=[];
    for(let i=min;i<=max;i++){
      let c=a.splice(this.int(0,a.length-1),1);
      b.push(c[0]);
    }
    return b;
  }
  drawFrom(array,k){
    let indices=this.draw(k,array.length);
    let b=[];
    for(let i=0;i<indices.length;i++){
      b.push(array[indices[i]-1]);
    }
    return b;
  }
  draw(k,n){
    /*gibt ein Array mit k verschiedenen Zahlen aus 1 bis n zurueck*/
    let a=[];
    for(let i=1;i<=n;i++){
      a.push(i);
    }
    let b=[];
    for(let i=1;i<=k;i++){
      let c=a.splice(this.int(0,a.length-1),1);
      b.push(c[0]);
    }
    return b;
  }
  string(fromCodePoint,toCodePoint, length){
    if(length===undefined) length=1;
    let from=fromCodePoint.codePointAt(0);
    let to=toCodePoint.codePointAt(0);
    let s="";
    for(let i=0;i<length;i++){
      let x=this.int(from,to);
      s+=String.fromCodePoint(x);
    }
    return s;
  }
  int(min,max){
    let x=this.randomSeeded();
    return Math.floor(x*(max-min+1))+min;
  }
}

export const Random=new RandomClazz(0);