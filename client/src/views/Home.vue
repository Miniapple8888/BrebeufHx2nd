<template>
  <div class="home">
    <div id="landingpage">
    </div>
    <div id="darkenlayer"></div>
    <div id="overlaylayer"></div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  head: {
    title: {
      inner: 'signup',
      separator: ' - ',
      complement: 'langr',
    },
  },
};
</script>
<style scoped>
#landingpage {
  position: absolute;
  top: 0px;
  width: 100%;
  min-height: 665px;
  max-height: 100vh;
  background: url('../assets/landingpagebg.jpg');
  z-index: 1;
}
#darkenlayer {
  position: absolute;
  width: 100%;
  min-height: 665px;
  max-height: 100vh;
  background: #8a8484;
  mix-blend-mode: darken;
  opacity: 0.25;
  z-index: 2;
}
#overlaylayer {
  position: absolute;
  background: rgba(4, 20, 57, 0.5);
  /*mix-blend-mode: overlay;*/
  width: 100%;
  min-height: 665px;
  max-height: 100vh;
  z-index: 3;
}
</style>
