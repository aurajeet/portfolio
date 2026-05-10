import { Container } from "@/components/layout/Container";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-rule">
      <Container>
        <div className="flex flex-col gap-3 py-10 font-sans text-[11px] uppercase tracking-[var(--tracking-eyebrow)] text-mute md:flex-row md:items-center md:justify-between md:py-12">
          <p>© {year} Portfolio</p>
          <p>Designed with restraint. Built in Next.js.</p>
        </div>
      </Container>
    </footer>
  );
}
