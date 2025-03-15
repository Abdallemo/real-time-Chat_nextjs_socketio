"use client"

import { Loader2, LogOut, MessageCircle, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface HeaderProps {
  username: string
  isConnected: boolean
  isSigningOut?: boolean
  handleSignOut: () => void
  userImage?: string
  onlineUsers?: number
}

export default function Header({
  username,
  isConnected,
  isSigningOut = false,
  handleSignOut,
  userImage,
  onlineUsers,
}: HeaderProps) {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="border-b bg-primary text-primary-foreground shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <MessageCircle className="h-5 w-5" />
            <h1 className="text-xl font-bold">ChatSpace</h1>
          </div>

          <div className="ml-6 hidden items-center rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium md:flex">
            <div className={cn("mr-1.5 h-2 w-2 rounded-full", isConnected ? "bg-green-400" : "bg-red-400")} />
            {isConnected ? "Connected" : "Disconnected"}
          </div>

          <div className="hidden items-center rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium md:flex">
            <span>{onlineUsers} users online</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2 h-9 px-3 rounded-full">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={userImage} alt={username} />
                  <AvatarFallback>{getInitials(username)}</AvatarFallback>
                </Avatar>
                <span className="font-medium max-w-[100px] truncate">{username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isSigningOut ? (
                  <>
                    <span>Signing out</span>
                    <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                  </>
                ) : (
                  "Sign out"
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
