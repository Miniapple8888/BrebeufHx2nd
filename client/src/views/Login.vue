<template>
    <div class="container">
        <b-form @submit="onSubmit" v-if="show">
            <b-form-group
            id="email-group"
            label="Email"
            label-for="email">
                <b-form-input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Email"
                required></b-form-input>
            </b-form-group>
            <b-form-group
            id="password-group"
            label="Password"
            label-for="password">
                <b-form-input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Password"
                required></b-form-input>
            </b-form-group>
            <b-form-group id="checkbox-group" v-slot="{ ariaDescribedby }">
                <b-form-checkbox-group
                v-model="form.rememberMe"
                id="remember-me"
                :aria-describedby="ariaDescribedby">
                    <b-form-checkbox value="remember-me">Remember me</b-form-checkbox>
                </b-form-checkbox-group>
            </b-form-group>
            <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
        <div class="container">
          <a href="/forgot">Forgotten your password?</a>
        </div>
        <b-card class="mt-3" header="Form Data Result">
            <pre class="m-0">{{ form }}</pre>
        </b-card>
    </div>
</template>
<script>
import http from '../../http-common';

export default {
  name: 'login',
  data() {
    return {
      form: {
        email: '',
        password: '',
        rememberMe: '',
      },
      show: true,
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      const data = {
        email: this.form.email,
        password: this.form.password,
      };
      console.log(data);
      http.post('/login', data).then((res) => {
        console.log(res);
        console.log(document.cookie);
        alert(res.data.message);
        this.$router.push('/home');
      }).catch((e) => {
        console.log(e);
      });
    },
  },
  created() {
    http.get('/login').then((res) => {
      console.log(res);
    }).catch((e) => {
      console.log(e);
    });
  },
  head: {
    title: {
      inner: 'login',
      separator: ' - ',
      complement: 'langr',
    },
  },
};
</script>
