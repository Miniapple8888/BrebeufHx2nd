<template>
    <div v-if="renderComponent">
        <b-navbar toggeable="lg" type="dark" id="navbar" fixed="top">
            <b-navbar-brand href="/">
                <img src="../assets/logo.png" alt="logo" id="logoicon">
                <img src="../assets/langr.png" alt="logo" id="logoname">
            </b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav class="ml-auto">
                    <b-nav-item href="/">Home</b-nav-item>
                    <b-nav-item href="/about">About</b-nav-item>

                    <b-nav-item-dropdown text="Lang" right>
                        <b-dropdown-item href="#">EN</b-dropdown-item>
                        <b-dropdown-item href="#">ES</b-dropdown-item>
                        <b-dropdown-item href="#">RU</b-dropdown-item>
                        <b-dropdown-item href="#">FA</b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-button v-if="!this.authenticated" href="/login">Log in</b-button>
                    &nbsp;
                    <b-button v-if="!this.authenticated" href="/signup" class="btn-primary">
                    Sign up
                    </b-button>
                    <b-button v-if="this.authenticated" href="/logout" v-on:click.prevent="logout">
                    Log out</b-button>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>
<script>
import http from '../../http-common';

export default {
  name: 'Navbar',
  data() {
    return {
      authenticated: false,
      renderComponent: true,
    };
  },
  methods: {
    matchCookie(name) {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      if (match) return match[2];
      return false;
    },
    deleteCookie(name) {
      document.cookie = `${name}=; Max-Age=-999999;`;
    },
    logout() {
      http.post('/logout', { token: this.matchCookie('UserData') })
        .then((res) => {
          // delete cookie client side
          // this.deleteCookie('UserData');
          // redirect home
          console.log(res.data.message);
          this.$notify({
            group: 'auth',
            type: 'success',
            text: 'Successfully logged out!',
          });
          // Todo: avoid redundancy redirecting to home if already at home
          this.$router.push('/');
          Object.assign(this.$data, this.$options.data.call(this)); // re render component
        }).catch((e) => {
          console.log(e);
        });
    },
    reRender() {
      this.renderComponent = false;
      this.$nextTick(() => {
        this.renderComponent = true;
      });
    },
  },
  created() {
    console.log(this.matchCookie('UserData'));
    if (this.matchCookie('UserData')) {
      this.authenticated = true;
    }
  },
  mounted() {
    this.$root.$on('refresh-navbar', () => {
      this.reRender();
    });
    if (this.matchCookie('UserData')) {
      this.authenticated = true;
    }
  },
};
</script>
<style scoped>
#navbar {
    z-index: 100;
    background: #ffffff;
}
#logoicon {
    display: inline-block;
    max-height: 50px;
    max-width: 50px;
    width: auto;
    height: auto;
}
#logoname {
    display: inline-block;
    max-height: 50px;
    max-width: 100px;
    width: auto;
    height: auto;
}
.btn {
    background: #EE8D1C;
    border-radius: 50px;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    display: flex;
    align-items: center;
    text-align: center;
}
</style>
