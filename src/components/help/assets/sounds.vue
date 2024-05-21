<template>
  <h1>Sound und Musik</h1>
  <p>Wichtig: Sounds kann man nur abspielen, nachdem der User mindestens einmal mit der App interagiert hat, also z. B., wenn er einen Button geklickt hat. Andernfalls verhindert der Browser das Abspielen.</p>
  <p>Schau dir das Video an:
    <Video url="https://youtu.be/bV7nI4JMU1E"></Video>
  </p>  
  <h2>Beep</h2>
  <p>Um einen einfachen "Beep"-Sound abzuspielen, benötigt man kein Asset, sondern nur eine einzelne Zeile Code:</p>
  <code class="line">
    Sound.beep( 440, 1, 1000 );
  </code>
  <p>Die Anweisung <code class="line">Sound.beep( frequenz, lautstaerke, dauer[, typ] )</code> spielt einen einzelnen Ton ab:</p>
  <ul>
    <li><code>frequenz (int)</code>: Frequenz des Tones in Hz. Bestimmt die Tonhöhe. Kammerton A entspricht <code>440</code>.</li>
    <li><code>lautstaerke (double)</code>: Von <code>0.0</code> (muted) bis <code>1.0</code> (volle Lautstärke)</li>
    <li><code>dauer (int)</code>: In Millisekunden</li>
    <li><code>typ (String, optional)</code>: Ein Wert aus <code>"sine"</code>, <code>"square"</code>, <code>"sawtooth"</code> oder <code>"triangle"</code>. Mehr Infos gibt es <a href="https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/type" target="_blank">hier</a>.</li>
  </ul>
  <h3>Komplettbeispiel:</h3>
  <ExampleCode>
    <template v-slot:easy>
<pre class="code">
onAction(){
  Sound.beep(440, 1, 1000);
}
</pre>
Außerdem benötigst du eine UI-Klasse mit einem Button.
    </template>
    <template v-slot:normal>
<pre class="code">
class MyApp{
  void onStart(){
    JFrame frame = new JFrame();
    JButton b = new JButton("Beep!");
    frame.add(b);
  }
  void onAction(){
    Sound.beep(440, 1, 1000);
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
    JFrame frame = new JFrame();
    JButton b = new JButton("Beep!");
    frame.add(b);
    b.addActionListener((e)->{
      Sound.beep(440, 1, 1000);
    });
  }
}
</pre>
    </template>
  </ExampleCode>
  <h2>MP3-Dateien</h2>
  <p>Warnung: Sound- und Musikdateien tendieren dazu, relativ groß zu sein. Verwende vor allem kurze Clips.</p>
  <p>Um beliebigen Sound oder Musik abzuspielen, sind die folgenden Schritte notwendig:</p>
  <ol>
    <li>Eine passende Sound-Datei herunterladen: Achte auf das Urheberrecht!</li>
    <li>Die Sound-Datei als Asset hochladen</li>
    <li>Im Programmcode besteht die Verwendung aus zwei Schritten:
      <ol>
        <li>Erzeugen eines neuen Sounds:
<pre class="code">
Sound klang;
...
klang = new Sound("Name des Assets");
</pre>
        </li>
        <li>Abspielen des Sounds:
          <code class="line">klang.play( );</code>
        </li>
      </ol>
    </li>
  </ol>
  <h3>Komplettbeispiel</h3>
  Zur Vorbereitung muss zunächst eine Sound-Datei als Asset hochgeladen werden:
  <ol>
    <li>Lade die folgende Sound-Datei herunter: <audio src="https://thomaskl.uber.space/Webapps/Assets/sounds/spell.mp3" controls></audio></li>
    <li>Lade die Sound-Datei als Asset hoch</li>
  </ol>
  <ExampleCode>
    <template v-slot:easy>
      <pre class="code">
Sound spellSound;
onStart(){
  spellSound = new Sound("spell");
}
onAction(){
  spellSound.play();
}
</pre>
    </template>
    <template v-slot:normal>
      <pre class="code">
class MyApp{
  Sound spellSound;
  void onStart(){
    JFrame frame = new JFrame();
    JButton b = new JButton("Beep!");
    frame.add(b);
    spellSound = new Sound("spell");
  }
  void onAction(){
    spellSound.play();
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
    Sound spellSound  = new Sound("spell");
    JFrame frame = new JFrame();
    JButton b = new JButton("Beep!");
    frame.add(b);

    b.addActionListener((e)->{
      spellSound.play();
    });
  }
}
</pre>     
    </template>
  </ExampleCode>
</template>

<script>
import Video from "../../Video.vue";
import ExampleCode from "../../example-code.vue";

export default{
  components: {
    Video, ExampleCode
  }
};
</script>