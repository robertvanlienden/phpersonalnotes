<template>
  <div>
    <div>
      <h1 class="d-inline">Notebooks</h1>
      <v-btn class="ml-4" color="primary accent-4" elevation="1">
        <v-icon @click="getNotebooks">mdi-reload</v-icon>
      </v-btn>
    </div>

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
    <div v-if="!notebooks.length">
      No notebooks found! <router-link to="/add-notebook">Add a notebook</router-link>
    </div>

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
          class="pa-3 ma-2"
          v-on:click="deleteNotebook(notebook.id, notebook.title)">
          Delete
          <v-icon>
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
import store from "../store";

export default {
  name: "Notebooks",
  components: { NotebookForm },
  data() {
    return {
      error: false,
      errorMessage: "",
      warning: false,
      warningMessage: ""
    }
  },
  computed: {
    notebooks () {
      return store.state.notebooks
    }
  },
  created() {
    this.getNotebooks();
  },
  methods: {
    getNotebooks() {
      this.$store.dispatch('setNotebooks')
        .catch(() => {
          this.error = true;
          this.errorMessage = "Something went wrong fetching the notebooks! Please try again!";
        })
    },
    deleteNotebook(id, name) {
      if (!confirm("Are you sure you want to delete the notebook " + name + " including all the notes in this notebook? This will be definitive")){
        return;
      }
      this.$store.dispatch('removeNotebook', id)
        .then(() => {
          this.warning = true;
          this.warningMessage = "You deleted the notebook " + name;
        })
        .catch(() => {
          this.error = true;
          this.errorMessage = "Something went wrong deleting the notebook: " + name + "! Please try again!";
        })
    }
  }

}
</script>
