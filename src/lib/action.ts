'use server'
import { db } from "../../drizzle/client";
import { UserTable } from "../../drizzle/schema";

export async function createUser(name: string) {

try {
        const exsistingUser = await db.query.UserTable.findFirst({where:(table,fn)=>fn.eq(UserTable.name,name)});
        if (exsistingUser) return
        console.log(exsistingUser);
       await db.insert(UserTable).values({
            name
        })
        
} catch (error) {
    console.log(error)
    return error

}


}