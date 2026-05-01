import type { ChatMessage } from "../services/api";

interface Props {
  message: ChatMessage;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 px-4 py-2 message-in ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
          N
        </div>
      )}

      {/* Message Content */}
      <div className="max-w-[75%]">
        <div
          className={`rounded-2xl px-4 py-3 whitespace-pre-wrap leading-relaxed text-sm ${
            isUser
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-sm"
              : "glass text-gray-200 rounded-tl-sm"
          }`}
        >
          {message.content}
        </div>

        {/* Agent badge */}
        {!isUser && message.agent_used && (
          <span className="text-[10px] text-gray-500 mt-1 inline-block">
            via {message.agent_used}
          </span>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
          A
        </div>
      )}
    </div>
  );
}
