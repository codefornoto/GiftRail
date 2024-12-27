<template>
  <v-container>
    <instruction-app></instruction-app>
    <TermsOfService></TermsOfService>
    <v-row v-show="props.mode === `admin`">
      <v-col>
        <v-text-field v-model="inputID" outlined></v-text-field>
      </v-col>
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
import InstructionApp from '@/components/InstructionApp.vue'
import TermsOfService from '@/components/TermsOfService.vue'

// propsの定義
interface Props {
  mode: string
  id: string
  zoom: number
}
const props = withDefaults(defineProps<Props>(), {
  mode: '',
  id: 'test',
})

const inputID = ref('test')
</script>
