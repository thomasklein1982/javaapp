<template>
  <h1>Einen Parser für eine Grammatik erzeugen</h1>
  Wenn man einem Projekt eine neue Datei hinzufügt, kann man <em>Peggy-Parser</em> auswählen. In dieser Datei kann man Produktionsregeln für eine Grammatik festlegen. JavaApp generiert daraus unter Verwendung von <a href="https://peggyjs.org/" target="_blank">PeggyJS</a> automatisch einen Parser, der Texte mit dieser Grammatik parsen kann.
  <h2>Beispiel</h2>
  <ol>
    <li>Erstelle ein neues Projekt und wähle <em>App mit Parser</em>.</li>
    <li>Du erhältst 3 Dateien:
      <ul>
        <li><em>Main.java</em> enthält den Programmcode.</li>
        <li><em>UI.java</em> definiert die UI bestehend aus einer TextArea und einem Button.</li>
        <li><em>Sprache.peg</em> enthält die Regeln für eine kontextfreie Grammatik:
<pre style="font-family: monospace; border: 1pt solid white; padding: 0.2rem;">
Programm = (Rechnung BR)*

Rechnung = Zahl _* Op _* Zahl

Zahl = [0-9]+

Op = "+" / "-"

BR = "\n"

_ = " " / "\t"
</pre>
        <li>Einige Erläuterungen dazu:
          <ul>
            <li>Dies definiert die 6 Nicht-Terminalsymbole <code>Programm</code>, <code>Rechnung</code>, <code>Zahl</code>, <code>Op</code>, <code>BR</code> und <code>_</code>.</li>
            <li>Rechts neben den Gleichheitszeichen stehen die Ersetzungen. Terminalsymbole werden in Anführungszeichen geschrieben.</li>
            <li>Ein <code>/</code> steht für eine Alternative (normalerweise als | geschrieben).</li>
            <li><code>*</code> bedeutet "beliebig oft", <code>(Rechnung BR)*</code> bedeutet also "beliebig viele Rechnungen, jeweils gefolgt von einem Zeilenumbruch".</li>
            <li><code>[0-9]</code> steht für eine einzelne Ziffer zwischen 0 und 9.</li>
            <li><code>+</code> bedeutet "mindestens ein mal", <code>[0-9]+</code> bedeutet also "mindestens eine Ziffer".</li>
          </ul>
        </li>
        </li>
      </ul>
    </li>
    <li>Starte das Programm und klicke auf <em>Parsen</em>.</li>
    <li>Es wird dir der AST (abstract syntax tree) des geparsten Ausdrucks angezeigt. In diesem Fall erhältst du als Wurzel das "Programm", das wiederum zwei "Rechnungen" enthält.</li>
    <li>Der AST enthält Methoden, mit denen du den analysierten Code untersuchen kannst. Jeder Knoten im Baum ist entweder ein Array oder ein Objekt mit folgenden Eigenschaften:
      <ul>
        <li>Name: Gibt an, für welches Nicht-Terminalsymbol dieser Knoten steht. Im obigen Beispiel hat die Wurzel den Namen "Programm" und ihre beiden Kinder die Namen "Rechnung".</li>
        <li>Start, End: Gibt die Position im ursprünglichen Quellcode an, wo dieser Knoten beginnt bzw. endet (die Nummerierung beginnt bei 0). Im obigen Beispiel beginnt die Wurzel bei Start = 0 und sie endet bei End = 12.</li>
        <li>Line: Gibt die Nummer der Zeile an, in der dieser Knoten beginnt. Die Nummerierung beginnt bei 1.</li>
      </ul>
    </li>
    <li>Arrays treten dann auf, wenn wegen <code>*</code> oder <code>+</code> mehr als 1 Objekt auftreten kann.</li>
  </ol>
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