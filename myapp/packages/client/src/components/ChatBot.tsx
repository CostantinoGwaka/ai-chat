import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useRef, useCallback, type KeyboardEvent, useState } from "react";
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
  const [isBotTyping, setIsBotTyping] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = useCallback(
    async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: "user" }]);
      setIsBotTyping(true);
      reset();
      const { data } = await axios.post<ChatResponse>("/api/chat", {
        prompt,
        conversationId: conversationId.current,
      });

      console.log(data);
      setIsBotTyping(false);
      setMessages((prev) => [...prev, { content: data.message, role: "bot" }]);
    },
    [reset],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 mb-10">
        {messages.map((message, index) => (
          <p
            key={index}
            className={`px-3 py-1 rounded-xl
              ${
                message.role === "user"
                  ? "bg-blue-600 text-white self-end"
                  : "bg-gray-100 text-black self-start"
              }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </p>
        ))}
        {isBotTyping && (
          <div className="flex gap-1 px-3 py-3 bg-gray-200 rounded-xl self-start">
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
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
