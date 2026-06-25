import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { resolveAboutImageUrl } from "@/utils/about-images";
import mascotUrl from "../../data/math_mascot_single.svg?url";

const creators = [
  {
    id: "bartek",
    name: "Bartek",
    imagePath: "bart.jpg",
    roles: ["Student", "Twórca MathMaster", "Autor kursów i materiałów"],
    bio: "Odpowiada za rozwój platformy, układ strony oraz przygotowanie kursów i zadań. Łączy naukę matematyki z praktycznym podejściem do programowania i edukacji.",
  },
  {
    id: "jeremiasz",
    name: "Jeremiasz",
    imagePath: null,
    roles: ["Student", "Współtwórca MathMaster", "Twórca treści"],
    bio: "Współtworzy projekt od strony merytorycznej i organizacyjnej. Dba o spójność materiałów i rozwój platformy razem z zespołem.",
  },
];

function CreatorPhoto({ name, imagePath }) {
  const imageUrl = resolveAboutImageUrl(imagePath);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="h-32 w-32 shrink-0 rounded-2xl border border-slate-200 object-cover dark:border-slate-600 sm:h-36 sm:w-36"
      />
    );
  }

  return (
    <div
      className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800 sm:h-36 sm:w-36"
      aria-hidden="true"
    >
      <User className="h-12 w-12 text-slate-400 dark:text-slate-500" />
    </div>
  );
}

function CreatorCard({ creator, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Card className="h-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
          <CreatorPhoto name={creator.name} imagePath={creator.imagePath} />
          <div className="min-w-0 space-y-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {creator.name}
              </h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {creator.roles.map((role) => (
                  <li
                    key={role}
                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {creator.bio}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 dark:bg-slate-900">
      <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              O nas
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Twórcy MathMaster
            </p>
          </div>
          <motion.img
            src={mascotUrl}
            alt=""
            aria-hidden="true"
            className="h-40 w-40 shrink-0 object-contain sm:h-48 sm:w-48"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { duration: 0.4, ease: "easeOut" },
              scale: { duration: 0.4, ease: "easeOut" },
              y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        </motion.div>

        <div className="space-y-4">
          {creators.map((creator, index) => (
            <CreatorCard key={creator.id} creator={creator} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
