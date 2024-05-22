<template>
  <h1>FAQ</h1>
  <p>Schau auf dieser Seite nach, wenn du nach einem bestimmten Feature von JavaApp suchst.</p>
  <Accordion :active-index="activeIndex" multiple>
    <AccordionTab header="Wie sieht das Grundgerüst einer JavaApp aus?">
      <ExampleCode>
        <template v-slot:easy>
          <pre class="code">
onStart(){
  //Code, der bei Start der App ausgeführt wird
}

onAction(JComponent trigger){
  //Code, der ausgeführt wird, wenn ein Button angeklickt wird
}
          </pre>
        </template>
        <template v-slot:normal>
          <pre class="code">
class MyApp{
  void onStart(){
    //Code, der bei Start der App ausgeführt wird
  }

  void onAction(JComponent trigger){
    //Code, der ausgeführt wird, wenn ein Button angeklickt wird
  }

  public static void main(String[] args){
    new MyApp();
  }
}
          </pre>
        </template>
        <template v-slot:hard>
          <pre class="code">
class MyApp{
  public static void main(String[] args){
    //Code, der bei Start der App ausgeführt wird
  }
}
          </pre>
        </template>
      </ExampleCode>
    </AccordionTab>
    <AccordionTab header="Wie kann ich programmieren, was bei einem Button-Klick passieren soll?">
      <ExampleCode>
        <template v-slot:easy>
          <p>Schreibe den Code in die <code>onAction</code>-Methode:</p>
          <pre class="code">
onAction(JComponent trigger){
  if ( trigger.actionCommand == "start" ){
    //was soll passieren, wenn der Button "start" geklickt wird?
  }
  if ( trigger.actionCommand == "weiter" ){
    //was soll passieren, wenn der Button "weiter" geklickt wird?
  }
  ...
}
          </pre>
        </template>
        <template v-slot:normal>
          <p>Schreibe den Code in die <code>onAction</code>-Methode der Hauptklasse:</p>
          <pre class="code">
  void onAction(JComponent trigger){
    if ( trigger.actionCommand == "start" ){
      //was soll passieren, wenn der Button "start" geklickt wird?
    }
    if ( trigger.actionCommand == "weiter" ){
      //was soll passieren, wenn der Button "weiter" geklickt wird?
    }
    ...
  }
}
          </pre>
        </template>
        <template v-slot:hard>
          <p>Füge dem Button einen ActionListener hinzu:</p>
          <pre class="code">
class MyApp{
  public static void main(String[] args){
    JFrame frame = new JFrame();
    JButton b = new JButton( "Klick" );
    b.addActionListener((ev)->{
      System.out.println( "Geklickt" );
    });
  }
}
          </pre>
        </template>
      </ExampleCode>
    </AccordionTab>
    <AccordionTab header="Wie kann ich zwischen Screens wechseln?">
      <ExampleCode>
        <template v-slot:easy>
          <p>Erzeuge mehrere UI-Klassen. Blende die eine UI-Klasse aus ("hide") und die andere ein ("show"):</p>
          <pre class="code">
onAction(JComponent trigger){
  if ( trigger.actionCommand == "weiter" ){
    Startscreen.hide();
    Spielscreen.show();
  }
  if ( trigger.actionCommand == "zurueck" ){
    Startscreen.show();
    Spielscreen.hide();
  }
}
          </pre>
        </template>
        <template v-slot:normal>
          <p>Erzeuge mehrere UI-Klassen. Blende die eine UI-Klasse aus ("hide") und die andere ein ("show"):</p>
          <pre class="code">
void onAction(JComponent trigger){  
  if ( trigger.actionCommand == "weiter" ){
    startscreen.hide();
    spielscreen.show();
  }
  if ( trigger.actionCommand == "zurueck" ){
    startscreen.show();
    spielscreen.hide();
  }
}
          </pre>
        </template>
        <template v-slot:hard>
          <p>Erzeuge mehrere Frames. Blende das eine Frame aus ("hide") und das andere ein ("show"):</p>
          <pre class="code">
class MyApp{
  public static void main(String[] args){
    JFrame f1=new JFrame();
    JFrame f2=new JFrame();
    JButton b1=new JButton("Weiter");
    f1.add(b1);
    JButton b2=new JButton("Zurück");
    f2.add(b2);
    f2.hide();
    b1.addActionListener((ev)->{
      f1.hide();
      f2.show();
    });
    b2.addActionListener((ev)->{
      f2.hide();
      f1.show();
    });
  }
}
          </pre>
        </template>
      </ExampleCode>
    </AccordionTab>
    <AccordionTab header="Wie verwende ich einen Timer?">
      Einen Timer brauchst du immer dann, wenn etwas in regelmäßigen Abständen immer wieder passieren soll. Das ist vor allem bei Echtzeit-Spielen wichtig.
      <p>Das folgende Beispiel zeigt einen Countdown-Timer:</p>
      <ExampleCode>
        <template v-slot:easy>
          <p>Du musst den Timer starten und die <code>onTimeout</code>-Methode implementieren. Diese Methode wird aufgerufen, wenn der Timer abläuft. Der Timer startet nicht automatisch neu!</p>
          <pre class="code">
int zeit = 10;
onAction(JComponent trigger){
  if ( trigger.actionCommand == "start timer" ){
    //starte den Timer, wenn der Button geklickt wird
    //Timer läuft nach 1000 ms (= 1 Sekunde) ab
    System.time.start(1000);
  }
}
onTimeout(){
  //zeit um 1 verringern:
  zeit--;
  //UI aktualisieren:
  Screen.anzeige.setValue ( zeit );
  //ist die Zeit abgelaufen?
  if ( zeit == 0){
    Sound.beep( 440, 1, 1000);
  }else{
    //Timer erneut starten:
    System.time.start(1000);
  }
}
          </pre>
        </template>
        <template v-slot:normal>
          <p>Du musst den Timer starten und die <code>onTimeout</code>-Methode implementieren. Diese Methode wird aufgerufen, wenn der Timer abläuft. Der Timer startet nicht automatisch neu!</p>
          <pre class="code">
class MyApp{
  int zeit = 10;
  void onAction(JComponent trigger){  
    if ( trigger.actionCommand == "start timer" ){
      //starte den Timer, wenn der Button geklickt wird
      //Timer läuft nach 1000 ms (= 1 Sekunde) ab
      System.time.start(1000);
    }
  }
  void onTimeout(){
    //zeit um 1 verringern:
    zeit--;
    //UI aktualisieren:
    Screen.anzeige.setValue ( zeit );
    //ist die Zeit abgelaufen?
    if ( zeit == 0){
      Sound.beep( 440, 1, 1000);
    }else{
      //Timer erneut starten:
      System.time.start(1000);
    }
  }
}
          </pre>
        </template>
        <template v-slot:hard>
          <p>Verwende eine Instanz der Timer-Klasse:</p>
          <pre class="code">
class MyApp{
  public static void main(String[] args){
    int zeit = 10;
 
    JFrame f = new JFrame();
    JButton bStart = new JButton( "Start Timer" );
    f.add( bStart );
    JButton bStop = new JButton( "Stop Timer" );
    f.add( bStop );
    JLabel anzeige = new JLabel( zeit + "" );
    f.add( anzeige );
    Timer timer;
    timer = new Timer(1000, (ev)->{
      zeit--;
      anzeige.setValue( zeit + "" );
      if( zeit == 0 ){
        timer.stop();
        Sound.beep(440, 1, 1000);
      }
    });
    bStart.addActionListener((ev)->{
      timer.start();
    });
    bStop.addActionListener((ev)->{
      timer.stop();
    });
  }
}
          </pre>
        </template>
      </ExampleCode>
    </AccordionTab>
    <AccordionTab header="Wie kann ich Dateien hoch- oder herunterladen?">
      Das <code>storage</code>-Objekt der <code>System</code>-Klasse stellt dazu zwei Methoden bereit:
      <ul>
        <li>Zum Herunterladen:
          <code class="line">
            System.storage.download( String text, String dateiName );
          </code>
        </li>
        <li>Zum Hochladen:
          <code class="line">
            File f = System.storage.upload( );
          </code>
        </li>
      </ul>
    </AccordionTab>
    <AccordionTab header="Wie kann ich Daten dauerhaft abspeichern (z. B. einen Highscore)?">
      Das <code>storage</code>-Objekt der <code>System</code>-Klasse stellt dazu zwei Methoden bereit. Die Daten werden im Browser des Geräts unter einem bestimmten <code>key</code> gespeichert.
      <ul>
        <li>Zum Abspeichern:
          <code class="line">
            System.storage.setItem( String key, String value);
          </code>
        </li>
        <li>Zum Laden:
          <code class="line">
            String text = System.storage.getItem( String key );
          </code>
        </li>
      </ul>
      
    </AccordionTab>
    <AccordionTab header="Wie kann ich Bilder und Grafiken verwenden?">
      Schau nach unter <Link href="assets/images">Bilder</Link>.
    </AccordionTab>
    <AccordionTab header="Wie kann ich Sounds oder Musik abspielen?">
      Schau nach unter <Link href="assets/sounds">Musik und Sounds</Link>.
    </AccordionTab>
    
  </Accordion>
</template>

<script>
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import ExampleCode from "../../example-code.vue";
import Link from "../../Link.vue";

export default{
  components: {
    Accordion, AccordionTab, ExampleCode, Link
  },
  data(){
    return {
      activeIndex: []
    }
  }
};
</script>