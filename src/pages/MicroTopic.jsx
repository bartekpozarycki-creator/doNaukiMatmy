import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";

const infoByTopic = {
  algebra: [
    "Redukcja wyrazów podobnych",
    "Wzory skróconego mnożenia",
    "Równania liniowe",
  ],
  geometria: ["Pole i obwód figur płaskich", "Twierdzenie Pitagorasa"],
  analiza: ["Granice ciągów", "Pochodna - definicja"],
  funkcje: ["Funkcja liniowa", "Własności funkcji kwadratowej"],
};

export default function MicroTopicPage() {
  const params = new URLSearchParams(useLocation().search);
  const topic = params.get("topic") || "";
  const items = infoByTopic[topic] || [];

  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link to={createPageUrl("MicroReview")} className="text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" /> Powrót
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 capitalize">
          Najważniejsze: {topic}
        </h1>

        {items.length === 0 ? (
          <p className="text-gray-600 dark:text-slate-300">Brak materiałów.</p>
        ) : (
          <div className="space-y-4">
            {items.map((text) => (
              <Card key={text} className="border-0 bg-white dark:bg-slate-800 shadow">
                <CardContent className="p-6 text-slate-900 dark:text-white">
                  {text}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
