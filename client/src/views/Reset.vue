<template>
    <div>
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
      email: '',
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      // check if both password match
      // secure password sending cross server...
      if (this.email.length > 0) {
        http.post('/reset', { password: this.form.password, email: this.email })
          .then((res) => {
            alert(res.data.message);
          }).catch((e) => {
            console.log(e);
          });
      }
    },
    verifyReset() {
      const { token } = this.$route.params;
      http.post('/verify-reset', { token })
        .then((res) => {
          if (res.data.success) {
            this.email = res.data.email;
          } else {
            // redirect user to home page and tell them invalid token
            alert(res.data.message);
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
