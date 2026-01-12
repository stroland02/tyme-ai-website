'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export function AICoachChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your Tyme AI Coach. I've analyzed your recent activity and goals. How can I help you today?",
      createdAt: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      createdAt: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API (exclude welcome message if desired, or keep it)
      const apiHistory = messages.filter(m => m.id !== 'welcome').map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          messages: apiHistory
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        createdAt: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again.",
        createdAt: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "Chat cleared. What's on your mind?",
      createdAt: Date.now()
    }]);
  };

  return (
    <div className="flex flex-col h-[600px] border border-border rounded-xl bg-background/50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold">Tyme AI Coach</h3>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearChat}
          className="text-foreground-subtle hover:text-red-500"
          title="Clear Chat"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white",
                msg.role === 'user' ? "bg-primary" : "bg-indigo-600"
              )}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-foreground/10 text-foreground rounded-tl-sm border border-border"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 max-w-[85%]"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-foreground/10 border border-border p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about workouts, nutrition, or motivation..."
            className="flex-1 bg-background border border-border rounded-full px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            variant="primary" 
            disabled={!input.trim() || isLoading}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
