import type React from "react"

interface ChatMessageProps {
  message: {
    id: string
    user: string
    text: string
    timestamp: Date
    system: boolean
  }
  isOwnMessage: boolean
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  if (message.system) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">{message.text}</span>
      </div>
    )
  }

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[70%]`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwnMessage
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted text-foreground rounded-bl-none"
          }`}
        >
          {!isOwnMessage && <div className="font-semibold text-sm mb-1">{message.user}</div>}
          <p className="text-sm">{message.text}</p>
        </div>
        <div className={`text-xs text-muted-foreground mt-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage

