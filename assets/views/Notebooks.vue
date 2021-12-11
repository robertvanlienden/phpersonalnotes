<template>
  <div>
    <h1>Notebooks</h1>
    <v-alert
        type="error"
        dismissible
        v-if="error">
      Woops! {{ errorMessage }}
    </v-alert>
    <v-alert
        type="warning"
        dismissible
        v-if="warning">
      {{ warningMessage }}
    </v-alert>
    <v-progress-circular
        v-if="!notebooks"
        indeterminate
    ></v-progress-circular>

    <v-card
        v-for="notebook in notebooks"
        elevation="3"
        class="ma-5 pa-2"
    >
      <v-card-text>
        <router-link :to="{ name: 'notesFromNotebook', params: { notebookId: notebook.id }}" class="text-h5">{{
            notebook.title
          }}
        </router-link>
      </v-card-text>
      <v-card-actions>
        <v-dialog
            width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                warning
                color="warning"
                dark
                v-bind="attrs"
                v-on="on"
                class="pa-3 ma-2"
            >
              Edit <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Edit notebook {{ notebook.title}}
            </v-card-title>

            <v-card-text>
              <NotebookForm :notebook="notebook" class="mt-2"></NotebookForm>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-btn
          color="error"
          class="pa-3 ma-2">
          Delete
          <v-icon v-on:click="deleteNotebook(notebook.id, notebook.title)">
            mdi-delete
          </v-icon>
        </v-btn>

      </v-card-actions>
    </v-card>
    <router-link to="/">Back to home</router-link>
  </div>
</template>

<script>
import notebookService from "../services/notebook.service";
import NotebookForm from "../components/forms/NotebookForm";

export default {
  name: "Notebooks",
  components: { NotebookForm },
  data() {
    return {
      notebooks: null,
      error: false,
      errorMessage: "",
      warning: false,
      warningMessage: ""
    }
  },
  created() {
    this.getNotebooks();
  },
  methods: {
    getNotebooks() {
      notebookService.getNotebooks()
          .then((response) => {
            this.notebooks = response;
          })
          .catch((error) => {
            this.error = true;
            this.errorMessage = "Something went wrong fetching the notebooks! Please try again!";
          });
    },
    deleteNotebook(id, name) {
      if (!confirm("Are you sure you want to delete the notebook " + name + " including all the notes in this notebook? This will be definitive")){
        return;
      }
      notebookService.deleteNotebook(id)
          .then((response) => {
            this.warning = true;
            this.warningMessage = "You deleted the notebook " + name;
            this.getNotebooks()
          })
      .catch((error) => {
        this.error = true;
        this.errorMessage = "Something went wrong deleting the notebook: " + name + "! Please try again!";
      })
    }
  }

}
</script>
