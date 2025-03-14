'use server'
import { userSchema } from "@/app/login/loginForm";
import { db } from "../../drizzle/client";
import { UserTable } from "../../drizzle/schema";
import { signIn } from "@/auth"

type CreateUserResponse =
    | { status: "success" }
    | { status: "error"; error: "Something Went Wrong" | "User Already Registered" };


export async function CreateUser(name: string, password: string): Promise<CreateUserResponse> {
    try {
        if (!name || !password) {
            return { status: "error", error: "Something Went Wrong" };
        }

        const existingUser = await db.query.UserTable.findFirst({
            where: (table, fn) => fn.eq(UserTable.name, name)
        });

        if (existingUser) {
            return { status: "error", error: "User Already Registered" };
        }

        await db.insert(UserTable).values({
            name,
            password
        }).returning();

        return { status: "success" };
    } catch (error) {
        console.error(error);
        return { status: "error", error: "Something Went Wrong" };
    }
}





export async function loginWithCridential(formData: userSchema) {
    try {
        console.log(signIn())
        await signIn('credentials', { redirectTo: '/', name: formData.name, password: formData.password })
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Invalid login credentials" };
    }
}
export async function SignUpWithCridential(formData: userSchema) {
    try {
        await CreateUser(formData.name, formData.password)
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Invalid login credentials" };
    }
}

export async function GetUserFromDb(name: string, password: string) {
    try {
        const result = await db.query.UserTable.findFirst({
            where: (table, fn) => fn.and(fn.eq(UserTable.name, name),
                fn.eq(UserTable.password, password))
        });
        return result

    } catch (error) {
        console.log(error)
        throw new Error("User Not Found.")

    }


}