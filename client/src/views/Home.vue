<template>
  <div class="home">
    <div id="landingpage">
    </div>
    <div id="darkenlayer"></div>
    <div id="overlaylayer"></div>
    <div class="container">
      <h1>Connect with users of similar interests and language preferences</h1>
        <b-button>Sign up</b-button>
        &nbsp;
        <b-button>Learn more</b-button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  head: {
    title: {
      inner: 'Home',
      separator: ' - ',
      complement: 'Langr',
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
.container {
  z-index: 4;
  position: relative;
  color: white;
  top: 10em;
}
</style>
