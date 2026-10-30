import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const cards = sqliteTable("cards", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameKana: text("name_kana").notNull().default(""),
  role: text("role").notNull().default(""),
  company: text("company").notNull().default(""),
  bio: text("bio").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  website: text("website").notNull().default(""),
  social: text("social").notNull().default(""),
  theme: text("theme").notNull().default("cobalt"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
