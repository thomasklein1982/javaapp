<template>
  <Dialog header="Layout-Editor" v-model:visible="show"  :maximizable="true" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" >
    <template v-if="step===0">
      Wie soll diese Komponente ihre Kind-Komponenten anordnen?
      <div style="margin-top: 1rem">
        <input type="radio" id="option1" name="layouttype" v-model="layouttype" :value="0">
        <label for="option1">Gar nicht</label>
      </div>
      <div>
        <input type="radio" id="option2" name="layouttype"  v-model="layouttype" :value="1">
        <label for="option2">In gleich breiten Spalten</label>
      </div>
      <div>
        <input type="radio" id="option3" name="layouttype" v-model="layouttype" :value="2">
        <label for="option3">In einer individuellen Anordnung</label>
      </div>
    </template>
    <template v-if="step===1">
      <template v-if="layouttype===0">
        Alle Komponenten werden in ihrer normalen Größe dargestellt.
      </template>
      <template v-else-if="layouttype===1">
        Wie viele gleich breite Spalten sollen es sein?
        <Dropdown v-model="equalColumnCount" :options="columnCounts"/>
      </template>
      <template v-else-if="layouttype===2">
        <div>
          Wie viele Zeilen sollen es sein?
          <Dropdown v-model="rowCount" :options="counts"/>
        </div>
        <div>Wie viele Spalten sollen es sein?
          <Dropdown v-model="columnCount" :options="counts"/>
        </div>
        <divider></divider>
        <div v-if="columnCount>=1 || rowCount>=1">
          <div :style="{display: 'grid', 'grid-template': 'auto 1fr/auto 1fr', 'justify-items': 'stretch','align-items':'stretch'}">
            <div v-if="columnCount>=1" :style="{'grid-column': 2, 'grid-row': 1}">
              <Dropdown v-model="columnWidths[i-1]" v-for="i in columnCount" :options="['1fr','auto']"></Dropdown>
            </div>
            <div v-if="rowCount>=1" style="width: 6rem" :style="{'grid-column': 1, 'grid-row': 2}">
              <div>
                <Dropdown v-model="rowWidths[i-1]" v-for="i in rowCount" :options="['1fr','auto']"></Dropdown>
              </div>
            </div>
            <div :style=previewStyle>
              <div v-for="i in previewCellcount" style="border: 1pt dashed white">
                <div style="background-color: white; width: 0.5cm; height: 0.5cm">

              </div>
              </div>
            </div>
          </div>
          
        </div>
        <div v-else>
          Du kannst nicht gleichzeitig beliebig viele Spalten und beliebig viele Spalten haben.
        </div>
      </template>
    </template>
    <div style="text-align: right">
      <Button v-if="step>0" @click="step--" class="p-button-secondary" label="Zurück"/>
      <Button v-if="step<1" @click="step++"  label="Weiter"/>
      <Button v-else @click="confirm()" label="OK"/>
    </div>
  </Dialog>
</template>

<script>
import Divider from "primevue/divider";

export default {
  watch: {
    columnCount(nv,ov){
      while(this.columnWidths.length<nv){
        this.columnWidths.push('1fr');
      }
      while(this.columnWidths.length>nv){
        this.columnWidths.pop();
      }
    },
    rowCount(nv,ov){
      while(this.rowWidths.length<nv){
        this.rowWidths.push('1fr');
      }
      while(this.rowWidths.length>nv){
        this.rowWidths.pop();
      }
    }
  },
  computed: {
    previewCellcount(){
      let r=this.rowCount;
      let c=this.columnCount;
      r=r>=1? r:1;
      c=c>=1? c:1;
      return r*c;
    },
    previewStyle(){
      let template,realTemplate;
      template="";
      // if(this.columnCount>=1){
      //   width="5cm";
      // }else{
      //   width="2cm";
      // }
      // if(this.rowCount>=1){
      //   height=this.rowCount+"cm";
      // }else{
      //   height="2cm";
      // }
      let columns,realColumns;
      let rows,realRows;
      if(this.columnCount>=1){
        columns="";
        for(let i=0;i<this.columnCount;i++){
          let cw=this.columnWidths[i];
          columns+=cw+" ";
        }
        realColumns=columns.trim();
      }else{
        columns="1fr";
        realColumns="";
      }
      if(this.rowCount>=1){
        rows="";
        for(let i=0;i<this.rowCount;i++){
          let rw=this.rowWidths[i];
          rows+=rw+" ";
        }
        realRows=rows.trim();
      }else{
        rows="1fr";
        realRows="";
      }
      template=rows+"/"+columns;
      realTemplate=realRows+"/"+realColumns;
      return {
        display: "grid",
        gridTemplate: template,
        realTemplate,
        gridColumn: 2,
        gridRow: 2,
        minHeight: '5cm'
      };
    }
  },
  data(){
    return {
      show: false,
      layouttype: 0,
      step: 0,
      equalColumnCount: 1,
      columnCount: "beliebig viele",
      rowCount: 2,
      columnCounts: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      counts: ["beliebig viele", 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      columnWidths: [],
      rowWidths: ['1fr','1fr']
    };
  },
  methods: {
    setVisible(v,template){
      if(template){
        template=template.trim().toLowerCase();
      }
      this.show=v;
      this.step=0;
      this.layouttype=0;
      this.equalColumnCount=1;
      this.columnCount="beliebig viele";
      this.rowCount=2;
      if(!template) return;
      if(/^\d+$/.test(template)){
        this.layouttype=1;
        this.equalColumnCount=template*1;
        return;
      }
      if(template.length>1 && /^((?:(auto|1fr)\s+)*(auto|1fr)\s*)?(\/)(\s*(?:(auto|1fr)\s+)*(auto|1fr))?$/.test(template)){
        this.layouttype=2;
        let split=template.split("/");
        let rows=split[0].trim();
        let columns=split[1].trim();
        if(!rows){
          this.rowWidths=['1fr','1fr'];
        }else{
          this.rowWidths=[];
          let r=rows.split(" ");
          for(let i=0;i<r.length;i++){
            let t=r[i].trim();
            if(!t) continue;
            this.rowWidths.push(t);
          }
          this.rowCount=this.rowWidths.length;
        }
        this.columnWidths=[];
        if(columns){
          let c=columns.split(" ");
          for(let i=0;i<c.length;i++){
            let t=c[i].trim();
            if(!t) continue;
            this.columnWidths.push(t);
          }
          this.columnCount=this.columnWidths.length;
        }
      }
      
      
    },
    confirm(){
      this.show=false;
      let template;
      if(this.layouttype===0){
        template="";
      }else if(this.layouttype===1){
        template=this.equalColumnCount;
      }else{
        template=this.previewStyle.realTemplate;
      }
      this.$emit("confirm",template);
    },
    getCSSStyle(template){
      var style={
      };
      template=template.trim();
      if(!template){
        return style;
      }
        
    }
  },
  components: {
    Divider
  }
}
</script>