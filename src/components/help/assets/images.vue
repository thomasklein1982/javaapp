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
    <li>Als <Link href="api/jimage">JImage</Link>-Komponente direkt in der UI.</li>
    <li>Mit Hilfe der Methode <code>drawImage</code> oder <code>drawImagePart</code> einer <Link href="api/canvas">Canvas</Link>-Komponente.</li>
    <li>In HTML-Code oder CSS-Code. Hierbei ist zu beachten, dass immer <code>asset(asset-name)</code> geschrieben werden muss:
      <code class="line">
&lt;img src="asset(bild)"/&gt;
      </code>
    </li>
  </ul>
</template>

<script>
import Link from "../../Link.vue";

export default{
  components: { Link }
}
</script>