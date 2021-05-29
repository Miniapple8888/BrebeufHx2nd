<template>
  <div>
        <h1 v-if="this.verified">
            Your email has been successfully verified! You may now log in.
        </h1>
        <h1 v-else>
            Invalid or expired verification token. Sign up again!
        </h1>
    </div>
</template>
<script>
import http from '../../http-common';

export default {
  data() {
    return {
      verified: false,
      loading: true,
    };
  },
  methods: {
    verifyAccount() {
      const { token } = this.$route.params;
      console.log('Sent.');
      this.loading = true;
      http.post('/verify', { token }).then((res) => {
        // verify whether token is valid
        console.log(res.data.verified);
        this.verified = res.data.verified;
        this.loading = false;
      }).catch((e) => {
        console.log(e);
      });
    },
  },
  beforeMount() {
    this.verifyAccount();
  },
  head: {
    title: {
      inner: 'Verify',
      separator: ' - ',
      complement: 'Langr',
    },
  },
};
</script>
<style scoped>
.container {
  position: relative;
}
.loader{  /* Loader Div Class */
    position: absolute;
    top:50px;
    right:50px;
    width:100%;
    height:100%;
    background-position:center;
    z-index:10000000;
    opacity: 1.0;
}
</style>
