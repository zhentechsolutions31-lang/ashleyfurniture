import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { ContactForm } from "@/components/static/ContactForm";
import { TrackOrder } from "@/components/static/TrackOrder";
import { ClearDataButton } from "@/components/static/ClearDataButton";

const slugs = ["about", "contact", "faq", "shipping", "returns", "privacy", "terms", "accessibility", "financing", "design-services", "careers", "press", "stores", "track-order"];
const titles: Record<string, string> = { about: "About Haven & Oak", contact: "Contact Us", faq: "Frequently Asked Questions", shipping: "Shipping & Delivery", returns: "Returns & Exchanges", privacy: "Privacy & Your Data", terms: "Terms of Use", accessibility: "Accessibility", financing: "Financing Information", "design-services": "Design Services", careers: "Careers", press: "Press & Media", stores: "Find a Store", "track-order": "Track Your Order" };

export function generateStaticParams() { return slugs.map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; return titles[slug] ? { title: titles[slug], description: `${titles[slug]} for the Haven & Oak demo furniture storefront.`, alternates: { canonical: `/pages/${slug}` } } : { title: "Page not found", robots: { index: false, follow: false } }; }

const faqs = [
  ["Is this a real store?", "No. Haven & Oak is a frontend portfolio demo. No real orders, payments, financing applications or shipments are processed."],
  ["How does the cart work?", "Your cart is saved in this browser using localStorage. It can sync between tabs and remains after a refresh, unless browser storage is cleared or unavailable."],
  ["Can I use a promo code?", "Yes. Try WELCOME10 for 10% off, SAVE100 for $100 off orders over $1,000, or FREESHIP for free shipping. These are demo codes."],
  ["Do you offer assembly?", "Product pages show illustrative assembly guidance. A real service team would coordinate assembly for eligible items."],
  ["What is the return policy?", "The demo illustrates a 30-day return window for unused items in original condition. No actual returns can be started from this demo."],
  ["How do I track an order?", "Use the Track Order page with the demo order number and email saved after mock checkout. Orders are stored only in this browser."],
  ["Are reviews and ratings real?", "No. Ratings and testimonials are illustrative demo content and are not included in structured review markup."],
];

function Article({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mt-8"><h2 className="font-heading text-2xl font-semibold">{title}</h2><div className="mt-3 space-y-4 leading-relaxed text-muted">{children}</div></section>; }

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugs.includes(slug)) notFound();
  const faqJson = slug === "faq" ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) } : null;
  return <div className="section container-shell max-w-4xl pt-8"><p className="text-xs font-semibold uppercase tracking-wider text-accent">Haven &amp; Oak</p><h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">{titles[slug]}</h1>{faqJson && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }} />}
    {slug === "about" && <><p className="mt-5 max-w-2xl text-lg text-muted">We believe a home should feel collected, comfortable and unmistakably yours.</p><Article title="Furniture for the way you live"><p>Haven & Oak is an original demo brand built around a simple idea: thoughtful design belongs in everyday life. Our fictional collection brings together warm materials, practical details and timeless silhouettes.</p><p>This storefront demonstrates a complete furniture shopping experience without a backend, database or real inventory.</p></Article><Article title="Designed with care"><p>From a reading chair to a family dining table, every piece in this catalogue is intended to make a room feel more considered. Product names, descriptions, illustrations and policies are original demo content.</p></Article></>}
    {slug === "contact" && <><p className="mt-4 text-muted">Questions about a piece, delivery or the demo itself? Save a message below.</p><div className="mt-7"><ContactForm /></div><Article title="Demo support"><p>This form does not send an email. Your message is stored only in your browser and can be removed with “Clear my demo data”.</p><Link href="/pages/faq" className="text-link">Browse frequently asked questions</Link></Article></>}
    {slug === "faq" && <div className="mt-7">{faqs.map(([question, answer], index) => <Accordion key={question} title={question} defaultOpen={index === 0}><p>{answer}</p></Accordion>)}</div>}
    {slug === "shipping" && <Article title="Delivery made simple"><p>This demo illustrates standard delivery in approximately 5–10 business days and store pickup in 2–3 business days. ZIP estimates on product pages are calculated locally and are not carrier quotes.</p><p>Free standard delivery is shown on orders over $999 after discounts. Below that threshold, a demo shipping charge of $49 applies.</p><p>Large furniture may require special handling. No real shipments are created from this website.</p></Article>}
    {slug === "returns" && <Article title="30-day demo return window"><p>The demo policy describes returns for unused items in original packaging within 30 days of delivery. Real return eligibility, fees and exclusions would depend on the product and seller.</p><p>Because this is a portfolio storefront, no return labels, refunds or pickups are processed.</p></Article>}
    {slug === "privacy" && <><Article title="What is stored"><p>The app stores your cart, wishlist, newsletter preference, recently viewed products, demo reviews, availability notifications and completed mock orders in your browser’s localStorage. Nothing is transmitted to a server by these features.</p><p>Checkout asks only for fictional contact and delivery details. Never enter real payment information. The demo card option does not request or store a card number.</p></Article><Article title="Your choices"><p>You can clear all Haven & Oak demo data at any time. Browser storage may also be cleared through your browser settings.</p><ClearDataButton /></Article></>}
    {slug === "terms" && <Article title="Demo terms"><p>This website is a portfolio demonstration, not a retailer. Product availability, prices, reviews, promotions, financing, delivery and return information are illustrative and non-binding.</p><p>No purchase contract is formed, no payment is collected and no goods will be shipped. Do not rely on this site for real purchases or financial decisions.</p></Article>}
    {slug === "accessibility" && <Article title="An inclusive experience"><p>This demo is designed with semantic landmarks, keyboard navigation, visible focus states, labelled forms, responsive layouts and reduced-motion support. Dialogs trap focus and return it to the triggering control.</p><p>Accessibility is an ongoing practice. Automated checks cannot replace testing with assistive technologies and real people.</p><Link href="/pages/contact" className="text-link">Share accessibility feedback</Link></Article>}
    {slug === "financing" && <Article title="Illustrative financing"><p>Some pages show demo monthly estimates calculated by dividing the order total over 24 months. These estimates exclude interest, fees and credit terms and are not financial offers.</p><p>No credit application is made and no personal financial information is collected. A real retailer would need compliant lender disclosures and approval processes.</p></Article>}
    {slug === "design-services" && <Article title="A little help bringing it together"><p>Our fictional design service would help with room planning, finish coordination and selecting pieces that fit your space. This demo does not book consultations.</p><p>Explore shop-by-room and shop-by-style collections for inspiration, or browse the lookbook on the homepage.</p></Article>}
    {slug === "careers" && <Article title="Build something considered"><p>Haven & Oak is a demonstration brand and is not currently hiring. This page illustrates the kind of company information a furniture retailer might share.</p></Article>}
    {slug === "press" && <Article title="Press & media"><p>This is a fictional brand created for a frontend portfolio. There are no official press materials, media contacts or affiliated retailers.</p></Article>}
    {slug === "stores" && <Article title="Store locator demo"><p>No physical Haven &amp; Oak stores exist. The address shown in demo orders — 123 Market Street — is illustrative only.</p><p>Browse the full catalogue online or explore pickup information on product pages.</p></Article>}
    {slug === "track-order" && <><p className="mt-4 text-muted">Find a mock order saved after checkout in this browser.</p><div className="mt-7"><TrackOrder /></div></>}
  </div>;
}
