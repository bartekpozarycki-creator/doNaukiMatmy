export const sampleArticles = [
  {
    id: "artykul-logarytmy",
    title: "Logarytmy",
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
      { label: "Poziom rozszerzony", dot: "bg-blue-300", contentLevel: "rozszerzenie" },
    ],
    sections: [
      {
        number: "1",
        heading: "Definicja",
        blocks: [
          {
            type: "callout",
            variant: "definition",
            title: "Definicja logarytmu",
            content:
              "Niech **$a>0$** i **$a\\neq 1$**. **Logarytmem** $\\log_a b$ liczby **$b>0$** przy podstawie $a$ nazywamy wykładnik $c$, do którego należy podnieść $a$, aby otrzymać $b$.",
          },
          {
            type: "list",
            items: [
              "Wzór (1) — **definicja**: $\\log_a b=c$ wtedy i tylko wtedy, gdy $a^c=b$.",
              "Wzór (2) — **tożsamość równoważna**: $a^{\\log_a b}=b$.",
            ],
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
                  result: "Wynik: $\\log_a b=3$, czyli $\\log_2 8=3$.",
                },
              },
              {
                latex: "a^{\\log_a b} = b",
                label: "(2)",
                accent: "blue",
                caption: "tożsamość równoważna",
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
            collapsible: true,
            title: "Dlaczego wzór (2) wynika z definicji (1)",
            content:
              "Wzór (2) to definicja (1) z podstawionym **$c=\\log_a b$**. Z (1): $\\log_a b=c$ wtedy i tylko wtedy, gdy $a^c=b$. Po wstawieniu $c=\\log_a b$ dostajemy $a^{\\log_a b}=b$.",
          },
          {
            type: "callout",
            variant: "insight",
            title: "Zapamiętaj",
            content:
              "Zapisy **$\\log x$** oraz **$\\lg x$** oznaczają **$\\log_{10} x$**.",
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
              "Dla **$x>0$**, **$y>0$** oraz dowolnego **$r$** prawdziwe są cztery własności:",
          },
          {
            type: "list",
            items: [
              "(3) — **logarytm iloczynu**: $\\log_a(xy)=\\log_a x+\\log_a y$",
              "(4) — **logarytm potęgi**: $\\log_a x^r=r\\log_a x$",
              "(5) — **potęga w podstawie**: $\\log_{a^r} b=\\dfrac{1}{r}\\log_a b$",
              "(6) — **logarytm ilorazu**: $\\log_a\\dfrac{x}{y}=\\log_a x-\\log_a y$",
            ],
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
            title: "Częsty błąd — kolejność przy różnicy",
            content:
              "Przy **$\\log_a x-\\log_a y$** do **licznika** idzie $x$, do **mianownika** $y$.",
            example: {
              prompt: "Uprość $\\log_2 32-\\log_2 4$.",
              wrong: "$\\log_2 32-\\log_2 4=\\log_2\\dfrac{4}{32}=\\log_2\\dfrac{1}{8}=-3$",
              right: "$\\log_2 32-\\log_2 4=\\log_2\\dfrac{32}{4}=\\log_2 8=3$",
              note: "Pierwszy logarytm → licznik, drugi → mianownik.",
            },
          },
          {
            type: "callout",
            variant: "pitfall",
            title: "Częsty błąd — współczynniki przy sumie i różnicy",
            content:
              "Wzory (3) i (6) działają wprost tylko przy współczynniku **$1$**: $\\log_a x\\pm\\log_a y$.",
            example: {
              prompt: "Uprość $2\\log_3 4+\\log_3 2$.",
              wrong: "$2\\log_3 4+\\log_3 2=\\log_3(4\\cdot 2)=\\log_3 8$",
              right:
                "$2\\log_3 4+\\log_3 2=\\log_3 4^2+\\log_3 2=\\log_3 16+\\log_3 2=\\log_3(16\\cdot 2)=\\log_3 32$",
              note: "Najpierw współczynnik wchodzi do wykładnika wzorem (4), potem łączysz wzorem (3).",
            },
          },
          {
            type: "list",
            items: [
              "Jeśli masz $2\\log_a x+\\log_a y$ — najpierw wzór (4): $2\\log_a x=\\log_a x^2$.",
              "Gdy przed oboma logarytmami stoi to samo $k$: $k\\log_a x\\pm k\\log_a y=k(\\log_a x\\pm\\log_a y)$.",
              "W wyniku też musi zostać współczynnik $k$.",
            ],
          },
        ],
      },
      {
        number: "3",
        heading: "Zmiana podstawy",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "callout",
            variant: "definition",
            contentLevel: "rozszerzenie",
            title: "Zmiana podstawy",
            content:
              "Gdy **$a>0$**, **$a\\neq 1$**, **$b>0$**, **$b\\neq 1$** oraz **$c>0$**, logarytm przy podstawie $b$ wyrażamy przez logarytmy przy podstawie $a$.",
          },
          {
            type: "list",
            contentLevel: "rozszerzenie",
            items: [
              "(7) — **zmiana podstawy**: $\\log_b c=\\dfrac{\\log_a c}{\\log_a b}$",
              "(8) — **szczególny przypadek**: $\\log_a b=\\dfrac{1}{\\log_b a}$",
            ],
          },
          {
            type: "formula-list",
            contentLevel: "rozszerzenie",
            items: [
              {
                latex: "\\log_b c = \\frac{\\log_a c}{\\log_a b}",
                label: "(7)",
                accent: "blue",
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
                accent: "blue",
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
            collapsible: true,
            title: "Dlaczego wzór (8) wynika ze zmiany podstawy (7)",
            content:
              "Weź (7) w postaci $\\log_a b=\\dfrac{\\log_b b}{\\log_b a}$. Ponieważ **$\\log_b b=1$**, dostajemy $\\log_a b=\\dfrac{1}{\\log_b a}$.",
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
              "Gdy wynik $\\log_a b$ nie jest oczywisty „na oko” — **nie zgaduj**. Przejdź na równanie wykładnicze z definicji (1).",
          },
          {
            type: "callout",
            variant: "insight",
            title: "Główny pomysł",
            content:
              "Szukamy liczby **$c$**, dla której **$a^c=b$**. Zapisujemy $a$ i $b$ w tej samej podstawie i porównujemy wykładniki. Pamiętaj: **$\\sqrt[n]{x}=x^{\\frac{1}{n}}$**.",
          },
          {
            type: "text",
            content: "**Schemat rozwiązania** — zawsze ten sam:",
          },
          {
            type: "steps",
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
            content: "**Przykład** rozwiązany dokładnie według schematu:",
          },
          {
            type: "guided-example",
            title: "Przykład",
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
            title: "Częsty błąd — mieszanie podstaw",
            content:
              "Nie mieszaj podstaw w jednym kroku. Kolejność: **pierwiastki → potęgi → jedna podstawa → porównanie wykładników**. Wynik ujemny jest możliwy.",
            example: {
              prompt: "Oblicz $\\log_{\\sqrt[4]{8}}\\sqrt[6]{32}$.",
              wrong:
                "Od razu „zgadujesz” wynik albo mieszasz $8$ i $32$ bez wspólnej podstawy.",
              right:
                "Niech wynik będzie $c$. Wtedy $\\left(\\sqrt[4]{8}\\right)^c=\\sqrt[6]{32}$, czyli $8^{\\frac{c}{4}}=32^{\\frac{1}{6}}$, a po przejściu na podstawę $2$: $2^{\\frac{3c}{4}}=2^{\\frac{5}{6}}$, więc $c=\\dfrac{10}{9}$.",
              note: "Kolejność: pierwiastki → potęgi → jedna podstawa → porównanie wykładników.",
            },
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
              {
                type: "exercise",
                number: "5.59",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_4 64$.",
                hint: "Szukasz wykładnika $c$, dla którego $4^c=64$.",
                answer: "$3$",
                explanation: [
                  "Niech $\\log_4 64=c$. Wtedy $4^c=64$.",
                  "$64=4^3$, więc $c=3$.",
                ],
                cleanSolution: [
                  "$\\log_4 64=c$",
                  "$4^c=64$",
                  "$64=4^3$",
                  "$c=3$",
                ],
              },
              {
                type: "exercise",
                number: "5.60",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_3\\dfrac{1}{27}$.",
                hint: "Zapisz $\\dfrac{1}{27}$ jako potęgę trójki.",
                answer: "$-3$",
                explanation: [
                  "Niech $\\log_3\\dfrac{1}{27}=c$. Wtedy $3^c=\\dfrac{1}{27}$.",
                  "$\\dfrac{1}{27}=3^{-3}$, więc $c=-3$.",
                ],
                cleanSolution: [
                  "$\\log_3\\dfrac{1}{27}=c$",
                  "$3^c=\\dfrac{1}{27}$",
                  "$\\dfrac{1}{27}=3^{-3}$",
                  "$c=-3$",
                ],
              },
              {
                type: "exercise",
                number: "5.61",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_{\\sqrt{2}} 8$.",
                hints: [
                  "Zapisz definicję: $(\\sqrt{2})^c=8$.",
                  "Przejdź na podstawę $2$: $\\sqrt{2}=2^{\\frac{1}{2}}$ oraz $8=2^3$.",
                ],
                answer: "$6$",
                explanation: [
                  "Niech $\\log_{\\sqrt{2}} 8=c$. Wtedy $(\\sqrt{2})^c=8$.",
                  "$\\sqrt{2}=2^{\\frac{1}{2}}$ oraz $8=2^3$, więc $\\left(2^{\\frac{1}{2}}\\right)^c=2^3$, czyli $2^{\\frac{c}{2}}=2^3$.",
                  "Stąd $\\dfrac{c}{2}=3$ i $c=6$.",
                ],
                cleanSolution: [
                  "$\\log_{\\sqrt{2}} 8=c$",
                  "$(\\sqrt{2})^c=8$",
                  "$2^{\\frac{c}{2}}=2^3$",
                  "$c=6$",
                ],
              },
              {
                type: "exercise",
                number: "5.62",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\log_{\\frac{1}{3}} 27$.",
                hints: [
                  "Zapisz definicję: $\\left(\\dfrac{1}{3}\\right)^c=27$.",
                  "Przejdź na potęgi trójki: $\\dfrac{1}{3}=3^{-1}$ oraz $27=3^3$.",
                ],
                answer: "$-3$",
                explanation: [
                  "Niech $\\log_{\\frac{1}{3}} 27=c$. Wtedy $\\left(\\dfrac{1}{3}\\right)^c=27$.",
                  "$\\dfrac{1}{3}=3^{-1}$ oraz $27=3^3$, więc $(3^{-1})^c=3^3$, czyli $3^{-c}=3^3$.",
                  "Stąd $-c=3$ i $c=-3$.",
                ],
                cleanSolution: [
                  "$\\log_{\\frac{1}{3}} 27=c$",
                  "$\\left(\\dfrac{1}{3}\\right)^c=27$",
                  "$3^{-c}=3^3$",
                  "$c=-3$",
                ],
              },
              {
                type: "exercise",
                number: "5.63",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Liczba $x$ spełnia równanie $\\log_3(x+2)=3$. Wtedy $x$ jest równy",
                options: [
                  { key: "A", text: "$7$" },
                  { key: "B", text: "$9$" },
                  { key: "C", text: "$25$" },
                  { key: "D", text: "$29$" },
                ],
                hints: [
                  "Z definicji: $3^3=x+2$.",
                  "Pamiętaj też o dziedzinie: $x+2>0$.",
                ],
                answer: "C. $25$",
                explanation: [
                  "Z definicji: $\\log_3(x+2)=3\\Leftrightarrow 3^3=x+2$.",
                  "$27=x+2$, więc $x=25$.",
                  "Dziedzina: $x+2>0\\Rightarrow x>-2$, więc $x=25$ jest poprawny.",
                ],
                cleanSolution: [
                  "$3^3=x+2$",
                  "$27=x+2$",
                  "$x=25$",
                ],
              },
              {
                type: "exercise",
                number: "5.64",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Liczba $x$ spełnia równanie $\\log_2(3x-1)=4$. Wtedy $x$ jest równy",
                options: [
                  { key: "A", text: "$5$" },
                  { key: "B", text: "$\\dfrac{16}{3}$" },
                  { key: "C", text: "$\\dfrac{17}{3}$" },
                  { key: "D", text: "$6$" },
                ],
                hints: [
                  "Z definicji: $2^4=3x-1$.",
                  "Sprawdź dziedzinę: $3x-1>0$.",
                ],
                answer: "C. $\\dfrac{17}{3}$",
                explanation: [
                  "Z definicji: $\\log_2(3x-1)=4\\Leftrightarrow 2^4=3x-1$.",
                  "$16=3x-1$, więc $3x=17$ i $x=\\dfrac{17}{3}$.",
                  "Dziedzina: $3x-1>0\\Rightarrow x>\\dfrac{1}{3}$, więc wynik jest poprawny.",
                ],
                cleanSolution: [
                  "$2^4=3x-1$",
                  "$16=3x-1$",
                  "$x=\\dfrac{17}{3}$",
                ],
              },
              {
                type: "exercise",
                number: "5.65",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Liczba $x$ spełnia równanie $\\log_{\\frac{1}{2}}(2x+1)=-3$. Wtedy $x$ jest równy",
                options: [
                  { key: "A", text: "$\\dfrac{7}{2}$" },
                  { key: "B", text: "$4$" },
                  { key: "C", text: "$\\dfrac{9}{2}$" },
                  { key: "D", text: "$8$" },
                ],
                hints: [
                  "Z definicji: $\\left(\\dfrac{1}{2}\\right)^{-3}=2x+1$.",
                  "Oblicz $\\left(\\dfrac{1}{2}\\right)^{-3}=2^3=8$.",
                ],
                answer: "A. $\\dfrac{7}{2}$",
                explanation: [
                  "Z definicji: $\\log_{\\frac{1}{2}}(2x+1)=-3\\Leftrightarrow \\left(\\dfrac{1}{2}\\right)^{-3}=2x+1$.",
                  "$\\left(\\dfrac{1}{2}\\right)^{-3}=2^3=8$, więc $8=2x+1$.",
                  "$2x=7$, stąd $x=\\dfrac{7}{2}$. Dziedzina: $2x+1>0\\Rightarrow x>-\\dfrac{1}{2}$.",
                ],
                cleanSolution: [
                  "$\\left(\\dfrac{1}{2}\\right)^{-3}=2x+1$",
                  "$8=2x+1$",
                  "$x=\\dfrac{7}{2}$",
                ],
              },
              {
                type: "exercise",
                number: "5.66",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Liczba $x$ spełnia równanie $\\log_{\\sqrt{3}}(x-2)=4$. Wtedy $x$ jest równy",
                options: [
                  { key: "A", text: "$7$" },
                  { key: "B", text: "$9$" },
                  { key: "C", text: "$11$" },
                  { key: "D", text: "$83$" },
                ],
                hints: [
                  "Z definicji: $(\\sqrt{3})^4=x-2$.",
                  "Zapisz $\\sqrt{3}=3^{\\frac{1}{2}}$ i uprość potęgę.",
                ],
                answer: "C. $11$",
                explanation: [
                  "Z definicji: $\\log_{\\sqrt{3}}(x-2)=4\\Leftrightarrow (\\sqrt{3})^4=x-2$.",
                  "$(\\sqrt{3})^4=\\left(3^{\\frac{1}{2}}\\right)^4=3^2=9$, więc $9=x-2$.",
                  "$x=11$. Dziedzina: $x-2>0\\Rightarrow x>2$.",
                ],
                cleanSolution: [
                  "$(\\sqrt{3})^4=x-2$",
                  "$9=x-2$",
                  "$x=11$",
                ],
              },
              {
                type: "exercise",
                number: "5.67",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Dla $x>0$ i $x\\neq 1$ zachodzi $\\log_x 81=4$. Wtedy $x$ jest równy",
                options: [
                  { key: "A", text: "$2$" },
                  { key: "B", text: "$3$" },
                  { key: "C", text: "$4$" },
                  { key: "D", text: "$9$" },
                ],
                hints: [
                  "Z definicji: $x^4=81$.",
                  "Zapisz $81=3^4$ i skorzystaj z $x>0$, $x\\neq 1$.",
                ],
                answer: "B. $3$",
                explanation: [
                  "Z definicji: $\\log_x 81=4\\Leftrightarrow x^4=81$.",
                  "$81=3^4$, więc $x^4=3^4$. Przy $x>0$ dostajemy $x=3$.",
                  "Warunek $x\\neq 1$ jest spełniony.",
                ],
                cleanSolution: [
                  "$x^4=81$",
                  "$x^4=3^4$",
                  "$x=3$",
                ],
              },
              {
                type: "exercise",
                number: "5.68",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Dla $x>0$ i $x\\neq 1$ zachodzi $\\log_x\\dfrac{1}{27}=-3$. Wtedy $x$ jest równy",
                options: [
                  { key: "A", text: "$\\dfrac{1}{3}$" },
                  { key: "B", text: "$3$" },
                  { key: "C", text: "$9$" },
                  { key: "D", text: "$27$" },
                ],
                hints: [
                  "Z definicji: $x^{-3}=\\dfrac{1}{27}$.",
                  "Zapisz to jako $\\dfrac{1}{x^3}=\\dfrac{1}{27}$ i rozwiąż przy $x>0$.",
                ],
                answer: "B. $3$",
                explanation: [
                  "Z definicji: $\\log_x\\dfrac{1}{27}=-3\\Leftrightarrow x^{-3}=\\dfrac{1}{27}$.",
                  "$\\dfrac{1}{x^3}=\\dfrac{1}{27}$, więc $x^3=27$ i $x=3$ (bo $x>0$).",
                  "Warunek $x\\neq 1$ jest spełniony. Dla $x=\\dfrac{1}{3}$ byłoby $\\left(\\dfrac{1}{3}\\right)^{-3}=27\\neq\\dfrac{1}{27}$.",
                ],
                cleanSolution: [
                  "$x^{-3}=\\dfrac{1}{27}$",
                  "$x^3=27$",
                  "$x=3$",
                ],
              },
            ],
          },
          {
            type: "exercise-group",
            title: "Wzory (3) i (6) - iloczyn i iloraz",
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
              {
                type: "exercise",
                number: "5.45",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Liczba $\\log_2 48-\\log_2 3$ jest równa",
                options: [
                  { key: "A", text: "$3$" },
                  { key: "B", text: "$4$" },
                  { key: "C", text: "$8$" },
                  { key: "D", text: "$16$" },
                ],
                hints: [
                  "Zastosuj wzór (6): różnica to logarytm ilorazu.",
                  "Uprość $\\dfrac{48}{3}$ i oblicz $\\log_2$ z wyniku.",
                ],
                answer: "B. $4$",
                explanation: [
                  "$\\log_2 48-\\log_2 3=\\log_2\\dfrac{48}{3}=\\log_2 16$.",
                  "$16=2^4$, więc $\\log_2 16=4$.",
                ],
                cleanSolution: [
                  "$\\log_2 48-\\log_2 3=\\log_2\\dfrac{48}{3}$",
                  "$=\\log_2 16$",
                  "$=4$",
                ],
              },
              {
                type: "exercise",
                number: "5.46",
                level: "rozszerzony",
                contentLevel: "rozszerzenie",
                prompt: "Liczba $\\log_2 9\\cdot\\log_3 2$ jest równa",
                options: [
                  { key: "A", text: "$1$" },
                  { key: "B", text: "$2$" },
                  { key: "C", text: "$3$" },
                  { key: "D", text: "$4$" },
                ],
                hints: [
                  "Zapisz $\\log_2 9=2\\log_2 3$.",
                  "Skorzystaj z $\\log_2 3\\cdot\\log_3 2=1$.",
                ],
                answer: "B. $2$",
                explanation: [
                  "$\\log_2 9=\\log_2(3^2)=2\\log_2 3$.",
                  "$\\log_2 9\\cdot\\log_3 2=2\\log_2 3\\cdot\\log_3 2=2\\cdot 1=2$, bo $\\log_a b\\cdot\\log_b a=1$.",
                ],
                cleanSolution: [
                  "$\\log_2 9\\cdot\\log_3 2=2\\log_2 3\\cdot\\log_3 2$",
                  "$=2$",
                ],
              },
              {
                type: "exercise",
                number: "5.47",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Liczba $\\log_5 500-2\\log_5 2$ jest równa",
                options: [
                  { key: "A", text: "$2$" },
                  { key: "B", text: "$3$" },
                  { key: "C", text: "$5$" },
                  { key: "D", text: "$25$" },
                ],
                hints: [
                  "Najpierw wrzuć współczynnik $2$ do wykładnika wzorem (4).",
                  "Potem zastosuj wzór (6) i uprość iloraz.",
                ],
                answer: "B. $3$",
                explanation: [
                  "$2\\log_5 2=\\log_5 2^2=\\log_5 4$.",
                  "$\\log_5 500-\\log_5 4=\\log_5\\dfrac{500}{4}=\\log_5 125$.",
                  "$125=5^3$, więc $\\log_5 125=3$.",
                ],
                cleanSolution: [
                  "$\\log_5 500-2\\log_5 2=\\log_5 500-\\log_5 4$",
                  "$=\\log_5 125$",
                  "$=3$",
                ],
              },
              {
                type: "exercise",
                number: "5.48",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Dla każdej dodatniej liczby rzeczywistej $x$ i każdej dodatniej liczby rzeczywistej $y$ wartość wyrażenia $2\\log_3 x-\\log_3 y$ jest równa",
                options: [
                  { key: "A", text: "$\\log_3\\left(\\dfrac{x^2}{y}\\right)$" },
                  { key: "B", text: "$\\log_3\\left(\\dfrac{2x}{y}\\right)$" },
                  { key: "C", text: "$\\log_3(x^2-y)$" },
                  { key: "D", text: "$\\log_3\\left(\\dfrac{x}{y^2}\\right)$" },
                ],
                hints: [
                  "Najpierw zastosuj wzór (4): $2\\log_3 x=\\log_3 x^2$.",
                  "Potem wzór (6): różnica to logarytm ilorazu.",
                ],
                answer: "A. $\\log_3\\left(\\dfrac{x^2}{y}\\right)$",
                explanation: [
                  "$2\\log_3 x=\\log_3 x^2$.",
                  "$\\log_3 x^2-\\log_3 y=\\log_3\\dfrac{x^2}{y}$.",
                ],
                cleanSolution: [
                  "$2\\log_3 x-\\log_3 y=\\log_3 x^2-\\log_3 y$",
                  "$=\\log_3\\dfrac{x^2}{y}$",
                ],
              },
              {
                type: "exercise",
                number: "5.49",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Oceń prawdziwość stwierdzeń: (I) $\\log_2 3+\\log_2 6=\\log_2 18$ oraz (II) $\\log_2 6-\\log_2 3=\\log_2 3$.",
                options: [
                  { key: "A", text: "I — P, II — P" },
                  { key: "B", text: "I — P, II — F" },
                  { key: "C", text: "I — F, II — P" },
                  { key: "D", text: "I — F, II — F" },
                ],
                hints: [
                  "I: sprawdź wzór (3) — suma daje logarytm iloczynu.",
                  "II: sprawdź wzór (6) — różnica daje $\\log_2\\dfrac{6}{3}=\\log_2 2$.",
                ],
                answer: "B. I — P, II — F",
                explanation: [
                  "I: $\\log_2 3+\\log_2 6=\\log_2(3\\cdot 6)=\\log_2 18$ — prawda.",
                  "II: $\\log_2 6-\\log_2 3=\\log_2\\dfrac{6}{3}=\\log_2 2=1$, a nie $\\log_2 3$ — fałsz.",
                ],
                cleanSolution: [
                  "I: $\\log_2 3+\\log_2 6=\\log_2 18$ — P",
                  "II: $\\log_2 6-\\log_2 3=\\log_2 2\\neq\\log_2 3$ — F",
                ],
              },
              {
                type: "exercise",
                number: "5.50",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Oceń prawdziwość stwierdzeń: (I) $3\\log_5 2=\\log_5 8$ oraz (II) $3+\\log_5 2=\\log_5 6$.",
                options: [
                  { key: "A", text: "I — P, II — P" },
                  { key: "B", text: "I — P, II — F" },
                  { key: "C", text: "I — F, II — P" },
                  { key: "D", text: "I — F, II — F" },
                ],
                hints: [
                  "I: zastosuj wzór (4) — współczynnik wchodzi do wykładnika.",
                  "II: uwaga na pułapkę — sumy liczby i logarytmu nie zamieniasz na logarytm iloczynu wprost.",
                ],
                answer: "B. I — P, II — F",
                explanation: [
                  "I: $3\\log_5 2=\\log_5 2^3=\\log_5 8$ — prawda.",
                  "II: $3+\\log_5 2=\\log_5 5^3+\\log_5 2=\\log_5(125\\cdot 2)=\\log_5 250\\neq\\log_5 6$ — fałsz.",
                ],
                cleanSolution: [
                  "I: $3\\log_5 2=\\log_5 8$ — P",
                  "II: $3+\\log_5 2=\\log_5 250\\neq\\log_5 6$ — F",
                ],
              },
              {
                type: "exercise",
                number: "5.51",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Liczba $2\\log_3 6+\\log_3 3-\\log_3 4$ jest równa",
                options: [
                  { key: "A", text: "$2$" },
                  { key: "B", text: "$3$" },
                  { key: "C", text: "$4$" },
                  { key: "D", text: "$9$" },
                ],
                hints: [
                  "Z (4): $2\\log_3 6=\\log_3 36$.",
                  "Połącz sumę i różnicę wzorami (3) i (6) w jeden logarytm.",
                ],
                answer: "B. $3$",
                explanation: [
                  "$2\\log_3 6=\\log_3 36$.",
                  "$\\log_3 36+\\log_3 3-\\log_3 4=\\log_3\\dfrac{36\\cdot 3}{4}=\\log_3 27$.",
                  "$27=3^3$, więc $\\log_3 27=3$.",
                ],
                cleanSolution: [
                  "$2\\log_3 6+\\log_3 3-\\log_3 4=\\log_3\\dfrac{36\\cdot 3}{4}$",
                  "$=\\log_3 27$",
                  "$=3$",
                ],
              },
              {
                type: "exercise",
                number: "5.52",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Dla $x>0$ oraz $y>0$ wyrażenie $\\log_2(x^3 y^2)$ jest równe",
                options: [
                  { key: "A", text: "$3\\log_2 x+2\\log_2 y$" },
                  { key: "B", text: "$3\\log_2 x\\cdot 2\\log_2 y$" },
                  { key: "C", text: "$\\log_2(3x)+\\log_2(2y)$" },
                  { key: "D", text: "$6(\\log_2 x+\\log_2 y)$" },
                ],
                hints: [
                  "Zastosuj wzór (3) do iloczynu $x^3\\cdot y^2$.",
                  "Potem wyciągnij wykładniki wzorem (4).",
                ],
                answer: "A. $3\\log_2 x+2\\log_2 y$",
                explanation: [
                  "$\\log_2(x^3 y^2)=\\log_2 x^3+\\log_2 y^2$.",
                  "$=3\\log_2 x+2\\log_2 y$.",
                ],
                cleanSolution: [
                  "$\\log_2(x^3 y^2)=\\log_2 x^3+\\log_2 y^2$",
                  "$=3\\log_2 x+2\\log_2 y$",
                ],
              },
              {
                type: "exercise",
                number: "5.53",
                level: "rozszerzony",
                contentLevel: "rozszerzenie",
                prompt: "Liczba $\\log_5 2\\cdot\\log_2 125$ jest równa",
                options: [
                  { key: "A", text: "$1$" },
                  { key: "B", text: "$2$" },
                  { key: "C", text: "$3$" },
                  { key: "D", text: "$5$" },
                ],
                hints: [
                  "Zapisz $125=5^3$, więc $\\log_2 125=3\\log_2 5$.",
                  "Skorzystaj z $\\log_5 2\\cdot\\log_2 5=1$.",
                ],
                answer: "C. $3$",
                explanation: [
                  "$\\log_2 125=\\log_2(5^3)=3\\log_2 5$.",
                  "$\\log_5 2\\cdot\\log_2 125=3\\log_5 2\\cdot\\log_2 5=3\\cdot 1=3$.",
                ],
                cleanSolution: [
                  "$\\log_5 2\\cdot\\log_2 125=3\\log_5 2\\cdot\\log_2 5$",
                  "$=3$",
                ],
              },
              {
                type: "exercise",
                number: "5.54",
                level: "rozszerzony",
                contentLevel: "rozszerzenie",
                prompt: "Liczba $\\dfrac{\\log_2 7}{\\log_2 49}$ jest równa",
                options: [
                  { key: "A", text: "$\\dfrac{1}{2}$" },
                  { key: "B", text: "$2$" },
                  { key: "C", text: "$7$" },
                  { key: "D", text: "$14$" },
                ],
                hints: [
                  "Zapisz $49=7^2$.",
                  "Wyciągnij wykładnik w mianowniku albo użyj wzoru na zmianę podstawy.",
                ],
                answer: "A. $\\dfrac{1}{2}$",
                explanation: [
                  "$\\log_2 49=\\log_2(7^2)=2\\log_2 7$.",
                  "$\\dfrac{\\log_2 7}{\\log_2 49}=\\dfrac{\\log_2 7}{2\\log_2 7}=\\dfrac{1}{2}$.",
                ],
                cleanSolution: [
                  "$\\dfrac{\\log_2 7}{\\log_2 49}=\\dfrac{\\log_2 7}{2\\log_2 7}$",
                  "$=\\dfrac{1}{2}$",
                ],
              },
              {
                type: "exercise",
                number: "5.55",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Liczba $\\log_2 5+\\log_2 20-\\log_2 25$ jest równa",
                options: [
                  { key: "A", text: "$1$" },
                  { key: "B", text: "$2$" },
                  { key: "C", text: "$4$" },
                  { key: "D", text: "$5$" },
                ],
                hints: [
                  "Połącz wszystko w jeden logarytm wzorami (3) i (6).",
                  "Uprość $\\dfrac{5\\cdot 20}{25}$.",
                ],
                answer: "B. $2$",
                explanation: [
                  "$\\log_2 5+\\log_2 20-\\log_2 25=\\log_2\\dfrac{5\\cdot 20}{25}=\\log_2 4$.",
                  "$4=2^2$, więc $\\log_2 4=2$.",
                ],
                cleanSolution: [
                  "$\\log_2 5+\\log_2 20-\\log_2 25=\\log_2\\dfrac{5\\cdot 20}{25}$",
                  "$=\\log_2 4$",
                  "$=2$",
                ],
              },
              {
                type: "exercise",
                number: "5.56",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Dla każdej dodatniej liczby rzeczywistej $x$ oraz każdej dodatniej liczby rzeczywistej $y$ wartość wyrażenia $\\log_4 x+3\\log_4 y-\\log_4 2$ jest równa wartości wyrażenia",
                options: [
                  { key: "A", text: "$\\log_4\\left(\\dfrac{x y^3}{2}\\right)$" },
                  { key: "B", text: "$\\log_4\\left(\\dfrac{x^3 y}{2}\\right)$" },
                  { key: "C", text: "$\\log_4(3xy-2)$" },
                  { key: "D", text: "$\\log_4\\left(\\dfrac{xy}{8}\\right)$" },
                ],
                hints: [
                  "Z (4): $3\\log_4 y=\\log_4 y^3$.",
                  "Połącz sumę i różnicę w jeden logarytm.",
                ],
                answer: "A. $\\log_4\\left(\\dfrac{x y^3}{2}\\right)$",
                explanation: [
                  "$3\\log_4 y=\\log_4 y^3$.",
                  "$\\log_4 x+\\log_4 y^3-\\log_4 2=\\log_4\\dfrac{x y^3}{2}$.",
                ],
                cleanSolution: [
                  "$\\log_4 x+3\\log_4 y-\\log_4 2=\\log_4 x+\\log_4 y^3-\\log_4 2$",
                  "$=\\log_4\\dfrac{x y^3}{2}$",
                ],
              },
              {
                type: "exercise",
                number: "5.57",
                level: "rozszerzony",
                contentLevel: "rozszerzenie",
                prompt:
                  "Oceń prawdziwość stwierdzeń: (I) $\\log_3 4\\cdot\\log_4 9=2$ oraz (II) $\\dfrac{\\log_2 5}{\\log_2 25}=\\dfrac{1}{2}$.",
                options: [
                  { key: "A", text: "I — P, II — P" },
                  { key: "B", text: "I — P, II — F" },
                  { key: "C", text: "I — F, II — P" },
                  { key: "D", text: "I — F, II — F" },
                ],
                hints: [
                  "I: skorzystaj z łańcucha $\\log_a b\\cdot\\log_b c=\\log_a c$.",
                  "II: zapisz $25=5^2$ w mianowniku.",
                ],
                answer: "A. I — P, II — P",
                explanation: [
                  "I: $\\log_3 4\\cdot\\log_4 9=\\log_3 9=2$ — prawda.",
                  "II: $\\dfrac{\\log_2 5}{\\log_2 25}=\\dfrac{\\log_2 5}{2\\log_2 5}=\\dfrac{1}{2}$ — prawda.",
                ],
                cleanSolution: [
                  "I: $\\log_3 4\\cdot\\log_4 9=\\log_3 9=2$ — P",
                  "II: $\\dfrac{\\log_2 5}{\\log_2 25}=\\dfrac{1}{2}$ — P",
                ],
              },
              {
                type: "exercise",
                number: "5.58",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Liczba $\\dfrac{\\log_3 20-\\log_3 5}{\\log_3 8-\\log_3 2}$ jest równa",
                options: [
                  { key: "A", text: "$\\dfrac{1}{2}$" },
                  { key: "B", text: "$1$" },
                  { key: "C", text: "$2$" },
                  { key: "D", text: "$4$" },
                ],
                hints: [
                  "W liczniku i mianowniku zastosuj wzór (6).",
                  "Uprość oba ilorazy, a potem podziel wyniki.",
                ],
                answer: "B. $1$",
                explanation: [
                  "$\\log_3 20-\\log_3 5=\\log_3\\dfrac{20}{5}=\\log_3 4$.",
                  "$\\log_3 8-\\log_3 2=\\log_3\\dfrac{8}{2}=\\log_3 4$.",
                  "$\\dfrac{\\log_3 4}{\\log_3 4}=1$.",
                ],
                cleanSolution: [
                  "$\\dfrac{\\log_3 20-\\log_3 5}{\\log_3 8-\\log_3 2}=\\dfrac{\\log_3 4}{\\log_3 4}$",
                  "$=1$",
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
                number: "5.82",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Zapisz w postaci jednego logarytmu: $3\\log_2 5$.",
                hint: "Współczynnik przed logarytmem wchodzi do wykładnika: $r\\log_a b=\\log_a b^r$.",
                answer: "$\\log_2 125$",
                explanation: [
                  "Z wzoru (4): $3\\log_2 5=\\log_2 5^3$.",
                  "$5^3=125$, więc $3\\log_2 5=\\log_2 125$.",
                ],
                cleanSolution: [
                  "$3\\log_2 5=\\log_2 5^3$",
                  "$=\\log_2 125$",
                ],
              },
              {
                type: "exercise",
                number: "5.83",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Zapisz w postaci logarytmu o podstawie $25$: $\\dfrac{1}{2}\\log_5 7$.",
                hint: "Z wzoru (5): $\\dfrac{1}{r}\\log_a b=\\log_{a^r} b$. Tu $a=5$ i $r=2$.",
                answer: "$\\log_{25} 7$",
                explanation: [
                  "Z wzoru (5): $\\dfrac{1}{2}\\log_5 7=\\log_{5^2} 7$.",
                  "$5^2=25$, więc $\\dfrac{1}{2}\\log_5 7=\\log_{25} 7$.",
                ],
                cleanSolution: [
                  "$\\dfrac{1}{2}\\log_5 7=\\log_{5^2} 7$",
                  "$=\\log_{25} 7$",
                ],
              },
              {
                type: "exercise",
                number: "5.84",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Uzupełnij równość: $4\\log_3 2=\\log_3\\boxed{\\phantom{000}}$.",
                hint: "Przenieś współczynnik $4$ do wykładnika argumentu.",
                answer: "$16$",
                explanation: [
                  "Z wzoru (4): $4\\log_3 2=\\log_3 2^4$.",
                  "$2^4=16$, więc w ramce jest $16$.",
                ],
                cleanSolution: [
                  "$4\\log_3 2=\\log_3 2^4$",
                  "$=\\log_3 16$",
                ],
              },
              {
                type: "exercise",
                number: "5.85",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Uzupełnij podstawę logarytmu: $\\dfrac{1}{3}\\log_2 11=\\log_{\\boxed{\\phantom{00}}} 11$.",
                hint: "Z wzoru (5): $\\dfrac{1}{r}\\log_a b=\\log_{a^r} b$. Tu $r=3$ i $a=2$.",
                answer: "$8$",
                explanation: [
                  "Z wzoru (5): $\\dfrac{1}{3}\\log_2 11=\\log_{2^3} 11$.",
                  "$2^3=8$, więc w ramce jest $8$.",
                ],
                cleanSolution: [
                  "$\\dfrac{1}{3}\\log_2 11=\\log_{2^3} 11$",
                  "$=\\log_8 11$",
                ],
              },
              {
                type: "exercise",
                number: "5.86",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Dane są funkcje $f(x)=\\log_2 x$ oraz $g(x)=\\dfrac{1}{3}\\log_2 x$. Jeżeli $g(64)=f(a)$, to liczba $a$ jest równa",
                options: [
                  { key: "A", text: "$2$" },
                  { key: "B", text: "$4$" },
                  { key: "C", text: "$8$" },
                  { key: "D", text: "$16$" },
                ],
                hints: [
                  "Oblicz $g(64)=\\dfrac{1}{3}\\log_2 64$.",
                  "Rozwiąż $f(a)=\\log_2 a$ równe tej wartości.",
                ],
                answer: "B. $4$",
                explanation: [
                  "$\\log_2 64=6$, więc $g(64)=\\dfrac{1}{3}\\cdot 6=2$.",
                  "$f(a)=\\log_2 a=2$, stąd $a=2^2=4$.",
                ],
                cleanSolution: [
                  "$g(64)=\\dfrac{1}{3}\\cdot 6=2$",
                  "$\\log_2 a=2$",
                  "$a=4$",
                ],
              },
              {
                type: "exercise",
                number: "5.87",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Wiadomo, że $\\log_3 x=4$. Wartość wyrażenia $\\log_3 x^3$ jest równa",
                options: [
                  { key: "A", text: "$4$" },
                  { key: "B", text: "$7$" },
                  { key: "C", text: "$12$" },
                  { key: "D", text: "$64$" },
                ],
                hint: "Zastosuj wzór (4): $\\log_3 x^3=3\\log_3 x$.",
                answer: "C. $12$",
                explanation: [
                  "Z wzoru (4): $\\log_3 x^3=3\\log_3 x$.",
                  "$\\log_3 x=4$, więc $3\\cdot 4=12$.",
                ],
                cleanSolution: [
                  "$\\log_3 x^3=3\\log_3 x$",
                  "$=3\\cdot 4$",
                  "$=12$",
                ],
              },
              {
                type: "exercise",
                number: "5.88",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Dla $x>0$ wyrażenie $3\\log_5 x$ można zapisać jako",
                options: [
                  { key: "A", text: "$\\log_{125} x$" },
                  { key: "B", text: "$\\log_5(3x)$" },
                  { key: "C", text: "$\\log_5 x^3$" },
                  { key: "D", text: "$\\log_{15} x$" },
                ],
                hint: "Współczynnik $3$ wchodzi do wykładnika argumentu, nie do podstawy.",
                answer: "C. $\\log_5 x^3$",
                explanation: [
                  "Z wzoru (4): $3\\log_5 x=\\log_5 x^3$.",
                  "Opcja A to raczej $\\dfrac{1}{3}\\log_5 x=\\log_{125} x$ (wzór (5)), więc nie pasuje.",
                ],
                cleanSolution: [
                  "$3\\log_5 x=\\log_5 x^3$",
                ],
              },
              {
                type: "exercise",
                number: "5.89",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Dla $x>0$ wyrażenie $\\dfrac{1}{4}\\log_3 x$ jest równe",
                options: [
                  { key: "A", text: "$\\log_{12} x$" },
                  { key: "B", text: "$\\log_{81} x$" },
                  { key: "C", text: "$\\log_3\\dfrac{x}{4}$" },
                  { key: "D", text: "$\\log_3 x^4$" },
                ],
                hint: "Z wzoru (5): $\\dfrac{1}{r}\\log_a b=\\log_{a^r} b$. Tu $r=4$ i $a=3$.",
                answer: "B. $\\log_{81} x$",
                explanation: [
                  "Z wzoru (5): $\\dfrac{1}{4}\\log_3 x=\\log_{3^4} x$.",
                  "$3^4=81$, więc $\\dfrac{1}{4}\\log_3 x=\\log_{81} x$.",
                ],
                cleanSolution: [
                  "$\\dfrac{1}{4}\\log_3 x=\\log_{3^4} x$",
                  "$=\\log_{81} x$",
                ],
              },
              {
                type: "exercise",
                number: "5.90",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Oceń prawdziwość stwierdzeń: (I) $2\\log_7 3=\\log_7 9$ oraz (II) $\\dfrac{1}{2}\\log_4 5=\\log_8 5$.",
                options: [
                  { key: "A", text: "I — P, II — P" },
                  { key: "B", text: "I — P, II — F" },
                  { key: "C", text: "I — F, II — P" },
                  { key: "D", text: "I — F, II — F" },
                ],
                hints: [
                  "I: sprawdź wzór (4) — współczynnik wchodzi do wykładnika.",
                  "II: z wzoru (5) byłoby $\\dfrac{1}{2}\\log_4 5=\\log_{16} 5$, nie $\\log_8 5$.",
                ],
                answer: "B. I — P, II — F",
                explanation: [
                  "I: $2\\log_7 3=\\log_7 3^2=\\log_7 9$ — prawda.",
                  "II: $\\dfrac{1}{2}\\log_4 5=\\log_{4^2} 5=\\log_{16} 5\\neq\\log_8 5$ — fałsz.",
                ],
                cleanSolution: [
                  "I: $2\\log_7 3=\\log_7 9$ — P",
                  "II: $\\dfrac{1}{2}\\log_4 5=\\log_{16} 5\\neq\\log_8 5$ — F",
                ],
              },
              {
                type: "exercise",
                number: "5.91",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Wyznacz $x>0$, jeżeli $2\\log_3 x=\\log_3 81$.",
                options: [
                  { key: "A", text: "$x=3$" },
                  { key: "B", text: "$x=9$" },
                  { key: "C", text: "$x=27$" },
                  { key: "D", text: "$x=81$" },
                ],
                hints: [
                  "Zapisz lewą stronę jako $\\log_3 x^2$.",
                  "Porównaj argumenty logarytmów o tej samej podstawie.",
                ],
                answer: "B. $x=9$",
                explanation: [
                  "Z wzoru (4): $2\\log_3 x=\\log_3 x^2$.",
                  "$\\log_3 x^2=\\log_3 81$, więc $x^2=81$.",
                  "Przy $x>0$ dostajemy $x=9$.",
                ],
                cleanSolution: [
                  "$\\log_3 x^2=\\log_3 81$",
                  "$x^2=81$",
                  "$x=9$",
                ],
              },
              {
                type: "exercise",
                number: "5.92",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Dla $x>0$ zachodzi równość $\\log_4 x+\\log_{16} x=6$. Wartość $x$ jest równa",
                options: [
                  { key: "A", text: "$64$" },
                  { key: "B", text: "$128$" },
                  { key: "C", text: "$256$" },
                  { key: "D", text: "$512$" },
                ],
                hints: [
                  "Zapisz $16=4^2$ i użyj wzoru (5): $\\log_{16} x=\\dfrac{1}{2}\\log_4 x$.",
                  "Rozwiąż równanie na $\\log_4 x$, potem znajdź $x$.",
                ],
                answer: "C. $256$",
                explanation: [
                  "Z wzoru (5): $\\log_{16} x=\\log_{4^2} x=\\dfrac{1}{2}\\log_4 x$.",
                  "$\\log_4 x+\\dfrac{1}{2}\\log_4 x=\\dfrac{3}{2}\\log_4 x=6$, więc $\\log_4 x=4$.",
                  "$x=4^4=256$.",
                ],
                cleanSolution: [
                  "$\\log_{16} x=\\dfrac{1}{2}\\log_4 x$",
                  "$\\dfrac{3}{2}\\log_4 x=6$",
                  "$\\log_4 x=4$",
                  "$x=256$",
                ],
              },
              {
                type: "exercise",
                number: "5.93",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Dla $x>0$ zachodzi równość $\\log_3 x^2=\\log_{27}(9x)$. Wartość $x$ jest równa",
                options: [
                  { key: "A", text: "$\\sqrt[5]{3}$" },
                  { key: "B", text: "$\\sqrt[5]{9}$" },
                  { key: "C", text: "$\\sqrt[3]{9}$" },
                  { key: "D", text: "$3$" },
                ],
                hints: [
                  "Lewa strona: $\\log_3 x^2=2\\log_3 x$.",
                  "Prawa strona: zapisz $27=3^3$ i użyj wzoru (5).",
                ],
                answer: "B. $\\sqrt[5]{9}$",
                explanation: [
                  "Lewa: $\\log_3 x^2=2\\log_3 x$.",
                  "Prawa: $\\log_{27}(9x)=\\log_{3^3}(9x)=\\dfrac{1}{3}\\log_3(9x)=\\dfrac{1}{3}(2+\\log_3 x)$.",
                  "Niech $t=\\log_3 x$. Wtedy $2t=\\dfrac{2+t}{3}$, czyli $6t=2+t$, stąd $5t=2$ i $t=\\dfrac{2}{5}$.",
                  "$x=3^{\\frac{2}{5}}=\\sqrt[5]{9}$.",
                ],
                cleanSolution: [
                  "$2\\log_3 x=\\dfrac{1}{3}(2+\\log_3 x)$",
                  "$\\log_3 x=\\dfrac{2}{5}$",
                  "$x=3^{\\frac{2}{5}}=\\sqrt[5]{9}$",
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
                number: "5.69",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $3^{\\log_3 7}$.",
                options: [
                  { key: "A", text: "$3$" },
                  { key: "B", text: "$7$" },
                  { key: "C", text: "$21$" },
                  { key: "D", text: "$49$" },
                ],
                hint: "Zastosuj tożsamość $a^{\\log_a b}=b$.",
                answer: "B. $7$",
                explanation: [
                  "Z tożsamości (2) dla $a=3$ i $b=7$ dostajemy $3^{\\log_3 7}=7$.",
                ],
                cleanSolution: [
                  "$3^{\\log_3 7}=7$",
                ],
              },
              {
                type: "exercise",
                number: "5.70",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $5^{\\log_5 12}$.",
                options: [
                  { key: "A", text: "$5$" },
                  { key: "B", text: "$12$" },
                  { key: "C", text: "$25$" },
                  { key: "D", text: "$60$" },
                ],
                hint: "Zastosuj tożsamość $a^{\\log_a b}=b$.",
                answer: "B. $12$",
                explanation: [
                  "Z tożsamości (2) dla $a=5$ i $b=12$ dostajemy $5^{\\log_5 12}=12$.",
                ],
                cleanSolution: [
                  "$5^{\\log_5 12}=12$",
                ],
              },
              {
                type: "exercise",
                number: "5.71",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $4^{\\log_2 3}$.",
                options: [
                  { key: "A", text: "$3$" },
                  { key: "B", text: "$6$" },
                  { key: "C", text: "$9$" },
                  { key: "D", text: "$12$" },
                ],
                hints: [
                  "Zapisz $4=2^2$.",
                  "Przekształć $4^{\\log_2 3}=(2^2)^{\\log_2 3}=2^{2\\log_2 3}$ i skorzystaj z (2).",
                ],
                answer: "C. $9$",
                explanation: [
                  "$4=2^2$, więc $4^{\\log_2 3}=(2^2)^{\\log_2 3}=2^{2\\log_2 3}$.",
                  "$2^{2\\log_2 3}=(2^{\\log_2 3})^2$.",
                  "Z (2) mamy $2^{\\log_2 3}=3$, stąd $(2^{\\log_2 3})^2=3^2=9$.",
                ],
                cleanSolution: [
                  "$4^{\\log_2 3}=(2^2)^{\\log_2 3}$",
                  "$=2^{2\\log_2 3}$",
                  "$=(2^{\\log_2 3})^2$",
                  "$=3^2$",
                  "$=9$",
                ],
              },
              {
                type: "exercise",
                number: "5.72",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\left(\\dfrac{1}{3}\\right)^{\\log_3 5}$.",
                options: [
                  { key: "A", text: "$-5$" },
                  { key: "B", text: "$\\dfrac{1}{5}$" },
                  { key: "C", text: "$\\dfrac{1}{3}$" },
                  { key: "D", text: "$5$" },
                ],
                hints: [
                  "Zapisz $\\dfrac{1}{3}=3^{-1}$.",
                  "Przekształć do postaci $(3^{\\log_3 5})^{-1}$ i użyj (2).",
                ],
                answer: "B. $\\dfrac{1}{5}$",
                explanation: [
                  "$\\dfrac{1}{3}=3^{-1}$, więc $\\left(\\dfrac{1}{3}\\right)^{\\log_3 5}=(3^{-1})^{\\log_3 5}=3^{-\\log_3 5}$.",
                  "$3^{-\\log_3 5}=(3^{\\log_3 5})^{-1}$.",
                  "Z (2) mamy $3^{\\log_3 5}=5$, więc wynik to $5^{-1}=\\dfrac{1}{5}$.",
                ],
                cleanSolution: [
                  "$\\left(\\dfrac{1}{3}\\right)^{\\log_3 5}=(3^{-1})^{\\log_3 5}$",
                  "$=3^{-\\log_3 5}$",
                  "$=(3^{\\log_3 5})^{-1}$",
                  "$=5^{-1}$",
                  "$=\\dfrac{1}{5}$",
                ],
              },
              {
                type: "exercise",
                number: "5.73",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Oblicz $\\sqrt{2^{\\log_2 49}}$.",
                options: [
                  { key: "A", text: "$7$" },
                  { key: "B", text: "$14$" },
                  { key: "C", text: "$49$" },
                  { key: "D", text: "$98$" },
                ],
                hints: [
                  "Najpierw uprość $2^{\\log_2 49}$ wzorem (2).",
                  "Potem wyciągnij pierwiastek kwadratowy.",
                ],
                answer: "A. $7$",
                explanation: [
                  "Z (2) mamy $2^{\\log_2 49}=49$.",
                  "$\\sqrt{2^{\\log_2 49}}=\\sqrt{49}=7$.",
                ],
                cleanSolution: [
                  "$\\sqrt{2^{\\log_2 49}}=\\sqrt{49}$",
                  "$=7$",
                ],
              },
              {
                type: "exercise",
                number: "5.74",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Dane są funkcje $f(x)=3^{\\log_3(x+1)}$ oraz $g(x)=2x+1$. Punkt przecięcia wykresów tych funkcji ma współrzędne",
                options: [
                  { key: "A", text: "$(0,1)$" },
                  { key: "B", text: "$(1,3)$" },
                  { key: "C", text: "$(2,5)$" },
                  { key: "D", text: "wykresy nie mają punktu wspólnego" },
                ],
                hints: [
                  "Uprość $f(x)$ wzorem (2): $f(x)=x+1$ (dla $x+1>0$).",
                  "Rozwiąż $x+1=2x+1$.",
                ],
                answer: "A. $(0,1)$",
                explanation: [
                  "Z (2): $f(x)=3^{\\log_3(x+1)}=x+1$ przy $x+1>0$.",
                  "Punkt przecięcia: $x+1=2x+1$, stąd $x=0$.",
                  "Wtedy $g(0)=1$, więc punkt to $(0,1)$. Dziedzina $f$: $x>-1$, więc $x=0$ jest dopuszczalne.",
                ],
                cleanSolution: [
                  "$f(x)=x+1$",
                  "$x+1=2x+1$",
                  "$x=0$",
                  "$(0,1)$",
                ],
              },
              {
                type: "exercise",
                number: "5.75",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Dane są funkcje $f(x)=4^{\\log_2 x}$ oraz $g(x)=16$. Dla jakiej wartości $x$ wykresy funkcji $f$ i $g$ przecinają się?",
                options: [
                  { key: "A", text: "$x=2$" },
                  { key: "B", text: "$x=4$" },
                  { key: "C", text: "$x=8$" },
                  { key: "D", text: "$x=16$" },
                ],
                hints: [
                  "Zapisz $4=2^2$ i uprość $f(x)$ do $x^2$.",
                  "Rozwiąż $x^2=16$ w dziedzinie $x>0$.",
                ],
                answer: "B. $x=4$",
                explanation: [
                  "$4=2^2$, więc $f(x)=4^{\\log_2 x}=(2^2)^{\\log_2 x}=2^{2\\log_2 x}=(2^{\\log_2 x})^2=x^2$.",
                  "Przecięcie z $g(x)=16$: $x^2=16$. Przy $x>0$ (dziedzina logarytmu) dostajemy $x=4$.",
                ],
                cleanSolution: [
                  "$4^{\\log_2 x}=x^2$",
                  "$x^2=16$",
                  "$x=4$",
                ],
              },
              {
                type: "exercise",
                number: "5.76",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Dla $x>2$ uprość wyrażenie $\\left(\\dfrac{1}{4}\\right)^{\\log_2(x-2)}$.",
                options: [
                  { key: "A", text: "$\\dfrac{1}{x-2}$" },
                  { key: "B", text: "$\\dfrac{1}{(x-2)^2}$" },
                  { key: "C", text: "$(x-2)^2$" },
                  { key: "D", text: "$\\dfrac{1}{2(x-2)}$" },
                ],
                hints: [
                  "Zapisz $\\dfrac{1}{4}=2^{-2}$.",
                  "Sprowadź wyrażenie do $(2^{\\log_2(x-2)})^{-2}$ i użyj (2).",
                ],
                answer: "B. $\\dfrac{1}{(x-2)^2}$",
                explanation: [
                  "$\\dfrac{1}{4}=2^{-2}$, więc $\\left(\\dfrac{1}{4}\\right)^{\\log_2(x-2)}=(2^{-2})^{\\log_2(x-2)}=2^{-2\\log_2(x-2)}$.",
                  "$2^{-2\\log_2(x-2)}=(2^{\\log_2(x-2)})^{-2}$.",
                  "Z (2): $2^{\\log_2(x-2)}=x-2$, więc wynik to $(x-2)^{-2}=\\dfrac{1}{(x-2)^2}$.",
                ],
                cleanSolution: [
                  "$\\left(\\dfrac{1}{4}\\right)^{\\log_2(x-2)}=(2^{-2})^{\\log_2(x-2)}$",
                  "$=2^{-2\\log_2(x-2)}$",
                  "$=(x-2)^{-2}$",
                  "$=\\dfrac{1}{(x-2)^2}$",
                ],
              },
              {
                type: "exercise",
                number: "5.77",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Rozwiąż równanie $4^{\\log_2(x+1)}=81$.",
                options: [
                  { key: "A", text: "$x=8$" },
                  { key: "B", text: "$x=9$" },
                  { key: "C", text: "$x=80$" },
                  { key: "D", text: "$x=40$" },
                ],
                hints: [
                  "Uprość lewą stronę: $4^{\\log_2(x+1)}=(x+1)^2$.",
                  "Rozwiąż $(x+1)^2=81$ przy $x+1>0$.",
                ],
                answer: "A. $x=8$",
                explanation: [
                  "$4=2^2$, więc $4^{\\log_2(x+1)}=(2^2)^{\\log_2(x+1)}=2^{2\\log_2(x+1)}=(x+1)^2$.",
                  "$(x+1)^2=81$. Przy $x+1>0$ mamy $x+1=9$, stąd $x=8$.",
                ],
                cleanSolution: [
                  "$4^{\\log_2(x+1)}=(x+1)^2$",
                  "$(x+1)^2=81$",
                  "$x+1=9$",
                  "$x=8$",
                ],
              },
              {
                type: "exercise",
                number: "5.78",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt: "Dla $x>0$ uprość wyrażenie $8^{\\log_2\\sqrt[3]{x}}$.",
                options: [
                  { key: "A", text: "$\\sqrt[3]{x}$" },
                  { key: "B", text: "$x$" },
                  { key: "C", text: "$x^3$" },
                  { key: "D", text: "$8x$" },
                ],
                hints: [
                  "Zapisz $8=2^3$ oraz $\\sqrt[3]{x}=x^{\\frac{1}{3}}$.",
                  "Użyj własności logarytmu potęgi, a potem tożsamości (2).",
                ],
                answer: "B. $x$",
                explanation: [
                  "$8=2^3$ oraz $\\sqrt[3]{x}=x^{\\frac{1}{3}}$, więc $8^{\\log_2\\sqrt[3]{x}}=(2^3)^{\\log_2 x^{\\frac{1}{3}}}=2^{3\\cdot\\frac{1}{3}\\log_2 x}$.",
                  "$2^{\\log_2 x}=x$ z tożsamości (2).",
                ],
                cleanSolution: [
                  "$8^{\\log_2\\sqrt[3]{x}}=(2^3)^{\\log_2 x^{\\frac{1}{3}}}$",
                  "$=2^{\\log_2 x}$",
                  "$=x$",
                ],
              },
            ],
          },
          {
            type: "exercise-group",
            title: "Wzory (7) i (8) - zmiana podstawy",
            formulaLabel: "(7)",
            contentLevel: "rozszerzenie",
            exercises: [
              {
                type: "exercise",
                number: "5.38",
                level: "rozszerzony",
                prompt:
                  "Wiadomo, że $\\log_2 3=a$. Wtedy liczba $\\log_3 8$ jest równa",
                options: [
                  { key: "A", text: "$\\dfrac{a}{3}$" },
                  { key: "B", text: "$\\dfrac{3}{a}$" },
                  { key: "C", text: "$3a$" },
                  { key: "D", text: "$\\dfrac{1}{3a}$" },
                ],
                hints: [
                  "Zapisz $\\log_3 8$ przy podstawie $2$.",
                  "Użyj $8=2^3$ oraz $a=\\log_2 3$.",
                ],
                answer: "B. $\\dfrac{3}{a}$",
                explanation: [
                  "$\\log_3 8=\\dfrac{\\log_2 8}{\\log_2 3}$.",
                  "$\\log_2 8=\\log_2(2^3)=3$ oraz $\\log_2 3=a$, więc $\\log_3 8=\\dfrac{3}{a}$.",
                ],
                cleanSolution: [
                  "$\\log_3 8=\\dfrac{\\log_2 8}{\\log_2 3}$",
                  "$\\log_2 8=\\log_2(2^3)=3$",
                  "$\\log_2 3=a$",
                  "$\\log_3 8=\\dfrac{3}{a}$",
                ],
              },
              {
                type: "exercise",
                number: "5.39",
                level: "rozszerzony",
                prompt: "Liczba $\\log_4 8+\\log_8 4$ jest równa",
                options: [
                  { key: "A", text: "$2$" },
                  { key: "B", text: "$\\dfrac{13}{6}$" },
                  { key: "C", text: "$\\dfrac{5}{2}$" },
                  { key: "D", text: "$\\dfrac{3}{2}$" },
                ],
                hints: [
                  "Zapisz oba logarytmy przy podstawie $2$.",
                  "Policz osobno $\\log_4 8$ oraz $\\log_8 4$, potem dodaj ułamki.",
                ],
                answer: "B. $\\dfrac{13}{6}$",
                explanation: [
                  "$\\log_4 8=\\dfrac{\\log_2 8}{\\log_2 4}=\\dfrac{3}{2}$.",
                  "$\\log_8 4=\\dfrac{\\log_2 4}{\\log_2 8}=\\dfrac{2}{3}$.",
                  "$\\dfrac{3}{2}+\\dfrac{2}{3}=\\dfrac{9}{6}+\\dfrac{4}{6}=\\dfrac{13}{6}$.",
                ],
                cleanSolution: [
                  "$\\log_4 8=\\dfrac{\\log_2 8}{\\log_2 4}$",
                  "$\\log_2 8=3$, $\\log_2 4=2$",
                  "$\\log_4 8=\\dfrac{3}{2}$",
                  "$\\log_8 4=\\dfrac{\\log_2 4}{\\log_2 8}=\\dfrac{2}{3}$",
                  "$\\log_4 8+\\log_8 4=\\dfrac{3}{2}+\\dfrac{2}{3}$",
                  "$=\\dfrac{9}{6}+\\dfrac{4}{6}$",
                  "$=\\dfrac{13}{6}$",
                ],
              },
              {
                type: "exercise",
                number: "5.10",
                level: "rozszerzony",
                prompt:
                  "Jeżeli $a=\\log_2 5$, wykaż, że $\\log_5 16=\\dfrac{4}{a}$.",
                hint: "Podstaw $a=\\log_2 5$ do prawej strony i skorzystaj ze zmiany podstawy.",
                answer: "Tożsamość zachodzi: $\\log_5 16=\\dfrac{4}{a}$.",
                explanation: [
                  "Podstawiamy $a=\\log_2 5$ do prawej strony: $\\dfrac{4}{a}=\\dfrac{4}{\\log_2 5}$.",
                  "$4=\\log_2 16$, więc $\\dfrac{4}{\\log_2 5}=\\dfrac{\\log_2 16}{\\log_2 5}$.",
                  "Ze zmiany podstawy: $\\dfrac{\\log_2 16}{\\log_2 5}=\\log_5 16$.",
                  "Zatem $\\dfrac{4}{a}=\\log_5 16$.",
                ],
                cleanSolution: [
                  "$a=\\log_2 5$",
                  "$\\dfrac{4}{a}=\\dfrac{4}{\\log_2 5}$",
                  "$\\log_2 16=\\log_2(2^4)=4$",
                  "$\\dfrac{4}{\\log_2 5}=\\dfrac{\\log_2 16}{\\log_2 5}$",
                  "$\\dfrac{\\log_2 16}{\\log_2 5}=\\log_5 16$",
                  "$\\dfrac{4}{a}=\\log_5 16$",
                ],
              },
              {
                type: "exercise",
                number: "5.40",
                level: "rozszerzony",
                contentLevel: "rozszerzenie",
                prompt:
                  "Dane są liczby rzeczywiste $a$ oraz $b$: $$a=8^{\\frac{2}{3}\\cdot\\log_2 27-\\log_2 3}$$ $$b=\\log_4 9\\cdot\\log_3 5\\cdot\\log_5 2$$ Oblicz wartość ilorazu $\\dfrac{a}{3b}$. Wynik zapisz w postaci $3^k$, gdzie $k\\in\\mathbb{Z}$.",
                hints: [
                  "Uprość wykładnik w $a$ do jednego logarytmu przy podstawie $2$.",
                  "Iloczyn w $b$ skróć łańcuchem zmiany podstawy.",
                  "Policz $\\dfrac{a}{3b}$ i zapisz jako potęgę trójki.",
                ],
                answer: "$3^{2}$",
                explanation: [
                  "Wykładnik: $\\dfrac{2}{3}\\log_2 27-\\log_2 3=\\log_2 27^{\\frac{2}{3}}-\\log_2 3=\\log_2 9-\\log_2 3=\\log_2 3$.",
                  "$a=8^{\\log_2 3}=(2^3)^{\\log_2 3}=2^{3\\log_2 3}=3^3=27$.",
                  "Zamiana podstawy na $2$: $b=\\log_4 9\\cdot\\log_3 5\\cdot\\log_5 2=\\dfrac{\\log_2 9}{\\log_2 4}\\cdot\\dfrac{\\log_2 5}{\\log_2 3}\\cdot\\dfrac{\\log_2 2}{\\log_2 5}$.",
                  "$\\log_2 9=2\\log_2 3$, $\\log_2 4=2$, $\\log_2 2=1$, więc $b=\\dfrac{2\\log_2 3}{2}\\cdot\\dfrac{\\log_2 5}{\\log_2 3}\\cdot\\dfrac{1}{\\log_2 5}=1$.",
                  "$\\dfrac{a}{3b}=\\dfrac{27}{3}=9=3^{2}$.",
                ],
                cleanSolution: [
                  "$\\dfrac{2}{3}\\log_2 27-\\log_2 3=\\log_2 27^{\\frac{2}{3}}-\\log_2 3$",
                  "$27=3^3$, więc $27^{\\frac{2}{3}}=3^2=9$",
                  "$\\log_2 9-\\log_2 3=\\log_2\\dfrac{9}{3}=\\log_2 3$",
                  "$a=8^{\\log_2 3}=(2^3)^{\\log_2 3}=2^{3\\log_2 3}$",
                  "$2^{3\\log_2 3}=(2^{\\log_2 3})^3=3^3=27$",
                  "$b=\\log_4 9\\cdot\\log_3 5\\cdot\\log_5 2$",
                  "$=\\dfrac{\\log_2 9}{\\log_2 4}\\cdot\\dfrac{\\log_2 5}{\\log_2 3}\\cdot\\dfrac{\\log_2 2}{\\log_2 5}$",
                  "$\\log_2 9=2\\log_2 3$, $\\log_2 4=2$, $\\log_2 2=1$",
                  "$b=\\dfrac{2\\log_2 3}{2}\\cdot\\dfrac{\\log_2 5}{\\log_2 3}\\cdot\\dfrac{1}{\\log_2 5}$",
                  "$=\\log_2 3\\cdot\\dfrac{\\log_2 5}{\\log_2 3}\\cdot\\dfrac{1}{\\log_2 5}=1$",
                  "$\\dfrac{a}{3b}=\\dfrac{27}{3\\cdot 1}=9=3^{2}$",
                ],
              },
              {
                type: "exercise",
                number: "5.41",
                level: "rozszerzony",
                contentLevel: "rozszerzenie",
                prompt:
                  "Oblicz $\\log_2\\sqrt[3]{32}-\\log_2\\left(\\log_2\\sqrt{\\sqrt{\\sqrt{16}}}\\right)$. Zakoduj cyfrę jedności i dwie pierwsze cyfry po przecinku rozwinięcia dziesiętnego otrzymanego wyniku.",
                hints: [
                  "Zapisz $\\sqrt[3]{32}$ jako potęgę dwójki.",
                  "Trzy zagnieżdżone pierwiastki kwadratowe to potęga z wykładnikiem $\\dfrac{1}{8}$.",
                  "Policz różnicę i odczytaj cyfry kodu z rozwinięcia dziesiętnego.",
                ],
                answer: "$266$",
                explanation: [
                  "$\\sqrt[3]{32}=32^{\\frac{1}{3}}=(2^5)^{\\frac{1}{3}}=2^{\\frac{5}{3}}$, więc $\\log_2\\sqrt[3]{32}=\\dfrac{5}{3}$.",
                  "$\\sqrt{\\sqrt{\\sqrt{16}}}=16^{\\frac{1}{8}}=(2^4)^{\\frac{1}{8}}=2^{\\frac{1}{2}}$, więc $\\log_2\\sqrt{\\sqrt{\\sqrt{16}}}=\\dfrac{1}{2}$.",
                  "$\\log_2\\dfrac{1}{2}=-1$.",
                  "Wynik: $\\dfrac{5}{3}-(-1)=\\dfrac{5}{3}+1=\\dfrac{8}{3}=2{,}666\\ldots$. Kod: $266$.",
                ],
                cleanSolution: [
                  "$\\sqrt[3]{32}=32^{\\frac{1}{3}}$",
                  "$32=2^5$, więc $32^{\\frac{1}{3}}=(2^5)^{\\frac{1}{3}}=2^{\\frac{5}{3}}$",
                  "$\\log_2\\sqrt[3]{32}=\\log_2 2^{\\frac{5}{3}}=\\dfrac{5}{3}$",
                  "$\\sqrt{\\sqrt{\\sqrt{16}}}=16^{\\frac{1}{8}}$",
                  "$16=2^4$, więc $16^{\\frac{1}{8}}=(2^4)^{\\frac{1}{8}}=2^{\\frac{1}{2}}$",
                  "$\\log_2\\sqrt{\\sqrt{\\sqrt{16}}}=\\log_2 2^{\\frac{1}{2}}=\\dfrac{1}{2}$",
                  "$\\log_2\\dfrac{1}{2}=\\log_2 2^{-1}=-1$",
                  "$\\log_2\\sqrt[3]{32}-\\log_2\\left(\\log_2\\sqrt{\\sqrt{\\sqrt{16}}}\\right)=\\dfrac{5}{3}-(-1)$",
                  "$=\\dfrac{5}{3}+1=\\dfrac{5}{3}+\\dfrac{3}{3}=\\dfrac{8}{3}$",
                  "$\\dfrac{8}{3}=2{,}666\\ldots$",
                  "kod $266$",
                ],
              },
              {
                type: "exercise",
                number: "5.42",
                level: "rozszerzony",
                prompt:
                  "Liczba $\\log_9\\sqrt[3]{27}-\\log_{27}\\sqrt{3}$ jest równa",
                options: [
                  { key: "A", text: "$\\dfrac{1}{3}$" },
                  { key: "B", text: "$\\dfrac{1}{2}$" },
                  { key: "C", text: "$\\dfrac{5}{6}$" },
                  { key: "D", text: "$\\dfrac{2}{3}$" },
                ],
                hints: [
                  "Zapisz pierwiastki jako potęgi i wyciągnij wykładniki przed logarytm.",
                  "Policz osobno $\\log_9 27$ oraz $\\log_{27} 3$.",
                  "Na końcu odejmij wyniki: $\\dfrac{1}{2}-\\dfrac{1}{6}$.",
                ],
                answer: "A. $\\dfrac{1}{3}$",
                explanation: [
                  "$\\log_9\\sqrt[3]{27}=\\log_9\\left(27^{\\frac{1}{3}}\\right)=\\dfrac{1}{3}\\log_9 27=\\dfrac{1}{3}\\cdot\\dfrac{\\log_3 27}{\\log_3 9}=\\dfrac{1}{3}\\cdot\\dfrac{3}{2}=\\dfrac{1}{2}$.",
                  "$\\log_{27}\\sqrt{3}=\\log_{27}\\left(3^{\\frac{1}{2}}\\right)=\\dfrac{1}{2}\\log_{27} 3=\\dfrac{1}{2}\\cdot\\dfrac{1}{\\log_3 27}=\\dfrac{1}{2}\\cdot\\dfrac{1}{3}=\\dfrac{1}{6}$.",
                  "$\\dfrac{1}{2}-\\dfrac{1}{6}=\\dfrac{3}{6}-\\dfrac{1}{6}=\\dfrac{1}{3}$.",
                ],
                cleanSolution: [
                  "$\\sqrt[3]{27}=27^{\\frac{1}{3}}$",
                  "$\\log_9\\sqrt[3]{27}=\\log_9 27^{\\frac{1}{3}}=\\dfrac{1}{3}\\log_9 27$",
                  "$\\log_9 27=\\dfrac{\\log_3 27}{\\log_3 9}=\\dfrac{3}{2}$",
                  "$\\dfrac{1}{3}\\cdot\\dfrac{3}{2}=\\dfrac{1}{2}$",
                  "$\\sqrt{3}=3^{\\frac{1}{2}}$",
                  "$\\log_{27}\\sqrt{3}=\\log_{27} 3^{\\frac{1}{2}}=\\dfrac{1}{2}\\log_{27} 3$",
                  "$\\log_{27} 3=\\dfrac{1}{\\log_3 27}=\\dfrac{1}{3}$",
                  "$\\dfrac{1}{2}\\cdot\\dfrac{1}{3}=\\dfrac{1}{6}$",
                  "$\\dfrac{1}{2}-\\dfrac{1}{6}=\\dfrac{3}{6}-\\dfrac{1}{6}=\\dfrac{1}{3}$",
                ],
              },
              {
                type: "exercise",
                number: "5.43",
                level: "rozszerzony",
                prompt:
                  "Wiadomo, że $\\log_5 2=a$ oraz $\\log_5 3=b$. Wtedy liczba $\\log_{18} 40$ jest równa",
                options: [
                  { key: "A", text: "$\\dfrac{3a+1}{a+2b}$" },
                  { key: "B", text: "$\\dfrac{2a+1}{a+2b}$" },
                  { key: "C", text: "$\\dfrac{3a+1}{2a+b}$" },
                  { key: "D", text: "$\\dfrac{a+1}{a+2b}$" },
                ],
                hints: [
                  "Zapisz $\\log_{18} 40$ przy podstawie $5$.",
                  "Rozbij $40=8\\cdot 5$ oraz $18=2\\cdot 9$.",
                  "W liczniku dostaniesz $3a+1$, w mianowniku $a+2b$.",
                ],
                answer: "A. $\\dfrac{3a+1}{a+2b}$",
                explanation: [
                  "$\\log_{18} 40=\\dfrac{\\log_5 40}{\\log_5 18}$.",
                  "$\\log_5 40=\\log_5(8\\cdot 5)=\\log_5 8+1=3a+1$.",
                  "$\\log_5 18=\\log_5(2\\cdot 9)=a+2b$.",
                  "Stąd $\\log_{18} 40=\\dfrac{3a+1}{a+2b}$.",
                ],
                cleanSolution: [
                  "$\\log_{18} 40=\\dfrac{\\log_5 40}{\\log_5 18}$",
                  "$40=8\\cdot 5$",
                  "$\\log_5 40=\\log_5 8+\\log_5 5$",
                  "$\\log_5 8=\\log_5(2^3)=3\\log_5 2=3a$",
                  "$\\log_5 5=1$",
                  "$\\log_5 40=3a+1$",
                  "$18=2\\cdot 9$",
                  "$\\log_5 18=\\log_5 2+\\log_5 9$",
                  "$\\log_5 9=\\log_5(3^2)=2\\log_5 3=2b$",
                  "$\\log_5 18=a+2b$",
                  "$\\log_{18} 40=\\dfrac{3a+1}{a+2b}$",
                ],
              },
              {
                type: "exercise",
                number: "5.44",
                level: "rozszerzony",
                prompt:
                  "Wiadomo, że $\\log_2 3=a$ oraz $\\log_3 5=b$. Wtedy liczba $\\log_{15} 24$ jest równa",
                options: [
                  { key: "A", text: "$\\dfrac{a+3}{a(1+b)}$" },
                  { key: "B", text: "$\\dfrac{3a+1}{a+b}$" },
                  { key: "C", text: "$\\dfrac{a(3+b)}{1+ab}$" },
                  { key: "D", text: "$\\dfrac{a+3}{1+ab}$" },
                ],
                hints: [
                  "Zapisz $\\log_{15} 24$ przy podstawie $2$.",
                  "Przydatne: $\\log_2 5=ab$.",
                  "Użyj $24=8\\cdot 3$ oraz $15=3\\cdot 5$.",
                ],
                answer: "A. $\\dfrac{a+3}{a(1+b)}$",
                explanation: [
                  "$\\log_{15} 24=\\dfrac{\\log_2 24}{\\log_2 15}$.",
                  "$\\log_2 24=\\log_2(8\\cdot 3)=3+a$.",
                  "$\\log_2 15=\\log_2(3\\cdot 5)=a+\\log_2 5=a+ab=a(1+b)$, bo $\\log_2 5=ab$.",
                  "Stąd $\\log_{15} 24=\\dfrac{a+3}{a(1+b)}$.",
                ],
                cleanSolution: [
                  "$\\log_{15} 24=\\dfrac{\\log_2 24}{\\log_2 15}$",
                  "$24=8\\cdot 3$",
                  "$\\log_2 24=\\log_2 8+\\log_2 3$",
                  "$\\log_2 8=\\log_2(2^3)=3$",
                  "$\\log_2 24=3+a$",
                  "$15=3\\cdot 5$",
                  "$\\log_2 15=\\log_2 3+\\log_2 5$",
                  "$\\log_2 5=\\log_2 3\\cdot\\log_3 5=ab$",
                  "$\\log_2 15=a+ab=a(1+b)$",
                  "$\\log_{15} 24=\\dfrac{3+a}{a(1+b)}=\\dfrac{a+3}{a(1+b)}$",
                ],
              },
              {
                type: "exercise",
                number: "5.12",
                level: "rozszerzony",
                prompt:
                  "Jeżeli $a=\\log_2 3$ oraz $b=\\log_3 5$, wykaż, że $\\log_6 15=\\dfrac{a(1+b)}{1+a}$.",
                hints: [
                  "Podstaw $a=\\log_2 3$ oraz $b=\\log_3 5$ do prawej strony.",
                  "Zauważ, że $\\log_2 5=ab$.",
                  "Sprowadź ułamek do $\\dfrac{\\log_2 15}{\\log_2 6}$.",
                ],
                answer: "Tożsamość zachodzi: $\\log_6 15=\\dfrac{a(1+b)}{1+a}$.",
                explanation: [
                  "Podstawiamy $a=\\log_2 3$ oraz $b=\\log_3 5$: $\\dfrac{a(1+b)}{1+a}=\\dfrac{\\log_2 3\\cdot(1+\\log_3 5)}{1+\\log_2 3}$.",
                  "$1+\\log_3 5=\\log_3 3+\\log_3 5=\\log_3 15$, więc licznik: $\\log_2 3\\cdot\\log_3 15=\\log_2 15$.",
                  "Mianownik: $1+\\log_2 3=\\log_2 2+\\log_2 3=\\log_2 6$.",
                  "Stąd $\\dfrac{a(1+b)}{1+a}=\\dfrac{\\log_2 15}{\\log_2 6}=\\log_6 15$.",
                ],
                cleanSolution: [
                  "$a=\\log_2 3$, $b=\\log_3 5$",
                  "$\\dfrac{a(1+b)}{1+a}=\\dfrac{\\log_2 3\\cdot(1+\\log_3 5)}{1+\\log_2 3}$",
                  "$1+\\log_3 5=\\log_3 3+\\log_3 5$",
                  "$\\log_3 3+\\log_3 5=\\log_3(3\\cdot 5)=\\log_3 15$",
                  "$\\log_2 3\\cdot\\log_3 15=\\log_2 15$",
                  "$1+\\log_2 3=\\log_2 2+\\log_2 3$",
                  "$\\log_2 2+\\log_2 3=\\log_2(2\\cdot 3)=\\log_2 6$",
                  "$\\dfrac{a(1+b)}{1+a}=\\dfrac{\\log_2 15}{\\log_2 6}$",
                  "$\\dfrac{\\log_2 15}{\\log_2 6}=\\log_6 15$",
                ],
              },
              {
                type: "exercise",
                number: "5.13",
                level: "rozszerzony",
                prompt:
                  "Jeżeli $a=\\log_2 5$ oraz $b=\\log_5 3$, wykaż, że $\\log_{12} 75=\\dfrac{a(1+2b)}{2+ab}$.",
                hints: [
                  "Podstaw $a=\\log_2 5$ oraz $b=\\log_5 3$ do prawej strony.",
                  "Przydatne: $\\log_2 3=ab$ oraz $1+2b=\\log_5 75$.",
                  "Sprowadź ułamek do $\\dfrac{\\log_2 75}{\\log_2 12}$.",
                ],
                answer: "Tożsamość zachodzi: $\\log_{12} 75=\\dfrac{a(1+2b)}{2+ab}$.",
                explanation: [
                  "Podstawiamy $a=\\log_2 5$ oraz $b=\\log_5 3$: $\\dfrac{a(1+2b)}{2+ab}=\\dfrac{\\log_2 5\\cdot(1+2\\log_5 3)}{2+\\log_2 5\\cdot\\log_5 3}$.",
                  "$1+2\\log_5 3=\\log_5 5+\\log_5 9=\\log_5 75$, więc licznik: $\\log_2 5\\cdot\\log_5 75=\\log_2 75$.",
                  "Mianownik: $2+ab=\\log_2 4+\\log_2 3=\\log_2 12$, bo $ab=\\log_2 3$.",
                  "Stąd $\\dfrac{a(1+2b)}{2+ab}=\\dfrac{\\log_2 75}{\\log_2 12}=\\log_{12} 75$.",
                ],
                cleanSolution: [
                  "$a=\\log_2 5$, $b=\\log_5 3$",
                  "$\\dfrac{a(1+2b)}{2+ab}=\\dfrac{\\log_2 5\\cdot(1+2\\log_5 3)}{2+\\log_2 5\\cdot\\log_5 3}$",
                  "$ab=\\log_2 5\\cdot\\log_5 3=\\log_2 3$",
                  "$1+2\\log_5 3=\\log_5 5+\\log_5(3^2)$",
                  "$=\\log_5 5+\\log_5 9=\\log_5(5\\cdot 9)=\\log_5 75$",
                  "$\\log_2 5\\cdot\\log_5 75=\\log_2 75$",
                  "$2+ab=\\log_2 4+\\log_2 3$",
                  "$\\log_2 4+\\log_2 3=\\log_2(4\\cdot 3)=\\log_2 12$",
                  "$\\dfrac{a(1+2b)}{2+ab}=\\dfrac{\\log_2 75}{\\log_2 12}$",
                  "$\\dfrac{\\log_2 75}{\\log_2 12}=\\log_{12} 75$",
                ],
              },
              {
                type: "exercise",
                number: "5.79",
                level: "rozszerzony",
                contentLevel: "rozszerzenie",
                prompt:
                  "Dla dowolnych liczb $a>0$, $a\\neq 1$, $b>0$, $b\\neq 1$ wartość wyrażenia $\\left(\\log_{\\frac{1}{a}} b\\right)\\cdot\\left(\\log_b a\\right)$ jest równa",
                options: [
                  { key: "A", text: "$a\\cdot b$" },
                  { key: "B", text: "$\\dfrac{1}{a\\cdot b}$" },
                  { key: "C", text: "$-1$" },
                  { key: "D", text: "$1$" },
                ],
                hints: [
                  "Zapisz $\\log_{\\frac{1}{a}} b$ przy podstawie $a$: to jest $-\\log_a b$.",
                  "Skorzystaj z odwrotności: $\\log_b a=\\dfrac{1}{\\log_a b}$.",
                ],
                answer: "C. $-1$",
                explanation: [
                  "$\\log_{\\frac{1}{a}} b=\\dfrac{\\log_a b}{\\log_a\\frac{1}{a}}=\\dfrac{\\log_a b}{-1}=-\\log_a b$.",
                  "$\\log_b a=\\dfrac{1}{\\log_a b}$.",
                  "Iloczyn: $\\left(-\\log_a b\\right)\\cdot\\dfrac{1}{\\log_a b}=-1$.",
                ],
                cleanSolution: [
                  "$\\log_{\\frac{1}{a}} b=\\dfrac{\\log_a b}{\\log_a\\frac{1}{a}}$",
                  "$\\log_a\\frac{1}{a}=\\log_a a^{-1}=-1$",
                  "$\\log_{\\frac{1}{a}} b=\\dfrac{\\log_a b}{-1}=-\\log_a b$",
                  "$\\log_b a=\\dfrac{1}{\\log_a b}$",
                  "$\\left(\\log_{\\frac{1}{a}} b\\right)\\cdot\\left(\\log_b a\\right)=\\left(-\\log_a b\\right)\\cdot\\dfrac{1}{\\log_a b}$",
                  "$=-1$",
                ],
              },
              {
                type: "exercise",
                number: "5.80",
                level: "rozszerzony",
                contentLevel: "rozszerzenie",
                prompt:
                  "Niech $L=\\log_{\\sqrt{3}} 3\\cdot\\log_3\\sqrt{5}\\cdot\\log_{\\sqrt{5}} 9$. Wtedy",
                options: [
                  { key: "A", text: "$L=1$" },
                  { key: "B", text: "$L=2$" },
                  { key: "C", text: "$L=3$" },
                  { key: "D", text: "$L=4$" },
                ],
                hints: [
                  "Iloczyn logarytmów „łańcuchem” upraszcza się do jednego logarytmu.",
                  "Policz $L=\\log_{\\sqrt{3}} 9$ z definicji.",
                ],
                answer: "D. $L=4$",
                explanation: [
                  "Z własności zmiany podstawy: $\\log_u v\\cdot\\log_v w=\\log_u w$, więc $L=\\log_{\\sqrt{3}} 9$.",
                  "Niech $\\log_{\\sqrt{3}} 9=c$. Wtedy $(\\sqrt{3})^c=9$.",
                  "$3^{\\frac{c}{2}}=3^2$, stąd $\\dfrac{c}{2}=2$ i $c=4$. Zatem $L=4$.",
                ],
                cleanSolution: [
                  "$L=\\log_{\\sqrt{3}} 3\\cdot\\log_3\\sqrt{5}\\cdot\\log_{\\sqrt{5}} 9$",
                  "$\\log_{\\sqrt{3}} 3\\cdot\\log_3\\sqrt{5}=\\log_{\\sqrt{3}}\\sqrt{5}$",
                  "$\\log_{\\sqrt{3}}\\sqrt{5}\\cdot\\log_{\\sqrt{5}} 9=\\log_{\\sqrt{3}} 9$",
                  "$L=\\log_{\\sqrt{3}} 9$",
                  "Niech $c=\\log_{\\sqrt{3}} 9$",
                  "$(\\sqrt{3})^c=9$",
                  "$\\sqrt{3}=3^{\\frac{1}{2}}$, $9=3^2$",
                  "$\\left(3^{\\frac{1}{2}}\\right)^c=3^2$",
                  "$3^{\\frac{c}{2}}=3^2$",
                  "$\\dfrac{c}{2}=2$",
                  "$c=4$",
                  "$L=4$",
                ],
              },
              {
                type: "exercise",
                number: "5.81",
                level: "rozszerzony",
                contentLevel: "rozszerzenie",
                prompt:
                  "Wartość wyrażenia $2\\log_5 15-\\dfrac{1}{\\log_{45} 5}$ jest równa",
                options: [
                  { key: "A", text: "$-1$" },
                  { key: "B", text: "$0$" },
                  { key: "C", text: "$1$" },
                  { key: "D", text: "$2$" },
                ],
                hints: [
                  "Z odwrotności: $\\dfrac{1}{\\log_{45} 5}=\\log_5 45$.",
                  "Zapisz $2\\log_5 15$ jako $\\log_5 225$ i odejmij logarytmy.",
                ],
                answer: "C. $1$",
                explanation: [
                  "$\\dfrac{1}{\\log_{45} 5}=\\log_5 45$.",
                  "$2\\log_5 15=\\log_5 15^2=\\log_5 225$.",
                  "$\\log_5 225-\\log_5 45=\\log_5\\dfrac{225}{45}=\\log_5 5=1$.",
                ],
                cleanSolution: [
                  "$\\dfrac{1}{\\log_{45} 5}=\\log_5 45$",
                  "$2\\log_5 15-\\dfrac{1}{\\log_{45} 5}=2\\log_5 15-\\log_5 45$",
                  "$2\\log_5 15=\\log_5 15^2$",
                  "$15^2=225$",
                  "$\\log_5 225-\\log_5 45=\\log_5\\dfrac{225}{45}$",
                  "$\\dfrac{225}{45}=5$",
                  "$\\log_5 5=1$",
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
                prompt:
                  "Oblicz $\\log_{\\sqrt[4]{8}}\\left(\\sqrt[6]{32}\\cdot\\sqrt{2}\\right)$.",
                hints: [
                  "Zapisz pierwiastki jako potęgi i zamień iloczyn na sumę wykładników.",
                  "Sprowadź obie strony do podstawy $2$.",
                  "Z $2^{\\frac{3c}{4}}=2^{\\frac{4}{3}}$ wylicz $c$.",
                ],
                answer: "$\\dfrac{16}{9}$",
                explanation: [
                  "Niech $\\log_{\\sqrt[4]{8}}\\left(\\sqrt[6]{32}\\cdot\\sqrt{2}\\right)=c$. Wtedy $\\left(\\sqrt[4]{8}\\right)^c=\\sqrt[6]{32}\\cdot\\sqrt{2}$.",
                  "$\\left(8^{\\frac{1}{4}}\\right)^c=32^{\\frac{1}{6}}\\cdot 2^{\\frac{1}{2}}$.",
                  "$8^{\\frac{c}{4}}=32^{\\frac{1}{6}}\\cdot 2^{\\frac{1}{2}}$.",
                  "$8=2^3$, $32=2^5$, więc $(2^3)^{\\frac{c}{4}}=(2^5)^{\\frac{1}{6}}\\cdot 2^{\\frac{1}{2}}$.",
                  "$2^{\\frac{3c}{4}}=2^{\\frac{5}{6}}\\cdot 2^{\\frac{1}{2}}=2^{\\frac{5}{6}+\\frac{1}{2}}=2^{\\frac{5}{6}+\\frac{3}{6}}=2^{\\frac{8}{6}}=2^{\\frac{4}{3}}$.",
                  "Stąd $\\dfrac{3c}{4}=\\dfrac{4}{3}$, więc $c=\\dfrac{4}{3}\\cdot\\dfrac{4}{3}=\\dfrac{16}{9}$.",
                ],
                cleanSolution: [
                  "$\\log_{\\sqrt[4]{8}}\\left(\\sqrt[6]{32}\\cdot\\sqrt{2}\\right)=c$",
                  "$\\left(\\sqrt[4]{8}\\right)^c=\\sqrt[6]{32}\\cdot\\sqrt{2}$",
                  "$\\left(8^{\\frac{1}{4}}\\right)^c=32^{\\frac{1}{6}}\\cdot 2^{\\frac{1}{2}}$",
                  "$8^{\\frac{c}{4}}=32^{\\frac{1}{6}}\\cdot 2^{\\frac{1}{2}}$",
                  "$(2^3)^{\\frac{c}{4}}=(2^5)^{\\frac{1}{6}}\\cdot 2^{\\frac{1}{2}}$",
                  "$2^{\\frac{3c}{4}}=2^{\\frac{5}{6}+\\frac{1}{2}}=2^{\\frac{4}{3}}$",
                  "$\\dfrac{3c}{4}=\\dfrac{4}{3}$",
                  "$c=\\dfrac{16}{9}$",
                ],
              },
              {
                type: "exercise",
                number: "5.15",
                level: "podstawowy",
                contentLevel: "podstawa",
                prompt:
                  "Oblicz $\\log_{\\sqrt[3]{4}}\\dfrac{\\sqrt[5]{32}}{\\sqrt{8}}$.",
                hints: [
                  "Zapisz pierwiastki jako potęgi i zamień iloraz na różnicę wykładników.",
                  "Sprowadź obie strony do podstawy $2$.",
                  "Z $\\dfrac{2c}{3}=-\\dfrac{1}{2}$ wylicz $c$.",
                ],
                answer: "$-\\dfrac{3}{4}$",
                explanation: [
                  "Niech $\\log_{\\sqrt[3]{4}}\\dfrac{\\sqrt[5]{32}}{\\sqrt{8}}=c$. Wtedy $\\left(\\sqrt[3]{4}\\right)^c=\\dfrac{\\sqrt[5]{32}}{\\sqrt{8}}$.",
                  "$\\left(4^{\\frac{1}{3}}\\right)^c=\\dfrac{32^{\\frac{1}{5}}}{8^{\\frac{1}{2}}}$.",
                  "$4^{\\frac{c}{3}}=\\dfrac{32^{\\frac{1}{5}}}{8^{\\frac{1}{2}}}$.",
                  "$4=2^2$, $32=2^5$, $8=2^3$, więc $(2^2)^{\\frac{c}{3}}=\\dfrac{(2^5)^{\\frac{1}{5}}}{(2^3)^{\\frac{1}{2}}}$.",
                  "$2^{\\frac{2c}{3}}=\\dfrac{2^1}{2^{\\frac{3}{2}}}=2^{1-\\frac{3}{2}}=2^{-\\frac{1}{2}}$.",
                  "Stąd $\\dfrac{2c}{3}=-\\dfrac{1}{2}$, więc $c=-\\dfrac{1}{2}\\cdot\\dfrac{3}{2}=-\\dfrac{3}{4}$.",
                ],
                cleanSolution: [
                  "$\\log_{\\sqrt[3]{4}}\\dfrac{\\sqrt[5]{32}}{\\sqrt{8}}=c$",
                  "$\\left(\\sqrt[3]{4}\\right)^c=\\dfrac{\\sqrt[5]{32}}{\\sqrt{8}}$",
                  "$\\left(4^{\\frac{1}{3}}\\right)^c=\\dfrac{32^{\\frac{1}{5}}}{8^{\\frac{1}{2}}}$",
                  "$4^{\\frac{c}{3}}=\\dfrac{32^{\\frac{1}{5}}}{8^{\\frac{1}{2}}}$",
                  "$(2^2)^{\\frac{c}{3}}=\\dfrac{(2^5)^{\\frac{1}{5}}}{(2^3)^{\\frac{1}{2}}}$",
                  "$2^{\\frac{2c}{3}}=2^{1-\\frac{3}{2}}=2^{-\\frac{1}{2}}$",
                  "$\\dfrac{2c}{3}=-\\dfrac{1}{2}$",
                  "$c=-\\dfrac{3}{4}$",
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
              "Poniżej **zadania maturalne** powiązane z logarytmami. Kliknij kafelek, aby otworzyć pełne zadanie.",
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
              "Najważniejsze fakty, **pułapki** i niuanse do szybkiego powtórzenia:",
          },
          {
            type: "callout",
            variant: "definition",
            title: "Definicja i zapis",
            content:
              "Z (1): **$\\log_a b=c$** wtedy i tylko wtedy, gdy **$a^c=b$** (dla $a>0$, $a\\neq 1$, $b>0$). Stąd (2): $a^{\\log_a b}=b$. Zapisy **$\\log x$** i **$\\lg x$** oznaczają **$\\log_{10} x$**.",
          },
          {
            type: "text",
            content: "**Własności** — przy tej samej podstawie:",
          },
          {
            type: "list",
            items: [
              "(3) — **iloczyn** → suma",
              "(6) — **iloraz** → różnica",
              "(4) — **potęga w argumencie** wychodzi przed logarytm",
              "(5) — **potęga w podstawie** daje czynnik $\\dfrac{1}{r}$",
              "Na rozszerzeniu: zmiana podstawy (7) oraz odwrotność (8)",
            ],
          },
          {
            type: "text",
            content: "**Schemat obliczania** — gdy wynik nie jest oczywisty:",
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Oznacz $c=\\log_a b$",
              "Zapisz $a^c=b$",
              "Zamień pierwiastki na potęgi ($\\sqrt[n]{x}=x^{\\frac{1}{n}}$)",
              "Sprowadź do jednej podstawy i porównaj wykładniki",
              "Sprawdź podstawieniem",
            ],
          },
          {
            type: "callout",
            variant: "pitfall",
            title: "Częsty błąd — kolejność w ilorazie",
            content:
              "Przy **$\\log_a x-\\log_a y$**: $x$ → licznik, $y$ → mianownik.",
            example: {
              prompt: "Uprość $\\log_5 125-\\log_5 5$.",
              wrong: "$\\log_5 125-\\log_5 5=\\log_5\\dfrac{5}{125}=\\log_5\\dfrac{1}{25}=-2$",
              right: "$\\log_5 125-\\log_5 5=\\log_5\\dfrac{125}{5}=\\log_5 25=2$",
              note: "Odwrócenie ułamka zmienia znak wyniku.",
            },
          },
          {
            type: "callout",
            variant: "pitfall",
            title: "Częsty błąd — współczynniki przy sumie i różnicy",
            content:
              "Wzory (3) i (6) wprost tylko przy współczynniku **$1$**. Najpierw wzór (4), potem łącz.",
            example: {
              prompt: "Uprość $3\\log_2 2+3\\log_2 4$.",
              wrong: "$3\\log_2 2+3\\log_2 4=\\log_2(2\\cdot 4)=\\log_2 8=3$",
              right:
                "$3\\log_2 2+3\\log_2 4=3(\\log_2 2+\\log_2 4)=3\\log_2(2\\cdot 4)=3\\log_2 8=3\\cdot 3=9$",
              note: "Współczynnik $3$ przed oboma logarytmami zostaje też przed wynikiem.",
            },
          },
          {
            type: "callout",
            variant: "pitfall",
            title: "Częsty błąd — skomplikowane logarytmy",
            content:
              "Nie mieszaj podstaw w jednym kroku: **pierwiastki → potęgi → jedna podstawa → wykładniki**.",
            example: {
              prompt: "Oblicz $\\log_{\\sqrt[3]{16}}\\sqrt[5]{32}$.",
              wrong:
                "Mieszasz od razu $16$ i $32$ albo pomijasz etap $\\left(16^{\\frac{1}{3}}\\right)^c$.",
              right:
                "Niech $\\log_{\\sqrt[3]{16}}\\sqrt[5]{32}=c$. Wtedy $\\left(\\sqrt[3]{16}\\right)^c=\\sqrt[5]{32}$, czyli $16^{\\frac{c}{3}}=32^{\\frac{1}{5}}$, a po przejściu na $2$: $2^{\\frac{4c}{3}}=2^1$, więc $c=\\dfrac{3}{4}$.",
              note: "Nie pomijaj etapu $(a^{1/n})^c$ przed przejściem do $a^{c/n}$.",
            },
          },
          {
            type: "callout",
            variant: "pitfall",
            title: "Częsty błąd — dziedzina",
            content:
              "Zawsze: podstawa **$a>0$**, **$a\\neq 1$**, argument **$b>0$**. Najpierw dziedzina, potem przekształcenia.",
            example: {
              prompt: "Rozważ wyrażenie $\\log_{(x-1)}(3-x)$.",
              wrong:
                "Od razu przekształcasz równanie / nierówność bez warunków na podstawę i argument.",
              right:
                "Dziedzina: $3-x>0\\Rightarrow x<3$ oraz $x-1>0$ i $x-1\\neq 1$, czyli $x>1$ i $x\\neq 2$. Razem: $x\\in(1,2)\\cup(2,3)$.",
              note: "Bez dziedziny możesz dostać „rozwiązania” spoza dziedziny logarytmu.",
            },
          },
          {
            type: "callout",
            variant: "why",
            title: "Niuans — podstawa z przedziału $(0,1)$",
            content:
              "Jeśli **$0<a<1$**, funkcja $\\log_a$ jest **malejąca**, a wynik może być ujemny. Kontroluj przez definicję $a^c=b$.",
          },
          {
            type: "callout",
            variant: "why",
            title: "Niuans — zmiana podstawy",
            contentLevel: "rozszerzenie",
            content:
              "Wzór (7) przelicza logarytm na wygodniejszą podstawę. Wzór (8): **$\\log_a b=\\dfrac{1}{\\log_b a}$**. Przydatne przy różnych podstawach lub $\\log_b a\\cdot\\log_a b=1$.",
          },
          {
            type: "callout",
            variant: "why",
            title: "Niuans — co wolno wyciągać przed logarytm",
            content:
              "Przed logarytm wychodzi **wykładnik argumentu** (4). Potęgę w podstawie obsługuje (5): $\\log_{a^r} b=\\dfrac{1}{r}\\log_a b$. Nie dzielisz logarytmów jak zwykłych liczb.",
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

      return section;
    })
    .filter(Boolean);

  return {
    ...article,
    legend: filterLegend(article.legend),
    sections,
  };
}
