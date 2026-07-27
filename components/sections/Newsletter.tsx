"use client";

import { useState } from "react";
import { Section, Card, Button, cn } from "../ui";
import { Icon } from "../icons";
import type { Dict } from "@/lib/i18n";

export default function Newsletter({ dict }: { dict: Dict }) {
  const t = dict.newsletter;
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("done");
  }

  return (
    <Section>
      <Card className="grid w-full items-center gap-8 p-8 sm:p-12 lg:grid-cols-2" data-reveal>
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-[2rem] leading-[1.12] tracking-[0.01em] text-ink sm:text-heading">
            {t.title}
          </h2>
          <p className="max-w-[440px] text-body text-muted">{t.description}</p>
        </div>

        <div className="lg:justify-self-end lg:w-full lg:max-w-[420px]">
          {state === "done" ? (
            <p className="flex items-center gap-2 rounded-pill bg-chip px-5 py-4 text-body text-ink" role="status">
              <Icon name="check" className="size-4 text-success" />
              {t.success}
            </p>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  {t.placeholder}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  placeholder={t.placeholder}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                  }}
                  aria-invalid={state === "error"}
                  aria-describedby={state === "error" ? "newsletter-error" : undefined}
                  className={cn(
                    "h-11 flex-1 rounded-pill border bg-surface px-5 text-body text-ink placeholder:text-muted-2 focus:outline-none focus-visible:border-ink",
                    state === "error" ? "border-danger" : "border-line-strong"
                  )}
                />
                <Button type="submit">{t.button}</Button>
              </div>
              {state === "error" && (
                <p id="newsletter-error" role="alert" className="text-eyebrow text-danger">
                  {t.invalid}
                </p>
              )}
              <p className="text-eyebrow text-muted-2">{t.privacy}</p>
            </form>
          )}
        </div>
      </Card>
    </Section>
  );
}
