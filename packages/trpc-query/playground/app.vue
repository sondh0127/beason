<script setup lang="ts">
const enabled = ref(true)
const { data: data2, suspense: suspense2 } = useQuery(['getTodos'], { enabled, ssr: true })
</script>

<template>
  <div>
    Nuxt module playground!
    <button @click="enabled = !enabled">
      Enabled: {{ enabled }}
    </button>
    <pre>{{ JSON.stringify(data2, null, 2) }}</pre>
  </div>
</template>
