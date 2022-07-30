<script lang="ts" setup>
import { useQueryClient } from 'vue-query'
// const client = useClient()
// const headers = useClientHeaders()
// const addHeader = () => {
//   // headers.value.cookie = 'counter=69'
//   // console.log(headers.value)
// }

const { data: todos, isLoading, error, refetch } = useQuery(['getTodos'], { ssr: true })

const { data: examples } = useQuery(['getExamples'])

const client = useQueryClient()

const todoMutation = useMutation(['addTodo'], {
  onSettled: () => {
    client.invalidateQueries('getTodos')
  },
})

const exampleMutation = useMutation(['addExample'], {
  onSettled: () => {
    client.invalidateQueries('getExamples')
  },
})

const addTodo = async () => {
  const title = Math.random().toString(36).slice(2, 7)
  try {
    const result = await todoMutation.mutateAsync({
      id: Date.now(),
      userId: 69,
      title,
      completed: false,
    })
    // console.log('Todo: ', result)
  }
  catch (e) {
    // console.log(e)
  }
}

async function addExample() {
  const name = 'Example1'
  try {
    const result = await exampleMutation.mutateAsync({ name })
    console.log('[LOG] ~ file: index.vue ~ line 31 ~ result', result)
  }
  catch (error) {
    console.log('[LOG] ~ file: index.vue ~ line 34 ~ error', error)
  }
}
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
      <li v-for="t in todos" :key="t.id">
        <NuxtLink :class="{ completed: t.completed }" :to="`/todo/${t.id}`">
          Title: {{ t.title }}
        </NuxtLink>
      </li>
    </ul>
    <div v-if="examples">
      <div v-for="e in examples" :key="e.id">
        <span>{{ e.name }}</span>
      </div>
    </div>
    <button class="btn" @click="addExample">
      Add Example
    </button>
    <button class="btn" @click="addTodo">
      Add Todo
    </button>
    <button class="btn" @click="() => refetch()">
      Refresh
    </button>
    <!-- <button class="btn" @click="addHeader">
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
