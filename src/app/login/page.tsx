import { Card } from "@/components/ui/card";
import LoginForm from "./loginForm";



export default async function Login() {

  return (
    <main className="flex flex-col w-full h-screen items-center justify-center">
    <Card className="w-[300px] ">
    <LoginForm/>
    </Card>
    </main>
  )
}
