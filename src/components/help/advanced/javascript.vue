<template>
  <h1>JavaScript</h1>
  <p>Letzten Endes wird dein Java-Code in JavaScript-Code umgewandelt. Auf dieser Seite zeige ich dir, wie du nativen Javascript-Code zwischen deinen Java-Code "schummeln" kannst.</p>
  <p>Um JavaScript-Code zu schreiben, musst du einen speziellen Block-Kommentar in deinen Code schreiben:</p>
  <ExampleCode disable-modes :url="'assets/image_easy'">
<pre class="code">
class JSTest {
  public static void main ( String[] args ) {
    int a = 5;
    
    /*JAVASCRIPT-CODE
    //jetzt kann man JavaScript-Code schreiben, bis der Blockkommentar beendet ist
    
    alert( a )
    a = prompt( "Gib einen neuen Wert für a ein" )
    
    */

    //jetzt sind wir wieder in Java
    System.out.println( a );
  }
}
</pre>
  </ExampleCode>
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