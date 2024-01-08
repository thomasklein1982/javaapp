<template>
  <div class="flex-container" style="overflow: hidden; height: 100%; width: 100%">
    <div style="padding-right: 0.5rem" class="flex-container-vertical" >
      <div class="p-buttonset-vertical flex" style="align-items: center; overflow-y: auto;">
        <Button icon="pi pi-search-plus" outlined @click="changeZoom(5)"/>
        <Button icon="pi pi-search-minus" outlined @click="changeZoom(-5)"/>
        <Button icon="pi pi-wrench" outlined @click="openSettings()"/>
        <Button icon="pi pi-ban" outlined @click="openColorToTransparency()"/>
        <Button icon="pi pi-arrows-alt" :outlined="currentTool!=='move'" @click="currentTool='move'"/>
        <Button icon="pi pi-pencil" :outlined="currentTool!=='pen'" @click="currentTool='pen'"/>
        <Button icon="pi pi-eraser" :outlined="currentTool!=='eraser'" @click="currentTool='eraser'"/>
      </div>
      <div class="flex-container-vertical">
        <div style="position: relative;height: 2ex;"><span style="font-size: 50%; position: absolute">{{ width }}:{{ height }}</span></div>
        <span @click="$refs.opColor.toggle" :style="{backgroundColor: fillColor}" style="margin-top: 0.2rem; border: 1pt solid #FFD54F; border-radius: 10px; display: inline-block; width: 2rem; height: 2rem"></span>
        <OverlayPanel ref="opColor">
          <ColorPicker inline v-model="pen.color"/>
          <div class="p-float-label">
            <InputText style="width: 100%" v-model="pen.color"/>
            <label>Farbe</label>
          </div>
          <Divider/>
          <Slider :min="0" :max="100" v-model="pen.opacity"/>
          <div class="p-float-label">
            <InputText style="width: 100%" v-model="pen.opacity"/>
            <label>Deckkraft</label>
          </div>
          <Divider/>
          <Slider :min="1" :max="200" v-model="pen.width"/>
          <div class="p-float-label">
            <InputText style="width: 100%" v-model="pen.width"/>
            <label>Dicke</label>
          </div>
        </OverlayPanel>
      </div>
    </div>
    <div ref="canvasWrapper" class="flex" style="overflow: auto">
      <canvas :style="canvasStyle" ref="canvas"/>
    </div>
    <Dialog header="Bild-Eigenschaften" v-model:visible="settings.show" :modal="true">
      <h2>Bild-Größe</h2>
      <div style="display: grid; grid-template-columns: auto auto 2rem auto; align-items: baseline">
        <span>Breite:</span>
        <span>
          <InputText type="number" v-model="settings.width" @change="onChangeWidth()"/>{{ settings.unit }}
        </span>
        <span>Höhe:</span>
        <span>
          <InputText type="number" v-model="settings.height" @change="onChangeHeight()"/>{{ settings.unit }}
        </span>
        <span style="padding-left: 0.5rem; height: 100%; display: grid; grid-template-columns: 1fr; grid-template-rows: 1fr 1fr 1fr; grid-column: 3; grid-row: 1/3" @click="settings.lock=!settings.lock">
          <span style="background-color: #FFD54F"></span>
          <span style="text-align: right"  ><span style="display: inline-block; height: 100%; width: 50%" :style="{'background-color': settings.lock? '#FFD54F':''}"></span></span>
          <span style="background-color: #FFD54F"></span>
        </span>
        <span style="padding-left: 0.5rem; grid-column: 4; grid-row: 1/3;">
          <Dropdown
            v-model="settings.unit"
            :options="['%','px']"
            @change="resetSize()"
          />
        </span>
      </div>
      <div>
        <h2>Bild-Art</h2>
        <p>Lege fest, ob das Bild als JPG pder als PNG gespeichert werden soll:</p>
        <Dropdown v-model="settings.imageType" :options="['PNG','JPG']"/>
        <div v-if="settings.imageType==='JPG'">
          <p>Eine JPG-Datei ist kleiner als eine PNG-Datei. Sie kann aber keine Transparenz enthalten. Du kannst die Qualität des Bildes festlegen:</p>
          <Slider v-model="settings.imageQuality"/>
          <p>Je höher die Qualität, desto mehr Speicherplatz belegt die Datei.</p>
        </div>
      </div>
      <template #footer>
        <Button @click="settings.show=false" icon="pi pi-times" label="Abbrechen"/>
        <Button @click="confirmSettings()" icon="pi pi-check" label="OK"/>
      </template>
    </Dialog>

    <Dialog header="Farbe zu Transparenz" v-model:visible="colorToTransparency.show" :modal="true">
      <ColorPicker inline v-model="colorToTransparency.color"/>
      <div class="p-float-label">
        <InputText style="width: 100%" v-model="colorToTransparency.color"/>
        <label>HEX-Wert</label>
      </div>
      
      <div style="margin-top: 1rem">
        <div style="margin-bottom: 0.5rem;">Toleranz:</div>
        <Slider v-model="colorToTransparency.tolerance" :min="0" :max="255"/>
      </div>
      <template #footer>
        <Button @click="colorToTransparency.show=false" icon="pi pi-times" label="Abbrechen"/>
        <Button @click="confirmColorToTransparency()" icon="pi pi-check" label="OK"/>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { nextTick } from 'vue';
import DatabaseDialog from './DatabaseDialog.vue';
import ColorPicker from 'primevue/colorpicker';
import {hexToRGBA} from '../functions/hexToRGBA';
import OverlayPanel from 'primevue/overlaypanel';
import Divider from 'primevue/divider';

export default{
  components: {
    ColorPicker, OverlayPanel, Divider
  },
  watch: {
    asset(){
      this.image.src=this.asset.data;
    },
    currentTool(){
      this.updateCanvasStyle();
    },
    penOpacity(){
      this.ctx.globalAlpha=this.pen.opacity/100;
    }
  },
  computed: {
    ctx(){
      if(!this.$refs.canvas) return null;
      let ctx=this.$refs.canvas.getContext("2d");
      //ctx.globalCompositeOperation="source-over";
      return ctx;
    },
    penOpacity(){
      return this.pen.opacity;
    },
    fillColor(){
      return "#"+this.pen.color;
      // let color=hexToRGBA(this.pen.color);
      // let a=this.pen.opacity/100;
      // return "rgba("+color.r+","+color.g+","+color.b+","+a+")";
    }
  },
  data(){
    return {
      dpr: window.devicePixelRatio,
      width: 100,
      height: 100,
      image: document.createElement("img"),
      asset: null,
      imageType: null,
      imageQuality: 100,
      currentTool: "pen",
      zoom: 100,
      canvasStyle: {},
      pen: {
        color: "000",
        opacity: 100,
        width: 10
      },
      settings: {
        show: false,
        width: 100,
        height: 100,
        lock: true,
        unit: "%",
        imageType: null,
        imageQuality: 100
      },
      colorToTransparency: {
        show: false,
        color: "#fff",
        tolerance: 0
      }
      
    };
  },
  mounted(){
    let x,y;
    let canvas=this.$refs.canvas;
    let handler=(e) => {
      if(this.currentTool==="pen"){
        let br=canvas.getBoundingClientRect();
        x = e.offsetX;
        y = e.offsetY;
        x*=this.width/br.width;
        y*=this.height/br.height;
        
        this.ctx.fillStyle=this.fillColor;
        let w=this.pen.width;
        this.ctx.fillRect(x-w/2,y-w/2,w,w);
      }
    };
    canvas.addEventListener('pointerdown', handler);
    canvas.addEventListener('pointermove', (e)=>{
      if(this.currentTool==="move") return;
      e.preventDefault();
      if(e.buttons!==1) return;
      handler(e);
    });
    this.image.onload=(ev)=>{
      this.width=this.image.width;
      this.height=this.image.height;
      this.$refs.canvas.width=this.width;
      this.$refs.canvas.height=this.height;
      this.updateCanvasStyle();
      nextTick(()=>{
        this.paintImage();
      });
    };
  },
  methods: {
    confirmSettings(){
      this.imageType=this.settings.imageType;
      this.imageQuality=this.settings.imageQuality;
      let w=this.settings.width;
      let h=this.settings.height;
      if(this.settings.unit==="%"){
        this.width=Math.round(this.width*w/100);
        this.height=Math.round(this.height*h/100);
      }else{
        this.width=w;
        this.height=h;  
      }
      this.$refs.canvas.width=this.width;
      this.$refs.canvas.height=this.height;
      this.updateCanvasStyle();
      nextTick(()=>{
        this.paintImage();
        this.saveChanges();
        this.settings.show=false;
      });
    },
    confirmColorToTransparency(){
      let imageData=this.ctx.getImageData(0,0,this.width,this.height);
      let tol=this.colorToTransparency.tolerance;
      tol=tol*tol;
      let data=imageData.data;
      console.log(data);
      let color=this.colorToTransparency.color;
      console.log(color);
      color=hexToRGBA(color);
      console.log(color);
      for(let i=0;i<data.length/4;i++){
        let dr=data[i*4+0]-color.r;
        let dg=data[i*4+1]-color.g;
        let db=data[i*4+2]-color.b;
        if(dr*dr+dg*dg+db*db<=tol){
          data[i*4+3]=0;
        }
      }
      this.ctx.putImageData(imageData,0,0);
      this.asset.data=this.$refs.canvas.toDataURL();
      this.setAsset(this.asset);
      this.colorToTransparency.show=false;
    },
    saveChanges(){
      let types={
        PNG: "image/png",
        JPG: "image/jpeg"
      };
      let type=types[this.imageType];
      if(!type) type="image/png";
      this.asset.data=this.$refs.canvas.toDataURL(type,this.imageQuality*0.01);
      this.setAsset(this.asset);
    },
    onChangeWidth(){
      if(!this.settings.lock) return;
      if(this.settings.unit==="%"){
        this.settings.height=this.settings.width;
      }else{
        let ratio=this.height/this.width;
        this.settings.height=Math.round(this.settings.width*ratio);
      }
    },
    onChangeHeight(){
      if(!this.settings.lock) return;
      if(this.settings.unit==="%"){
        this.settings.width=this.settings.height;
      }else{
        let ratio=this.height/this.width;
        this.settings.width=Math.round(this.settings.height/ratio);
      }
    },
    resetSize(){
      if(this.settings.unit==="%"){
        this.settings.width=100;
        this.settings.height=100;
      }else{
        this.settings.width=this.width;
        this.settings.height=this.height;
      }
    },
    changeZoom(dz){
      this.zoom+=dz;
      if(this.zoom<5){
        this.zoom=5;
      }
      this.updateCanvasStyle();
    },
    openColorToTransparency(){
      this.colorToTransparency.color="#fff";
      this.colorToTransparency.show=true;
      this.colorToTransparency.tolerance=0;
    },
    openSettings(){
      this.settings.width=100;
      this.settings.height=100;
      this.settings.unit="%";
      this.settings.imageType=this.imageType;
      this.settings.imageQuality=this.imageQuality;
      this.settings.show=true;
    },
    updateCanvasStyle(){
      let div=this.$refs.canvasWrapper;
      if(!div) return {};
      let c=this.$refs.canvas;
      let style={};
      if(this.currentTool!=="move"){
        style.touchAction="none";
      }
      if(div.offsetHeight/div.offsetWidth<=this.height/this.width){
        style.height=this.zoom+"%";
      }else{
        style.width=this.zoom+"%";
      }
      this.canvasStyle=style;
    },
    setAsset(asset){
      this.asset=asset;
      this.image.src=this.asset.data;
      let type=this.asset.data.split(";",1)[0];
      if(type.indexOf("image/jpeg")>=0 || type.indexOf("image/jpg")>=0){
        this.imageType="JPG";
      }else if(type.indexOf("image/png")>=0){
        this.imageType="PNG";
      }
      this.settings.imageType=this.imageType;
      this.settings.imageQuality=100;
    },
    paintImage(){
      if(!this.ctx) return;
      //this.ctx.globalCompositeOperation="source-over";
      this.ctx.drawImage(this.image, 0, 0,this.width,this.height);
      //this.ctx.globalCompositeOperation="destination-over";
    }
  }
}
</script>