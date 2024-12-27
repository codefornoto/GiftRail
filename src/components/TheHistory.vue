<template>
  <v-card class="mt-4" height="33vh">
    <v-card-title>History</v-card-title>
    <v-card-subtitle>これまでの履歴を辿る</v-card-subtitle>
    <v-list lines="one" :height="`22vh`" style="overflow-y: auto" class="ma-2">
      <v-list-item v-for="(marker, index) in props.markers" :key="index">
        <template v-slot:prepend>
          <div class="mr-4">
            {{ new Date(marker.timestamp).toLocaleDateString('ja-JP') }}
          </div>
        </template>
        <v-list-item-title>{{ marker.user }}</v-list-item-title>
        <v-list-item-subtitle>{{ marker.message }}</v-list-item-subtitle>
        <template v-slot:append>
          <v-icon
            :icon="mdiMapMarker"
            @click="$emit('marker-clicked', [marker.latitude, marker.longitude])"
          >
          </v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import type { Marker } from '@/types/marker'
import { mdiMapMarker } from '@mdi/js'

const props = defineProps<{
  markers: Marker[]
}>()
</script>
