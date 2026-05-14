"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ChatMessage as ChatMessageType } from "@/lib/bot/tools";
import { cn } from "@/lib/cn";
import { ChatMessage } from "./ChatMessage";
import { SuggestedChips, type ChipLabel } from "./SuggestedChips";

// ---------------------------------------------------------------------------
// Constants — locked microcopy per AI Bot.md §8.6
// ---------------------------------------------------------------------------

const COPY = {
  header: "ASK MY AI ASSISTANT",
  disclosure:
    "AI trained on Aurajeet's portfolio. I answer in his voice — for anything binding, reach out directly.",
  placeholder: "Ask anything...",
  send: "Send message",
  close: "Close chat",
  moreQuestions: "MORE QUESTIONS",
  errors: {
    rateLimit:
      "Caught up for today. Email's at the bottom of the page if you want a faster path.",
    network: "Connection hiccup. Try again in a moment.",
    unknown:
      "I'm having trouble forming that thought. Try again, or rephrase?",
  },
} as const;

const DISCLOSURE_STORAGE_KEY = "ai-bot-disclosure-dismissed";

// Brief-mode intent detector — client-side regex on the FIRST user message.
// Matches "30 seconds", "in a hurry", "quick(ly)?", "tl;dr", "brief",
// "short version" / "short". Mirrors §8.4 exactly.
const BRIEF_INTENT_RE =
  /\b(30 ?seconds?|in a hurry|quick(?:ly)?|tl;?dr|brief|short(?: version)?)\b/i;

// `useSyncExternalStore` subscribe — no real subscription; we only need a
// one-shot read at mount and rely on local component state (set inside
// event handlers) to drive subsequent re-renders. React 19's lint rules
// allow this pattern as the canonical "read external state" hook, vs. the
// forbidden setState-in-effect pattern.
const noopSubscribe = () => () => {};

function readLocalStorageFlag(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeLocalStorageFlag(key: string) {
  try {
    window.localStorage.setItem(key, "1");
  } catch {}
}

// ---------------------------------------------------------------------------
// Drawer
// ---------------------------------------------------------------------------

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  const reduced = useReducedMotion();

  // ----- Brief mode (session-only, no UI banner) -----
  // Plain state — no ref bridge. The flag is captured at the call site in
  // `submitTurn` and passed per-request via `sendMessage`'s `body` option,
  // so the transport never needs to read it via closure.
  const [briefMode, setBriefMode] = useState(false);

  // ----- AI SDK chat hook -----
  const transport = useMemo(
    () => new DefaultChatTransport<ChatMessageType>({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, status, error, stop } =
    useChat<ChatMessageType>({ transport });

  const isBusy = status === "submitted" || status === "streaming";
  const hasTurns = messages.length > 0;

  // ----- AI disclosure banner (first open only) -----
  // External-state read via `useSyncExternalStore` (the React 19 canonical
  // alternative to setState-in-effect). Dismissal flips a session-local
  // state flag *and* writes the localStorage key from inside the event
  // handler — the next mount picks up the new value.
  const disclosureSeenInStorage = useSyncExternalStore(
    noopSubscribe,
    () => readLocalStorageFlag(DISCLOSURE_STORAGE_KEY),
    () => true,
  );
  const [disclosureDismissedThisSession, setDisclosureDismissedThisSession] =
    useState(false);
  const disclosureVisible =
    open && !disclosureSeenInStorage && !disclosureDismissedThisSession;

  function dismissDisclosure() {
    setDisclosureDismissedThisSession(true);
    writeLocalStorageFlag(DISCLOSURE_STORAGE_KEY);
  }

  // ----- Suggested chips visibility -----
  // Hidden permanently after the first turn renders; `MORE QUESTIONS →`
  // brings them back.
  const [chipsRequested, setChipsRequested] = useState(false);
  const showChips = !hasTurns || chipsRequested;

  // ----- Input -----
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow textarea — caps at ~4 lines visible, then scrolls.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const max = 4 * 22; // 22px line-height × 4
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
  }, [input]);

  // ----- Submit a turn -----
  const submitTurn = useCallback(
    (rawText: string, opts?: { forceBrief?: boolean }) => {
      const text = rawText.trim();
      if (!text || isBusy) return;

      // First user message triggers regex intent detection for brief mode.
      // Once briefMode is true, it stays true for the session (§8.4).
      const isFirstUserMessage = messages.length === 0;
      let next = briefMode;
      if (opts?.forceBrief) next = true;
      if (isFirstUserMessage && !next && BRIEF_INTENT_RE.test(text)) {
        next = true;
      }
      if (next !== briefMode) {
        setBriefMode(next);
      }

      setChipsRequested(false);
      setInput("");
      // briefMode is shipped per-request (rather than via a transport-level
      // closure) so the value is captured at the call site — no ref bridge,
      // no closure-during-render lint warning. The server route reads
      // `briefMode` off the request body and swaps system prompts.
      void sendMessage({ text }, { body: { briefMode: next } });
    },
    [briefMode, isBusy, messages.length, sendMessage],
  );

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitTurn(input);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitTurn(input);
    }
  }

  function handleChipPick(label: ChipLabel, isBrief: boolean) {
    submitTurn(label, { forceBrief: isBrief });
  }

  // ----- Auto-scroll body to bottom when messages or busy state change -----
  const bodyRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    // Defer to the next paint so the streamed-in node is laid out before we
    // measure scrollHeight. RAF + jump-to-bottom is good enough — no smooth
    // scroll, which would fight the streamed text.
    const id = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(id);
  }, [messages, isBusy]);

  // ----- Cancel mid-stream if the drawer closes -----
  useEffect(() => {
    if (!open && isBusy) {
      void stop();
    }
  }, [open, isBusy, stop]);

  // ----- Mobile drag-to-dismiss handler -----
  // Threshold: 120px drag OR > 600px/s flick. Below threshold, the spring
  // returns to 0. Desktop drawer disables drag via `dragConstraints` left/right
  // pinned to 0.
  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (info.offset.y > 120 || info.velocity.y > 600) {
      onClose();
    }
  }

  // ---------------------------------------------------------------------------
  // Render — guard the whole drawer behind `AnimatePresence` so exit animates.
  // ---------------------------------------------------------------------------

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="chat-drawer"
          role="dialog"
          aria-modal="false"
          aria-label="Chat with the portfolio"
          className={cn(
            // Position: bottom sheet on mobile, right drawer on desktop. No
            // scrim — the recruiter can keep scrolling the page alongside.
            "pointer-events-auto fixed z-50 flex flex-col bg-paper-pure",
            "inset-x-0 bottom-0 h-[90vh] border-t border-rule",
            "md:inset-y-0 md:right-0 md:left-auto md:h-screen md:w-[420px] md:max-w-full",
            "md:border-t-0 md:border-l md:border-rule",
          )}
          initial={
            reduced
              ? { opacity: 1, x: 0, y: 0 }
              : { x: 0, y: "100%", opacity: 1 }
          }
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={
            reduced
              ? { opacity: 0 }
              : { y: "100%", opacity: 1, transition: { duration: 0.4 } }
          }
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
          }
          // Mobile drag-to-dismiss — vertical only, disabled above the md
          // breakpoint by clamping `dragConstraints.top = 0` so down-only
          // movement is allowed. We additionally guard with a CSS-class-
          // driven `data-` attribute below if you need to override per env.
          drag={reduced ? false : "y"}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={handleDragEnd}
        >
          {/* Mobile drag handle — also tappable as a close affordance. The
              desktop drawer hides it. */}
          <div
            aria-hidden="true"
            className={cn(
              "mx-auto mt-1.5 h-1 w-9 flex-shrink-0 bg-rule md:hidden",
            )}
          />

          {/* Header */}
          <header
            className={cn(
              "flex flex-shrink-0 items-center justify-between border-b border-rule",
              "px-5 py-3.5",
            )}
          >
            <p
              className={cn(
                "font-sans text-[11px] font-medium uppercase text-ink",
                "tracking-[var(--tracking-eyebrow)]",
              )}
            >
              {COPY.header}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label={COPY.close}
              className={cn(
                "flex h-8 w-8 items-center justify-center text-ink",
                "cursor-pointer transition-opacity duration-200 ease-[var(--ease-luxe)] hover:opacity-60",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
              )}
            >
              <CloseIcon />
            </button>
          </header>

          {/* AI disclosure banner */}
          <AnimatePresence initial={false}>
            {disclosureVisible && (
              <motion.div
                key="disclosure"
                initial={reduced ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={
                  reduced ? { opacity: 0 } : { opacity: 0, height: 0 }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                }
                className="flex-shrink-0 border-b border-rule bg-paper"
              >
                <div className="flex items-start justify-between gap-3 px-5 py-3">
                  <p className="font-sans text-[11px] leading-snug text-ink">
                    {COPY.disclosure}
                  </p>
                  <button
                    type="button"
                    onClick={dismissDisclosure}
                    aria-label="Dismiss disclosure"
                    className={cn(
                      "flex h-6 w-6 flex-shrink-0 items-center justify-center text-mute",
                      "cursor-pointer transition-opacity duration-200 ease-[var(--ease-luxe)] hover:opacity-60",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                    )}
                  >
                    <CloseIcon size={10} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Body — scrollable message list OR empty-state with chips. */}
          <div
            ref={bodyRef}
            className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
          >
            {hasTurns ? (
              <ConversationView
                messages={messages}
                status={status}
                onNavigate={onClose}
              />
            ) : (
              <EmptyChipsState onPick={handleChipPick} />
            )}

            {/* Error surface — renders inline below the last turn. */}
            {error && hasTurns && (
              <ErrorRow message={resolveErrorCopy(error)} />
            )}
          </div>

          {/* MORE QUESTIONS link + footer input — sticky at the bottom. */}
          <div className="flex-shrink-0 border-t border-rule bg-paper-pure">
            <AnimatePresence initial={false}>
              {hasTurns && !showChips && (
                <motion.div
                  key="more-questions"
                  initial={
                    reduced ? false : { opacity: 0, height: 0 }
                  }
                  animate={{ opacity: 1, height: "auto" }}
                  exit={
                    reduced ? { opacity: 0 } : { opacity: 0, height: 0 }
                  }
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setChipsRequested(true)}
                    className={cn(
                      "block px-5 pt-3 font-sans text-[10px] font-medium uppercase",
                      "tracking-[var(--tracking-eyebrow)] text-mute",
                      "cursor-pointer transition-opacity duration-200 ease-[var(--ease-luxe)] hover:opacity-70",
                    )}
                  >
                    {COPY.moreQuestions}{" "}
                    <span aria-hidden="true">→</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inline chip grid if user re-summoned it post-first-turn. */}
            <AnimatePresence initial={false}>
              {hasTurns && chipsRequested && (
                <motion.div
                  key="chips-reopen"
                  initial={reduced ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={
                    reduced ? { opacity: 0 } : { opacity: 0, height: 0 }
                  }
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="overflow-hidden"
                >
                  <div className="px-5 pt-3 pb-1">
                    <SuggestedChips onPick={handleChipPick} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form
              onSubmit={handleFormSubmit}
              className="flex items-end gap-2 px-5 py-3"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={COPY.placeholder}
                rows={1}
                maxLength={1000}
                aria-label="Message input"
                className={cn(
                  "min-h-[44px] w-full resize-none border border-rule bg-paper px-3 py-2.5",
                  "font-sans text-base md:text-[13px] leading-[1.45] text-ink placeholder:text-mute",
                  "outline-none transition-colors duration-200 ease-[var(--ease-luxe)]",
                  "focus-visible:border-ink",
                )}
              />
              <button
                type="submit"
                disabled={!input.trim() || isBusy}
                aria-label={COPY.send}
                className={cn(
                  "flex h-11 w-11 flex-shrink-0 items-center justify-center",
                  "bg-ink text-paper",
                  "cursor-pointer transition-colors duration-200 ease-[var(--ease-luxe)]",
                  "hover:bg-ink-soft",
                  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                )}
              >
                <span aria-hidden="true" className="text-[16px] leading-none">
                  →
                </span>
              </button>
            </form>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Conversation view — renders messages with hairline dividers between turns
// ---------------------------------------------------------------------------

function ConversationView({
  messages,
  status,
  onNavigate,
}: {
  messages: ChatMessageType[];
  status: "submitted" | "streaming" | "ready" | "error";
  onNavigate: () => void;
}) {
  const lastIndex = messages.length - 1;

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message, i) => {
        const isLast = i === lastIndex;
        // Pre-token "thinking" state: the server has accepted the user's
        // message but the assistant message hasn't been created yet — we
        // need to render a phantom assistant bubble with just the caret so
        // the recruiter sees activity. We do that AFTER the map by checking
        // status === 'submitted' && lastRole === 'user'.
        const isStreaming =
          isLast &&
          message.role === "assistant" &&
          (status === "streaming" || status === "submitted");

        return (
          <div key={message.id} className="flex flex-col gap-3">
            {i > 0 && (
              <div
                aria-hidden="true"
                className="border-t border-rule/70"
              />
            )}
            <ChatMessage
              message={message}
              isStreaming={isStreaming}
              onNavigate={onNavigate}
            />
          </div>
        );
      })}

      {/* Thinking phantom — server has the message but no assistant turn
          exists yet. Renders an empty assistant bubble with the caret. */}
      {status === "submitted" &&
        messages[lastIndex]?.role === "user" && <ThinkingBubble />}
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex justify-start">
      <div
        className={cn(
          "max-w-[88%] border border-rule bg-paper-pure px-3.5 py-2.5",
          "flex min-h-[2.25rem] items-center",
        )}
      >
        <ThinkingCaret />
      </div>
    </div>
  );
}

function ThinkingCaret() {
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
          : {
              duration: 0.9,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.5, 1],
            }
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Empty state — eyebrow + chips, centered vertically
// ---------------------------------------------------------------------------

function EmptyChipsState({
  onPick,
}: {
  onPick: (label: ChipLabel, isBrief: boolean) => void;
}) {
  return (
    <div className="flex h-full min-h-[300px] flex-col justify-center">
      <p
        className={cn(
          "mb-5 text-center font-sans text-[10px] font-medium uppercase text-mute",
          "tracking-[var(--tracking-eyebrow)]",
        )}
      >
        SUGGESTED
      </p>
      <SuggestedChips onPick={onPick} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error row
// ---------------------------------------------------------------------------

function ErrorRow({ message }: { message: string }) {
  return (
    <p
      role="status"
      className={cn(
        "mt-4 border-l-2 border-ink px-3 py-2",
        "font-sans text-[12px] leading-snug text-ink",
      )}
    >
      {message}
    </p>
  );
}

function resolveErrorCopy(error: Error): string {
  const msg = error.message || "";
  if (/429|rate ?limit|too many/i.test(msg)) return COPY.errors.rateLimit;
  if (/network|fetch|failed to fetch|connection/i.test(msg))
    return COPY.errors.network;
  return COPY.errors.unknown;
}

// ---------------------------------------------------------------------------
// Close icon — hairline X drawn as two crossing strokes (matches the SVG
// mockup; avoids importing an icon library for one glyph).
// ---------------------------------------------------------------------------

function CloseIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
    >
      <path d="M1.5 1.5 L10.5 10.5 M10.5 1.5 L1.5 10.5" />
    </svg>
  );
}
