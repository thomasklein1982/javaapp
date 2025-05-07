<template>
  <h1>Wer entwickelt Java-App?</h1>
  <p>Mein Name ist Thomas Klein und ich bin Lehrer an der Marienschule in Limburg für Mathematik und Informatik.</p>
  <h2>Links</h2>
  <ul>
    <li><a href="https://github.com/thomasklein1982/javaapp" target="_blank">JavaApp auf GitHub</a></li>
    <li><a href="https://mathe-info.com/javaapp/" target="_blank">JavaApp auf meiner Website <code>mathe-info.com</code></a></li>
  </ul>
  <h2>Weitere Apps</h2>
  <p>Wenn dir JavaApp gefällt, gefallen dir unter Umständen auch andere Apps von mir:</p>
  <Card>
    <template #title>
      Info-Trainer
    </template>
    <template #content>
      Der Info-Trainer enthält viele Aufgaben aus allen möglichen Bereichen der Informatik. Hier kannst du auch Java programmieren!
      <Button as="a" style="text-decoration: none;" size="small" text icon="pi pi-external-link" label="Zum Info-Trainer" href="https://thomaskl.uber.space/Apps/info-trainer/" target="_blank" rel="noopener"/>
    </template>
  </Card>
  <Card>
    <template #title>
      Mathe-Trainer
    </template>
    <template #content>
      Mit dem Mathe-Trainer kann man digitale Arbeitsblätter für den Mathematik-Unterricht zusammenstellen.
      <Button as="a" style="text-decoration: none;" size="small" text icon="pi pi-external-link" label="Zum Mathe-Trainer" href="https://thomaskl.uber.space/Webapps/MatheTrainerV3/latest/" target="_blank" rel="noopener"/>
    </template>
  </Card>
</template>