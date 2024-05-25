<template>
  <h1>Schriftarten</h1>
  <p>In diesem Artikel erfährst du, wie du eine Schriftart in deiner App verwenden kannst.</p>
  <h2>Schriftart-Datei herunterladen</h2>
  <p>Zuerst musst du eine Schriftart finden, die dir gefällt. Es gibt sehr viele Webseiten, auf denen man Schriftarten für nicht-kommerzielle Zwecke kostenfrei herunterladen kann. Einige davon sind
    <ul>
      <li><a target="_blank" href="https://fonts.google.com/">Google Web Fonts</a></li>
      <li><a target="_blank" href="https://www.dafont.com/de/">dafont.com</a></li>
      <li><a target="_blank" href="https://www.1001freefonts.com/">1001freefonts.com</a></li>
    </ul>
  </p>
  <p>Anschließend musst du die Schriftart herunterladen. In den meisten Fällen erhältst du zunächst ein ZIP-Archiv, das mehrere Dateien enthält. Suche in dem ZIP-Archiv nach einer TTF- oder OTF-Datei.</p>
  <h2>Schriftart-Datei als Asset hochladen</h2>
  <p>Klicke auf "Projekt &rarr; Assets", um den Asset-Manager zu öffnen. Lade dann deine Schritart-Datei hoch.</p>
  <h2>Neue Schriftart in CSS definieren</h2>
  <p>Damit du die neue Schriftart verwenden kannst, benötigst du CSS. Klicke dazu auf "Projekt &rarr; CSS". Es öffnet sich der CSS-Editor.</p>
  <p>Schreibe folgenden CSS-Code, um deine Schritart in der gesamten App anzuwenden:
    <pre class="code">
@font-face{
  font-family: MyFont;
  src: asset(NAME DEINER FONT ALS ASSET);
}
body{
  font-family: MyFont;
}
    </pre>
  </p>
  <p>Wenn nur einzelne Elemente in der Schriftart gestylt werden sollen, kann man statt der <code>body</code>-Regel auch einzelnen Komponenten die CSS-Regel <code>font-family: MyFont;</code> geben.</p>
  <h2>Beispiel</h2>
  Das folgende Beispiel zeigt die Verwendung der Schriftart DancingScript von Google Web Fonts:
  <ExampleCode :url="['assets/fonts_easy','assets/fonts_normal','assets/fonts_hard']">
  </ExampleCode>
</template>

<script>
import Link from "../../Link.vue";
import ExampleCode from "../../example-code.vue";

export default{
  components: { Link, ExampleCode }
}
</script>