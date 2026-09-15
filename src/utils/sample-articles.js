export const sampleArticles = [
  {
    id: "artykul-logarytmy",
    title: "Logarytmy",
    description: "",
    topic: "Liczby rzeczywiste",
    subtopic: "Logarytmy",
    contentModes: ["podstawa", "rozszerzenie"],
    levels: ["podstawowy", "rozszerzony"],
    readMinutes: 14,
    relatedTasks: {
      topicIncludes: ["logarytm"],
      subtopicIncludes: ["logarytm"],
      questionIncludes: ["logarytm", "\\log", "log_"],
      limit: 12,
    },
    legend: [
      { label: "Poziom podstawowy", dot: "bg-blue-500", contentLevel: "podstawa" },
      { label: "Poziom rozszerzony", dot: "bg-violet-500", contentLevel: "rozszerzenie" },
    ],
    closing: "",
    sections: [
      {
        number: "1",
        heading: "Definicja",
        blocks: [
          {
            type: "text",
            content:
              "Niech $a>0$ i $a\\neq 1$. Logarytmem $\\log_a b$ liczby $b>0$ przy podstawie $a$ nazywamy wykładnik $c$ potęgi, do której należy podnieść $a$, aby otrzymać $b$. Zapisujemy to wzorem (1). Równoważnie zachodzi tożsamość (2).",
          },
          {
            type: "formula-list",
            items: [
              {
                latex:
                  "\\log_a b = c \\text{ wtedy i tylko wtedy, gdy } a^c = b",
                label: "(1)",
                accent: "blue",
                caption: "definicja logarytmu",
                example: {
                  level: "podstawowy",
                  prompt: "Oblicz $\\log_2 8$.",
                  steps: [
                    "Szukamy $c$ takiego, że $2^c=8$.",
                    "$2^3=8$, więc $c=3$.",
                  ],
                  result: "Wynik: $\\log_2 8=3$.",
                },
              },
              {
                latex: "a^{\\log_a b} = b",
                label: "(2)",
                accent: "blue",
                caption: "równoważnie",
                example: {
                  level: "podstawowy",
                  prompt: "Uprość $5^{\\log_5 12}$.",
                  steps: [
                    "Potęga o podstawie $a$ i wykładniku $\\log_a b$ daje $b$.",
                    "Tu $a=5$ i $b=12$, więc $5^{\\log_5 12}=12$.",
                  ],
                  result: "Wynik: $12$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "why",
            title: "A czemu tak?",
            content:
              "Wzór (2) to po prostu definicja (1) z podstawionym $c=\\log_a b$. Z (1) wiemy, że $\\log_a b=c$ wtedy i tylko wtedy, gdy $a^c=b$. Jeśli więc w $a^c=b$ wstawimy $c=\\log_a b$, dostajemy od razu $a^{\\log_a b}=b$.",
          },
          {
            type: "callout",
            variant: "insight",
            title: "Zapamiętaj",
            content:
              "Zapisy $\\log x$ oraz $\\lg x$ oznaczają $\\log_{10} x$.",
          },
        ],
      },
      {
        number: "2",
        heading: "Podstawowe własności",
        blocks: [
          {
            type: "text",
            content:
              "Dla dowolnych liczb rzeczywistych $x>0$, $y>0$ oraz $r$ prawdziwe są równości: logarytm iloczynu (3), logarytm potęgi (4), potęga w podstawie (5) oraz logarytm ilorazu (6).",
          },
          {
            type: "formula-list",
            items: [
              {
                latex: "\\log_a(x \\cdot y) = \\log_a x + \\log_a y",
                label: "(3)",
                accent: "blue",
                caption: "logarytm iloczynu",
                example: {
                  level: "podstawowy",
                  prompt: "Oblicz $\\log_2(8\\cdot 4)$.",
                  steps: [
                    "$\\log_2(8\\cdot 4)=\\log_2 8+\\log_2 4$.",
                    "$\\log_2 8=3$ oraz $\\log_2 4=2$, więc $3+2=5$.",
                  ],
                  result: "Wynik: $5$.",
                },
              },
              {
                latex: "\\log_a x^r = r \\cdot \\log_a x",
                label: "(4)",
                accent: "blue",
                caption: "logarytm potęgi",
                example: {
                  level: "podstawowy",
                  prompt: "Uprość $\\log_3 9^4$.",
                  steps: [
                    "$\\log_3 9^4=4\\log_3 9$.",
                    "$\\log_3 9=2$, więc $4\\cdot 2=8$.",
                  ],
                  result: "Wynik: $8$.",
                },
              },
              {
                latex: "\\log_{a^r} b = \\frac{1}{r}\\log_a b",
                label: "(5)",
                accent: "blue",
                caption: "potęga w podstawie",
                example: {
                  level: "podstawowy",
                  prompt: "Oblicz $\\log_4 8$.",
                  steps: [
                    "Zapisz $4=2^2$, więc $\\log_4 8=\\log_{2^2} 8$.",
                    "$\\log_{2^2} 8=\\dfrac{1}{2}\\log_2 8=\\dfrac{1}{2}\\cdot 3=\\dfrac{3}{2}$.",
                  ],
                  result: "Wynik: $\\dfrac{3}{2}$.",
                },
              },
              {
                latex: "\\log_a\\frac{x}{y} = \\log_a x - \\log_a y",
                label: "(6)",
                accent: "blue",
                caption: "logarytm ilorazu",
                example: {
                  level: "podstawowy",
                  prompt: "Oblicz $\\log_3\\dfrac{81}{9}$.",
                  steps: [
                    "$\\log_3\\dfrac{81}{9}=\\log_3 81-\\log_3 9$.",
                    "$\\log_3 81=4$ oraz $\\log_3 9=2$, więc $4-2=2$.",
                  ],
                  result: "Wynik: $2$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "pitfall",
            title: "Częsty błąd",
            content:
              "Kolejność ma znaczenie: przy $\\log_a x-\\log_a y$ do licznika idzie $x$, a do mianownika $y$. Poprawnie: $\\log_a x-\\log_a y=\\log_a\\dfrac{x}{y}$. Błędnie: $\\log_a x-\\log_a y=\\log_a\\dfrac{y}{x}$.",
          },
        ],
      },
      {
        number: "3",
        heading: "Zmiana podstawy",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content:
              "Wzór na zamianę podstawy logarytmu (7): jeżeli $a>0$, $a\\neq 1$, $b>0$, $b\\neq 1$ oraz $c>0$, to $\\log_b c$ wyrażamy przez logarytmy przy podstawie $a$. W szczególności zachodzi wzór (8).",
          },
          {
            type: "formula-list",
            contentLevel: "rozszerzenie",
            items: [
              {
                latex: "\\log_b c = \\frac{\\log_a c}{\\log_a b}",
                label: "(7)",
                accent: "violet",
                contentLevel: "rozszerzenie",
                caption: "zmiana podstawy",
                example: {
                  level: "rozszerzony",
                  prompt: "Zapisz $\\log_4 8$ przy podstawie $2$.",
                  steps: [
                    "$\\log_4 8=\\dfrac{\\log_2 8}{\\log_2 4}$.",
                    "$\\log_2 8=3$ oraz $\\log_2 4=2$, więc $\\dfrac{3}{2}$.",
                  ],
                  result: "Wynik: $\\dfrac{3}{2}$.",
                },
              },
              {
                latex: "\\log_a b = \\frac{1}{\\log_b a}",
                label: "(8)",
                accent: "violet",
                contentLevel: "rozszerzenie",
                caption: "w szczególności",
                example: {
                  level: "rozszerzony",
                  prompt: "Oblicz $\\log_8 2$.",
                  steps: [
                    "$\\log_8 2=\\dfrac{1}{\\log_2 8}$.",
                    "$\\log_2 8=3$, więc $\\log_8 2=\\dfrac{1}{3}$.",
                  ],
                  result: "Wynik: $\\dfrac{1}{3}$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "why",
            contentLevel: "rozszerzenie",
            title: "A czemu tak?",
            content:
              "Wzór (8) to szczególny przypadek zmiany podstawy (7). Weź (7) w postaci $\\log_a b=\\dfrac{\\log_b b}{\\log_b a}$. Ponieważ $\\log_b b=1$, dostajemy od razu $\\log_a b=\\dfrac{1}{\\log_b a}$.",
          },
        ],
      },
      {
        number: "4",
        heading: "Obliczanie skomplikowanych logarytmów",
        blocks: [
          {
            type: "text",
            content:
              "Gdy wynik $\\log_a b$ nie jest oczywisty „na oko”, nie zgaduj. Przejdź na równanie wykładnicze z definicji (1) i policz wykładnik systematycznie - także wtedy, gdy pojawiają się pierwiastki o dziwnych stopniach.",
          },
          {
            type: "callout",
            variant: "insight",
            title: "Główny pomysł",
            content:
              "Szukamy liczby $c$, dla której $a^c=b$. Potem zapisujemy $a$ i $b$ w tej samej podstawie i porównujemy wykładniki. Pamiętaj: $\\sqrt[n]{x}=x^{\\frac{1}{n}}$.",
          },
          {
            type: "text",
            content: "Schemat rozwiązania wygląda zawsze tak samo:",
          },
          {
            type: "steps",
            variant: "notebook",
            items: [
              "Oznacz wynik: niech $\\log_a b=c$.",
              "Zapisz równanie z definicji: $a^c=b$.",
              "Zamień pierwiastki na potęgi i zapisz wszystko w jednej podstawie.",
              "Porównaj wykładniki: z $a^{p}=a^{q}$ wynika $p=q$.",
              "Sprawdź: podstaw $c$ z powrotem do $a^c$ i upewnij się, że dostajesz $b$.",
            ],
          },
          {
            type: "text",
            content: "Najpierw jeden przykład rozwiązany dokładnie według schematu:",
          },
          {
            type: "guided-example",
            variant: "notebook",
            title: "Przykład prowadzony",
            prompt: "Oblicz $\\log_4\\sqrt{8}$.",
            steps: [
              "Oznacz wynik: niech $\\log_4\\sqrt{8}=c$.",
              "Zapisz równanie z definicji: $4^c=\\sqrt{8}$.",
              "Zamień pierwiastek na potęgę i zapisz w podstawie $2$: $4=2^2$, $\\sqrt{8}=8^{\\frac{1}{2}}=(2^3)^{\\frac{1}{2}}=2^{\\frac{3}{2}}$. Równanie: $(2^2)^c=2^{\\frac{3}{2}}$, czyli $2^{2c}=2^{\\frac{3}{2}}$.",
              "Porównaj wykładniki: $2c=\\dfrac{3}{2}$, więc $c=\\dfrac{3}{4}$.",
              "Sprawdź: $4^{\\frac{3}{4}}=(2^2)^{\\frac{3}{4}}=2^{\\frac{3}{2}}=\\sqrt{8}$.",
            ],
            result: "$\\log_4\\sqrt{8}=\\dfrac{3}{4}$",
            cleanSolution: [
              "$\\log_4\\sqrt{8}=c$",
              "$4^c=\\sqrt{8}$",
              "$4=2^2,\\quad \\sqrt{8}=2^{\\frac{3}{2}}$",
              "$(2^2)^c=2^{\\frac{3}{2}}$",
              "$2^{2c}=2^{\\frac{3}{2}}$",
              "$2c=\\dfrac{3}{2}$",
              "$c=\\dfrac{3}{4}$",
              "$\\log_4\\sqrt{8}=\\dfrac{3}{4}$",
            ],
          },
          {
            type: "text",
            content: "Trzy trudniejsze przykłady z pierwiastkami:",
          },
          {
            type: "worked-example",
            title: "Przykład A",
            level: "podstawowy",
            prompt: "Oblicz $\\log_{\\sqrt[4]{8}} \\sqrt[6]{32}$.",
            steps: [
              "Niech $\\log_{\\sqrt[4]{8}} \\sqrt[6]{32}=c$. Wtedy $\\left(\\sqrt[4]{8}\\right)^c=\\sqrt[6]{32}$.",
              "Zapisz pierwiastki jako potęgi: $8^{\\frac{c}{4}}=32^{\\frac{1}{6}}$.",
              "Zapisz w podstawie $2$: $8=2^3$, $32=2^5$, więc $(2^3)^{\\frac{c}{4}}=(2^5)^{\\frac{1}{6}}$.",
              "Uprość: $2^{\\frac{3c}{4}}=2^{\\frac{5}{6}}$.",
              "Stąd $\\dfrac{3c}{4}=\\dfrac{5}{6}$, więc $c=\\dfrac{5}{6}\\cdot\\dfrac{4}{3}=\\dfrac{10}{9}$.",
              "Kontrola: $\\left(8^{\\frac{1}{4}}\\right)^{\\frac{10}{9}}=8^{\\frac{10}{36}}=8^{\\frac{5}{18}}=(2^3)^{\\frac{5}{18}}=2^{\\frac{5}{6}}=32^{\\frac{1}{6}}$.",
            ],
            result: "$\\log_{\\sqrt[4]{8}} \\sqrt[6]{32}=\\dfrac{10}{9}$",
            cleanSolution: [
              "$\\log_{\\sqrt[4]{8}} \\sqrt[6]{32}=c$",
              "$\\left(\\sqrt[4]{8}\\right)^c=\\sqrt[6]{32}$",
              "$8^{\\frac{c}{4}}=32^{\\frac{1}{6}}$",
              "$(2^3)^{\\frac{c}{4}}=(2^5)^{\\frac{1}{6}}$",
              "$2^{\\frac{3c}{4}}=2^{\\frac{5}{6}}$",
              "$\\dfrac{3c}{4}=\\dfrac{5}{6}$",
              "$c=\\dfrac{10}{9}$",
            ],
          },
          {
            type: "worked-example",
            title: "Przykład B",
            level: "podstawowy",
            prompt: "Oblicz $\\log_{\\sqrt[3]{25}} \\sqrt[4]{125}$.",
            steps: [
              "Niech $\\log_{\\sqrt[3]{25}} \\sqrt[4]{125}=c$. Wtedy $\\left(\\sqrt[3]{25}\\right)^c=\\sqrt[4]{125}$.",
              "Zapisz pierwiastki jako potęgi: $25^{\\frac{c}{3}}=125^{\\frac{1}{4}}$.",
              "Zapisz w podstawie $5$: $25=5^2$, $125=5^3$, więc $(5^2)^{\\frac{c}{3}}=(5^3)^{\\frac{1}{4}}$.",
              "Uprość: $5^{\\frac{2c}{3}}=5^{\\frac{3}{4}}$.",
              "Stąd $\\dfrac{2c}{3}=\\dfrac{3}{4}$, więc $c=\\dfrac{3}{4}\\cdot\\dfrac{3}{2}=\\dfrac{9}{8}$.",
              "Kontrola: $\\left(25^{\\frac{1}{3}}\\right)^{\\frac{9}{8}}=25^{\\frac{9}{24}}=25^{\\frac{3}{8}}=(5^2)^{\\frac{3}{8}}=5^{\\frac{3}{4}}=125^{\\frac{1}{4}}$.",
            ],
            result: "$\\log_{\\sqrt[3]{25}} \\sqrt[4]{125}=\\dfrac{9}{8}$",
            cleanSolution: [
              "$\\log_{\\sqrt[3]{25}} \\sqrt[4]{125}=c$",
              "$\\left(\\sqrt[3]{25}\\right)^c=\\sqrt[4]{125}$",
              "$25^{\\frac{c}{3}}=125^{\\frac{1}{4}}$",
              "$(5^2)^{\\frac{c}{3}}=(5^3)^{\\frac{1}{4}}$",
              "$5^{\\frac{2c}{3}}=5^{\\frac{3}{4}}$",
              "$\\dfrac{2c}{3}=\\dfrac{3}{4}$",
              "$c=\\dfrac{9}{8}$",
            ],
          },
          {
            type: "worked-example",
            title: "Przykład C",
            level: "podstawowy",
            prompt: "Oblicz $\\log_{\\sqrt[5]{\\frac{1}{8}}} \\sqrt[3]{32}$.",
            steps: [
              "Niech $\\log_{\\sqrt[5]{\\dfrac{1}{8}}} \\sqrt[3]{32}=c$. Wtedy $\\left(\\sqrt[5]{\\dfrac{1}{8}}\\right)^c=\\sqrt[3]{32}$.",
              "Zapisz pierwiastki jako potęgi: $\\left(\\dfrac{1}{8}\\right)^{\\frac{c}{5}}=32^{\\frac{1}{3}}$.",
              "Zapisz w podstawie $2$: $\\dfrac{1}{8}=2^{-3}$, $32=2^5$, więc $(2^{-3})^{\\frac{c}{5}}=(2^5)^{\\frac{1}{3}}$.",
              "Uprość: $2^{-\\frac{3c}{5}}=2^{\\frac{5}{3}}$.",
              "Stąd $-\\dfrac{3c}{5}=\\dfrac{5}{3}$, więc $c=-\\dfrac{5}{3}\\cdot\\dfrac{5}{3}=-\\dfrac{25}{9}$.",
              "Kontrola: wynik ujemny jest OK, bo podstawa $\\sqrt[5]{\\dfrac{1}{8}}$ leży w przedziale $(0,1)$.",
            ],
            result: "$\\log_{\\sqrt[5]{\\frac{1}{8}}} \\sqrt[3]{32}=-\\dfrac{25}{9}$",
            cleanSolution: [
              "$\\log_{\\sqrt[5]{\\dfrac{1}{8}}} \\sqrt[3]{32}=c$",
              "$\\left(\\sqrt[5]{\\dfrac{1}{8}}\\right)^c=\\sqrt[3]{32}$",
              "$\\left(\\dfrac{1}{8}\\right)^{\\frac{c}{5}}=32^{\\frac{1}{3}}$",
              "$(2^{-3})^{\\frac{c}{5}}=(2^5)^{\\frac{1}{3}}$",
              "$2^{-\\frac{3c}{5}}=2^{\\frac{5}{3}}$",
              "$-\\dfrac{3c}{5}=\\dfrac{5}{3}$",
              "$c=-\\dfrac{25}{9}$",
            ],
          },
          {
            type: "callout",
            variant: "pitfall",
            title: "Częsty błąd",
            content:
              "Nie mieszaj podstaw w jednym kroku. Najpierw zamień pierwiastki na potęgi, potem sprowadź obie strony do tej samej podstawy i dopiero porównuj wykładniki. Wynik ujemny jest jak najbardziej możliwy.",
          },
        ],
      },
      {
        number: "5",
        heading: "Zadania",
        blocks: [
          {
            type: "exercise-group",
            title: "Wzór (1) - definicja logarytmu",
            formulaLabel: "(1)",
            exercises: [
              {
                type: "exercise",
                number: "5.1",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_2 16$.",
                hint: "Szukasz wykładnika $c$, dla którego $2^c=16$.",
                answer: "$4$",
                explanation: [
                  "Niech $\\log_2 16=c$. Wtedy $2^c=16$.",
                  "$16=2^4$, więc $c=4$.",
                ],
                cleanSolution: [
                  "$\\log_2 16=c$",
                  "$2^c=16$",
                  "$16=2^4$",
                  "$c=4$",
                ],
              },
              {
                type: "exercise",
                number: "5.16",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_3 81$.",
                hint: "Szukasz wykładnika $c$, dla którego $3^c=81$.",
                answer: "$4$",
                explanation: [
                  "Niech $\\log_3 81=c$. Wtedy $3^c=81$.",
                  "$81=3^4$, więc $c=4$.",
                ],
                cleanSolution: [
                  "$\\log_3 81=c$",
                  "$3^c=81$",
                  "$81=3^4$",
                  "$c=4$",
                ],
              },
              {
                type: "exercise",
                number: "5.17",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_5\\dfrac{1}{25}$.",
                hint: "Zapisz $\\dfrac{1}{25}$ jako potęgę piątki.",
                answer: "$-2$",
                explanation: [
                  "Niech $\\log_5\\dfrac{1}{25}=c$. Wtedy $5^c=\\dfrac{1}{25}$.",
                  "$\\dfrac{1}{25}=5^{-2}$, więc $c=-2$.",
                ],
                cleanSolution: [
                  "$\\log_5\\dfrac{1}{25}=c$",
                  "$5^c=\\dfrac{1}{25}$",
                  "$\\dfrac{1}{25}=5^{-2}$",
                  "$c=-2$",
                ],
              },
            ],
          },
          {
            type: "exercise-group",
            title: "Wzór (2) - tożsamość $a^{\\log_a b}=b$",
            formulaLabel: "(2)",
            exercises: [
              {
                type: "exercise",
                number: "5.2",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Uprość $7^{\\log_7 15}$.",
                hint: "Potęga o podstawie $a$ i wykładniku $\\log_a b$ daje od razu $b$.",
                answer: "$15$",
                explanation: [
                  "Z tożsamości $a^{\\log_a b}=b$ dla $a=7$ i $b=15$ dostajemy $7^{\\log_7 15}=15$.",
                ],
                cleanSolution: [
                  "$7^{\\log_7 15}=15$",
                ],
              },
              {
                type: "exercise",
                number: "5.19",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $5^{2\\log_5 3}$.",
                hint: "Zapisz $5^{2\\log_5 3}=(5^{\\log_5 3})^2$ i skorzystaj z tożsamości (2).",
                answer: "$9$",
                explanation: [
                  "$5^{2\\log_5 3}=(5^{\\log_5 3})^2$.",
                  "Z (2) mamy $5^{\\log_5 3}=3$, więc $(5^{\\log_5 3})^2=3^2=9$.",
                ],
                cleanSolution: [
                  "$5^{2\\log_5 3}=(5^{\\log_5 3})^2$",
                  "$=3^2$",
                  "$=9$",
                ],
              },
              {
                type: "exercise",
                number: "5.20",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Uprość $\\left(\\dfrac{1}{2}\\right)^{\\log_{1/2} 8}$.",
                hint: "To bezpośrednie zastosowanie tożsamości $a^{\\log_a b}=b$ z $a=\\dfrac{1}{2}$ i $b=8$.",
                answer: "$8$",
                explanation: [
                  "Z tożsamości $a^{\\log_a b}=b$ dla $a=\\dfrac{1}{2}$ i $b=8$ dostajemy $\\left(\\dfrac{1}{2}\\right)^{\\log_{1/2} 8}=8$.",
                ],
                cleanSolution: [
                  "$\\left(\\dfrac{1}{2}\\right)^{\\log_{1/2} 8}=8$",
                ],
              },
              {
                type: "exercise",
                number: "5.21",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $16^{\\log_4 3}$.",
                hints: [
                  "Zapisz $16$ jako potęgę czwórki: $16=4^2$.",
                  "Przekształć $16^{\\log_4 3}=(4^2)^{\\log_4 3}=4^{2\\log_4 3}$.",
                  "Zastosuj (2): $4^{\\log_4 3}=3$, więc wynik to $3^2$.",
                ],
                answer: "$9$",
                explanation: [
                  "$16=4^2$, więc $16^{\\log_4 3}=(4^2)^{\\log_4 3}=4^{2\\log_4 3}$.",
                  "$4^{2\\log_4 3}=(4^{\\log_4 3})^2$.",
                  "Z (2) mamy $4^{\\log_4 3}=3$, stąd $(4^{\\log_4 3})^2=3^2=9$.",
                ],
                cleanSolution: [
                  "$16^{\\log_4 3}=(4^2)^{\\log_4 3}$",
                  "$=4^{2\\log_4 3}$",
                  "$=(4^{\\log_4 3})^2$",
                  "$=3^2$",
                  "$=9$",
                ],
              },
            ],
          },
          {
            type: "exercise-group",
            title: "Wzór (3) - logarytm iloczynu",
            formulaLabel: "(3)",
            exercises: [
              {
                type: "exercise",
                number: "5.3",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_2 8 + \\log_2 4$.",
                hint: "Suma logarytmów o tej samej podstawie to logarytm iloczynu.",
                answer: "$5$",
                explanation: [
                  "$\\log_2 8 + \\log_2 4 = \\log_2(8\\cdot 4)=\\log_2 32$.",
                  "$32=2^5$, więc $\\log_2 32=5$.",
                ],
                cleanSolution: [
                  "$\\log_2 8+\\log_2 4=\\log_2(8\\cdot 4)$",
                  "$=\\log_2 32$",
                  "$=5$",
                ],
              },
              {
                type: "exercise",
                number: "5.22",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_5 4 + \\log_5\\dfrac{25}{4}$.",
                hint: "Zastosuj wzór (3), a potem uprość iloczyn pod logarytmem.",
                answer: "$2$",
                explanation: [
                  "$\\log_5 4 + \\log_5\\dfrac{25}{4}=\\log_5\\left(4\\cdot\\dfrac{25}{4}\\right)=\\log_5 25$.",
                  "$25=5^2$, więc $\\log_5 25=2$.",
                ],
                cleanSolution: [
                  "$\\log_5 4+\\log_5\\dfrac{25}{4}=\\log_5\\left(4\\cdot\\dfrac{25}{4}\\right)$",
                  "$=\\log_5 25$",
                  "$=2$",
                ],
              },
              {
                type: "exercise",
                number: "5.23",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_3 6 + \\log_3\\dfrac{3}{2}$.",
                hint: "Zsumuj logarytmy wzorem (3) i sprawdź, jaki iloczyn otrzymasz.",
                answer: "$2$",
                explanation: [
                  "$\\log_3 6 + \\log_3\\dfrac{3}{2}=\\log_3\\left(6\\cdot\\dfrac{3}{2}\\right)=\\log_3 9$.",
                  "$9=3^2$, więc $\\log_3 9=2$.",
                ],
                cleanSolution: [
                  "$\\log_3 6+\\log_3\\dfrac{3}{2}=\\log_3\\left(6\\cdot\\dfrac{3}{2}\\right)$",
                  "$=\\log_3 9$",
                  "$=2$",
                ],
              },
              {
                type: "exercise",
                number: "5.24",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_2 6 + \\log_2\\dfrac{10}{3} + \\log_2\\dfrac{4}{5}$.",
                hints: [
                  "Zsumuj trzy logarytmy wzorem (3): $\\log_2\\left(6\\cdot\\dfrac{10}{3}\\cdot\\dfrac{4}{5}\\right)$.",
                  "Uprość iloczyn w nawiasie.",
                  "Oblicz $\\log_2$ z otrzymanej potęgi dwójki.",
                ],
                answer: "$4$",
                explanation: [
                  "$\\log_2 6 + \\log_2\\dfrac{10}{3} + \\log_2\\dfrac{4}{5}=\\log_2\\left(6\\cdot\\dfrac{10}{3}\\cdot\\dfrac{4}{5}\\right)$.",
                  "$6\\cdot\\dfrac{10}{3}\\cdot\\dfrac{4}{5}=16=2^4$.",
                  "Stąd $\\log_2 16=4$.",
                ],
                cleanSolution: [
                  "$\\log_2 6+\\log_2\\dfrac{10}{3}+\\log_2\\dfrac{4}{5}=\\log_2\\left(6\\cdot\\dfrac{10}{3}\\cdot\\dfrac{4}{5}\\right)$",
                  "$=\\log_2 16$",
                  "$=4$",
                ],
              },
              {
                type: "exercise",
                number: "5.34",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_2 4^3 + \\log_2 8$.",
                hint: "Najpierw wyciągnij wykładnik wzorem (4), a potem zsumuj wzorem (3).",
                hints: [
                  "Z (4): $\\log_2 4^3=3\\log_2 4$.",
                  "Oblicz $3\\log_2 4+\\log_2 8$ albo zsumuj od razu wzorem (3).",
                ],
                answer: "$9$",
                explanation: [
                  "Z (4): $\\log_2 4^3=3\\log_2 4=3\\cdot 2=6$.",
                  "$\\log_2 8=3$, więc $6+3=9$.",
                  "Inaczej: $\\log_2 4^3+\\log_2 8=\\log_2(64\\cdot 8)=\\log_2 512=9$.",
                ],
                cleanSolution: [
                  "$\\log_2 4^3+\\log_2 8=3\\log_2 4+\\log_2 8$",
                  "$=3\\cdot 2+3$",
                  "$=9$",
                ],
              },
              {
                type: "exercise",
                number: "5.35",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_9 3 + \\log_9 27$.",
                hint: "Użyj wzoru (5) dla każdego składnika albo najpierw zsumuj wzorem (3).",
                hints: [
                  "Z (5): $\\log_9 3=\\log_{3^2} 3=\\dfrac{1}{2}$.",
                  "Z (5): $\\log_9 27=\\log_{3^2} 3^3=\\dfrac{3}{2}$.",
                  "Dodaj wyniki albo sprawdź: $\\log_9(3\\cdot 27)=\\log_9 81$.",
                ],
                answer: "$2$",
                explanation: [
                  "Z (5): $\\log_9 3=\\dfrac{1}{2}\\log_3 3=\\dfrac{1}{2}$.",
                  "Z (5): $\\log_9 27=\\dfrac{1}{2}\\log_3 27=\\dfrac{1}{2}\\cdot 3=\\dfrac{3}{2}$.",
                  "Suma: $\\dfrac{1}{2}+\\dfrac{3}{2}=2$.",
                ],
                cleanSolution: [
                  "$\\log_9 3+\\log_9 27=\\dfrac{1}{2}+\\dfrac{3}{2}$",
                  "$=2$",
                ],
              },
            ],
          },
          {
            type: "exercise-group",
            title: "Wzory (4) i (5) - potęgi",
            formulaLabel: "(4)",
            exercises: [
              {
                type: "exercise",
                number: "5.4",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_5 25^3$.",
                hint: "Wyciągnij wykładnik przed logarytm: $\\log_a x^r=r\\log_a x$.",
                answer: "$6$",
                explanation: [
                  "$\\log_5 25^3=3\\log_5 25$.",
                  "$\\log_5 25=2$, więc $3\\cdot 2=6$.",
                ],
                cleanSolution: [
                  "$\\log_5 25^3=3\\log_5 25$",
                  "$=3\\cdot 2$",
                  "$=6$",
                ],
              },
              {
                type: "exercise",
                number: "5.25",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_2\\left(\\dfrac{1}{8}\\right)^2$.",
                hint: "Najpierw wyciągnij wykładnik, potem oblicz $\\log_2\\dfrac{1}{8}$.",
                answer: "$-6$",
                explanation: [
                  "$\\log_2\\left(\\dfrac{1}{8}\\right)^2=2\\log_2\\dfrac{1}{8}$.",
                  "$\\dfrac{1}{8}=2^{-3}$, więc $\\log_2\\dfrac{1}{8}=-3$ i $2\\cdot(-3)=-6$.",
                ],
                cleanSolution: [
                  "$\\log_2\\left(\\dfrac{1}{8}\\right)^2=2\\log_2\\dfrac{1}{8}$",
                  "$=2\\cdot(-3)$",
                  "$=-6$",
                ],
              },
              {
                type: "exercise",
                number: "5.26",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_3 9^{5/2}$.",
                hint: "Wyciągnij $\\dfrac{5}{2}$ przed logarytm i skorzystaj z $\\log_3 9=2$.",
                answer: "$5$",
                explanation: [
                  "$\\log_3 9^{5/2}=\\dfrac{5}{2}\\log_3 9$.",
                  "$\\log_3 9=2$, więc $\\dfrac{5}{2}\\cdot 2=5$.",
                ],
                cleanSolution: [
                  "$\\log_3 9^{5/2}=\\dfrac{5}{2}\\log_3 9$",
                  "$=\\dfrac{5}{2}\\cdot 2$",
                  "$=5$",
                ],
              },
              {
                type: "exercise",
                number: "5.27",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_2(\\sqrt{32})^4$.",
                hints: [
                  "Zapisz pierwiastek jako potęgę: $\\sqrt{32}=32^{\\frac{1}{2}}$.",
                  "Zastosuj wzór (4) dwukrotnie albo połącz wykładniki.",
                  "Oblicz $\\log_2 32$ i domknij rachunek.",
                ],
                answer: "$10$",
                explanation: [
                  "$\\sqrt{32}=32^{\\frac{1}{2}}$, więc $(\\sqrt{32})^4=32^2$.",
                  "$\\log_2(\\sqrt{32})^4=\\log_2 32^2=2\\log_2 32$.",
                  "$\\log_2 32=5$, więc $2\\cdot 5=10$.",
                ],
                cleanSolution: [
                  "$\\log_2(\\sqrt{32})^4=\\log_2 32^2$",
                  "$=2\\log_2 32$",
                  "$=2\\cdot 5$",
                  "$=10$",
                ],
              },
              {
                type: "exercise",
                number: "5.5",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_9 3$.",
                hint: "Zapisz $9=3^2$ i skorzystaj z $\\log_{a^r} b=\\dfrac{1}{r}\\log_a b$.",
                answer: "$\\dfrac{1}{2}$",
                explanation: [
                  "$\\log_9 3=\\log_{3^2} 3=\\dfrac{1}{2}\\log_3 3$.",
                  "$\\log_3 3=1$, więc wynik to $\\dfrac{1}{2}$.",
                ],
                cleanSolution: [
                  "$\\log_9 3=\\log_{3^2} 3$",
                  "$=\\dfrac{1}{2}\\log_3 3$",
                  "$=\\dfrac{1}{2}$",
                ],
              },
              {
                type: "exercise",
                number: "5.28",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_8 2$.",
                hint: "Zapisz $8=2^3$ i zastosuj wzór (5).",
                answer: "$\\dfrac{1}{3}$",
                explanation: [
                  "$\\log_8 2=\\log_{2^3} 2=\\dfrac{1}{3}\\log_2 2$.",
                  "$\\log_2 2=1$, więc wynik to $\\dfrac{1}{3}$.",
                ],
                cleanSolution: [
                  "$\\log_8 2=\\log_{2^3} 2$",
                  "$=\\dfrac{1}{3}\\log_2 2$",
                  "$=\\dfrac{1}{3}$",
                ],
              },
              {
                type: "exercise",
                number: "5.29",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_{27} 9$.",
                hint: "Zapisz $27=3^3$ oraz $9=3^2$, a potem użyj wzoru (5).",
                answer: "$\\dfrac{2}{3}$",
                explanation: [
                  "$\\log_{27} 9=\\log_{3^3} 9=\\dfrac{1}{3}\\log_3 9$.",
                  "$\\log_3 9=2$, więc $\\dfrac{1}{3}\\cdot 2=\\dfrac{2}{3}$.",
                ],
                cleanSolution: [
                  "$\\log_{27} 9=\\log_{3^3} 9$",
                  "$=\\dfrac{1}{3}\\log_3 9$",
                  "$=\\dfrac{1}{3}\\cdot 2$",
                  "$=\\dfrac{2}{3}$",
                ],
              },
              {
                type: "exercise",
                number: "5.30",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_{\\sqrt{8}} 4$.",
                hints: [
                  "Zapisz $\\sqrt{8}=8^{\\frac{1}{2}}=(2^3)^{\\frac{1}{2}}=2^{\\frac{3}{2}}$.",
                  "Zastosuj wzór (5) z podstawą $2^{\\frac{3}{2}}$.",
                  "Oblicz $\\log_2 4$ i domknij rachunek.",
                ],
                answer: "$\\dfrac{4}{3}$",
                explanation: [
                  "$\\sqrt{8}=2^{\\frac{3}{2}}$.",
                  "$\\log_{\\sqrt{8}} 4=\\log_{2^{\\frac{3}{2}}} 4=\\dfrac{2}{3}\\log_2 4$.",
                  "$\\log_2 4=2$, więc $\\dfrac{2}{3}\\cdot 2=\\dfrac{4}{3}$.",
                ],
                cleanSolution: [
                  "$\\log_{\\sqrt{8}} 4=\\log_{2^{\\frac{3}{2}}} 4$",
                  "$=\\dfrac{2}{3}\\log_2 4$",
                  "$=\\dfrac{2}{3}\\cdot 2$",
                  "$=\\dfrac{4}{3}$",
                ],
              },
            ],
          },
          {
            type: "exercise-group",
            title: "Wzór (6) - logarytm ilorazu",
            formulaLabel: "(6)",
            exercises: [
              {
                type: "exercise",
                number: "5.6",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_2 32 - \\log_2 4$.",
                hint: "Różnica logarytmów o tej samej podstawie to logarytm ilorazu.",
                answer: "$3$",
                explanation: [
                  "$\\log_2 32 - \\log_2 4 = \\log_2\\dfrac{32}{4}=\\log_2 8$.",
                  "$8=2^3$, więc $\\log_2 8=3$.",
                ],
                cleanSolution: [
                  "$\\log_2 32-\\log_2 4=\\log_2\\dfrac{32}{4}$",
                  "$=\\log_2 8$",
                  "$=3$",
                ],
              },
              {
                type: "exercise",
                number: "5.31",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_5 125 - \\log_5 5$.",
                hint: "Zastosuj wzór (6), a potem uprość iloraz pod logarytmem.",
                answer: "$2$",
                explanation: [
                  "$\\log_5 125 - \\log_5 5=\\log_5\\dfrac{125}{5}=\\log_5 25$.",
                  "$25=5^2$, więc $\\log_5 25=2$.",
                ],
                cleanSolution: [
                  "$\\log_5 125-\\log_5 5=\\log_5\\dfrac{125}{5}$",
                  "$=\\log_5 25$",
                  "$=2$",
                ],
              },
              {
                type: "exercise",
                number: "5.32",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_3 18 - \\log_3 2$.",
                hint: "Zapisz różnicę jako logarytm ilorazu i uprość $\\dfrac{18}{2}$.",
                answer: "$2$",
                explanation: [
                  "$\\log_3 18 - \\log_3 2=\\log_3\\dfrac{18}{2}=\\log_3 9$.",
                  "$9=3^2$, więc $\\log_3 9=2$.",
                ],
                cleanSolution: [
                  "$\\log_3 18-\\log_3 2=\\log_3\\dfrac{18}{2}$",
                  "$=\\log_3 9$",
                  "$=2$",
                ],
              },
              {
                type: "exercise",
                number: "5.33",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_2 48 - \\log_2 3 - \\log_2 2$.",
                hints: [
                  "Najpierw połącz dwie pierwsze różnice wzorem (6), albo od razu zapisz wszystko jako jeden iloraz.",
                  "Uprość $\\dfrac{48}{3\\cdot 2}$.",
                  "Oblicz $\\log_2$ z otrzymanej potęgi dwójki.",
                ],
                answer: "$3$",
                explanation: [
                  "$\\log_2 48 - \\log_2 3 - \\log_2 2=\\log_2\\dfrac{48}{3\\cdot 2}=\\log_2\\dfrac{48}{6}=\\log_2 8$.",
                  "$8=2^3$, więc $\\log_2 8=3$.",
                ],
                cleanSolution: [
                  "$\\log_2 48-\\log_2 3-\\log_2 2=\\log_2\\dfrac{48}{3\\cdot 2}$",
                  "$=\\log_2 8$",
                  "$=3$",
                ],
              },
              {
                type: "exercise",
                number: "5.36",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_3 9^4 - \\log_3 27$.",
                hint: "Najpierw wyciągnij wykładnik wzorem (4), a potem odejmij wzorem (6).",
                hints: [
                  "Z (4): $\\log_3 9^4=4\\log_3 9$.",
                  "Oblicz $4\\log_3 9-\\log_3 27$ albo zapisz od razu jako $\\log_3\\dfrac{9^4}{27}$.",
                ],
                answer: "$5$",
                explanation: [
                  "Z (4): $\\log_3 9^4=4\\log_3 9=4\\cdot 2=8$.",
                  "$\\log_3 27=3$, więc $8-3=5$.",
                  "Inaczej: $\\log_3 9^4-\\log_3 27=\\log_3\\dfrac{6561}{27}=\\log_3 243=5$.",
                ],
                cleanSolution: [
                  "$\\log_3 9^4-\\log_3 27=4\\log_3 9-\\log_3 27$",
                  "$=8-3$",
                  "$=5$",
                ],
              },
              {
                type: "exercise",
                number: "5.37",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_8 32 - \\log_8 2$.",
                hint: "Użyj wzoru (5) dla każdego składnika albo najpierw zapisz różnicę wzorem (6).",
                hints: [
                  "Zapisz $8=2^3$, $32=2^5$.",
                  "Z (5): $\\log_8 32=\\dfrac{5}{3}$ oraz $\\log_8 2=\\dfrac{1}{3}$.",
                  "Odejmij albo sprawdź: $\\log_8\\dfrac{32}{2}=\\log_8 16$.",
                ],
                answer: "$\\dfrac{4}{3}$",
                explanation: [
                  "Z (5): $\\log_8 32=\\log_{2^3} 2^5=\\dfrac{5}{3}$.",
                  "Z (5): $\\log_8 2=\\dfrac{1}{3}$.",
                  "Różnica: $\\dfrac{5}{3}-\\dfrac{1}{3}=\\dfrac{4}{3}$.",
                ],
                cleanSolution: [
                  "$\\log_8 32-\\log_8 2=\\dfrac{5}{3}-\\dfrac{1}{3}$",
                  "$=\\dfrac{4}{3}$",
                ],
              },
            ],
          },
          {
            type: "exercise-group",
            title: "Wzory (7) i (8) - zmiana podstawy",
            formulaLabel: "(7)",
            exercises: [
              {
                type: "exercise",
                number: "5.7",
                level: "rozszerzony",
                prompt: "Oblicz $\\log_9 27$, zapisując go przy podstawie $3$.",
                hint: "Użyj $\\log_b c=\\dfrac{\\log_a c}{\\log_a b}$ z $a=3$.",
                answer: "$\\dfrac{3}{2}$",
                explanation: [
                  "$\\log_9 27=\\dfrac{\\log_3 27}{\\log_3 9}=\\dfrac{3}{2}$.",
                ],
                cleanSolution: [
                  "$\\log_9 27=\\dfrac{\\log_3 27}{\\log_3 9}$",
                  "$=\\dfrac{3}{2}$",
                ],
              },
              {
                type: "exercise",
                number: "5.8",
                level: "rozszerzony",
                prompt: "Oblicz $\\log_{32} 2$.",
                hint: "Skorzystaj z $\\log_a b=\\dfrac{1}{\\log_b a}$.",
                answer: "$\\dfrac{1}{5}$",
                explanation: [
                  "$\\log_{32} 2=\\dfrac{1}{\\log_2 32}$.",
                  "$\\log_2 32=5$, więc wynik to $\\dfrac{1}{5}$.",
                ],
                cleanSolution: [
                  "$\\log_{32} 2=\\dfrac{1}{\\log_2 32}$",
                  "$=\\dfrac{1}{5}$",
                ],
              },
              {
                type: "exercise",
                number: "5.10",
                level: "rozszerzony",
                prompt:
                  "Jeżeli $a=\\log_2 5$, wykaż, że $\\log_5 16=\\dfrac{4}{a}$.",
                hint: "Zapisz $\\log_5 16$ przy podstawie $2$ i skorzystaj z $16=2^4$ oraz z odwrotności logarytmów.",
                answer: "Tożsamość zachodzi: $\\log_5 16=\\dfrac{4}{a}$.",
                explanation: [
                  "$\\log_5 16=\\dfrac{\\log_2 16}{\\log_2 5}=\\dfrac{\\log_2(2^4)}{a}=\\dfrac{4}{a}$.",
                ],
                cleanSolution: [
                  "$\\log_5 16=\\dfrac{\\log_2 16}{\\log_2 5}$",
                  "$=\\dfrac{\\log_2(2^4)}{a}$",
                  "$=\\dfrac{4}{a}$",
                ],
              },
              {
                type: "exercise",
                number: "5.11",
                level: "rozszerzony",
                prompt:
                  "Jeżeli $a=\\log_2 3$, wykaż, że $\\log_6 12=\\dfrac{a+2}{a+1}$.",
                hints: [
                  "Zapisz $\\log_6 12$ przy podstawie $2$.",
                  "Rozbij $12=3\\cdot 4$ oraz $6=3\\cdot 2$.",
                  "W liczniku dostaniesz $a+2$, w mianowniku $a+1$.",
                ],
                answer: "Tożsamość zachodzi: $\\log_6 12=\\dfrac{a+2}{a+1}$.",
                explanation: [
                  "$\\log_6 12=\\dfrac{\\log_2 12}{\\log_2 6}$.",
                  "$\\log_2 12=\\log_2(3\\cdot 4)=\\log_2 3+\\log_2 4=a+2$.",
                  "$\\log_2 6=\\log_2(3\\cdot 2)=\\log_2 3+\\log_2 2=a+1$.",
                  "Stąd $\\log_6 12=\\dfrac{a+2}{a+1}$.",
                ],
                cleanSolution: [
                  "$\\log_6 12=\\dfrac{\\log_2 12}{\\log_2 6}$",
                  "$\\log_2 12=a+2$",
                  "$\\log_2 6=a+1$",
                  "$\\log_6 12=\\dfrac{a+2}{a+1}$",
                ],
              },
              {
                type: "exercise",
                number: "5.12",
                level: "rozszerzony",
                prompt:
                  "Jeżeli $a=\\log_2 3$ oraz $b=\\log_3 5$, wykaż, że $\\log_6 15=\\dfrac{a(1+b)}{1+a}$.",
                hints: [
                  "Zapisz $\\log_6 15$ przy podstawie $2$.",
                  "Zauważ, że $\\log_2 5=ab$.",
                  "Użyj $15=3\\cdot 5$ oraz $6=2\\cdot 3$.",
                ],
                answer: "Tożsamość zachodzi: $\\log_6 15=\\dfrac{a(1+b)}{1+a}$.",
                explanation: [
                  "$\\log_6 15=\\dfrac{\\log_2 15}{\\log_2 6}$.",
                  "$\\log_2 15=\\log_2(3\\cdot 5)=\\log_2 3+\\log_2 5=a+ab=a(1+b)$, bo $\\log_2 5=\\log_2 3\\cdot\\log_3 5=ab$.",
                  "$\\log_2 6=\\log_2(2\\cdot 3)=1+a$.",
                  "Stąd $\\log_6 15=\\dfrac{a(1+b)}{1+a}$.",
                ],
                cleanSolution: [
                  "$\\log_6 15=\\dfrac{\\log_2 15}{\\log_2 6}$",
                  "$\\log_2 5=ab$",
                  "$\\log_2 15=a+ab=a(1+b)$",
                  "$\\log_2 6=1+a$",
                  "$\\log_6 15=\\dfrac{a(1+b)}{1+a}$",
                ],
              },
              {
                type: "exercise",
                number: "5.13",
                level: "rozszerzony",
                prompt:
                  "Jeżeli $a=\\log_2 5$ oraz $b=\\log_5 3$, wykaż, że $\\log_{12} 75=\\dfrac{a(1+2b)}{2+ab}$.",
                hints: [
                  "Zapisz $\\log_{12} 75$ przy podstawie $2$.",
                  "Przydatne: $75=3\\cdot 25$, $12=4\\cdot 3$ oraz $\\log_2 3=ab$.",
                  "W liczniku zbierz $a(1+2b)$, w mianowniku $2+ab$.",
                ],
                answer: "Tożsamość zachodzi: $\\log_{12} 75=\\dfrac{a(1+2b)}{2+ab}$.",
                explanation: [
                  "$\\log_{12} 75=\\dfrac{\\log_2 75}{\\log_2 12}$.",
                  "$\\log_2 75=\\log_2(3\\cdot 25)=\\log_2 3+\\log_2 25=ab+2a=a(1+2b)$, bo $\\log_2 3=ab$ oraz $\\log_2 25=2\\log_2 5=2a$.",
                  "$\\log_2 12=\\log_2(4\\cdot 3)=2+\\log_2 3=2+ab$.",
                  "Stąd $\\log_{12} 75=\\dfrac{a(1+2b)}{2+ab}$.",
                ],
                cleanSolution: [
                  "$\\log_{12} 75=\\dfrac{\\log_2 75}{\\log_2 12}$",
                  "$\\log_2 3=ab$",
                  "$\\log_2 75=ab+2a=a(1+2b)$",
                  "$\\log_2 12=2+ab$",
                  "$\\log_{12} 75=\\dfrac{a(1+2b)}{2+ab}$",
                ],
              },
            ],
          },
          {
            type: "exercise-group",
            title: "Sekcja 4 - skomplikowany logarytm",
            formulaLabel: "sec4",
            exercises: [
              {
                type: "exercise",
                number: "5.9",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_{\\sqrt[3]{16}} \\sqrt[5]{32}$.",
                hints: [
                  "Zapisz pierwiastki jako potęgi: $\\sqrt[n]{x}=x^{\\frac{1}{n}}$.",
                  "Sprowadź obie strony do podstawy $2$.",
                  "Porównaj wykładniki w równaniu $2^{\\ldots}=2^{\\ldots}$.",
                ],
                answer: "$\\dfrac{3}{4}$",
                explanation: [
                  "Niech $\\log_{\\sqrt[3]{16}} \\sqrt[5]{32}=c$. Wtedy $\\left(\\sqrt[3]{16}\\right)^c=\\sqrt[5]{32}$.",
                  "$\\left(16^{\\frac{1}{3}}\\right)^c=32^{\\frac{1}{5}}$.",
                  "$16^{\\frac{c}{3}}=32^{\\frac{1}{5}}$.",
                  "$16=2^4$, $32=2^5$, więc $(2^4)^{\\frac{c}{3}}=(2^5)^{\\frac{1}{5}}$.",
                  "$2^{\\frac{4c}{3}}=2^1$, stąd $\\dfrac{4c}{3}=1$ i $c=\\dfrac{3}{4}$.",
                ],
                cleanSolution: [
                  "$\\log_{\\sqrt[3]{16}} \\sqrt[5]{32}=c$",
                  "$\\left(\\sqrt[3]{16}\\right)^c=\\sqrt[5]{32}$",
                  "$\\left(16^{\\frac{1}{3}}\\right)^c=32^{\\frac{1}{5}}$",
                  "$16^{\\frac{c}{3}}=32^{\\frac{1}{5}}$",
                  "$(2^4)^{\\frac{c}{3}}=(2^5)^{\\frac{1}{5}}$",
                  "$2^{\\frac{4c}{3}}=2^1$",
                  "$c=\\dfrac{3}{4}$",
                ],
              },
              {
                type: "exercise",
                number: "5.14",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_{\\sqrt[5]{9}} \\sqrt[3]{27}$.",
                hints: [
                  "Zapisz pierwiastki jako potęgi.",
                  "Sprowadź obie strony do podstawy $3$.",
                  "Z $3^{\\frac{2c}{5}}=3^1$ wylicz $c$.",
                ],
                answer: "$\\dfrac{5}{2}$",
                explanation: [
                  "Niech $\\log_{\\sqrt[5]{9}} \\sqrt[3]{27}=c$. Wtedy $\\left(\\sqrt[5]{9}\\right)^c=\\sqrt[3]{27}$.",
                  "$\\left(9^{\\frac{1}{5}}\\right)^c=27^{\\frac{1}{3}}$.",
                  "$9^{\\frac{c}{5}}=27^{\\frac{1}{3}}$.",
                  "$9=3^2$, $27=3^3$, więc $(3^2)^{\\frac{c}{5}}=(3^3)^{\\frac{1}{3}}$.",
                  "$3^{\\frac{2c}{5}}=3^1$, stąd $\\dfrac{2c}{5}=1$ i $c=\\dfrac{5}{2}$.",
                ],
                cleanSolution: [
                  "$\\log_{\\sqrt[5]{9}} \\sqrt[3]{27}=c$",
                  "$\\left(\\sqrt[5]{9}\\right)^c=\\sqrt[3]{27}$",
                  "$\\left(9^{\\frac{1}{5}}\\right)^c=27^{\\frac{1}{3}}$",
                  "$9^{\\frac{c}{5}}=27^{\\frac{1}{3}}$",
                  "$(3^2)^{\\frac{c}{5}}=(3^3)^{\\frac{1}{3}}$",
                  "$3^{\\frac{2c}{5}}=3^1$",
                  "$c=\\dfrac{5}{2}$",
                ],
              },
              {
                type: "exercise",
                number: "5.15",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_{\\sqrt[4]{\\frac{1}{27}}} \\sqrt[6]{9}$.",
                hints: [
                  "Zapisz $\\dfrac{1}{27}=3^{-3}$ oraz $9=3^2$.",
                  "Po zamianie pierwiastków porównaj wykładniki przy podstawie $3$.",
                  "Z $-\\dfrac{3c}{4}=\\dfrac{1}{3}$ wylicz $c$.",
                ],
                answer: "$-\\dfrac{4}{9}$",
                explanation: [
                  "Niech $\\log_{\\sqrt[4]{\\dfrac{1}{27}}} \\sqrt[6]{9}=c$. Wtedy $\\left(\\sqrt[4]{\\dfrac{1}{27}}\\right)^c=\\sqrt[6]{9}$.",
                  "$\\left(\\left(\\dfrac{1}{27}\\right)^{\\frac{1}{4}}\\right)^c=9^{\\frac{1}{6}}$.",
                  "$\\left(\\dfrac{1}{27}\\right)^{\\frac{c}{4}}=9^{\\frac{1}{6}}$.",
                  "$\\dfrac{1}{27}=3^{-3}$, $9=3^2$, więc $(3^{-3})^{\\frac{c}{4}}=(3^2)^{\\frac{1}{6}}$.",
                  "$3^{-\\frac{3c}{4}}=3^{\\frac{1}{3}}$, stąd $-\\dfrac{3c}{4}=\\dfrac{1}{3}$ i $c=-\\dfrac{4}{9}$.",
                ],
                cleanSolution: [
                  "$\\log_{\\sqrt[4]{\\dfrac{1}{27}}} \\sqrt[6]{9}=c$",
                  "$\\left(\\sqrt[4]{\\dfrac{1}{27}}\\right)^c=\\sqrt[6]{9}$",
                  "$\\left(\\left(\\dfrac{1}{27}\\right)^{\\frac{1}{4}}\\right)^c=9^{\\frac{1}{6}}$",
                  "$\\left(\\dfrac{1}{27}\\right)^{\\frac{c}{4}}=9^{\\frac{1}{6}}$",
                  "$(3^{-3})^{\\frac{c}{4}}=(3^2)^{\\frac{1}{6}}$",
                  "$3^{-\\frac{3c}{4}}=3^{\\frac{1}{3}}$",
                  "$c=-\\dfrac{4}{9}$",
                ],
              },
            ],
          },
        ],
      },
      {
        number: "6",
        heading: "Zadania maturalne",
        blocks: [
          {
            type: "text",
            content:
              "Poniżej zadania z arkuszy maturalnych powiązane z logarytmami. Kliknij kafelek, aby otworzyć pełne zadanie.",
          },
          {
            type: "related-matura-tasks",
          },
        ],
      },
      {
        number: "7",
        heading: "Podsumowanie",
        blocks: [
          {
            type: "text",
            content:
              "Na koniec zbierz najważniejsze fakty, pułapki i niuanse, które warto mieć pod ręką przy zadaniach.",
          },
          {
            type: "callout",
            variant: "insight",
            title: "Zapamiętaj - definicja i zapis",
            content:
              "Z definicji (1): $\\log_a b=c$ wtedy i tylko wtedy, gdy $a^c=b$ (dla $a>0$, $a\\neq 1$, $b>0$). Stąd tożsamość (2): $a^{\\log_a b}=b$. Zapisy $\\log x$ oraz $\\lg x$ oznaczają $\\log_{10} x$.",
          },
          {
            type: "callout",
            variant: "insight",
            title: "Zapamiętaj - własności",
            content:
              "Przy tej samej podstawie: iloczyn (3) daje sumę, iloraz (6) daje różnicę, potęga w argumencie (4) wychodzi przed logarytm, a potęga w podstawie (5) daje czynnik $\\dfrac{1}{r}$. Na rozszerzeniu używasz zmiany podstawy (7) oraz odwrotności (8).",
          },
          {
            type: "callout",
            variant: "insight",
            title: "Zapamiętaj - schemat obliczania",
            content:
              "Gdy wynik nie jest oczywisty: oznacz $c=\\log_a b$, zapisz $a^c=b$, zamień pierwiastki na potęgi ($\\sqrt[n]{x}=x^{\\frac{1}{n}}$), sprowadź obie strony do jednej podstawy i porównaj wykładniki. Na koniec sprawdź podstawieniem.",
          },
          {
            type: "callout",
            variant: "pitfall",
            title: "Częsty błąd - kolejność w ilorazie",
            content:
              "Kolejność ma znaczenie: przy $\\log_a x-\\log_a y$ do licznika idzie $x$, a do mianownika $y$. Poprawnie: $\\log_a x-\\log_a y=\\log_a\\dfrac{x}{y}$. Błędnie: $\\log_a x-\\log_a y=\\log_a\\dfrac{y}{x}$.",
          },
          {
            type: "callout",
            variant: "pitfall",
            title: "Częsty błąd - obliczanie skomplikowanych logarytmów",
            content:
              "Przy liczeniu $\\log_a b$ z pierwiastkami nie mieszaj podstaw w jednym kroku. Najpierw zamień pierwiastki na potęgi, potem sprowadź obie strony do tej samej podstawy i dopiero porównuj wykładniki.",
          },
          {
            type: "callout",
            variant: "pitfall",
            title: "Częsty błąd - dziedzina",
            content:
              "Zawsze sprawdzaj warunki: podstawa $a>0$ i $a\\neq 1$, argument $b>0$. Przy równaniach i nierównościach z logarytmem najpierw zapisz dziedzinę, dopiero potem przekształcaj.",
          },
          {
            type: "callout",
            variant: "why",
            title: "Niuans - podstawa z przedziału $(0,1)$",
            content:
              "Jeśli $0<a<1$, funkcja $\\log_a$ jest malejąca, a wynik może być ujemny nawet przy „zwykłych” liczbach dodatnich. Ujemny wynik nie oznacza automatycznie błędu - kontroluj go przez definicję $a^c=b$.",
          },
          {
            type: "callout",
            variant: "why",
            title: "Niuans - zmiana podstawy",
            contentLevel: "rozszerzenie",
            content:
              "Wzór (7) pozwala przeliczyć każdy logarytm na wygodniejszą podstawę (często $2$, $10$ albo $e$). Wzór (8) to skrót: $\\log_a b=\\dfrac{1}{\\log_b a}$. Przydatne, gdy w zadaniu pojawiają się różne podstawy albo wyrażenia typu $\\log_b a\\cdot\\log_a b=1$.",
          },
          {
            type: "callout",
            variant: "why",
            title: "Niuans - co wolno wyciągać przed logarytm",
            content:
              "Przed logarytm wychodzi wykładnik argumentu (4), ale nie „wyciągasz” dowolnie podstawy ani nie dzielisz logarytmów jak zwykłych liczb. Potęgę w podstawie obsługuje osobny wzór (5): $\\log_{a^r} b=\\dfrac{1}{r}\\log_a b$.",
          },
        ],
      },
    ],
  },
];

export function getSampleArticleById(id) {
  if (!id) return null;
  return sampleArticles.find((article) => article.id === id) ?? null;
}

export function getArticleContentModes(article) {
  if (!article) return ["podstawa"];
  if (Array.isArray(article.contentModes) && article.contentModes.length > 0) {
    return article.contentModes;
  }
  return ["podstawa"];
}

export function parseArticleContentModesParam(value, availableModes) {
  const available = availableModes?.length ? availableModes : ["podstawa"];
  const raw = String(value || "")
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part === "podstawa" || part === "rozszerzenie")
    .filter((part) => available.includes(part));
  if (raw.length > 0) return [...new Set(raw)];
  if (available.includes("podstawa")) return ["podstawa"];
  return [available[0]];
}

export function defaultArticleContentModes(article) {
  const available = getArticleContentModes(article);
  if (available.includes("podstawa")) return ["podstawa"];
  return [available[0]];
}

function resolveNodeContentLevel(node, inherited = "podstawa") {
  if (node?.contentLevel === "podstawa" || node?.contentLevel === "rozszerzenie") {
    return node.contentLevel;
  }
  return inherited;
}

function isContentLevelVisible(level, selectedModes) {
  return selectedModes.includes(level);
}

export function filterArticleByContentModes(article, selectedModes) {
  if (!article) return null;
  const modes =
    Array.isArray(selectedModes) && selectedModes.length > 0
      ? selectedModes
      : defaultArticleContentModes(article);

  const filterLegend = (legend) =>
    (legend || []).filter((item) =>
      isContentLevelVisible(resolveNodeContentLevel(item), modes),
    );

  const filterBlocks = (blocks, inherited) =>
    (blocks || [])
      .map((block) => {
        const blockLevel = resolveNodeContentLevel(block, inherited);
        if (!isContentLevelVisible(blockLevel, modes)) return null;

        if (block.type === "formula-list") {
          const items = (block.items || []).filter((item) =>
            isContentLevelVisible(resolveNodeContentLevel(item, blockLevel), modes),
          );
          if (items.length === 0) return null;
          return { ...block, items };
        }

        if (block.type === "exercise-group") {
          const exercises = (block.exercises || []).filter((item) =>
            isContentLevelVisible(resolveNodeContentLevel(item, blockLevel), modes),
          );
          if (exercises.length === 0) return null;
          return { ...block, exercises };
        }

        return block;
      })
      .filter(Boolean);

  const sections = (article.sections || [])
    .map((section) => {
      const sectionLevel = resolveNodeContentLevel(section);
      if (!isContentLevelVisible(sectionLevel, modes)) return null;

      if (section.blocks) {
        const blocks = filterBlocks(section.blocks, sectionLevel);
        if (blocks.length === 0) return null;
        return { ...section, blocks };
      }

      if (section.paragraphs) {
        return section;
      }

      return section;
    })
    .filter(Boolean);

  return {
    ...article,
    legend: filterLegend(article.legend),
    sections,
  };
}
