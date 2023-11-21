<template>
  <Dialog header="Nützliche Links und Apps" v-model:visible="show"  :maximizable="true" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
    <p>Hier findest du Links zu hilfreichen Seiten und Apps.</p>
    <h2>Veröffentlichen von Apps</h2>
    <p>Melde dich bei <a href="https://glitch.com" target="_blank">glitch.com</a> an. Hier kannst du deine Apps und Assets hochladen und veröffentlichen.</p>
    <h2>Assets (Grafiken und Sounds)</h2>
    <p>Auf diesen Seiten findest du freie Assets für deine Programme. Beachte die jeweiligen Lizenzen! In vielen Fällen musst du zumindest den Namen der Person nennen, die die Grafik oder den Sound erstellt hat. Eine Ausnahme sind CC0-Lizenzen, diese Ressourcen darfst du völlig frei nutzen.</p>
    <p>Um die Grafiken zu nutzen, musst du sie möglicherweise in Glitch hochladen und von dort verlinken.</p>
    <h3><a href="https://thomaskl.uber.space/Apps/free-assets/" target="_blank">Free-Assets</a></h3>
    <p>Eine von mit entwickelte App, die viele von mir zusammengesammelte Grafiken und Sounds mit CC0-Lizenz enthält. Wird stetig ergänzt. Du kannst die Grafiken und Sounds direkt von hier verwenden, musst sie also nicht unbedingt woanders hochladen.</p>
    <h3><a href="https://opengameart.org/" target="_blank">OpenGameArt.org</a></h3>
    <p>Eine Seite mit unendlich vielen freien Grafiken. Kann ohne Anmeldung verwendet werden.</p>
    <h3><a href="https://units.wesnoth.org/1.16/mainline/en_US/mainline.html" target="_blank">The Battle for Wesnoth</a></h3>
    <p>Ein Open-Source-Fantasy-Strategiespiel. Die Grafiken und Sounds sind per CC-BY verwendbar, d.h., die Autor:innen müssen genannt werden.</p>
    <h3><a href="https://www.pixilart.com/" target="_blank">Pixilart.com</a></h3>
    <p>Mit dieser App kannst du deine eigenen Pixel-Grafiken erstellen.</p>
    <h3><a href="https://freesound.org/" target="_blank">Freesound.org</a></h3>
    <p>Hier gibt es Tausende freier Sound-Effekte.</p>
    <h3><a href="https://freemusicarchive.org/" target="_blank">FreeMusicArchive.org</a></h3>
    <p>Hier gibt es Tausende freier Musikstücke.</p>
    <h3><a href="https://game-icons.net/" target="_blank">Game-Icons.net</a></h3>
    <p>Hier findest du Tausende von Icons.</p>
  </Dialog>
</template>

<script>
export default {
  data(){
    return {
      show: false,
      
    };
  },
  mounted(){
    
  },
  computed: {
    
  },
  methods: {
    
    setVisible(v){
      this.show=v;
    }
  }
}
</script>