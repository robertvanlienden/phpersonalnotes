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
import store from "../../store";

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
    buttonText: "Add note",
    response: false,
    responseMessage: "",
    error: false,
    errorMessage: "",
  }),
  computed: {
    notebooks() {
      if(store.state.notebooks.length) {
        return store.state.notebooks
      } else {
        return ["loading..."];
      }
    }
  },
  created() {
    this.$store.dispatch('setNotebooks')
      .catch(() => {
        this.error = true;
        this.errorMessage = "Something went wrong fetching the notebooks!"
      })
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
        // TODO: Create a store action to add a note (nice to have "add note/notebook in modal") https://github.com/robertvanlienden/phpersonalnotes/issues/2
        NoteService.createNote({
          title: this.title,
          content: this.content,
          notebook: this.notebook
        }).then((response) => {
          this.$router.push({ path: '/note/' + response.id, query: { new: 'true' } })
        }).catch((error) => {
          console.log(error.response);
          this.error = true;
          this.responseMessage = "Something went wrong!";
        })
      } else {
        this.$store.dispatch('updateNote', {
          id: this.note.id,
          title: this.title,
          content: this.content,
          notebook: this.notebook,
        })
          .then((response) => {
            this.response = true;
            this.responseMessage = "Note " +  response.title + " is updated!";
          })
          .catch(() => {
            this.error = true;
            this.errorMessage = "Something went wrong!";
          });
      }
    },
  },
}
</script>

<style scoped>

</style>
