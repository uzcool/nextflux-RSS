import { db } from "@/db/database.js";

export const addCategory = (category) => db.categories.put(category);
export const getCategories = () => db.categories.toArray();
export const deleteAllCategory = () => db.categories.clear();
export const deleteCategory = (categoryId) => db.categories.delete(categoryId);
export const updateCategory = (categoryId, title) =>
  db.categories.update(categoryId, { title });
