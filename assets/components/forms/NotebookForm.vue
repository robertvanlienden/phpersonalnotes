<template>
  <div>
    <v-alert
      type="success"
      dismissible
      v-if="response">
      {{ responseMessage }}
    </v-alert>
    <v-alert
        type="error"
        dismissible
        v-if="error">
      Woops! {{ errorMessage }}
    </v-alert>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
    >
      <v-text-field
          v-model="title"
          :rules="titleRules"
          label="Title"
          required
      ></v-text-field>
      <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="submitForm"
      >
        {{ buttonText }}
      </v-btn>

    </v-form>
  </div>

</template>

<script>
import NotebookService from "../../services/notebook.service";

export default {
  name: "NotebookForm",
  props: [ "notebook" ],
  data: () => ({
    valid: true,
    title: '',
    titleRules: [
      v => !!v || 'Title is required',
    ],
    buttonText: "Add notebook",
    response: false,
    responseMessage: "",
    error: false,
    errorMessage: "",
  }),
  created() {
    if (this.notebook) {
      this.title = this.notebook.title;
      this.buttonText = "Update notebook"
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate()
      if (!this.notebook) {
        // TODO: Create a store action to add a note (nice to have "add note/notebook in modal") https://github.com/robertvanlienden/phpersonalnotes/issues/2
        NotebookService.createNotebook({
          title: this.title,
        }).then((response) => {
          this.response = true;
          this.responseMessage = "Notebook " +  response.title + " is added!";
        }).catch((error) => {
          console.log(error);
          this.error = true;
          this.responseMessage = "Something went wrong!";
        })
      } else {
        this.$store.dispatch('updateNotebook', {
          id: this.notebook.id,
          title: this.title,
        }).then((response) => {
          this.response = true;
          this.responseMessage = "Notebook " +  response.title + " is updated!";
        }).catch(() => {
          this.error = true;
          this.responseMessage = "Something went wrong!";
        });
      }
    },
  },
}
</script>

<style scoped>

</style>
