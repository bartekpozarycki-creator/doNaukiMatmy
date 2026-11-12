function areaVertexGraph({
  a = -1,
  b,
  c = 0,
  xMax,
  yMax,
  yTickStep,
  vertex,
  variable = "x",
}) {
  return {
    parabola: true,
    a,
    b,
    c,
    xMin: 0,
    xMax,
    yMin: 0,
    yMax,
    xTickStep: xMax >= 24 ? 5 : xMax >= 12 ? 2 : 1,
    yTickStep,
    width: 280,
    height: 200,
    padL: 44,
    showAxis: true,
    xLabel: variable,
    yLabel: "P",
    points: [
      {
        x: vertex[0],
        y: vertex[1],
        label: `$W=(${vertex[0]},${vertex[1]})$`,
        dx: 10,
        dy: -26,
      },
    ],
  };
}

function parameterSchemeBlocks({ intro, tasks }) {
  return [
    {
      type: "subheading",
      contentLevel: "podstawa",
      title: "Rozważania z parametrem",
    },
    {
      type: "text",
      contentLevel: "podstawa",
      content: intro,
    },
    ...(tasks || []).map((task, index) => ({
      type: "guided-example",
      contentLevel: "podstawa",
      title: task.title || `Zadanie ${index + 1}`,
      prompt: task.prompt,
      steps: task.steps,
      result: task.result,
      cleanSolution: task.cleanSolution,
    })),
  ];
}

export const sampleArticles = [
  {
    id: "artykul-potegi-i-pierwiastki",
    title: "Potęgi i pierwiastki",
    description:
      "Potęgi o wykładniku naturalnym, prawa działań, pierwiastki kwadratowe i sześcienne. Poziom podstawówki, podstawowy i rozszerzony.",
    topic: "Liczby rzeczywiste",
    subtopic: "Potęgi i pierwiastki",
    contentModes: ["podstawowka", "podstawa", "rozszerzenie"],
    levels: ["podstawówka", "podstawowy", "rozszerzony"],
    readMinutes: 20,
    relatedTasks: {
      topicIncludes: ["potęg", "pierwiast"],
      subtopicIncludes: ["potęg", "pierwiast"],
      questionIncludes: ["potęg", "pierwiast", "\\sqrt"],
      limit: 12,
    },
    legend: [
      { label: "Poziom podstawówki", dot: "bg-green-500", contentLevel: "podstawowka" },
      { label: "Poziom podstawowy", dot: "bg-blue-500", contentLevel: "podstawa" },
      { label: "Poziom rozszerzony", dot: "bg-blue-300", contentLevel: "rozszerzenie" },
    ],
    sections: [
      {
        number: "1",
        heading: "Co to jest potęga",
        contentLevel: "podstawowka",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawowka",
            content:
              "Potęga to krótki zapis mnożenia **tej samej liczby** przez siebie. Tę liczbę nazywamy **podstawą**, a ile razy ją mnożymy - **wykładnikiem**.",
          },
          {
            type: "callout",
            variant: "definition",
            contentLevel: "podstawowka",
            title: "Definicja potęgi",
            content:
              "Niech $n$ będzie liczbą naturalną większą od $1$. Potęga $a^n$ oznacza iloczyn $n$ czynników równych $a$: $$a^n=a\\cdot a\\cdot\\ldots\\cdot a\\quad\\text{($n$ razy)}.$$",
            example: {
              prompt: "Oblicz $2^5$.",
              right:
                "Wykładnik $5$ oznacza pięć dwójek: $2^5=2\\cdot 2\\cdot 2\\cdot 2\\cdot 2$. Kolejno: $2\\cdot 2=4$, $4\\cdot 2=8$, $8\\cdot 2=16$, $16\\cdot 2=32$. Wynik: $32$.",
            },
          },
          {
            type: "formula-list",
            contentLevel: "podstawowka",
            items: [
              {
                latex: "a^n=a\\cdot a\\cdot\\ldots\\cdot a",
                label: "(1)",
                accent: "blue",
                caption: "definicja potęgi",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $3^4$.",
                  steps: [
                    "Wykładnik to $4$, więc mnożymy cztery trójki: $$3^4=3\\cdot 3\\cdot 3\\cdot 3.$$",
                    "Najpierw $3\\cdot 3=9$.",
                    "Dalej $9\\cdot 3=27$.",
                    "Na końcu $27\\cdot 3=81$.",
                  ],
                  result: "Wynik: $3^4=81$.",
                },
              },
              {
                latex: "a^1=a",
                label: "(2)",
                accent: "blue",
                caption: "wykładnik $1$",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $7^1$ i $12^1$.",
                  steps: [
                    "Wykładnik $1$ oznacza, że liczbę bierzemy **taką, jaka jest**. Nie mnożymy jej przez nic więcej.",
                    "Zatem $7^1=7$ oraz $12^1=12$.",
                  ],
                  result: "Wynik: $7^1=7$, $12^1=12$.",
                },
              },
              {
                latex: "a^0=1\\quad (a\\neq 0)",
                label: "(3)",
                accent: "blue",
                caption: "wykładnik $0$",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $5^0$ i $\\left(\\dfrac{1}{2}\\right)^0$.",
                  steps: [
                    "To **umowa**: każdą liczbę różną od zera podniesioną do potęgi $0$ liczymy jako $1$.",
                    "Liczba $5$ jest różna od zera, więc $5^0=1$.",
                    "Ułamek $\\dfrac{1}{2}$ też jest różny od zera, więc $\\left(\\dfrac{1}{2}\\right)^0=1$.",
                  ],
                  result: "Wynik: $5^0=1$, $\\left(\\dfrac{1}{2}\\right)^0=1$.",
                },
              },
              {
                latex: "a^2=a\\cdot a",
                label: "(4)",
                accent: "blue",
                caption: "kwadrat liczby",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $6^2$.",
                  steps: [
                    "Kwadrat liczby to ta liczba pomnożona przez siebie: $$6^2=6\\cdot 6.$$",
                    "$6\\cdot 6=36$.",
                  ],
                  result: "Wynik: $6^2=36$.",
                },
              },
              {
                latex: "a^3=a\\cdot a\\cdot a",
                label: "(5)",
                accent: "blue",
                caption: "sześcian liczby",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $4^3$.",
                  steps: [
                    "Sześcian liczby to trzy takie same czynniki: $$4^3=4\\cdot 4\\cdot 4.$$",
                    "Najpierw $4\\cdot 4=16$.",
                    "Dalej $16\\cdot 4=64$.",
                  ],
                  result: "Wynik: $4^3=64$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "insight",
            contentLevel: "podstawowka",
            title: "Potęgi liczby $10$",
            content:
              "Potęga $10^n$ to jedynka i $n$ zer. Na przykład $10^1=10$, $10^2=100$, $10^3=1000$, $10^4=10000$. Ze wzoru (3) mamy też $10^0=1$.",
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawowka",
            title: "Potęga to nie mnożenie przez wykładnik",
            content:
              "$2^3$ **nie** znaczy $2\\cdot 3$. To trzy dwójki: $2^3=2\\cdot 2\\cdot 2=8$. Natomiast $2\\cdot 3=6$. Inny wynik!",
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawowka",
            title: "Nawias przy liczbie ujemnej",
            content:
              "Najpierw liczymy potęgę, potem bierzemy minus. Dlatego $$-3^2=-(3\\cdot 3)=-9,$$ ale $$(-3)^2=(-3)\\cdot(-3)=9.$$ Nawias zmienia wynik. Dla nieparzystego wykładnika znak zostaje: $(-2)^3=(-2)\\cdot(-2)\\cdot(-2)=-8$.",
          },
        ],
      },
      {
        number: "2",
        heading: "Prawa działań na potęgach",
        contentLevel: "podstawowka",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawowka",
            content:
              "Gdy podstawy są **takie same**, nie musimy wypisywać całego iloczynu. Wystarczy dodać, odjąć albo pomnożyć wykładniki. Każdy wzór sprawdzamy na liczbach.",
          },
          {
            type: "formula-list",
            contentLevel: "podstawowka",
            items: [
              {
                latex: "a^m\\cdot a^n=a^{m+n}",
                label: "(6)",
                accent: "blue",
                caption: "iloczyn potęg o tej samej podstawie",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $2^3\\cdot 2^4$.",
                  steps: [
                    "Podstawy są takie same (obie to $2$), więc dodajemy wykładniki: $$2^3\\cdot 2^4=2^{3+4}=2^7.$$",
                    "Ze wzoru (1): $2^7=2\\cdot 2\\cdot 2\\cdot 2\\cdot 2\\cdot 2\\cdot 2$.",
                    "Kolejno: $2\\cdot 2=4$, $4\\cdot 2=8$, $8\\cdot 2=16$, $16\\cdot 2=32$, $32\\cdot 2=64$, $64\\cdot 2=128$.",
                    "Kontrola bez wzoru: $2^3=8$ i $2^4=16$, a $8\\cdot 16=128$. Ten sam wynik.",
                  ],
                  result: "Wynik: $2^3\\cdot 2^4=128$.",
                },
              },
              {
                latex: "\\dfrac{a^m}{a^n}=a^{m-n}\\quad (a\\neq 0)",
                label: "(7)",
                accent: "blue",
                caption: "iloraz potęg o tej samej podstawie",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $\\dfrac{3^5}{3^2}$.",
                  steps: [
                    "Podstawy są takie same i różne od zera, więc odejmujemy wykładniki: $$\\dfrac{3^5}{3^2}=3^{5-2}=3^3.$$",
                    "Ze wzoru (5): $3^3=3\\cdot 3\\cdot 3=9\\cdot 3=27$.",
                    "Kontrola: $3^5=243$ i $3^2=9$, a $243:9=27$. Ten sam wynik.",
                  ],
                  result: "Wynik: $\\dfrac{3^5}{3^2}=27$.",
                },
              },
              {
                latex: "(a^m)^n=a^{m\\cdot n}",
                label: "(8)",
                accent: "blue",
                caption: "potęga potęgi",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $(2^3)^2$.",
                  steps: [
                    "Wykładniki mnożymy: $$(2^3)^2=2^{3\\cdot 2}=2^6.$$",
                    "Ze wzoru (1): $2^6=2\\cdot 2\\cdot 2\\cdot 2\\cdot 2\\cdot 2$.",
                    "Kolejno: $2\\cdot 2=4$, $4\\cdot 2=8$, $8\\cdot 2=16$, $16\\cdot 2=32$, $32\\cdot 2=64$.",
                    "Kontrola: najpierw $2^3=8$, potem $8^2=64$. Ten sam wynik.",
                  ],
                  result: "Wynik: $(2^3)^2=64$.",
                },
              },
              {
                latex: "(a\\cdot b)^n=a^n\\cdot b^n",
                label: "(9)",
                accent: "blue",
                caption: "potęga iloczynu",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $(2\\cdot 5)^2$.",
                  steps: [
                    "Możemy najpierw pomnożyć w nawiasie: $2\\cdot 5=10$, więc $(2\\cdot 5)^2=10^2=100$.",
                    "Ze wzoru (9) to samo rozdzielamy na czynniki: $$(2\\cdot 5)^2=2^2\\cdot 5^2.$$",
                    "$2^2=4$ i $5^2=25$, a $4\\cdot 25=100$.",
                    "Obie drogi dają $100$.",
                  ],
                  result: "Wynik: $(2\\cdot 5)^2=100$.",
                },
              },
              {
                latex: "\\left(\\dfrac{a}{b}\\right)^n=\\dfrac{a^n}{b^n}\\quad (b\\neq 0)",
                label: "(10)",
                accent: "blue",
                caption: "potęga ilorazu",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $\\left(\\dfrac{8}{2}\\right)^3$.",
                  steps: [
                    "Najpierw w nawiasie: $\\dfrac{8}{2}=4$, więc $\\left(\\dfrac{8}{2}\\right)^3=4^3$.",
                    "Ze wzoru (5): $4^3=4\\cdot 4\\cdot 4=16\\cdot 4=64$.",
                    "Ze wzoru (10): $\\left(\\dfrac{8}{2}\\right)^3=\\dfrac{8^3}{2^3}$.",
                    "$8^3=8\\cdot 8\\cdot 8=64\\cdot 8=512$ i $2^3=8$, a $512:8=64$. Ten sam wynik.",
                  ],
                  result: "Wynik: $\\left(\\dfrac{8}{2}\\right)^3=64$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawowka",
            title: "Wzory (6) i (7) wymagają tej samej podstawy",
            content:
              "Nie wolno pisać $2^3\\cdot 5^3=10^6$. Tu podstawy są różne. Można za to ze wzoru (9) iść w drugą stronę: $2^3\\cdot 5^3=(2\\cdot 5)^3=10^3=1000$.",
          },
        ],
      },
      {
        number: "3",
        heading: "Pierwiastek kwadratowy i sześcienny",
        contentLevel: "podstawowka",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawowka",
            content:
              "Pierwiastek **odwraca** potęgę. Pierwiastek kwadratowy odwraca kwadrat, a pierwiastek sześcienny odwraca sześcian.",
          },
          {
            type: "callout",
            variant: "definition",
            contentLevel: "podstawowka",
            title: "Pierwiastek kwadratowy",
            content:
              "Dla $a\\ge 0$ liczba $\\sqrt{a}$ to **nieujemna** liczba, której kwadrat jest równy $a$. Czyli $\\sqrt{a}=b$ wtedy i tylko wtedy, gdy $b\\ge 0$ i $b^2=a$.",
            example: {
              prompt: "Oblicz $\\sqrt{36}$.",
              right:
                "Szukamy nieujemnej liczby, której kwadrat to $36$. $6\\cdot 6=36$ i $6\\ge 0$, więc $\\sqrt{36}=6$.",
            },
          },
          {
            type: "formula-list",
            contentLevel: "podstawowka",
            items: [
              {
                latex: "(\\sqrt{a})^2=a\\quad (a\\ge 0)",
                label: "(11)",
                accent: "blue",
                caption: "kwadrat pierwiastka kwadratowego",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $\\sqrt{25}$ i sprawdź wzór (11).",
                  steps: [
                    "Szukamy nieujemnej liczby, której kwadrat to $25$.",
                    "$5\\cdot 5=25$ i $5\\ge 0$, więc $\\sqrt{25}=5$.",
                    "Sprawdzenie wzoru (11): $(\\sqrt{25})^2=5^2=25$. Wróciliśmy do liczby pod pierwiastkiem.",
                  ],
                  result: "Wynik: $\\sqrt{25}=5$.",
                },
              },
              {
                latex: "\\sqrt{a^2}=a\\quad (a\\ge 0)",
                label: "(12)",
                accent: "blue",
                caption: "pierwiastek z kwadratu (dla $a\\ge 0$)",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $\\sqrt{7^2}$.",
                  steps: [
                    "Liczba $7$ jest nieujemna, więc ze wzoru (12) od razu $\\sqrt{7^2}=7$.",
                    "Dla pewności: $7^2=49$ i $\\sqrt{49}=7$, bo $7\\cdot 7=49$.",
                  ],
                  result: "Wynik: $\\sqrt{7^2}=7$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "definition",
            contentLevel: "podstawowka",
            title: "Pierwiastek sześcienny",
            content:
              "Liczba $\\sqrt[3]{a}$ to taka liczba, której sześcian jest równy $a$. Czyli $\\sqrt[3]{a}=b$ wtedy i tylko wtedy, gdy $b^3=a$. Tu $a$ **może być ujemne**.",
            example: {
              prompt: "Oblicz $\\sqrt[3]{27}$ i $\\sqrt[3]{-1}$.",
              right:
                "$3\\cdot 3\\cdot 3=27$, więc $\\sqrt[3]{27}=3$. $(-1)\\cdot(-1)\\cdot(-1)=-1$, więc $\\sqrt[3]{-1}=-1$.",
            },
          },
          {
            type: "formula-list",
            contentLevel: "podstawowka",
            items: [
              {
                latex: "(\\sqrt[3]{a})^3=a",
                label: "(13)",
                accent: "blue",
                caption: "sześcian pierwiastka sześciennego",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $\\sqrt[3]{8}$ i $\\sqrt[3]{-8}$.",
                  steps: [
                    "Szukamy liczby, której sześcian to $8$. Ze wzoru (5): $2\\cdot 2\\cdot 2=8$, więc $\\sqrt[3]{8}=2$.",
                    "Sprawdzenie: $(\\sqrt[3]{8})^3=2^3=8$.",
                    "Dla liczby ujemnej: $(-2)\\cdot(-2)\\cdot(-2)=-8$, więc $\\sqrt[3]{-8}=-2$.",
                    "Pierwiastek **kwadratowy** z liczby ujemnej w liczbach rzeczywistych nie istnieje. Pierwiastek **sześcienny** z liczby ujemnej jak najbardziej istnieje.",
                  ],
                  result: "Wynik: $\\sqrt[3]{8}=2$, $\\sqrt[3]{-8}=-2$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "insight",
            contentLevel: "podstawowka",
            title: "Kilka gotowych wartości",
            content:
              "$\\sqrt{1}=1$, $\\sqrt{4}=2$, $\\sqrt{9}=3$, $\\sqrt{16}=4$, $\\sqrt{25}=5$, $\\sqrt{36}=6$, $\\sqrt{49}=7$, $\\sqrt{64}=8$, $\\sqrt{81}=9$, $\\sqrt{100}=10$. Dla sześcianów: $\\sqrt[3]{1}=1$, $\\sqrt[3]{8}=2$, $\\sqrt[3]{27}=3$, $\\sqrt[3]{64}=4$, $\\sqrt[3]{125}=5$.",
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawowka",
            title: "Pierwiastek to nie dzielenie przez $2$",
            content:
              "$\\sqrt{16}$ **nie** znaczy $16:2$. To pytanie: *jaka nieujemna liczba razy ona sama daje $16$?* Odpowiedź to $4$, bo $4\\cdot 4=16$. Natomiast $16:2=8$. Inny wynik!",
          },
        ],
      },
      {
        number: "4",
        heading: "Zamiana potęgi na pierwiastek",
        contentLevel: "podstawowka",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawowka",
            content:
              "Potęga i pierwiastek to **dwa zapisy tego samego**. Kwadrat odwracamy pierwiastkiem kwadratowym, sześcian - pierwiastkiem sześciennym. Możemy też zapisać pierwiastek jako potęgę z ułamkiem w wykładniku.",
          },
          {
            type: "formula-list",
            contentLevel: "podstawowka",
            items: [
              {
                latex: "a^2=b\\;\\Leftrightarrow\\; a=\\sqrt{b}\\quad (a\\ge 0,\\ b\\ge 0)",
                label: "(14)",
                accent: "blue",
                caption: "kwadrat i pierwiastek kwadratowy",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Zapisz $6^2=36$ za pomocą pierwiastka. Potem z $\\sqrt{81}=9$ wróć do potęgi.",
                  steps: [
                    "$6^2=36$ znaczy: sześć do kwadratu daje $36$.",
                    "Ze wzoru (14) w drugą stronę: $6=\\sqrt{36}$.",
                    "Teraz odwrotnie. Mamy $\\sqrt{81}=9$, więc ze wzoru (14) $9^2=81$.",
                    "Kontrola: $9\\cdot 9=81$. Zgadza się.",
                  ],
                  result: "Wynik: $\\sqrt{36}=6$ oraz $9^2=81$.",
                },
              },
              {
                latex: "a^3=b\\;\\Leftrightarrow\\; a=\\sqrt[3]{b}",
                label: "(15)",
                accent: "blue",
                caption: "sześcian i pierwiastek sześcienny",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Zapisz $4^3=64$ za pomocą pierwiastka. Potem z $\\sqrt[3]{-8}=-2$ wróć do potęgi.",
                  steps: [
                    "$4^3=64$ znaczy: cztery do sześcianu daje $64$.",
                    "Ze wzoru (15): $4=\\sqrt[3]{64}$.",
                    "Odwrotnie: $\\sqrt[3]{-8}=-2$, więc $(-2)^3=-8$.",
                    "Kontrola: $(-2)\\cdot(-2)\\cdot(-2)=-8$. Zgadza się.",
                  ],
                  result: "Wynik: $\\sqrt[3]{64}=4$ oraz $(-2)^3=-8$.",
                },
              },
              {
                latex: "\\sqrt{a}=a^{1/2}\\quad (a\\ge 0),\\qquad \\sqrt[3]{a}=a^{1/3}",
                label: "(16)",
                accent: "blue",
                caption: "pierwiastek zapisany jako potęga",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Zapisz $\\sqrt{25}$ jako potęgę i $8^{1/3}$ jako pierwiastek. Oblicz oba.",
                  steps: [
                    "Ze wzoru (16) pierwiastek kwadratowy to potęga $\\dfrac{1}{2}$: $$\\sqrt{25}=25^{1/2}.$$",
                    "$5\\cdot 5=25$, więc $\\sqrt{25}=5$. Zatem $25^{1/2}=5$.",
                    "W drugą stronę: potęga $\\dfrac{1}{3}$ to pierwiastek sześcienny: $$8^{1/3}=\\sqrt[3]{8}.$$",
                    "$2\\cdot 2\\cdot 2=8$, więc $\\sqrt[3]{8}=2$. Zatem $8^{1/3}=2$.",
                  ],
                  result: "Wynik: $\\sqrt{25}=25^{1/2}=5$, $8^{1/3}=\\sqrt[3]{8}=2$.",
                },
              },
              {
                latex: "a^{m/n}=\\sqrt[n]{a^m}=(\\sqrt[n]{a})^m\\quad (a\\ge 0)",
                label: "(17)",
                accent: "blue",
                caption: "potęga z ułamkiem i pierwiastek",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $8^{2/3}$ na dwa sposoby. Potem zapisz $\\sqrt{9^3}$ jako potęgę i oblicz.",
                  steps: [
                    "Ze wzoru (17) wygodniej najpierw wziąć pierwiastek, potem podnieść do potęgi: $$8^{2/3}=(\\sqrt[3]{8})^2.$$",
                    "$\\sqrt[3]{8}=2$, więc $(2)^2=4$.",
                    "Drugi sposób: $$8^{2/3}=\\sqrt[3]{8^2}=\\sqrt[3]{64}.$$ $4\\cdot 4\\cdot 4=64$, więc $\\sqrt[3]{64}=4$. Ten sam wynik.",
                    "Teraz odwrotnie. $\\sqrt{9^3}$ to wzór (17) od strony pierwiastka: $$\\sqrt{9^3}=9^{3/2}=(\\sqrt{9})^3.$$",
                    "$\\sqrt{9}=3$, więc $3^3=3\\cdot 3\\cdot 3=27$.",
                  ],
                  result: "Wynik: $8^{2/3}=4$, $\\sqrt{9^3}=9^{3/2}=27$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "insight",
            contentLevel: "podstawowka",
            title: "Jak czytać ułamek w wykładniku",
            content:
              "W $a^{m/n}$ **mianownik** $n$ mówi, jaki pierwiastek bierzemy. **Licznik** $m$ mówi, do której potęgi podnosimy. W $8^{2/3}$ trójka to pierwiastek sześcienny, dwójka to kwadrat. Zwykle łatwiej najpierw pierwiastek, potem potęga: $(\\sqrt[3]{8})^2$.",
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawowka",
            title: "Nie myl $a^{1/2}$ z $a/2$",
            content:
              "$9^{1/2}$ **nie** znaczy $9:2$. To $\\sqrt{9}=3$. Natomiast $9:2=4{,}5$. Inny wynik! Ułamek stoi w **wykładniku**, nie obok podstawy.",
          },
        ],
      },
      {
        number: "5",
        heading: "Działania na pierwiastkach",
        contentLevel: "podstawowka",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawowka",
            content:
              "Pierwiastki kwadratowe można mnożyć i dzielić. Przy dodawaniu **nie** ma analogicznego wzoru: $\\sqrt{9}+\\sqrt{16}$ to $3+4=7$, a nie $\\sqrt{25}=5$.",
          },
          {
            type: "formula-list",
            contentLevel: "podstawowka",
            items: [
              {
                latex: "\\sqrt{a}\\cdot\\sqrt{b}=\\sqrt{a\\cdot b}\\quad (a\\ge 0,\\ b\\ge 0)",
                label: "(18)",
                accent: "blue",
                caption: "iloczyn pierwiastków kwadratowych",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $\\sqrt{4}\\cdot\\sqrt{9}$.",
                  steps: [
                    "Możemy policzyć każdy pierwiastek osobno: $\\sqrt{4}=2$ i $\\sqrt{9}=3$, więc $2\\cdot 3=6$.",
                    "Ze wzoru (18): $\\sqrt{4}\\cdot\\sqrt{9}=\\sqrt{4\\cdot 9}=\\sqrt{36}$.",
                    "$\\sqrt{36}=6$, bo $6\\cdot 6=36$. Ten sam wynik.",
                  ],
                  result: "Wynik: $\\sqrt{4}\\cdot\\sqrt{9}=6$.",
                },
              },
              {
                latex: "\\dfrac{\\sqrt{a}}{\\sqrt{b}}=\\sqrt{\\dfrac{a}{b}}\\quad (a\\ge 0,\\ b>0)",
                label: "(19)",
                accent: "blue",
                caption: "iloraz pierwiastków kwadratowych",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $\\dfrac{\\sqrt{50}}{\\sqrt{2}}$.",
                  steps: [
                    "Ze wzoru (19) łączymy pierwiastki: $$\\dfrac{\\sqrt{50}}{\\sqrt{2}}=\\sqrt{\\dfrac{50}{2}}=\\sqrt{25}.$$",
                    "$\\sqrt{25}=5$, bo $5\\cdot 5=25$.",
                  ],
                  result: "Wynik: $\\dfrac{\\sqrt{50}}{\\sqrt{2}}=5$.",
                },
              },
              {
                latex: "\\sqrt{a^2\\cdot b}=a\\sqrt{b}\\quad (a\\ge 0,\\ b\\ge 0)",
                label: "(20)",
                accent: "blue",
                caption: "wyłączanie czynnika przed pierwiastek",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Zapisz $\\sqrt{48}$ w postaci $a\\sqrt{b}$.",
                  steps: [
                    "Szukamy największego kwadratu, który dzieli $48$. Sprawdzamy: $16\\cdot 3=48$ i $16=4^2$.",
                    "Zatem $\\sqrt{48}=\\sqrt{4^2\\cdot 3}$.",
                    "Ze wzoru (20): $\\sqrt{4^2\\cdot 3}=4\\sqrt{3}$.",
                    "Kontrola ze wzoru (18): $4\\sqrt{3}=\\sqrt{16}\\cdot\\sqrt{3}=\\sqrt{48}$.",
                  ],
                  result: "Wynik: $\\sqrt{48}=4\\sqrt{3}$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawowka",
            title: "Nie dodajemy pierwiastków pod jednym znakiem",
            content:
              "$\\sqrt{9}+\\sqrt{16}=3+4=7$. To **nie** jest $\\sqrt{9+16}=\\sqrt{25}=5$. Wzory (18) i (19) działają przy mnożeniu i dzieleniu, nie przy dodawaniu.",
          },
        ],
      },
      {
        number: "6",
        heading: "Przykłady",
        contentLevel: "podstawowka",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawowka",
            content:
              "Poniżej kilka zadań od początku do końca. Rozwiązanie jest schowane - kliknij, żeby je zobaczyć.",
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 1",
            prompt: "Oblicz $5^4$.",
            steps: [
              "Ze wzoru (1) zapisujemy iloczyn czterech piątek: $$5^4=5\\cdot 5\\cdot 5\\cdot 5.$$",
              "Najpierw $5\\cdot 5=25$.",
              "Dalej $25\\cdot 5=125$.",
              "Na końcu $125\\cdot 5=625$.",
            ],
            result: "$5^4=625$",
            cleanSolution: ["$5^4=5\\cdot 5\\cdot 5\\cdot 5=625$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 2",
            prompt: "Oblicz $\\dfrac{2^8}{2^3}$.",
            steps: [
              "Podstawy są takie same i różne od zera, więc korzystamy ze wzoru (7): $$\\dfrac{2^8}{2^3}=2^{8-3}=2^5.$$",
              "Ze wzoru (1): $2^5=2\\cdot 2\\cdot 2\\cdot 2\\cdot 2$.",
              "Kolejno: $2\\cdot 2=4$, $4\\cdot 2=8$, $8\\cdot 2=16$, $16\\cdot 2=32$.",
            ],
            result: "$\\dfrac{2^8}{2^3}=32$",
            cleanSolution: ["$\\dfrac{2^8}{2^3}=2^{8-3}=2^5=32$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 3",
            prompt: "Oblicz $\\sqrt{81}$ i $\\sqrt[3]{27}$.",
            steps: [
              "Dla $\\sqrt{81}$ szukamy nieujemnej liczby, której kwadrat to $81$.",
              "$9\\cdot 9=81$ i $9\\ge 0$, więc $\\sqrt{81}=9$.",
              "Dla $\\sqrt[3]{27}$ szukamy liczby, której sześcian to $27$.",
              "$3\\cdot 3\\cdot 3=9\\cdot 3=27$, więc $\\sqrt[3]{27}=3$.",
            ],
            result: "$\\sqrt{81}=9$, $\\sqrt[3]{27}=3$",
            cleanSolution: ["$\\sqrt{81}=9$", "$\\sqrt[3]{27}=3$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 4",
            prompt: "Zapisz $\\sqrt{72}$ w postaci $a\\sqrt{b}$.",
            steps: [
              "Szukamy największego kwadratu, który dzieli $72$. Mamy $36\\cdot 2=72$ i $36=6^2$.",
              "Zatem $\\sqrt{72}=\\sqrt{6^2\\cdot 2}$.",
              "Ze wzoru (20): $\\sqrt{6^2\\cdot 2}=6\\sqrt{2}$.",
            ],
            result: "$\\sqrt{72}=6\\sqrt{2}$",
            cleanSolution: ["$\\sqrt{72}=\\sqrt{36\\cdot 2}=6\\sqrt{2}$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 5",
            prompt: "Oblicz $3^2\\cdot 3^3$.",
            steps: [
              "Podstawy są takie same, więc ze wzoru (6) dodajemy wykładniki: $$3^2\\cdot 3^3=3^{2+3}=3^5.$$",
              "Ze wzoru (1): $3^5=3\\cdot 3\\cdot 3\\cdot 3\\cdot 3$.",
              "Kolejno: $3\\cdot 3=9$, $9\\cdot 3=27$, $27\\cdot 3=81$, $81\\cdot 3=243$.",
            ],
            result: "$3^2\\cdot 3^3=243$",
            cleanSolution: ["$3^2\\cdot 3^3=3^5=243$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 6",
            prompt: "Oblicz $(-3)^2$ i $-3^2$.",
            steps: [
              "Nawias oznacza, że do kwadratu idzie cała liczba $-3$: $$(-3)^2=(-3)\\cdot(-3)=9.$$",
              "Bez nawiasu najpierw liczymy potęgę, potem bierzemy minus: $$-3^2=-(3\\cdot 3)=-9.$$",
              "To dwa różne wyniki. Przy liczbie ujemnej nawias jest ważny.",
            ],
            result: "$(-3)^2=9$, $-3^2=-9$",
            cleanSolution: ["$(-3)^2=9$", "$-3^2=-9$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 7",
            prompt: "Wiadomo, że $5^2=25$. Zapisz to za pomocą pierwiastka. Potem z $\\sqrt{121}=11$ wróć do potęgi.",
            steps: [
              "Ze wzoru (14) równanie $5^2=25$ to to samo co $5=\\sqrt{25}$.",
              "Odwrotnie: $\\sqrt{121}=11$, więc ze wzoru (14) $11^2=121$.",
              "Kontrola: $11\\cdot 11=121$.",
            ],
            result: "$\\sqrt{25}=5$, $11^2=121$",
            cleanSolution: ["$5^2=25\\;\\Leftrightarrow\\;\\sqrt{25}=5$", "$\\sqrt{121}=11\\;\\Leftrightarrow\\; 11^2=121$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 8",
            prompt: "Zapisz $\\sqrt{49}$ jako potęgę i $27^{1/3}$ jako pierwiastek. Oblicz oba.",
            steps: [
              "Ze wzoru (16): $\\sqrt{49}=49^{1/2}$.",
              "$7\\cdot 7=49$, więc $\\sqrt{49}=7$. Zatem $49^{1/2}=7$.",
              "W drugą stronę: $27^{1/3}=\\sqrt[3]{27}$.",
              "$3\\cdot 3\\cdot 3=27$, więc $\\sqrt[3]{27}=3$. Zatem $27^{1/3}=3$.",
            ],
            result: "$\\sqrt{49}=49^{1/2}=7$, $27^{1/3}=\\sqrt[3]{27}=3$",
            cleanSolution: ["$\\sqrt{49}=49^{1/2}=7$", "$27^{1/3}=\\sqrt[3]{27}=3$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 9",
            prompt: "Oblicz $16^{3/2}$.",
            steps: [
              "Ze wzoru (17) mianownik $2$ to pierwiastek kwadratowy, licznik $3$ to sześcian: $$16^{3/2}=(\\sqrt{16})^3.$$",
              "$\\sqrt{16}=4$, bo $4\\cdot 4=16$.",
              "Dalej $4^3=4\\cdot 4\\cdot 4=16\\cdot 4=64$.",
              "Drugi sposób: $16^{3/2}=\\sqrt{16^3}$. To ten sam wynik, ale liczby są większe, więc pierwszy sposób jest wygodniejszy.",
            ],
            result: "$16^{3/2}=64$",
            cleanSolution: ["$16^{3/2}=(\\sqrt{16})^3=4^3=64$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 10",
            prompt: "Oblicz $\\sqrt{9}\\cdot\\sqrt{16}$ oraz zapisz $\\sqrt{32}$ w postaci $a\\sqrt{b}$.",
            steps: [
              "Ze wzoru (18) albo od razu: $\\sqrt{9}=3$ i $\\sqrt{16}=4$, więc $3\\cdot 4=12$.",
              "Kontrola: $\\sqrt{9}\\cdot\\sqrt{16}=\\sqrt{144}=12$, bo $12\\cdot 12=144$.",
              "Dla $\\sqrt{32}$ szukamy największego kwadratu w $32$: $16\\cdot 2=32$ i $16=4^2$.",
              "Ze wzoru (20): $\\sqrt{32}=\\sqrt{4^2\\cdot 2}=4\\sqrt{2}$.",
            ],
            result: "$\\sqrt{9}\\cdot\\sqrt{16}=12$, $\\sqrt{32}=4\\sqrt{2}$",
            cleanSolution: ["$\\sqrt{9}\\cdot\\sqrt{16}=3\\cdot 4=12$", "$\\sqrt{32}=\\sqrt{16\\cdot 2}=4\\sqrt{2}$"],
          },
        ],
      },
      {
        number: "",
        heading: "Poziom podstawowy",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "callout",
            variant: "insight",
            contentLevel: "podstawa",
            title: "W przygotowaniu",
            content: "Ten poziom notatki jest jeszcze w przygotowaniu.",
          },
        ],
      },
      {
        number: "",
        heading: "Poziom rozszerzony",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "callout",
            variant: "insight",
            contentLevel: "rozszerzenie",
            title: "W przygotowaniu",
            content: "Ten poziom notatki jest jeszcze w przygotowaniu.",
          },
        ],
      },
    ],
  },
  {
    id: "artykul-wyrazenia-algebraiczne",
    title: "Wyrażenia algebraiczne",
    description:
      "Redukcja wyrazów podobnych, mnożenie nawiasów, wartość wyrażenia dla podanego x oraz pola i obwody figur ze sklejanych prostokątów. Poziom podstawówki, podstawowy i rozszerzony.",
    topic: "Wyrażenia algebraiczne",
    subtopic: "Mnożenie nawiasów i podstawianie",
    contentModes: ["podstawowka", "podstawa", "rozszerzenie"],
    levels: ["podstawówka", "podstawowy", "rozszerzony"],
    readMinutes: 18,
    relatedTasks: {
      topicIncludes: ["wyrażen", "algebra"],
      subtopicIncludes: ["wyrażen", "algebra", "nawias"],
      questionIncludes: ["wyrażen", "nawias", "obwód", "pole"],
      limit: 12,
    },
    legend: [
      { label: "Poziom podstawówki", dot: "bg-green-500", contentLevel: "podstawowka" },
      { label: "Poziom podstawowy", dot: "bg-blue-500", contentLevel: "podstawa" },
      { label: "Poziom rozszerzony", dot: "bg-blue-300", contentLevel: "rozszerzenie" },
    ],
    sections: [
      {
        number: "1",
        heading: "Co to jest wyrażenie algebraiczne",
        contentLevel: "podstawowka",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawowka",
            content:
              "Wyrażenie algebraiczne to zapis z **liczbami**, **literami** (niewiadomymi) i działaniami. Litera stoi w miejscu liczby, której jeszcze nie znamy albo która może się zmieniać.",
          },
          {
            type: "callout",
            variant: "definition",
            contentLevel: "podstawowka",
            title: "Wyrazy podobne",
            content:
              "Wyrazy są **podobne**, gdy mają tę samą literę w tej samej potędze. $3x$ i $7x$ są podobne. $3x$ i $3x^2$ **nie** są podobne. $5$ i $-2$ są podobne, bo oba są liczbami bez litery. Wyrazy podobne można **dodawać, odejmować, mnożyć i dzielić**.",
            example: {
              prompt: "Które wyrazy w $4x+3+x-1$ są podobne?",
              right:
                "$4x$ i $x$ są podobne, więc $4x+x=5x$. Liczby $3$ i $-1$ są podobne, więc $3-1=2$. Całość: $5x+2$.",
            },
          },
          {
            type: "formula-list",
            contentLevel: "podstawowka",
            items: [
              {
                latex: "ax+bx=(a+b)x",
                label: "(1)",
                accent: "blue",
                caption: "dodawanie wyrazów podobnych",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Uprość $5x+3x$.",
                  steps: [
                    "Oba wyrazy mają $x$, więc są podobne. Dodajemy liczby stojące przy $x$: $5+3=8$.",
                    "Zostaje $8x$.",
                  ],
                  result: "Wynik: $5x+3x=8x$.",
                },
              },
              {
                latex: "ax-bx=(a-b)x",
                label: "(2)",
                accent: "blue",
                caption: "odejmowanie wyrazów podobnych",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Uprość $7x-2x+4-1$.",
                  steps: [
                    "Najpierw wyrazy z $x$: $7x-2x=(7-2)x=5x$.",
                    "Potem liczby bez litery: $4-1=3$.",
                    "Zostaje $5x+3$. Tego już nie sklejamy w jeden wyraz, bo $5x$ ma $x$, a $3$ nie.",
                  ],
                  result: "Wynik: $7x-2x+4-1=5x+3$.",
                },
              },
              {
                latex: "ax\\cdot bx=abx^2",
                label: "(3)",
                accent: "blue",
                caption: "mnożenie wyrazów podobnych",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $3x\\cdot 4x$ oraz $5\\cdot 2x$.",
                  steps: [
                    "Przy mnożeniu $3x\\cdot 4x$ mnożymy liczby i litery osobno: $3\\cdot 4=12$ oraz $x\\cdot x=x^2$.",
                    "Zostaje $12x^2$. To **nie** jest $12x$ - dwa $x$ dają $x^2$.",
                    "Gdy mnożymy przez liczbę bez $x$: $5\\cdot 2x=10x$. Tu potęga $x$ się nie zmienia.",
                  ],
                  result: "Wynik: $3x\\cdot 4x=12x^2$, $5\\cdot 2x=10x$.",
                },
              },
              {
                latex: "\\dfrac{ax}{bx}=\\dfrac{a}{b}\\quad (x\\neq 0)",
                label: "(4)",
                accent: "blue",
                caption: "dzielenie wyrazów podobnych",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $\\dfrac{10x}{2x}$ oraz $\\dfrac{12x}{3}$.",
                  steps: [
                    "W $\\dfrac{10x}{2x}$ $x$ w liczniku i mianowniku się skraca: $\\dfrac{10}{2}=5$. Zostaje $5$, **nie** $5x$.",
                    "W $\\dfrac{12x}{3}$ dzielimy tylko liczbę: $12:3=4$. Litera zostaje, więc $4x$.",
                  ],
                  result: "Wynik: $\\dfrac{10x}{2x}=5$, $\\dfrac{12x}{3}=4x$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "definition",
            contentLevel: "podstawowka",
            title: "Wyrazy niepodobne",
            content:
              "Wyrazy są **niepodobne**, gdy mają inną literę, inną potęgę albo jeden ma literę, a drugi nie. $3x$ i $5x^2$ są niepodobne. $2x$ i $7$ są niepodobne. Niepodobnych **nie dodajemy i nie odejmujemy** - zostają obok siebie, np. $2x+5x^2$. Można je za to **mnożyć i dzielić**: liczby osobno, litery osobno.",
            example: {
              prompt: "Czy wolno dodać $2x+5x^2$? A pomnożyć $2x\\cdot 5x^2$?",
              right:
                "Dodać nie: zostaje $2x+5x^2$. Pomnożyć tak: $2\\cdot 5=10$ oraz $x\\cdot x^2=x^3$, więc $10x^3$.",
            },
          },
          {
            type: "formula-list",
            contentLevel: "podstawowka",
            items: [
              {
                latex: "ax\\cdot b=abx,\\quad ax\\cdot bx^2=abx^3",
                accent: "blue",
                caption: "mnożenie wyrazów niepodobnych",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $3x\\cdot 4$ oraz $2x\\cdot 5x^2$.",
                  steps: [
                    "$3x$ i $4$ nie są podobne, ale mnożyć wolno. Liczby: $3\\cdot 4=12$. Litera zostaje, więc $12x$.",
                    "$2x\\cdot 5x^2$: liczby $2\\cdot 5=10$. Litery $x\\cdot x^2=x^3$. Zostaje $10x^3$.",
                    "Gdybyśmy **dodawali** $2x+5x^2$, nie wolno sklejać. Zostaje $2x+5x^2$.",
                  ],
                  result: "Wynik: $3x\\cdot 4=12x$, $2x\\cdot 5x^2=10x^3$.",
                },
              },
              {
                latex: "\\dfrac{ax}{b}=\\dfrac{a}{b}x,\\quad \\dfrac{ax^2}{bx}=\\dfrac{a}{b}x\\quad (x\\neq 0)",
                accent: "blue",
                caption: "dzielenie wyrazów niepodobnych",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Oblicz $\\dfrac{8x}{2}$ oraz $\\dfrac{12x^2}{3x}$.",
                  steps: [
                    "W $\\dfrac{8x}{2}$ dzielimy liczbę: $8:2=4$. Litera zostaje, więc $4x$.",
                    "W $\\dfrac{12x^2}{3x}$ liczby $12:3=4$. Litery $x^2:x=x$. Zostaje $4x$.",
                    "Gdyby w mianowniku nie było $x$, a w liczniku było $x^2$, też dzielimy - tylko potęga $x$ się zmniejsza.",
                  ],
                  result: "Wynik: $\\dfrac{8x}{2}=4x$, $\\dfrac{12x^2}{3x}=4x$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawowka",
            title: "Nie dodawaj wyrazów niepodobnych",
            content:
              "$2x+3$ **nie** jest równe $5x$. $2x$ to dwa $x$, a $3$ to trzy jedynki. To jak $2$ jabłka i $3$ gruszki - nie dostaniesz $5$ jabłek. Zostawiamy $2x+3$. Tak samo $2x+5x^2$ zostaje $2x+5x^2$. Przy mnożeniu wolno: $2x\\cdot 5x^2=10x^3$. Przy dzieleniu też: $\\dfrac{8x^2}{2x}=4x$.",
          },
        ],
      },
      {
        number: "2",
        heading: "Wartość wyrażenia dla $x=\\ldots$",
        contentLevel: "podstawowka",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawowka",
            content:
              "Bierzemy jedno wyrażenie i liczymy je dla konkretnych liczb. Zadanie: oblicz wartość $2x+5$ najpierw dla $x=3$, a potem dla $x=-2$.",
          },
          {
            type: "callout",
            variant: "definition",
            contentLevel: "podstawowka",
            title: "Dla $x=3$",
            content:
              "W $2x+5$ jest jedno $x$. Wstawiamy tam $3$, więc $2x$ staje się $2\\cdot 3$. Zostaje $$2\\cdot 3+5.$$",
          },
          {
            type: "steps",
            contentLevel: "podstawowka",
            items: [
              "Mnożenie przed dodawaniem: $2\\cdot 3=6$.",
              "Potem $6+5=11$.",
              "Dla $x=3$ wartość $2x+5$ wynosi $11$.",
            ],
          },
          {
            type: "formula-list",
            contentLevel: "podstawowka",
            items: [
              {
                latex: "2\\cdot 3+5=11",
                accent: "blue",
                caption: "wartość $2x+5$ dla $x=3$",
                contentLevel: "podstawowka",
              },
            ],
          },
          {
            type: "callout",
            variant: "definition",
            contentLevel: "podstawowka",
            title: "Dla $x=-2$",
            content:
              "Teraz to samo wyrażenie, ale $x$ jest ujemne. Ujemną liczbę wstawiamy **w nawiasie**, żeby minus nie pomylił się z odejmowaniem: $2x$ staje się $2\\cdot(-2)$. Zostaje $$2\\cdot(-2)+5.$$",
          },
          {
            type: "steps",
            contentLevel: "podstawowka",
            items: [
              "Mnożenie: $2\\cdot(-2)=-4$.",
              "Potem $-4+5=1$.",
              "Dla $x=-2$ wartość $2x+5$ wynosi $1$.",
            ],
          },
          {
            type: "formula-list",
            contentLevel: "podstawowka",
            items: [
              {
                latex: "2\\cdot(-2)+5=1",
                accent: "blue",
                caption: "wartość $2x+5$ dla $x=-2$",
                contentLevel: "podstawowka",
              },
            ],
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawowka",
            title: "Bez nawiasu minus zjada mnożenie",
            content:
              "Gdybyśmy dla $x=-2$ napisali $2-2+5$ zamiast $2\\cdot(-2)+5$, wyszłoby $5$. To zły wynik. $2x$ znaczy **dwa razy $x$**, więc $2\\cdot(-2)=-4$, a nie $2-2$.",
          },
        ],
      },
      {
        number: "3",
        heading: "Mnożenie nawiasów",
        contentLevel: "podstawowka",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawowka",
            content:
              "Gdy mnożymy przez nawias, **każdy** składnik z zewnątrz mnożymy przez **każdy** składnik w nawiasie. Potem dodajemy wyrazy podobne.",
          },
          {
            type: "formula-list",
            contentLevel: "podstawowka",
            items: [
              {
                latex: "a(b+c)=ab+ac",
                label: "(5)",
                accent: "blue",
                caption: "liczba razy suma",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Pomnóż $4(x+3)$.",
                  steps: [
                    "Czwórka wchodzi do nawiasu i mnoży oba składniki: $$4\\cdot x+4\\cdot 3.$$",
                    "$4\\cdot x=4x$ i $4\\cdot 3=12$.",
                    "Zostaje $4x+12$.",
                  ],
                  result: "Wynik: $4(x+3)=4x+12$.",
                },
              },
              {
                latex: "a(b-c)=ab-ac",
                label: "(6)",
                accent: "blue",
                caption: "liczba razy różnica",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Pomnóż $5(2x-1)$.",
                  steps: [
                    "Piątka mnoży oba składniki: $$5\\cdot 2x-5\\cdot 1.$$",
                    "$5\\cdot 2x=10x$ i $5\\cdot 1=5$.",
                    "Zostaje $10x-5$.",
                  ],
                  result: "Wynik: $5(2x-1)=10x-5$.",
                },
              },
              {
                latex: "(a+b)(c+d)=ac+ad+bc+bd",
                label: "(7)",
                accent: "blue",
                caption: "nawias razy nawias - każdy z każdym",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Pomnóż $(x+2)(x+5)$.",
                  steps: [
                    "Pierwsze $x$ mnożymy przez cały drugi nawias: $x\\cdot x+x\\cdot 5=x^2+5x$.",
                    "Potem dwójka mnoży cały drugi nawias: $2\\cdot x+2\\cdot 5=2x+10$.",
                    "Składamy: $$x^2+5x+2x+10.$$",
                    "Wyrazy podobne: $5x+2x=7x$. Zostaje $x^2+7x+10$.",
                  ],
                  result: "Wynik: $(x+2)(x+5)=x^2+7x+10$.",
                },
              },
              {
                latex: "(a+b)(a+b)=a^2+2ab+b^2",
                label: "(8)",
                accent: "blue",
                caption: "ten sam nawias razy siebie",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Pomnóż $(x+3)(x+3)$.",
                  steps: [
                    "To wzór (7) z $a=x$ i $b=3$. Każdy z każdym: $$x\\cdot x+x\\cdot 3+3\\cdot x+3\\cdot 3.$$",
                    "Dostajemy $x^2+3x+3x+9$.",
                    "Wyrazy podobne: $3x+3x=6x$. Zostaje $x^2+6x+9$.",
                    "To samo ze wzoru (8): $x^2+2\\cdot x\\cdot 3+3^2=x^2+6x+9$.",
                  ],
                  result: "Wynik: $(x+3)(x+3)=x^2+6x+9$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "insight",
            contentLevel: "podstawowka",
            title: "W drugą stronę - wyłączanie przed nawias",
            content:
              "Mnożenie można odwrócić. W $6x+9$ oba wyrazy dzielą się przez $3$, więc $6x+9=3(2x+3)$. Sprawdzenie ze wzoru (5): $3(2x+3)=6x+9$.",
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawowka",
            title: "Dwójka musi wejść do obu składników",
            content:
              "$2(x+3)$ **nie** jest równe $2x+3$. Dwójka mnoży też trójkę: $2(x+3)=2x+6$. Zapomniany składnik to najczęstszy błąd.",
          },
        ],
      },
      {
        number: "4",
        heading: "Pola i obwody",
        contentLevel: "podstawowka",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawowka",
            content:
              "Bok może być wyrażeniem, np. $x$ albo $x+3$. Pole i obwód zapisujemy najpierw **wzorem**, potem w razie potrzeby podstawiamy liczbę za $x$.",
          },
          {
            type: "formula-list",
            contentLevel: "podstawowka",
            items: [
              {
                latex: "P=a\\cdot b,\\quad Obw=2a+2b",
                label: "(9)",
                accent: "blue",
                caption: "prostokąt o bokach $a$ i $b$",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Prostokąt ma boki $x$ i $x+3$. Zapisz pole i obwód. Oblicz dla $x=5$. Drugi prostokąt ma boki $3$ i $2x$ oraz obwód $22$. Znajdź $x$.",
                  steps: [
                    {
                      text: "Rysujemy pierwszy prostokąt i podpisujemy boki.",
                      figure: {
                        scale: 26,
                        parts: [{ x: 0, y: 0, w: 5, h: 3.2 }],
                        labels: [
                          { x: 2.5, y: -0.45, text: "$x$" },
                          { x: -0.75, y: 1.6, text: "$x+3$" },
                        ],
                        caption: "Boki $x$ oraz $x+3$.",
                      },
                    },
                    "Ze wzoru (9) pole: $P=x\\cdot(x+3)$. Ze wzoru (5): $x(x+3)=x^2+3x$.",
                    "Obwód zapisujemy jako $2a+2b$: $$Obw=2\\cdot x+2\\cdot(x+3).$$",
                    "Dwójka wchodzi do nawiasu: $2x+2x+6=4x+6$.",
                    {
                      text: "Dla $x=5$ boki mają $5$ i $8$. Pole: $5\\cdot 8=40$. Obwód: $2\\cdot 5+2\\cdot 8=26$.",
                      figure: {
                        scale: 26,
                        parts: [{ x: 0, y: 0, w: 5, h: 3.2 }],
                        labels: [
                          { x: 2.5, y: -0.45, text: "$5$" },
                          { x: -0.45, y: 1.6, text: "$8$" },
                        ],
                        caption: "Po podstawieniu $x=5$.",
                      },
                    },
                    {
                      text: "Drugi prostokąt ma boki $3$ i $2x$. Obwód: $2\\cdot 3+2\\cdot 2x=6+4x$.",
                      figure: {
                        scale: 26,
                        parts: [{ x: 0, y: 0, w: 2.6, h: 4 }],
                        labels: [
                          { x: 1.3, y: -0.45, text: "$3$" },
                          { x: -0.6, y: 2, text: "$2x$" },
                        ],
                        caption: "Boki $3$ oraz $2x$.",
                      },
                    },
                    "Ten obwód wynosi $22$, więc $6+4x=22$. Stąd $4x=16$ i $x=4$.",
                  ],
                  result: "Wynik: $P=x^2+3x$, $Obw=4x+6$. Dla $x=5$: $P=40$, $Obw=26$. W drugim zadaniu $x=4$.",
                },
              },
              {
                latex: "P=a^2,\\quad Obw=4a",
                label: "(10)",
                accent: "blue",
                caption: "kwadrat o boku $a$",
                contentLevel: "podstawowka",
                example: {
                  level: "ósmoklasisty",
                  prompt: "Kwadrat ma bok $x+1$. Zapisz pole i obwód. Oblicz dla $x=4$.",
                  steps: [
                    {
                      text: "Rysujemy kwadrat i podpisujemy bok $x+1$.",
                      figure: {
                        scale: 26,
                        parts: [{ x: 0, y: 0, w: 3.4, h: 3.4 }],
                        labels: [
                          { x: 1.7, y: -0.45, text: "$x+1$" },
                          { x: -0.75, y: 1.7, text: "$x+1$" },
                        ],
                      },
                    },
                    "Ze wzoru (10) pole: $P=(x+1)^2$. Ze wzoru (8): $(x+1)^2=x^2+2x+1$.",
                    "Obwód: $Obw=4(x+1)=4x+4$.",
                    {
                      text: "Dla $x=4$ bok ma długość $5$. Pole: $5^2=25$. Obwód: $4\\cdot 5=20$.",
                      figure: {
                        scale: 26,
                        parts: [{ x: 0, y: 0, w: 3.4, h: 3.4 }],
                        labels: [
                          { x: 1.7, y: -0.45, text: "$5$" },
                          { x: -0.4, y: 1.7, text: "$5$" },
                        ],
                        caption: "Po podstawieniu $x=4$.",
                      },
                    },
                  ],
                  result: "Wynik: $P=x^2+2x+1$, $Obw=4x+4$. Dla $x=4$: $P=25$, $Obw=20$.",
                },
              },
            ],
          },
          {
            type: "text",
            contentLevel: "podstawowka",
            content:
              "Gdy figura składa się z kilku prostokątów, pole to **suma pól** kawałków. Przy obwodzie liczymy tylko krawędzie na zewnątrz - wewnętrznej krawędzi, którą sklejamy, nie dodajemy. Kliknij kafelek z figurą, żeby zobaczyć pole i obwód.",
          },
          {
            type: "rect-figure",
            contentLevel: "podstawowka",
            scale: 30,
            parts: [
              { x: 0, y: 0, w: 4, h: 3 },
              { x: 4, y: 0, w: 3, h: 3 },
            ],
            labels: [
              { x: 2, y: -0.45, text: "$x$" },
              { x: 5.5, y: -0.45, text: "$5$" },
              { x: -0.55, y: 1.5, text: "$x+1$" },
            ],
            caption:
              "Dwa prostokąty sklejone bokiem. Lewy ma boki $x$ i $x+1$, prawy $5$ i $x+1$.",
            example: {
              level: "ósmoklasisty",
              prompt: "Zapisz pole i obwód figury. Potem oblicz dla $x=3$.",
              steps: [
                {
                  text: "Dzielimy figurę na dwa prostokąty. Lewy: $P_1=x\\cdot(x+1)=x^2+x$. Prawy: $P_2=5\\cdot(x+1)=5x+5$.",
                  figure: {
                    scale: 24,
                    parts: [
                      { x: 0, y: 0, w: 4, h: 3 },
                      { x: 4, y: 0, w: 3, h: 3 },
                    ],
                    labels: [
                      { x: 2, y: -0.45, text: "$x$" },
                      { x: 5.5, y: -0.45, text: "$5$" },
                      { x: -0.7, y: 1.5, text: "$x+1$" },
                      { x: 2, y: 1.5, text: "$P_1$" },
                      { x: 5.5, y: 1.5, text: "$P_2$" },
                    ],
                    caption: "Pole to $P_1+P_2$.",
                  },
                },
                "Pole całości: $P=x^2+x+5x+5=x^2+6x+5$.",
                {
                  text: "Przy obwodzie sklejona krawędź chowa się w środku. Całość to jeden prostokąt $x+5$ na $x+1$. Ze wzoru (9): $Obw=2(x+5)+2(x+1)=4x+12$.",
                  figure: {
                    scale: 24,
                    parts: [{ x: 0, y: 0, w: 7, h: 3 }],
                    labels: [
                      { x: 3.5, y: -0.45, text: "$x+5$" },
                      { x: -0.7, y: 1.5, text: "$x+1$" },
                    ],
                    caption: "Obwód liczymy po zewnątrz.",
                  },
                },
                "Dla $x=3$ pole: $3^2+6\\cdot 3+5=9+18+5=32$. Obwód: $4\\cdot 3+12=24$.",
                "Kontrola: boki $8$ i $4$, więc $P=32$ i $Obw=2\\cdot 8+2\\cdot 4=16+8=24$.",
              ],
              result: "Wynik: $P=x^2+6x+5$, $Obw=4x+12$. Dla $x=3$: $P=32$, $Obw=24$.",
            },
          },
          {
            type: "rect-figure",
            contentLevel: "podstawowka",
            scale: 26,
            parts: [
              { x: 0, y: 0, w: 7, h: 2.2 },
              { x: 0, y: 2.2, w: 2.8, h: 3.5 },
            ],
            outline: [
              { x: 0, y: 0 },
              { x: 7, y: 0 },
              { x: 7, y: 2.2 },
              { x: 2.8, y: 2.2 },
              { x: 2.8, y: 5.7 },
              { x: 0, y: 5.7 },
            ],
            labels: [
              { x: 3.5, y: -0.45, text: "$x+6$" },
              { x: 7.55, y: 1.1, text: "$2$" },
              { x: 4.9, y: 2.55, text: "$x+2$" },
              { x: 3.2, y: 3.95, text: "$x$" },
              { x: 1.4, y: 6.0, text: "$4$" },
              { x: -0.7, y: 2.85, text: "$x+2$" },
            ],
            caption:
              "Figura w kształcie litery L. Górny prostokąt ma boki $x+6$ i $2$. Dolny - boki $4$ i $x$.",
            example: {
              level: "ósmoklasisty",
              prompt: "Zapisz pole i obwód figury L. Oblicz dla $x=4$.",
              steps: [
                {
                  text: "Dzielimy L na dwa prostokąty. Górny: $P_1=2\\cdot(x+6)=2x+12$. Dolny: $P_2=4\\cdot x=4x$.",
                  figure: {
                    scale: 20,
                    parts: [
                      { x: 0, y: 0, w: 7, h: 2.2 },
                      { x: 0, y: 2.2, w: 2.8, h: 3.5 },
                    ],
                    labels: [
                      { x: 3.5, y: -0.45, text: "$x+6$" },
                      { x: 7.55, y: 1.1, text: "$2$" },
                      { x: 1.4, y: 6.0, text: "$4$" },
                      { x: -0.55, y: 4.0, text: "$x$" },
                      { x: 3.5, y: 1.1, text: "$P_1$" },
                      { x: 1.4, y: 3.95, text: "$P_2$" },
                    ],
                    caption: "Kreska w środku pokazuje podział na pole.",
                  },
                },
                "Pole: $P=2x+12+4x=6x+12$.",
                {
                  text: "Obwód obchodzimy dookoła, bez krawędzi w środku: $$(x+6)+2+(x+2)+x+4+(x+2)=4x+16.$$",
                  figure: {
                    scale: 20,
                    parts: [
                      { x: 0, y: 0, w: 7, h: 2.2 },
                      { x: 0, y: 2.2, w: 2.8, h: 3.5 },
                    ],
                    outline: [
                      { x: 0, y: 0 },
                      { x: 7, y: 0 },
                      { x: 7, y: 2.2 },
                      { x: 2.8, y: 2.2 },
                      { x: 2.8, y: 5.7 },
                      { x: 0, y: 5.7 },
                    ],
                    labels: [
                      { x: 3.5, y: -0.45, text: "$x+6$" },
                      { x: 7.55, y: 1.1, text: "$2$" },
                      { x: 4.9, y: 2.55, text: "$x+2$" },
                      { x: 3.2, y: 3.95, text: "$x$" },
                      { x: 1.4, y: 6.0, text: "$4$" },
                      { x: -0.7, y: 2.85, text: "$x+2$" },
                    ],
                    caption: "Liczymy tylko krawędzie na zewnątrz.",
                  },
                },
                "Dla $x=4$ pole: $6\\cdot 4+12=36$. Obwód: $4\\cdot 4+16=32$.",
              ],
              result: "Wynik: $P=6x+12$, $Obw=4x+16$. Dla $x=4$: $P=36$, $Obw=32$.",
            },
          },
        ],
      },
      {
        number: "5",
        heading: "Przykłady",
        contentLevel: "podstawowka",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawowka",
            content:
              "Poniżej zadania od początku do końca. Rozwiązanie jest schowane - kliknij, żeby je zobaczyć.",
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 1",
            prompt: "Uprość $8x-3+2x+10$.",
            steps: [
              "Wyrazy z $x$: $8x+2x=10x$.",
              "Liczby: $-3+10=7$.",
              "Zostaje $10x+7$.",
            ],
            result: "$10x+7$",
            cleanSolution: ["$8x+2x-3+10=10x+7$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 2",
            prompt: "Oblicz wartość $2x^2-3x+1$ dla $x=4$.",
            steps: [
              "Wstawiamy $4$ w miejsce $x$: $$2\\cdot 4^2-3\\cdot 4+1.$$",
              "Potęga: $4^2=16$, więc $2\\cdot 16=32$.",
              "Mnożenie: $3\\cdot 4=12$.",
              "Na końcu: $32-12+1=21$.",
            ],
            result: "$21$",
            cleanSolution: ["$2\\cdot 4^2-3\\cdot 4+1=32-12+1=21$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 3",
            prompt: "Oblicz wartość $5x-1$ dla $x=-3$.",
            steps: [
              "Liczba ujemna idzie w nawias: $$5\\cdot(-3)-1.$$",
              "$5\\cdot(-3)=-15$.",
              "Dalej $-15-1=-16$.",
            ],
            result: "$-16$",
            cleanSolution: ["$5\\cdot(-3)-1=-16$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 4",
            prompt: "Pomnóż $3(2x-5)$ oraz $(x+1)(x+4)$.",
            steps: [
              "Ze wzoru (6): $3(2x-5)=3\\cdot 2x-3\\cdot 5=6x-15$.",
              "Ze wzoru (7) każdy z każdym: $(x+1)(x+4)=x\\cdot x+x\\cdot 4+1\\cdot x+1\\cdot 4$.",
              "Dostajemy $x^2+4x+x+4$.",
              "Wyrazy podobne: $4x+x=5x$. Zostaje $x^2+5x+4$.",
            ],
            result: "$6x-15$ oraz $x^2+5x+4$",
            cleanSolution: ["$3(2x-5)=6x-15$", "$(x+1)(x+4)=x^2+5x+4$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 5",
            prompt: "Prostokąt ma boki $x+2$ i $x+6$. Zapisz pole. Oblicz pole dla $x=2$.",
            figure: {
              scale: 24,
              parts: [{ x: 0, y: 0, w: 5.6, h: 3.2 }],
              labels: [
                { x: 2.8, y: -0.45, text: "$x+6$" },
                { x: -0.75, y: 1.6, text: "$x+2$" },
              ],
            },
            steps: [
              "Ze wzoru (9): $P=(x+2)(x+6)$.",
              "Ze wzoru (7): $(x+2)(x+6)=x^2+6x+2x+12=x^2+8x+12$.",
              {
                text: "Dla $x=2$ boki mają $4$ i $8$, więc $P=4\\cdot 8=32$. Ze wzoru: $2^2+8\\cdot 2+12=4+16+12=32$.",
                figure: {
                  scale: 24,
                  parts: [{ x: 0, y: 0, w: 5.6, h: 3.2 }],
                  labels: [
                    { x: 2.8, y: -0.45, text: "$8$" },
                    { x: -0.4, y: 1.6, text: "$4$" },
                  ],
                  caption: "Po podstawieniu $x=2$.",
                },
              },
            ],
            result: "$P=x^2+8x+12$. Dla $x=2$: $P=32$",
            cleanSolution: ["$P=(x+2)(x+6)=x^2+8x+12$", "$x=2\\Rightarrow P=32$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 6",
            prompt:
              "Figura L z sekcji 4 ma pole $P=6x+12$ i obwód $Obw=4x+16$. Oblicz pole i obwód dla $x=5$.",
            figure: {
              scale: 20,
              parts: [
                { x: 0, y: 0, w: 7, h: 2.2 },
                { x: 0, y: 2.2, w: 2.8, h: 3.5 },
              ],
              outline: [
                { x: 0, y: 0 },
                { x: 7, y: 0 },
                { x: 7, y: 2.2 },
                { x: 2.8, y: 2.2 },
                { x: 2.8, y: 5.7 },
                { x: 0, y: 5.7 },
              ],
              labels: [
                { x: 3.5, y: -0.45, text: "$x+6$" },
                { x: 7.55, y: 1.1, text: "$2$" },
                { x: 4.9, y: 2.55, text: "$x+2$" },
                { x: 3.2, y: 3.95, text: "$x$" },
                { x: 1.4, y: 6.0, text: "$4$" },
                { x: -0.7, y: 2.85, text: "$x+2$" },
              ],
            },
            steps: [
              {
                text: "Wstawiamy $x=5$ do wzoru na pole: $6\\cdot 5+12=30+12=42$.",
                figure: {
                  scale: 20,
                  parts: [
                    { x: 0, y: 0, w: 7, h: 2.2 },
                    { x: 0, y: 2.2, w: 2.8, h: 3.5 },
                  ],
                  labels: [
                    { x: 3.5, y: -0.45, text: "$11$" },
                    { x: 7.55, y: 1.1, text: "$2$" },
                    { x: 1.4, y: 6.0, text: "$4$" },
                    { x: -0.45, y: 4.0, text: "$5$" },
                    { x: 3.5, y: 1.1, text: "$P_1$" },
                    { x: 1.4, y: 3.95, text: "$P_2$" },
                  ],
                  caption: "Góra $2\\cdot 11=22$, dół $4\\cdot 5=20$, razem $42$.",
                },
              },
              "Wstawiamy $x=5$ do wzoru na obwód: $4\\cdot 5+16=20+16=36$.",
            ],
            result: "$P=42$, $Obw=36$",
            cleanSolution: ["$P=6\\cdot 5+12=42$", "$Obw=4\\cdot 5+16=36$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 7",
            prompt: "Uprość $3x\\cdot 4x+\\dfrac{18x}{6x}$. Potem oblicz wartość dla $x=2$.",
            steps: [
              "Ze wzoru (3): $3x\\cdot 4x=12x^2$.",
              "Ze wzoru (4): $\\dfrac{18x}{6x}=\\dfrac{18}{6}=3$.",
              "Całość: $12x^2+3$.",
              "Dla $x=2$: $12\\cdot 2^2+3=12\\cdot 4+3=48+3=51$.",
            ],
            result: "$12x^2+3$. Dla $x=2$: $51$",
            cleanSolution: ["$3x\\cdot 4x+\\dfrac{18x}{6x}=12x^2+3$", "$x=2\\Rightarrow 51$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 8",
            prompt: "Prostokąt ma boki $x+3$ i $2x$. Jego obwód wynosi $30$. Znajdź $x$, a potem pole.",
            figure: {
              scale: 24,
              parts: [{ x: 0, y: 0, w: 4.8, h: 3.6 }],
              labels: [
                { x: 2.4, y: -0.45, text: "$x+3$" },
                { x: -0.55, y: 1.8, text: "$2x$" },
              ],
            },
            steps: [
              "Ze wzoru (9): $Obw=2a+2b=2(x+3)+2\\cdot 2x$.",
              "Liczymy: $2x+6+4x=6x+6$.",
              "Obwód to $30$, więc $6x+6=30$. Stąd $6x=24$ i $x=4$.",
              {
                text: "Boki mają wtedy długości $7$ i $8$. Pole: $P=7\\cdot 8=56$.",
                figure: {
                  scale: 24,
                  parts: [{ x: 0, y: 0, w: 4.8, h: 3.6 }],
                  labels: [
                    { x: 2.4, y: -0.45, text: "$7$" },
                    { x: -0.4, y: 1.8, text: "$8$" },
                  ],
                  caption: "Po znalezieniu $x=4$.",
                },
              },
              "Ze wzoru: $P=(x+3)\\cdot 2x=2x(x+3)=2x^2+6x$. Dla $x=4$: $2\\cdot 16+24=56$.",
            ],
            result: "$x=4$, $P=56$",
            cleanSolution: ["$2(x+3)+4x=6x+6=30\\Rightarrow x=4$", "$P=7\\cdot 8=56$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 9",
            prompt:
              "Obwód figury L z sekcji 4 wynosi $40$. Znajdź $x$, a potem pole tej figury.",
            figure: {
              scale: 20,
              parts: [
                { x: 0, y: 0, w: 7, h: 2.2 },
                { x: 0, y: 2.2, w: 2.8, h: 3.5 },
              ],
              outline: [
                { x: 0, y: 0 },
                { x: 7, y: 0 },
                { x: 7, y: 2.2 },
                { x: 2.8, y: 2.2 },
                { x: 2.8, y: 5.7 },
                { x: 0, y: 5.7 },
              ],
              labels: [
                { x: 3.5, y: -0.45, text: "$x+6$" },
                { x: 7.55, y: 1.1, text: "$2$" },
                { x: 4.9, y: 2.55, text: "$x+2$" },
                { x: 3.2, y: 3.95, text: "$x$" },
                { x: 1.4, y: 6.0, text: "$4$" },
                { x: -0.7, y: 2.85, text: "$x+2$" },
              ],
              caption: "$Obw=4x+16=40$.",
            },
            steps: [
              "Z kafelka z figurą L wiemy, że $Obw=4x+16$.",
              "Zatem $4x+16=40$. Odejmujemy $16$: $4x=24$, więc $x=6$.",
              {
                text: "Pole było $P=6x+12$, więc $P=6\\cdot 6+12=36+12=48$.",
                figure: {
                  scale: 20,
                  parts: [
                    { x: 0, y: 0, w: 7, h: 2.2 },
                    { x: 0, y: 2.2, w: 2.8, h: 3.5 },
                  ],
                  labels: [
                    { x: 3.5, y: -0.45, text: "$12$" },
                    { x: 7.55, y: 1.1, text: "$2$" },
                    { x: 1.4, y: 6.0, text: "$4$" },
                    { x: -0.45, y: 4.0, text: "$6$" },
                    { x: 3.5, y: 1.1, text: "$P_1$" },
                    { x: 1.4, y: 3.95, text: "$P_2$" },
                  ],
                  caption: "Góra $2\\cdot 12=24$, dół $4\\cdot 6=24$, razem $48$.",
                },
              },
            ],
            result: "$x=6$, $P=48$",
            cleanSolution: ["$4x+16=40\\Rightarrow x=6$", "$P=6\\cdot 6+12=48$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 10",
            prompt:
              "Prostokąt ma boki $2x$ i $x+4$. Z jednego rogu wycinamy kwadrat o boku $2$. Zapisz pole pozostałej figury i oblicz je dla $x=5$.",
            figure: {
              scale: 24,
              parts: [
                { x: 0, y: 0, w: 6, h: 4.2 },
                { x: 4, y: 0, w: 2, h: 2, cut: true },
              ],
              labels: [
                { x: 3, y: 4.65, text: "$2x$" },
                { x: -0.7, y: 2.1, text: "$x+4$" },
                { x: 5, y: -0.45, text: "$2$" },
                { x: 6.5, y: 1, text: "$2$" },
              ],
              caption: "Kreskowany kwadrat wycinamy.",
            },
            steps: [
              {
                text: "Najpierw pole całego prostokąta, jeszcze bez wycinania: $P_1=2x\\cdot(x+4)=2x^2+8x$.",
                figure: {
                  scale: 24,
                  parts: [{ x: 0, y: 0, w: 6, h: 4.2 }],
                  labels: [
                    { x: 3, y: 4.65, text: "$2x$" },
                    { x: -0.7, y: 2.1, text: "$x+4$" },
                  ],
                  caption: "Duży prostokąt.",
                },
              },
              {
                text: "Wycięty kwadrat ma bok $2$, więc $P_2=2^2=4$.",
                figure: {
                  scale: 24,
                  parts: [
                    { x: 0, y: 0, w: 6, h: 4.2, dim: true },
                    { x: 4, y: 0, w: 2, h: 2, cut: true },
                  ],
                  labels: [
                    { x: 5, y: -0.45, text: "$2$" },
                    { x: 6.5, y: 1, text: "$2$" },
                  ],
                  caption: "To odejmujemy.",
                },
              },
              {
                text: "Zostaje $P=2x^2+8x-4$.",
                figure: {
                  scale: 24,
                  parts: [
                    { x: 0, y: 0, w: 6, h: 4.2 },
                    { x: 4, y: 0, w: 2, h: 2, cut: true },
                  ],
                  outline: [
                    { x: 0, y: 0 },
                    { x: 4, y: 0 },
                    { x: 4, y: 2 },
                    { x: 6, y: 2 },
                    { x: 6, y: 4.2 },
                    { x: 0, y: 4.2 },
                  ],
                  labels: [
                    { x: 2, y: -0.45, text: "$2x-2$" },
                    { x: -0.7, y: 2.1, text: "$x+4$" },
                  ],
                  caption: "Pozostała figura.",
                },
              },
              "Dla $x=5$: $2\\cdot 25+8\\cdot 5-4=50+40-4=86$.",
              "Kontrola: prostokąt $10$ na $9$ ma pole $90$, minus kwadrat $4$ daje $86$.",
            ],
            result: "$P=2x^2+8x-4$. Dla $x=5$: $P=86$",
            cleanSolution: ["$P=2x(x+4)-4=2x^2+8x-4$", "$x=5\\Rightarrow P=86$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawowka",
            title: "Przykład 11",
            prompt: "Uprość $2x\\cdot 5x^2+\\dfrac{12x^2}{3x}$. Czy wolno dodać $2x+5x^2$?",
            steps: [
              "$2x$ i $5x^2$ są niepodobne, ale mnożyć wolno: $2\\cdot 5=10$ oraz $x\\cdot x^2=x^3$, więc $10x^3$.",
              "Dzielenie niepodobnych: $\\dfrac{12x^2}{3x}=4x$.",
              "Całość: $10x^3+4x$. Tego już nie sklejamy, bo $x^3$ i $x$ nie są podobne.",
              "Dodać $2x+5x^2$ **nie wolno**. Zostaje $2x+5x^2$.",
            ],
            result: "$10x^3+4x$. $2x+5x^2$ zostaje bez zmian",
            cleanSolution: ["$2x\\cdot 5x^2+\\dfrac{12x^2}{3x}=10x^3+4x$", "$2x+5x^2$ nie dodajemy"],
          },
        ],
      },
      {
        number: "",
        heading: "Poziom podstawowy",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "callout",
            variant: "insight",
            contentLevel: "podstawa",
            title: "W przygotowaniu",
            content: "Ten poziom notatki jest jeszcze w przygotowaniu.",
          },
        ],
      },
      {
        number: "",
        heading: "Poziom rozszerzony",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "callout",
            variant: "insight",
            contentLevel: "rozszerzenie",
            title: "W przygotowaniu",
            content: "Ten poziom notatki jest jeszcze w przygotowaniu.",
          },
        ],
      },
    ],
  },
  {
    id: "artykul-logarytmy",
    title: "Logarytmy",
    unavailable: true,
    description:
      "Definicja logarytmu, najważniejsze wzory i typowe zadania. Poziom podstawowy i rozszerzony.",
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
              "Wzór (1) - **definicja**: $\\log_a b=c$ wtedy i tylko wtedy, gdy $a^c=b$.",
              "Wzór (2) - **tożsamość równoważna**: $a^{\\log_a b}=b$.",
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
              "(3) - **logarytm iloczynu**: $\\log_a(xy)=\\log_a x+\\log_a y$",
              "(4) - **logarytm potęgi**: $\\log_a x^r=r\\log_a x$",
              "(5) - **potęga w podstawie**: $\\log_{a^r} b=\\dfrac{1}{r}\\log_a b$",
              "(6) - **logarytm ilorazu**: $\\log_a\\dfrac{x}{y}=\\log_a x-\\log_a y$",
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
            title: "Częsty błąd - kolejność przy różnicy",
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
            title: "Częsty błąd - współczynniki przy sumie i różnicy",
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
              "Jeśli masz $2\\log_a x+\\log_a y$ - najpierw wzór (4): $2\\log_a x=\\log_a x^2$.",
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
              "(7) - **zmiana podstawy**: $\\log_b c=\\dfrac{\\log_a c}{\\log_a b}$",
              "(8) - **szczególny przypadek**: $\\log_a b=\\dfrac{1}{\\log_b a}$",
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
              "Gdy wynik $\\log_a b$ nie jest oczywisty „na oko” - **nie zgaduj**. Przejdź na równanie wykładnicze z definicji (1).",
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
            content: "**Schemat rozwiązania** - zawsze ten sam:",
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
            title: "Częsty błąd - mieszanie podstaw",
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
                  { key: "A", text: "I - P, II - P" },
                  { key: "B", text: "I - P, II - F" },
                  { key: "C", text: "I - F, II - P" },
                  { key: "D", text: "I - F, II - F" },
                ],
                hints: [
                  "I: sprawdź wzór (3) - suma daje logarytm iloczynu.",
                  "II: sprawdź wzór (6) - różnica daje $\\log_2\\dfrac{6}{3}=\\log_2 2$.",
                ],
                answer: "B. I - P, II - F",
                explanation: [
                  "I: $\\log_2 3+\\log_2 6=\\log_2(3\\cdot 6)=\\log_2 18$ - prawda.",
                  "II: $\\log_2 6-\\log_2 3=\\log_2\\dfrac{6}{3}=\\log_2 2=1$, a nie $\\log_2 3$ - fałsz.",
                ],
                cleanSolution: [
                  "I: $\\log_2 3+\\log_2 6=\\log_2 18$ - P",
                  "II: $\\log_2 6-\\log_2 3=\\log_2 2\\neq\\log_2 3$ - F",
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
                  { key: "A", text: "I - P, II - P" },
                  { key: "B", text: "I - P, II - F" },
                  { key: "C", text: "I - F, II - P" },
                  { key: "D", text: "I - F, II - F" },
                ],
                hints: [
                  "I: zastosuj wzór (4) - współczynnik wchodzi do wykładnika.",
                  "II: uwaga na pułapkę - sumy liczby i logarytmu nie zamieniasz na logarytm iloczynu wprost.",
                ],
                answer: "B. I - P, II - F",
                explanation: [
                  "I: $3\\log_5 2=\\log_5 2^3=\\log_5 8$ - prawda.",
                  "II: $3+\\log_5 2=\\log_5 5^3+\\log_5 2=\\log_5(125\\cdot 2)=\\log_5 250\\neq\\log_5 6$ - fałsz.",
                ],
                cleanSolution: [
                  "I: $3\\log_5 2=\\log_5 8$ - P",
                  "II: $3+\\log_5 2=\\log_5 250\\neq\\log_5 6$ - F",
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
                  { key: "A", text: "I - P, II - P" },
                  { key: "B", text: "I - P, II - F" },
                  { key: "C", text: "I - F, II - P" },
                  { key: "D", text: "I - F, II - F" },
                ],
                hints: [
                  "I: skorzystaj z łańcucha $\\log_a b\\cdot\\log_b c=\\log_a c$.",
                  "II: zapisz $25=5^2$ w mianowniku.",
                ],
                answer: "A. I - P, II - P",
                explanation: [
                  "I: $\\log_3 4\\cdot\\log_4 9=\\log_3 9=2$ - prawda.",
                  "II: $\\dfrac{\\log_2 5}{\\log_2 25}=\\dfrac{\\log_2 5}{2\\log_2 5}=\\dfrac{1}{2}$ - prawda.",
                ],
                cleanSolution: [
                  "I: $\\log_3 4\\cdot\\log_4 9=\\log_3 9=2$ - P",
                  "II: $\\dfrac{\\log_2 5}{\\log_2 25}=\\dfrac{1}{2}$ - P",
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
                  { key: "A", text: "I - P, II - P" },
                  { key: "B", text: "I - P, II - F" },
                  { key: "C", text: "I - F, II - P" },
                  { key: "D", text: "I - F, II - F" },
                ],
                hints: [
                  "I: sprawdź wzór (4) - współczynnik wchodzi do wykładnika.",
                  "II: z wzoru (5) byłoby $\\dfrac{1}{2}\\log_4 5=\\log_{16} 5$, nie $\\log_8 5$.",
                ],
                answer: "B. I - P, II - F",
                explanation: [
                  "I: $2\\log_7 3=\\log_7 3^2=\\log_7 9$ - prawda.",
                  "II: $\\dfrac{1}{2}\\log_4 5=\\log_{4^2} 5=\\log_{16} 5\\neq\\log_8 5$ - fałsz.",
                ],
                cleanSolution: [
                  "I: $2\\log_7 3=\\log_7 9$ - P",
                  "II: $\\dfrac{1}{2}\\log_4 5=\\log_{16} 5\\neq\\log_8 5$ - F",
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
            content: "**Własności** - przy tej samej podstawie:",
          },
          {
            type: "list",
            items: [
              "(3) - **iloczyn** → suma",
              "(6) - **iloraz** → różnica",
              "(4) - **potęga w argumencie** wychodzi przed logarytm",
              "(5) - **potęga w podstawie** daje czynnik $\\dfrac{1}{r}$",
              "Na rozszerzeniu: zmiana podstawy (7) oraz odwrotność (8)",
            ],
          },
          {
            type: "text",
            content: "**Schemat obliczania** - gdy wynik nie jest oczywisty:",
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
            title: "Częsty błąd - kolejność w ilorazie",
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
            title: "Częsty błąd - współczynniki przy sumie i różnicy",
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
            title: "Częsty błąd - skomplikowane logarytmy",
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
            title: "Częsty błąd - dziedzina",
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
            title: "Niuans - podstawa z przedziału $(0,1)$",
            content:
              "Jeśli **$0<a<1$**, funkcja $\\log_a$ jest **malejąca**, a wynik może być ujemny. Kontroluj przez definicję $a^c=b$.",
          },
          {
            type: "callout",
            variant: "why",
            title: "Niuans - zmiana podstawy",
            contentLevel: "rozszerzenie",
            content:
              "Wzór (7) przelicza logarytm na wygodniejszą podstawę. Wzór (8): **$\\log_a b=\\dfrac{1}{\\log_b a}$**. Przydatne przy różnych podstawach lub $\\log_b a\\cdot\\log_a b=1$.",
          },
          {
            type: "callout",
            variant: "why",
            title: "Niuans - co wolno wyciągać przed logarytm",
            content:
              "Przed logarytm wychodzi **wykładnik argumentu** (4). Potęgę w podstawie obsługuje (5): $\\log_{a^r} b=\\dfrac{1}{r}\\log_a b$. Nie dzielisz logarytmów jak zwykłych liczb.",
          },
        ],
      },
    ],
  },
  {
    id: "artykul-wzory-viete",
    title: "Wzory Viete’a",
    description:
      "Czym są wzory Viete’a dla równania kwadratowego i jak je udowodnić. Poziom rozszerzony.",
    topic: "Funkcje",
    subtopic: "Równania kwadratowe",
    contentModes: ["rozszerzenie"],
    levels: ["rozszerzony"],
    readMinutes: 18,
    relatedTasks: {
      topicIncludes: ["viete", "viète", "kwadrat"],
      subtopicIncludes: ["viete", "viète", "równanie kwadrat"],
      questionIncludes: ["viete", "viète", "x_1", "x_2", "suma pierwiastków", "iloczyn pierwiastków"],
      limit: 12,
    },
    legend: [
      {
        label: "Poziom rozszerzony",
        dot: "bg-violet-400",
        contentLevel: "rozszerzenie",
      },
    ],
    sections: [
      {
        number: "1",
        heading: "Wzory Viete’a",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "callout",
            variant: "definition",
            contentLevel: "rozszerzenie",
            title: "Idea",
            content:
              "Wzory Viete’a wiążą **współczynniki** równania kwadratowego z **sumą i iloczynem** jego pierwiastków, bez wyznaczania samych pierwiastków.",
          },
          {
            type: "callout",
            variant: "definition",
            contentLevel: "rozszerzenie",
            title: "Założenia",
            content:
              "Rozważamy równanie kwadratowe $ax^2+bx+c=0$, gdzie **$a\\neq 0$**. Niech $x_1$ oraz $x_2$ będą jego pierwiastkami rzeczywistymi (czyli $\\Delta\\ge 0$). Wtedy $x_1+x_2=-\\dfrac{b}{a}$ oraz $x_1x_2=\\dfrac{c}{a}$.",
          },
          {
            type: "formula-list",
            contentLevel: "rozszerzenie",
            items: [
              {
                latex: "x_1 + x_2 = -\\dfrac{b}{a}",
                label: "(1)",
                accent: "violet",
                caption: "suma pierwiastków",
                contentLevel: "rozszerzenie",
              },
              {
                latex: "x_1 x_2 = \\dfrac{c}{a}",
                label: "(2)",
                accent: "violet",
                caption: "iloczyn pierwiastków",
                contentLevel: "rozszerzenie",
              },
            ],
          },
        ],
      },
      {
        number: "2",
        heading: "Dowody",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content:
              "Wzory (1) i (2) nie biorą się znikąd. Poniżej sposób, żeby zobaczyć, skąd dokładnie wynikają. To jest bardziej ciekawostka, a nie rzecz, którą trzeba umieć.",
          },
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content: "**Dowód.** Ze wzorów na pierwiastki.",
          },
          {
            type: "steps",
            contentLevel: "rozszerzenie",
            items: [
              "Załóż $\\Delta=b^2-4ac\\ge 0$. Wtedy pierwiastki to $$x_1=\\dfrac{-b-\\sqrt{\\Delta}}{2a},\\qquad x_2=\\dfrac{-b+\\sqrt{\\Delta}}{2a}.$$",
              "**Suma.** Dodaj $x_1$ i $x_2$: $$x_1+x_2=\\dfrac{-b-\\sqrt{\\Delta}}{2a}+\\dfrac{-b+\\sqrt{\\Delta}}{2a}.$$",
              "Złącz liczniki: $$x_1+x_2=\\dfrac{(-b-\\sqrt{\\Delta})+(-b+\\sqrt{\\Delta})}{2a}=\\dfrac{-2b}{2a}.$$",
              "Uprość: $$x_1+x_2=-\\dfrac{b}{a}.$$ To wzór (1).",
              "**Iloczyn.** Pomnóż pierwiastki: $$x_1x_2=\\dfrac{(-b-\\sqrt{\\Delta})(-b+\\sqrt{\\Delta})}{4a^2}.$$",
              "Skorzystaj z różnicy kwadratów: $$x_1x_2=\\dfrac{b^2-\\Delta}{4a^2}.$$",
              "Wstaw $\\Delta=b^2-4ac$: $$x_1x_2=\\dfrac{b^2-(b^2-4ac)}{4a^2}=\\dfrac{4ac}{4a^2}=\\dfrac{c}{a}.$$ To wzór (2).",
            ],
          },
        ],
      },
      {
        number: "3",
        heading: "Uwagi przed rozwiązywaniem zadań",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content:
              "Zanim przejdziesz do zadań, sprawdź te uwagi. To one najczęściej decydują o tym, czy rozwiązanie jest kompletne.",
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "rozszerzenie",
            title: "Równanie musi zostać kwadratowe",
            content:
              "Jeśli w zadaniu pojawia się parametr w współczynniku przy $x^2$, np. $f(x)=mx^2+x+2$, to żeby były dwa pierwiastki trójmianu kwadratowego, musi być **$m\\neq 0$**. Dla $m=0$ równanie przestaje być kwadratowe.",
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "rozszerzenie",
            title: "„Dwa różne pierwiastki” ≠ „dwa pierwiastki”",
            content:
              "**Dwa różne pierwiastki** wymagają $\\Delta>0$. Sformułowanie **dwa pierwiastki** zwykle dopuszcza też $\\Delta\\ge 0$. Jeśli $\\Delta=0$, mamy **pierwiastek podwójny** $x_1=x_2$.",
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "rozszerzenie",
            title: "Zakazane wartości pierwiastków",
            content:
              "Jeśli z treści zadania wynika $x_1\\neq d$ lub $x_2\\neq d$ (gdzie $d\\in\\mathbb{R}$), sprawdzamy, dla jakiego parametru $d$ jest pierwiastkiem, i **wyrzucamy** tę wartość parametru z rozwiązania.\n\n**Przykład.** Dana jest $f(x)=x^2+x+2m$ oraz warunek $$\\dfrac{1}{x_1}+\\dfrac{1}{x_2}=7.$$ W mianownikach stoją $x_1$ i $x_2$, więc musi być $$x_1\\neq 0\\quad\\text{oraz}\\quad x_2\\neq 0.$$ Szukamy takiego $m$, dla którego $0$ jest pierwiastkiem: $$f(0)=2m=0,\\quad\\text{więc}\\quad m=0.$$ Dla $m=0$ mamy $f(x)=x^2+x=x(x+1)$, czyli pierwiastki $0$ i $-1$. Wtedy $\\dfrac{1}{x_1}+\\dfrac{1}{x_2}$ nie ma sensu. Ze wzorów Viete’a też widać problem: $x_1x_2=2m$, więc dla $m=0$ iloczyn jest zerem i nie wolno dzielić przez $x_1x_2$. Dlatego $m=0$ **wyrzucamy** z rozwiązania, nawet gdyby formalnie wyszło z równania $\\dfrac{x_1+x_2}{x_1x_2}=7$.",
          },
        ],
      },
      {
        number: "4",
        heading: "Przykłady",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content:
              "Rozwiążemy razem trzy proste zadania.",
          },
          {
            type: "guided-example",
            contentLevel: "rozszerzenie",
            title: "Przykład 1",
            prompt:
              "Znajdź wartości parametru $m$, dla których funkcja $f(x)=mx^2+mx+1$ ma dwa różne pierwiastki.",
            steps: [
              "Najpierw sprawdzamy, czy w ogóle mamy trójmian kwadratowy. Współczynnik przy $x^2$ to $m$. Jeśli $m=0$, to $f(x)=1$ i nie ma równania kwadratowego, więc nie ma dwóch pierwiastków. Zatem **musi być** $$m\\neq 0.$$ Ten warunek **przyda się później**, gdy będziemy składać odpowiedź.",
              "Zadanie prosi o **dwa różne** pierwiastki. Takie pierwiastki istnieją wtedy, gdy równanie jest kwadratowe i $\\Delta>0$. Gdyby było tylko „dwa pierwiastki”, wystarczyłoby $\\Delta\\ge 0$.",
              "Żeby policzyć deltę, musimy odczytać współczynniki z ogólnego zapisu $ax^2+bx+c$. W $f(x)=mx^2+mx+1$ pierwszy składnik to $m\\cdot x^2$, więc $a=m$. Drugi składnik to $m\\cdot x$, więc $b=m$. Na końcu stoi $1$, więc $c=1$.",
              "Wstawiamy te współczynniki do wzoru na deltę: $$\\Delta=b^2-4ac=m^2-4\\cdot m\\cdot 1=m^2-4m.$$ Wyłączamy $m$ przed nawias: $$\\Delta=m(m-4).$$",
              "Dwa różne pierwiastki wymagają $\\Delta>0$, więc układamy nierówność $$m(m-4)>0.$$",
              "Iloczyn jest dodatni, gdy oba czynniki są dodatnie albo oba ujemne: $$m>4\\quad\\text{lub}\\quad m<0.$$ Zatem $$m\\in(-\\infty,0)\\cup(4,+\\infty).$$",
              "Zostaje warunek $m\\neq 0$ z początku. Punkt $m=0$ nie należy do $(-\\infty,0)\\cup(4,+\\infty)$, więc nic nie wycinamy. Ostatecznie $$m\\in(-\\infty,0)\\cup(4,+\\infty).$$",
            ],
            result: "$m\\in(-\\infty,0)\\cup(4,+\\infty)$",
            cleanSolution: [
              "$m\\neq 0$",
              "$\\Delta=m(m-4)>0\\ \\Rightarrow\\ m\\in(-\\infty,0)\\cup(4,+\\infty)$",
              "$m=0$ nie leży w tym zbiorze, więc $m\\in(-\\infty,0)\\cup(4,+\\infty)$",
            ],
          },
          {
            type: "guided-example",
            contentLevel: "rozszerzenie",
            title: "Przykład 2",
            prompt:
              "Równanie $x^2-3x+m=0$ ma dwa różne pierwiastki $x_1$ i $x_2$, które spełniają $x_1^2+x_2^2=5$. Znajdź $m$.",
            steps: [
              "**I.** Zadanie wymaga **dwóch różnych** pierwiastków, więc układamy $\\Delta>0$. Gdyby było tylko „dwa pierwiastki”, byłoby $\\Delta\\ge 0$.",
              "Porównujemy $x^2-3x+m=0$ z $ax^2+bx+c=0$: $a=1$, $b=-3$, $c=m$.",
              "Liczymy deltę: $$\\Delta=b^2-4ac=(-3)^2-4\\cdot 1\\cdot m=9-4m.$$",
              "Układamy nierówność $$\\Delta>0,$$ czyli $$9-4m>0.$$",
              "Przenosimy $-4m$: $9>4m$. Dzielimy przez $4$: $$m<\\dfrac{9}{4}.$$",
              "**II.** Drugi warunek: $x_1^2+x_2^2=5$.",
              "Ze wzorów Viete’a $$x_1+x_2=-\\dfrac{b}{a}=-\\dfrac{-3}{1}=3,\\qquad x_1x_2=\\dfrac{c}{a}=m.$$",
              "Podnosimy sumę do kwadratu: $$(x_1+x_2)^2=x_1^2+2x_1x_2+x_2^2.$$",
              "Odejmujemy $2x_1x_2$ od obu stron: $$x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2.$$",
              "Podstawiamy $x_1+x_2=3$ oraz $x_1x_2=m$: $$x_1^2+x_2^2=3^2-2m=9-2m.$$",
              "Z zadania $x_1^2+x_2^2=5$, więc $$9-2m=5.$$",
              "Przenosimy $9$: $-2m=5-9=-4$. Dzielimy przez $-2$: $$m=2.$$",
              "**III.** Część wspólna I i II to te $m$, które spełniają jednocześnie $m=2$ oraz $m<\\dfrac{9}{4}$.",
              "Sprawdzamy: $2<\\dfrac{9}{4}$, bo $\\dfrac{9}{4}=2{,}25$. Zatem $$m=2.$$",
            ],
            result: "$m=2$",
            cleanSolution: [
              "I:\\quad $\\Delta=9-4m>0\\ \\Rightarrow\\ m<\\dfrac{9}{4}$",
              "II:\\quad $x_1^2+x_2^2=9-2m=5\\ \\Rightarrow\\ m=2$",
              "III:\\quad $2<\\dfrac{9}{4}$,\\quad $m=2$",
            ],
          },
          {
            type: "guided-example",
            contentLevel: "rozszerzenie",
            title: "Przykład 3",
            prompt:
              "Równanie $x^2+mx+2=0$ ma dwa różne pierwiastki $x_1$ i $x_2$, dla których $\\dfrac{1}{x_1}+\\dfrac{1}{x_2}=3$. Znajdź $m$.",
            steps: [
              "**I.** Zadanie wymaga **dwóch różnych** pierwiastków, więc układamy $\\Delta>0$. Gdyby było tylko „dwa pierwiastki”, byłoby $\\Delta\\ge 0$.",
              "Porównujemy $x^2+mx+2=0$ z $ax^2+bx+c=0$: $a=1$, $b=m$, $c=2$.",
              "Liczymy deltę: $$\\Delta=b^2-4ac=m^2-4\\cdot 1\\cdot 2=m^2-8.$$",
              "Układamy nierówność $$\\Delta>0,$$ czyli $$m^2-8>0.$$",
              "Przenosimy $8$: $m^2>8$. Stąd $|m|>\\sqrt{8}$, czyli $|m|>2\\sqrt{2}$. Zatem $$m\\in(-\\infty,-2\\sqrt{2})\\cup(2\\sqrt{2},+\\infty).$$",
              "**II.** Drugi warunek: $\\dfrac{1}{x_1}+\\dfrac{1}{x_2}=3$.",
              "Ze wzorów Viete’a $$x_1+x_2=-\\dfrac{b}{a}=-m,\\qquad x_1x_2=\\dfrac{c}{a}=2.$$",
              "W mianownikach są $x_1$ i $x_2$, więc potrzeba $x_1\\neq 0$ oraz $x_2\\neq 0$. Z $x_1x_2=2$ mamy $2\\neq 0$, więc żaden z pierwiastków nie jest zerem. Tego warunku nie dokładamy osobno.",
              "Sprowadzamy lewą stronę do wspólnego mianownika: $$\\dfrac{1}{x_1}+\\dfrac{1}{x_2}=\\dfrac{x_2}{x_1x_2}+\\dfrac{x_1}{x_1x_2}=\\dfrac{x_1+x_2}{x_1x_2}.$$",
              "Podstawiamy $x_1+x_2=-m$ oraz $x_1x_2=2$: $$\\dfrac{x_1+x_2}{x_1x_2}=\\dfrac{-m}{2}.$$",
              "Z zadania ta suma jest równa $3$, więc $$\\dfrac{-m}{2}=3.$$",
              "Mnożymy obie strony przez $2$: $-m=6$. Mnożymy przez $-1$: $$m=-6.$$",
              "**III.** Część wspólna I i II to te $m$, które spełniają jednocześnie $m=-6$ oraz $m\\in(-\\infty,-2\\sqrt{2})\\cup(2\\sqrt{2},+\\infty)$.",
              "Sprawdzamy: $-2\\sqrt{2}\\approx -2{,}83$, a $-6<-2{,}83$, więc $-6\\in(-\\infty,-2\\sqrt{2})$. Zatem $$m=-6.$$",
            ],
            result: "$m=-6$",
            cleanSolution: [
              "I:\\quad $\\Delta=m^2-8>0\\ \\Rightarrow\\ m\\in(-\\infty,-2\\sqrt{2})\\cup(2\\sqrt{2},+\\infty)$",
              "II:\\quad $\\dfrac{1}{x_1}+\\dfrac{1}{x_2}=\\dfrac{-m}{2}=3\\ \\Rightarrow\\ m=-6$",
              "III:\\quad $-6<-2\\sqrt{2}$,\\quad $m=-6$",
            ],
          },
        ],
      },
      {
        number: "5",
        heading: "Warunki",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content:
              "Przykładowe warunki z zadań ze wzorów Viete’a. Przekształć poniższe przykłady do kombinacji $x_1+x_2$ oraz $x_1x_2$. Najpierw zrób to sam, potem rozwiń i porównaj.",
          },
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content: "**Proste / w miarę proste**",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "1) $x_1^2+x_2^2$",
            video: "https://youtu.be/Z6T0dUSPJ2o",
            content:
              "$$x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2=\\left(-\\dfrac{b}{a}\\right)^2-2\\cdot\\dfrac{c}{a}$$\n\nSkąd to się bierze: $(x_1+x_2)^2=x_1^2+2x_1x_2+x_2^2$, więc po odjęciu $2x_1x_2$ zostaje suma kwadratów.",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "2) $\\dfrac{1}{x_1}+\\dfrac{1}{x_2}$",
            video: "https://youtu.be/2ywlKji7XK4",
            content:
              "$$\\dfrac{1}{x_1}+\\dfrac{1}{x_2}=\\dfrac{x_2}{x_1x_2}+\\dfrac{x_1}{x_1x_2}=\\dfrac{x_1+x_2}{x_1x_2}=\\dfrac{-\\dfrac{b}{a}}{\\dfrac{c}{a}}$$\n\nPamiętaj: musi być $x_1\\neq 0$ oraz $x_2\\neq 0$ (czyli $x_1x_2\\neq 0$).",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "3) $x_1^3+x_2^3$",
            video: "https://youtu.be/CghHwrh8fZA",
            content:
              "**I sposób:**\n\n$$x_1^3+x_2^3=(x_1+x_2)(x_1^2-x_1x_2+x_2^2)$$\n\n**II sposób:**\n\n$$(x_1+x_2)^3=x_1^3+3x_1^2x_2+3x_1x_2^2+x_2^3$$\n\n$$(x_1+x_2)^3-3x_1x_2(x_1+x_2)=x_1^3+x_2^3$$\n\nPo podstawieniu wzorów Viete’a:\n\n$$x_1^3+x_2^3=\\left(-\\dfrac{b}{a}\\right)^3-3\\cdot\\dfrac{c}{a}\\cdot\\left(-\\dfrac{b}{a}\\right)$$",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "4) $2x_1^2+5x_1x_2+2x_2^2$",
            video: "https://youtu.be/BJ7tchlKBRU",
            content:
              "$$2x_1^2+5x_1x_2+2x_2^2=2x_1^2+4x_1x_2+2x_2^2+x_1x_2=2(x_1^2+2x_1x_2+x_2^2)+x_1x_2$$\n\n$$=2(x_1+x_2)^2+x_1x_2$$\n\nRozbijamy środkowy wyraz tak, żeby dostać pełny kwadrat $(x_1+x_2)^2$.",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "5) $\\dfrac{1}{x_1^2}+\\dfrac{1}{x_2^2}$",
            content:
              "$$\\dfrac{1}{x_1^2}+\\dfrac{1}{x_2^2}=\\dfrac{x_2^2}{x_1^2x_2^2}+\\dfrac{x_1^2}{x_1^2x_2^2}=\\dfrac{x_1^2+x_2^2}{(x_1x_2)^2}$$\n\nDalej licznik zamieniamy wzorem z punktu 1): $x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2$.",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "6) $5x_1^2x_2+5x_1x_2^2$",
            video: "https://youtu.be/muasGty4naE",
            content:
              "$$5x_1^2x_2+5x_1x_2^2=5x_1x_2(x_1+x_2)$$\n\nWyciągamy wspólny czynnik $5x_1x_2$ i dostajemy iloczyn oraz sumę, gotowe do podstawienia wzorów Viete’a.",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "7) $x_1^2-x_2^2=x_1^4-x_2^4$",
            content:
              "Przy $\\Delta>0$ (dwa różne pierwiastki). Gdyby $x_1=x_2$, równanie byłoby **tożsamością**.\n\n$$x_1^2-x_2^2=(x_1^2-x_2^2)(x_1^2+x_2^2)$$\n\n$$(x_1^2-x_2^2)-(x_1^2-x_2^2)(x_1^2+x_2^2)=0$$\n\n$$(x_1-x_2)(x_1+x_2)\\big(1-(x_1^2+x_2^2)\\big)=0$$\n\nZ $x_1\\neq x_2$ zostaje $x_1+x_2=0$ albo $1-(x_1^2+x_2^2)=0$, a $x_1^2+x_2^2$ zamieniamy jak w punkcie 1).",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "8) $x_1$ jest przeciwnością $x_2$",
            video: "https://youtu.be/K_vtkVMj1sI",
            content:
              "$$x_1=-x_2\\quad\\Rightarrow\\quad x_1+x_2=0$$\n\nZe wzorów Viete’a: $-\\dfrac{b}{a}=0$, czyli $b=0$.",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "9) $x_1$ jest odwrotnością $x_2$",
            video: "https://youtu.be/VQaQRmhYfzc",
            content:
              "$$x_1=\\dfrac{1}{x_2}\\quad\\big|\\cdot x_2\\quad (x_2\\neq 0)$$\n\n$$x_1x_2=1$$\n\nZe wzorów Viete’a: $\\dfrac{c}{a}=1$.",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "10) $|x_1-x_2|=180$",
            content:
              "Podnosimy obie strony do kwadratu:\n\n$$|x_1-x_2|=180\\quad\\big|\\cdot(\\ )^2$$\n\n$$(x_1-x_2)^2=180^2$$\n\n$$x_1^2-2x_1x_2+x_2^2=180^2$$\n\nDalej: $x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2$, więc\n\n$$(x_1+x_2)^2-4x_1x_2=180^2$$\n\ni podstawiamy wzory Viete’a.",
          },
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content: "**Średnie**",
          },
          {
            type: "callout",
            variant: "definition",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "12) obydwa dodatnie",
            content:
              "$$\\begin{cases} \\Delta>0 \\\\ x_1+x_2>0 \\\\ x_1x_2>0 \\end{cases}$$",
          },
          {
            type: "callout",
            variant: "definition",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "12.1) obydwa nieujemne",
            content:
              "$$\\begin{cases} x_1+x_2\\ge 0 \\\\ x_1x_2\\ge 0 \\\\ \\Delta>0 \\end{cases}$$",
          },
          {
            type: "callout",
            variant: "definition",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "13) obydwa ujemne",
            content:
              "$$\\begin{cases} x_1+x_2<0 \\\\ x_1x_2>0 \\\\ \\Delta>0 \\end{cases}$$",
          },
          {
            type: "callout",
            variant: "definition",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "13.1) obydwa niedodatnie",
            content:
              "$$\\begin{cases} x_1+x_2\\le 0 \\\\ x_1x_2\\ge 0 \\\\ \\Delta>0 \\end{cases}$$",
          },
          {
            type: "callout",
            variant: "definition",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "14) obydwa tego samego znaku",
            content:
              "$$\\begin{cases} x_1x_2>0 \\\\ \\Delta>0 \\end{cases}$$",
          },
          {
            type: "callout",
            variant: "definition",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "15) $x_1$ większy/mniejszy o $d$ od $x_2$",
            video: "https://youtu.be/9v8gsg0BGiQ",
            content:
              "$$|x_1-x_2|=d,\\qquad d\\in\\mathbb{R}$$\n\n**!** Wartość bezwzględna oznacza odległość. Dalej postępujemy jak w punkcie 10).",
          },
          {
            type: "callout",
            variant: "definition",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "16) obydwa różnego znaku",
            content:
              "$$\\begin{cases} x_1x_2<0 \\\\ \\Delta>0 \\end{cases}$$",
          },
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content: "**Trudne**",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "17) obydwa większe / mniejsze od $d$",
            content:
              "Przykład: obydwa większe od $2$.\n\n$$\\begin{cases} x_1>2 \\\\ x_2>2 \\end{cases}\\quad\\Longrightarrow\\quad\\begin{cases} x_1-2>0 \\\\ x_2-2>0 \\end{cases}$$\n\nStąd:\n\n$$\\begin{cases} x_1+x_2>4 \\\\ (x_1-2)(x_2-2)>0 \\end{cases}$$\n\nRozwijamy iloczyn:\n\n$$(x_1-2)(x_2-2)=x_1x_2-2x_1-2x_2+4=x_1x_2-2(x_1+x_2)+4$$\n\n$$x_1x_2-2(x_1+x_2)+4>0$$\n\nDla „mniejsze od $d$” znaki nierówności się odwracają analogicznie. Do tego dokładamy $\\Delta>0$.",
          },
          {
            type: "callout",
            variant: "definition",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "18) oba należą do przedziału $(p,q)$ lub $[p,q]$",
            content:
              "Oba pierwiastki leżą w danym przedziale. Dla przedziału otwartego $(p,q)$ łączymy warunki z punktu 17):\n\n$$\\begin{cases} x_1>p \\text{ i } x_2>p \\\\ x_1<q \\text{ i } x_2<q \\\\ \\Delta>0 \\end{cases}$$\n\nDla przedziału domkniętego $[p,q]$ zamieniamy ostre nierówności na nieostre ($\\ge$, $\\le$).",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "19) $x_1<p$ i $x_2>q$, gdzie $p<q$",
            content:
              "**I sposób:**\n\n$$\\begin{cases} x_1-p<0 \\\\ x_2-q>0 \\end{cases}\\quad\\Longleftrightarrow\\quad\\begin{cases} (x_1-p)(x_2-p)<0 \\\\ (x_1-q)(x_2-q)<0 \\end{cases}$$\n\nRozwijamy:\n\n$$\\begin{cases} x_1x_2-p(x_1+x_2)+p^2<0 \\\\ x_1x_2-q(x_1+x_2)+q^2<0 \\end{cases}$$\n\nPotem podstawiamy wzory Viete’a. (To oznacza, że $p$ i $q$ leżą między pierwiastkami.)",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "20) zależność liniowa, np. $3x_1-2x_2=7$",
            content:
              "Łączymy warunek z wzorami Viete’a:\n\n$$\\begin{cases} 3x_1-2x_2=7 \\\\ x_1+x_2=-\\dfrac{b}{a} \\\\ x_1x_2=\\dfrac{c}{a} \\end{cases}$$\n\nZ pierwszego: $x_1=\\dfrac{7+2x_2}{3}$. Wstawiamy do sumy:\n\n$$\\dfrac{7+2x_2}{3}+x_2=-\\dfrac{b}{a}$$\n\nPo wymnożeniu przez $3a$:\n\n$$a(7+2x_2)+3ax_2=-3b$$\n\n$$7a+5ax_2=-3b$$\n\n$$x_2=-\\dfrac{3b+7a}{5a}$$\n\nPotem $x_1$ z sumy albo z warunku, a na końcu sprawdzamy iloczyn / $\\Delta$.",
          },
          {
            type: "callout",
            variant: "definition",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "21) jedno rozwiązanie nieujemne",
            content:
              "Dokładnie jeden pierwiastek spełnia $x\\ge 0$. Typowo oznacza to pierwiastki różnego znaku (albo jeden równy $0$), czyli m.in. $x_1x_2\\le 0$ oraz $\\Delta>0$, z dodatkowym warunkiem, że większy pierwiastek jest nieujemny.",
          },
        ],
      },
    ],
  },
  {
    id: "artykul-granice-ciagow",
    title: "Granice ciągów",
    unavailable: true,
    description:
      "Jak liczyć granice ciągów: stosunek najwyższych potęg, wzór na różnicę a-b oraz twierdzenie o trzech ciągach. Poziom rozszerzony.",
    topic: "Ciągi",
    subtopic: "Granice ciągów",
    contentModes: ["rozszerzenie"],
    levels: ["rozszerzony"],
    readMinutes: 18,
    relatedTasks: {
      topicIncludes: ["ciąg", "granic"],
      subtopicIncludes: ["granic", "ciąg"],
      questionIncludes: ["lim", "granica", "n\\to", "ciąg"],
      limit: 12,
    },
    legend: [
      {
        label: "Poziom rozszerzony",
        dot: "bg-violet-400",
        contentLevel: "rozszerzenie",
      },
    ],
    sections: [
      {
        number: "1",
        heading: "Granica ciągu",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "callout",
            variant: "definition",
            contentLevel: "rozszerzenie",
            title: "Idea",
            content:
              "Granica ciągu mówi, **do jakiej liczby zbliżają się wyrazy**, gdy numer wyrazu $n$ rośnie bez ograniczenia. Nie musimy znać wszystkich wyrazów. Wystarczy, że dla dużych $n$ wyrazy są coraz bliżej tej liczby.",
          },
          {
            type: "callout",
            variant: "definition",
            contentLevel: "rozszerzenie",
            title: "Zapis",
            content:
              "Jeśli wyrazy ciągu $(a_n)$ zbliżają się do liczby $g$, piszemy $$\\lim_{n\\to\\infty}a_n=g.$$ Mówimy wtedy, że ciąg jest **zbieżny** do $g$. Liczba $g$ to **granica** ciągu.",
          },
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content:
              "Poniżej trzy przykłady. Na wykresie każdy punkt to **jeden wyraz** ciągu: w poziomie numer $n$, w pionie wartość $a_n$. Przerywana linia (jeśli jest) to granica, do której wyrazy się zbliżają.",
          },
          {
            type: "sequence-plots",
            contentLevel: "rozszerzenie",
            items: [
              {
                title: "Przykład 1",
                formula: "$a_n=\\dfrac{1}{n}$",
                terms: "Wyrazy: $1,\\ \\dfrac{1}{2},\\ \\dfrac{1}{3},\\ \\dfrac{1}{4},\\ \\ldots$",
                caption: "Punkty schodzą do osi $n$. Ciąg jest **zbieżny**: $\\lim_{n\\to\\infty}a_n=0$.",
                limit: 0,
                yMin: 0,
                yMax: 1.2,
                points: [
                  { n: 1, a: 1 },
                  { n: 2, a: 0.5 },
                  { n: 3, a: 0.333 },
                  { n: 4, a: 0.25 },
                  { n: 5, a: 0.2 },
                  { n: 6, a: 0.167 },
                  { n: 7, a: 0.143 },
                  { n: 8, a: 0.125 },
                  { n: 9, a: 0.111 },
                  { n: 10, a: 0.1 },
                ],
              },
              {
                title: "Przykład 2",
                formula: "$a_n=n$",
                terms: "Wyrazy: $1,\\ 2,\\ 3,\\ 4,\\ 5,\\ \\ldots$",
                caption: "Punkty idą coraz wyżej. Ciąg jest **rozbieżny** do $+\\infty$: $\\lim_{n\\to\\infty}a_n=+\\infty$.",
                yMin: 0,
                yMax: 11,
                points: [
                  { n: 1, a: 1 },
                  { n: 2, a: 2 },
                  { n: 3, a: 3 },
                  { n: 4, a: 4 },
                  { n: 5, a: 5 },
                  { n: 6, a: 6 },
                  { n: 7, a: 7 },
                  { n: 8, a: 8 },
                  { n: 9, a: 9 },
                  { n: 10, a: 10 },
                ],
              },
              {
                title: "Przykład 3",
                formula: "$a_n=(-1)^n$",
                terms: "Wyrazy: $-1,\\ 1,\\ -1,\\ 1,\\ -1,\\ \\ldots$",
                caption: "Punkty skaczą między $-1$ a $1$ i nigdzie nie osiadają. Ciąg **nie ma granicy** (nawet niewłaściwej).",
                yMin: -1.5,
                yMax: 1.5,
                points: [
                  { n: 1, a: -1 },
                  { n: 2, a: 1 },
                  { n: 3, a: -1 },
                  { n: 4, a: 1 },
                  { n: 5, a: -1 },
                  { n: 6, a: 1 },
                  { n: 7, a: -1 },
                  { n: 8, a: 1 },
                  { n: 9, a: -1 },
                  { n: 10, a: 1 },
                ],
              },
            ],
          },
          {
            type: "callout",
            variant: "insight",
            contentLevel: "rozszerzenie",
            title: "Zbieżny, rozbieżny, granica niewłaściwa",
            content:
              "Jeśli wyrazy rosną nieograniczenie, piszemy $\\lim_{n\\to\\infty}a_n=+\\infty$. Jeśli maleją nieograniczenie, $\\lim_{n\\to\\infty}a_n=-\\infty$. To są **granice niewłaściwe**: ciąg jest wtedy **rozbieżny**. Ciąg może też nie mieć ani granicy skończonej, ani $\\pm\\infty$, jak w przykładzie 3.",
          },
        ],
      },
      {
        number: "2",
        heading: "Podstawowe granice i działania",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content:
              "Z tych granic korzystamy cały czas. Resztę zadań sprowadzamy właśnie do nich.",
          },
          {
            type: "formula-list",
            contentLevel: "rozszerzenie",
            items: [
              {
                latex: "\\lim_{n\\to\\infty}\\dfrac{1}{n}=0",
                label: "(1)",
                accent: "violet",
                caption: "odwrotność numeru wyrazu",
                contentLevel: "rozszerzenie",
                exampleOpen: true,
                example: {
                  level: "rozszerzony",
                  prompt: "Oblicz $\\displaystyle\\lim_{n\\to\\infty}\\dfrac{1}{n}$.",
                  steps: [
                    "Kolejne wyrazy to $1,\\ \\dfrac{1}{2},\\ \\dfrac{1}{3},\\ \\dfrac{1}{4},\\ \\ldots$",
                    "Są coraz bliżej $0$, więc ze wzoru (1) granica jest $0$.",
                  ],
                  result: "Wynik: $0$.",
                },
              },
              {
                latex: "\\lim_{n\\to\\infty}\\dfrac{1}{n^k}=0\\quad (k>0)",
                label: "(2)",
                accent: "violet",
                caption: "odwrotność potęgi $n$",
                contentLevel: "rozszerzenie",
                exampleOpen: true,
                example: {
                  level: "rozszerzony",
                  prompt: "Oblicz $\\displaystyle\\lim_{n\\to\\infty}\\dfrac{1}{n^2}$.",
                  steps: [
                    "Tu $k=2>0$, więc to wzór (2).",
                    "Wyrazy $\\dfrac{1}{n^2}$ maleją jeszcze szybciej niż $\\dfrac{1}{n}$, więc granica jest $0$.",
                  ],
                  result: "Wynik: $0$.",
                },
              },
              {
                latex: "\\lim_{n\\to\\infty}\\sqrt[n]{a}=1\\quad (a>0)",
                label: "(3)",
                accent: "violet",
                caption: "pierwiastek $n$-tego stopnia",
                contentLevel: "rozszerzenie",
                exampleOpen: true,
                example: {
                  level: "rozszerzony",
                  prompt: "Oblicz $\\displaystyle\\lim_{n\\to\\infty}\\sqrt[n]{5}$.",
                  steps: [
                    "Tu $a=5>0$, więc wolno użyć wzoru (3).",
                    "Pierwiastek $n$-tego stopnia ze stałej dodatniej dąży do $1$.",
                  ],
                  result: "Wynik: $1$.",
                },
              },
            ],
          },
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content:
              "Jeśli $\\lim_{n\\to\\infty}a_n=A$ oraz $\\lim_{n\\to\\infty}b_n=B$ i obie granice są **skończone**, to wolno działać „po kawałkach”:",
          },
          {
            type: "formula-list",
            contentLevel: "rozszerzenie",
            items: [
              {
                latex: "\\lim_{n\\to\\infty}(a_n+b_n)=A+B",
                label: "(4)",
                accent: "violet",
                caption: "granica sumy",
                contentLevel: "rozszerzenie",
                exampleOpen: true,
                example: {
                  level: "rozszerzony",
                  prompt: "Oblicz $\\displaystyle\\lim_{n\\to\\infty}\\left(2+\\dfrac{1}{n}\\right)$.",
                  steps: [
                    "Rozbijamy na sumę: $2+\\dfrac{1}{n}$.",
                    "Stała $2$ ma granicę $2$. Ze wzoru (1) jest $\\dfrac{1}{n}\\to 0$.",
                    "Ze wzoru (4): $2+0=2$.",
                  ],
                  result: "Wynik: $2$.",
                },
              },
              {
                latex: "\\lim_{n\\to\\infty}(a_n\\cdot b_n)=A\\cdot B",
                label: "(5)",
                accent: "violet",
                caption: "granica iloczynu",
                contentLevel: "rozszerzenie",
                exampleOpen: true,
                example: {
                  level: "rozszerzony",
                  prompt: "Oblicz $\\displaystyle\\lim_{n\\to\\infty}\\left(2+\\dfrac{1}{n}\\right)\\left(3-\\dfrac{1}{n}\\right)$.",
                  steps: [
                    "Z poprzedniego przykładu $2+\\dfrac{1}{n}\\to 2$. Analogicznie $3-\\dfrac{1}{n}\\to 3$.",
                    "Obie granice są skończone, więc ze wzoru (5) iloczyn dąży do $2\\cdot 3=6$.",
                  ],
                  result: "Wynik: $6$.",
                },
              },
              {
                latex: "\\lim_{n\\to\\infty}\\dfrac{a_n}{b_n}=\\dfrac{A}{B}\\quad (B\\neq 0)",
                label: "(6)",
                accent: "violet",
                caption: "granica ilorazu",
                contentLevel: "rozszerzenie",
                exampleOpen: true,
                example: {
                  level: "rozszerzony",
                  prompt: "Oblicz $\\displaystyle\\lim_{n\\to\\infty}\\dfrac{2+\\dfrac{1}{n}}{5-\\dfrac{1}{n}}$.",
                  steps: [
                    "Licznik: $2+\\dfrac{1}{n}\\to 2$. Mianownik: $5-\\dfrac{1}{n}\\to 5$.",
                    "Granica mianownika jest $5\\neq 0$, więc wolno użyć wzoru (6): $\\dfrac{2}{5}$.",
                  ],
                  result: "Wynik: $\\dfrac{2}{5}$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "insight",
            contentLevel: "rozszerzenie",
            title: "To samo dla różnicy i stałej",
            content:
              "Granica różnicy to $A-B$. Stałą wolno wyciągnąć przed granicę: $\\lim_{n\\to\\infty}(c\\cdot a_n)=c\\cdot A$. Na przykład $\\lim_{n\\to\\infty}\\left(4-\\dfrac{1}{n}\\right)=4$ oraz $\\lim_{n\\to\\infty}\\dfrac{3}{n}=3\\cdot 0=0$.",
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "rozszerzenie",
            title: "Symbole nieoznaczone",
            content:
              "Wzory (4)-(6) wymagają **skończonych** granic. Nie wolno dzielić, gdy granica mianownika jest zerem. Zapisów typu $$\\dfrac{\\infty}{\\infty},\\qquad \\dfrac{0}{0},\\qquad \\infty-\\infty,\\qquad 0\\cdot\\infty$$ **nie liczymy** jako liczb. To **symbole nieoznaczone**: sygnał, że wzór trzeba najpierw przekształcić i dopiero potem brać granicę. Na przykład $\\dfrac{n^2+1}{2n^2}$ wygląda na $\\dfrac{\\infty}{\\infty}$, a $\\sqrt{n^2+n}-n$ wygląda na $\\infty-\\infty$.",
          },
        ],
      },
      {
        number: "3",
        heading: "Stosunek najwyższych potęg",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content:
              "Gdy $a_n$ jest **ilorazem wielomianów** względem $n$, dzielimy licznik i mianownik przez **najwyższą potęgę $n$ występującą w mianowniku**. Potem korzystamy z (1) i (2): każdy składnik $\\dfrac{1}{n^k}$ znika.",
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "Dlaczego dzielimy przez najwyższą potęgę",
            content:
              "Dla dużych $n$ w wielomianie rządzi składnik z największą potęgą. Reszta jest przy nim coraz mniejsza. Po podzieleniu zostają liczby (współczynniki) i ułamki $\\dfrac{1}{n^k}$, których granica jest $0$.",
          },
          {
            type: "callout",
            variant: "insight",
            contentLevel: "rozszerzenie",
            title: "Skrót: porównaj stopnie",
            content:
              "Niech licznik ma stopień $k$ i współczynnik wiodący $a$, a mianownik stopień $m$ i współczynnik wiodący $b$.",
          },
          {
            type: "list",
            contentLevel: "rozszerzenie",
            items: [
              "Gdy $k<m$, granica jest $0$.",
              "Gdy $k=m$, granica jest $\\dfrac{a}{b}$.",
              "Gdy $k>m$, granica jest $+\\infty$ albo $-\\infty$ (znak bierzemy z $\\dfrac{a}{b}$).",
            ],
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "rozszerzenie",
            title: "To jest skrót, nie pierwszy krok",
            content:
              "W zadaniu i tak **rozpisz dzielenie** przez $n^m$. Skrót ze stopniami jest do sprawdzenia wyniku, a nie zamiast rachunku.",
          },
        ],
      },
      {
        number: "4",
        heading: "Różnica $a-b$ ze wzoru $a^2-b^2$",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content:
              "Gdy we wzorze widać różnicę, która przy $n\\to\\infty$ wygląda na $\\infty-\\infty$ (często z pierwiastkami), używamy wzoru na różnicę kwadratów **od tyłu**: z $a^2-b^2=(a-b)(a+b)$ dostajemy $a-b$.",
          },
          {
            type: "formula-list",
            contentLevel: "rozszerzenie",
            items: [
              {
                latex: "a-b=\\dfrac{a^2-b^2}{a+b}",
                label: "(7)",
                accent: "violet",
                caption: "różnica ze wzoru $a^2-b^2$",
                contentLevel: "rozszerzenie",
              },
              {
                latex: "\\sqrt{a}-\\sqrt{b}=\\dfrac{a-b}{\\sqrt{a}+\\sqrt{b}}\\quad (a\\ge 0,\\ b\\ge 0)",
                label: "(8)",
                accent: "violet",
                caption: "to samo dla pierwiastków",
                contentLevel: "rozszerzenie",
              },
            ],
          },
          {
            type: "callout",
            variant: "why",
            collapsible: true,
            contentLevel: "rozszerzenie",
            title: "Skąd się bierze wzór (7)",
            content:
              "Ze wzoru skróconego mnożenia $a^2-b^2=(a-b)(a+b)$. Dzielimy obie strony przez $a+b$ (gdy $a+b\\neq 0$) i zostaje (7). W praktyce **mnożymy i dzielimy** $a-b$ przez sprzężenie $a+b$: $$a-b=\\dfrac{(a-b)(a+b)}{a+b}=\\dfrac{a^2-b^2}{a+b}.$$",
          },
          {
            type: "callout",
            variant: "insight",
            contentLevel: "rozszerzenie",
            title: "Kiedy tego używać",
            content:
              "Typowy kształt to $\\sqrt{\\text{coś z }n}-n$ albo $\\sqrt{n+1}-\\sqrt{n}$. Po zastosowaniu (7) albo (8) w liczniku zostaje zwykły wielomian i wracamy do stosunku najwyższych potęg.",
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "rozszerzenie",
            title: "$\\infty-\\infty$ to nie zero",
            content:
              "Nie wolno napisać $\\sqrt{n^2+n}-n\\to\\infty-\\infty=0$. To nieoznaczoność. Najpierw wzór (7) albo (8), potem granica.",
          },
        ],
      },
      {
        number: "5",
        heading: "Twierdzenie o trzech ciągach",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "callout",
            variant: "definition",
            contentLevel: "rozszerzenie",
            title: "Twierdzenie",
            content:
              "Jeżeli od pewnego miejsca zachodzi $$a_n\\le b_n\\le c_n$$ oraz $$\\lim_{n\\to\\infty}a_n=\\lim_{n\\to\\infty}c_n=g,$$ to także $$\\lim_{n\\to\\infty}b_n=g.$$",
          },
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content:
              "Środkowy ciąg jest **zaciśnięty** między dwoma ciągami, które idą do tej samej granicy. Nie ma gdzie uciec: sam też musi iść do $g$.",
          },
          {
            type: "formula-list",
            contentLevel: "rozszerzenie",
            items: [
              {
                latex:
                  "a_n\\le b_n\\le c_n\\ \\text{oraz}\\ \\lim a_n=\\lim c_n=g\\ \\Longrightarrow\\ \\lim b_n=g",
                label: "(9)",
                accent: "violet",
                caption: "twierdzenie o trzech ciągach",
                contentLevel: "rozszerzenie",
              },
            ],
          },
          {
            type: "callout",
            variant: "insight",
            contentLevel: "rozszerzenie",
            title: "Po co to w zadaniach",
            content:
              "Najczęściej ściskamy ciąg między dwoma ciągami idącymi do $0$, np. $-\\dfrac{1}{n}$ i $\\dfrac{1}{n}$. Tak liczymy granice z $(-1)^n$, bo ten ciąg **sam nie ma granicy**, ale po podzieleniu przez $n$ już tak.",
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "rozszerzenie",
            title: "Oba skrajne ciągi muszą mieć tę samą granicę",
            content:
              "Jeśli $a_n\\to 0$, a $c_n\\to 1$, twierdzenie nic nie daje. Środkowy ciąg może iść do czegokolwiek między $0$ a $1$, albo w ogóle nie mieć granicy.",
          },
        ],
      },
      {
        number: "6",
        heading: "Przykłady",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "text",
            contentLevel: "rozszerzenie",
            content:
              "Rozwiążemy razem trzy proste zadania. Każde pokazuje inny sposób liczenia granicy.",
          },
          {
            type: "guided-example",
            contentLevel: "rozszerzenie",
            title: "Przykład 1",
            prompt:
              "Oblicz $\\displaystyle\\lim_{n\\to\\infty}\\dfrac{2n^2+3n-1}{5n^2-n+4}$.",
            steps: [
              "W liczniku i mianowniku są wielomiany. Najwyższa potęga $n$ w mianowniku to $n^2$. Dzielimy licznik i mianownik przez $n^2$.",
              "Licznik: $$\\dfrac{2n^2+3n-1}{n^2}=2+\\dfrac{3}{n}-\\dfrac{1}{n^2}.$$",
              "Mianownik: $$\\dfrac{5n^2-n+4}{n^2}=5-\\dfrac{1}{n}+\\dfrac{4}{n^2}.$$",
              "Zatem $$\\dfrac{2n^2+3n-1}{5n^2-n+4}=\\dfrac{2+\\dfrac{3}{n}-\\dfrac{1}{n^2}}{5-\\dfrac{1}{n}+\\dfrac{4}{n^2}}.$$",
              "Ze wzoru (1) mamy $\\dfrac{1}{n}\\to 0$. Ze wzoru (2) mamy $\\dfrac{1}{n^2}\\to 0$.",
              "Licznik dąży do $2+3\\cdot 0-0=2$. Mianownik dąży do $5-0+4\\cdot 0=5$.",
              "Granica mianownika jest $5\\neq 0$, więc wolno użyć wzoru (6) na granicę ilorazu: $$\\lim_{n\\to\\infty}\\dfrac{2n^2+3n-1}{5n^2-n+4}=\\dfrac{2}{5}.$$",
              "Stopnie licznika i mianownika są równe (oba $2$), a stosunek współczynników wiodących to $\\dfrac{2}{5}$. To zgadza się z wynikiem.",
            ],
            result: "$\\dfrac{2}{5}$",
            cleanSolution: [
              "$\\dfrac{2n^2+3n-1}{5n^2-n+4}=\\dfrac{2+\\dfrac{3}{n}-\\dfrac{1}{n^2}}{5-\\dfrac{1}{n}+\\dfrac{4}{n^2}}\\to\\dfrac{2}{5}$",
            ],
          },
          {
            type: "guided-example",
            contentLevel: "rozszerzenie",
            title: "Przykład 2",
            prompt:
              "Oblicz $\\displaystyle\\lim_{n\\to\\infty}\\left(\\sqrt{n^2+n}-n\\right)$.",
            steps: [
              "Dla dużych $n$ oba składniki są duże, więc widać nieoznaczoność typu $\\infty-\\infty$. Używamy wzoru (7) z $a=\\sqrt{n^2+n}$ oraz $b=n$.",
              "Sprzężenie to $a+b=\\sqrt{n^2+n}+n$. Mnożymy i dzielimy przez nie: $$\\sqrt{n^2+n}-n=\\dfrac{\\left(\\sqrt{n^2+n}-n\\right)\\left(\\sqrt{n^2+n}+n\\right)}{\\sqrt{n^2+n}+n}.$$",
              "W liczniku jest różnica kwadratów: $$\\left(\\sqrt{n^2+n}\\right)^2-n^2=(n^2+n)-n^2=n.$$",
              "Zatem $$\\sqrt{n^2+n}-n=\\dfrac{n}{\\sqrt{n^2+n}+n}.$$",
              "Dzielimy licznik i mianownik przez $n$: $$\\dfrac{n}{\\sqrt{n^2+n}+n}=\\dfrac{1}{\\dfrac{\\sqrt{n^2+n}}{n}+1}.$$",
              "Pierwiastek w mianowniku: $$\\dfrac{\\sqrt{n^2+n}}{n}=\\sqrt{\\dfrac{n^2+n}{n^2}}=\\sqrt{1+\\dfrac{1}{n}},$$ bo $n>0$.",
              "Dostajemy $$\\sqrt{n^2+n}-n=\\dfrac{1}{\\sqrt{1+\\dfrac{1}{n}}+1}.$$",
              "Ze wzoru (1) jest $\\dfrac{1}{n}\\to 0$, więc $\\sqrt{1+\\dfrac{1}{n}}\\to\\sqrt{1}=1$.",
              "Stąd $$\\lim_{n\\to\\infty}\\left(\\sqrt{n^2+n}-n\\right)=\\dfrac{1}{1+1}=\\dfrac{1}{2}.$$",
            ],
            result: "$\\dfrac{1}{2}$",
            cleanSolution: [
              "$\\sqrt{n^2+n}-n=\\dfrac{n}{\\sqrt{n^2+n}+n}=\\dfrac{1}{\\sqrt{1+\\dfrac{1}{n}}+1}\\to\\dfrac{1}{2}$",
            ],
          },
          {
            type: "guided-example",
            contentLevel: "rozszerzenie",
            title: "Przykład 3",
            prompt:
              "Oblicz $\\displaystyle\\lim_{n\\to\\infty}\\dfrac{(-1)^n}{n}$.",
            steps: [
              "Ciąg $(-1)^n$ nie ma granicy: wyrazy skaczą między $-1$ a $1$. Nie wolno więc liczyć tej granicy jako ilorazu dwóch granic.",
              "Dla każdego $n$ zachodzi $$-1\\le(-1)^n\\le 1.$$",
              "Numer wyrazu $n$ jest dodatni, więc po podzieleniu nierówności przez $n$ znak się nie zmienia: $$-\\dfrac{1}{n}\\le\\dfrac{(-1)^n}{n}\\le\\dfrac{1}{n}.$$",
              "Lewy ciąg: $\\lim_{n\\to\\infty}\\left(-\\dfrac{1}{n}\\right)=0$ ze wzoru (1).",
              "Prawy ciąg: $\\lim_{n\\to\\infty}\\dfrac{1}{n}=0$ ze wzoru (1).",
              "Mamy $a_n=-\\dfrac{1}{n}$, $b_n=\\dfrac{(-1)^n}{n}$, $c_n=\\dfrac{1}{n}$ oraz $\\lim a_n=\\lim c_n=0$.",
              "Z twierdzenia o trzech ciągach (9) dostajemy $$\\lim_{n\\to\\infty}\\dfrac{(-1)^n}{n}=0.$$",
            ],
            result: "$0$",
            cleanSolution: [
              "$-\\dfrac{1}{n}\\le\\dfrac{(-1)^n}{n}\\le\\dfrac{1}{n}$,\\quad $-\\dfrac{1}{n}\\to 0$,\\quad $\\dfrac{1}{n}\\to 0$",
              "z (9): $\\dfrac{(-1)^n}{n}\\to 0$",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "artykul-funkcja-liniowa",
    title: "Funkcja liniowa",
    description:
      "Wzór ax+b, wykres, nachylenie, proste równoległe i prostopadłe, przecięcie oraz interpretacja geometryczna układu równań.",
    topic: "Funkcje",
    subtopic: "Funkcja liniowa",
    contentModes: ["podstawa", "rozszerzenie"],
    levels: ["podstawowy", "rozszerzony"],
    readMinutes: 24,
    relatedTasks: {
      topicIncludes: ["funkcja liniowa", "liniow"],
      subtopicIncludes: ["funkcja liniowa", "liniow"],
      questionIncludes: ["funkcja liniowa", "ax+b", "y=ax"],
      limit: 12,
    },
    legend: [
      { label: "Poziom podstawowy", dot: "bg-blue-500", contentLevel: "podstawa" },
      { label: "Poziom rozszerzony", dot: "bg-blue-300", contentLevel: "rozszerzenie" },
    ],
    sections: [
      {
        number: "1",
        heading: "Wzór i współczynniki",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Definicja",
          },
          {
            type: "callout",
            variant: "definition",
            contentLevel: "podstawa",
            title: "Funkcja liniowa",
            content:
              "Funkcją liniową nazywamy funkcję daną wzorem $$f(x)=ax+b,$$ gdzie $a$ i $b$ są ustalonymi liczbami rzeczywistymi. Dziedzina to zwykle $\\mathbb{R}$.",
            example: {
              prompt: "W $f(x)=3x-2$ wskaż $a$ i $b$. Oblicz $f(4)$.",
              right:
                "$a=3$, $b=-2$. Wartość: $f(4)=3\\cdot 4-2=12-2=10$.",
            },
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Współczynniki",
          },
          {
            type: "list",
            contentLevel: "podstawa",
            items: [
              "Współczynnik $a$ to **współczynnik kierunkowy**. Stoi przy $x$ we wzorze $ax+b$.",
              "Współczynnik $b$ to **wyraz wolny** - to wysokość, na której prosta przecina oś $OY$.",
            ],
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawa",
            title: "Współczynnik kierunkowy jest tylko jeden",
            content:
              "Współczynnik $a$ to wszystko, co stoi przy $x$ po wyciągnięciu $x$ przed nawias. Gdy we wzorze są dwa wyrażenia z $x$, na przykład $7mx$ i $2x$, najpierw grupujemy: $$f(x)=7mx+2x+1=(7m+2)x+1.$$ Wtedy $a=7m+2$, nie $a=7m$. Podobnie $f(x)=3x+mx-4=(3+m)x-4$, więc $a=3+m$.",
          },
          ...parameterSchemeBlocks({
            intro:
              "Gdy we wzorze jest parametr, najpierw zbieramy wyrazy z $x$ i odczytujemy $a$ oraz $b$ jako wyrażenia. Potem układamy warunek z zadania i rozwiązujemy go względem parametru.",
            tasks: [
              {
                prompt: "Wyznacz $a$ i $b$ dla $f(x)=(2m-1)x+m-4$.",
                steps: [
                  "Wyraz z $x$ to $(2m-1)x$, więc $a=2m-1$.",
                  "Wyraz wolny to $m-4$, więc $b=m-4$.",
                ],
                result: "$a=2m-1$, $b=m-4$",
                cleanSolution: ["$a=2m-1$", "$b=m-4$"],
              },
              {
                prompt: "Dla jakiego $m$ funkcja $f(x)=(m-5)x+2$ jest stała?",
                steps: [
                  "Funkcja stała ma $a=0$. Tu $a=m-5$.",
                  "Równanie: $m-5=0$, więc $m=5$.",
                  "Dla $m=5$ mamy $f(x)=2$. To funkcja stała.",
                ],
                result: "$m=5$",
                cleanSolution: ["$a=m-5=0$", "$m=5$", "$f(x)=2$"],
              },
            ],
          }),
        ],
      },
      {
        number: "2",
        heading: "Wykres i przecięcia z osiami",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Przecięcie z osią $OY$",
          },
          {
            type: "text",
            contentLevel: "podstawa",
            content:
              "Wykresem funkcji liniowej jest **prosta**. Do narysowania wystarczą dwa punkty. Najwygodniejsze są przecięcia z osiami. Prosta przecina oś $OY$ w punkcie $(0,b)$, bo $f(0)=b$.",
          },
          {
            type: "formula-list",
            contentLevel: "podstawa",
            items: [
              {
                latex: "f(0)=b",
                label: "(1)",
                accent: "blue",
                caption: "przecięcie z osią $OY$: punkt $(0,b)$",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Dla $f(x)=2x+1$ znajdź punkt przecięcia z osią $OY$.",
                  steps: [
                    "Wstawiamy $x=0$: $f(0)=2\\cdot 0+1=1$.",
                    "Ze wzoru (1) punkt to $(0,1)$.",
                  ],
                  result: "Wynik: $(0,1)$.",
                },
              },
            ],
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Miejsce zerowe",
          },
          {
            type: "callout",
            variant: "definition",
            contentLevel: "podstawa",
            title: "Miejsce zerowe",
            content:
              "Miejscem zerowym funkcji $f$ nazywamy liczbę $x_0$ spełniającą $f(x_0)=0$. Na wykresie to punkt przecięcia z osią $OX$. Dla $f(x)=ax+b$ przy $a\\neq 0$ jest dokładnie jedno miejsce zerowe: $x_0=-\\dfrac{b}{a}$.",
          },
          {
            type: "formula-list",
            contentLevel: "podstawa",
            items: [
              {
                latex: "ax+b=0\\quad (a\\neq 0)",
                label: "(2)",
                accent: "blue",
                caption: "miejsce zerowe, przecięcie z osią $OX$: punkt $\\left(-\\dfrac{b}{a},0\\right)$",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Dla $f(x)=2x+1$ znajdź miejsce zerowe.",
                  steps: [
                    "Rozwiązujemy $2x+1=0$, więc $2x=-1$ i $x=-\\dfrac{1}{2}$.",
                    "Ze wzoru (2) punkt to $\\left(-\\dfrac{1}{2},0\\right)$.",
                  ],
                  result: "Wynik: $\\left(-\\dfrac{1}{2},0\\right)$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawa",
            title: "Gdy $a=0$",
            content:
              "Wzór (2) wymaga $a\\neq 0$. Gdy $a=0$ i $b\\neq 0$, funkcja jest stała i **nie ma** miejsca zerowego. Gdy $a=0$ i $b=0$, $f(x)=0$ dla każdego $x$.",
          },
          {
            type: "line-graph",
            contentLevel: "podstawa",
            items: [
              {
                title: "Przecięcia z osiami",
                formula: "$f(x)=2x+1$",
                a: 2,
                b: 1,
                xMin: -3,
                xMax: 3,
                yMin: -3,
                yMax: 5,
                points: [
                  { x: 0, y: 1, label: "$(0,1)$", dx: 18, dy: 16 },
                  { x: -0.5, y: 0, label: "$\\left(-\\frac{1}{2},0\\right)$", dx: 12, dy: 16 },
                ],
                caption: "Oś $OY$: $(0,b)=(0,1)$. Miejsce zerowe na osi $OX$: $\\left(-\\dfrac{1}{2},0\\right)$.",
              },
            ],
          },
          ...parameterSchemeBlocks({
            intro:
              "Miejsce zerowe $x_0$ oznacza $f(x_0)=0$. Przecięcie z osią $OY$ to wartość $b$. Wstawiamy warunek z zadania i rozwiązujemy względem parametru.",
            tasks: [
              {
                prompt:
                  "Dla jakiej wartości parametru $m$ funkcja $y=mx+3$ ma miejsce zerowe równe $7$?",
                steps: [
                  "Miejsce zerowe $7$ znaczy $f(7)=0$, więc $7m+3=0$.",
                  "Stąd $7m=-3$ i $m=-\\dfrac{3}{7}$.",
                  "Sprawdzenie: $a=m=-\\dfrac{3}{7}\\neq 0$, więc miejsce zerowe istnieje.",
                  "Punkt na osi $OX$ to $(7,0)$.",
                ],
                result: "$m=-\\dfrac{3}{7}$",
                cleanSolution: [
                  "$7m+3=0$",
                  "$m=-\\dfrac{3}{7}$",
                  "$a\\neq 0$",
                ],
              },
              {
                prompt: "Dla jakiego $m$ funkcja $f(x)=2x+m$ przecina oś $OY$ w punkcie $(0,5)$?",
                steps: [
                  "Przecięcie z $OY$ to $b$. Tu $b=m$.",
                  "Punkt $(0,5)$ oznacza $b=5$, więc $m=5$.",
                  "Wzór: $f(x)=2x+5$.",
                ],
                result: "$m=5$",
                cleanSolution: ["$b=m=5$", "$f(x)=2x+5$"],
              },
            ],
          }),
        ],
      },
      {
        number: "3",
        heading: "Monotoniczność i nachylenie",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Kąt nachylenia",
          },
          {
            type: "text",
            contentLevel: "podstawa",
            content:
              "Tangens kąta nachylenia prostej do dodatniej osi $OX$ to współczynnik kierunkowy.",
          },
          {
            type: "formula-list",
            contentLevel: "podstawa",
            items: [
              {
                latex: "a=\\mathrm{tg}\\,\\alpha",
                label: "(3)",
                accent: "blue",
                caption: "kąt nachylenia prostej do osi $OX$",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Prosta tworzy z osią $OX$ kąt $45^\\circ$. Jaki jest współczynnik kierunkowy? A gdy kąt wynosi $135^\\circ$?",
                  steps: [
                    "Ze wzoru (3): $a=\\mathrm{tg}\\,45^\\circ=1$.",
                    "Dla $135^\\circ$: $\\mathrm{tg}\\,135^\\circ=\\mathrm{tg}\\,(180^\\circ-45^\\circ)=-1$.",
                    "Znak się zgadza: kąt ostry ($45^\\circ$) daje $a>0$ i prostą rosnącą. Kąt rozwarty ($135^\\circ$) daje $a<0$ i prostą malejącą.",
                  ],
                  result: "Wynik: $a=1$ dla $45^\\circ$, $a=-1$ dla $135^\\circ$.",
                },
              },
            ],
          },
          {
            type: "line-graph",
            contentLevel: "podstawa",
            items: [
              {
                title: "Kąt nachylenia",
                formula: "$a=\\mathrm{tg}\\,\\alpha$, tutaj $y=x$ i $\\alpha=45^\\circ$",
                a: 1,
                b: 0,
                xMin: -1,
                xMax: 4,
                yMin: -1,
                yMax: 4,
                showAngle: true,
                showTriangle: true,
                triangleX: 0,
                triangleRun: 1,
                caption: "Trójkąt ma przyprostokątne $1$ i $1$, więc $\\mathrm{tg}\\,\\alpha=\\dfrac{1}{1}=1=a$.",
              },
            ],
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Rosnąca, malejąca, stała",
          },
          {
            type: "list",
            contentLevel: "podstawa",
            items: [
              "Gdy $a>0$, kąt $\\alpha$ jest ostry i funkcja jest **rosnąca**.",
              "Gdy $a<0$, kąt $\\alpha$ jest rozwarty i funkcja jest **malejąca**.",
              "Gdy $a=0$, prosta jest pozioma, $\\alpha=0^\\circ$ i funkcja jest **stała**.",
              "Dla $\\alpha=90^\\circ$ tangens nie istnieje - pionowa prosta nie jest wykresem funkcji liniowej.",
            ],
          },
          {
            type: "line-graph",
            contentLevel: "podstawa",
            items: [
              {
                title: "Rosnąca",
                formula: "$f(x)=2x+1$",
                a: 2,
                b: 1,
                xMin: -3,
                xMax: 3,
                yMin: -3,
                yMax: 5,
                points: [
                  { x: 0, y: 1, label: "$(0,1)$", dx: 18, dy: 16 },
                  { x: -0.5, y: 0, label: "$\\left(-\\frac{1}{2},0\\right)$", dx: 12, dy: 16 },
                ],
                caption: "$a=2>0$, więc prosta idzie w górę. $b=1$, więc przecina oś $OY$ w $(0,1)$.",
              },
              {
                title: "Malejąca",
                formula: "$f(x)=-\\dfrac{1}{2}x+2$",
                a: -0.5,
                b: 2,
                xMin: -3,
                xMax: 5,
                yMin: -2,
                yMax: 5,
                points: [
                  { x: 0, y: 2, label: "$(0,2)$", dx: 14, dy: -22 },
                  { x: 4, y: 0, label: "$(4,0)$", dx: -52, dy: 12 },
                ],
                caption: "$a=-\\dfrac{1}{2}<0$, więc prosta idzie w dół. Miejsce zerowe: $x=4$.",
              },
              {
                title: "Stała",
                formula: "$f(x)=3$",
                a: 0,
                b: 3,
                xMin: -3,
                xMax: 3,
                yMin: -1,
                yMax: 5,
                points: [{ x: 0, y: 3, label: "$(0,3)$", dx: 14, dy: -24 }],
                caption: "$a=0$, więc $f(x)=3$ jest funkcją stałą. Wykres jest równoległy do osi $OX$.",
              },
            ],
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Proste równoległe i prostopadłe",
          },
          {
            type: "line-graph",
            contentLevel: "podstawa",
            items: [
              {
                title: "Proste równoległe",
                formula: "$y=2x+1$ oraz $y=2x-2$",
                xMin: -3,
                xMax: 3,
                yMin: -4,
                yMax: 5,
                lines: [
                  { a: 2, b: 1, color: "#2563eb" },
                  { a: 2, b: -2, color: "#db2777" },
                ],
                caption: "To samo $a$, więc ten sam kąt $\\alpha$ do osi $OX$. Proste są **równoległe**.",
              },
              {
                title: "Proste prostopadłe",
                formula: "$y=x-1$ oraz $y=-x+3$",
                xMin: -1,
                xMax: 5,
                yMin: -1,
                yMax: 5,
                showRightAngle: true,
                lines: [
                  { a: 1, b: -1, color: "#2563eb" },
                  { a: -1, b: 3, color: "#db2777" },
                ],
                caption: "$a_1\\cdot a_2=1\\cdot(-1)=-1$. Kąt przy przecięciu jest prosty.",
              },
            ],
          },
          {
            type: "formula-list",
            contentLevel: "podstawa",
            items: [
              {
                latex: "a_1=a_2",
                label: "(4)",
                accent: "blue",
                caption: "proste równoległe - ten sam kąt nachylenia",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Czy wykresy $f(x)=3x-1$ i $g(x)=3x+4$ są równoległe?",
                  steps: [
                    "Porównujemy współczynniki kierunkowe: $a_f=3$ i $a_g=3$.",
                    "Ze wzoru (4) są równe, więc kąt nachylenia jest ten sam i proste są równoległe.",
                    "Wyrazy wolne są różne ($-1$ i $4$), więc to nie jest ta sama prosta.",
                  ],
                  result: "Wynik: tak, są równoległe i różne.",
                },
              },
              {
                latex: "a_1\\cdot a_2=-1",
                label: "(5)",
                accent: "blue",
                caption: "proste prostopadłe, równoważnie $a_2=-\\dfrac{1}{a_1}$ gdy $a_1\\neq 0$",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Czy wykresy $f(x)=2x-3$ i $g(x)=-\\dfrac{1}{2}x+1$ są prostopadłe? A $f(x)=2x-3$ i $h(x)=2x+5$?",
                  steps: [
                    "Dla $f$ i $g$: $a_f\\cdot a_g=2\\cdot\\left(-\\dfrac{1}{2}\\right)=-1$. Ze wzoru (5) proste są prostopadłe.",
                    "Dla $f$ i $h$: $a_f=a_h=2$, więc ze wzoru (4) są równoległe, nie prostopadłe.",
                  ],
                  result: "Wynik: $f$ i $g$ są prostopadłe. $f$ i $h$ są równoległe.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawa",
            title: "Pozioma i pionowa",
            content:
              "Gdy $a=0$, prosta jest pozioma. Prosta do niej prostopadła byłaby pionowa, a pionowa nie jest wykresem funkcji liniowej. Wzoru (5) wtedy nie stosujemy: iloczyn $0\\cdot a_2$ nigdy nie wynosi $-1$.",
          },
          ...parameterSchemeBlocks({
            intro:
              "Znak $a$ decyduje, czy funkcja rośnie, maleje, czy jest stała. Równoległość i prostopadłość też sprowadzają się do warunków na współczynnik kierunkowy.",
            tasks: [
              {
                prompt: "Dla jakich $m$ funkcja $f(x)=(m-3)x+1$ jest rosnąca?",
                steps: [
                  "Tu $a=m-3$. Funkcja rosnąca, gdy $a>0$.",
                  "Nierówność: $m-3>0$, więc $m>3$.",
                  "Dla $m=3$ byłaby stała, dla $m<3$ malejąca.",
                ],
                result: "$m>3$",
                cleanSolution: ["$a=m-3>0$", "$m>3$"],
              },
              {
                prompt:
                  "Dla jakiego $m$ prosta $y=(2m+1)x$ jest prostopadła do $y=2x-5$?",
                steps: [
                  "Ze wzoru (5): $(2m+1)\\cdot 2=-1$.",
                  "Stąd $4m+2=-1$, $4m=-3$ i $m=-\\dfrac{3}{4}$.",
                  "Sprawdzenie: $a=2\\cdot\\left(-\\dfrac{3}{4}\\right)+1=-\\dfrac{1}{2}\\neq 0$. Wzór (5) wolno stosować.",
                ],
                result: "$m=-\\dfrac{3}{4}$",
                cleanSolution: [
                  "$(2m+1)\\cdot 2=-1$",
                  "$m=-\\dfrac{3}{4}$",
                ],
              },
            ],
          }),
        ],
      },
      {
        number: "4",
        heading: "Przecięcie prostych i układ równań",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Punkt przecięcia",
          },
          {
            type: "text",
            contentLevel: "podstawa",
            content:
              "Weźmy $f(x)=x+1$ oraz $g(x)=-2x+7$. Szukamy punktu, który leży na obu wykresach. W takim punkcie wartości są równe, więc $$x+1=-2x+7.$$ Stąd $3x=6$ i $x=2$. Wtedy $y=2+1=3$. Punkt przecięcia to $(2,3)$.",
          },
          {
            type: "line-graph",
            contentLevel: "podstawa",
            items: [
              {
                title: "Punkt przecięcia",
                formula: "$y=x+1$ oraz $y=-2x+7$",
                xMin: -1,
                xMax: 5,
                yMin: -2,
                yMax: 8,
                lines: [
                  { a: 1, b: 1, color: "#2563eb" },
                  { a: -2, b: 7, color: "#db2777" },
                ],
                points: [{ x: 2, y: 3, label: "$(2,3)$", dx: 20, dy: 6 }],
                caption: "Sprawdzenie w $g$: $-2\\cdot 2+7=3$. Oba wykresy przechodzą przez $(2,3)$.",
              },
            ],
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Interpretacja geometryczna układu",
          },
          {
            type: "callout",
            variant: "insight",
            contentLevel: "podstawa",
            title: "Wniosek",
            content:
              "Gdy $a_1\\neq a_2$, proste przecinają się w dokładnie jednym punkcie. Przyrównujemy prawe strony $$a_1x+b_1=a_2x+b_2,$$ liczymy $x$, a potem $y$ z dowolnego wzoru.",
          },
          {
            type: "callout",
            variant: "definition",
            contentLevel: "podstawa",
            title: "Interpretacja geometryczna układu",
            content:
              "Układ $$\\begin{cases} y=a_1x+b_1 \\\\ y=a_2x+b_2 \\end{cases}$$ to dwa równania i dwie proste. Rozwiązaniem są pary $(x,y)$, które leżą **na obu** prostych naraz, czyli punkty przecięcia wykresów.",
          },
          {
            type: "list",
            contentLevel: "podstawa",
            items: [
              "Gdy $a_1\\neq a_2$, proste przecinają się w jednym punkcie. Układ ma **jedno rozwiązanie**.",
              "Gdy $a_1=a_2$ i $b_1=b_2$, oba równania opisują **tę samą prostą**. Układ ma **nieskończenie wiele** rozwiązań.",
              "Gdy $a_1=a_2$ i $b_1\\neq b_2$, proste są równoległe i różne. Nie mają punktu wspólnego, układ jest **sprzeczny** (brak rozwiązań).",
            ],
          },
          {
            type: "line-graph",
            contentLevel: "podstawa",
            items: [
              {
                title: "Jedno rozwiązanie",
                formula: "$y=x+1$, $y=-x+3$",
                xMin: -2,
                xMax: 4,
                yMin: -1,
                yMax: 5,
                lines: [
                  { a: 1, b: 1, color: "#2563eb" },
                  { a: -1, b: 3, color: "#db2777" },
                ],
                points: [{ x: 1, y: 2, label: "$(1,2)$", dx: 18, dy: 6 }],
                caption: "$a_1\\neq a_2$. Jeden punkt wspólny, jedna para spełniająca układ.",
              },
              {
                title: "Nieskończenie wiele",
                formula: "$y=\\dfrac{1}{2}x+1$",
                a: 0.5,
                b: 1,
                xMin: -3,
                xMax: 3,
                yMin: -1,
                yMax: 4,
                caption: "Te same $a$ i $b$: to jedna prosta. Każdy jej punkt jest rozwiązaniem.",
              },
              {
                title: "Brak rozwiązań",
                formula: "$y=x+2$ oraz $y=x-1$",
                xMin: -3,
                xMax: 3,
                yMin: -3,
                yMax: 4,
                lines: [
                  { a: 1, b: 2, color: "#2563eb" },
                  { a: 1, b: -1, color: "#db2777" },
                ],
                caption: "To samo $a$, różne $b$. Proste równoległe, pusty zbiór rozwiązań.",
              },
            ],
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawa",
            title: "Równoległe to nie zawsze pusto",
            content:
              "Sam warunek $a_1=a_2$ nie rozstrzyga układu. Trzeba jeszcze porównać wyrazy wolne. Przy $b_1=b_2$ jest nieskończenie wiele rozwiązań, przy $b_1\\neq b_2$ zero.",
          },
          ...parameterSchemeBlocks({
            intro:
              "Liczba rozwiązań układu dwóch prostych zależy od $a$ i $b$. Przy parametrze porównujemy te współczynniki po kolei.",
            tasks: [
              {
                prompt:
                  "Dla jakich $m$ wykresy $f(x)=mx+2$ i $g(x)=2x+m$ przecinają się w dokładnie jednym punkcie?",
                steps: [
                  "Tu $a_f=m$, $a_g=2$. Współczynniki są różne, gdy $m\\neq 2$.",
                  "Dla $m\\neq 2$ proste nie są równoległe, więc jest jeden punkt przecięcia.",
                  "Dla $m=2$: $f(x)=2x+2$ i $g(x)=2x+2$. To ta sama prosta, nieskończenie wiele punktów.",
                ],
                result: "$m\\neq 2$",
                cleanSolution: ["$a_f=m$, $a_g=2$", "jeden punkt, gdy $m\\neq 2$"],
              },
              {
                prompt:
                  "Dla jakiego $m$ układ $y=mx+2$, $y=2x+m$ ma nieskończenie wiele rozwiązań?",
                steps: [
                  "Potrzebujemy tej samej prostej: $a_1=a_2$ i $b_1=b_2$.",
                  "$m=2$ oraz $2=m$. Oba warunki to $m=2$.",
                  "Dla $m=2$ oba równania to $y=2x+2$.",
                ],
                result: "$m=2$",
                cleanSolution: ["$m=2$ i $2=m$", "$m=2$"],
              },
            ],
          }),
        ],
      },
      {
        number: "5",
        heading: "Wyznaczanie wzoru",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Z dwóch punktów",
          },
          {
            type: "text",
            contentLevel: "podstawa",
            content:
              "Żeby zapisać $f(x)=ax+b$, potrzebujemy $a$ i $b$. Często znamy dwa punkty na wykresie albo nachylenie i jeden punkt.",
          },
          {
            type: "formula-list",
            contentLevel: "podstawa",
            items: [
              {
                latex: "a=\\dfrac{y_2-y_1}{x_2-x_1}\\quad (x_1\\neq x_2)",
                label: "(6)",
                accent: "blue",
                caption: "współczynnik kierunkowy z dwóch punktów",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Prosta przechodzi przez $A=(1,3)$ i $B=(3,7)$. Znajdź wzór $f(x)$.",
                  steps: [
                    "Ze wzoru (6): $a=\\dfrac{7-3}{3-1}=\\dfrac{4}{2}=2$.",
                    "Wzór ma postać $f(x)=2x+b$. Punkt $A$ leży na prostej, więc $3=2\\cdot 1+b$.",
                    "Stąd $3=2+b$ i $b=1$.",
                    "Sprawdzenie na $B$: $2\\cdot 3+1=7$. Zgadza się.",
                  ],
                  result: "Wynik: $f(x)=2x+1$.",
                },
              },
            ],
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Z nachylenia i punktu",
          },
          {
            type: "callout",
            variant: "insight",
            contentLevel: "podstawa",
            title: "Z nachylenia i punktu",
            content:
              "Jeśli znamy $a$ i punkt $(x_0,y_0)$, wstawiamy do $y_0=ax_0+b$ i wyliczamy $b$. Nie trzeba drugiego punktu. Na przykład: $a=3$ i punkt $(2,1)$. Wtedy $1=3\\cdot 2+b$, więc $1=6+b$ i $b=-5$. Wzór: $f(x)=3x-5$.",
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawa",
            title: "Nie myl kolejności w liczniku",
            content:
              "W $\\dfrac{y_2-y_1}{x_2-x_1}$ obie różnice idą w **tę samą stronę**: drugi minus pierwszy. Jeśli zamienisz tylko jeden znak, $a$ wyjdzie z przeciwnym znakiem i prosta pójdzie w złą stronę.",
          },
          ...parameterSchemeBlocks({
            intro:
              "Parametr może stać w punkcie, przez który ma przejść prosta, albo w nachyleniu. Najpierw wzór (6) albo dany współczynnik $a$, potem $b$.",
            tasks: [
              {
                prompt:
                  "Prosta przechodzi przez $(0,m)$ i $(2,4)$. Dla jakiego $m$ współczynnik kierunkowy wynosi $1$?",
                steps: [
                  "Ze wzoru (6): $a=\\dfrac{4-m}{2-0}=\\dfrac{4-m}{2}$.",
                  "Warunek $a=1$: $\\dfrac{4-m}{2}=1$, więc $4-m=2$ i $m=2$.",
                  "Wtedy $b=m=2$ (punkt $(0,m)$). Wzór: $f(x)=x+2$.",
                  "Sprawdzenie: $2\\cdot 1+2=4$. Punkt $(2,4)$ leży na prostej.",
                ],
                result: "$m=2$, $f(x)=x+2$",
                cleanSolution: [
                  "$a=\\dfrac{4-m}{2}=1$",
                  "$m=2$",
                  "$f(x)=x+2$",
                ],
              },
            ],
          }),
        ],
      },
      {
        number: "6",
        heading: "Przykłady",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawa",
            content:
              "Poniżej zadania od początku do końca. Rozwiązanie jest schowane - kliknij, żeby je zobaczyć.",
          },
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Przykład 1",
            prompt: "Dana jest $f(x)=-3x+6$. Podaj $a$, $b$, miejsce zerowe i $f(2)$. Czy funkcja jest rosnąca?",
            steps: [
              "$a=-3$, $b=6$.",
              "Miejsce zerowe ze wzoru (2): $x=-\\dfrac{6}{-3}=2$, więc punkt $(2,0)$.",
              "$f(2)=-3\\cdot 2+6=-6+6=0$. To się zgadza z miejscem zerowym.",
              "$a=-3<0$, więc funkcja jest **malejąca**, nie rosnąca.",
            ],
            result: "$a=-3$, $b=6$, miejsce zerowe $x=2$, $f(2)=0$, funkcja malejąca",
            cleanSolution: [
              "$a=-3$, $b=6$",
              "$-3x+6=0\\Rightarrow x=2$",
              "$f(2)=0$, malejąca",
            ],
          },
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Przykład 2",
            prompt: "Narysuj wykres $f(x)=\\dfrac{1}{2}x-1$ za pomocą przecięć z osiami.",
            steps: [
              "Oś $OY$ ze wzoru (1): $f(0)=-1$, punkt $(0,-1)$.",
              "Oś $OX$ ze wzoru (2): $\\dfrac{1}{2}x-1=0$, więc $\\dfrac{1}{2}x=1$ i $x=2$. Punkt $(2,0)$.",
              {
                text: "Zaznaczamy oba punkty i prowadzimy prostą.",
                lineGraph: {
                  a: 0.5,
                  b: -1,
                  xMin: -2,
                  xMax: 4,
                  yMin: -3,
                  yMax: 3,
                  width: 280,
                  height: 240,
                  points: [
                    { x: 0, y: -1, label: "$(0,-1)$", dx: 14, dy: 12 },
                    { x: 2, y: 0, label: "$(2,0)$", dx: 12, dy: 14 },
                  ],
                },
              },
              "$a=\\dfrac{1}{2}>0$, więc prosta rośnie, łagodnie.",
            ],
            result: "Punkty $(0,-1)$ i $(2,0)$. Funkcja rosnąca.",
            cleanSolution: ["$(0,-1)$, $(2,0)$", "$a=\\dfrac{1}{2}>0$ rosnąca"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Przykład 3",
            prompt: "Prosta przechodzi przez punkty $A=(-2,1)$ i $B=(2,5)$. Wyznacz wzór funkcji liniowej.",
            steps: [
              "Ze wzoru (6): $a=\\dfrac{5-1}{2-(-2)}=\\dfrac{4}{4}=1$.",
              "Szukamy $b$ z punktu $A$: $1=1\\cdot(-2)+b$, więc $1=-2+b$ i $b=3$.",
              "Wzór: $f(x)=x+3$.",
              "Sprawdzenie na $B$: $2+3=5$. Zgadza się.",
            ],
            result: "$f(x)=x+3$",
            cleanSolution: ["$a=\\dfrac{5-1}{2-(-2)}=1$", "$1=-2+b\\Rightarrow b=3$", "$f(x)=x+3$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Przykład 4",
            prompt:
              "Funkcja $f$ jest liniowa, $f(0)=4$ oraz jest równoległa do $g(x)=-2x+1$. Zapisz wzór $f$.",
            steps: [
              "Równoległość ze wzoru (4): $a_f=a_g=-2$.",
              "$f(0)=4$ to przecięcie z osią $OY$, więc ze wzoru (1) $b=4$.",
              "Wzór: $f(x)=-2x+4$.",
              {
                text: "To samo $a$, różne $b$: wykresy są równoległe i różne.",
                lineGraph: {
                  xMin: -2,
                  xMax: 4,
                  yMin: -3,
                  yMax: 6,
                  width: 280,
                  height: 240,
                  lines: [
                    { a: -2, b: 1, color: "#2563eb" },
                    { a: -2, b: 4, color: "#db2777" },
                  ],
                  points: [
                    { x: 0, y: 1, label: "$(0,1)$", dx: 14, dy: -22 },
                    { x: 0, y: 4, label: "$(0,4)$", dx: 14, dy: -22 },
                  ],
                },
              },
            ],
            result: "$f(x)=-2x+4$",
            cleanSolution: ["$a=-2$ z równoległości", "$b=4$", "$f(x)=-2x+4$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Przykład 5",
            prompt:
              "Wyznacz punkt przecięcia wykresów $f(x)=x+1$ i $g(x)=-2x+7$.",
            steps: [
              "W punkcie przecięcia $f(x)=g(x)$, więc $x+1=-2x+7$.",
              "Stąd $3x=6$ i $x=2$.",
              "Wstawiamy do $f$: $y=2+1=3$. Sprawdzenie w $g$: $-2\\cdot 2+7=3$.",
              {
                text: "Punkt przecięcia to $(2,3)$. To jednocześnie jedyne rozwiązanie układu $y=x+1$, $y=-2x+7$.",
                lineGraph: {
                  xMin: -1,
                  xMax: 5,
                  yMin: -2,
                  yMax: 8,
                  width: 280,
                  height: 240,
                  lines: [
                    { a: 1, b: 1, color: "#2563eb" },
                    { a: -2, b: 7, color: "#db2777" },
                  ],
                  points: [{ x: 2, y: 3, label: "$(2,3)$", dx: 20, dy: 6 }],
                },
              },
            ],
            result: "$(2,3)$",
            cleanSolution: ["$x+1=-2x+7\\Rightarrow x=2$", "$y=3$", "$(2,3)$"],
          },
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Przykład 6",
            prompt:
              "Wykres $f$ jest prostopadły do $g(x)=2x+1$ i przechodzi przez punkt $(0,3)$. Zapisz wzór $f$.",
            steps: [
              "Ze wzoru (5): $a_f\\cdot 2=-1$, więc $a_f=-\\dfrac{1}{2}$.",
              "Punkt $(0,3)$ to przecięcie z osią $OY$, więc ze wzoru (1) $b=3$.",
              "Wzór: $f(x)=-\\dfrac{1}{2}x+3$.",
              {
                text: "Iloczyn współczynników: $-\\dfrac{1}{2}\\cdot 2=-1$, więc proste są prostopadłe.",
                lineGraph: {
                  xMin: -2,
                  xMax: 4,
                  yMin: -1,
                  yMax: 5,
                  width: 280,
                  height: 260,
                  showRightAngle: true,
                  lines: [
                    { a: 2, b: 1, color: "#2563eb" },
                    { a: -0.5, b: 3, color: "#db2777" },
                  ],
                  points: [{ x: 0, y: 3, label: "$(0,3)$", dx: 14, dy: -24 }],
                },
              },
            ],
            result: "$f(x)=-\\dfrac{1}{2}x+3$",
            cleanSolution: [
              "$a\\cdot 2=-1\\Rightarrow a=-\\dfrac{1}{2}$",
              "$b=3$",
              "$f(x)=-\\dfrac{1}{2}x+3$",
            ],
          },
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Przykład 7",
            prompt:
              "Ile rozwiązań ma układ $\\begin{cases} y=3x-1 \\\\ y=3x+2 \\end{cases}$? Podaj interpretację geometryczną.",
            steps: [
              "Współczynniki kierunkowe: $a_1=3$ i $a_2=3$, więc $a_1=a_2$.",
              "Wyrazy wolne: $b_1=-1$ i $b_2=2$ są różne.",
              "Proste są równoległe i różne. Nie mają punktu wspólnego.",
              {
                text: "Interpretacja geometryczna: dwa wykresy nigdy się nie przetną, więc układ jest sprzeczny.",
                lineGraph: {
                  xMin: -2,
                  xMax: 3,
                  yMin: -5,
                  yMax: 8,
                  width: 280,
                  height: 240,
                  lines: [
                    { a: 3, b: -1, color: "#2563eb" },
                    { a: 3, b: 2, color: "#db2777" },
                  ],
                  points: [
                    { x: 0, y: -1, label: "$(0,-1)$", dx: 14, dy: 12 },
                    { x: 0, y: 2, label: "$(0,2)$", dx: 14, dy: 12 },
                  ],
                },
              },
            ],
            result: "Brak rozwiązań. Proste równoległe i różne.",
            cleanSolution: [
              "$a_1=a_2=3$, $b_1\\neq b_2$",
              "proste równoległe i różne",
              "układ sprzeczny",
            ],
          },
        ],
      },
      {
        number: "",
        heading: "Poziom rozszerzony",
        contentLevel: "rozszerzenie",
        blocks: [
          {
            type: "callout",
            variant: "insight",
            contentLevel: "rozszerzenie",
            title: "W przygotowaniu",
            content: "Ten poziom notatki jest jeszcze w przygotowaniu.",
          },
        ],
      },
    ],
  },
  {
    id: "artykul-funkcja-kwadratowa",
    title: "Funkcja kwadratowa",
    description:
      "Postać ogólna, wyróżnik, miejsca zerowe, parabola, postać kanoniczna i iloczynowa oraz optymalizacja.",
    topic: "Funkcje",
    subtopic: "Funkcja kwadratowa",
    contentModes: ["podstawa"],
    levels: ["podstawowy"],
    readMinutes: 24,
    relatedTasks: {
      topicIncludes: ["funkcja kwadratowa", "kwadratow"],
      subtopicIncludes: ["funkcja kwadratowa", "własności funkcji kwadratowej", "kwadratow"],
      questionIncludes: ["funkcja kwadratowa", "parabola", "ax^2", "trójmian"],
      limit: 12,
    },
    legend: [
      { label: "Poziom podstawowy", dot: "bg-blue-500", contentLevel: "podstawa" },
    ],
    sections: [
      {
        number: "1",
        heading: "Postać ogólna",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Definicja",
          },
          {
            type: "callout",
            variant: "definition",
            contentLevel: "podstawa",
            title: "Funkcja kwadratowa",
            content:
              "Funkcją kwadratową nazywamy funkcję daną wzorem $$f(x)=ax^2+bx+c,$$ gdzie $a,b,c\\in\\mathbb{R}$ oraz $a\\neq 0$. Dziedzina to zwykle $\\mathbb{R}$.",
            example: {
              prompt: "W $f(x)=2x^2-3x+1$ wskaż $a$, $b$ i $c$. Oblicz $f(2)$.",
              right:
                "$a=2$, $b=-3$, $c=1$. Wartość: $f(2)=2\\cdot 4-3\\cdot 2+1=8-6+1=3$.",
            },
          },
          {
            type: "formula-list",
            contentLevel: "podstawa",
            items: [
              {
                latex: "f(x)=ax^2+bx+c\\quad (a\\neq 0)",
                label: "(1)",
                accent: "blue",
                caption: "postać ogólna funkcji kwadratowej",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Czy $f(x)=5x-1$ jest funkcją kwadratową? A $g(x)=-x^2+4$?",
                  steps: [
                    "W $f$ nie ma $x^2$, więc to funkcja liniowa, nie kwadratowa.",
                    "W $g$ jest $a=-1\\neq 0$, $b=0$, $c=4$. To funkcja kwadratowa.",
                  ],
                  result: "Wynik: $f$ nie, $g$ tak.",
                },
              },
            ],
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Warunek $a\\neq 0$",
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawa",
            title: "Musi być $a\\neq 0$",
            content:
              "Jeśli $a=0$, wzór $bx+c$ opisuje funkcję liniową (albo stałą). Żeby mówić o funkcji kwadratowej, współczynnik przy $x^2$ nie może zniknąć.",
          },
          ...parameterSchemeBlocks({
            intro:
              "Funkcja jest kwadratowa tylko gdy $a\\neq 0$. Parametr często siedzi właśnie we współczynniku przy $x^2$.",
            tasks: [
              {
                prompt:
                  "Dla jakich $m$ wzór $f(x)=(m-1)x^2+3x-2$ opisuje funkcję kwadratową?",
                steps: [
                  "Tu $a=m-1$, $b=3$, $c=-2$.",
                  "Potrzebujemy $a\\neq 0$, więc $m-1\\neq 0$ i $m\\neq 1$.",
                  "Dla $m=1$ zostaje $f(x)=3x-2$, czyli funkcja liniowa.",
                ],
                result: "$m\\neq 1$",
                cleanSolution: ["$a=m-1\\neq 0$", "$m\\neq 1$"],
              },
            ],
          }),
        ],
      },
      {
        number: "2",
        heading: "Wyróżnik",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawa",
            content:
              "Wyróżnik $\\Delta$ (delta) trójmianu kwadratowego $ax^2+bx+c$ mówi, ile miejsc zerowych ma funkcja.",
          },
          {
            type: "formula-list",
            contentLevel: "podstawa",
            items: [
              {
                latex: "\\Delta=b^2-4ac",
                label: "(2)",
                accent: "blue",
                caption: "wyróżnik trójmianu kwadratowego",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Oblicz $\\Delta$ dla $f(x)=x^2-5x+6$.",
                  steps: [
                    "Tu $a=1$, $b=-5$, $c=6$.",
                    "Ze wzoru (2): $\\Delta=(-5)^2-4\\cdot 1\\cdot 6=25-24=1$.",
                  ],
                  result: "Wynik: $\\Delta=1$.",
                },
              },
            ],
          },
          ...parameterSchemeBlocks({
            intro:
              "Najpierw liczymy $\\Delta$ jako wyrażenie z parametrem. Potem znak $\\Delta$ mówi, ile miejsc zerowych będzie.",
            tasks: [
              {
                prompt:
                  "Dana jest $f(x)=x^2+mx+1$. Dla jakich $m$ wyróżnik jest dodatni, równy zero, ujemny?",
                steps: [
                  "$a=1\\neq 0$, $b=m$, $c=1$. Ze wzoru (2): $\\Delta=m^2-4$.",
                  "$\\Delta>0$: $m^2-4>0$, więc $|m|>2$, czyli $m\\in(-\\infty,-2)\\cup(2,\\infty)$.",
                  "$\\Delta=0$: $m^2=4$, więc $m=2$ lub $m=-2$.",
                  "$\\Delta<0$: $|m|<2$, czyli $m\\in(-2,2)$.",
                ],
                result:
                  "$\\Delta>0$ dla $|m|>2$, $\\Delta=0$ dla $m=\\pm 2$, $\\Delta<0$ dla $|m|<2$",
                cleanSolution: [
                  "$\\Delta=m^2-4$",
                  "$|m|>2$, $m=\\pm 2$, $|m|<2$",
                ],
              },
            ],
          }),
        ],
      },
      {
        number: "3",
        heading: "Miejsca zerowe",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Wzory",
          },
          {
            type: "text",
            contentLevel: "podstawa",
            content:
              "Miejsca zerowe funkcji $f(x)=ax^2+bx+c$ to rozwiązania rzeczywiste równania kwadratowego $$ax^2+bx+c=0.$$ Ich liczba zależy od znaku $\\Delta$.",
          },
          {
            type: "formula-list",
            contentLevel: "podstawa",
            items: [
              {
                latex: "x_1=\\dfrac{-b-\\sqrt{\\Delta}}{2a},\\quad x_2=\\dfrac{-b+\\sqrt{\\Delta}}{2a}",
                label: "(3)",
                accent: "blue",
                caption: "dwa miejsca zerowe, gdy $\\Delta>0$",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Znajdź miejsca zerowe $f(x)=x^2-5x+6$.",
                  steps: [
                    "Ze wzoru (2): $\\Delta=25-24=1>0$, więc są dwa miejsca zerowe.",
                    "Ze wzoru (3): $x_1=\\dfrac{5-1}{2}=2$, $x_2=\\dfrac{5+1}{2}=3$.",
                  ],
                  result: "Wynik: $x=2$ oraz $x=3$.",
                },
              },
              {
                latex: "x_1=x_2=-\\dfrac{b}{2a}",
                label: "(4)",
                accent: "blue",
                caption: "jedno miejsce zerowe, gdy $\\Delta=0$",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Znajdź miejsca zerowe $f(x)=x^2-4x+4$.",
                  steps: [
                    "$\\Delta=16-16=0$, więc jest dokładnie jedno miejsce zerowe.",
                    "Ze wzoru (4): $x=-\\dfrac{-4}{2}=2$.",
                  ],
                  result: "Wynik: $x=2$.",
                },
              },
            ],
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Znak $\\Delta$",
          },
          {
            type: "list",
            contentLevel: "podstawa",
            items: [
              "Gdy $\\Delta>0$, są **dwa** różne miejsca zerowe. Wzór (3).",
              "Gdy $\\Delta=0$, jest **dokładnie jedno** miejsce zerowe. Wzór (4).",
              "Gdy $\\Delta<0$, **nie ma** miejsc zerowych w liczbach rzeczywistych.",
            ],
          },
          {
            type: "callout",
            variant: "insight",
            contentLevel: "podstawa",
            title: "Jedno miejsce zerowe to wierzchołek",
            content:
              "Gdy $\\Delta=0$, jedyne miejsce zerowe jest w wierzchołku: $x_1=x_2=p=-\\dfrac{b}{2a}$. Parabola wtedy **dotyka** osi $OX$.",
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Wykresy",
          },
          {
            type: "line-graph",
            contentLevel: "podstawa",
            items: [
              {
                title: "Dwa miejsca zerowe",
                formula: "$f(x)=x^2-x-2$, $\\Delta=9$",
                parabola: true,
                a: 1,
                b: -1,
                c: -2,
                xMin: -3,
                xMax: 4,
                yMin: -4,
                yMax: 5,
                points: [
                  { x: -1, y: 0, label: "$(-1,0)$", dx: -56, dy: -22 },
                  { x: 2, y: 0, label: "$(2,0)$", dx: 12, dy: -22 },
                ],
                caption: "$\\Delta>0$: parabola przecina oś $OX$ w dwóch punktach.",
              },
              {
                title: "Jedno miejsce zerowe",
                formula: "$f(x)=x^2-2x+1$, $\\Delta=0$",
                parabola: true,
                a: 1,
                b: -2,
                c: 1,
                xMin: -1,
                xMax: 3,
                yMin: -1,
                yMax: 5,
                points: [{ x: 1, y: 0, label: "$(1,0)$", dx: 12, dy: -22 }],
                caption: "$\\Delta=0$: parabola **dotyka** osi $OX$ w wierzchołku.",
              },
              {
                title: "Brak miejsc zerowych",
                formula: "$f(x)=x^2+1$, $\\Delta=-4$",
                parabola: true,
                a: 1,
                b: 0,
                c: 1,
                xMin: -3,
                xMax: 3,
                yMin: -1,
                yMax: 6,
                points: [{ x: 0, y: 1, label: "$W=(0,1)$", dx: 14, dy: -24 }],
                caption: "$\\Delta<0$: parabola leży całkiem nad osią $OX$.",
              },
            ],
          },
          ...parameterSchemeBlocks({
            intro:
              "Jeśli miejsce zerowe ma być równe danej liczbie $x_0$, wstawiamy $f(x_0)=0$ i rozwiązujemy względem parametru. Potem sprawdzamy $\\Delta$ i $a\\neq 0$.",
            tasks: [
              {
                prompt:
                  "Dla jakiej wartości parametru $m$ funkcja $f(x)=x^2-mx+2$ ma miejsce zerowe równe $2$?",
                steps: [
                  "Warunek $f(2)=0$: $4-2m+2=0$, więc $6=2m$ i $m=3$.",
                  "Dla $m=3$: $a=1\\neq 0$, $\\Delta=9-8=1>0$. Są dwa miejsca zerowe.",
                  "Ze wzoru (3): $x=\\dfrac{3\\pm 1}{2}$, czyli $x=2$ oraz $x=1$.",
                  "Liczba $2$ rzeczywiście jest miejscem zerowym.",
                ],
                result: "$m=3$",
                cleanSolution: ["$f(2)=0\\Rightarrow m=3$", "$\\Delta=1>0$", "$x=2$ i $x=1$"],
              },
              {
                prompt:
                  "Dla jakich $m$ funkcja $f(x)=x^2+mx+1$ ma dokładnie jedno miejsce zerowe?",
                steps: [
                  "Jedno miejsce zerowe, gdy $\\Delta=0$ i $a\\neq 0$.",
                  "$a=1\\neq 0$, $\\Delta=m^2-4$.",
                  "$m^2-4=0$, więc $m=2$ lub $m=-2$.",
                ],
                result: "$m=2$ lub $m=-2$",
                cleanSolution: ["$\\Delta=m^2-4=0$", "$m=\\pm 2$"],
              },
            ],
          }),
        ],
      },
      {
        number: "4",
        heading: "Wykres: parabola",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Wierzchołek",
          },
          {
            type: "text",
            contentLevel: "podstawa",
            content:
              "Wykresem funkcji kwadratowej jest **parabola** o wierzchołku $W=(p,q)$.",
          },
          {
            type: "formula-list",
            contentLevel: "podstawa",
            items: [
              {
                latex: "p=-\\dfrac{b}{2a}",
                label: "(5)",
                accent: "blue",
                caption: "pierwsza współrzędna wierzchołka",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Dla $f(x)=x^2-4x+3$ znajdź $p$.",
                  steps: [
                    "$a=1$, $b=-4$.",
                    "Ze wzoru (5): $p=-\\dfrac{-4}{2}=2$.",
                  ],
                  result: "Wynik: $p=2$.",
                },
              },
              {
                latex: "q=-\\dfrac{\\Delta}{4a}",
                label: "(6)",
                accent: "blue",
                caption: "druga współrzędna wierzchołka, też $q=f(p)$",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Dla $f(x)=x^2-4x+3$ znajdź $q$.",
                  steps: [
                    "$\\Delta=16-12=4$. Ze wzoru (6): $q=-\\dfrac{4}{4}=-1$.",
                    "Sprawdzenie: $f(2)=4-8+3=-1$. To samo.",
                  ],
                  result: "Wynik: $q=-1$, więc $W=(2,-1)$.",
                },
              },
            ],
          },
          {
            type: "line-graph",
            contentLevel: "podstawa",
            items: [
              {
                title: "Wierzchołek na wykresie",
                formula: "$f(x)=x^2-4x+3$",
                parabola: true,
                a: 1,
                b: -4,
                c: 3,
                xMin: -1,
                xMax: 5,
                yMin: -2,
                yMax: 6,
                showAxis: true,
                points: [
                  { x: 2, y: -1, label: "$W=(2,-1)$", dx: 14, dy: -24 },
                ],
                caption: "Wierzchołek $W=(p,q)$ to najniższy punkt tej paraboli, bo $a>0$.",
              },
            ],
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Ramiona, oś i przecięcie z $OY$",
          },
          {
            type: "list",
            contentLevel: "podstawa",
            items: [
              "Ramiona paraboli są skierowane **do góry**, gdy $a>0$.",
              "Ramiona paraboli są skierowane **do dołu**, gdy $a<0$.",
              "Oś symetrii paraboli ma równanie $x=p$.",
              "Punkt przecięcia z osią $OY$ to $(0,c)$.",
              "Współrzędną $q$ można też policzyć jako wartość funkcji: $q=f(p)$.",
            ],
          },
          {
            type: "line-graph",
            contentLevel: "podstawa",
            items: [
              {
                title: "Ramiona w górę",
                formula: "$f(x)=x^2-2x-1$, $a>0$",
                parabola: true,
                a: 1,
                b: -2,
                c: -1,
                xMin: -2,
                xMax: 4,
                yMin: -3,
                yMax: 5,
                showAxis: true,
                points: [
                  { x: 1, y: -2, label: "$W=(1,-2)$", dx: 14, dy: -24 },
                  { x: 0, y: -1, label: "$(0,-1)$", dx: -62, dy: -22 },
                ],
                caption: "$a=1>0$. Oś $x=1$. Przecięcie z $OY$: $(0,-1)$.",
              },
              {
                title: "Ramiona w dół",
                formula: "$f(x)=-x^2+4x-1$, $a<0$",
                parabola: true,
                a: -1,
                b: 4,
                c: -1,
                xMin: -1,
                xMax: 5,
                yMin: -5,
                yMax: 5,
                showAxis: true,
                points: [
                  { x: 2, y: 3, label: "$W=(2,3)$", dx: 14, dy: -24 },
                  { x: 0, y: -1, label: "$(0,-1)$", dx: -62, dy: 12 },
                ],
                caption: "$a=-1<0$. Oś $x=2$. Przecięcie z $OY$: $(0,-1)$.",
              },
            ],
          },
          ...parameterSchemeBlocks({
            intro:
              "Znak $a$ ustala ramiona. Wierzchołek liczymy ze wzorów (5) i (6), też z parametrem.",
            tasks: [
              {
                prompt:
                  "Dla jakich $m$ ramiona paraboli $f(x)=(m-2)x^2-4x+1$ są skierowane do góry?",
                steps: [
                  "Tu $a=m-2$. Ramiona w górę, gdy $a>0$.",
                  "Nierówność: $m-2>0$, więc $m>2$.",
                  "Dla $m=2$ współczynnik $a$ znika i to już nie jest parabola.",
                ],
                result: "$m>2$",
                cleanSolution: ["$a=m-2>0$", "$m>2$"],
              },
              {
                prompt:
                  "Dla $f(x)=mx^2-4x+1$ przy $m\\neq 0$ znajdź $m$, dla którego $p=1$.",
                steps: [
                  "Ze wzoru (5): $p=\\dfrac{4}{2m}=\\dfrac{2}{m}$.",
                  "Warunek $p=1$: $\\dfrac{2}{m}=1$, więc $m=2$.",
                  "Wtedy $q=f(1)=2-4+1=-1$. Wierzchołek to $(1,-1)$.",
                ],
                result: "$m=2$, $W=(1,-1)$",
                cleanSolution: ["$p=\\dfrac{2}{m}=1$", "$m=2$", "$W=(1,-1)$"],
              },
            ],
          }),
        ],
      },
      {
        number: "5",
        heading: "Postać kanoniczna i iloczynowa",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "text",
            contentLevel: "podstawa",
            content:
              "Oprócz postaci ogólnej funkcję kwadratową zapisuje się jeszcze na dwa sposoby. W postaci kanonicznej widać wierzchołek. W postaci iloczynowej widać miejsca zerowe.",
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Postać kanoniczna",
          },
          {
            type: "formula-list",
            contentLevel: "podstawa",
            items: [
              {
                latex: "f(x)=a(x-p)^2+q",
                label: "(7)",
                accent: "blue",
                caption: "postać kanoniczna",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Zapisz $f(x)=x^2-4x+3$ w postaci kanonicznej.",
                  steps: [
                    "Z (5) i (6): $p=2$, $q=-1$.",
                    "Ze wzoru (7): $f(x)=(x-2)^2-1$.",
                  ],
                  result: "Wynik: $f(x)=(x-2)^2-1$.",
                },
              },
            ],
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Postać iloczynowa",
          },
          {
            type: "formula-list",
            contentLevel: "podstawa",
            items: [
              {
                latex: "f(x)=a(x-x_1)(x-x_2)",
                label: "(8)",
                accent: "blue",
                caption: "postać iloczynowa, gdy $\\Delta\\ge 0$",
                contentLevel: "podstawa",
                example: {
                  level: "podstawowy",
                  prompt: "Zapisz $f(x)=x^2-4x+3$ w postaci iloczynowej.",
                  steps: [
                    "$\\Delta=4>0$, miejsca zerowe $x_1=1$, $x_2=3$.",
                    "Ze wzoru (8): $f(x)=(x-1)(x-3)$.",
                  ],
                  result: "Wynik: $f(x)=(x-1)(x-3)$.",
                },
              },
            ],
          },
          {
            type: "callout",
            variant: "pitfall",
            contentLevel: "podstawa",
            title: "Iloczynowa nie zawsze istnieje",
            content:
              "Postać iloczynowa jest tylko wtedy, gdy $\\Delta\\ge 0$, bo potrzebujemy miejsc zerowych $x_1$ i $x_2$. Gdy $\\Delta=0$, oba miejsca zerowe są równe i wzór to $f(x)=a(x-x_1)^2$.",
          },
          ...parameterSchemeBlocks({
            intro:
              "Postać kanoniczna istnieje zawsze przy $a\\neq 0$. Iloczynowa tylko wtedy, gdy $\\Delta\\ge 0$. Parametr wchodzi do $p$, $q$ albo do miejsc zerowych.",
            tasks: [
              {
                prompt:
                  "Dla jakich $m$ funkcję $f(x)=x^2+mx+1$ można zapisać w postaci iloczynowej?",
                steps: [
                  "$a=1\\neq 0$, $\\Delta=m^2-4$.",
                  "Postać iloczynowa, gdy $\\Delta\\ge 0$, czyli $m^2-4\\ge 0$.",
                  "Stąd $|m|\\ge 2$, czyli $m\\in(-\\infty,-2]\\cup[2,\\infty)$.",
                  "Dla $m=2$: $f(x)=(x+1)^2$. Dla $m=-2$: $f(x)=(x-1)^2$.",
                ],
                result: "$|m|\\ge 2$",
                cleanSolution: ["$\\Delta=m^2-4\\ge 0$", "$|m|\\ge 2$"],
              },
            ],
          }),
        ],
      },
      {
        number: "6",
        heading: "Optymalizacja funkcji kwadratowej",
        contentLevel: "podstawa",
        blocks: [
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Zadanie na start",
            prompt:
              "Prostokąt ma dwa sąsiednie boki o długościach $x$ oraz $10-x$, gdzie $0<x<10$. Wyznacz wartość $x$, dla której pole tego prostokąta jest największe. Oblicz to największe pole.",
            figure: {
              scale: 26,
              parts: [{ x: 0, y: 0, w: 5.4, h: 2.9 }],
              labels: [
                { x: 2.7, y: -0.42, text: "$x$" },
                { x: -0.85, y: 1.45, text: "$10-x$" },
              ],
              caption: "Suma tych dwóch boków wynosi $10$.",
            },
            steps: [
              {
                text: "Pole to długość razy szerokość, więc $$P(x)=x\\cdot(10-x)=10x-x^2.$$ Bok $x$ musi być między $0$ a $10$.",
                figure: {
                  scale: 24,
                  parts: [{ x: 0, y: 0, w: 5.4, h: 2.9 }],
                  labels: [
                    { x: 2.7, y: -0.42, text: "$x$" },
                    { x: -0.85, y: 1.45, text: "$10-x$" },
                    { x: 2.7, y: 1.45, text: "$P$" },
                  ],
                },
              },
              {
                text: "To funkcja kwadratowa $P(x)=10x-x^2$. Przy $x^2$ stoi $a=-1$, więc ramiona idą w dół. Wierzchołek ze wzoru (5): $$p=-\\dfrac{10}{2\\cdot(-1)}=5.$$ Na wykresie widać, że w wierzchołku pole jest **największe**.",
                lineGraph: areaVertexGraph({
                  b: 10,
                  xMax: 10,
                  yMax: 28,
                  yTickStep: 5,
                  vertex: [5, 25],
                }),
              },
              {
                text: "Gdy $x=5$, drugi bok też ma $10-5=5$. Dostajemy kwadrat. Pole: $5\\cdot 5=25$.",
                figure: {
                  scale: 24,
                  parts: [{ x: 0, y: 0, w: 3.4, h: 3.4 }],
                  labels: [
                    { x: 1.7, y: -0.42, text: "$5$" },
                    { x: -0.4, y: 1.7, text: "$5$" },
                  ],
                  caption: "Kwadrat ma największe pole.",
                },
              },
            ],
            result: "Największe pole jest dla $x=5$. Prostokąt jest wtedy kwadratem, a pole wynosi $25$.",
            cleanSolution: [
              "$P(x)=10x-x^2$",
              "$p=5$",
              "$P=25$",
            ],
          },
          {
            type: "text",
            contentLevel: "podstawa",
            content:
              "W takich zadaniach powtarza się ten sam pomysł. Najpierw zapisujesz pole (albo inną wielkość) wzorem z jedną literką. Dostajesz funkcję kwadratową. Największą albo najmniejszą wartość czytasz z wierzchołka, tak jak wyżej.",
          },
          {
            type: "list",
            contentLevel: "podstawa",
            items: [
              "Jeśli przy $x^2$ stoi minus ($a<0$), szukamy **największej** wartości.",
              "Jeśli przy $x^2$ stoi plus ($a>0$), szukamy **najmniejszej** wartości.",
              "Pierwszą współrzędną wierzchołka liczymy ze wzoru (5): $p=-\\dfrac{b}{2a}$.",
              "Na koniec sprawdź, czy to $x$ ma sens. Pamiętaj, że ani pola, ani boki figur geometrcznych nie mogą być ujemne...",
            ],
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Pola różnych figur",
          },
          {
            type: "text",
            contentLevel: "podstawa",
            content:
              "Poniżej zadania o prostokącie, trójkątach i rombie. Schemat jest ten sam: zapisz pole jedną literką i policz wierzchołek.",
          },
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Zadanie 1",
            prompt:
              "Suma długości dwóch sąsiednich boków prostokąta jest równa $16$. Wyznacz długości boków tego prostokąta, przy których jego pole jest największe. Oblicz to największe pole.",
            figure: {
              scale: 26,
              parts: [{ x: 0, y: 0, w: 5.5, h: 2.8 }],
              labels: [
                { x: 2.75, y: -0.42, text: "$x$" },
                { x: -0.85, y: 1.4, text: "$16-x$" },
              ],
              caption: "Boki: $x$ oraz $16-x$.",
            },
            steps: [
              {
                text: "Pole: $$P(x)=x\\cdot(16-x)=16x-x^2.$$",
                figure: {
                  scale: 22,
                  parts: [{ x: 0, y: 0, w: 5.5, h: 2.8 }],
                  labels: [
                    { x: 2.75, y: -0.42, text: "$x$" },
                    { x: -0.85, y: 1.4, text: "$16-x$" },
                    { x: 2.75, y: 1.4, text: "$P$" },
                  ],
                },
              },
              {
                text: "Przy $x^2$ stoi $a=-1<0$, więc w wierzchołku pole jest największe. Ze wzoru (5): $$p=-\\dfrac{16}{2\\cdot(-1)}=8.$$ Na wykresie $W=(8,64)$.",
                lineGraph: areaVertexGraph({
                  b: 16,
                  xMax: 16,
                  yMax: 72,
                  yTickStep: 16,
                  vertex: [8, 64],
                }),
              },
              {
                text: "Drugi bok: $16-8=8$. To kwadrat $8$ na $8$. Pole: $8\\cdot 8=64$.",
                figure: {
                  scale: 22,
                  parts: [{ x: 0, y: 0, w: 3.4, h: 3.4 }],
                  labels: [
                    { x: 1.7, y: -0.42, text: "$8$" },
                    { x: -0.4, y: 1.7, text: "$8$" },
                  ],
                },
              },
            ],
            result: "Boki $8$ i $8$, pole $64$.",
            cleanSolution: [
              "$P(x)=16x-x^2$",
              "$p=8$",
              "$P=64$",
            ],
          },
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Zadanie 2",
            prompt:
              "Suma długości przyprostokątnych trójkąta prostokątnego jest równa $12$. Wyznacz długości tych przyprostokątnych, przy których pole trójkąta jest największe. Oblicz to największe pole.",
            figure: {
              scale: 26,
              outline: [
                { x: 0, y: 3.4 },
                { x: 5.6, y: 3.4 },
                { x: 0, y: 0 },
              ],
              rightAngles: [{ x: 0, y: 3.4, dir: "ne", size: 0.52 }],
              labels: [
                { x: 2.8, y: 3.85, text: "$x$" },
                { x: -0.85, y: 1.7, text: "$12-x$" },
              ],
              caption: "Przyprostokątne: $x$ oraz $12-x$.",
            },
            steps: [
              {
                text: "Pole trójkąta prostokątnego to połowa iloczynu przyprostokątnych: $$P(x)=\\dfrac{1}{2}x\\cdot(12-x)=6x-\\dfrac{1}{2}x^2.$$",
                figure: {
                  scale: 22,
                  outline: [
                    { x: 0, y: 3.4 },
                    { x: 5.6, y: 3.4 },
                    { x: 0, y: 0 },
                  ],
                  rightAngles: [{ x: 0, y: 3.4, dir: "ne", size: 0.52 }],
                  labels: [
                    { x: 2.8, y: 3.85, text: "$x$" },
                    { x: -0.85, y: 1.7, text: "$12-x$" },
                    { x: 1.7, y: 2.35, text: "$P$" },
                  ],
                },
              },
              {
                text: "Przy $x^2$ stoi $a=-\\dfrac{1}{2}<0$, więc w wierzchołku pole jest największe. Ze wzoru (5): $$p=-\\dfrac{6}{2\\cdot\\left(-\\dfrac{1}{2}\\right)}=6.$$ Na wykresie $W=(6,18)$.",
                lineGraph: areaVertexGraph({
                  a: -0.5,
                  b: 6,
                  xMax: 12,
                  yMax: 22,
                  yTickStep: 6,
                  vertex: [6, 18],
                }),
              },
              {
                text: "Druga przyprostokątna: $12-6=6$. Pole: $\\dfrac{1}{2}\\cdot 6\\cdot 6=18$.",
                figure: {
                  scale: 22,
                  outline: [
                    { x: 0, y: 3.4 },
                    { x: 3.4, y: 3.4 },
                    { x: 0, y: 0 },
                  ],
                  rightAngles: [{ x: 0, y: 3.4, dir: "ne", size: 0.52 }],
                  labels: [
                    { x: 1.7, y: 3.85, text: "$6$" },
                    { x: -0.4, y: 1.7, text: "$6$" },
                  ],
                },
              },
            ],
            result: "Przyprostokątne $6$ i $6$, pole $18$.",
            cleanSolution: [
              "$P(x)=6x-\\dfrac{1}{2}x^2$",
              "$p=6$",
              "$P=18$",
            ],
          },
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Zadanie 3",
            prompt:
              "Trójkąt ma podstawę o długości $x$ oraz wysokość opuszczoną na tę podstawę o długości $16-x$, gdzie $0<x<16$. Wyznacz wartość $x$, dla której pole tego trójkąta jest największe. Oblicz to największe pole.",
            figure: {
              scale: 26,
              outline: [
                { x: 0, y: 3.6 },
                { x: 6.4, y: 3.6 },
                { x: 3.2, y: 0 },
              ],
              lines: [{ x1: 3.2, y1: 0, x2: 3.2, y2: 3.6, dashed: true }],
              labels: [
                { x: 3.2, y: 4.05, text: "$x$" },
                { x: 3.85, y: 1.8, text: "$16-x$" },
              ],
              caption: "Podstawa $x$, wysokość $16-x$.",
            },
            steps: [
              {
                text: "Pole trójkąta: $$P(x)=\\dfrac{1}{2}x\\cdot(16-x)=8x-\\dfrac{1}{2}x^2.$$",
                figure: {
                  scale: 22,
                  outline: [
                    { x: 0, y: 3.6 },
                    { x: 6.4, y: 3.6 },
                    { x: 3.2, y: 0 },
                  ],
                  lines: [{ x1: 3.2, y1: 0, x2: 3.2, y2: 3.6, dashed: true }],
                  labels: [
                    { x: 3.2, y: 4.05, text: "$x$" },
                    { x: 3.85, y: 1.8, text: "$16-x$" },
                    { x: 1.7, y: 2.5, text: "$P$" },
                  ],
                },
              },
              {
                text: "Przy $x^2$ stoi $a=-\\dfrac{1}{2}<0$, więc w wierzchołku pole jest największe. Ze wzoru (5): $$p=-\\dfrac{8}{2\\cdot\\left(-\\dfrac{1}{2}\\right)}=8.$$ Na wykresie $W=(8,32)$.",
                lineGraph: areaVertexGraph({
                  a: -0.5,
                  b: 8,
                  xMax: 16,
                  yMax: 36,
                  yTickStep: 8,
                  vertex: [8, 32],
                }),
              },
              {
                text: "Wysokość: $16-8=8$. Pole: $\\dfrac{1}{2}\\cdot 8\\cdot 8=32$.",
                figure: {
                  scale: 22,
                  outline: [
                    { x: 0, y: 3.6 },
                    { x: 6.4, y: 3.6 },
                    { x: 3.2, y: 0 },
                  ],
                  lines: [{ x1: 3.2, y1: 0, x2: 3.2, y2: 3.6, dashed: true }],
                  labels: [
                    { x: 3.2, y: 4.05, text: "$8$" },
                    { x: 3.7, y: 1.8, text: "$8$" },
                  ],
                },
              },
            ],
            result: "Podstawa $8$, wysokość $8$, pole $32$.",
            cleanSolution: [
              "$P(x)=8x-\\dfrac{1}{2}x^2$",
              "$p=8$",
              "$P=32$",
            ],
          },
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Zadanie 4",
            prompt:
              "Suma długości przekątnych rombu jest równa $20$. Wyznacz długości tych przekątnych, przy których pole rombu jest największe. Oblicz to największe pole.",
            figure: {
              scale: 26,
              outline: [
                { x: 3.2, y: 0 },
                { x: 6.4, y: 2.1 },
                { x: 3.2, y: 4.2 },
                { x: 0, y: 2.1 },
              ],
              lines: [
                { x1: 0, y1: 2.1, x2: 6.4, y2: 2.1, dashed: true },
                { x1: 3.2, y1: 0, x2: 3.2, y2: 4.2, dashed: true },
              ],
              labels: [
                { x: 4.9, y: 1.65, text: "$x$" },
                { x: 3.75, y: 0.7, text: "$20-x$" },
              ],
              caption: "Przekątne rombu: $x$ oraz $20-x$.",
            },
            steps: [
              {
                text: "Pole rombu to połowa iloczynu przekątnych. Niech jedna przekątna ma długość $x$, wtedy druga ma $20-x$. Stąd $$P(x)=\\dfrac{1}{2}x\\cdot(20-x)=10x-\\dfrac{1}{2}x^2.$$",
                figure: {
                  scale: 22,
                  outline: [
                    { x: 3.2, y: 0 },
                    { x: 6.4, y: 2.1 },
                    { x: 3.2, y: 4.2 },
                    { x: 0, y: 2.1 },
                  ],
                  lines: [
                    { x1: 0, y1: 2.1, x2: 6.4, y2: 2.1, dashed: true },
                    { x1: 3.2, y1: 0, x2: 3.2, y2: 4.2, dashed: true },
                  ],
                  labels: [
                    { x: 4.9, y: 1.65, text: "$x$" },
                    { x: 3.75, y: 0.7, text: "$20-x$" },
                    { x: 4.7, y: 3.1, text: "$P$" },
                  ],
                },
              },
              {
                text: "Przy $x^2$ stoi $a=-\\dfrac{1}{2}<0$, więc w wierzchołku pole jest największe. Ze wzoru (5): $$p=-\\dfrac{10}{2\\cdot\\left(-\\dfrac{1}{2}\\right)}=10.$$ Na wykresie $W=(10,50)$.",
                lineGraph: areaVertexGraph({
                  a: -0.5,
                  b: 10,
                  xMax: 20,
                  yMax: 56,
                  yTickStep: 10,
                  vertex: [10, 50],
                }),
              },
              {
                text: "Druga przekątna: $20-10=10$. Pole: $\\dfrac{1}{2}\\cdot 10\\cdot 10=50$. Równe przekątne oznaczają, że romb jest kwadratem.",
                figure: {
                  scale: 22,
                  outline: [
                    { x: 2.4, y: 0 },
                    { x: 4.8, y: 2.4 },
                    { x: 2.4, y: 4.8 },
                    { x: 0, y: 2.4 },
                  ],
                  lines: [
                    { x1: 0, y1: 2.4, x2: 4.8, y2: 2.4, dashed: true },
                    { x1: 2.4, y1: 0, x2: 2.4, y2: 4.8, dashed: true },
                  ],
                  labels: [
                    { x: 3.7, y: 2.0, text: "$10$" },
                    { x: 2.85, y: 0.85, text: "$10$" },
                  ],
                },
              },
            ],
            result: "Przekątne $10$ i $10$, pole $50$. Romb jest wtedy kwadratem.",
            cleanSolution: [
              "$P(x)=10x-\\dfrac{1}{2}x^2$",
              "$p=10$",
              "$P=50$",
            ],
          },
          {
            type: "subheading",
            contentLevel: "podstawa",
            title: "Wybiegi ze wspólną ścianą",
          },
          {
            type: "text",
            contentLevel: "podstawa",
            content:
              "Czasem wybiegi stoją obok siebie i dzielą ścianę. Tę wspólną ścianę liczymy w siatce tylko raz. Reszta jest taka sama: zapisujesz pole i liczysz wierzchołek.",
          },
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Zadanie 1",
            prompt:
              "Na płaskiej powierzchni należy zbudować ogrodzenie z siatki wydzielające dwa identyczne wybiegi o wspólnej ścianie wewnętrznej. Podstawą każdego z tych dwóch wybiegów jest prostokąt o bokach $x$ oraz $y$ (jak pokazano na rysunku). Do wykonania tego ogrodzenia należy zużyć $24$ metry bieżące siatki. Oblicz wymiary $x$ oraz $y$ jednego wybiegu, przy których suma pól podstaw tych dwóch wybiegów będzie największa. W obliczeniach pomiń szerokość wejścia na każdy z wybiegów.",
            figure: {
              scale: 24,
              parts: [{ x: 0, y: 0, w: 6.4, h: 3.5, dashed: true }],
              lines: [{ x1: 3.2, y1: 0, x2: 3.2, y2: 3.5, dashed: true }],
              labels: [
                { x: 1.6, y: -0.45, text: "$y$" },
                { x: 4.8, y: -0.45, text: "$y$" },
                { x: -0.4, y: 1.75, text: "$x$" },
                { x: 1.6, y: 1.75, text: "1" },
                { x: 4.8, y: 1.75, text: "2" },
              ],
              caption: "Dwa jednakowe wybiegi. Środkowa ściana jest wspólna, więc liczymy ją raz.",
            },
            steps: [
              {
                text: "Liczymy siatkę. Pionowo są trzy odcinki o długości $x$ (dwa skrajne i jeden wspólny). Poziomo dwa odcinki o długości $2y$. Razem $$3x+4y=24.$$",
                figure: {
                  scale: 22,
                  parts: [{ x: 0, y: 0, w: 6.4, h: 3.5, dashed: true }],
                  lines: [{ x1: 3.2, y1: 0, x2: 3.2, y2: 3.5, dashed: true }],
                  labels: [
                    { x: 1.6, y: -0.45, text: "$y$" },
                    { x: 4.8, y: -0.45, text: "$y$" },
                    { x: -0.4, y: 1.75, text: "$x$" },
                  ],
                },
              },
              "Z $3x+4y=24$ mamy $y=\\dfrac{24-3x}{4}$. Suma pól: $$P=2xy=2x\\cdot\\dfrac{24-3x}{4}=\\dfrac{x(24-3x)}{2}=12x-\\dfrac{3}{2}x^2.$$",
              {
                text: "Przy $x^2$ stoi $a=-\\dfrac{3}{2}<0$, więc w wierzchołku jest maksimum. Ze wzoru (5): $$p=-\\dfrac{12}{2\\cdot\\left(-\\dfrac{3}{2}\\right)}=4.$$ Na wykresie $W=(4,24)$.",
                lineGraph: areaVertexGraph({
                  a: -1.5,
                  b: 12,
                  xMax: 8,
                  yMax: 28,
                  yTickStep: 4,
                  vertex: [4, 24],
                }),
              },
              {
                text: "Gdy $x=4$, wtedy $y=\\dfrac{24-12}{4}=3$. Suma pól: $2\\cdot 4\\cdot 3=24$.",
                figure: {
                  scale: 22,
                  parts: [{ x: 0, y: 0, w: 6.0, h: 4.0, dashed: true }],
                  lines: [{ x1: 3.0, y1: 0, x2: 3.0, y2: 4.0, dashed: true }],
                  labels: [
                    { x: 1.5, y: -0.45, text: "$3$" },
                    { x: 4.5, y: -0.45, text: "$3$" },
                    { x: -0.4, y: 2.0, text: "$4$" },
                  ],
                },
              },
            ],
            result: "Jeden wybieg ma boki $4$ i $3$. Suma pól wynosi $24$.",
            cleanSolution: [
              "$3x+4y=24$",
              "$P(x)=12x-\\dfrac{3}{2}x^2$",
              "$x=4$, $y=3$",
            ],
          },
          {
            type: "guided-example",
            contentLevel: "podstawa",
            title: "Zadanie 2",
            prompt:
              "Na płaskiej powierzchni należy zbudować ogrodzenie z siatki wydzielające trzy identyczne wybiegi o wspólnych ścianach wewnętrznych. Podstawą każdego z tych trzech wybiegów jest prostokąt o bokach $x$ oraz $y$ (jak pokazano na rysunku). Do wykonania tego ogrodzenia należy zużyć $24$ metry bieżące siatki. Oblicz wymiary $x$ oraz $y$ jednego wybiegu, przy których suma pól podstaw tych trzech wybiegów będzie największa. W obliczeniach pomiń szerokość wejścia na każdy z wybiegów.",
            figure: {
              scale: 22,
              parts: [{ x: 0, y: 0, w: 9.6, h: 3.4, dashed: true }],
              lines: [
                { x1: 3.2, y1: 0, x2: 3.2, y2: 3.4, dashed: true },
                { x1: 6.4, y1: 0, x2: 6.4, y2: 3.4, dashed: true },
              ],
              labels: [
                { x: 1.6, y: -0.45, text: "$y$" },
                { x: 4.8, y: -0.45, text: "$y$" },
                { x: 8.0, y: -0.45, text: "$y$" },
                { x: -0.4, y: 1.7, text: "$x$" },
                { x: 1.6, y: 1.7, text: "1" },
                { x: 4.8, y: 1.7, text: "2" },
                { x: 8.0, y: 1.7, text: "3" },
              ],
              caption: "Trzy jednakowe wybiegi. Dwie ściany w środku są wspólne.",
            },
            steps: [
              {
                text: "Pionowo są cztery odcinki o długości $x$. Poziomo dwa odcinki o długości $3y$. Razem $$4x+6y=24.$$ Dzielimy przez $2$: $2x+3y=12$.",
                figure: {
                  scale: 20,
                  parts: [{ x: 0, y: 0, w: 9.6, h: 3.4, dashed: true }],
                  lines: [
                    { x1: 3.2, y1: 0, x2: 3.2, y2: 3.4, dashed: true },
                    { x1: 6.4, y1: 0, x2: 6.4, y2: 3.4, dashed: true },
                  ],
                  labels: [
                    { x: 1.6, y: -0.45, text: "$y$" },
                    { x: 4.8, y: -0.45, text: "$y$" },
                    { x: 8.0, y: -0.45, text: "$y$" },
                    { x: -0.4, y: 1.7, text: "$x$" },
                  ],
                },
              },
              "Z $2x+3y=12$ mamy $y=\\dfrac{12-2x}{3}$. Suma pól: $$P=3xy=3x\\cdot\\dfrac{12-2x}{3}=x(12-2x)=12x-2x^2.$$",
              {
                text: "Przy $x^2$ stoi $a=-2<0$. Ze wzoru (5): $$p=-\\dfrac{12}{2\\cdot(-2)}=3.$$ Na wykresie $W=(3,18)$.",
                lineGraph: areaVertexGraph({
                  a: -2,
                  b: 12,
                  xMax: 6,
                  yMax: 22,
                  yTickStep: 6,
                  vertex: [3, 18],
                }),
              },
              {
                text: "Gdy $x=3$, wtedy $y=\\dfrac{12-6}{3}=2$. Suma pól: $3\\cdot 3\\cdot 2=18$.",
                figure: {
                  scale: 20,
                  parts: [{ x: 0, y: 0, w: 7.2, h: 3.6, dashed: true }],
                  lines: [
                    { x1: 2.4, y1: 0, x2: 2.4, y2: 3.6, dashed: true },
                    { x1: 4.8, y1: 0, x2: 4.8, y2: 3.6, dashed: true },
                  ],
                  labels: [
                    { x: 1.2, y: -0.45, text: "$2$" },
                    { x: 3.6, y: -0.45, text: "$2$" },
                    { x: 6.0, y: -0.45, text: "$2$" },
                    { x: -0.4, y: 1.8, text: "$3$" },
                  ],
                },
              },
            ],
            result: "Jeden wybieg ma boki $3$ i $2$. Suma pól wynosi $18$.",
            cleanSolution: [
              "$4x+6y=24$",
              "$P(x)=12x-2x^2$",
              "$x=3$, $y=2$",
            ],
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

export function isArticleUnavailable(article) {
  return Boolean(article?.unavailable);
}

export const ARTICLE_CONTENT_MODE_ORDER = ["podstawowka", "podstawa", "rozszerzenie"];

export function isArticleContentMode(value) {
  return ARTICLE_CONTENT_MODE_ORDER.includes(value);
}

export function articleContentModeLabel(mode) {
  if (mode === "podstawowka") return "Podstawówka";
  if (mode === "rozszerzenie") return "Rozszerzenie";
  return "Podstawa";
}

export function articleExampleLevelLabel(level) {
  if (level === "rozszerzony") return "Rozszerzenie";
  if (level === "ósmoklasisty" || level === "podstawówka" || level === "podstawowka") {
    return "Podstawówka";
  }
  return "Podstawa";
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
    .filter((part) => isArticleContentMode(part))
    .filter((part) => available.includes(part));
  if (raw.length > 0) return [...new Set(raw)];
  if (available.includes("podstawowka")) return ["podstawowka"];
  if (available.includes("podstawa")) return ["podstawa"];
  return [available[0]];
}

export function defaultArticleContentModes(article) {
  const available = getArticleContentModes(article);
  if (available.includes("podstawowka")) return ["podstawowka"];
  if (available.includes("podstawa")) return ["podstawa"];
  return [available[0]];
}

function resolveNodeContentLevel(node, inherited = "podstawa") {
  if (isArticleContentMode(node?.contentLevel)) {
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
