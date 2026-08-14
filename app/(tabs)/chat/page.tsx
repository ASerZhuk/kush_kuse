"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import Eyebrow from "@/components/ui/Eyebrow";
import Status from "@/components/ui/Status";
import GlassLayer from "@/components/GlassLayer";
import logoMark from "@/app/assets/Logo.svg";
import clipIcon from "@/app/assets/clip.svg";
import arrowUpIcon from "@/app/assets/arrow-up.svg";

type Message = { id: string; role: "bot" | "user"; text: string };

const GREETING =
  "Здравствуйте. Я miss Kusé — ваш консьерж. Я рядом — и для неё, и для вас.\nСпросите о чём угодно. Если вопросу нужен врач — приглашу специалиста прямо в этот диалог.";

const CANNED_REPLY =
  "Спасибо, записала. Пока отвечаю по шаблону — скоро здесь будет полноценный ассистент. Если нужен врач, нажмите «Пригласить специалиста».";

const SPECIALIST_REPLY =
  "Приглашаю специалиста. Ветеринар подключится к этому диалогу в течение 15 минут — вся история уже у него.";

const SUGGESTIONS = ["Она сегодня мало ела", "Какой у неё вес?", "Когда на прививку"];

let idCounter = 0;
const nextId = () => `m${idCounter++}`;

function Bubble({ role, text }: { role: Message["role"]; text: string }) {
  const [visible, setVisible] = useState(false);
  const isBot = role === "bot";

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`max-w-[80%] whitespace-pre-line rounded-3xl px-4 py-3 text-body-s transition-[opacity,transform] duration-300 ease-out ${
        isBot ? "self-start rounded-bl-md bg-grey-50 text-dark" : "self-end rounded-br-md bg-dark text-white"
      } ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
    >
      {text}
    </div>
  );
}

function TypingBubble() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`flex w-fit items-center gap-1 self-start rounded-3xl rounded-bl-md bg-grey-50 px-4 py-3.5 transition-[opacity,transform] duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-grey-300"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [specialistInvited, setSpecialistInvited] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Первое сообщение бота приходит с задержкой и через "печатает…",
  // как в обычных мессенджерах — иначе пустой экран выглядит сломанным.
  useEffect(() => {
    const showTyping = setTimeout(() => setTyping(true), 900);
    const showGreeting = setTimeout(() => {
      setTyping(false);
      setMessages([{ id: nextId(), role: "bot", text: GREETING }]);
    }, 2400);
    return () => {
      clearTimeout(showTyping);
      clearTimeout(showGreeting);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = (text: string) => {
    const value = text.trim();
    if (!value) return;

    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: value }]);
    setInput("");

    setTimeout(() => setTyping(true), 400);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: nextId(), role: "bot", text: CANNED_REPLY }]);
    }, 1800);
  };

  const handleInviteSpecialist = () => {
    if (specialistInvited) return;
    setSpecialistInvited(true);

    setTimeout(() => setTyping(true), 400);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: nextId(), role: "bot", text: SPECIALIST_REPLY }]);
    }, 1800);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white pb-52">
      <div className="flex items-center justify-between gap-2 px-margin pt-[calc(1rem+env(safe-area-inset-top))] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-gradient-300 text-dark">
            <Image src={logoMark} alt="" className="h-3 w-5" />
          </div>
          <div>
            <p className="text-body-s text-dark">miss Kusé</p>
            {specialistInvited ? (
              <Status variant="success" className="mt-1">
                Специалист приглашён
              </Status>
            ) : (
              <p className="text-caption text-grey-300">Ваш консьерж</p>
            )}
          </div>
        </div>
        {!specialistInvited && (
          <Button
            variant="primary"
            fullWidth={false}
            className="flex-none! w-auto px-4 text-body-s"
            onClick={handleInviteSpecialist}
          >
            Пригласить специалиста
          </Button>
        )}
      </div>

      <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-margin">
        {(messages.length > 0 || typing) && (
          <Eyebrow className="mx-auto my-1" textClassName="text-grey-300">
            сегодня
          </Eyebrow>
        )}
        {messages.map((message) => (
          <Bubble key={message.id} role={message.role} text={message.text} />
        ))}
        {typing && <TypingBubble />}
      </div>

      <div className="fixed inset-x-4 bottom-[calc(148px+env(safe-area-inset-bottom))] z-10 mx-auto flex max-w-89.5 gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SUGGESTIONS.map((suggestion) => (
          <Chip
            key={suggestion}
            className="w-auto flex-none whitespace-nowrap text-body-s"
            onClick={() => handleSend(suggestion)}
          >
            {suggestion}
          </Chip>
        ))}
      </div>

      <div className="fixed inset-x-4 bottom-[calc(88px+env(safe-area-inset-bottom))] z-10 mx-auto flex max-w-89.5 items-center gap-2">
        <div className="flex h-12 flex-1 items-center gap-1 rounded-[40px] bg-grey pl-4 pr-1">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleSend(input)}
            placeholder="Напишите вопрос..."
            className="h-full flex-1 bg-transparent text-body-s text-dark outline-none placeholder:text-grey-300"
          />
          <button
            type="button"
            aria-label="Прикрепить файл"
            className="flex h-10 w-10 flex-none items-center justify-center"
          >
            <Image src={clipIcon} alt="" className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => handleSend(input)}
          aria-label="Отправить"
          className="backdrop-glass backdrop-glass-sm relative flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full active:opacity-70"
        >
          <GlassLayer depth={4} strength={10} chromaticAberration={1} blur={2} />
          <Image src={arrowUpIcon} alt="" className="relative z-10 h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
