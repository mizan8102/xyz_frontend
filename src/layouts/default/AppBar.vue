<template>
  <v-app-bar color="primary" prominent>

    <v-toolbar-title class="ms-5"> XYZ ENGINE</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-row justify="center" align="center">
      <v-col cols="auto" v-for="(link,i) in links" :key="i">
        <RouterLink :to="link.url" class="link " >{{ link.title }}</RouterLink>
      </v-col>
    </v-row>

  </v-app-bar>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
const links =ref ([
  {
    title: 'Result',
    url:'/',
  },
  {
    title: 'Add',
    url:'/entry',
  }
])
</script>

<style scoped>
.link{
  color:white !important;
  text-decoration: none;
}
.active {
  background: white;
  padding-top: 5px !important;
  padding-bottom: 5px !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
  color: black !important;
  border-radius: 0.75rem;
}
</style>

