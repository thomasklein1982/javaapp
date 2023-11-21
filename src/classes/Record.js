export class Record{

  constructor(){
    this.$data=[];
  }
  add(value){
    this.$data.push(value);
  }
  set(index,value){
    if(value===undefined || value===null || value==="null" || value.length===0){
      this.$data[index]=undefined;
    }else{
      this.$data[index]=value;
    }
  }
  get(index){
    return this.$data[index];
  }
  toCSVString(attributes,sep){
    var s="";
    for(var i=0;i<this.$data.length;i++){
      var d=this.get(i);
      if(d===undefined){
        /*nichts eintragen, feld bleibt leer*/
      }else{
        var a=attributes[i];
        if(a.type===Database.Number){
          d=(d+"").replace(".",",");
        }else if(a.type===Database.Date){
          /*d=d.toGermanString();*/
        }
        s+='"'+d+'"';
      }

      if(i<attributes.length-1){
        s+=sep;
      }
    }
    return s;
  }
};