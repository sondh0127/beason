<script setup lang="ts">
const props = defineProps<{ task: string }>()
const task = useVModel(props, 'task')
</script>

<template>
  <input
    v-bind="$attrs"
    v-model="task"
    placeholder="Enter new task"
    type="text" autocomplete="off"
    p="x-4 y-2" m="t-5" w="250px"
    text="center" bg="transparent"
    border="~ rounded gray-200 dark:gray-700"
    outline="none active:none"
  >
</template>
