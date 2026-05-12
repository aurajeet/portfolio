"use client";

import { motion, useReducedMotion } from "framer-motion";
import ReactMarkdown, { type Components } from "react-markdown";
import type { ChatMessage as ChatMessageType } from "@/lib/bot/tools";
import { cn } from "@/lib/cn";
import { ChatActionCard } from "./ChatActionCard";

// `tool-{name}` parts carry their own input/state. We render once the model
// has produced a complete input (`input-available`) or final output
// (`output-available`); the brief `input-streaming` window — where `input`
// is a partial deep-partial — is suppressed to avoid flicker. Checks are
// inlined per-part so TypeScript's discriminated-union narrowing reaches
// both the `type` and `state` discriminators and `part.input` reads as the
// fully-typed shape.

interface ChatMessageProps {
  message: ChatMessageType;
  /** True for the LAST assistant message while the chat is mid-stream or
   *  awaiting first tokens — drives the blinking caret. The drawer is
   *  responsible for computing this from the AI SDK status. */
  isStreaming?: boolean;
  /** Called when a `navigateTo` pill is clicked — drawer closes itself so
   *  the Lenis smooth-scroll provider can run uninterrupted. */
  onNavigate?: () => void;
}

// Markdown rendering — bold, italic, lists, links. No images, no code blocks
// (the spec is explicit). Links open in a new tab with rel safety so the
// chat session isn't disrupted.
const markdownComponents: Components = {
  a: ({ href, children, ...rest }) => (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 hover:opacity-70"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-medium text-ink">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-1 list-disc space-y-1 pl-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-1 list-decimal space-y-1 pl-4">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-snug">{children}</li>,
  p: ({ children }) => <p className="leading-snug">{children}</p>,
  // Code formatting is intentionally suppressed per spec — render as plain
  // text so the model can still use backticks for emphasis without breaking
  // the visual restraint.
  code: ({ children }) => <span>{children}</span>,
  pre: ({ children }) => <span>{children}</span>,
};

export function ChatMessage({
  message,
  isStreaming = false,
  onNavigate,
}: ChatMessageProps) {
  if (message.role === "user") {
    return <UserMessage message={message} />;
  }
  if (message.role === "assistant") {
    return (
      <AssistantMessage
        message={message}
        isStreaming={isStreaming}
        onNavigate={onNavigate}
      />
    );
  }
  // System messages are never user-visible in our flow.
  return null;
}

// ---------- User bubble ----------

function UserMessage({ message }: { message: ChatMessageType }) {
  const text = message.parts
    .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join("");

  return (
    <div className="flex justify-end">
      <div
        className={cn(
          "max-w-[75%] bg-ink px-3.5 py-2.5 text-paper",
          "font-sans text-[14px] leading-[1.5]",
          "whitespace-pre-wrap break-words",
        )}
      >
        {text}
      </div>
    </div>
  );
}

// ---------- Assistant bubble ----------

function AssistantMessage({
  message,
  isStreaming,
  onNavigate,
}: {
  message: ChatMessageType;
  isStreaming: boolean;
  onNavigate?: () => void;
}) {
  // We render parts in order so text chunks and tool cards interleave as the
  // model emitted them. `text` parts get folded into adjacent prose for
  // tighter markdown rendering; tool parts break out into their own card.
  const nodes: React.ReactNode[] = [];
  let textBuffer = "";
  let textKey = 0;

  function flushText() {
    if (!textBuffer) return;
    const content = textBuffer;
    textBuffer = "";
    nodes.push(
      <div
        key={`text-${textKey++}`}
        className="font-sans text-[14px] leading-[1.5] text-ink"
      >
        <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
      </div>,
    );
  }

  for (const part of message.parts) {
    if (part.type === "text") {
      textBuffer += part.text;
      continue;
    }

    // Tool parts — discriminate by `part.type` and render the matching card
    // shape. We early-skip `input-streaming` so the card doesn't flash empty
    // while the model is still streaming its tool arguments.
    if (part.type === "tool-navigateTo") {
      flushText();
      if (
        part.state === "input-available" ||
        part.state === "output-available"
      ) {
        nodes.push(
          <ChatActionCard
            key={part.toolCallId}
            kind="navigate"
            section={part.input.section}
            onNavigate={onNavigate}
          />,
        );
      }
      continue;
    }

    if (part.type === "tool-openProject") {
      flushText();
      if (
        part.state === "input-available" ||
        part.state === "output-available"
      ) {
        nodes.push(
          <ChatActionCard
            key={part.toolCallId}
            kind="project"
            slug={part.input.slug}
          />,
        );
      }
      continue;
    }

    if (part.type === "tool-downloadResume") {
      flushText();
      if (
        part.state === "input-available" ||
        part.state === "output-available"
      ) {
        nodes.push(
          <ChatActionCard key={part.toolCallId} kind="resume" />,
        );
      }
      continue;
    }

    if (part.type === "tool-getContact") {
      flushText();
      if (
        part.state === "input-available" ||
        part.state === "output-available"
      ) {
        nodes.push(
          <ChatActionCard key={part.toolCallId} kind="contact" />,
        );
      }
      continue;
    }
    // Other part kinds (reasoning, sources, files, dynamic-tool) are ignored
    // in v1 — the bot's tool surface is closed and the system prompt
    // disables reasoning output.
  }

  flushText();

  const hasContent = nodes.length > 0;

  return (
    <div className="flex justify-start">
      <div
        className={cn(
          "max-w-[88%] border border-rule bg-paper-pure px-3.5 py-2.5",
          "flex min-h-[2.25rem] flex-col gap-3",
        )}
      >
        {hasContent ? nodes : null}
        {isStreaming && <StreamingCaret />}
      </div>
    </div>
  );
}

// ---------- Streaming caret ----------
//
// Single visual treatment for both "thinking" (pre-token) and "streaming"
// (mid-token) per §3 locked decision. Framer Motion's `repeat: Infinity`
// opacity loop avoids touching `app/globals.css` to register a keyframe.
// `useReducedMotion` short-circuits to a solid bar.
function StreamingCaret() {
  const reduced = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      className="inline-block h-[1em] w-[2px] bg-ink align-text-bottom"
      initial={{ opacity: 1 }}
      animate={reduced ? { opacity: 1 } : { opacity: [1, 0, 1] }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.9, repeat: Infinity, ease: "linear", times: [0, 0.5, 1] }
      }
    />
  );
}
