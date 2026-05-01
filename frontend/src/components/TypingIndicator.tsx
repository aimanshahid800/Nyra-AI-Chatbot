export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-2 message-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
        N
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-purple-400 typing-dot"></div>
        <div className="w-2 h-2 rounded-full bg-purple-400 typing-dot"></div>
        <div className="w-2 h-2 rounded-full bg-purple-400 typing-dot"></div>
      </div>
    </div>
  );
}
