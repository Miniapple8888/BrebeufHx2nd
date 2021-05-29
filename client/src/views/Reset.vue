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
            id="password-group"
            label="New Password"
            label-for="password">
                <b-form-input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="New Password"
                required></b-form-input>
            </b-form-group>
            <b-form-group
            id="confirm-password-group"
            label="Confirm Password"
            label-for="confirmPassword">
                <b-form-input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                placeholder="Confirm Password"
                :state="confirmPasswordValidation"
                required></b-form-input>
                <b-form-invalid-feedback :state="confirmPasswordValidation">
                    Both passwords must match!
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="confirmPasswordValidation">
                    Looks Good.
                </b-form-valid-feedback>
            </b-form-group>
            <b-button type="submit" variant="primary">Reset Password</b-button>
        </b-form>
    </div>
</template>
<script>
import http from '../../http-common';

export default {
  data() {
    return {
      form: {
        password: '',
        confirmPassword: '',
      },
      errors: [],
      email: '',
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      // check if both password match
      // secure password sending cross server...
      http.post('/reset', { password: this.form.password, email: this.email, confirmPassword: this.form.confirmPassword })
        .then((res) => {
          if (res.data.errors != null) {
            this.errors = res.data.errors;
          } else {
          // Notify user successfully reset password
            console.log(res.data.message);
            this.$notify({
              group: 'auth',
              type: 'success',
              text: 'Successfully reset password!',
            });
            this.$route.push('/login');
          }
        }).catch((e) => {
          console.log(e);
        });
    },
    verifyReset() {
      const { token } = this.$route.params;
      http.post('/verify-reset', { token })
        .then((res) => {
          if (res.data.valid) {
            this.email = res.data.email;
          } else {
            // redirect user to home page and tell them invalid token
            console.log(res.data.error);
            this.$notify({
              group: 'auth',
              type: 'error',
              text: 'Invalid token',
            });
            this.$router.push('/');
          }
        }).catch((e) => {
          alert(e);
        });
    },
  },
  computed: {
    confirmPasswordValidation() {
      return this.form.password === this.form.confirmPassword;
    },
  },
  created() {
    this.verifyReset();
  },
};
</script>
