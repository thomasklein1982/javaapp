<template>
  <Dialog header="Neue App" v-model:visible="show"  :maximizable="true" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
    <div style="margin-top: 0.5rem;">
      Name der neuen App:
      <InputText placeholdertext="Name der neuen App" v-model="name"/>
      <small v-if="nameerror" style="display: block; color: red">{{nameerror}}</small>
    </div>
    <div style="margin-top: 0.5rem">Wähle eine Vorlage für die neue App:</div>
    <Listbox optionLabel="name" :options="templates" v-model="template"/>
    <small style="display: block">{{template? template.description: 'Keine Vorlage ausgewählt'}}</small>
    <div style="text-align: right">
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
      name: "MyApp",
      template: null,
      templates: [
        {
          name: "Leere App",
          description: "Eine normale, leere App. Bereit zu coden!",
          code: "class NAME{\n  \n  void onStart(){\n    \n  }\n\n  public static void main(String[] args){\n    new NAME();\n  }\n}"
        },
        {
          name: "App mit UI",
          description: "Eine leere App mit einer UI-Klasse.",
          code: [
            'class NAME {\n  Screen screen;\n  void onStart( ) {\n    screen = new Screen( );\n  }\n  \n  void onAction( JComponent trigger ) {\n    \n  }\n\n  public static void main(String[] args){\n    new NAME();\n  }\n}',
            {
              type: "UI",
              code: '{"name":"Screen","components":[{"type":"JButton","value":"Klicken","x":50,"y":50,"width":100,"height":100,"name":""}]}'
            }
          ]
        },
        // {
        //   name: "Spiel mit Gamepad-Steuerung",
        //   description: "Eine App, die bereits den nötigen Code enthält, um ein Spiel mit Gamepad-Steuerung zu programmieren.",
        //   code: "class NAME{\n  int x, y;\n  \n  void onStart(){\n    App.gamepad.show();\n    x = 50;\n    y = 50;\n  }\n\n  void onNextFrame(){\n    App.clear();\n    if( App.gamepad.left ){\n      x = x - 1;\n    }\n    if( App.gamepad.right ){\n      x = x + 1;\n    }\n    if( App.gamepad.up ){\n      y = y + 1;\n    }\n    if( App.gamepad.down ){\n      y = y - 1;\n    }\n    App.setMirrored( true );\n    App.write(\"🐝\",x,y,\"center\");\n    App.setMirrored( true );\n  }\n  \n  public static void main(String[] args){\n     App.setupApp(\"NAME\",\"🐝\",100,100,\"lime\");\n    new NAME();\n  }\n}"
        // },
        // {
        //   name: "Grafik-Beispiel",
        //   description: "Eine App, die demonstriert, wie man Grafiken verwenden kann.",
        //   code: 'class NAME {\n  JImage bild;\n  void onStart( ) {\n    //methode 1: Als JImage-Objekt, auch GIFs moeglich\n    bild = new JImage( "https://thomaskl.uber.space/Webapps/Assets/graphics/overworld/fountain-2.png", 85, 85, 30, 30 );\n    \n    //methode 2: direkt zeichnen:\n    App.drawImage( "fire", 40, 40, 30, 30, 0, false );\n  }\n  \n  public static void main( String[ ] args ) {\n    //bilder, die mit Methode 2 gezeichnet werden, muessen vorher geladen werden:    \n    App.loadAsset( "https://thomaskl.uber.space/Webapps/Assets/graphics/gui/spells/fire/fireball_old.png", "fire" );\n    \n    new NAME( );\n  }\n}'
        // },
        // {
        //   name: "Sound-Beispiel",
        //   description: "Eine App, die demonstriert, wie man Sounds abspielt.",
        //   code: 'class NAME {\n  JCheckBox loop;\n  JButton play, stop;\n  void onStart( ) {\n    //erzeuge eine minimale UI für die Demo:\n    play = new JButton( "Play sound", 50, 70, 80, 10 );\n    stop = new JButton( "Stop all sounds", 50, 50, 80, 10 );\n    loop = new JCheckBox( "Wiederholen", 50, 30, 50, 10 );\n    \n  }\n  \n  void onAction( JComponent trigger ) {\n    if ( trigger == play ) {\n      App.playSound( "coin3", loop.getValue( ) );\n    }\n    if ( trigger == stop ) {\n      //null bedeutet, dass alle Sounds gestoppt werden\n      App.stopSound( null );\n    }\n  }\n  \n  public static void main( String[ ] args ) {\n    //zunaechst muss eine Bibliothek und anschliessend die Sound-Dateien geladen werden:\n    App.loadHowlerJS( );\n    App.loadAsset( "https://thomaskl.uber.space/Webapps/Assets/sounds/coin3.mp3", "coin3" );\n    new NAME( );\n  }\n}'
        // },
        // {
        //   name: "Simple Chat",
        //   description: "Eine App, die demonstriert, wie man über das Internet kommunizieren kann.",
        //   code: [
        //     'class NAME {\n  UI ui;\n  Verlauf verlauf;\n  void onStart( ) {\n    verlauf = new Verlauf( );\n    App.session.showStartDialog( );\n    ui = new UI( );\n    ui.verlauf.setEnabled( false );\n    if ( App.session.isServer ) {\n      ui.status.setValue( App.session.myID + " [Server]" );\n    } else {\n      ui.status.setValue( App.session.myID + " [Client]" );\n    }\n  }\n  \n  void onAction( JComponent trigger ) {\n    if ( trigger == ui.senden ) {\n      Nachricht n = new Nachricht( App.session.myID, ui.nachricht.getValue( ) );\n      verlauf.add( n );\n      String m = n.serialize( );\n      App.session.sendMessage( m );\n      ui.verlauf.setValue( verlauf.print( ) );\n    }\n  }\n  \n  void onMessage( String senderID, String message ) {\n    Nachricht n = ( Nachricht ) Object.deserialize( message );\n    verlauf.add( n );\n    ui.verlauf.setValue( verlauf.print( ) );\n  }\n  \n  public static void main( String[ ] args ) {\n    App.loadPeerJS( );\n    App.loadHowlerJS( );\n    App.loadAsset( "https://thomaskl.uber.space/Webapps/Assets/sounds/coin3.mp3", "coin3" );\n    new NAME( );\n  }\n}',
        //     'class Nachricht {\n  String content, sender;\n  int[ ] time;\n  \n  Nachricht( String sender, String text ) {\n    this.sender = sender;\n    content = text;\n    time = new int[ ] {\n      App.time.h, App.time.min, App.time.sec\n    };\n  }\n  \n  String print( ) {\n    String t;\n    t = this.sender + "[" + time[ 0 ] + ":" + time[ 1 ] + ":" + time[ 2 ] + "]" + ": " + content;\n    return t;\n  }\n}',
        //     {
        //       type: "UI",
        //       code: '{"name":"UI","components":[{"type":"JLabel","value":"","x":50,"y":50,"width":100,"height":100,"name":"status"},{"type":"JTextArea","value":"","placeholder":"Chat-Verlauf","x":50,"y":50,"width":100,"height":100,"name":"verlauf"},{"type":"JPanel","components":[{"type":"JTextField","inputType":"text","value":"","placeholder":"deine Nachricht","x":50,"y":50,"width":100,"height":100,"name":"nachricht"},{"type":"JButton","value":"Senden","x":50,"y":50,"width":100,"height":100,"name":"senden"}],"template":"1fr auto","x":50,"y":50,"width":100,"height":100,"name":""}],"cssClass":"","template":"1cm 1fr 1cm / 1","x":50,"y":50,"width":100,"height":100}'
        //     },
        //     'class Verlauf {\n  Nachricht[ ] nachrichten;\n  int anzahl;\n  \n  Verlauf( ) {\n    nachrichten = new Nachricht[ 100 ];\n    anzahl = 0;\n  }\n  \n  void add( Nachricht n ) {\n    nachrichten[ anzahl ] = n;\n    anzahl++;\n  }\n  \n  String print( ) {\n    String t = "";\n    for ( int i = 0; i < anzahl; i++ ) {\n      Nachricht n = nachrichten[ i ];\n      t = t + n.print( ) + "\\n";\n    }\n    return t;\n  }\n}'
        //   ]
        // }
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
      console.log(this.template);
      let name=this.name;
      let c=name.charAt(0).toUpperCase();
      name=c+name.substring(1);
      let code;
      if(this.template.code.splice){
        code=JSON.parse(JSON.stringify(this.template.code));
      }else{
        code=[this.template.code];
      }
      if(options.mainOptional){
        code[0]=code[0].replace("\n\n  public static void main(String[] args){\n    new NAME();\n  }","");
      }
      code[0]=code[0].replace(/NAME/g,name);
      if(options.voidOptional){
        code[0]=code[0].replace(/void /g,"");
      }
      if(options.instantiateUIClasses){
        code[0]=code[0].replace("\n  Screen screen;","");
        code[0]=code[0].replace("screen = new Screen( );","");
      }
      if(options.classOptional){
        let pos=code[0].indexOf("{");
        let pos2=code[0].lastIndexOf("}");
        code[0]=code[0].substring(pos+1,pos2);
        code[0]=code[0].trim();
      }
      code[0]=js_beautify(code[0],{
        "indent_size": 2,
        "max_preserve_newlines": 2,
        "indent_empty_lines": true,
        "space_in_paren": true,
        "space_in_empty_paren": true
      });
      
      this.$emit("newapp",name,code);
      this.setVisible(false);
    },
    setVisible(v){
      this.show=v;
    }
  }
}
</script>