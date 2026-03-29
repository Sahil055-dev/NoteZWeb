"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import supabase from "@/app/API/supabase";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "model";
  content: string;
}

interface AiWorkspaceChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteId?: string;
  prefilledText?: string;
}

export default function AiWorkspaceChat({
  open,
  onOpenChange,
  noteId,
  prefilledText,
}: AiWorkspaceChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Prefill input when selected text changes
  useEffect(() => {
    if (prefilledText) {
      setInput((prev) => prev ? `${prev}\n\n"${prefilledText}"\n` : `"${prefilledText}"\n`);
    }
  }, [prefilledText]);

  // Load chat history
  useEffect(() => {
    if (!open || !noteId) return;

    const fetchHistory = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("ai_chat_history")
        .select("messages")
        .eq("note_id", noteId)
        .eq("user_id", session.user.id)
        .single();

      if (data && data.messages) {
        setMessages(data.messages as Message[]);
      }
    };
    fetchHistory();
  }, [open, noteId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const saveHistory = async (newMessages: Message[]) => {
    if (!noteId) return;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    await supabase
      .from("ai_chat_history")
      .upsert(
        {
          user_id: session.user.id,
          note_id: noteId,
          messages: newMessages,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id, note_id" }
      );
  };

  const clearHistory = async () => {
    setMessages([]);
    await saveHistory([]);
    toast.success("Chat history cleared");
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Create prompt history for Gemini
      const contents = updatedMessages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key is not configured in environment variables.");
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contents }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch response from AI");
      }

      const data = await res.json();
      const aiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't process that request.";

      const aiMessage: Message = { role: "model", content: aiText };
      const newHistory = [...updatedMessages, aiMessage];
      setMessages(newHistory);
      
      // Save full chat history
      await saveHistory(newHistory);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to get AI response");
      // Optionally pop the user message if it failed or keep it.
      // We will keep it but let them try again.
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col h-full bg-background border-l border-secondary/20"
      >
        <SheetHeader className="p-4 border-b border-border/40 shrink-0 bg-muted/20">
          <div className="flex justify-between items-center pr-8">
            <SheetTitle className="flex items-center gap-2 text-primary">
              <Bot className="w-5 h-5" />
              AI Study Assistant
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearHistory}
              title="Clear Chat History"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <SheetDescription className="text-secondary/70">
            Ask questions about your notes, request summaries, or let Gemini analyze the content.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 p-2 sm:p-4 overflow-y-auto overflow-x-hidden" ref={scrollRef}>
          <div className="flex flex-col gap-4 pb-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground mt-20 opacity-50">
                <Bot className="w-12 h-12 mb-4" />
                <p>Start a conversation...</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-1.5 sm:gap-3 max-w-full md:max-w-[85%] ${
                      msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                  <div
                    className={`size-8 shrink-0 rounded-full flex items-center justify-center ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={16} />
                    ) : (
                      <Bot size={16} />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-3 py-2 sm:px-4 overflow-x-auto ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm w-full"
                    }`}
                  >
                    <div className="text-xs sm:text-sm prose prose-sm dark:prose-invert max-w-full break-words overflow-hidden prose-p:leading-relaxed prose-pre:p-0">
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }: any) {
                            return !inline ? (
                              <div className="relative rounded-md my-2 sm:my-4 bg-zinc-950/90 p-2 sm:p-4 border border-border/40 overflow-x-auto max-w-full">
                                <code 
                                  className="text-primary-foreground text-[11px] sm:text-sm whitespace-pre" 
                                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                  {...props}
                                >
                                  {children}
                                </code>
                              </div>
                            ) : (
                              <code 
                                className="bg-primary/20 text-primary px-1 py-0.5 rounded-sm text-[11px] sm:text-xs" 
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                {...props}
                              >
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="size-8 shrink-0 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
                  <Bot size={16} />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-muted text-foreground rounded-tl-sm flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  <span className="text-xs text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/40 shrink-0 bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 relative"
          >
            <Input
              placeholder="Ask anything about this document..."
              className="flex-1 pr-12 focus-visible:ring-primary h-12 rounded-full bg-muted/50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
