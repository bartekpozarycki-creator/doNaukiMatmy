import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

export default function CommunityPage() {
  return (
    <div className="py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <Card className="border-0 bg-white shadow-lg dark:bg-slate-800">
            <CardContent className="px-6 py-12 text-center sm:px-10">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                <Users className="h-7 w-7" />
              </div>
              <Badge
                variant="outline"
                className="mb-4 border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
              >
                Chwilowo nieaktywne
              </Badge>
              <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">
                Społeczność
              </h1>
              <p className="mx-auto max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Ta sekcja jest na razie wyłączona. Wróć tu wkrótce - pytania i
                odpowiedzi pojawią się ponownie.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
