import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Joystick } from "lucide-react";

export default function GamesPage() {
  const games = [
    { id: 1, title: "Szybkie działania", desc: "Ćwicz dodawanie i odejmowanie na czas.", path: "/QuickMath" },
    { id: 2, title: "Potęgi Memory", desc: "Dobierz pary: liczba i jej potęga.", path: "/PotegiMemory" },
  ];

  return (
    <div className="py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Joystick className="w-6 h-6 text-indigo-500" /> Gry matematyczne
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          {games.map((g) => (
            <Card key={g.id} className="border-0 bg-white dark:bg-slate-800 shadow hover:shadow-lg transition">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{g.title}</h2>
                <p className="text-gray-600 dark:text-slate-300 mb-4">{g.desc}</p>
                <Link to={g.path} className="inline-block px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white transition-colors">Zagraj</Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
