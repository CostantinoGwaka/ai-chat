import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import {
  useRef,
  useCallback,
  type KeyboardEvent,
  useState,
  useEffect,
} from "react";
import axios from "axios";

type FormData = {
  prompt: string;
};

type ChatResponse = {
  id: string;
  message: string;
};

type Message = {
  content: string;
  role: "user" | "bot";
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const conversationId = useRef(crypto.randomUUID());
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = useCallback(
    async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: "user" }]);
      setIsBotTyping(true);
      setError(null);
      reset({ prompt: "" });
      try {
        const { data } = await axios.post<ChatResponse>("/api/chat", {
          prompt,
          conversationId: conversationId.current,
        });

        // console.log(data);
        setMessages((prev) => [
          ...prev,
          { content: data.message, role: "bot" },
        ]);
      } catch (err) {
        const errorMessage =
          err instanceof axios.AxiosError
            ? err.response?.data?.message || err.message
            : "An error occurred";
        setError("Sorry, something went wrong. Please try again.");
        console.error(errorMessage);
      } finally {
        setIsBotTyping(false);
      }
    },
    [reset],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const onCopy = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      // navigator.clipboard.writeText(selection);
      e.clipboardData.setData("text/plain", selection);
    }
  };

  return (
    <div className="flex flex-col  h-full p-4 rounded-3xl">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            onCopy={onCopy}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`px-3 py-1 rounded-xl
              ${
                message.role === "user"
                  ? "bg-blue-600 text-white self-end"
                  : "bg-gray-100 text-black self-start"
              }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        {isBotTyping && (
          <div className="flex gap-1 px-3 py-3 bg-gray-200 rounded-xl self-start">
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
          </div>
        )}

        {error && (
          <div className="px-3 py-1 rounded-xl bg-red-100 text-red-800 self-start">
            {error}
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => handleSubmit(onSubmit)(e)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
        <textarea
          {...register("prompt", {
            required: true,
            validate: (data) => data.trim().length > 0,
          })}
          autoFocus
          placeholder="Ask Anything"
          className="w-full border-0 focus:outline-0 resize-none"
          maxLength={1000}
        ></textarea>
        <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
