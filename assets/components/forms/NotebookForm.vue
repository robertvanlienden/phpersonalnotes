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
        NotebookService.updateNotebook(this.notebook.id, {
          title: this.title,
        }).then((response) => {
          this.response = true;
          this.responseMessage = "Notebook " +  response.title + " is updated!";
        }).catch((error) => {
          console.log(error);
          this.error = true;
          this.responseMessage = "Something went wrong!";
        })
      }

    },
  },
}
</script>

<style scoped>

</style>
