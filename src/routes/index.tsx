import { createFileRoute } from "@tanstack/react-router";
import { GoldWaves } from "@/components/GoldWaves";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Edwin Thompson — The Gateway" },
      { name: "description", content: "Enter the Edwin Thompson collection: the pinnacle of digital and physical craftsmanship." },
      { property: "og:title", content: "Edwin Thompson — The Gateway" },
      { property: "og:description", content: "The pinnacle of digital and physical craftsmanship." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Crest() {
  return (
    <svg viewBox="0 0 200 200" className="crest h-[250px] w-[250px] text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="100,10 180,55 180,145 100,190 20,145 20,55" />
      <polygon points="100,35 158,68 158,132 100,165 42,132 42,68" strokeWidth="0.8" />
      <path d="M100 35 V165 M42 68 L158 132 M158 68 L42 132" strokeWidth="0.6" opacity="0.6" />
      <circle cx="100" cy="100" r="22" />
      <text x="100" y="108" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="Cinzel" fontSize="22">ET</text>
    </svg>
  );
}

function Index() {
  return (
    <main className="relative z-10 text-foreground">
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6">
        <Crest />
        <h1 className="font-display text-2xl tracking-[0.6em] text-gold md:text-4xl">EDWIN THOMPSON</h1>
        <a href="#vision" className="scroll-cue absolute bottom-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.4em] text-gold">
          Scroll to Enter
          <span className="block h-8 w-px bg-gold" />
        </a>
      </section>

      <section id="vision" className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="glass max-w-3xl rounded-sm px-8 py-16 text-center md:px-16">
          <p className="font-display text-xl leading-relaxed md:text-3xl">
            Enter a new paradigm of luxury. The Edwin Thompson collection represents the pinnacle of digital and physical craftsmanship.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-24">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {["Phase I", "Phase II", "Phase III"].map((p, i) => (
            <div key={p} className="vault-card flex h-[480px] flex-col justify-between p-8">
              <span className="text-xs tracking-[0.4em] text-muted-foreground">0{i + 1}</span>
              <div>
                <svg viewBox="0 0 24 24" className="mb-6 h-8 w-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="5" y="11" width="14" height="10" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <h3 className="font-display text-2xl tracking-[0.3em]">{p.toUpperCase()}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">Locked Collection</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-background/80 py-10 text-center text-xs tracking-[0.3em] text-gold">
        © Edwin Thompson. Highly Confidential.
      </footer>
      <GoldWaves />
    </main>
  );
}
