<template>
  <div>
    <v-alert
        type="error"
        dismissible
        v-if="error"
    >Whoops! {{ errorMessage }}</v-alert>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
    >
      <v-text-field
          v-model="username"
          :rules="[ rules.required, rules.emailRules ]"
          label="E-mail"
          required
      ></v-text-field>

      <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required]"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="off"
          name="password"
          label="Password"
          @click:append="showPassword = !showPassword"
      ></v-text-field>

      <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="submitForm"
      >
        Login
      </v-btn>

    </v-form>
  </div>

</template>

<script>
import ApiLoginService from "../../services/apiLogin.service";

export default {
  name: "LoginForm",
  data: () => ({
    valid: true,
    username: '',
    password: '',
    showPassword: false,
    rules: {
      required: value => !!value || 'Required.',
      emailRules: v => /.+@.+/.test(v) || 'Invalid Email address'
      ,
    },
    errorMessage: '',
    error: false,
  }),

  methods: {
    submitForm() {
      this.$refs.form.validate()
      ApiLoginService.login({
        username: this.username,
        password: this.password
      }).then((response => {
        this.$store.dispatch('login')
        this.$router.push({
          name: 'notebooks'
        })
      })).catch((error) => {
        if(error.response.data.code === 401) {
          this.errorMessage = error.response.data.message;
          this.error = true;
        } else {
          this.errorMessage = "";
          console.log(error.response.data.message)
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
