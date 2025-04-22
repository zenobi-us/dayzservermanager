<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <Suspense>
    <main>
      <RouterView />
    </main>
  </Suspense>
</template>
