<template>
    <div>
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
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      console.log('I am executed');
      http.post('/forgot', { email: this.form.email })
        .then((res) => {
          // Successfully sent link to email to reset password
          console.log(res.data.message);
          alert(res.data.message);
        }).catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
