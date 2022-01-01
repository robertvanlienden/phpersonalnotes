<template>
  <div>
    <v-system-bar color="primary darken-3"></v-system-bar>

    <v-app-bar
        color="primary accent-4"
        dark
    >

      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title><router-link to="/" class="grey--text text--darken-4">PHPersonal Notes</router-link></v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              v-bind="attrs"
              v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
              v-for="(item, index) in items"
              :key="index"
          >
            <v-list-item-title><router-link :to="item.to">{{ item.title }}</router-link></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        absolute
        left
        temporary
    >
      <v-list
          nav
          dense
      >
        <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
        >
          <router-link to="/" color="dark">
            <v-list-item>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
          </router-link>
          <router-link to="/notebooks" color="dark"  v-if="isLoggedIn">
            <v-list-item>
              <v-list-item-title>Notebooks</v-list-item-title>
            </v-list-item>
          </router-link>
          <router-link to="/notes" color="dark"  v-if="isLoggedIn">
            <v-list-item>
              <v-list-item-title>All notes</v-list-item-title>
            </v-list-item>
          </router-link>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Header",
  data: () => ({
    drawer: false,
    group: null,
  }),
  computed: {
    items() {
      if(this.isLoggedIn) {
        return [
          { title: 'Logout', to: '/logout' },
        ];
      } else {
        return [
          { title: 'Login', to: '/login' },
          { title: 'Register', to: '/register' },
        ];
      }
    },
    ...mapState(['isLoggedIn'])
  },
}
</script>
