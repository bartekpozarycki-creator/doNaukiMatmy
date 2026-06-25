import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight } from "lucide-react";

const topicNames = {
  algebra: "Algebra",
  geometria: "Geometria",
  analiza: "Analiza",
  funkcje: "Funkcje",
  trygonometria: "Trygonometria",
  statystyka: "Statystyka",
  kombinatoryka: "Kombinatoryka",
  rachunek_prawdopodobienstwa: "Rachunek prawdopodobieństwa",
};

export default function MicroReviewPage() {
  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
          Mikropowtórki - wybierz temat
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(topicNames).map(([key, label]) => (
            <Link to={`${createPageUrl("MicroTopic")}?topic=${key}`} key={key} className="block">
              <Card className="hover:shadow-xl transition border-0 bg-white dark:bg-slate-800 h-full flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1 justify-between">
                  <div className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    {label}
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                    Zobacz
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
