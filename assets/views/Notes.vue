<template>
  <div>
    <h1>Notes</h1>
    <v-progress-circular
        v-if="!notes"
        indeterminate
    ></v-progress-circular>
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
        <v-card
            v-for="note in notes"
            elevation="3"
            class="ma-5 pa-2"
        >
          <v-card-title>{{ note.title }}</v-card-title>

          <v-card-text>
            {{ note.content }}
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
                  Edit notebook {{ note.title}}
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
import noteService from "../services/note.service";
import NoteForm from "../components/forms/NoteForm";

export default {
  name: "Notes",
  components: { NoteForm },
  data() {
    return {
      // dialog: false,
      notes: null,
      error: false,
      errorMessage: "",
      warning: false,
      warningMessage: ""
    }
  },
  created(){
    this.getNotes();
  },
  watch: {
    dialog(val) {
      !val && this.getNotes()
    }
  },
  methods: {
    getNotes() {
      noteService.getNotes(this.$route.params.notebookId)
          .then((response) => {
            this.notes = response;
          })
          .catch((error) => {
            this.error = true;
            this.errorMessage = "Something went wrong fetching the notebooks! Please try again!"
          });
    },
    deleteNote(id, name) {
      if (!confirm("Are you sure you want to delete the note " + name + " including all the notes in this notebook? This will be definitive")) {
        return;
      }
      noteService.deleteNote(id)
          .then((response) => {
            this.warning = true;
            this.warningMessage = "You deleted the note " + name;
            this.getNotes()
          })
          .catch((error) => {
            this.error = true;
            this.errorMessage = "Something went wrong deleting the note " + name + "! Please try again!";
          })
    }
  }
}
</script>
