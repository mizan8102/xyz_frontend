<template>
  <v-app-bar color="primary" prominent>
    <v-app-bar-nav-icon variant="text" @click.stop="rail = !rail"></v-app-bar-nav-icon>

    <v-toolbar-title>XYZ Engine</v-toolbar-title>

    <v-spacer></v-spacer>
  </v-app-bar>
  <v-navigation-drawer :rail="rail" permanent @click="rail = false">

    <v-list density="compact" nav>
      <v-list-item to="/" prepend-icon="mdi-home-city" title="Result" value="home"></v-list-item>
      <v-list-item to="/entry" prepend-icon="mdi-account" title="Entry" value="account"></v-list-item>
  
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const rail = ref<boolean>(false);
</script>
