<template>
  <v-row>
    <v-col cols="12">
      <h3>GiftRaliに関する利用規約</h3>
      <p>
        「あげる」でつなぐアートGiftRali（以下、当サービス）についての利用規約をよく読み、同意する場合はチェックを入れたうえで送信ボタンを押下してください。
        <br /><br />

        1. 利用目的の明示
        <br />
        ・当サービスは、ユーザーが物品を贈与した履歴を視覚化し、アートとして共有することを目的としています。他の目的での利用は禁止されています。
        <br />
        2. 著作権および使用許諾
        <br />
        ・ユーザーが提供するコンテンツ（位置情報、贈与履歴等）は、当サービスの運営・改善のために使用することができるものとします。ただし、個人を特定できる形での利用は行いません。
        <br />
        3. 禁止事項
        <br />
        ・他者の権利を侵害する行為を行うこと。
        <br />
        ・不正アクセスや不正利用を行うこと。
        <br />
        4.サービス内容の変更・中断・終了
        <br />
        ・当サービスは、事前通知なしに内容の変更、中断、または終了を行うことができるものとします。これに伴いユーザーに生じた損害について、運営者は一切責任を負いません。
        <br />
        5. 免責事項
        <br />
        ・当サービスを利用することにより発生したいかなる損害についても、運営者は一切責任を負いません。ただし、適用法令により免責が認められない場合を除きます。準拠法および裁判管轄本利用規約は日本法に準拠し、日本国内の裁判所を専属管轄とします。
        <br />
        6. 未成年者の利用
        <br />
        ・未成年者が当サービスを利用する場合は、必ず保護者の同意を得てください。
      </p>
    </v-col>
    <v-col cols="12" class="d-flex justify-center py-0">
      <v-checkbox v-model="agreed" label="利用規約に同意します"></v-checkbox>
    </v-col>
    <v-col cols="12" class="d-flex justify-center pt-0">
      <router-link :to="{ name: 'register', query: { id: inputID } }">
        <v-btn :disabled="!agreed" color="green" class="mb-4">同意する</v-btn>
      </router-link>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputID = ref('test')
const agreed = ref(false)
</script>
