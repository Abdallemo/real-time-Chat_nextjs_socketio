"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRelations = exports.UserTableRelation = exports.messages = exports.userSchema = exports.UserTable = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
exports.UserTable = (0, pg_core_1.pgTable)('User', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name').notNull().unique(),
    password: (0, pg_core_1.varchar)('password').notNull()
});
exports.userSchema = (0, drizzle_zod_1.createInsertSchema)(exports.UserTable).pick({
    name: true,
    password: true,
}).extend({
    name: zod_1.z.string().min(3, { message: 'username must be more then 3' }),
    password: zod_1.z.string().min(4, { message: 'password must be more then 4' })
});
exports.messages = (0, pg_core_1.pgTable)('messages', {
    id: (0, pg_core_1.uuid)('id').primaryKey(),
    user: (0, pg_core_1.varchar)('user').notNull().references(() => exports.UserTable.name, { onDelete: 'cascade', onUpdate: 'cascade' }),
    text: (0, pg_core_1.varchar)('text').notNull(),
    timestamp: (0, pg_core_1.timestamp)('timestamp').defaultNow(),
    roomId: (0, pg_core_1.varchar)('roomId'),
    system: (0, pg_core_1.boolean)('system'),
});
//* Relations
exports.UserTableRelation = (0, drizzle_orm_1.relations)(exports.UserTable, ({ many }) => {
    return {
        messages: many(exports.messages)
    };
});
exports.messagesRelations = (0, drizzle_orm_1.relations)(exports.messages, ({ one }) => {
    return {
        author: one(exports.UserTable, {
            fields: [exports.messages.user],
            references: [exports.UserTable.name]
        }),
    };
});
