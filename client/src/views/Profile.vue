<template>
  <div class="profile">
    <section class="banner">
      <div class="container">
        <h1>User</h1>
      </div>
    </section>
  </div>
</template>
<script>
import http from '../../http-common';

export default {
  created() {
    const { user } = this.$route.params;
    console.log('Requesting for profile', user);
    const data = { requestedUser: user || '' };
    http.post('/profile', data).then((res) => {
      console.log(res);
    });
  },
  head: {
    title: {
      inner: 'Profile',
      separator: ' - ',
      complement: 'Langr',
    },
  },
};
</script>
<style lang="scss" scoped>
  .profile {
    padding-top: 40px;
  }
  .banner {
    text-align: center;
    background-size: cover;
    background-image: url('https://images.ctfassets.net/hrltx12pl8hq/4f6DfV5DbqaQUSw0uo0mWi/ff068ff5fc855601751499d694c0111a/shutterstock_376532611.jpg?fit=fill&w=800&h=300');
    background-position: center;
    background-repeat: no-repeat;
    height: 400px;
  }
  .title {
    vertical-align: bottom;
  }
</style>
