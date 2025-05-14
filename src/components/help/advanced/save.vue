<template>
  <h1>Speichern und Laden</h1>
  <p>Wenn deine App neu gestartet wird, hat sie alles vergessen, was bei der letzten Verwendung passiert ist. Manchmal möchte man, dass sich die App einige Dinge "merkt" und sich beim nächsten Start wieder daran erinnert.</p>
  <p>Das prinzipielle Vorgehen sieht folgendermaßen aus:</p>
  <ol>
    <li>Deklariere eine globale Variable und speichere darin ein neues Objekt der Klasse <code>Storage</code>: <pre class="code">Storage store = new Storage("Name meiner App");</pre></li>
    <li>Prüfe bei Programmstart, ob ein bestimmter Key im Store vorhanden ist. Falls ja, lies die gespeicherten Werte aus. <pre class="code">if ( store.hasKey( "..." ) ){
  String s = store.load( "..." );
  //mache etwas mit dem geladenen Wert
}</pre></li>
    <li>Speichere einen Wert im Store unter einem bestimmten Key (z. B., wenn ein Save-Button geklickt wird): <pre class="code">store.save( "...", wert );</pre>
    </li>
  </ol>
  <h2>Beispiel 1: Speichern eines HighScore</h2>
  <p>Bei einem einfachen Spiel muss man einen Button anklicken und erhält für jeden Klick einen Punkt. Die beste erreichte Punktzahl wird als Hghscore gespeichert:</p>
<pre class="code">
Storage store = new Storage("Klick-Spiel");
String KEY_HIGHSCORE = "highscore";
int highscore = 0;
int score = 0;
JLabel label_score;


void main ( ){
  if ( store.hasKey( KEY_HIGHSCORE) ){
    String s = store.load( KEY_HIGHSCORE );
    highscore = Integer.parseInt ( s );
  }
  createUI( );
}

void increaseScore(){
  score++;
  if( score > highscore ){
    highscore = score;
    store.save( KEY_HIGHSCORE, highscore + "" );
  }
}

void createUI(){
  JFrame f = new JFrame("1");
  JButton b = new JButton(" Klick mich! ");
  f.add( b );
  label_score = new JLabel( "0" );
  f.add( label_score );
  b.addActionListener( (ev)->{
    increaseScore( );
  });
}
</pre>

<h2>Beispiel 2: Ein Array speichern und wiederherstellen</h2>
<p>Manchmal muss eine App viele Daten speichern, z. B. eine Liste von Wörter.</p>
<p>In diesem Fall hilft die Methode <pre class="code">String.join( ";", array )</pre>, die ein Array von Strings zu einem einzigen String zusammenfassen kann. Dieser String kann dann gespeichert werden.</p>
<p>Beim Laden konvertiert man den geladenen String <code>s</code> mit der Methode <pre class="code">s.split(";")</pre> wieder in ein Array.</p>
<p>Hier kommt der komplette Code:</p>
<pre class="code">
Storage store = new Storage( "Wortliste" );
String KEY_WORDS = "words";
String KEY_WORDCOUNT = "wordcount";

String[ ] words = new String[ 10 ];
int wordcount = 0;

JLabel label_words;
JTextField input;

void main( ) {
  createUI( );
  if ( store.hasKey( KEY_WORDS ) ) {
    String s = store.load( KEY_WORDS );
    words = s.split( ";" );
    s = store.load( KEY_WORDCOUNT );
    wordcount = Integer.parseInt( s );
  }
  updateList( );
}

void addWord( String w ) {
  words[ wordcount ] = w;
  wordcount++;
  updateList( );
  saveData( );
}

void saveData( ) {
  String s = String.join( ";", words );
  store.save( KEY_WORDS, s );
  store.save( KEY_WORDCOUNT, wordcount + "" );
}

void updateList( ) {
  String s = String.join( "; ", words );
  label_words.setValue( s );
}

void clearData( ) {
  store.removeAll( );
  words = new String[ words.length ];
  wordcount = 0;
  updateList( );
}

void createUI( ) {
  JFrame f = new JFrame( "1" );
  label_words = new JLabel( "" );
  f.add( label_words );
  input = new JTextField( );
  f.add( input );
  JButton add = new JButton( "+" );
  f.add( add );
  JButton clear = new JButton( "🗑" );
  f.add( clear );
  add.addActionListener( ( ev ) -> {
    addWord( input.getValue( ) );
  } );
  clear.addActionListener( ( ev ) -> {
    clearData( );
  } );
}
</pre>

</template>

<script>
import ExampleCode from "../../example-code.vue";
import Link from "../../Link.vue";

export default{
  components: {
    ExampleCode, Link
  },
  data(){
    return {
    };
  }
};
</script>