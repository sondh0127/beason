<script lang="ts" setup>
import type { Todo } from '@prisma/client'
import { useQueryClient } from 'vue-query'
// const client = useClient()
// const headers = useClientHeaders()
// const addHeader = () => {
//   // headers.value.cookie = 'counter=69'
//   // console.log(headers.value)
// }

// const { data: todos, isLoading, error, refetch } = useQuery(['todo.findManyTodo', { take: 10 }], { ssr: true })

const client = useQueryClient()

let newTodo = $ref('')
const createOneTodo = useMutation(['todo.createOneTodo'], {
  onSettled: () => {
    client.invalidateQueries('todo.findManyTodo')
  },
})

async function addTodo() {
  try {
    const result = await createOneTodo.mutateAsync({
      data: { title: newTodo },
    })
    newTodo = ''
    console.log('[LOG] ~ file: index.vue ~ line 28 ~ result', result)
  }
  catch (e) {
    console.error(e)
  }
}

const deleteOneTodo = useMutation(['todo.deleteOneTodo'], {
  onSettled: () => {
    client.invalidateQueries('todo.findManyTodo')
  },
})

const editTodo = ref<Todo>()
const updateOneTodo = useMutation(['todo.updateOneTodo'], {
  onSettled: () => {
    client.invalidateQueries('todo.findManyTodo')
  },
})
async function removeTodo(id: string) {
  try {
    const result = await deleteOneTodo.mutateAsync({
      where: { id },
    })
    console.log('[LOG] ~ file: index.vue ~ line 42 ~ result', result)
  }
  catch (e) {
    console.error(e)
  }
}

async function markDone(id: string) {
  try {
    const result = await updateOneTodo.mutateAsync({
      data: { completed: true },
      where: { id },
    })
    console.log('[LOG] ~ file: index.vue ~ line 48 ~ result', result)
  }
  catch (e) {
    console.error(e)
  }
}

const { data: iData, hasNextPage, fetchNextPage } = useInfiniteQuery(
  ['todo.findManyTodoInfinity', { take: 3 }],
  {
    getNextPageParam: lastPage => lastPage.nextCursor,
    refetchOnWindowFocus: false,
    ssr: true,
  },
)

const el = ref<HTMLElement>(null)

useInfiniteScroll(
  el,
  () => {
    // load more
    if (hasNextPage?.value)
      fetchNextPage()
  },
  { distance: 10 },
)
</script>

<template>
  <div ref="el" class="flex flex-col gap-2 p-4 w-400px h-100px m-auto overflow-y-scroll bg-gray-500/5 rounded">
    <div v-for="(page, index) in iData?.pages" :key="index" class="h-30 bg-red-500/5 rounded p-3">
      <div v-for="item in page.data" :key="item.id">
        {{ item.id }} - {{ item.title }}
      </div>
    </div>
  </div>
  <pre class="text-left">{{ JSON.stringify(iData, null, 2) }}</pre>
  <button :disabled="!hasNextPage" class="btn" @click="fetchNextPage()">
    Fetch next
  </button>

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
  <div class="flex flex-col items-center gap-2">
    <InputTodo v-model:task="newTodo" @keydown.enter="addTodo" />
    <button class="btn" @click="addTodo">
      Add Todo
    </button>
    <!-- <button class="btn" @click="() => refetch()">
      Refresh
    </button> -->
  </div>
  <!-- <div v-if="isLoading">
    Loading...
  </div>
  <div v-else-if="error?.data?.code">
    Error: {{ error.data.code }}
  </div>
  <div v-else-if="todos">
    List of todos:
    <ul>
      <li v-for="t in todos" :key="t.id" class="flex gap-2 justify-center">
        <template v-if="editTodo?.id === t.id">
          <InputTodo v-model:task="editTodo.title" @keydown.enter="updateOneTodo" />
          <button @click="editTodo = undefined">
            <div class="i-carbon:close" />
          </button>
        </template>
        <template v-else>
          <div :class="{ completed: t.completed }" @click="editTodo = t">
            Title: {{ t.title }}
          </div>
          <button @click="removeTodo(t.id)">
            <div class="i-carbon:close" />
          </button>
          <button @click="markDone(t.id)">
            <div class="i-carbon:checkmark" />
          </button>
        </template>
      </li>
    </ul>

  </div> -->
  <!-- <button class="btn" @click="addHeader">
      Add header
    </button> -->
</template>

<style>
a {
  text-decoration: none;
}

.completed {
  text-decoration: line-through;
}
</style>
