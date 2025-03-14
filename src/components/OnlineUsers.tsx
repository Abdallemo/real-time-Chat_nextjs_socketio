import type React from "react"
import { User } from "lucide-react"

interface OnlineUsersProps {
  users: string[]
  currentUser: string
}

const OnlineUsers: React.FC<OnlineUsersProps> = ({ users, currentUser }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Online Users</h2>
        <p className="text-xs text-muted-foreground">{users.length} active now</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-2">
          {users.map((user, index) => (
            <li
              key={index}
              className={`flex items-center p-2 rounded-md ${user === currentUser ? "bg-muted" : "hover:bg-muted/50"}`}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium">{user}</span>
                {user === currentUser && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">You</span>
                )}
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-green-500"></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default OnlineUsers

