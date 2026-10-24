export const ckeRequirementSections = [
  {
    id: "liczby-rzeczywiste",
    number: "I",
    title: "Liczby rzeczywiste",
    basicLead: "Zakres podstawowy. Uczeń:",
    basic: [
      "wykonuje działania (dodawanie, odejmowanie, mnożenie, dzielenie, potęgowanie, pierwiastkowanie, logarytmowanie) w zbiorze liczb rzeczywistych;",
      {
        text: "przeprowadza proste dowody dotyczące podzielności liczb całkowitych i reszt z dzielenia, np.:",
        points: [
          "dowód podzielności przez 24 iloczynu czterech kolejnych liczb naturalnych,",
          "dowód własności: jeśli liczba przy dzieleniu przez 4 daje resztę 3, to nie jest kwadratem liczby całkowitej;",
        ],
      },
      "stosuje własności pierwiastków dowolnego stopnia, w tym pierwiastków stopnia nieparzystego z liczb ujemnych;",
      "stosuje związek pierwiastkowania z potęgowaniem oraz prawa działań na potęgach i pierwiastkach;",
      "stosuje monotoniczność potęgowania, w szczególności własności: jeśli $x < y$ oraz $a > 1$, to $a^x < a^y$, zaś gdy $x < y$ i $0 < a < 1$, to $a^x > a^y$;",
      "posługuje się pojęciem przedziału liczbowego, zaznacza przedziały na osi liczbowej;",
      "stosuje interpretację geometryczną i algebraiczną wartości bezwzględnej, rozwiązuje równania typu: $|x + 4| = 5$;",
      "wykorzystuje własności potęgowania i pierwiastkowania w sytuacjach praktycznych, w tym do obliczania procentów składanych, zysków z lokat i kosztów kredytów;",
      "stosuje związek logarytmowania z potęgowaniem, posługuje się wzorami na logarytm iloczynu, logarytm ilorazu i logarytm potęgi.",
    ],
    extended:
      "Zakres rozszerzony. Uczeń spełnia wymagania określone dla zakresu podstawowego, a ponadto stosuje wzór na zamianę podstawy logarytmu.",
  },
  {
    id: "wyrazenia-algebraiczne",
    number: "II",
    title: "Wyrażenia algebraiczne",
    basicLead: "Zakres podstawowy. Uczeń:",
    basic: [
      "stosuje wzory skróconego mnożenia na: $(a+b)^2$, $(a-b)^2$, $a^2-b^2$;",
      "dodaje, odejmuje i mnoży wielomiany jednej i wielu zmiennych;",
      "wyłącza poza nawias jednomian z sumy algebraicznej;",
      "mnoży i dzieli wyrażenia wymierne.",
    ],
    extendedLead:
      "Zakres rozszerzony. Uczeń spełnia wymagania określone dla zakresu podstawowego, a ponadto:",
    extended: [
      "dzieli wielomian jednej zmiennej $W(x)$ przez dwumian postaci $x-a$;",
      "rozkłada wielomiany na czynniki metodą wyłączania wspólnego czynnika przed nawias oraz metodą grupowania wyrazów;",
      "znajduje pierwiastki całkowite wielomianu o współczynnikach całkowitych;",
      "stosuje podstawowe własności trójkąta Pascala oraz następujące własności współczynnika dwumianowego (symbolu Newtona): $\\binom{n}{0}=1$, $\\binom{n}{1}=n$, $\\binom{n}{n-1}=n$, $\\binom{n}{n-k}=\\binom{n}{k}$, $\\binom{n}{k}+\\binom{n}{k+1}=\\binom{n+1}{k+1}$;",
      "korzysta ze wzorów na: $a^3+b^3$, $a^3-b^3$, $a^n-b^n$, $(a+b)^n$ i $(a-b)^n$;",
      "dodaje i odejmuje wyrażenia wymierne, np.: $\\dfrac{1}{x+1}-\\dfrac{1}{x}$, $\\dfrac{1}{x}+\\dfrac{1}{x^2}+\\dfrac{1}{x^3}$, $\\dfrac{x+1}{x+2}+\\dfrac{x-1}{x+1}$.",
    ],
  },
  {
    id: "rownania-i-nierownosci",
    number: "III",
    title: "Równania i nierówności",
    basicLead: "Zakres podstawowy. Uczeń:",
    basic: [
      "przekształca równania i nierówności w sposób równoważny, w tym np. przekształca równoważnie równanie $\\dfrac{5}{x+1}=\\dfrac{x+3}{2x-1}$;",
      "interpretuje równania i nierówności liniowe sprzeczne oraz tożsamościowe;",
      "rozwiązuje nierówności liniowe z jedną niewiadomą;",
      "rozwiązuje równania i nierówności kwadratowe;",
      "rozwiązuje równania wielomianowe postaci $W(x)=0$ dla wielomianów doprowadzonych do postaci iloczynowej.",
    ],
    extendedLead:
      "Zakres rozszerzony. Uczeń spełnia wymagania określone dla zakresu podstawowego, a ponadto:",
    extended: [
      "rozwiązuje równania wielomianowe postaci $W(x)=0$ oraz nierówności wielomianowe typu: $W(x)>0$, $W(x)\\ge 0$, $W(x)<0$, $W(x)\\le 0$ dla wielomianów doprowadzonych do postaci iloczynowej lub takich, które dają się doprowadzić do postaci iloczynowej metodą wyłączania wspólnego czynnika przed nawias lub metodą grupowania;",
      "rozwiązuje równania i nierówności wymierne, które dadzą się sprowadzić do równania lub nierówności liniowej lub kwadratowej;",
      "stosuje wzory Viète’a dla równań kwadratowych;",
      "rozwiązuje równania i nierówności z wartością bezwzględną;",
      "analizuje równania i nierówności liniowe z parametrami oraz równania i nierówności kwadratowe z parametrami, w szczególności: wyznacza liczbę rozwiązań w zależności od parametrów, podaje warunki, przy których rozwiązania mają określone znaki bądź należą do określonego przedziału, wyznacza rozwiązania w zależności od parametrów;",
      "rozwiązuje równania wielomianowe, które dają się doprowadzić do równania kwadratowego, w szczególności równania dwukwadratowe;",
      "rozwiązuje równania wymierne postaci $\\dfrac{V(x)}{W(x)}=0$, gdzie wielomiany $V(x)$ i $W(x)$ są zapisane w postaci iloczynowej.",
    ],
  },
  {
    id: "uklady-rownan",
    number: "IV",
    title: "Układy równań",
    basicLead: "Zakres podstawowy. Uczeń:",
    basic: [
      "rozwiązuje układy równań liniowych z dwiema niewiadomymi, podaje interpretację geometryczną układów oznaczonych, nieoznaczonych i sprzecznych;",
      "stosuje układy równań do rozwiązywania zadań tekstowych.",
    ],
    extended:
      "Zakres rozszerzony. Uczeń spełnia wymagania określone dla zakresu podstawowego, a ponadto rozwiązuje układy równań liniowych i kwadratowych z dwiema niewiadomymi, które można sprowadzić do równania kwadratowego lub liniowego, a które nie są trudniejsze niż $$\\begin{cases} x^2+y^2+ax+by=c \\\\ x^2+y^2+dx+ey=f \\end{cases}$$",
  },
  {
    id: "funkcje",
    number: "V",
    title: "Funkcje",
    basicLead: "Zakres podstawowy. Uczeń:",
    basic: [
      "określa funkcje jako jednoznaczne przyporządkowanie za pomocą opisu słownego, tabeli, wykresu, wzoru (także różnymi wzorami na różnych przedziałach);",
      "oblicza wartość funkcji zadanej wzorem algebraicznym;",
      "odczytuje i interpretuje wartości funkcji określonych za pomocą tabel, wykresów, wzorów itp., również w sytuacjach wielokrotnego użycia tego samego źródła informacji lub kilku źródeł jednocześnie;",
      "odczytuje z wykresu funkcji: dziedzinę, zbiór wartości, miejsca zerowe, przedziały monotoniczności, przedziały, w których funkcja przyjmuje wartości większe (nie mniejsze) lub mniejsze (nie większe) od danej liczby, największe i najmniejsze wartości funkcji (o ile istnieją) w danym przedziale domkniętym oraz argumenty, dla których wartości największe i najmniejsze są przez funkcję przyjmowane;",
      "interpretuje współczynniki występujące we wzorze funkcji liniowej;",
      "wyznacza wzór funkcji liniowej na podstawie informacji o jej wykresie lub o jej własnościach;",
      "szkicuje wykres funkcji kwadratowej zadanej wzorem;",
      "interpretuje współczynniki występujące we wzorze funkcji kwadratowej w postaci ogólnej, kanonicznej i iloczynowej (jeśli istnieje);",
      "wyznacza wzór funkcji kwadratowej na podstawie informacji o tej funkcji lub o jej wykresie;",
      "wyznacza największą i najmniejszą wartość funkcji kwadratowej w przedziale domkniętym;",
      "wykorzystuje własności funkcji liniowej i kwadratowej do interpretacji zagadnień geometrycznych, fizycznych itp., także osadzonych w kontekście praktycznym;",
      "na podstawie wykresu funkcji $y=f(x)$ szkicuje wykresy funkcji $y=f(x-a)$, $y=f(x)+b$;",
      "posługuje się funkcją $f(x)=\\dfrac{a}{x}$, w tym jej wykresem, do opisu i interpretacji zagadnień związanych z wielkościami odwrotnie proporcjonalnymi, również w zastosowaniach praktycznych;",
      "posługuje się funkcjami wykładniczą i logarytmiczną, w tym ich wykresami, do opisu i interpretacji zagadnień związanych z zastosowaniami praktycznymi.",
    ],
    extendedLead:
      "Zakres rozszerzony. Uczeń spełnia wymagania określone dla zakresu podstawowego, a ponadto:",
    extended: [
      "na podstawie wykresu funkcji $y=f(x)$ rysuje wykresy funkcji $y=-f(x)$, $y=f(-x)$;",
      "posługuje się złożeniami funkcji;",
      "dowodzi monotoniczności funkcji zadanej wzorem, jak w przykładzie: wykaż, że funkcja $f(x)=\\dfrac{x-1}{x+2}$ jest monotoniczna w przedziale $(-\\infty,-2)$.",
    ],
  },
  {
    id: "ciagi",
    number: "VI",
    title: "Ciągi",
    basicLead: "Zakres podstawowy. Uczeń:",
    basic: [
      "oblicza wyrazy ciągu określonego wzorem ogólnym;",
      "oblicza początkowe wyrazy ciągów określonych rekurencyjnie;",
      "w prostych przypadkach bada, czy ciąg jest rosnący, czy malejący;",
      "sprawdza, czy dany ciąg jest arytmetyczny lub geometryczny;",
      "stosuje wzór na $n$-ty wyraz i na sumę $n$ początkowych wyrazów ciągu arytmetycznego;",
      "stosuje wzór na $n$-ty wyraz i na sumę $n$ początkowych wyrazów ciągu geometrycznego;",
      "wykorzystuje własności ciągów, w tym arytmetycznych i geometrycznych, do rozwiązywania zadań, również osadzonych w kontekście praktycznym.",
    ],
    extendedLead:
      "Zakres rozszerzony. Uczeń spełnia wymagania określone dla zakresu podstawowego, a ponadto:",
    extended: [
      "oblicza granice ciągów, korzystając z granic ciągów typu $\\dfrac{1}{n}$, $\\sqrt[n]{a}$ oraz twierdzeń o granicach sumy, różnicy, iloczynu i ilorazu ciągów zbieżnych, a także twierdzenia o trzech ciągach;",
      "rozpoznaje zbieżne szeregi geometryczne i oblicza ich sumę.",
    ],
  },
  {
    id: "trygonometria",
    number: "VII",
    title: "Trygonometria",
    basicLead: "Zakres podstawowy. Uczeń:",
    basic: [
      "wykorzystuje definicje funkcji: sinus, cosinus i tangens dla kątów od $0^\\circ$ do $180^\\circ$, w szczególności wyznacza wartości funkcji trygonometrycznych dla kątów $30^\\circ$, $45^\\circ$, $60^\\circ$;",
      "korzysta z wzorów $\\sin^2\\alpha+\\cos^2\\alpha=1$, $\\operatorname{tg}\\alpha=\\dfrac{\\sin\\alpha}{\\cos\\alpha}$;",
      "stosuje twierdzenie cosinusów oraz wzór na pole trójkąta $P=\\dfrac{1}{2}\\cdot a\\cdot b\\cdot\\sin\\gamma$;",
      "oblicza kąty trójkąta prostokątnego i długości jego boków przy odpowiednich danych (rozwiązuje trójkąty prostokątne, w tym z wykorzystaniem funkcji trygonometrycznych).",
    ],
    extendedLead:
      "Zakres rozszerzony. Uczeń spełnia wymagania określone dla zakresu podstawowego, a ponadto:",
    extended: [
      "stosuje miarę łukową, zamienia stopnie na radiany i odwrotnie;",
      "posługuje się wykresami funkcji trygonometrycznych: sinus, cosinus, tangens;",
      "wykorzystuje okresowość funkcji trygonometrycznych;",
      "stosuje wzory redukcyjne dla funkcji trygonometrycznych;",
      "korzysta z wzorów na sinus, cosinus i tangens sumy i różnicy kątów, a także na funkcje trygonometryczne kątów podwojonych;",
      "rozwiązuje równania trygonometryczne;",
      "stosuje twierdzenie sinusów;",
      "oblicza kąty trójkąta i długości jego boków przy odpowiednich danych (rozwiązuje trójkąty).",
    ],
  },
  {
    id: "planimetria",
    number: "VIII",
    title: "Planimetria",
    basicLead: "Zakres podstawowy. Uczeń:",
    basic: [
      "wyznacza promienie i średnice okręgów, długości cięciw okręgów oraz odcinków stycznych, w tym z wykorzystaniem twierdzenia Pitagorasa;",
      "rozpoznaje trójkąty ostrokątne, prostokątne i rozwartokątne przy danych długościach boków (m.in. stosuje twierdzenie odwrotne do twierdzenia Pitagorasa i twierdzenie cosinusów); stosuje twierdzenie: w trójkącie naprzeciw większego kąta wewnętrznego leży dłuższy bok;",
      "rozpoznaje wielokąty foremne i korzysta z ich podstawowych własności;",
      "korzysta z własności kątów i przekątnych w prostokątach, równoległobokach, rombach i trapezach;",
      "stosuje własności kątów wpisanych i środkowych;",
      "stosuje wzory na pole wycinka koła i długość łuku okręgu;",
      "stosuje twierdzenie Talesa;",
      "korzysta z cech podobieństwa trójkątów;",
      "wykorzystuje zależności między obwodami oraz między polami figur podobnych;",
      "wskazuje podstawowe punkty szczególne w trójkącie: środek okręgu wpisanego w trójkąt, środek okręgu opisanego na trójkącie, ortocentrum, środek ciężkości oraz korzysta z ich własności;",
      "przeprowadza dowody geometryczne;",
      "stosuje funkcje trygonometryczne do wyznaczania długości odcinków w figurach płaskich oraz obliczania pól figur.",
    ],
    extendedLead:
      "Zakres rozszerzony. Uczeń spełnia wymagania określone dla zakresu podstawowego, a ponadto:",
    extended: [
      "stosuje własności czworokątów wpisanych w okrąg i opisanych na okręgu;",
      "stosuje twierdzenie odwrotne do twierdzenia Talesa.",
    ],
  },
  {
    id: "geometria-analityczna",
    number: "IX",
    title: "Geometria analityczna na płaszczyźnie kartezjańskiej",
    basicLead: "Zakres podstawowy. Uczeń:",
    basic: [
      "rozpoznaje wzajemne położenie prostych na płaszczyźnie na podstawie ich równań, w tym znajduje wspólny punkt dwóch prostych, jeśli taki istnieje;",
      "posługuje się równaniami prostych na płaszczyźnie, w postaci kierunkowej i ogólnej, w tym wyznacza równanie prostej o zadanych własnościach (takich, jak np. przechodzenie przez dwa dane punkty, znany współczynnik kierunkowy, równoległość do innej prostej);",
      "oblicza odległość dwóch punktów w układzie współrzędnych;",
      "posługuje się równaniem okręgu $(x-a)^2+(y-b)^2=r^2$;",
      "wyznacza obrazy okręgów i wielokątów w symetriach osiowych względem osi układu współrzędnych, symetrii środkowej (o środku w początku układu współrzędnych).",
    ],
    extendedLead:
      "Zakres rozszerzony. Uczeń spełnia wymagania określone dla zakresu podstawowego, a ponadto:",
    extended: [
      "znajduje punkty wspólne prostej i okręgu;",
      "znajduje punkty wspólne dwóch okręgów;",
      "zna pojęcie wektora i oblicza jego współrzędne oraz długość, dodaje wektory i mnoży wektor przez liczbę, oba te działania wykonuje zarówno analitycznie, jak i geometrycznie;",
      "wyznacza równanie prostej prostopadłej do zadanej prostej i prostej stycznej do zadanego okręgu.",
    ],
  },
  {
    id: "stereometria",
    number: "X",
    title: "Stereometria",
    basicLead: "Zakres podstawowy. Uczeń:",
    basic: [
      "rozpoznaje wzajemne położenie prostych w przestrzeni, w szczególności proste prostopadłe nieprzecinające się;",
      "posługuje się pojęciem kąta między prostą a płaszczyzną oraz pojęciem kąta dwuściennego między półpłaszczyznami;",
      "rozpoznaje w graniastosłupach i ostrosłupach kąty między odcinkami (np. krawędziami, krawędziami i przekątnymi) oraz kąty między ścianami, oblicza miary tych kątów;",
      "rozpoznaje w walcach i w stożkach kąt między odcinkami oraz kąt między odcinkami i płaszczyznami (np. kąt rozwarcia stożka, kąt między tworzącą a podstawą), oblicza miary tych kątów;",
      "oblicza objętości i pola powierzchni graniastosłupów, ostrosłupów, walca, stożka i kuli, również z wykorzystaniem trygonometrii;",
      "wykorzystuje zależność między objętościami brył podobnych.",
    ],
    extendedLead:
      "Zakres rozszerzony. Uczeń spełnia wymagania określone dla zakresu podstawowego, a ponadto:",
    extended: [
      "zna i stosuje twierdzenie o prostej prostopadłej do płaszczyzny i o trzech prostopadłych;",
      "wyznacza przekroje sześcianu i ostrosłupów prawidłowych oraz oblicza ich pola, także z wykorzystaniem trygonometrii.",
    ],
  },
  {
    id: "kombinatoryka",
    number: "XI",
    title: "Kombinatoryka",
    basicLead: "Zakres podstawowy. Uczeń:",
    basic: [
      "zlicza obiekty w prostych sytuacjach kombinatorycznych;",
      {
        text: "zlicza obiekty, stosując reguły mnożenia i dodawania (także łącznie) dla dowolnej liczby czynności, np.:",
        points: [
          "obliczenie, ile jest czterocyfrowych nieparzystych liczb całkowitych dodatnich takich, że w ich zapisie dziesiętnym występuje dokładnie jedna cyfra 1 i dokładnie jedna cyfra 2,",
          "obliczenie, ile jest czterocyfrowych parzystych liczb całkowitych dodatnich takich, że w ich zapisie dziesiętnym występuje dokładnie jedna cyfra 0 i dokładnie jedna cyfra 1.",
        ],
      },
    ],
    extendedLead:
      "Zakres rozszerzony. Uczeń spełnia wymagania określone dla zakresu podstawowego, a ponadto:",
    extended: [
      "oblicza liczbę możliwych sytuacji, spełniających określone kryteria, z wykorzystaniem reguły mnożenia i dodawania (także łącznie) oraz wzorów na liczbę: permutacji, kombinacji i wariacji;",
      "stosuje współczynnik dwumianowy (symbol Newtona) i jego własności przy rozwiązywaniu problemów kombinatorycznych.",
    ],
  },
  {
    id: "rachunek-prawdopodobienstwa",
    number: "XII",
    title: "Rachunek prawdopodobieństwa i statystyka",
    basicLead: "Zakres podstawowy. Uczeń:",
    basic: [
      "oblicza prawdopodobieństwo w modelu klasycznym;",
      "oblicza średnią arytmetyczną i średnią ważoną, znajduje medianę i dominantę.",
    ],
    extendedLead:
      "Zakres rozszerzony. Uczeń spełnia wymagania określone dla zakresu podstawowego, a ponadto:",
    extended: [
      "oblicza prawdopodobieństwo warunkowe i stosuje wzór Bayesa, stosuje twierdzenie o prawdopodobieństwie całkowitym;",
      "stosuje schemat Bernoullego.",
    ],
  },
  {
    id: "optymalizacja",
    number: "XIII",
    title: "Optymalizacja i rachunek różniczkowy",
    basicLead: "Zakres podstawowy.",
    basic:
      "Uczeń rozwiązuje zadania optymalizacyjne w sytuacjach dających się opisać funkcją kwadratową.",
    extendedLead:
      "Zakres rozszerzony. Uczeń spełnia wymagania określone dla zakresu podstawowego, a ponadto:",
    extended: [
      "oblicza granice funkcji (w tym jednostronne);",
      "stosuje własność Darboux do uzasadniania istnienia miejsca zerowego funkcji;",
      "stosuje definicję pochodnej funkcji, podaje interpretację geometryczną i fizyczną pochodnej;",
      "oblicza pochodną funkcji potęgowej o wykładniku rzeczywistym oraz oblicza pochodną, korzystając z twierdzeń o pochodnej sumy, różnicy, iloczynu, ilorazu i funkcji złożonej;",
      "stosuje pochodną do badania monotoniczności funkcji;",
      "rozwiązuje zadania optymalizacyjne z zastosowaniem pochodnej.",
    ],
  },
];
