<template>
  <v-app>
    <v-main>
      <Header></Header>
      <v-container>
        <router-view>
        </router-view>
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
export default {
  name: "App",
  components: {Footer, Header},
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
