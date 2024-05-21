<template>
  <div style="padding: 0.5rem; border: 1pt solid white">
    <SelectButton :options="difficulties" option-label="label" option-value="value" v-model="difficulty"/>
    <div>
      <slot></slot>
      <slot v-if="difficulty===0" name="easy"></slot>
      <slot v-if="difficulty===1" name="normal"></slot>
      <slot v-if="difficulty===2" name="hard"></slot>
    </div>
  </div>
</template>

<script>
import SelectButton from "primevue/selectbutton";

export default{
  components: {
    SelectButton
  },
  props: {

  },
  computed: {
    difficultyLabel(){
      return ["Easy","Normal","Hard"][this.difficulty];
    }
  },
  data(){
    return {
      difficulties: [
        {
          label: "Easy",
          value: 0    
        },
        {
          label: "Normal",
          value: 1    
        },
        {
          label: "Hard",
          value: 2    
        },
      ],
      difficulty: this.$root.difficulty
    };
  }
};
</script>