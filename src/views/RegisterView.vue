<template>
  <v-container fluid class="ma-0">
    <v-row>
      <v-col cols="12" lg="6" md="6" :style="{ height: isMobile ? '40vh' : '100vh' }">
        <l-map
          ref="map"
          :zoom="zoom"
          :use-global-leaflet="false"
          :center="center"
          :options="leafletMapOptions"
          @click="moveMarker"
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
        </l-map>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="6">
            <v-btn @click="getLocation()" class="mx-auto d-flex justify-center" color="green">
              現在の位置情報を取得
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn @click="registerLocation()" class="mx-auto d-flex justify-center" color="red">
              位置情報を登録する
            </v-btn>
          </v-col>
          <v-col cols="12" v-show="showMessage">
            <v-alert
              v-model="showMessage"
              closable
              close-label="Close Alert"
              type="warning"
              variant="outlined"
              prominent
              @close="showMessage = false"
            >
              {{ message }}
            </v-alert>
          </v-col>
          <v-col cols="12">
            <div v-if="mode === 'admin'">
              {{ selectedColor }}
            </div>
            <div>色を選択すると次の人とのコネクションの色を選べます。</div>
            <v-color-picker
              class="ma-2 mx-auto"
              :swatches="swatches"
              :swatches-max-height="isMobile ? '20vh' : '45vh'"
              show-swatches
              v-model="selectedColor"
            >
            </v-color-picker>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// import general lib
import { ref } from 'vue'
import { LMap, LTileLayer, LMarker, LTooltip } from '@vue-leaflet/vue-leaflet'
// import { mdiInformation } from '@mdi/js'
import { registerMarker } from '@/services/registerMarker'

// const
const center = ref([35.6769883, 139.7588499])
const defaultLocation = { latitude: 0, longitude: 0 }
const selectedLocation = ref<{ latitude: number; longitude: number }>(defaultLocation)
const zoom = ref(16)
const leafletMapOptions = { doubleClickZoom: false }
const selectedColor = ref(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
const isMobile = ref(window.innerWidth < 768)
const showMessage = ref(false)
const message = ref('')
const swatches = [
  ['FE4164', '#FF1818', '#CCCCCC'],
  ['#FF2603', '#C3732A', '#F6890A'],
  ['#CFAA01', '#FFF700', '#39FF14'],
  ['#008443', '#AAF0D1', '#00FEFC'],
  ['#4666FF', '#9457EB', '#FE347E'],
]

// props
interface Props {
  mode: string
  id: string
}
const props = withDefaults(defineProps<Props>(), {
  mode: '',
  id: 'test',
})

// function
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

function updateMessage(text: string) {
  message.value = text
  showMessage.value = true
  setTimeout(() => {
    showMessage.value = false
  }, 5000)
}
async function registerLocation() {
  console.log('register!')
  if (selectedLocation.value !== defaultLocation) {
    await registerMarker({ ...selectedLocation.value, color: selectedColor.value }, props.id)
    updateMessage('マーカーが正常に登録されました')
  } else {
    updateMessage(
      '位置情報が指定されていません。地図上をクリックするか、ボタンから位置情報を指定してください。',
    )
  }
}
</script>

<style scoped>
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
