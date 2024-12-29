<template>
  <div v-if="loading" class="lottie-container">
    <Vue3Lottie :animationData="animationLogo" height="40vh" />
  </div>
  <v-container fluid class="pa-0 container-wrapper">
    <v-row class="ma-0">
      <v-col class="pa-0">
        <div :style="{ height: mode === `admin` ? '50vh' : '100vh' }">
          <l-map
            ref="map"
            :zoom="zoom"
            :use-global-leaflet="false"
            :center="center"
            @click="moveMarker"
            :options="leafletMapOptions"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
              attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
            >
            </l-tile-layer>
            <l-marker :lat-lng="[Number(inputLat), Number(inputLon)]"> </l-marker>

            <template>
              <l-circle
                v-for="place in places"
                :key="place.id"
                :lat-lng="[place.latitude, place.longitude]"
                :radius="250"
                :options="{ color: place.color }"
              >
                <l-tooltip
                  :options="{
                    permanent: true,
                    interactive: true,
                    opacity: 0.9,
                    className: 'custom-tooltip',
                  }"
                >
                  {{ place.message }}
                </l-tooltip>
              </l-circle>
              <div v-for="(place, index) in places" :key="index">
                <l-polyline
                  :lat-lngs="[
                    [places[index].latitude, places[index].longitude],
                    index + 1 < places.length
                      ? [places[index + 1].latitude, places[index + 1].longitude]
                      : [places[index].latitude, places[index].longitude],
                  ]"
                  :options="{ ...lineDesign, color: place.color }"
                >
                </l-polyline>
              </div>
            </template>
          </l-map>
        </div>
      </v-col>
    </v-row>
    <div class="menu-button">
      <v-btn @click="backMarker">back</v-btn>
      <v-btn @click="nextMarker">forward</v-btn>
    </div>
    <v-row v-show="mode === `admin`">
      <v-col> centerID : {{ centerID }} </v-col>
      <v-col> places.length : {{ places.length }} </v-col>
      <v-col> {{ places }}</v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// general lib
import { onMounted, ref, watch } from 'vue'
import 'leaflet/dist/leaflet.css'
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LCircle,
  LTooltip,
  LPolyline,
} from '@vue-leaflet/vue-leaflet'
// unique lib
import type { Marker } from '../types/marker'
import { fetchMarkers } from '../services/getMarkers'
import animationLogo from '../assets/map.json'

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

// const
const loading = ref(true)
const places = ref<Marker[]>([])
const windowSize = ref(12)
const center = ref([37.2873438018384, 136.769464758692])
const centerID = ref(0)
const iconSize = [10, 10]
const inputLat = ref(0)
const inputLon = ref(0)

// config
const leafletMapOptions = {
  doubleClickZoom: false,
}
const lineDesign = {
  color: '#00FF00', // ネオングリーン
  weight: 10, // 線の太さ
  opacity: 0.7, // 線の透明度
  // dashArray: '5, 10', // 点線（5pxの線、10pxの隙間）
}

// function
const moveMarker = (e: { latlng?: { lat: number; lng: number } }) => {
  if (!e.latlng) {
    return
  }
  inputLat.value = e.latlng.lat
  inputLon.value = e.latlng.lng
}

function moveCenter(latlng: [number, number]) {
  center.value = latlng
}
function openMenu() {
  windowSize.value = windowSize.value === 8 ? 12 : 8
}

async function getMarker(id: string) {
  const data = await fetchMarkers(id)
  places.value = data
}
function nextMarker() {
  if (places.value.length - 1 > centerID.value) {
    centerID.value += 1
  } else {
    centerID.value = 0
  }
}
function backMarker() {
  if (centerID.value !== 0) {
    centerID.value -= 1
  } else {
    centerID.value = places.value.length - 1
  }
}

watch(
  () => centerID.value,
  (newID) => {
    if (places.value.length > 0) {
      moveCenter([places.value[newID].latitude, places.value[newID].longitude])
    }
  },
)

onMounted(async () => {
  await getMarker(props.id)
  moveCenter([places.value[0].latitude, places.value[0].longitude])
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style>
.container-wrapper {
  position: relative;
}

.menu-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}

:deep(.custom-tooltip) {
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 4px 8px;
}

:deep(.v-alert) {
  margin-bottom: 0;
}

.lottie-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 画面全体をカバー */
}

.leaflet-interactive {
  animation: blink 3s ease-in-out infinite alternate both;
}

@keyframes blink {
  50% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
}
</style>
