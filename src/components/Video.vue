<template>
  <a :href="url" target="_blank">
    <Button rounded icon="pi pi-play" style="vertical-align: baseline"/>
  </a>
</template>

<script>
export default {
  props: {
    url: String
  }
};
</script>