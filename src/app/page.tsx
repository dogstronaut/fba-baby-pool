import Image from "next/image";
import Link from "next/link";
import {
  BUY_IN_AMOUNT,
  CLASS_NAME,
  DUE_DATE,
  VENMO_HANDLE,
  WINNER_PRIZE,
} from "@/lib/constants";

export default function Home() {
  const dueDateStr = DUE_DATE.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-12">
      <section className="text-center">
        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-600">
          {CLASS_NAME} Presents
        </p>
        <h1 className="text-4xl font-extrabold text-slate-800 sm:text-5xl">
          A Camille &amp; Scott Baby Pool
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Due {dueDateStr} — help us guess when (and what) this baby will be!
        </p>
      </section>

      <section className="flex items-center justify-center gap-6 sm:gap-10">
        <div className="flex flex-col items-center gap-2">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-md sm:h-40 sm:w-40">
            <Image
              src="/images/camille.jpg"
              alt="Camille"
              width={160}
              height={160}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <span className="font-bold text-slate-700">Camille</span>
        </div>
        <span className="text-3xl">💍</span>
        <div className="flex flex-col items-center gap-2">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-md sm:h-40 sm:w-40">
            <Image
              src="/images/scott.jpg"
              alt="Scott"
              width={160}
              height={160}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <span className="font-bold text-slate-700">Scott</span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-4 text-2xl font-bold text-slate-800">
          How It All Started
        </h2>
        <div className="flex flex-col gap-4 text-slate-600">
          <p>
            Every great banking career starts with a solid foundation — and
            apparently, so does every great love story. Camille and Scott met
            during their first year at the Florida School of Banking, in the
            most on-brand way two future bankers possibly could: a karaoke
            night at the University of Florida that was supposed to be a
            quick study break.
          </p>
          <p>
            Scott grabbed the mic first. Camille, never one to be outdone,
            followed with a performance that — depending on who you ask —
            either stole the show or cleared the room. Either way, it was
            enough to spark a conversation that lasted well past last call.
          </p>
          <p>
            What followed wasn&apos;t exactly a whirlwind romance — it was
            late nights in the library, color-coded flashcards, and endless
            practice questions, as the two of them teamed up to tackle the
            single hardest exam administered anywhere in the state of Florida
            banking curriculum. Somewhere between reconciling ledgers and
            reciting regulations, quizzing each other turned into something
            more. Turns out nothing says &ldquo;soulmate&rdquo; quite like
            surviving a brutal case study session together at 11pm on a
            Tuesday.
          </p>
          <p>
            They both passed. They both fell in love. And now, the {CLASS_NAME}{" "}
            family is getting ready to welcome its newest (and smallest)
            member — due <strong>{dueDateStr}</strong>.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800">
          Think you know this kid already?
        </h2>
        <p className="mt-2 text-slate-600">
          Pick a due date, guess the eye color, hair color, and weight. Buy-in
          is ${BUY_IN_AMOUNT} via Venmo to <strong>{VENMO_HANDLE}</strong> —
          winner takes home ${WINNER_PRIZE}, the rest goes to the class fund.
        </p>
        <Link
          href="/pool"
          className="mt-4 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Enter the Pool
        </Link>
      </section>
    </div>
  );
}
