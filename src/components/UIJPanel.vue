<template>
  <div style="position: relative">
    
  </div>
</template>

<script>
  export default{
    props: {
      type: String
    },
    computed: {
      infos(){
        let type=this.type;
        let infos={
          type: "div",
          style: {
          },
          label: type
        }
        if(type==="JButton"){
          infos.type="button";
        }
        if(type==="JLabel"){
          
        }
        if(type==="JPanel"){
          ;
        }
        if(type==="JTextField"){
          infos.type="input";
        }
        if(type==="JTextArea"){
          infos.type="textarea";
        }
        if(type==="DataTable"){
          
        }
        return infos;
      }
    }
  }
</script>

<style scoped>
  .component{
    width: 2cm;
    height: 1cm;
  }
  .jlabel{
    border: 1pt dotted black;
  }
  .datatable{
    border: 1pt solid black;
  }
  .jpanel{
    border: 1pt solid black;
  }
  .datatable{
    width: 2cm;
  }
</style>