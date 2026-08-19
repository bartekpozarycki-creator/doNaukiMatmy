import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, MessageSquarePlus } from "lucide-react";

const GOOGLE_REVIEW_URL =
  import.meta.env.VITE_GOOGLE_REVIEW_URL ||
  "https://www.google.com/maps/search/?api=1&query=Mauka";

const GOOGLE_PROFILE_URL =
  import.meta.env.VITE_GOOGLE_PROFILE_URL || GOOGLE_REVIEW_URL;

const googleReviews = [
  {
    author: "Jan K.",
    content:
      "Świetna aplikacja do nauki matematyki. Arkusze i zbiory zadań w jednym miejscu - dokładnie tego potrzebowałem przed maturą.",
    rating: 5,
    date: "2 tygodnie temu",
  },
  {
    author: "Maria N.",
    content:
      "Pomogła mi przygotować się do matury. Przejrzysty interfejs, łatwo znaleźć zadania z ulubionych arkuszy.",
    rating: 5,
    date: "miesiąc temu",
  },
  {
    author: "Tomasz P.",
    content:
      "Bardzo przejrzysta i prosta w obsłudze. Społeczność też się przydaje, gdy utknę przy trudniejszym zadaniu.",
    rating: 5,
    date: "2 miesiące temu",
  },
  {
    author: "Kasia W.",
    content:
      "Ulubione zadania i szybka nawigacja to strzał w dziesiątkę. Polecam każdemu przed egzaminem.",
    rating: 5,
    date: "3 miesiące temu",
  },
];

const averageRating =
  googleReviews.reduce((sum, r) => sum + r.rating, 0) / googleReviews.length;

function GoogleLogo({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function StarRating({ rating, sizeClass = "h-5 w-5" }) {
  return (
    <div
      className="flex justify-center gap-0.5"
      aria-label={`Ocena ${rating} z 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600"
          }`}
        />
      ))}
    </div>
  );
}

export default function CarouselReviews() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % googleReviews.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const review = googleReviews[index];

  return (
    <motion.div
      className="mx-auto max-w-3xl space-y-8 text-center"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2">
          <GoogleLogo className="h-7 w-7" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Opinie w Google
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <StarRating rating={Math.round(averageRating)} sizeClass="h-6 w-6" />
          <span className="text-lg font-semibold text-slate-900 dark:text-white">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            na podstawie opinii użytkowników
          </span>
        </div>
      </div>

      <Card className="overflow-hidden border border-slate-200/80 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900/80">
        <CardContent className="px-6 py-8 sm:px-10">
          <motion.div className="mb-4 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <GoogleLogo className="h-4 w-4" />
            <span>Opublikowano w Google</span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <StarRating rating={review.rating} />
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                &ldquo;{review.content}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {review.author}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {review.date}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-center gap-2">
            {googleReviews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Opinia ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-blue-500"
                    : "w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 text-white shadow-md hover:from-blue-700 hover:to-blue-800"
        >
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquarePlus className="mr-2 h-5 w-5" />
            Zostaw nam opinię
          </a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="rounded-xl border-slate-300 bg-white px-6 dark:border-slate-600 dark:bg-slate-800"
        >
          <a
            href={GOOGLE_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GoogleLogo className="mr-2 h-4 w-4" />
            Zobacz w Google
            <ExternalLink className="ml-2 h-4 w-4 opacity-60" />
          </a>
        </Button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Twoja opinia pomaga innym uczniom znaleźć Mauka i wspiera rozwój
        platformy.
      </p>
    </motion.div>
  );
}
