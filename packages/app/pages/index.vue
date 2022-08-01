<script lang="ts" setup>
// const client = useClient()
// const headers = useClientHeaders()
// const addHeader = () => {
//   // headers.value.cookie = 'counter=69'
//   // console.log(headers.value)
// }

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

const { data: iData, hasNextPage, fetchNextPage } = useInfiniteQuery(
  ['todo.findManyTodoInfinity', { take: 3 }],
  {
    getNextPageParam: lastPage => lastPage.nextCursor,
    refetchOnWindowFocus: false,
    ssr: true,
  },
)

const el = ref<HTMLElement | null>(null)

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
  <!-- <pre class="text-left">{{ JSON.stringify(iData, null, 2) }}</pre> -->
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
  </div>
  <TodoList />

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
