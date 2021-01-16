<template>
    <div class="container">
        <b-form @submit="onSubmit" v-if="show">
            <b-form-group
            id="firstname-group"
            label="First Name"
            label-for="firstName">
                <b-form-input
                id="firstName"
                v-model="form.firstName"
                type="text"
                placeholder="First Name"
                required
                :state="firstNameValidation"
                aria-describedby="firstname-help-block">
                </b-form-input>
                <b-form-text id="firstname-help-block">
                    Your first name must be 2-20 characters long and contain only letters.
                </b-form-text>
                <b-form-invalid-feedback :state="firstNameValidation">
                    Your first name must be 2-20 characters long and contain only letters.
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="firstNameValidation">
                    Looks Good.
                </b-form-valid-feedback>
            </b-form-group>
            <b-form-group
            id="lastname-group"
            label="Last Name"
            label-for="lastName">
                <b-form-input
                id="lastName"
                v-model="form.lastName"
                type="text"
                placeholder="Last Name"
                required
                :state="lastNameValidation"
                aria-describedby="lastname-help-block">
                </b-form-input>
                <b-form-text id="lastname-help-block">
                    Your last name must be 2-20 characters long and contain only letters.
                </b-form-text>
                <b-form-invalid-feedback :state="lastNameValidation">
                    Your last name must be 2-20 characters long and contain only letters.
                </b-form-invalid-feedback>
                <b-form-valid-feedback :state="lastNameValidation">
                    Looks Good.
                </b-form-valid-feedback>
            </b-form-group>
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
                required
                aria-describedby="password-help-block">
                </b-form-input>
                <b-form-text id="password-help-block">
                    Your password must be 8-20 characters long,
                    contain letters and numbers, and must not
                    contain spaces, special characters, or emoji.
                </b-form-text>
            </b-form-group>
            <b-form-group
            id="confirmpassword-group"
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
            <label for="tags-basic">Type a new interest and press enter</label>
            <b-form-tags input-id="tags-basic" v-model="form.interests"></b-form-tags>
            <p class="mt-2">Value: {{ form.interests }}</p>
            <b-form-group label="Tagged input using select" label-for="tags-component-select">
                <!-- Prop `add-on-change` is needed to enable adding tags vie the `change` event -->
                <b-form-tags
                    id="tags-component-select"
                    v-model="spokenLanguages"
                    size="lg"
                    class="mb-2"
                    add-on-change
                    no-outer-focus
                >
                    <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                    <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
                        <li v-for="tag in tags" :key="tag" class="list-inline-item">
                        <b-form-tag
                            @remove="removeTag(tag)"
                            :title="tag"
                            :disabled="disabled"
                            variant="info"
                        >{{ tag }}</b-form-tag>
                        </li>
                    </ul>
                    <b-form-select
                        v-bind="inputAttrs"
                        v-on="inputHandlers"
                        :disabled="disabled || availableOptions.length === 0"
                        :options="availableOptions"
                    >
                        <template #first>
                        <!-- This is required to prevent bugs with Safari -->
                        <option disabled value="">Choose a language...</option>
                        </template>
                    </b-form-select>
                    </template>
                </b-form-tags>
            </b-form-group>
            <b-form-group id="checkbox-group" v-slot="{ ariaDescribedby }">
                <b-form-checkbox-group
                v-model="form.agreeTermsServices"
                id="agree-terms-services"
                :aria-describedby="ariaDescribedby">
                    <b-form-checkbox value="agree-terms-services">
                        Agree to our Terms & Services
                    </b-form-checkbox>
                </b-form-checkbox-group>
            </b-form-group>
            <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
        <b-card class="mt-3" header="Form Data Result">
            <pre class="m-0">{{ form }}</pre>
        </b-card>
    </div>
</template>
<script>
import http from '../../http-common';

export default {
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        interests: [],
        agreeTermsServices: '',
      },
      options: ['French', 'English', 'Spanish'],
      spokenLanguages: [],
      show: true,
    };
  },
  computed: {
    availableOptions() {
      return this.options.filter((opt) => this.spokenLanguages.indexOf(opt) === -1);
    },
    firstNameValidation() {
      return this.form.firstName.length > 1 && this.form.firstName.length < 21;
    },
    lastNameValidation() {
      return this.form.lastName.length > 1 && this.form.lastName.length < 21;
    },
    confirmPasswordValidation() {
      return this.form.confirmPassword === this.form.password;
    },
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();

      const data = {
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        email: this.form.email,
        password: this.form.password,
      };
      http.post('/signup', data).then((res) => {
        console.log(res);
        alert(res.data.message);
      }).catch((e) => {
        console.log(e);
      });
    },
  },
  head: {
    title: {
      inner: 'signup',
      separator: ' - ',
      complement: 'langr',
    },
  },
};
</script>
