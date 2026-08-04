import Image from "next/image";
import Link from "next/link";
import {
  BUY_IN_AMOUNT,
  CLASS_NAME,
  DUE_DATE,
  VENMO_HANDLE,
  WINNER_PRIZE,
  buildVenmoPayLink,
} from "@/lib/constants";

export default function Home() {
  const dueDateStr = DUE_DATE.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const dueMonthAbbr = DUE_DATE.toLocaleDateString("en-US", {
    month: "short",
  }).toUpperCase();
  const venmoLink = buildVenmoPayLink("baby pool");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-12">
      <section className="text-center">
        <p className="mono-eyebrow mb-3">
          &mdash; {CLASS_NAME} Presents &mdash;
        </p>
        <h1 className="font-serif text-4xl font-extrabold italic text-[var(--navy)] sm:text-5xl">
          Camille &amp; Scott Baby Pool
        </h1>
        <p className="mt-3 text-lg text-[var(--navy)]/70">
          Help us guess when this baby will be!
        </p>

        <Link
          href="/pool"
          className="btn-pill mt-6 inline-block rounded-full px-8 py-3 shadow-md"
        >
          Fill Out Your Baby Pool Choice
        </Link>

        <div className="mt-8 flex justify-center">
          <div className="stamp-badge">
            <span className="text-[10px] font-semibold">Est. Maturity</span>
            <span className="text-lg font-bold">{dueMonthAbbr} 27</span>
            <span className="text-[10px] font-semibold">
              {DUE_DATE.getFullYear()}
            </span>
          </div>
        </div>
      </section>

      <section className="relative">
        <span className="exhibit-tab">Exhibit A</span>
        <div className="ledger-card">
        <div className="p-6 pl-8 sm:p-8 sm:pl-10">
          <h2 className="mb-4 font-serif text-2xl font-bold italic text-[var(--navy)]">
            How It All Started
          </h2>
          <p className="text-[var(--navy)]/75">
            Every great banking career starts with a solid foundation — and
            apparently, so does every great love story. Camille and Scott met
            during their first year at the Florida School of Banking, in the
            most on-brand way two future bankers possibly could: a karaoke
            night at the University of Florida that was supposed to be a
            quick study break.
          </p>
        </div>

        <div className="relative aspect-[600/500] w-full">
          <Image
            src="/images/karaoke.png"
            alt="Camille and Scott singing karaoke with Florida Banking School classmates"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4 p-6 pl-8 text-[var(--navy)]/75 sm:p-8 sm:pl-10">
          <p>
            Scott grabbed the mic first. Camille, never one to be outdone,
            followed with a performance that — depending on who you ask —
            either stole the show or cleared the room. Either way, it was
            enough to spark a conversation that lasted well past last call.
          </p>
          <p>
            What followed wasn&apos;t exactly a whirlwind romance — it was
            late nights running AI-generated sample tests, as the two of them
            teamed up to tackle the single hardest exam administered anywhere
            in the state of Florida banking curriculum.
          </p>
        </div>

        <div className="relative aspect-[600/500] w-full">
          <Image
            src="/images/study-session.png"
            alt="Camille and Scott studying together at Florida Banking School"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4 p-6 pl-8 text-[var(--navy)]/75 sm:p-8 sm:pl-10">
          <p>
            Somewhere between reconciling ledgers and reciting regulations,
            quizzing each other turned into something more. Turns out nothing
            says &ldquo;soulmate&rdquo; quite like surviving a brutal case
            study session together at 11pm on a Tuesday.
          </p>
          <p>
            They both passed. They both fell in love. And now, the{" "}
            {CLASS_NAME} family is getting ready to welcome its newest (and
            smallest) member — due <strong>{dueDateStr}</strong>.
          </p>
        </div>
        </div>
      </section>

      <section className="relative">
        <span className="exhibit-tab">Exhibit B</span>
        <div className="ledger-card">
        <div className="p-6 pl-8 text-center sm:p-8 sm:pl-10">
          <h2 className="font-serif text-xl font-bold italic text-[var(--navy)]">
            Think you know this kid already?
          </h2>
          <p className="mt-2 text-[var(--navy)]/75">
            Pick a due date, guess the eye color, hair color, and weight.
            Buy-in is ${BUY_IN_AMOUNT} via Venmo to{" "}
            <a
              href={venmoLink}
              className="whitespace-nowrap font-bold underline"
            >
              {VENMO_HANDLE}
            </a>{" "}
            (write &ldquo;baby pool&rdquo; in the note) — winner takes home $
            {WINNER_PRIZE}, the rest goes to the class fund.
          </p>
          <Link
            href="/pool"
            className="btn-ledger mt-4 inline-block rounded px-6 py-3"
          >
            Enter the Pool
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
}
