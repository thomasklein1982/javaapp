import { Database } from "./Database";

export class Table{
  constructor(database,name){
    this.database=database;
    this.name=name;
    this.attributes=[];
    this.records=[];
  }
  fromTable(table){
    this.attributes=table.attributes;
    this.records=table.records;
    this.name=table.name;
    this.database=table.database;
  }
  createInMemory(commandsOnly){
    var commands=[];
    if(this.attributes.length===0) return;
    var code="CREATE TABLE "+this.name+" (";
    for(var i=0;i<this.attributes.length;i++){
      var a=this.attributes[i];
      code+=""+a.name+" "+a.type.id;
      if(i<this.attributes.length-1){
        code+=",";
      }
    }
    code+=")";
    if(!commandsOnly){
      alasql(code);
    }
    commands.push(code);
    for(var i=0;i<this.records.length;i++){
      var r=this.records[i];
      code="INSERT INTO "+this.name+" VALUES (";
      for(var j=0;j<this.attributes.length;j++){
        if(j>0){
          code+=",";
        }
        var d=r[j];
        var typ=this.attributes[j].type;
        if(d===undefined||d===null){
          if(d===undefined && i===this.records.length-1){
            if(typ.id===Database.String.id){
              code+="''";
            }else{
              code+="NULL";
            }
          }else{
            code+="NULL";
          }
        }else{
          if(typ.id===Database.String.id){
            code+=JSON.stringify(d);
          }else if(typ.id===Database.Time.id){
            if(/^\d\d(?:\:\d\d(?:\:\d\d)?)?$/.test(d)){
              code+="'"+d+"'";/*"new Date('"+d+"')";*/
            }else{
              code+=null;
            }
            
          }else if(typ.id===Database.Date.id){
            if(/^\d\d\d\d(?:-\d\d(?:\-\d\d)?)?$/.test(d)){
              code+="'"+d+"'";/*"new Date('"+d+"')";*/
            }else{
              code+=null;
            }
            
          }else{
            let n=+d;
            if(isNaN(n)){
              if(d){
                n=+d.replace(",",".");
              }
              if(isNaN(n)){
                n=null;
              }
            }
            code+=n;
          }
        }
      }
      code+=")";
      if(!commandsOnly){
        if(window.$main){
          try{
            alasql(code);
          }catch(e){
            console.log(e);
          }
        }else{
          alasql(code);
        }
      }
      commands.push(code);
    }
    return commands;
  }
  $toString(){
    var s=this.toCSVString();
    var pos=s.indexOf("\n");
    return s.substring(pos+1);
  }
  fromCSVString(s,sep){
    s=s.trim();
    var lines=s.split("\n");
    this.attributes=[];
    this.records=[];
    if(lines.length===1){
      return false;
    }
    this.name=lines[0].trim();
    var attributes=lines[1].split(sep);
    for(var i=0;i<attributes.length;i++){
      var a=attributes[i].trim();
      if(a.length===0){
        continue;
      }
      var teile=a.split("/");
      var name=teile[0];
      if(teile.length>1){
        var type=Database.getTypeByName(teile[1]);
      }else{
        var type=Database.String;
      }
      if(!type) return false;
      this.addAttribute(name,type);
    }
    for(var i=2;i<lines.length;i++){
      var records=lines[i].split(sep);
      var rec=[];
      for(var j=0;j<records.length;j++){
        try{
          var r=JSON.parse(records[j]);
        }catch(e){
          var r=records[j];
        }
        rec.push(r);
      }
      this.records.push(rec);
    }
    return true;
  }
  toCSVString(sep){
    var s=this.name+"\n";
    if(this.attributes){
      for(var i=0;i<this.attributes.length;i++){
        var a=this.attributes[i];
        s+=a.name+"/"+a.type.name;
        if(i<this.attributes.length-1){
          s+=sep;
        }
      }
      s+="\n";
      for(var i=0;i<this.records.length;i++){
        var r=this.records[i];
        var sr="";
        for(var j=0;j<r.length;j++){
          if(j>0){
            s+=sep;
          }
          s+=JSON.stringify(r[j]);
        }
        s+="\n";
      }
    }
    return s;
  }
  // calcDatatypes(){
  //   for(var i=0;i<this.attributes.length;i++){
  //     var a=this.attributes[i];
  //     var isNumber=true;
  //     var isDate=true;
  //     var isDateReversed=null;
  //     for(var j=0;j<this.records.length;j++){
  //       var r=this.records[j].get(i);
  //       if(r===undefined){
  //         continue;
  //       }
  //       if(isNumber){
  //         /*check for Number:*/
  //         if(r.charAt(0)==='0' || isNaN(r.replace(/,/g,".")*1)){
  //           isNumber=false;
  //         }
  //       }
  //       if(isDate){
  //         /*check for date:*/
  //         if(r.match(/^\d\d.\d\d.\d\d\d\d$/g)){
  //           isDate=true;
  //           if(isDateReversed===true){
  //             isDate=false;
  //           }else{
  //             isDateReversed=false;
  //           }
  //         }else if(r.match(/^\d\d\d\d.\d\d.\d\d$/g)){
  //           isDate=true;
  //           if(isDateReversed===false){
  //             isDate=false;
  //           }else{
  //             isDateReversed=true;
  //           }
  //         }else{
  //           isDate=false;
  //         }
  //       }
  //       if(!isNumber && !isDate){
  //         break;
  //       }
  //     }
  //     if(isNumber && isDate || !isNumber && !isDate){
  //       a.type=Database.String;
  //     }else if(isNumber){
  //       a.type=Database.Number;
  //     }else{
  //       a.type=Database.Date;
  //     }
  //     if(a.type!==Database.String){
  //       for(var j=0;j<this.records.length;j++){
  //         var r=this.records[j];
  //         var d=r.get(i);
  //         if(d!==undefined){
  //           if(a.type===Database.Number){
  //             r.set(i,d.replace(/,/g,".")*1);
  //           }else if(a.type===Database.Date){
  //             if(isDateReversed){
  //               var y=d.substring(0,4);
  //               var month=d.substring(5,7);
  //               var day=d.substring(8);
  //             }else{
  //               var day=d.substring(0,2);
  //               var month=d.substring(3,5);
  //               var y=d.substring(6);
  //             }
  //             /*d=new Date(y,month,day,0,0,0);
  //             d.setUTCDate(day);
  //             d.setUTCHours(0);*/
  //             r.set(i,y+"."+month+"."+day);
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  removeAttribute(a){
    for(var i=0;i<this.attributes.length;i++){
      var a2=this.attributes[i];
      if(a2===a){
        this.attributes.splice(i,1);
        for(var j=0;j<this.records.length;j++){
          var r=this.records[j];
          r.splice(i,1);
        }
        return;
      }
    }
  }
  getAttributeNames(){
    var s="";
    for(var i=0;i<this.attributes.length;i++){
      if(i>0){
        s+=", ";
      }
      s+=this.attributes[i].name;
    }
    return s;
  }
  addAttribute(a,type){
    var tableName=this.name;
    var at={
      name: a.toUpperCase(),
      type: type,
      index: this.attributes.length,
      tableName: tableName
    };
    this.attributes.push(at);
    for(var i=0;i<this.records.length;i++){
      var r=this.records[i];
      r.push(type.value);
    }
    return at;
  }
  appendNewRecord(){
    var r=[];
    for(var i=0;i<this.attributes.length;i++){
      var a=this.attributes[i];
      r.push(a.type.value);
    }
    this.records.push(r);
  }
  addRecord(r){
    this.records.push(r);
    return r;
  }
};