<template>
    <div>
      <div v-if="errors.length > 0">
          <b-alert show variant="danger">
            <ul>
              <li v-for="error in errors" v-bind:key="error.msg">
                {{ error.msg }}
              </li>
            </ul>
          </b-alert>
        </div>
        <b-form @submit="onSubmit">
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
            <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
    </div>
</template>
<script>
import http from '../../http-common';

export default {
  data() {
    return {
      form: {
        email: '',
      },
      errors: [],
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      http.post('/forgot', { email: this.form.email })
        .then((res) => {
          console.log(res.data);
          if (res.data.errors != null) {
            this.errors = res.data.errors;
          } else {
            // Successfully sent link to email to reset password
            this.$notify({
              group: 'auth',
              type: 'success',
              text: 'Successfully sent link to email to reset password!',
            });
          }
        }).catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
