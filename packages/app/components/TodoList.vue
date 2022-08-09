<script lang="ts" setup>
import type { Todo } from '@prisma/client'

const { data: todos, isLoading, error, refetch } = useQuery(['todo.findManyTodo', { take: 100 }], {})
const { data: projects } = useQuery(['project.findAllProject', { take: 100 }], {})

const client = useQueryClient()
let editTodo = $ref<Todo | null>(null)
const updateOneTodo = useMutation(['todo.updateOneTodo'], {
  onSettled: () => {
    client.invalidateQueries('todo.findManyTodo')
  },
})

const deleteOneTodo = useMutation(['todo.deleteOneTodo'], {
  onSettled: () => {
    client.invalidateQueries('todo.findManyTodo')
  },
})
async function removeTodo(id: number) {
  try {
    const confirm = window.confirm('Confirm delete?')
    if (confirm) {
      const result = await deleteOneTodo.mutateAsync({
        where: { id },
      })
      console.log('[LOG] ~ file: index.vue ~ line 42 ~ result', result)
    }
  }
  catch (e) {
    console.error(e)
  }
}

async function toggleDone(todo: Todo) {
  try {
    const result = await updateOneTodo.mutateAsync({
      data: { completed: !todo.completed },
      where: { id: todo.id },
    })
    console.log('[LOG] ~ file: index.vue ~ line 48 ~ result', result)
  }
  catch (e) {
    console.error(e)
  }
}

async function changeTitle() {
  try {
    if (editTodo) {
      const result = await updateOneTodo.mutateAsync({
        data: { title: editTodo.title },
        where: { id: editTodo.id },
      })
      editTodo = null
    }
  }
  catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <pre>{{ JSON.stringify(projects, null, 2) }}</pre>
  <div v-if="isLoading">
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
          <InputTodo v-model:task="editTodo.title" @keydown.enter="changeTitle" />
          <button @click="editTodo = null">
            <div class="i-carbon:close" />
          </button>
        </template>
        <template v-else>
          <div class="" :class="{ 'line-through': t.completed }" @click="editTodo = t">
            Title: {{ t.title }}
            Giang: {{ t.giang }}
          </div>
          <button @click="removeTodo(t.id)">
            <div class="i-carbon:close" />
          </button>
          <button @click="toggleDone(t)">
            <div class="i-carbon:checkmark" />
          </button>
        </template>
      </li>
    </ul>
    <button class="btn" @click="() => refetch()">
      Refresh
    </button>
  </div>
</template>
