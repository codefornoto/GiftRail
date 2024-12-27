<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
</script>

<template>
  <v-app>
    <TheHeader />
    <RouterView />
    <TheFooter />
  </v-app>
</template>
