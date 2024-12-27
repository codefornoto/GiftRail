<template>
  <l-map
    ref="map"
    :zoom="props.zoom"
    :use-global-leaflet="false"
    :center="center"
    :options="leafletMapOptions"
    @click="moveMarker"
    style="height: 80vh"
  >
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
    />
    <l-marker
      v-if="selectedLocation"
      :lat-lng="[selectedLocation.latitude, selectedLocation.longitude]"
    >
      <l-tooltip
        :options="{
          permanent: true,
          interactive: true,
          opacity: 0.9,
          className: 'custom-tooltip',
        }"
        @click.stop="registerLocation()"
      >
        この地点を登録する
      </l-tooltip>
    </l-marker>
    <template>
      <l-circle
        v-for="place in markers"
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
      <div v-for="(place, index) in markers" :key="index">
        <l-polyline
          :lat-lngs="[
            [markers[index].latitude, markers[index].longitude],
            index + 1 < markers.length
              ? [markers[index + 1].latitude, markers[index + 1].longitude]
              : [markers[index].latitude, markers[index].longitude],
          ]"
          :options="{ ...lineDesign, color: place.color }"
        >
        </l-polyline>
      </div>
    </template>
  </l-map>
  <v-fab
    class="me-4"
    :icon="mdiPlus"
    color="green"
    text=""
    absolute
    offset
    style="z-index: 1000; top: -50px"
  >
  </v-fab>
</template>

<script setup lang="ts">
// import general lib
import { onMounted, ref } from 'vue'
import { LMap, LTileLayer, LMarker, LCircle, LTooltip, LPolyline } from '@vue-leaflet/vue-leaflet'
import { registerMarker } from '@/services/registerMarker'
import { mdiPlus } from '@mdi/js'
import { mdiMapMarker } from '@mdi/js'
import type { Marker } from '@/types/marker'
import { fetchMarkers } from '@/services/getMarkers'

// const
const center = ref([35.6769883, 139.7588499])
const defaultLocation = { latitude: 0, longitude: 0 }
const selectedLocation = ref<{ latitude: number; longitude: number }>(defaultLocation)
const leafletMapOptions = { doubleClickZoom: false }
const selectedColor = ref(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
const isMobile = ref(window.innerWidth < 768)
const showMessage = ref(false)
const message = ref('')
const alertType = ref<'error' | 'success' | 'warning' | 'info'>('info')
const markers = ref<Marker[]>([])
const scrollInvoked = ref(0)
const swatches = [
  ['FE4164', '#FF1818', '#CCCCCC'],
  ['#FF2603', '#C3732A', '#F6890A'],
  ['#CFAA01', '#FFF700', '#39FF14'],
  ['#008443', '#AAF0D1', '#00FEFC'],
  ['#4666FF', '#9457EB', '#FE347E'],
]
const lineDesign = {
  color: '#00FF00', // ネオングリーン
  weight: 10, // 線の太さ
  opacity: 0.7, // 線の透明度
  // dashArray: '5, 10', // 点線（5pxの線、10pxの隙間）
}

// props
interface Props {
  mode: string
  id: string
  zoom: number
}
const props = withDefaults(defineProps<Props>(), {
  mode: '',
  id: 'test',
  zoom: 15,
})

// function
function getRandomOffset() {
  return (Math.random() - 0.5) * 0.005 // ±0.01度の範囲でオフセット
}
const moveMarker = (e: { latlng?: { lat: number; lng: number } }) => {
  if (!e.latlng) {
    return
  }
  selectedLocation.value.latitude = e.latlng.lat
  selectedLocation.value.longitude = e.latlng.lng
}
const updateCenter = (latitude: number, longitude: number) => {
  center.value = [latitude, longitude]
}

function updateMessage(type: 'error' | 'success' | 'warning' | 'info', text: string) {
  message.value = text
  alertType.value = type
  showMessage.value = true
  setTimeout(() => {
    showMessage.value = false
  }, 5000)
}
async function registerLocation() {
  console.log('register!')
  if (selectedLocation.value.latitude !== 0 && selectedLocation.value.longitude !== 0) {
    const lat = selectedLocation.value.latitude + getRandomOffset()
    const long = selectedLocation.value.longitude + getRandomOffset()
    await registerMarker({ latitude: lat, longitude: long, color: selectedColor.value }, props.id)
    updateMessage('success', 'マーカーが正常に登録されました')
  } else {
    updateMessage(
      'warning',
      '位置情報が指定されていません。地図上をクリックするか、ボタンから位置情報を指定してください。',
    )
  }
}

async function getMarkers(id: string) {
  const data = await fetchMarkers(id)
  markers.value = data
}
function moveCenter(latlng: [number, number]) {
  center.value = latlng
}
onMounted(async () => {
  await getMarkers('test')
  moveCenter([markers.value[0].latitude, markers.value[0].longitude])
})
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
.leaflet-container {
  width: 100%;
}

.menu-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}
</style>
