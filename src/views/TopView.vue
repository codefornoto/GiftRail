<template>
  <v-main>
    <v-container>
      <instruction-app></instruction-app>
      <TermsOfService :mode="props.mode" :id="props.id" :zoom="props.zoom"></TermsOfService>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import InstructionApp from '@/components/InstructionApp.vue'
import TermsOfService from '@/components/TermsOfService.vue'
import type { QueryParams } from '@/interfaces/queryParams'

const props = defineProps<QueryParams>()
</script>
