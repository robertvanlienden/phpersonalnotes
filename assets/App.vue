<template>
  <v-app>
    <v-main>
      <Header></Header>
      <v-container>
        <router-view>
        </router-view>
      </v-container>
    </v-main>
    <v-fab-transition>
      <v-speed-dial
          v-if="isLoggedIn"
          v-model="fab"
          bottom right fixed
          direction="top"
          transition="slide-y-reverse-transition"
      >
        <template v-slot:activator>
          <v-btn
              v-model="fab"
              color="blue darken-2"
              dark
              fab
          >
            <v-icon v-if="fab">
              mdi-close
            </v-icon>
            <v-icon v-else>
              mdi-plus-circle
            </v-icon>
          </v-btn>
        </template>
        <router-link to="/add-notebook" color="dark" tag="button">
          <v-btn
              fab
              dark
              color="blue darken-1"
          >
            <v-icon>mdi-book-plus</v-icon>
          </v-btn>
        </router-link>
        <router-link to="/add-note" color="dark" tag="button">
          <v-btn
              fab
              dark
              color="blue darken-1"
          >
            <v-icon>mdi-note-plus</v-icon>
          </v-btn>
        </router-link>
      </v-speed-dial>
    </v-fab-transition>
    <Footer></Footer>
  </v-app>
</template>
<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
import {mapState} from "vuex";
export default {
  name: "App",
  components: {Footer, Header},
  data() {
    return {
      fab: false,
    }
  },
  computed: {
    ...mapState(['isLoggedIn'])
  },
  metaInfo() {
    return {
      title: "PHPersonal Notes",
    }
  },
  watch: {
    group () {
      this.drawer = false
    },
  },
}
</script>
