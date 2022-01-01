<template>
  <div>
    <div>
      <h1 class="d-inline">Note {{ note.title }}</h1>
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
    <v-alert
        type="success"
        dismissible
        v-if="success">
      {{ successMessage }}
    </v-alert>
        <v-card
            elevation="3"
            class="ma-5 pa-2"
        >
          <v-card-title>{{ note.title }}</v-card-title>

          <v-card-text>
            {{ note.content }}
          </v-card-text>

          <v-card-text>
            <strong>Notebook:</strong> {{ note.notebook.title }}
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
                    class="pa-1 ma-2"
                >
                  Edit <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  Edit notebook {{ note.title }}
                </v-card-title>

                <v-card-text>
                  <NoteForm :note="note" class="mt-2"></NoteForm>
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-btn
              error
              color="error"
              dark
              v-on:click="deleteNote(note.id, note.title)">
              Delete <v-icon>
              mdi-delete
            </v-icon>
            </v-btn>

          </v-card-actions>
        </v-card>
    <router-link to="/">Back to home</router-link>
  </div>
</template>

<script>
import NoteForm from "../components/forms/NoteForm";
import store from "../store";

export default {
  name: "Notes",
  components: { NoteForm },
  data() {
    return {
      error: false,
      errorMessage: "",
      warning: false,
      warningMessage: "",
      success: false,
      successMessage: ""
    }
  },
  computed: {
    note() {
      return store.getters.getNote(parseInt(this.$route.params.noteId));
    }
  },
  created(){
    this.$store.dispatch('setNotes')
        .then(() => {
          if (this.$route.query.new) {
            this.success = true;
            this.successMessage = "Note " + this.note.title + " created!";
          }
        })
        .catch(() => {
          this.errorMessage = "Whoops! Something went wrong, try again later";
          this.error = true;
        });
  },
  watch: {
    dialog(val) {
      !val
    }
  },
  methods: {
    deleteNote(id, name) {
      if (!confirm("Are you sure you want to delete the note " + name + "? This will be definitive")) {
        return;
      }
      this.$store.dispatch('removeNote', id)
        .then((response) => {
          this.warning = true;
          this.warningMessage = "You deleted the note " + name;
        })
        .catch(() => {
          this.error = true;
          this.errorMessage = "Something went wrong deleting the note " + name + "! Please try again!";
        });
    }
  }
}
</script>
