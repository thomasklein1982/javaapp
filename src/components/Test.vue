<template>
  <div>{{ a }}</div>
  <div>{{ b }}</div>

</template>

<script>

export default{
  props: {
    
  },
  computed: {
    b(){
      console.log("compute b");
      return this.a;
    }
  },
  data(){
    return {
      a: null,
      c: false
    };
  },
  methods: {
    setA(a){
      this.a=a;
      this.c=!this.c;
    }
  }
}

</script>