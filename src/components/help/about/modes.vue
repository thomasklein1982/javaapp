<template>
  <h1>Easy - Normal - Hard</h1>
  <p>JavaApp kann in drei verschiedenen Modi betrieben werden, die festlegen, wie genau die syntaktischen und semantischen Vorgaben von Java einghalten werden müssen. Der Modus kann auf der Startseite von JavaApp eingestellt werden.</p>
  <h2>Der harte Modus</h2>
  <p>Dieser Modus versucht, die Vorgaben von Java so exakt wie möglich umzusetzen. Man schreibt also "ganz normalen Java-Code". Einige Abweichungen bleiben aber bestehen:
    <ul>
      <li>Keine Unterscheidung von <code>int</code>, <code>short</code> und <code>long</code>: In einem <code>int</code> können alle ganzen Zahlen bis zu 2<sup>53</sup>-1 gespeichert werden.</li>
      <li>Keine Unterscheidung von <code>double</code> und <code>float</code>: Hier gilt sinngemäß dasselbe.</li>
      <li>Es gibt nur die primitiven Datentypen <code>boolean</code>, <code>int</code>, <code>double</code> und <code>char</code>.</li>
    </ul>
  </p>
  <h2>Der normale Modus</h2>
  <p>Ziel dieses Modus ist, eine Ecken und Kanten von Java abzuschleifen, die für Anfänger*innen schwierig und unnötig kompliziert sind:
    <ul>
      <li>Automatisches Umwandeln primitiver Datentypen und Strings: Jeder primitive Datentyp wird implizit in einen String umgewandelt und anders herum. Es ist also z.B. möglich <code class="line">String s=2;</code> zu schreiben und <code>s</code> erhält dann den Wert <code>"2"</code>. Anders herum gilt das auch, d.h., anstelle von <code class="line">int a = Integer.parseInt("20");</code> kann man <code class="line">int a = "20";</code> schreiben. Bei Problemen wird eine Exception geworfen.</li>
      <li>Strings sind vergleichbar: Strings können mit <code>==</code>, <code>&lt;=</code>, <code>&gt;=</code>, <code>&lt;</code> und <code>&gt;</code> verglichen werden. Es ist kein <code>compareTo</code> erforderlich.</li>
      <li><code>String.charAt</code> liefert einen <code>String</code> zurück: Normalerweise würde ein <code>char</code> zurückgegeben.</li>
      <li>Automatisches Erweitern der Hauptklasse: Die Hauptklasse (die Klasse mit der statischen <code>main</code>-Methode) erbt automatisch von der Klasse <code>JavaApp</code>. Dadurch wird der Lebenszyklus von JavaApp aktiviert.</li>
    </ul>
  </p>
  <h2>Der einfache Modus</h2>
  <p>Dieser Modus nimmt alles aus Java heraus, was für Anfänger*innen keinen Sinn macht. Neben den Erleichterungen des normalen Modus wird zusätzlich folgendes geändert:
    <ul>
      <li>Klassendeklaration wird optional: Die Hauptklasse benötigt keine Klassendeklaration mehr. Man kann direkt Attribute und Methoden deklarieren. Bei allen weiteren Klasse wird die Klassendeklaration weiterhin benötigt.</li>
      <li><code>main</code>-Methode wird optional: Es wird keine <code>main</code>-Methode mehr benötigt. Wenn es keine gibt, wird automatisch die erste Klasse zur Hauptklasse.</li>
      <li>Schlüsselwort <code>void</code> wird optional: Bei Methoden ohne Rückgabe kann auf das Schlüsselwort <code>void</code> verzichtet werden.</li>
      <li>Automatisches Instanziieren von UI-Klassen: Von jeder UI-Klasse wird in der Hauptklasse automatisch eine Instanz erzeugt, die unter dem Namen der Klasse verwendbar ist.</li>
    </ul>
  </p>
  <h2>Vergleich der 3 Modi</h2>
  <p>Der folgende Code zeigt drei Mal dasselbe Programm: Es wird eine UI mit einem Textfeld, einem Button und einem Label erzeugt. Klickt man auf den Button, so wird das Doppelte der eingegebenen Zahl in dem Label angezeigt:
    <h3>Im harten Modus</h3>
<pre class="code">
  class Verdoppeln{
    static JButton button;
    static JTextField eingabe;
    static JLabel ausgabe;

    public static void main( String[] args ){
      //ui erzeugen:
      JFrame frame = new JFrame("1");
      eingabe = new JTextField();
      frame.add(eingabe);
      button = new JButton("Verdoppeln");
      frame.add(button);
      ausgabe = new JLabel("");
      frame.add(ausgabe);
      
      //ActionListener:
      button.addActionListener((ev)->{
        int z = Integer.parseInt( eingabe.getValue() );
        ausgabe.setValue( z * 2 );
      });
    }
  }
</pre>
    <h3>Im normalen Modus</h3>

<pre class="code">
  class Verdoppeln{
    JButton button;
    JTextField eingabe;
    JLabel ausgabe;

    void onStart(){
      //ui erzeugen:
      JFrame frame = new JFrame("1");
      eingabe = new JTextField();
      frame.add(eingabe);
      button = new JButton("Verdoppeln");
      frame.add(button);
      ausgabe = new JLabel("");
      frame.add(ausgabe);
    }

    void onAction(JComponent trigger){
      int z = eingabe.getValue();
      ausgabe.setValue( z * 2 );
    }

    public static void main( String[] args ){
      new Verdoppeln();
    }
  }
</pre>

<h3>Im einfachen Modus</h3>

<pre class="code">
JButton button;
JTextField eingabe;
JLabel ausgabe;

onStart(){
  //ui erzeugen:
  JFrame frame = new JFrame("1");
  eingabe = new JTextField();
  frame.add(eingabe);
  button = new JButton("Verdoppeln");
  frame.add(button);
  ausgabe = new JLabel("");
  frame.add(ausgabe);
}

onAction(JComponent trigger){
  int z = eingabe.getValue();
  ausgabe.setValue( z * 2 );
}
</pre>
  </p>
</template>