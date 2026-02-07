import { db } from "../index";
import { users } from "../schema";
import { eq } from "drizzle-orm";
export async function createUser(name) {
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}
export async function getUser(name) {
    try {
        const [result] = await db.select().from(users).where(eq(users.name, name));
        return result;
    }
    catch (err) {
        throw err;
    }
}
export async function resetUsers() {
    await db.delete(users).execute();
}
export async function getUsers() {
    const result = await db.select().from(users);
    return result;
}
