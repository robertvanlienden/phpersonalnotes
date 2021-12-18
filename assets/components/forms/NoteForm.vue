<template>
  <div>
    <div v-if="!this.notebooks.length">
      Please first <router-link to="/add-notebook">add a notebook</router-link> before you can add a note!
    </div>
    <div v-if="this.notebooks.length">
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

        <v-textarea
            v-model="content"
            label="Content"
        ></v-textarea>

        <v-select
            v-model="notebook"
            :items="notebooks"
            item-text="title"
            item-value="id"
            :rules="[v => !!v || 'Notebook is required']"
            label="Notebook"
            required
        ></v-select>
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
  </div>

</template>

<script>
import NotebookService from "../../services/notebook.service";
import NoteService from "../../services/note.service";

export default {
  name: "NoteForm",
  props: [ "note" ],
  data: () => ({
    valid: true,
    title: '',
    titleRules: [
      v => !!v || 'Title is required',
    ],
    content: '',
    notebook: null,
    notebooks: [
      'Loading...'
    ],
    buttonText: "Add note",
    response: false,
    responseMessage: "",
    error: false,
    errorMessage: "",
  }),
  created() {
    this.getNotebooks();
    if (this.note) {
      this.title = this.note.title;
      this.content = this.note.content;
      this.notebook = this.note.notebook.id;
      this.buttonText = "Update note";
    }
  },
  methods: {
    submitForm () {
      this.$refs.form.validate()
      if(!this.note) {
        NoteService.createNote({
          title: this.title,
          content: this.content,
          notebook: this.notebook
        }).then((response) => {
          this.response = true;
          this.responseMessage = "Note " +  response.title + " is added!";
        }).catch((error) => {
          console.log(error.response);
          this.error = true;
          this.responseMessage = "Something went wrong!";
        })
      } else {
        NoteService.updateNote(this.note.id, {
          // TODO: Move request to store action
          title: this.title,
          content: this.content,
          notebook: this.notebook
        }).then((response) => {
          this.response = true;
          this.$store.dispatch('updateNote', response);
          this.responseMessage = "Note " +  response.title + " is updated!";
        }).catch((error) => {
          this.error = true;
          this.responseMessage = "Something went wrong!";
        })
      }

    },
    getNotebooks() {
      NotebookService.getNotebooks().then((response) => {
        this.notebooks = response;
      }).catch((response) => {
        this.notebooks = [ 'Error resolving notebooks! Try again later!']
      })
    }
  },
}
</script>

<style scoped>

</style>
