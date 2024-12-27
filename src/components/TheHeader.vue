<template>
  <v-app-bar :elevation="1">
    <img :src="logo" alt="Logo" width="50" height="50" class="ml-4" />
    <v-app-bar-title>GiftRail</v-app-bar-title>
  </v-app-bar>
</template>
<script setup lang="ts">
import logo from '@/assets/logo.png'
</script>
