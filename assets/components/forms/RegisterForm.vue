<template>
  <div>
    <v-alert
        type="success"
        dismissible
        v-if="response"
    ><p>You are successful registered</p>
      <p><router-link to="/login">You can login here</router-link></p>
    </v-alert>
    <v-alert
        type="error"
        dismissible
        v-if="error"
    >Whoops! Something went wrong!</v-alert>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
    >
      <v-text-field
          v-model="email"
          :rules="[ rules.required, rules.emailRules ]"
          label="E-mail"
          required
      ></v-text-field>

      <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="showPassword ? 'text' : 'password'"
          name="password"
          label="Password"
          autocomplete="off"
          hint="At least 8 characters"
          counter
          @click:append="showPassword = !showPassword"
      ></v-text-field>

      <div class="ma-4">
        <p>PHPersonal Notes is a open-source personal notebook that can be hosted by yourself.</p>
        <p>
          If you register to this notes app and <strong>you are NOT the person that hosts this application</strong>, please be aware that <strong>the
          person that hosts this application can see ALL your data</strong> including notebooks/notes.
        </p>

        <p>
          If you want to host your own version of PHPersonal Notes, please clone the <a href="https://github.com/robertvanlienden/phpersonalnotes" target="_blank">github repository</a>.
        </p>

        <p>
          You are responsible for your own data and safety.
        </p>
      </div>

      <v-checkbox
      v-model="terms"
      :rules="[rules.required]"
      label="I've read the terms above and agree with them. I know the potential risk of using this software.."
      name="terms"
      required
      ></v-checkbox>

      <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="submitForm"
      >
        Register
      </v-btn>

    </v-form>
  </div>

</template>

<script>
import ApiLoginService from "../../services/apiLogin.service";

export default {
  name: "RegisterForm",
  data: () => ({
    valid: true,
    email: '',
    password: '',
    showPassword: false,
    terms: false,
    rules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters',
      emailRules:
        v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,20})+$/.test(v) || 'E-mail must be valid'
      ,
    },
    response: false,
    error: false,
  }),

  methods: {
    submitForm () {
      this.$refs.form.validate()
      ApiLoginService.register({ "email": this.email, "password": this.password }).then((response) => {
        this.response = true;
      }).catch((error) => {
        this.error = true;
      });
    },
  },
}
</script>

<style scoped>

</style>
