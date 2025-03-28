import { relations } from "drizzle-orm";
import {pgTable, uuid, varchar, boolean, timestamp} from "drizzle-orm/pg-core";
import { createInsertSchema } from 'drizzle-zod';
import {z} from 'zod'


export const UserTable = pgTable('User',{
  id:uuid('id').primaryKey().defaultRandom(),
  name:varchar('name').notNull().unique(),
  password:varchar('password').notNull()
})

export const userSchema = createInsertSchema(UserTable).pick({
  name:true,
  password:true,
}).extend({
  name: z.string().min(3,{message:'username must be more then 3'}),
  password: z.string().min(4,{message:'password must be more then 4'})
})


export const messages = pgTable('messages', {
  id: uuid('id').primaryKey(),
  user: varchar('user').notNull().references(()=>UserTable.name,{onDelete:'cascade',onUpdate:'cascade'}),
  text: varchar('text').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
  roomId: varchar('roomId'),
  system: boolean('system'),
});



//* Relations

export const UserTableRelation = relations(UserTable, ({  many }) => {
  return {
  
      messages: many(messages)
  }
})
export const messagesRelations = relations(messages, ({ one }) => {
  return {
      author: one(UserTable, {
          fields: [messages.user],
          references: [UserTable.name]

      }),
  
  }
})