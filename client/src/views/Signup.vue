<template>
    <div class="container">
      <!-- Need to put this in a component  -->
      <div v-if="errors.length > 0">
        <b-alert show variant="danger">
          <ul>
            <li v-for="error in errors" v-bind:key="error.msg">
              {{ error.msg }}
            </li>
          </ul>
        </b-alert>
      </div>
      <div class="loader" v-if="loading"></div>
        <b-form @submit="onSubmit" v-if="show">
            <fieldset :disabled="loading">
            <b-form-group
            id="firstname-group"
            label="First Name"
            label-for="firstName">
                <b-form-input
                id="firstName"
                v-model="form.firstName"
                type="text"
                placeholder="First Name">
                </b-form-input>
            </b-form-group>
            <b-form-group
            id="lastname-group"
            label="Last Name"
            label-for="lastName">
                <b-form-input
                id="lastName"
                v-model="form.lastName"
                type="text"
                placeholder="Last Name">
                </b-form-input>
            </b-form-group>
            <b-form-group
            id="email-group"
            label="Email"
            label-for="email">
                <b-form-input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Email">
                </b-form-input>
            </b-form-group>
            <b-form-group
            id="password-group"
            label="Password"
            label-for="password">
                <b-form-input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Password">
                </b-form-input>
            </b-form-group>
            <b-form-group
            id="confirmpassword-group"
            label="Confirm Password"
            label-for="confirmPassword">
                <b-form-input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                placeholder="Confirm Password">
                </b-form-input>
            </b-form-group>
            <b-form-group>
              <label for="tags-basic">Type a new interest and press enter</label>
              <b-form-tags input-id="tags-basic" v-model="form.interests"></b-form-tags>
            </b-form-group>
            <b-form-group label="Spoken Language(s)" label-for="tags-component-select">
                <b-button variant="success" v-on:click="addSpokLang">
                  Add new spoken language
                </b-button>
                <b-input-group prepend="Spoken Lang and proficiency" class="mb-2">
                  <b-form-select v-model="spokenLang" :options="spokenLanguages"></b-form-select>
                  <b-form-select v-model="profic" :options="proficiency"></b-form-select>
                </b-input-group>
                <ul>
                  <li v-for="(spLang, index) in spokenLangs"
                  v-bind:key="spLang.id"
                  v-bind:title="spLang.spokenLang+' '+spLang.proficiency">
                  {{ spLang.spokenLang }} : {{ spLang.proficiency }}
                  <b-button variant="danger" v-on:click="removeSpokLang($event, index)">
                    Remove</b-button>
                  </li>
                </ul>
            </b-form-group>
            <b-form-group label="Learning Language (s)" label-for="tags-component-select">
                <!-- Prop `add-on-change` is needed to enable adding tags vie the `change` event -->
                <b-form-tags
                    id="tags-component-select"
                    v-model="learningLanguages"
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
                        <option disabled value="">Choose your learning language (s)...</option>
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
                    <b-form-checkbox value="agreed" unchecked-value="not_agreed">
                        Agree to our Terms & Services
                    </b-form-checkbox>
                </b-form-checkbox-group>
            </b-form-group>
            <b-form-group>
              <b-form-file
              v-model="form.profilepic"
              :state="Boolean(form.profilepic)"
              placeholder="Choose a file or drop it here..."
              drop-placeholder="Drop file here...">
            </b-form-file>
            </b-form-group>
            <b-form-group>
              <b-button type="submit" variant="primary">Create a New Account</b-button>
            </b-form-group>
        </fieldset>
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
        agreeTermsServices: 'not_agreed',
        profilepic: null,
      },
      options: ['French', 'English', 'Spanish'],
      learningLanguages: [],
      errors: [],
      show: true,
      loading: false,
      selected: null,
      spokenLanguages: [
        { value: 'English', text: 'English' },
        { value: 'French', text: 'French' },
        { value: 'Spanish', text: 'Spanish' },
      ],
      proficiency: [
        { value: 'Beginner', text: 'Beginner' },
        { value: 'Intermediate', text: 'Intermediate' },
        { value: 'Advanced', text: 'Advanced' },
      ],
      spokenLangs: [],
      spokenLang: '',
      profic: '',
      spkLangId: 1,
    };
  },
  computed: {
    availableOptions() {
      return this.options.filter((opt) => this.spokenLanguages.indexOf(opt) === -1);
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
        confirmPassword: this.form.confirmPassword,
        interests: this.form.interests,
      };
      this.loading = true;
      http.post('/signup', data).then((res) => {
        if (res.data.errors != null) { // Check for any incoming errors
          this.errors = res.data.errors;
        } else {
          // Send flash notification successfully created account
          this.$notify({
            group: 'auth',
            type: 'success',
            text: 'Successfully created account and sent verification email!',
          });
          // Redirect user to homepage
          this.$router.push('/');
        }
      }).catch((e) => {
        console.log(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    addSpokLang() {
      this.spokenLangs.push({
        id: this.spkLangId,
        spokenLang: this.spokenLang,
        proficiency: this.profic,
      });
      this.spkLangId += 1;
    },
    removeSpokLang(e, index) {
      console.log(index);
      const filtersList = this.spokenLangs.filter((element) => element !== this.spokenLangs[index]);
      this.spokenLangs = filtersList;
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
<style scoped>
.container {
  position: relative;
}
.loader{  /* Loader Div Class */
    position: absolute;
    top:0px;
    right:0px;
    width:100%;
    height:100%;
    background-color:#eceaea;
    background-image: url('../assets/loader.gif');
    background-size: 50px;
    background-repeat:no-repeat;
    background-position:center;
    z-index:10000000;
    opacity: 0.4;
    filter: alpha(opacity=40);
}
</style>
