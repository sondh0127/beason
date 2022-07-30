<script lang="ts" setup>
// const client = useClient()
// const headers = useClientHeaders()
// const addHeader = () => {
//   // headers.value.cookie = 'counter=69'
//   // console.log(headers.value)
// }

const { data: todos, isLoading, error, refetch } = useQuery(['getTodos'], { ssr: true })

// const { data: examples, pending: pendingE, error: errorE, refresh: refreshE } = await useAsyncQuery(['getExamples'])
// const addTodo = async () => {
//   const title = Math.random().toString(36).slice(2, 7)
//   try {
//     const result = await client.mutation('addTodo', {
//       id: Date.now(),
//       userId: 69,
//       title,
//       completed: false,
//     })
//     // console.log('Todo: ', result)
//   }
//   catch (e) {
//     // console.log(e)
//   }
// }

// async function addExample() {
//   const name = 'Example1'
//   try {
//     const result = await client.mutation('addExample', { name })
//     refreshE()
//     console.log('[LOG] ~ file: index.vue ~ line 31 ~ result', result)
//   }
//   catch (error) {
//     console.log('[LOG] ~ file: index.vue ~ line 34 ~ error', error)
//   }
// }
</script>

<template>
  <div>
    <Logos mb-6 />
    <Suspense>
      <PageView />
      <template #fallback>
        <div op50 italic>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
    <InputEntry />
  </div>

  <div v-if="isLoading">
    Loading...
  </div>
  <div v-else-if="error?.data?.code">
    Error: {{ error.data.code }}
  </div>
  <div v-else-if="todos">
    <ul>
      <li v-for="t in todos.slice(0, 10)" :key="t.id">
        <NuxtLink :class="{ completed: t.completed }" :to="`/todo/${t.id}`">
          Title: {{ t.title }}
        </NuxtLink>
      </li>
    </ul>
    <!-- <div>
      <div v-for="e in examples.slice(0, 10)" :key="e.id">
        <span>{{ e.name }}</span>
      </div>
    </div> -->
    <!-- <button class="btn" @click="addTodo">
      Add Todo
    </button>
    <button class="btn" @click="addExample">
      Add Example
    </button>
    <button class="btn" @click="() => refresh()">
      Refresh
    </button>
    <button class="btn" @click="addHeader">
      Add header
    </button> -->
  </div>
</template>

<style>
a {
  text-decoration: none;
}

.completed {
  text-decoration: line-through;
}
</style>
