<template>
  <v-main>
    <div v-if="loading" class="lottie-container">
      <Vue3Lottie :animationData="animationLogo" height="40vh" />
    </div>
    <v-container v-else fluid class="ma-0">
      <v-row>
        <v-col cols="12" md="6">
          <l-map
            ref="map"
            :zoom="Number(props.zoom)"
            :use-global-leaflet="false"
            :center="center"
            :options="leafletMapOptions"
            @click="moveMarker"
            :style="{ height: isMobile ? '45vh' : '80vh' }"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
            />
            <l-marker
              v-if="selectedLocation"
              class="selectedLocation"
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
                v-for="marker in markers"
                :key="marker.id"
                :lat-lng="[marker.latitude, marker.longitude]"
                :radius="250"
                :options="{ color: marker.color }"
              >
                <l-tooltip
                  :options="{
                    permanent: true,
                    interactive: true,
                    opacity: 0.9,
                    className: 'custom-tooltip',
                  }"
                >
                  {{ marker.message + ' by ' + marker.user }}
                </l-tooltip>
              </l-circle>
              <div v-for="(marker, index) in markers" :key="index">
                <l-polyline
                  :lat-lngs="[
                    [markers[index].latitude, markers[index].longitude],
                    index + 1 < markers.length
                      ? [markers[index + 1].latitude, markers[index + 1].longitude]
                      : [markers[index].latitude, markers[index].longitude],
                  ]"
                  :options="{ ...lineDesign, color: marker.color }"
                >
                </l-polyline>
              </div>
            </template>
          </l-map>

          <v-fab
            class="me-4 mr-10"
            :icon="mdiArrowLeftThin"
            color="green"
            text=""
            absolute
            style="z-index: 1000; top: -30px; left: -70px"
            @click="backMarker()"
          >
          </v-fab>
          <v-fab
            class="me-4 mr-10"
            :icon="mdiArrowRightThin"
            color="green"
            text=""
            absolute
            style="z-index: 1000; top: -30px"
            @click="nextMarker()"
          >
          </v-fab>
        </v-col>
        <v-col cols="12" md="6">
          <v-card
            title="場所を登録する"
            subtitle="自分の場所を登録して次の人に繋げよう"
            :style="{ height: isMobile ? '63vh' : '45vh' }"
          >
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col class="pb-0">
                      <v-text-field
                        v-model="inputUsername"
                        variant="outlined"
                        label="ニックネームを入力"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="py-0">
                      <v-text-field
                        v-model="inputMessage"
                        variant="outlined"
                        label="メッセージを入力"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6" class="py-0">
                      <v-btn
                        @click="getLocation()"
                        class="mx-auto d-flex justify-center"
                        color="green"
                      >
                        位置情報を取得
                      </v-btn>
                    </v-col>
                    <v-col cols="6" class="py-0">
                      <v-btn
                        @click="registerLocation()"
                        class="mx-auto d-flex justify-center"
                        :disabled="!inputUsername"
                        color="red"
                      >
                        位置情報を登録
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-alert
                        v-show="showMessage"
                        v-model="showMessage"
                        closable
                        close-label="Close Alert"
                        :type="alertType"
                        variant="outlined"
                        prominent
                        @close="showMessage = false"
                      >
                        {{ message }}
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <v-color-picker
                    class="mx-auto"
                    :swatches="swatches"
                    :swatches-max-height="isMobile ? '20vh' : '45vh'"
                    show-swatches
                    v-model="selectedColor"
                    hide-inputs
                    hide-canvas
                  >
                  </v-color-picker>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <TheHistory :markers="markers" @marker-clicked="moveCenter($event)"></TheHistory>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
// import general lib
import { onMounted, ref, watch } from 'vue'
import { LMap, LTileLayer, LMarker, LCircle, LTooltip, LPolyline } from '@vue-leaflet/vue-leaflet'
import { registerMarker } from '@/services/registerMarker'
import type { Marker } from '@/types/marker'
import { fetchMarkers } from '@/services/getMarkers'
import TheHistory from '@/components/TheHistory.vue'
import { mdiArrowLeftThin } from '@mdi/js'
import { mdiArrowRightThin } from '@mdi/js'
import { Vue3Lottie } from 'vue3-lottie'
import animationLogo from '../assets/map.json'
import type { QueryParams } from '@/interfaces/queryParams'

// const
const loading = ref(true)
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
const inputUsername = ref('')
const inputMessage = ref('')
const centerID = ref(0)
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

const props = defineProps<QueryParams>()

// function
function nextMarker() {
  if (markers.value.length - 1 > centerID.value) {
    centerID.value += 1
  } else {
    centerID.value = 0
  }
}
function backMarker() {
  if (centerID.value !== 0) {
    centerID.value -= 1
  } else {
    centerID.value = markers.value.length - 1
  }
}
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

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
        selectedLocation.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        updateCenter(position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        alert('位置情報の取得に失敗しました:' + error)
        console.log(error)
      },
    )
  } else {
    alert('このブラウザは位置情報をサポートしていません。')
  }
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
  if (selectedLocation.value.latitude !== 0 && selectedLocation.value.longitude !== 0) {
    const lat = selectedLocation.value.latitude + getRandomOffset()
    const long = selectedLocation.value.longitude + getRandomOffset()
    await registerMarker(
      {
        latitude: lat,
        longitude: long,
        color: selectedColor.value,
        user: inputUsername.value,
        message: inputMessage.value,
      },
      props.id,
    )
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

watch(
  () => centerID.value,
  (newID) => {
    if (markers.value.length > 0) {
      moveCenter([markers.value[newID].latitude, markers.value[newID].longitude])
    }
  },
)
onMounted(async () => {
  setTimeout(() => {
    loading.value = false
  }, 3000)
  await getMarkers(props.id)
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
  bottom: 10px;
  right: 10px;
  z-index: 1000;
}
.selectedLocation {
  color: red;
}
</style>
