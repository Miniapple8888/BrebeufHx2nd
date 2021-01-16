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
    };
  },
  methods: {
    verifyAccount() {
      const { token } = this.$route.params;
      http.post('/verify', { token }).then((res) => {
        // verify whether token is valid
        console.log(res);
        this.verified = res.data.verified;
        alert(res.data.verified);
      }).catch((e) => {
        console.log(e);
      });
    },
  },
  created() {
    this.verifyAccount();
  },
  head: {
    title: {
      inner: 'verify',
      separator: ' - ',
      complement: 'langr',
    },
  },
};
</script>
