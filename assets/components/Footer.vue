<template>
  <div>
    <v-footer
        color="primary accent-4"
        class="primary--text text--lighten-5 caption">
      <p>PHPersonal Notes is a Open-Source personal notebook. <a href="https://github.com/robertvanlienden/phpersonalnotes" class="primary--text text--lighten-5">github.com/robertvanlienden/phpersonalnotes</a></p>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data: () => ({
    drawer: false,
    group: null,
    items: [
      { title: 'Add note', to: '/add-note' },
      { title: 'Add notebook', to: '/add-notebook' },
    ],
  }),
}
</script>
