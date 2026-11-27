"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { StoreImage } from "@/components/ui/StoreImage";

const slides = [
  {
    image: "/images/photos/hero/hero-living.webp",
    mobileImage: "/images/photos/hero/hero-living-mobile.webp",
    eyebrow: "An original furniture and interior concept",
    title: "A home should feel like you.",
    text: "Haven & Oak is a point of view on rooms, materials and everyday living. This is our story—not a shop.",
    cta: "Meet the concept",
    href: "/pages/about",
  },
  {
    image: "/images/photos/hero/hero-bedroom.webp",
    mobileImage: "/images/photos/hero/hero-bedroom-mobile.webp",
    eyebrow: "A calmer point of view",
    title: "Less noise. More meaning.",
    text: "We explore how natural texture, thoughtful proportion and simple details can make a space feel personal.",
    cta: "Read our design approach",
    href: "/pages/design-services",
  },
  {
    image: "/images/photos/hero/hero-dining.webp",
    mobileImage: "/images/photos/hero/hero-dining-mobile.webp",
    eyebrow: "Made for gathering",
    title: "Room for the moments that matter.",
    text: "From quiet mornings to long dinners, our editorial stories celebrate the rituals that make a house a home.",
    cta: "Explore room inspiration",
    href: "#inspiration",
  },
];

function EditorialLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center gap-2 border-b border-current pb-1 text-sm font-semibold hover:gap-3">
      {children} <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

function Hero() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const slide = slides[index];

  return (
    <section
      aria-label="Haven and Oak brand stories"
      aria-roledescription="carousel"
      className="relative min-h-[580px] overflow-hidden bg-footer text-white lg:min-h-[680px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;
        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) setFocused(false);
      }}
    >
      {slides.map((item, slideIndex) => (
        <div
          key={item.image}
          className={`absolute inset-0 transition-opacity duration-700 ${slideIndex === index ? "opacity-100" : "opacity-0"}`}
          aria-hidden={slideIndex !== index}
        >
          <picture className="relative block h-full w-full">
            <source media="(max-width: 639px)" srcSet={item.mobileImage} />
            <StoreImage
              src={item.image}
              alt={slideIndex === index ? `${item.title} Interior inspiration` : ""}
              priority={slideIndex === 0}
              sizes="100vw"
            />
          </picture>
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-footer/90 via-footer/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-footer/50 via-transparent to-transparent" />
      <div className="container-shell relative flex min-h-[580px] items-center py-20 lg:min-h-[680px]">
        <div className="max-w-2xl" aria-live={paused ? "polite" : "off"}>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">{slide.eyebrow}</p>
          <h1 className="mt-5 font-heading text-[44px] font-bold leading-[1.06] sm:text-6xl lg:text-7xl">{slide.title}</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">{slide.text}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <EditorialLink href={slide.href}>{slide.cta}</EditorialLink>
            <EditorialLink href="#inspiration">View inspiration</EditorialLink>
          </div>
        </div>
      </div>
      <div className="container-shell absolute inset-x-0 bottom-6 flex items-center justify-between">
        <div className="flex gap-2" role="group" aria-label="Choose featured story">
          {slides.map((item, slideIndex) => (
            <button
              key={item.title}
              type="button"
              className={`flex h-11 items-center px-1 ${slideIndex === index ? "text-white" : "text-white/60"}`}
              aria-label={`Show story ${slideIndex + 1}: ${item.title}`}
              aria-current={slideIndex === index ? "true" : undefined}
              onClick={() => setIndex(slideIndex)}
            >
              <span className={`block h-1 rounded-full transition-all ${slideIndex === index ? "w-8 bg-white" : "w-4 bg-white/60"}`} />
            </button>
          ))}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button type="button" className="icon-button border border-white/40 text-white hover:bg-white/10 hover:text-white" aria-label="Previous story" onClick={() => setIndex((index - 1 + slides.length) % slides.length)}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" className="icon-button border border-white/40 text-white hover:bg-white/10 hover:text-white" aria-label="Next story" onClick={() => setIndex((index + 1) % slides.length)}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function BrandIntro() {
  return (
    <section className="section container-shell" aria-labelledby="brand-intro-heading">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent">Welcome to Haven &amp; Oak</p>
          <h2 id="brand-intro-heading" className="mt-4 max-w-lg font-heading text-4xl font-semibold leading-tight sm:text-5xl">
            What is Haven &amp; Oak?
          </h2>
        </div>
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
          <p>
            Haven &amp; Oak is an original furniture and interior-inspiration concept created for this frontend showcase.
            It explores how rooms can feel warm, useful and personal through photography, editorial stories and practical design ideas.
          </p>
          <p>
            This homepage is deliberately informational. Nothing pictured here is offered for sale, and there are no prices,
            product cards or cart controls. The illustrative catalogue and mock shopping experience live on separate pages.
          </p>
          <p className="border-t border-line pt-5 text-sm text-ink">
            An independent portfolio concept—not a retailer, not affiliated with a furniture brand, and not a real service.
          </p>
        </div>
      </div>
    </section>
  );
}

function OpeningImage() {
  return (
    <section aria-label="The Haven and Oak perspective" className="relative h-[52vh] min-h-[420px] bg-footer">
      <StoreImage src="/images/photos/rooms/living-room.webp" alt="A warm living room with natural wood, soft seating and collected details" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-footer/80 via-transparent to-transparent" />
      <div className="container-shell absolute inset-x-0 bottom-0 flex flex-col justify-between gap-4 pb-8 text-white sm:flex-row sm:items-end">
        <p className="max-w-xl font-heading text-2xl leading-snug sm:text-3xl">Rooms with a sense of life, not just a finished look.</p>
        <p className="text-xs uppercase tracking-[.16em] text-white/75">The Haven &amp; Oak point of view</p>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="section container-shell" aria-labelledby="story-heading">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/5] bg-surface">
          <StoreImage src="/images/photos/rooms/lookbook-living-room.webp" alt="A collected living room with warm wood and tactile fabrics" sizes="(max-width: 1024px) 100vw, 45vw" />
        </div>
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent">Our point of view</p>
          <h2 id="story-heading" className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">Collected, not decorated.</h2>
          <div className="mt-6 space-y-5 leading-relaxed text-muted">
            <p>We are interested in rooms with a sense of life: a well-loved chair, a table made for conversation, a shelf that slowly tells the story of the people who live there.</p>
            <p>Our visual language pairs warm wood, soft upholstery, earthy colour and quiet silhouettes. The goal is not a perfect room. It is a room that feels comfortable, useful and unmistakably personal.</p>
          </div>
          <div className="mt-8"><EditorialLink href="/pages/about">Read the Haven &amp; Oak story</EditorialLink></div>
        </div>
      </div>
    </section>
  );
}

const values = [
  { number: "01", title: "Considered proportions", text: "Scale, balance and useful details come first, so each idea can sit naturally within a room." },
  { number: "02", title: "Warm, tactile materials", text: "Wood grain, woven fabric and earthy finishes create depth without relying on visual noise." },
  { number: "03", title: "Designed for living", text: "Comfort and everyday function matter as much as appearance. A home should work for real routines." },
];

function DesignValues() {
  return (
    <section className="section bg-primary text-white" aria-labelledby="values-heading">
      <div className="container-shell">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">What guides us</p>
          <h2 id="values-heading" className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">Simple ideas. Thoughtfully applied.</h2>
          <p className="mt-5 max-w-2xl text-footer-text">These principles shape the imagery, stories and illustrative rooms throughout this concept.</p>
        </div>
        <div className="mt-12 border-t border-white/25">
          {values.map((value) => (
            <article key={value.number} className="grid gap-3 border-b border-white/25 py-7 md:grid-cols-[80px_1fr_1.2fr] md:gap-8">
              <span className="font-heading text-2xl text-gold">{value.number}</span>
              <h3 className="font-heading text-2xl font-semibold">{value.title}</h3>
              <p className="max-w-xl text-sm leading-relaxed text-footer-text">{value.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoomInspiration() {
  const ideas = [
    { title: "Living", text: "Soft layers, useful surfaces and enough open space for the room to breathe." },
    { title: "Rest", text: "Quiet colour, tactile bedding and restrained light for slower evenings." },
    { title: "Gather", text: "Comfortable seating and generous tables that invite people to stay a little longer." },
    { title: "Work", text: "Calm backgrounds, practical storage and personal details that make focus feel natural." },
  ];

  return (
    <section id="inspiration" className="scroll-mt-40" aria-labelledby="rooms-heading">
      <div className="relative h-[62vh] min-h-[500px] bg-footer">
        <StoreImage src="/images/photos/rooms/bedroom.webp" alt="A calm bedroom with layered neutral fabrics and natural light" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-footer/85 via-footer/15 to-transparent" />
        <div className="container-shell absolute inset-x-0 bottom-0 pb-10 text-white">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">Room by room</p>
          <h2 id="rooms-heading" className="mt-4 max-w-3xl font-heading text-4xl font-semibold sm:text-6xl">Inspiration for the way you live.</h2>
          <p className="mt-5 max-w-2xl text-white/85">Not a formula for a perfect room—just ideas about atmosphere, materials and the details that make everyday spaces feel more human.</p>
        </div>
      </div>
      <div className="section container-shell">
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {ideas.map((idea) => (
            <div key={idea.title} className="border-t border-line pt-5">
              <h3 className="font-heading text-2xl font-semibold">{idea.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{idea.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DesignProcess() {
  const steps = [
    { number: "01", title: "Begin with the room", text: "Consider light, movement, daily routines and the way a space needs to feel before choosing a direction." },
    { number: "02", title: "Build a visual language", text: "Colour, texture, proportion and a few repeated details bring cohesion without making everything match." },
    { number: "03", title: "Leave room for life", text: "The best spaces evolve. Favour flexible ideas and thoughtful layers over rigid, finished-in-one-day rooms." },
  ];

  return (
    <section id="design-process" className="section bg-surface scroll-mt-40" aria-labelledby="process-heading">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent">How a room comes together</p>
          <h2 id="process-heading" className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">From first idea to final detail.</h2>
          <div className="mt-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 border-b border-line py-6 last:border-b-0">
                <span className="font-heading text-2xl font-semibold text-accent">{step.number}</span>
                <div><h3 className="font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative order-1 aspect-[4/5] bg-line lg:order-2">
          <StoreImage src="/images/photos/rooms/lookbook-bedroom.webp" alt="A calm bedroom styled with layered natural materials" sizes="(max-width: 1024px) 100vw, 45vw" />
        </div>
      </div>
    </section>
  );
}

function MaterialStories() {
  return (
    <section className="section container-shell" aria-labelledby="materials-heading">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent">The things we return to</p>
        <h2 id="materials-heading" className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">Texture gives a room its depth.</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">A woven throw, the grain of a timber table, the softness of a well-used chair. Materials matter because they change with light, touch and time.</p>
      </div>
      <div className="mt-12 grid items-start gap-8 md:grid-cols-12">
        <figure className="md:col-span-7">
          <div className="relative aspect-[4/3] bg-surface"><StoreImage src="/images/photos/rooms/dining-room.webp" alt="A dining room with natural wood and a warm, tactile finish" sizes="(max-width: 768px) 100vw, 58vw" /></div>
          <figcaption className="mt-3 text-xs uppercase tracking-[.14em] text-muted">Natural wood · honest grain · everyday use</figcaption>
        </figure>
        <figure className="md:col-span-4 md:col-start-9 md:mt-20">
          <div className="relative aspect-[4/5] bg-surface"><StoreImage src="/images/photos/rooms/outdoor.webp" alt="An outdoor room with textured seating and greenery" sizes="(max-width: 768px) 100vw, 32vw" /></div>
          <figcaption className="mt-3 text-xs uppercase tracking-[.14em] text-muted">Open air · soft weathering · slower days</figcaption>
        </figure>
      </div>
    </section>
  );
}

function DesignServices() {
  return (
    <section className="section border-y border-line" aria-labelledby="services-heading">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/3] bg-surface">
          <StoreImage src="/images/photos/rooms/home-office.webp" alt="A thoughtful home office with natural light and calm materials" sizes="(max-width: 1024px) 100vw, 45vw" />
        </div>
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent">A little guidance</p>
          <h2 id="services-heading" className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">Bringing a room into focus.</h2>
          <p className="mt-5 leading-relaxed text-muted">Our concept design approach explores room planning, finish coordination and the small decisions that help a space feel resolved. It is presented here as an informational demo, not a bookable service.</p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            <EditorialLink href="/pages/design-services">Explore the design approach</EditorialLink>
            <EditorialLink href="/pages/contact">Ask a question</EditorialLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function Journal() {
  const notes = [
    { number: "01", category: "Design notes", title: "A calmer kind of workspace", text: "Simple ways to bring focus, comfort and a little personality to the room where you work.", href: "/pages/design-services" },
    { number: "02", category: "At home", title: "The room beyond the walls", text: "Why outdoor spaces deserve the same care, texture and sense of intention as indoor rooms.", href: "/pages/about" },
    { number: "03", category: "About the concept", title: "What is Haven & Oak?", text: "The idea behind this original brand showcase and what you can explore throughout the demo.", href: "/pages/faq" },
  ];

  return (
    <section id="journal" className="section container-shell scroll-mt-40" aria-labelledby="journal-heading">
      <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent">Notes on considered living</p>
          <h2 id="journal-heading" className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">Stories behind the spaces.</h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted">A closer look at the ideas, materials and thinking that shape the Haven &amp; Oak concept.</p>
        </div>
        <div className="border-t border-line">
          {notes.map((note) => (
            <Link key={note.title} href={note.href} className="group grid gap-3 border-b border-line py-7 sm:grid-cols-[44px_1fr_auto] sm:gap-6">
              <span className="font-heading text-xl text-accent">{note.number}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.14em] text-accent">{note.category}</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold group-hover:text-primary">{note.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{note.text}</p>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingStatement() {
  return (
    <section className="bg-primary py-16 text-white sm:py-20" aria-labelledby="belief-heading">
      <div className="container-shell text-center">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">The feeling we design for</p>
        <h2 id="belief-heading" className="mx-auto mt-5 max-w-4xl font-heading text-3xl leading-snug sm:text-5xl">More than a look. A way of living.</h2>
        <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-footer-text">A room should feel comfortable before it feels finished. The details matter most when they make everyday life easier. A home becomes personal through use, memory and time.</p>
      </div>
    </section>
  );
}

function ShowcaseGuide() {
  return (
    <section className="section container-shell" aria-labelledby="showcase-heading">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent">About this website</p>
        <h2 id="showcase-heading" className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">A brand story first. A demo catalogue second.</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">Haven &amp; Oak brings together original editorial content, licensed interior photography and a separate illustrative furniture catalogue. It is a frontend portfolio demonstration, not a functioning retailer.</p>
      </div>
      <div className="mt-12 border-t border-line">
        <div className="grid gap-8 py-8 sm:grid-cols-3 sm:gap-10">
          <div><h3 className="font-heading text-2xl font-semibold">Brand stories</h3><p className="mt-3 text-sm leading-relaxed text-muted">The homepage explains the concept, its design principles and its point of view on considered living.</p></div>
          <div><h3 className="font-heading text-2xl font-semibold">Room inspiration</h3><p className="mt-3 text-sm leading-relaxed text-muted">Full-width photography and editorial notes show atmosphere, materials and ways to make a room feel personal.</p></div>
          <div><h3 className="font-heading text-2xl font-semibold">Separate catalogue</h3><p className="mt-3 text-sm leading-relaxed text-muted">Product browsing, wishlist and cart tools exist only on other pages. No real orders or payments are processed.</p></div>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-7">
          <EditorialLink href="/c/living-room">Open the separate demo catalogue</EditorialLink>
          <EditorialLink href="/pages/faq">Read the demo FAQ</EditorialLink>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <Hero />
      <BrandIntro />
      <OpeningImage />
      <BrandStory />
      <DesignValues />
      <RoomInspiration />
      <DesignProcess />
      <MaterialStories />
      <DesignServices />
      <Journal />
      <ClosingStatement />
      <ShowcaseGuide />
    </>
  );
}
