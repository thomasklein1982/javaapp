<template>
  <h1>Bilder</h1>
  <p>Bilder werden in vielen Apps verwendet und können eine App optisch enorm aufwerten. Beachtet aber das Urheberrecht!</p>
  <p>Hier eine Liste von Webseiten mit Bildern:</p>
  <ul>
    <li><a href="https://game-icons.net/" target="_blank">Game-Icons.net</a>: Enthält mehrere Tausend Icons, vor allem für Spiele.</li>
    <li><a href="https://opengameart.org/" target="_blank">OpenGameArt</a>: Tausende von Bildern, Sounds und anderen Assets.</li>
    <li><a href="https://thomaskl.uber.space/Apps/free-assets/" target="_blank">Free-Assets</a>: Eine Seite von mir, auf der ich Bilder und Sounds sammle, die komplett urherrechtsfrei (CC0) sind.</li>
    <li><a href="https://units.wesnoth.org/1.16/mainline/en_US/mainline.html" target="_blank">Battle-for-Wesnoth</a>: Eine Seite über ein PC-Spiel, dessen Assets alle unter einer Creative-Commons-Lizenz stehen (zum aktuellen Zeitpunkt).</li>
  </ul>
  Eine tolle Seite, auf der man selbst Bilder erstellen kann, ist <a href="https://www.pixilart.com/" target="_blank">Pixil-Art.com</a>
  <h2>Bildformate</h2>
  <p>Bilder werden in verschiedenen Formaten gespeichert. Das Format bestimmt die Eigenschaften des Bildes. Es gibt sehr viele Bildformate, die wichtigsten sind:</p>
  <ul>
    <li>JPG: Bilder in diesem Format benötigen weniger Speicherplatz, sie können aber keine transparenten Bereiche enthalten.</li>
    <li>PNG: Dieses Format unterstützt Transparenz, benötigt aber mehr Speicherplatz.</li>
    <li>GIF: Ein GIF besteht aus mehreren Bildern, die schnell hintereinander abgespielt werden. Super geeignet für Animationen.</li>
  </ul>
  <p>JavaApp unterstützt alle Bildformate, die vom Browser unterstützt werden.</p>
  <h2>Verwenden von Bildern</h2>
  <p>Es gibt prinzipiell drei mögliche Arten, Bilder in JavaApp zu verwenden:</p>
  <ul>
    <li>Als <Link href="api/jimage">JImage</Link>-Komponente direkt in der UI. Ein <code>JImage</code> sollte immer von einem <Link href="api/canvas">Canvas</Link> umgeben sein, damit die Maße des Bildes festlegt werden können.</li>
    <li>Mit Hilfe der Methode <code>drawImage</code> oder <code>drawImagePart</code> einer <Link href="api/canvas">Canvas</Link>-Komponente.</li>
    <li>In HTML-Code oder CSS-Code. Hierbei ist zu beachten, dass immer <code>asset(asset-name)</code> geschrieben werden muss:
      <code class="line">
&lt;img src="asset(bild)"/&gt;
      </code>
    </li>
  </ul>
  <h3>Beispiel: Zwischen verschiedenen Bildern wechseln</h3>
  Das folgende Beispiel zeigt, wie man ein JImage verwenden kann, um ein Bild anzuzeigen und wie man das Bild verändern kann.
  <ExampleCode :url="['assets/image_easy','assets/image_normal','assets/image_hard']">
    <template v-slot:easy>
<pre class="code">
int position;

onStart( ) {
  //wir starten außen:
  position=1;
}

onAction( JComponent trigger ) {
  //gehe von außen nach innen oder umgekehrt:
  if(position==1){
    Screen.bild.setValue("Haus");
    position=2;
    return;
  }
  if(position==2){
    Screen.bild.setValue("Landschaft");
    position=1;
    return;
  }
}
</pre>
Außerdem benötigst du eine UI-Klasse mit einem Button und einem JImage. Es müssen zwei Bilder mit den Namen "Landschaft" und "Haus" als Assets hochgeladen werden.
    </template>
    <template v-slot:normal>
<pre class="code">
class Bilder{
  Screen screen;
  int position;
  void onStart(){
    screen = new Screen();
    //wir starten außen:
    position = 1;
  }
  void onAction(){
    //gehe von außen nach innen oder umgekehrt:
    if(position==1){
      screen.bild.setValue("Haus");
      position=2;
      return;
    }
    if(position==2){
      screen.bild.setValue("Landschaft");
      position=1;
      return;
    }
  }
  public static void main(String[] args){
    new Bilder();
  }
}
</pre>
Außerdem benötigst du eine UI-Klasse mit einem Button und einem JImage. Es müssen zwei Bilder mit den Namen "Landschaft" und "Haus" als Assets hochgeladen werden.
    </template>
    <template v-slot:hard>
<pre class="code">
class Bilder{

  static JImage bild;
  static JButton wechselButton;
  
  static void createUI(){
    JFrame frame = new JFrame();
    frame.setLayout("1fr 1cm/");
    bild = new JImage("Landschaft");
    frame.add(bild);
    wechselButton=new JButton("Bild ändern");
    frame.add(wechselButton);
  }
  
  public static void main(String[] args){
    createUI();
    
    //Variable position gibt an, wo wir uns befinden:
    //1: außen (hier geht es los)
    //2. innen
    int position=1;
    wechselButton.addActionListener((ev)->{
      //gehe von außen nach innen oder umgekehrt:
      if(position==1){
        bild.setValue("Haus");
        position=2;
        return;
      }
      if(position==2){
        bild.setValue("Landschaft");
        position=1;
        return;
      }
    });
  }
}
</pre>
Es müssen zwei Bilder mit den Namen "Landschaft" und "Haus" als Assets hochgeladen werden.
    </template>
  </ExampleCode>
</template>

<script>
import Link from "../../Link.vue";
import ExampleCode from "../../example-code.vue";

export default{
  components: { Link, ExampleCode }
}
</script>