import { Card } from "@/components/ui/card";
import LoginForm from "./loginForm";
import { auth } from "@/auth";


export default async function Login() {

  const session  = await auth()
  console.log(session?.user)
  return (
    <main className="flex flex-col w-full h-screen items-center justify-center">
    <Card className="w-[300px] ">
    <LoginForm/>
    </Card>
    </main>
  )
}
