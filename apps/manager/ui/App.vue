<script setup>
import { RouterView } from 'vue-router'
import { Suspense } from 'vue'
import Body from '&ui/components/Body.vue'
import Error from '&ui/components/Error.vue'
import Header from '&ui/components/Header.vue'
</script>

<template>
  <Suspense>
    <main>
      <Error />
      <RouterView />
    </main>
  </Suspense>
</template>
