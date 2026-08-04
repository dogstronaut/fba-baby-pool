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
    <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-12">
      <section className="text-center">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#c99b3d]">
          {CLASS_NAME} Presents
        </p>
        <h1 className="font-serif text-4xl font-extrabold text-[#12233f] sm:text-5xl">
          A Camille &amp; Scott Baby Pool
        </h1>
        <p className="mt-3 text-lg text-[#12233f]/70">
          Due {dueDateStr} — help us guess when (and what) this baby will be!
        </p>

        <Link
          href="/pool"
          className="mt-6 inline-block rounded-lg bg-[#12233f] px-8 py-3 font-semibold text-[#f2ead6] shadow-md transition hover:bg-[#1c3358]"
        >
          Fill Out Your Baby Pool Choice
        </Link>
      </section>

      <section className="flex items-center justify-center gap-6 sm:gap-10">
        <div className="flex flex-col items-center gap-2">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-[#c99b3d] shadow-md sm:h-40 sm:w-40">
            <Image
              src="/images/camille.jpg"
              alt="Camille"
              width={160}
              height={160}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <span className="font-serif font-bold text-[#12233f]">Camille</span>
        </div>
        <span className="text-3xl">💍</span>
        <div className="flex flex-col items-center gap-2">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-[#c99b3d] shadow-md sm:h-40 sm:w-40">
            <Image
              src="/images/scott.jpg"
              alt="Scott"
              width={160}
              height={160}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <span className="font-serif font-bold text-[#12233f]">Scott</span>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-[#12233f]/15 bg-[#fffdf7] shadow-md">
        <div className="p-6 sm:p-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-[#12233f]">
            How It All Started
          </h2>
          <p className="text-[#12233f]/75">
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

        <div className="flex flex-col gap-4 p-6 text-[#12233f]/75 sm:p-8">
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
            banking curriculum.
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

        <div className="flex flex-col gap-4 p-6 text-[#12233f]/75 sm:p-8">
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
      </section>

      <section className="rounded-2xl border-2 border-[#c99b3d] bg-[#f7ecc9] p-6 text-center">
        <h2 className="font-serif text-xl font-bold text-[#12233f]">
          Think you know this kid already?
        </h2>
        <p className="mt-2 text-[#12233f]/75">
          Pick a due date, guess the eye color, hair color, and weight. Buy-in
          is ${BUY_IN_AMOUNT} via Venmo to <strong>{VENMO_HANDLE}</strong> —
          winner takes home ${WINNER_PRIZE}, the rest goes to the class fund.
        </p>
        <Link
          href="/pool"
          className="mt-4 inline-block rounded-lg bg-[#12233f] px-6 py-3 font-semibold text-[#f2ead6] transition hover:bg-[#1c3358]"
        >
          Enter the Pool
        </Link>
      </section>
    </div>
  );
}
