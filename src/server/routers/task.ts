import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const taskRouter = router({
  // Get all tasks
  getAll: publicProcedure.query(async ({ ctx }) => {
    const tasks = await ctx.prisma.task.findMany({
      orderBy: { updatedAt: 'desc'}
    });
    console.log("Returning tasks:", tasks.length);
    return tasks;
  }),
  
  // Get a single task by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.task.findUnique({
        where: { id: input.id },
      });
    }),
  
  // Create a new task
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        userId: z.string(),
        status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
        dueDate: z.union([
          z.date(),
          z.string().refine(
            (val) => !isNaN(new Date(val).getTime()),
            { message: "Invalid date string" }
          ).transform(val => new Date(val))
        ]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Server received create task request:", input);
      try {
        const result = await ctx.prisma.task.create({
          data: input,
        });
        console.log("Task created in database:", result);
        return result;
      } catch (error) {
        console.error("Error creating task in database:", error);
        throw error;
      }
    }),
  
  // Update a task
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
        dueDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.task.update({
        where: { id },
        data,
      });
    }),
  
  // Delete a task
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.task.delete({
        where: { id: input.id },
      });
    }),
});