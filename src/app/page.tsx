import ChatApp from "./home"
import { auth } from "@/auth"


export  default async function Page() {

  const session = await auth()
  const user = session?.user
  
  console.log(user?.name)
  

  
  

  return (
    <>
    <ChatApp username={user?.name ?? ""}/>
    </>
  )

}