import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { GetUserFromDb } from "./lib/action";
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
  
    Credentials({
      credentials: {
        name: {},
        password: {},
      },
      async authorize(credentials) {
        console.log(credentials)

        const user = await GetUserFromDb(credentials?.name as string, credentials?.password as string);


        if (!user) {
          throw new Error("Invalid credentials.");
        }
        return user;
      },
    }),
  ],
  session:{
    strategy:'jwt',
    maxAge:2592000
  },
  secret:process.env.NEXTAUTH_SECRET
});
