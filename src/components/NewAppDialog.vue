<template>
  <Dialog header="Neue App" v-model:visible="show"  :maximizable="true" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
    <div style="margin-top: 0.5rem;">
      Name des neuen Projekts:
      <InputText type="search" placeholdertext="Name des neuen Projekts" v-model="name"/>
      <small v-if="nameerror" style="display: block; color: red">{{nameerror}}</small>
    </div>
    <template v-if="$root.webMode">
      
    </template>
    <template v-else>
      <div style="margin-top: 0.5rem">Wähle eine Vorlage für die neue App:</div>
      <Listbox optionLabel="name" :options="templates" v-model="template"/>
      <small style="display: block">{{template? template.description: 'Keine Vorlage ausgewählt'}}</small>
    </template>
    <div style="text-align: right; margin-top: 0.5rem;">
      <Button :disabled="nameerror || !template" @click="clickOK()" label="OK"/> <Button @click="show=false" label="Abbrechen"/>
    </div>
  </Dialog>
</template>

<script>
import {options} from '../classes/Options';
export default {
  watch: {
    template(nv,ov){
      if(!nv){
        this.template=ov;
      }
    }
  },
  computed: {
    nameerror(){
      if(this.name.length===0){
        return "Der Name muss aus mindestens einem Zeichen bestehen.";
      }
      if(/\W/g.test(this.name)){
        return "Der Name darf nur aus Buchstaben, Ziffern und dem Unterstrich bestehen.";
      }
      if(!/[A-Za-z]/.test(this.name.charAt(0))){
        return "Der Name muss mit einem Buchstaben beginnen.";
      }
      return null;
    }
  },
  data(){
    return {
      show: false,
      name: this.$root.webMode? "MySite":"MyApp",
      template: null,
      templates: [
        {
          name: "Leere App",
          description: "Eine App mit main-Methode. Bereit zu coden!",
          code: "void main( ){\n  \n}"
        },
        {
          name: "App mit UI",
          description: "Eine App mit main-Methode und einer UI-Klasse.",
          code: [
            'void main( ) {\n  \n}\n\n$onAction',
            {
              type: "UI",
              code: '{"name":"UI","components":[{"type":"JButton","value":"Klicken","x":50,"y":50,"width":100,"height":100,"name":""}]}'
            }
          ]
        },
        {
          name: "Game mit Gamepad und Canvas",
          modes: ["Easy","Normal"],
          description: "Grundgerüst für eine Spiel, das mit einem Gamepad gesteuert werden kann.",
          code: options.isHardMode()? [
            `Gamepad gp = new Gamepad( );
JImage player;
Canvas world;

void main( ) {
  JFrame f = new JFrame( "1" );
  world = new Canvas( 0, 10, 0, 10 );
  JImage background = new JImage( "https://thomaskl.uber.space/Webapps/Assets/graphics/overworld/water-1.png" );
  background.setBounds(0, 0, 10, 10);
  world.add( background );
  player = new JImage( "https://thomaskl.uber.space/Webapps/Assets/graphics/monster/merfolk_water.png" );
  world.add( player );
  player.setPosition( 5, 5 );
  player.setWidth( 1 );
  player.setHeight( 1 );
  f.add(world);

  gp.setEventListener( "left", "press", (ev)->{
    player.unflip( );
  } );
  gp.setEventListener( "right", "press", (ev)->{
    player.flip( );
  });
  System.setNextFrameListener( ()->{ 
    gameloop( ); 
  } );
}

void gameloop( ) {
  if ( gp.isAnyDirectionPressed( ) ) {
    player.setDirection( gp.getDirection( ) );
    player.move( 0.05 );
  }
}`
          ]:[
            `Gamepad gp = new Gamepad( );

void main( ) {
  
}

void onGamepad( String button ) {
  if ( button == "left" ) {
    UI.player.unflip( );
  }
  if ( button == "right" ) {
    UI.player.flip( );
  }
}

void onNextFrame( ) {
  if ( gp.isAnyDirectionPressed( ) ) {
    UI.player.setDirection( gp.getDirection( ) );
    UI.player.move( 0.05 );
  }
}`,
            {
              type: "UI",
              code: `{
                "name":"UI",
                "components": [
                  {
                    "type": "Canvas",
                    "components": [
                      {
                        "type": "JImage",
                        "value": "https://thomaskl.uber.space/Webapps/Assets/graphics/overworld/water-1.png",
                        "valueType": "assets",
                        "onAction": false,
                        "actionCommand": "",
                        "imageZoom": 1,
                        "imageTranslationX": "0%",
                        "imageTranslationY": "0%",
                        "x": 5,
                        "y": 5,
                        "width": "10",
                        "height": "10",
                        "cssClass": "jimage",
                        "cssCode": "",
                        "invisible": false
                      },
                      {
                        "type": "JImage",
                        "value": "https://thomaskl.uber.space/Webapps/Assets/graphics/monster/merfolk_water.png",
                        "valueType": "assets",
                        "onAction": false,
                        "actionCommand": "",
                        "imageZoom": 1,
                        "imageTranslationX": "0%",
                        "imageTranslationY": "0%",
                        "x": 5,
                        "y": 5,
                        "width": 1,
                        "height": 1,
                        "cssClass": "jimage",
                        "cssCode": "",
                        "invisible": false,
                        "name": "player"
                      }
                    ],
                    "minX": 0,
                    "maxX": 10,
                    "minY": 0,
                    "maxY": 10,
                    "onAction": false,
                    "actionCommand": "",
                    "onMouseUp": false,
                    "onMouseDown": false,
                    "onMouseMove": false,
                    "sizePolicy": "fit",
                    "hideContent": false,
                    "x": 5,
                    "y": 5,
                    "width": 1,
                    "height": 1,
                    "cssClass": "canvas",
                    "cssCode": "",
                    "invisible": false
                  }
                ]
              }`
            }
          ]
        },
        {
          name: "Chat über das Netzwerk",
          description: "Ein Beispiel für eine App, die über das Internet funktioniert.",
          code: [
            `NetworkSession session;

void main( ) {
  session=new NetworkSession();
  session.showStartDialog();
  session.onMessage((m)->{
    System.out.println( m.sender+": "+m.message );
  });
  while(true){
    Console.print("Deine Nachricht: ");
    String m=Console.read();
    session.sendToOthers(m);
  }
}`,
          ]
        },
        {
          name: "App mit Parser",
          description: "Ein Beispiel für die Verwendung eines Parsers für eine Grammatik.",
          code: [
            'void main( ) {\n  \n}\n\nvoid onAction(JComponent trigger){\n  String t = UI.code.getValue( );\n  try{\n    AST a = Sprache.parse( t );\n    System.out.println( a );\n  }catch( Exception e ){\n    System.out.println( "Fehler beim Parsen:" );\n    System.out.println( e );\n  }\n}',
            {type: "PEG", "name":"Sprache","src":"Programm = (Rechnung BR)*\n\nRechnung = Zahl _* Op _* Zahl\n\nZahl = [0-9]+ \n\nOp = \"+\" / \"-\"\n\nBR = \"\\n\"\n\n_ = \" \" / \"\\t\""},
            {
              type: "UI",
              code: '{"name":"UI","components":[{"type":"JTextArea","value":"45-4\\n30+206\\n","placeholder":"Rechnungen eingeben","valueType":"text","disabled":false,"x":5,"y":5,"width":1,"height":1,"cssClass":"jtextarea","cssCode":"","invisible":false, "name": "code"},{"type":"JButton","value":"Parsen","x":5,"y":5,"width":10,"height":10,"name":""}]}'
            }
          ]
        },
      ]
    };
  },
  mounted(){
    this.template=this.templates[0];
  },
  methods: {
    clickOK(){
      if(this.nameerror || !this.template){
        return;
      }
      let name=this.name;
      let c=name.charAt(0).toUpperCase();
      name=c+name.substring(1);
      let code;
      if(this.template.code.splice){
        code=JSON.parse(JSON.stringify(this.template.code));
      }else{
        code=[this.template.code];
      }
      code[0]=code[0].replace(/NAME/g,name);
      if(options.autoextendJavaApp){
        code[0]=code[0].replace(/\$onAction/g,"void onAction( JComponent trigger ){\n\t\n}");
      }else{
        code[0]=code[0].replace(/\$onAction/g,"");
      }
      if(options.voidOptional){
        code[0]=code[0].replace(/void /g,"");
      }
      // code[0]=js_beautify(code[0],{
      //   "indent_size": 2,
      //   "max_preserve_newlines": 2,
      //   "indent_empty_lines": true,
      //   "space_in_paren": true,
      //   "space_in_empty_paren": true
      // });
      
      this.$emit("newapp",name,code);
      this.setVisible(false);
    },
    setVisible(v){
      this.show=v;
    }
  }
}
</script>