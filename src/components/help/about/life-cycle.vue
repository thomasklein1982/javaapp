<template>
  <h1>Lebenszyklus einer JavaApp</h1>
  Wenn eine mit JavaApp erstellte App gestartet wird, geschieht das folgende:
  <Accordion multiple :value="[0]">
    <AccordionPanel value="0">
      <AccordionHeader>
        1. Datenbank wird erzeugt
      </AccordionHeader>
      <Accordion-Content>
        Sofern man eine Datenbank definiert hat (Projekt &rarr; Datenbank), wird der entsprechende SQL-Code ausgeführt bzw. die per UI angelegten Relationen erzeugt. Dabei wird das In-Memory-Datenbank-System <a href="https://github.com/sql-js" target="_blank">SQL.JS</a> verwendet.
      </Accordion-Content>
    </AccordionPanel>
    <AccordionPanel value="1">
      <AccordionHeader>
        2. Assets werden geladen
      </AccordionHeader>
      <Accordion-Content>
        Sofern man mindestens ein Asset hinzugefügt hat (Project &rarr; Assets), wird zu jedem Asset (das intern als DataURL gespeichert wird) ein entsprechendes "gebrauchsfertiges" Objekt erzeugt. Bilder werden bspw. zu Image-Objekten und Sounds zu Audio-Objekten.
      </Accordion-Content>
    </AccordionPanel>
    <AccordionPanel value="2">
      <AccordionHeader>
        3. Main-Objekt wird instanziiert (nur bei Instanz-Main-Methode)
      </AccordionHeader>
      <Accordion-Content>
        JavaApp erlaubt die Verwendung von <a href="https://openjdk.org/jeps/445" target="_blank">Instanz-Main-Methoden und Unbenannten Klassen</a>. Falls die App eine Instanz-Main-Methode implementiert (d.h., eine nicht-statische Main-Methode), so wird an dieser Stelle ein Objekt namens <code>$main</code> erzeugt mit der Klasse, die die Main-Methode enthält ("Main-Klasse" genannt). Als Folge davon wird an dieser Stelle der Konstruktor der Main-Klasse aufgerufen.
      </Accordion-Content>
    </AccordionPanel>
    <AccordionPanel value="3">
      <AccordionHeader>
        4. UI-Klassen werden instanziiert
      </AccordionHeader>
      <Accordion-Content>
        <p>Eine UI-Klasse ist eine spezielle Klasse, die immer von <code>JFrame</code> erbt. Jede UI-Klasse ist also ein JFrame, d.h. ein eigener "Screen" in der App. Wenn man bspw. "Tetris" programmieren wollte, könnte es eine UI-Klasse für das Startmenü geben, eine für das eigentliche Spiel und eine für den Game-Over-Screen.</p>
        <p>Das UI-Konzept von JavaApp orientiert sich äußerlich an Java-Swing, intern werden aber passende HTML-Elemente mit zugehörigem CSS generiert. Im Gegensatz zum "normalen Java", wo man mehrere Fenster nebeneinander erzeugen kann, gibt es bei JavaApp immer nur ein Frame, das aktuell sichtbar ist und automatisch den gesamten Bildschirm (genauer: das gesamte Browser-Fenster) ausfüllt.</p>
        <p>Anstelle der unflexiblen Layout-Manager nutzt JavaApp <a href="https://css-tricks.com/snippets/css/complete-guide-grid/" target="_blank">CSS-Grid</a> für das Layout der Komponenten. Die UI-Klasse selbst wie auch die <code>JPanel</code>-Komponenten besitzen ein Attribut <code>layout</code>, das prinzipiell dem Wert der CSS-Eigenschaft <code>grid-template</code> entspricht. Ein Wert von <code>1fr 2fr/</code> erzeugt bspw. ein Layout mit zwei Spalten, von denen die zweite doppelt so breit ist wie die erste. Zusätzlich zu solchen Strings ist als Wert auch eine einzelne Zahl (z. B. "3") zulässig. Dies wird intern in <code>1fr 1fr 1fr</code> geändert, sodass drei gleich breite Spalten entstehen.</p>
        <p>Alternativ zu den Panels kann auch die <code>Canvas</code>-Komponente verwendet werden. Diese spezifiziert ein eigenes pixelunabhängiges Koordinatensystem und erlaubt das absolute Positionieren von Komponenten sowie Zeichenbefehle.</p>
        <p>Die Komponenten haben einen <em>Wert</em> (bzw. <em>value</em>). Je nach Komponente bedeutet der Wert etwas anderes:
        <ul>
          <li><Link href="api/JLabel">JLabel</Link> und <Link href="api/JButton">JButton</Link>: Der angezeigte Text. Kann beliebiger HTML-Code sein!</li>
          <li><Link href="api/JTextField">JTextField</Link> und <Link href="api/JTextArea">JTextArea</Link>: Der eingegebene Text.</li>
          <li><Link href="api/JComboBox">JComboBox</Link>: Der Text des aktuell ausgewählten Items.</li>
          <li><Link href="api/JImage">JImage</Link>: Die URL zu dem Bild bzw. der Name des Assets.</li>
        </ul>
        </p>
        <p>Es ist möglich, Komponenten einen Namen zu geben bzw. einem Array zuzuordnen. Dies erzeugt ein entsprechendes Attribut, über das auf die Komponente in der Programmierung zugegriffen werden kann.</p>
      </Accordion-Content>
    </AccordionPanel>
    <AccordionPanel value="4">
      <AccordionHeader>
        5. Main-Methode wird ausgeführt
      </AccordionHeader>
      <Accordion-Content>
        Nun wird die Main-Methode ausgeführt.
      </Accordion-Content>
    </AccordionPanel>
    <AccordionPanel value="1">
      <AccordionHeader>
        6. Warten auf Ereignisse
      </AccordionHeader>
      <Accordion-Content>
        Wenn die Main-Methode vollständig abgearbeitet wurde, wartet die App darauf, auf Ereignisse zu reagieren.
        <p>Die entsprechenden Ereignis-Routinen können über die Methode <code>addActionListener</code> bzw. <code>addEventListener</code> definiert werden. Dabei verwendet man am besten <a href="https://javabeginners.de/Klassen_und_Interfaces/Lambda_Ausdruecke.php" target="_blank">Lambda-Ausdrücke</a>.</p>
        <p>Alternativ werden von JavaApp automatisch bestimmte Methoden zu Ereignis-Routinen gemacht. Dies sind z. B.:</p>
        <ul>
          <li><code>void onAction(JComponent trigger)</code>: Diese Methode wird automatisch aufgerufen, wenn der User mit einer UI-Komponente interagiert. Standardmäßig lösen nur Button-Klicks die Methode aus, es kann aber jede Komponente enabled werden, diese Methode bei Interaktion auszuführen.
          <p>Der Parameter <code>trigger</code> ist die Komponente, die das Ereignis ausgelöst hat.</p></li>
          <li><code>void onGamepad( String button )</code>: Wird aufgerufen, wenn ein Button eines virtuellen Gamepads gedrückt oder losgelassen wird.</li>
          <li><code>void onNextFrame( )</code>: Wird etwa 60 mal pro Sekunde aufgerufen, genauer gesagt: Die Methode wird immer dann aufgerufen, wenn der Bildschirm neu gezeichnet wird. Diese Methode fungiert in Echtzeit-Spielen als <a href="https://de.wikipedia.org/wiki/Game_Loop" target="_blank">Game-Loop</a>.</li>
        </ul>
      </Accordion-Content>
    </AccordionPanel>
  </Accordion>
  

</template>

<script>
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Link from '../../Link.vue';

export default{
  components: {
    Accordion, AccordionHeader, AccordionContent, AccordionPanel, Link
  }
}
</script>