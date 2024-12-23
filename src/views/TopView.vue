<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field v-model="inputID" outlined></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <router-link :to="{ name: 'register', query: { id: inputID } }">登録する</router-link>
      </v-col>
      <v-col>
        <router-link :to="{ name: 'map', query: { id: inputID } }">マップを確認する</router-link>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const inputID = ref('test')
</script>
