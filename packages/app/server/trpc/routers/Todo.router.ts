import { createRouter } from './createRouter'
import { TodoFindUniqueSchema } from '@/prisma/generated/schemas/findUniqueTodo.schema'
import { TodoFindFirstSchema } from '@/prisma/generated/schemas/findFirstTodo.schema'
import { TodoFindManySchema } from '@/prisma/generated/schemas/findManyTodo.schema'
import { TodoCreateOneSchema } from '@/prisma/generated/schemas/createOneTodo.schema'
import { TodoDeleteOneSchema } from '@/prisma/generated/schemas/deleteOneTodo.schema'
import { TodoUpdateOneSchema } from '@/prisma/generated/schemas/updateOneTodo.schema'
import { TodoDeleteManySchema } from '@/prisma/generated/schemas/deleteManyTodo.schema'
import { TodoUpdateManySchema } from '@/prisma/generated/schemas/updateManyTodo.schema'
import { TodoUpsertSchema } from '@/prisma/generated/schemas/upsertOneTodo.schema'
import { TodoAggregateSchema } from '@/prisma/generated/schemas/aggregateTodo.schema'
import { TodoGroupBySchema } from '@/prisma/generated/schemas/groupByTodo.schema'

export const todosRouter = createRouter()

// .query('aggregateTodo', {
//   input: TodoAggregateSchema,
//   async resolve({ ctx, input }) {
//     const aggregateTodo = await ctx.prisma.todo.aggregate(input)
//     return aggregateTodo
//   },
// })

  .mutation('createOneTodo', {
    input: TodoCreateOneSchema,
    async resolve({ ctx, input }) {
      const createOneTodo = await ctx.prisma.todo.create({ data: input.data })
      return createOneTodo
    },
  })

// .mutation('deleteManyTodo', {
//   input: TodoDeleteManySchema,
//   async resolve({ ctx, input }) {
//     const deleteManyTodo = await ctx.prisma.todo.deleteMany(input)
//     return deleteManyTodo
//   },
// })

  .mutation('deleteOneTodo', {
    input: TodoDeleteOneSchema,
    async resolve({ ctx, input }) {
      const deleteOneTodo = await ctx.prisma.todo.delete({ where: input.where })
      return deleteOneTodo
    },
  })

// .query('findFirstTodo', {
//   input: TodoFindFirstSchema,
//   async resolve({ ctx, input }) {
//     const findFirstTodo = await ctx.prisma.todo.findFirst(input)
//     return findFirstTodo
//   },
// })

  .query('findManyTodo', {
    input: TodoFindManySchema,
    async resolve({ ctx, input }) {
      const findManyTodo = await ctx.prisma.todo.findMany(input)
      return findManyTodo
    },
  })
  .query('findManyTodoInfinity', {
    input: TodoFindManySchema,
    async resolve({ ctx, input }) {
      const take = input.take ?? 10
      const findManyTodo = await ctx.prisma.todo.findMany({ ...input, take: take + 1, orderBy: { id: 'asc' } })

      let nextCursor: typeof input.cursor | null = null
      if (findManyTodo.length > take) {
        const nextItem = findManyTodo.pop()
        nextCursor = { id: nextItem!.id }
      }
      return {
        data: findManyTodo,
        nextCursor,
      }
    },
  })

// .query('findUniqueTodo', {
//   input: TodoFindUniqueSchema,
//   async resolve({ ctx, input }) {
//     const findUniqueTodo = await ctx.prisma.todo.findUnique({ where: input.where })
//     return findUniqueTodo
//   },
// })

// .query('groupByTodo', {
//   input: TodoGroupBySchema,
//   async resolve({ ctx, input }) {
//     const groupByTodo = await ctx.prisma.todo.groupBy({ where: input.where, orderBy: input.orderBy, by: input.by, having: input.having, take: input.take, skip: input.skip })
//     return groupByTodo
//   },
// })

// .mutation('updateManyTodo', {
//   input: TodoUpdateManySchema,
//   async resolve({ ctx, input }) {
//     const updateManyTodo = await ctx.prisma.todo.updateMany(input)
//     return updateManyTodo
//   },
// })

  .mutation('updateOneTodo', {
    input: TodoUpdateOneSchema,
    async resolve({ ctx, input }) {
      const updateOneTodo = await ctx.prisma.todo.update({ where: input.where, data: input.data })
      return updateOneTodo
    },
  })

// .mutation('upsertOneTodo', {
//   input: TodoUpsertSchema,
//   async resolve({ ctx, input }) {
//     const upsertOneTodo = await ctx.prisma.todo.upsert({ where: input.where, create: input.create, update: input.update })
//     return upsertOneTodo
//   },
// })
