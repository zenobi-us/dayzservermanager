<script setup lang="ts">
import { useFetch } from '@vueuse/core'
import { config } from '&ui/config'
import { useAppStore } from '&ui/stores/app.js'
import XmlTree from '&ui/components/XmlTree.vue'
const store = useAppStore()
const { data, error } = await useFetch(() => config.baseUrl + `/mod/${store.modId}/${store.modFile}`, {
  immediate: false,
  refetch: true,
  afterFetch(response) {
    const parser = new DOMParser()
    try {
      response.data = parser.parseFromString(response.data, "text/xml").documentElement
    } catch(e) {
      console.error(e)
      response.error = e
    }
    return response
  }
}).get()
</script>

<template>
  <div v-if="error">{{ error }}</div>
  <div v-else-if="data">
    <XmlTree :element="data" :depth="0" />
  </div>
</template>
