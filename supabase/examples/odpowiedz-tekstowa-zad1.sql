-- Matura PP maj 2025 (arkusz 2025-maj-2023-pp-matura)
-- Najpierw kolumna + odświeżenie schematu API (inaczej SELECT może nie zwracać pola):
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS odpowiedz_tekstowa text;
NOTIFY pgrst, 'reload schema';

-- Kontrola po UPDATE-ach:
-- SELECT nr, left(odpowiedz_tekstowa, 60) AS fragment
-- FROM tasks WHERE arkusz = '2025-maj-2023-pp-matura' ORDER BY nr;

-- Zadanie 1
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $18$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Wyłączamy czynnik spod pierwiastka:
$$\sqrt{32}=\sqrt{16\cdot 2}=4\sqrt{2}$$
Wtedy
$$(\sqrt{32}-\sqrt{2})^2=(4\sqrt{2}-\sqrt{2})^2=(3\sqrt{2})^2=9\cdot 2=18$$

ALBO

Ze wzoru skróconego mnożenia $(a-b)^2=a^2-2ab+b^2$:
$$(\sqrt{32}-\sqrt{2})^2=32-2\sqrt{64}+2=34-16=18$$

**Odpowiedź: $18$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 1;

-- Zadanie 2
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $31$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
W liczniku wyłączamy wspólny czynnik $5^{12}$:
$$\frac{5^{12}+5^{13}+5^{14}}{5^{12}}=\frac{5^{12}\left(1+5+5^{2}\right)}{5^{12}}=1+5+25=31$$

**Odpowiedź: $31$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 2;

-- Zadanie 3
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $3$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Korzystamy z własności logarytmów:
$$2\log_3 2=\log_3(2^2)=\log_3 4$$
$$\log_3 108-2\log_3 2=\log_3 108-\log_3 4=\log_3\frac{108}{4}=\log_3 27$$
Ponieważ $3^3=27$, otrzymujemy
$$\log_3 27=3$$

**Odpowiedź: $3$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 3;

-- Zadanie 4
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $5x^{2}+24x-5$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Rozwijamy kwadraty:
$$(3x+2)^{2}=9x^{2}+12x+4$$
$$(2x-3)^{2}=4x^{2}-12x+9$$
Odejmujemy:
$$(3x+2)^{2}-(2x-3)^{2}=9x^{2}+12x+4-(4x^{2}-12x+9)=9x^{2}+12x+4-4x^{2}+12x-9=5x^{2}+24x-5$$

ALBO

Korzystamy ze wzoru $a^{2}-b^{2}=(a-b)(a+b)$ dla $a=3x+2$, $b=2x-3$:
$$(3x+2)-(2x-3)=x+5$$
$$(3x+2)+(2x-3)=5x-1$$
$$(x+5)(5x-1)=5x^{2}-x+25x-5=5x^{2}+24x-5$$

**Odpowiedź: $5x^{2}+24x-5$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 4;

-- Zadanie 6
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $[-9,+\infty)$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Rozwiązujemy nierówność:
$$3-2(1-2x)\geq 2x-17$$
$$3-2+4x\geq 2x-17$$
$$1+4x\geq 2x-17$$
$$4x-2x\geq -17-1$$
$$2x\geq -18$$
$$x\geq -9$$
Zbiór rozwiązań to przedział $[-9,+\infty)$.

**Odpowiedź: $[-9,+\infty)$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 6;

-- Zadanie 7
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź: dwa rozwiązania $(-3)$ oraz $0$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Iloczyn jest równy zero wtedy i tylko wtedy, gdy któryś z czynników jest równy zero:
$$2x=0\quad\Rightarrow\quad x=0$$
$$x+3=0\quad\Rightarrow\quad x=-3$$
$$x^{2}+25=0\quad\Rightarrow\quad x^{2}=-25$$
Równanie $x^{2}=-25$ nie ma rozwiązań w zbiorze liczb rzeczywistych, bo $x^{2}+25>0$ dla każdego $x\in\mathbb{R}$.
Zatem równanie ma dokładnie dwa rozwiązania rzeczywiste: $-3$ oraz $0$.

**Odpowiedź: dwa rozwiązania $(-3)$ oraz $0$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 7;

-- Zadanie 8
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $\dfrac{x+1}{x+2}$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Rozkładamy licznik i mianownik:
$$x^{2}+x=x(x+1)$$
$$x^{2}+4x+4=(x+2)^{2}$$
Zatem
$$\frac{x^{2}+x}{x^{2}+4x+4}\cdot\frac{x+2}{x}=\frac{x(x+1)}{(x+2)^{2}}\cdot\frac{x+2}{x}=\frac{x+1}{x+2}$$
(dla $x\neq 0$ oraz $x\neq -2$).

**Odpowiedź: $\dfrac{x+1}{x+2}$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 8;

-- Zadanie 9
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**2 pkt** – zastosowanie poprawnej metody i poprawny wynik: $735000$ zł.
**1 pkt** – zapisanie układu równań pozwalającego obliczyć kwoty przyznane poszczególnym zespołom, np.
$$x+y=1200000\quad\text{oraz}\quad 0{,}13x+0{,}11y=146700$$
ALBO
– zapisanie równania z jedną niewiadomą pozwalającego obliczyć kwotę przyznaną zespołowi A, np.
$$2\%\cdot x=14700$$
$$0{,}13x+0{,}11\cdot(1200000-x)=146700$$
ALBO
– zapisanie równania z jedną niewiadomą pozwalającego obliczyć kwotę przyznaną zespołowi B, np.
$$0{,}13\cdot(1200000-y)+0{,}11y=146700$$
**0 pkt** – rozwiązanie, w którym zastosowano niepoprawną metodę, albo brak rozwiązania.
**Uwagi**
– Jeżeli zdający sprawdza warunki zadania dla wybranych par liczb $x$ oraz $y$ i wskaże właściwą odpowiedź, ale nie uzasadni, że jest to jedyne rozwiązanie zadania, to otrzymuje $1$ punkt za całe rozwiązanie.
– Jeżeli zdający w rozwiązaniu używa wartości przybliżonych i otrzymuje wynik różny od $735000$, to może otrzymać co najwyżej $1$ punkt za całe rozwiązanie.

**Sposoby z klucza CKE**
**Sposób I**
Oznaczmy: $x$ – kwota przyznana zespołowi A, $y$ – kwota przyznana zespołowi B.
Po uwzględnieniu warunków zadania otrzymujemy:
$$x+y=1200000\quad\text{oraz}\quad 0{,}13x+0{,}11y=146700$$
Z pierwszego równania: $y=1200000-x$. Podstawiamy do drugiego:
$$0{,}13x+0{,}11\cdot(1200000-x)=146700$$
$$0{,}13x+132000-0{,}11x=146700$$
$$0{,}02x=14700$$
$$x=735000$$
Zespół A otrzymał $735000$ zł.

**Nasza odpowiedź**
Oznaczamy: $x$ – kwota dla zespołu A, $y$ – kwota dla zespołu B.
$$x+y=1200000$$
$$0{,}13x+0{,}11y=146700$$
Z pierwszego równania $y=1200000-x$, stąd
$$0{,}13x+0{,}11(1200000-x)=146700$$
$$0{,}02x+132000=146700$$
$$0{,}02x=14700$$
$$x=735000$$
Różnica stóp zwrotu wynosi $2\%$, a różnica odsetek względem wspólnej stopy $11\%$ to $146700-0{,}11\cdot 1200000=14700$, więc
$$0{,}02x=14700\quad\Rightarrow\quad x=735000$$

**Odpowiedź: $735000$ zł.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 9;

-- Zadanie 10
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**2 pkt** – zastosowanie poprawnej metody i zapisanie zbioru rozwiązań nierówności:
$$x\in\left(\frac{1}{3},\frac{3}{2}\right)$$
ALBO
– zastosowanie poprawnej metody i przedstawienie zbioru rozwiązań nierówności w postaci graficznej z poprawnie zaznaczonymi końcami przedziału.
**1 pkt** – obliczenie pierwiastków trójmianu kwadratowego $6x^{2}-11x+3$:
$$x_{1}=\frac{1}{3}\quad\text{oraz}\quad x_{2}=\frac{3}{2}$$
**0 pkt** – rozwiązanie, w którym zastosowano niepoprawną metodę, albo brak rozwiązania.
**Uwagi**
– Jeżeli zdający, obliczając pierwiastki trójmianu $6x^{2}-11x+3$, popełni błędy (ale otrzyma dwa różne pierwiastki) i konsekwentnie do popełnionych błędów zapisze zbiór rozwiązań nierówności, to otrzymuje $1$ punkt za całe rozwiązanie.
– Jeżeli zdający wyznacza pierwiastki trójmianu kwadratowego, w przypadku gdy błędnie obliczony przez zdającego wyróżnik $\Delta$ jest ujemny, to otrzymuje $0$ punktów za całe rozwiązanie.
– Jeżeli zdający rozpatruje inny niż podany w zadaniu trójmian kwadratowy, który nie wynika z błędu przekształcenia, i w konsekwencji rozpatruje inną nierówność, to otrzymuje $0$ punktów za całe rozwiązanie.
– Jeżeli zdający poda zbiór rozwiązań w postaci graficznej z poprawnie zaznaczonymi końcami przedziału i jednocześnie zapisze niewłaściwy przedział jako zbiór rozwiązań (np. $x\in\left[\frac{1}{3},\frac{3}{2}\right]$), to otrzymuje $1$ punkt za całe rozwiązanie.
– Jeśli zdający spełni kryterium za $1$ punkt, a następnie zapisze zbiór rozwiązań nierówności w postaci $\left(\frac{3}{2},\frac{1}{3}\right)$, to otrzymuje $2$ punkty (kryterium uwzględniające specyficzne trudności w uczeniu się matematyki).

**Sposoby z klucza CKE**
**Sposób I**
Zapisujemy nierówność w postaci $6x^{2}-11x+3<0$ i obliczamy miejsca zerowe funkcji $y=6x^{2}-11x+3$.
$$\Delta=(-11)^{2}-4\cdot 6\cdot 3=49$$
$$x_{1}=\frac{-(-11)-\sqrt{49}}{2\cdot 6}=\frac{1}{3}$$
$$x_{2}=\frac{-(-11)+\sqrt{49}}{2\cdot 6}=\frac{3}{2}$$
Szkicujemy wykres funkcji $y=6x^{2}-11x+3$:
[[wykres:parabola-zad10]]
Odczytujemy argumenty, dla których funkcja przyjmuje wartości ujemne.
Zbiorem rozwiązań nierówności jest przedział $\left(\frac{1}{3},\frac{3}{2}\right)$:
[[wykres:os-zad10]]

**Nasza odpowiedź**
Przekształcamy nierówność do postaci $6x^{2}-11x+3<0$.
$$\Delta=121-72=49,\quad\sqrt{\Delta}=7$$
$$x=\frac{11\pm 7}{12}$$
$$x_{1}=\frac{4}{12}=\frac{1}{3},\quad x_{2}=\frac{18}{12}=\frac{3}{2}$$
Parabola $y=6x^{2}-11x+3$ jest skierowana ramionami w górę ($a=6>0$), więc $y<0$ między pierwiastkami:
[[wykres:parabola-zad10]]
[[wykres:os-zad10]]
$$x\in\left(\frac{1}{3},\frac{3}{2}\right)$$

**Odpowiedź: $x\in\left(\dfrac{1}{3},\dfrac{3}{2}\right)$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 10;

-- Zadanie 11
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**4 pkt** – poprawne uzupełnienie czterech zdań.
**3 pkt** – poprawne uzupełnienie trzech zdań.
**2 pkt** – poprawne uzupełnienie dwóch zdań.
**1 pkt** – poprawne uzupełnienie jednego zdania.
**0 pkt** – brak spełnienia powyższych kryteriów.
**Uwagi**
– Jeśli zdający pomyli porządek liczb na osi liczbowej przy zachowaniu poprawnych krańców przedziału, np. zapisze, że dziedziną funkcji $f$ jest przedział $(4,-4]$, to otrzymuje $1$ punkt za tak uzupełnione zdanie (kryterium uwzględniające specyficzne trudności w uczeniu się matematyki).

**Sposoby z klucza CKE**
**1.** Dziedziną funkcji $f$ jest przedział $[-4,4)$.
**2.** Zbiorem wartości funkcji $f$ jest przedział $(-3,3]$.
**3.** Zbiorem wszystkich argumentów, dla których funkcja $f$ przyjmuje wartości dodatnie, jest przedział $[-4,3)$.
**4.** Zbiorem wszystkich rozwiązań równania $f(x)=3$ jest przedział $[-2,2]$.

**Nasza odpowiedź**
Odczytujemy z wykresu (i ze wzoru).

**Dziedzina.** Wykres zaczyna się w punkcie zamkniętym $x=-4$ i kończy w punkcie otwartym przy $x=4$, więc
$$D_{f}=[-4,4)$$

**Zbiór wartości.** Największa wartość to $3$ (osiągana). Najmniejsza wartość jest tylko zbliżana przy $x\to 4^{-}$ ($f(x)\to -3$), ale punkt $(4,-3)$ nie należy do wykresu, więc
$$ZW_{f}=(-3,3]$$

**Wartości dodatnie** $f(x)>0$. Na odcinku od $-4$ do miejsca zerowego $x=3$ wykres leży nad osią $Ox$ (w $x=3$ jest $f(3)=0$), więc
$$\{x:f(x)>0\}=[-4,3)$$

**Równanie** $f(x)=3$. Wysokość $y=3$ osiągana jest od $x=-2$ (koniec pierwszego kawałka) przez cały poziomy odcinek aż do $x=2$ włącznie, więc
$$\{x:f(x)=3\}=[-2,2]$$

**Odpowiedź:**
1. $[-4,4)$
2. $(-3,3]$
3. $[-4,3)$
4. $[-2,2]$
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 11;

-- Zadanie 12.1
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**2 pkt** – poprawna metoda i zapisanie wzoru funkcji $f$ w postaci kanonicznej:
$$f(x)=-\frac{1}{3}(x-3)^{2}+6$$
**1 pkt** – zapisanie wzoru funkcji $f$ w postaci $f(x)=a(x-3)^{2}+6$
ALBO
– zapisanie równania z jedną niewiadomą prowadzącego do obliczenia $a$, np.
$$3=a(0-3)^{2}+6$$
ALBO
– obliczenie (lub podanie wraz z uzasadnieniem) współczynnika $a=-\dfrac{1}{3}$.
**0 pkt** – rozwiązanie, w którym zastosowano niepoprawną metodę, albo brak rozwiązania.
**Uwagi**
– Jeżeli zdający zapisze $f(x)=-\dfrac{1}{3}(x-3)^{2}+6$ i nie obliczy (ani nie uzasadni), że $a=-\dfrac{1}{3}$, to otrzymuje $1$ punkt.
– Jeżeli zdający zapisze wzór funkcji $f$ w postaci $f(x)=a(x-3)^{2}+6$ oraz poprawnie obliczy współczynnik $a$, to otrzymuje $2$ punkty.

**Sposoby z klucza CKE**
**Sposób I**
Korzystamy ze wzoru na postać kanoniczną funkcji kwadratowej:
$$f(x)=a(x-3)^{2}+6,\quad a\neq 0$$
Punkt $(0,3)$ leży na wykresie funkcji $f$, więc
$$f(0)=3$$
$$a(0-3)^{2}+6=3$$
$$9a=-3$$
$$a=-\frac{1}{3}$$
Zatem
$$f(x)=-\frac{1}{3}(x-3)^{2}+6$$

**Sposób II**
Korzystamy ze wzoru na postać ogólną:
$$f(x)=ax^{2}+bx+c,\quad a\neq 0$$
Punkty $(0,3)$, $(3,6)$, $(6,3)$ leżą na wykresie funkcji $f$, zatem
$$c=3$$
$$9a+3b+c=6$$
$$36a+6b+c=3$$
czyli
$$9a+3b+3=6\quad\Rightarrow\quad 3a+b=1$$
$$36a+6b+3=3\quad\Rightarrow\quad 6a+b=0$$
Odejmujemy równania stronami:
$$-3a=1\quad\Rightarrow\quad a=-\frac{1}{3}$$
Stąd
$$b=1-3a=1-3\cdot\left(-\frac{1}{3}\right)=2$$
Postać ogólna:
$$f(x)=-\frac{1}{3}x^{2}+2x+3$$
Przekształcamy do postaci kanonicznej:
$$f(x)=-\frac{1}{3}x^{2}+2x+3=-\frac{1}{3}\left(x^{2}-6x-9\right)=-\frac{1}{3}\left(x^{2}-6x+9-18\right)=-\frac{1}{3}\left[(x-3)^{2}-18\right]=-\frac{1}{3}(x-3)^{2}+6$$

**Nasza odpowiedź**
Wierzchołek $(3,6)$ daje od razu postać
$$f(x)=a(x-3)^{2}+6$$
Podstawiamy punkt $(0,3)$:
$$a\cdot 9+6=3\quad\Rightarrow\quad 9a=-3\quad\Rightarrow\quad a=-\frac{1}{3}$$
$$f(x)=-\frac{1}{3}(x-3)^{2}+6$$

**Odpowiedź: $f(x)=-\dfrac{1}{3}(x-3)^{2}+6$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND round(nr::numeric, 1) = 12.1;

-- Zadanie 12.2
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $x=3$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Osią symetrii paraboli jest prosta przechodząca przez wierzchołek i równoległa do osi $Oy$.
Wierzchołek ma współrzędne $(3,6)$, więc osią symetrii jest prosta
$$x=3$$

**Odpowiedź: $x=3$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND round(nr::numeric, 1) = 12.2;

-- Zadanie 12.3
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $6$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Miejsca zerowe funkcji $g$ spełniają $g(x)=0$, czyli $f(x)-3=0$, więc $f(x)=3$.
Z wzoru $f(x)=-\dfrac{1}{3}(x-3)^{2}+6$ otrzymujemy
$$-\frac{1}{3}(x-3)^{2}+6=3$$
$$(x-3)^{2}=9$$
$$x-3=\pm 3$$
$$x_{1}=0,\quad x_{2}=6$$
$$x_{1}+x_{2}=6$$

ALBO

Pierwiastki leżą symetrycznie względem osi $x=3$, a punkt $(0,3)$ leży na wykresie $f$, więc drugim miejscem zerowym $g$ jest $x=6$. Suma wynosi $6$.

**Odpowiedź: $6$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND round(nr::numeric, 1) = 12.3;

-- Zadanie 13
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $3$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Funkcja liniowa $f(x)=(3-m)x-4$ nie ma miejsca zerowego wtedy, gdy jest funkcją stałą różną od zera, czyli gdy współczynnik kierunkowy znika:
$$3-m=0\quad\Rightarrow\quad m=3$$
Wtedy $f(x)=-4\neq 0$ dla każdego $x$, więc rzeczywiście nie ma miejsca zerowego.

**Odpowiedź: $3$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 13;

-- Zadanie 14.1
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $11$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
$$a_{1}=2$$
$$a_{2}=2a_{1}+1=2\cdot 2+1=5$$
$$a_{3}=2a_{2}+1=2\cdot 5+1=11$$

**Odpowiedź: $11$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND round(nr::numeric, 1) = 14.1;

-- Zadanie 14.2
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – obie odpowiedzi poprawne: F, F.
**0 pkt** – odpowiedź niepełna lub niepoprawna albo brak odpowiedzi.

**Nasza odpowiedź**
Mamy $a_{1}=2$, $a_{2}=5$, $a_{3}=11$.

Ciąg arytmetyczny wymaga stałej różnicy kolejnych wyrazów:
$$a_{2}-a_{1}=3,\quad a_{3}-a_{2}=6$$
Różnice nie są równe, więc ciąg **nie jest arytmetyczny** (F).

Ciąg geometryczny wymaga stałego ilorazu kolejnych wyrazów:
$$\frac{a_{2}}{a_{1}}=\frac{5}{2},\quad\frac{a_{3}}{a_{2}}=\frac{11}{5}$$
Ilorazy nie są równe, więc ciąg **nie jest geometryczny** (F).

**Odpowiedź: F, F.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND round(nr::numeric, 1) = 14.2;

-- Zadanie 15
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**3 pkt** – obliczenie i uzasadnienie, że jedyną wartością $m$, dla której ciąg $(2m+11,\ m^{2}+3,\ 5-m)$ jest arytmetyczny i malejący, jest $m=\dfrac{5}{2}$.
**2 pkt** – wyznaczenie wartości $m$, dla których ciąg $(2m+11,\ m^{2}+3,\ 5-m)$ jest arytmetyczny: $m=-2$ oraz $m=\dfrac{5}{2}$
ALBO
– zapisanie równania z jedną niewiadomą $m$, np.
$$\frac{(2m+11)+(5-m)}{2}=m^{2}+3$$
$$(m^{2}+3)-(2m+11)=(5-m)-(m^{2}+3)$$
oraz rozwiązanie co najmniej jednej z trzech nierówności:
– $2m+11>m^{2}+3$ : $m\in(-2,4)$
– $m^{2}+3>5-m$ : $m\in(-\infty,-2)\cup(1,+\infty)$
– $2m+11>5-m$ : $m\in(-2,+\infty)$
ALBO
– obliczenie wszystkich wartości $r$, dla których ciąg jest arytmetyczny: $r=-\dfrac{27}{4}$ lub $r=0$
ALBO
– obliczenie wartości $r$, dla której ciąg jest arytmetyczny i malejący: $r=-\dfrac{27}{4}$.
**1 pkt** – zapisanie równania z jedną niewiadomą $m$, np.
$$\frac{(2m+11)+(5-m)}{2}=m^{2}+3$$
$$(m^{2}+3)-(2m+11)=(5-m)-(m^{2}+3)$$
ALBO
– zapisanie układu równań z dwiema niewiadomymi pozwalającego obliczyć $m$ i $r$, np.
$$m^{2}+3=2m+11+r\quad\text{oraz}\quad 5-m=2m+11+2r$$
ALBO
– rozwiązanie co najmniej jednej z trzech nierówności:
– $2m+11>m^{2}+3$ : $m\in(-2,4)$
– $m^{2}+3>5-m$ : $m\in(-\infty,-2)\cup(1,+\infty)$
– $2m+11>5-m$ : $m\in(-2,+\infty)$.
**0 pkt** – rozwiązanie, w którym zastosowano niepoprawną metodę, albo brak rozwiązania.
**Uwagi**
– Jeżeli zdający myli ciąg arytmetyczny z geometrycznym, to otrzymuje $0$ punktów za całe rozwiązanie, o ile nie nabył prawa do innej liczby punktów (np. za rozwiązanie nierówności $2m+11>m^{2}+3$).
– Jeżeli zdający nie uwzględnia istotnych nawiasów i rozwiązuje równanie postaci $(m^{2}+3)-2m+11=(5-m)-m^{2}+3$, to otrzymuje $0$ punktów za całe rozwiązanie, o ile nie nabył prawa do innej liczby punktów.
– Jeżeli zdający zapisze tylko $m=\dfrac{5}{2}$, to otrzymuje $0$ punktów. Natomiast jeżeli dodatkowo sprawdzi, zapisując odpowiednie obliczenia, że dla tej wartości $m$ spełnione są warunki zadania, ale nie uzasadni, że jest to jedyne rozwiązanie, to otrzymuje $1$ punkt za całe rozwiązanie.
– Jeżeli zdający wyznaczy $m=-2$ oraz $m=\dfrac{5}{2}$ i zapisze, że dla $m=-2$ ciąg nie jest malejący, to otrzymuje $3$ punkty.
– Jeżeli zdający wyznaczy $m=-2$ oraz $m=\dfrac{5}{2}$, a następnie obliczy dla każdej z tych wartości wyrazy ciągu i nie wskaże, że $m=\dfrac{5}{2}$ jest jedyną szukaną wartością, to otrzymuje $2$ punkty za całe rozwiązanie.

**Sposoby z klucza CKE**
**Sposób I**
Z własności ciągu arytmetycznego:
$$\frac{(2m+11)+(5-m)}{2}=m^{2}+3$$
$$m+16=2m^{2}+6$$
$$2m^{2}-m-10=0$$
$$\Delta=(-1)^{2}-4\cdot 2\cdot(-10)=81$$
$$m_{1}=\frac{1-\sqrt{81}}{4}=-2,\quad m_{2}=\frac{1+\sqrt{81}}{4}=\frac{5}{2}$$
Dla $m=-2$ otrzymujemy ciąg $(7,7,7)$, który jest stały.
Dla $m=\dfrac{5}{2}$ otrzymujemy ciąg $\left(16,\dfrac{37}{4},\dfrac{5}{2}\right)$, który jest malejący.
Zatem szukana wartość to $m=\dfrac{5}{2}$.

**Sposób II**
Ciąg jest malejący, gdy
$$(m^{2}+3)-(2m+11)<0\quad\text{oraz}\quad(5-m)-(m^{2}+3)<0$$
$$m^{2}-2m-8<0\quad\text{oraz}\quad -m^{2}-m+2<0$$
$$(m-4)(m+2)<0\quad\text{oraz}\quad -(m+2)(m-1)<0$$
$$m\in(-2,4)\quad\text{oraz}\quad m\in(-\infty,-2)\cup(1,+\infty)$$
Stąd ciąg jest malejący dla $m\in(1,4)$.
Z definicji ciągu arytmetycznego:
$$(m^{2}+3)-(2m+11)=(5-m)-(m^{2}+3)$$
$$2m^{2}-m-10=0$$
$$(m+2)(2m-5)=0$$
$$m=-2\notin(1,4)\quad\text{lub}\quad m=\frac{5}{2}\in(1,4)$$
Zatem $m=\dfrac{5}{2}$.

**Sposób III**
Ze wzoru na $n$-ty wyraz ciągu arytmetycznego:
$$m^{2}+3=2m+11+r$$
$$5-m=2m+11+2r$$
Po przekształceniach otrzymujemy $2m^{2}-m-10=0$, więc $m=-2$ lub $m=\dfrac{5}{2}$.
Ciąg malejący wymaga m.in. $2m+11>5-m$, czyli $m>-2$.
Dla $m=\dfrac{5}{2}$ otrzymujemy ciąg $\left(16,\dfrac{37}{4},\dfrac{5}{2}\right)$, który jest malejący.
Zatem $m=\dfrac{5}{2}$.

**Sposób IV**
Z układu
$$m^{2}+3=2m+11+r$$
$$5-m=2m+11+2r$$
wyznaczamy $m=-\dfrac{2}{3}r-2$ i podstawiamy, otrzymując
$$\frac{4}{9}r^{2}+3r=0$$
Dla ciągu malejącego $r<0$, więc $r=-\dfrac{27}{4}$ oraz
$$m=-\frac{2}{3}\cdot\left(-\frac{27}{4}\right)-2=\frac{5}{2}$$

**Nasza odpowiedź**
Warunek arytmetyczności: środkowy wyraz to średnia arytmetyczna skrajnych
$$\frac{(2m+11)+(5-m)}{2}=m^{2}+3\quad\Rightarrow\quad 2m^{2}-m-10=0$$
$$m=-2\quad\text{lub}\quad m=\frac{5}{2}$$
Dla $m=-2$: ciąg $(7,7,7)$ — stały, nie malejący.
Dla $m=\dfrac{5}{2}$: ciąg $\left(16,\dfrac{37}{4},\dfrac{5}{2}\right)$ — arytmetyczny i malejący.

**Odpowiedź: $m=\dfrac{5}{2}$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 15;

-- Zadanie 16
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $1$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Ciąg geometryczny z $a_{1}=27$, $a_{2}=9$:
$$q=\frac{a_{2}}{a_{1}}=\frac{9}{27}=\frac{1}{3}$$
$$a_{4}=a_{1}q^{3}=27\cdot\left(\frac{1}{3}\right)^{3}=27\cdot\frac{1}{27}=1$$

**Odpowiedź: $1$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 16;

-- Zadanie 17
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $\dfrac{\sqrt{3}}{2}$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
$$\sqrt{3}\tan\alpha=2\sin\alpha$$
$$\sqrt{3}\cdot\frac{\sin\alpha}{\cos\alpha}=2\sin\alpha$$
Ponieważ $\alpha$ jest ostry, $\sin\alpha\neq 0$, więc dzielimy obie strony przez $\sin\alpha$:
$$\frac{\sqrt{3}}{\cos\alpha}=2$$
$$\cos\alpha=\frac{\sqrt{3}}{2}$$

**Odpowiedź: $\dfrac{\sqrt{3}}{2}$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 17;

-- Zadanie 18.1
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $\dfrac{4}{3}$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
$CD$ jest środkową, więc $D$ jest środkiem boku $AB$:
$$AD=DB=\frac{6}{2}=3$$
W trójkącie prostokątnym $ADC$ (kąt prosty przy $A$) mamy $AD=3$, $CD=5$, więc
$$AC=\sqrt{5^{2}-3^{2}}=4$$
Kąt $\alpha=\angle ADC$, zatem
$$\tan\alpha=\frac{AC}{AD}=\frac{4}{3}$$

**Odpowiedź: $\dfrac{4}{3}$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND round(nr::numeric, 1) = 18.1;

-- Zadanie 18.2
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $\dfrac{2}{\sqrt{13}}$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Z zadania 18.1: $AC=4$, $AB=6$. Przeciwprostokątna:
$$BC=\sqrt{AC^{2}+AB^{2}}=\sqrt{16+36}=\sqrt{52}=2\sqrt{13}$$
Kąt $\beta=\angle ABC$, więc
$$\sin\beta=\frac{AC}{BC}=\frac{4}{2\sqrt{13}}=\frac{2}{\sqrt{13}}$$

**Odpowiedź: $\dfrac{2}{\sqrt{13}}$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND round(nr::numeric, 1) = 18.2;

-- Zadanie 19
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $40^{\circ}$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Kąt wpisany $\angle BCA=50^{\circ}$ oparty jest na łuku $AB$, więc kąt środkowy oparty na tym samym łuku:
$$\angle AOB=2\cdot 50^{\circ}=100^{\circ}$$
Trójkąt $AOB$ jest równoramienny ($OA=OB$ — promienie), zatem
$$\angle ABO=\angle OAB=\frac{180^{\circ}-100^{\circ}}{2}=40^{\circ}$$

**Odpowiedź: $40^{\circ}$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 19;

-- Zadanie 20
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $2{,}25$ (lub $\dfrac{9}{4}$).
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Trójkąty $ABC$ i $BDA$ są podobne w kolejności wierzchołków $ABC\sim BDA$, więc odpowiadające boki są proporcjonalne:
$$\frac{|AB|}{|BD|}=\frac{|AC|}{|AB|}$$
$$|AB|=3,\quad |AC|=4$$
$$\frac{3}{|BD|}=\frac{4}{3}$$
$$|BD|=\frac{9}{4}=2{,}25$$

**Odpowiedź: $2{,}25$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 20;

-- Zadanie 21
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – obie odpowiedzi poprawne: F, P.
**0 pkt** – odpowiedź niepełna lub niepoprawna albo brak odpowiedzi.

**Nasza odpowiedź**
Z twierdzenia cosinusów:
$$|AC|^{2}=|AB|^{2}+|BC|^{2}-2\cdot|AB|\cdot|BC|\cdot\cos 60^{\circ}=121+144-2\cdot 11\cdot 12\cdot\frac{1}{2}=265-132=133$$
$$|AC|=\sqrt{133}$$
Boki mają długości $11$, $12$ oraz $\sqrt{133}$ — wszystkie różne, więc trójkąt **nie jest równoramienny** (F).

Pole:
$$P=\frac{1}{2}\cdot|AB|\cdot|BC|\cdot\sin 60^{\circ}=\frac{1}{2}\cdot 11\cdot 12\cdot\frac{\sqrt{3}}{2}=33\sqrt{3}$$
Stwierdzenie o polu jest **prawdziwe** (P).

**Odpowiedź: F, P.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 21;

-- Zadanie 22
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $10$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Środek przekątnych $S$ jest środkiem odcinka $AC$, więc długość przekątnej to $2\cdot|AS|$.
$$|AS|=\sqrt{(4-1)^{2}+(-1-3)^{2}}=\sqrt{9+16}=\sqrt{25}=5$$
$$|AC|=2\cdot 5=10$$

**Odpowiedź: $10$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 22;

-- Zadanie 23
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $(-2)$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Proste równoległe mają równe współczynniki kierunkowe:
$$m-2=-4$$
$$m=-2$$
Dla $m=-2$: $k:\ y=-4x+5$ oraz $l:\ y=-4x+1$ — proste różne i równoległe.

**Odpowiedź: $(-2)$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 23;

-- Zadanie 24
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $(x-2)^{2}+(y-4)^{2}=20$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Środek $S=(2,4)$, punkt $P=(0,0)$ leży na okręgu, więc
$$r^{2}=|SP|^{2}=(0-2)^{2}+(0-4)^{2}=4+16=20$$
Równanie okręgu:
$$(x-2)^{2}+(y-4)^{2}=20$$

**Odpowiedź: $(x-2)^{2}+(y-4)^{2}=20$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 24;

-- Zadanie 25
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**3 pkt** – zastosowanie poprawnej metody i poprawny wynik: $V=64\pi$.
**2 pkt** – zapisanie promienia podstawy stożka: $r=4\sqrt{3}$ oraz zapisanie wysokości stożka: $H=4$
ALBO
– obliczenie kwadratu promienia podstawy stożka: $r^{2}=48$ oraz zapisanie wysokości stożka: $H=4$
ALBO
– zapisanie wysokości stożka: $H=4$ oraz wyznaczenie objętości stożka w zależności od $H$, np. $V=\dfrac{1}{3}\pi(H\sqrt{3})^{2}\cdot H$
ALBO
– zapisanie promienia podstawy stożka: $r=4\sqrt{3}$ oraz wyznaczenie objętości stożka w zależności od $r$, np. $V=\dfrac{1}{3}\pi r^{2}\cdot\dfrac{r}{\sqrt{3}}$
ALBO
– wyznaczenie objętości stożka w zależności od tworzącej $l$, np. $V=\dfrac{1}{3}\pi\left(\dfrac{l\sqrt{3}}{2}\right)^{2}\cdot\dfrac{l}{2}$.
**1 pkt** – zapisanie promienia podstawy stożka: $r=4\sqrt{3}$
ALBO
– zapisanie wysokości stożka: $H=4$
ALBO
– obliczenie kwadratu promienia podstawy stożka: $r^{2}=48$
ALBO
– zapisanie układu równań pozwalającego obliczyć $r$ oraz $H$, np.
$$r=x\sqrt{3},\quad H=x,\quad l=2x,\quad l=8$$
$$\frac{r}{8}=\sin 60^{\circ},\quad\frac{H}{8}=\cos 60^{\circ}$$
$$\frac{1}{2}\cdot 2r\cdot H=\frac{1}{2}\cdot 8\cdot 8\cdot\sin 120^{\circ}\quad\text{oraz}\quad r^{2}+H^{2}=8^{2}$$
$$(2r)^{2}=8^{2}+8^{2}-2\cdot 8\cdot 8\cdot\cos 120^{\circ}\quad\text{oraz}\quad r^{2}+H^{2}=8^{2}$$
ALBO
– wyznaczenie objętości stożka w zależności od $H$, np. $V=\dfrac{1}{3}\pi(H\sqrt{3})^{2}\cdot H$
ALBO
– wyznaczenie objętości stożka w zależności od $r$, np. $V=\dfrac{1}{3}\pi r^{2}\cdot\dfrac{r}{\sqrt{3}}$.
**0 pkt** – rozwiązanie, w którym zastosowano niepoprawną metodę, albo brak rozwiązania.
**Uwagi**
– Jeżeli zdający przyjmuje, że trójkąt $SOB$ jest równoboczny, albo że wysokość stożka jest równa $8$, albo że promień podstawy jest równy $8$, to otrzymuje $0$ punktów za całe rozwiązanie.
– Jeżeli jedynym błędem jest: niepoprawna definicja jednej funkcji trygonometrycznej, błędne twierdzenie Pitagorasa, błędne twierdzenie cosinusów, tożsamość $\sqrt{x^{2}+y^{2}}=x+y$, błędna własność trójkąta $30^{\circ}$–$60^{\circ}$–$90^{\circ}$ (np. $r=4$, $H=4\sqrt{3}$), albo przyjęcie, że $120^{\circ}$ to kąt wycinka tworzącego powierzchnię boczną — i rozwiązanie jest konsekwentne do końca — to zdający może otrzymać $1$ punkt. Przy więcej niż jednym z tych błędów: $0$ punktów (o ile nie nabył prawa do innej liczby punktów).

**Sposoby z klucza CKE**
**Sposób I**
Przyjmujemy: $S$ — wierzchołek, $O$ — spodek wysokości, $r$ — promień podstawy, $H$ — wysokość, $r>0$, $H>0$.
Ponieważ $O$ jest spodkiem wysokości, $|\angle OSB|=60^{\circ}$. W trójkącie prostokątnym $OBS$ (tworząca $|SB|=8$):
$$\sin 60^{\circ}=\frac{r}{8}\quad\Rightarrow\quad r=8\cdot\frac{\sqrt{3}}{2}=4\sqrt{3}$$
$$\cos 60^{\circ}=\frac{H}{8}\quad\Rightarrow\quad H=8\cdot\frac{1}{2}=4$$
$$V=\frac{1}{3}\pi r^{2}H=\frac{1}{3}\pi(4\sqrt{3})^{2}\cdot 4=64\pi$$

**Sposób II**
Z twierdzenia cosinusów w trójkącie $ABS$ ($\angle ASB=120^{\circ}$, $|SA|=|SB|=8$):
$$(2r)^{2}=8^{2}+8^{2}-2\cdot 8\cdot 8\cdot\cos 120^{\circ}$$
$$4r^{2}=128-128\cdot\left(-\frac{1}{2}\right)=192$$
$$r^{2}=48$$
Z twierdzenia Pitagorasa w $OBS$:
$$H^{2}=8^{2}-r^{2}=64-48=16\quad\Rightarrow\quad H=4$$
$$V=\frac{1}{3}\pi r^{2}H=\frac{1}{3}\pi\cdot 48\cdot 4=64\pi$$

**Sposób III**
Przyjmujemy te same oznaczenia: $S$, $O$, $r$, $H$, przy $r>0$, $H>0$.
Pole trójkąta $ABS$:
$$P_{ABS}=\frac{1}{2}\cdot 8\cdot 8\cdot\sin 120^{\circ}=32\cdot\sin 60^{\circ}=32\cdot\frac{\sqrt{3}}{2}=16\sqrt{3}$$
Z drugiej strony $P_{ABS}=\dfrac{1}{2}\cdot 2r\cdot H=rH$, więc
$$rH=16\sqrt{3}$$
Z twierdzenia cosinusów:
$$(2r)^{2}=8^{2}+8^{2}-2\cdot 8\cdot 8\cdot\cos 120^{\circ}$$
$$4r^{2}=128-128\cdot\left(-\frac{1}{2}\right)=192$$
$$r^{2}=48\quad\Rightarrow\quad r=4\sqrt{3}$$
$$V=\frac{1}{3}\pi r^{2}H=\frac{1}{3}\pi\cdot r\cdot(rH)=\frac{1}{3}\pi\cdot 4\sqrt{3}\cdot 16\sqrt{3}=64\pi$$

**Nasza odpowiedź**
Przekrój osiowy: trójkąt równoramienny o kącie $120^{\circ}$ przy wierzchołku i ramionach $8$.
Połowa kąta daje trójkąt $30^{\circ}$–$60^{\circ}$–$90^{\circ}$ z przeciwprostokątną $8$:
$$r=4\sqrt{3},\quad H=4$$
$$V=\frac{1}{3}\pi r^{2}H=64\pi$$

**Odpowiedź: $V=64\pi$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 25;

-- Zadanie 26
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $9\sqrt{3}$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Objętość sześcianu $V=a^{3}=729$, więc
$$a=\sqrt[3]{729}=9$$
Długość przekątnej przestrzennej:
$$d=a\sqrt{3}=9\sqrt{3}$$

**Odpowiedź: $9\sqrt{3}$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 26;

-- Zadanie 27
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $45$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Liczba trzycyfrowa nieparzysta ma cyfrę jedności spośród $\{1,3,5,7,9\}$.
Dokładnie jedna cyfra $0$ może wystąpić tylko na miejscu dziesiątek (na miejscu setek liczba nie byłaby trzycyfrowa, a na miejscu jedności — byłaby parzysta).
Zatem liczby postaci $a0c$, gdzie $a\in\{1,\ldots,9\}$ oraz $c\in\{1,3,5,7,9\}$:
$$9\cdot 5=45$$

**Odpowiedź: $45$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 27;

-- Zadanie 28
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $\dfrac{2}{36}$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
Przestrzeń zdarzeń elementarnych ma $6\cdot 6=36$ wyników jednakowo prawdopodobnych.
Suma oczek równa $11$ występuje dla wyników $(5,6)$ oraz $(6,5)$ — łącznie $2$ wyniki.
$$P(A)=\frac{2}{36}$$

**Odpowiedź: $\dfrac{2}{36}$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 28;

-- Zadanie 29
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**1 pkt** – odpowiedź $6$.
**0 pkt** – inna odpowiedź albo brak odpowiedzi.

**Nasza odpowiedź**
$$\frac{1+2+3+4+5+x+y}{7}=3$$
$$\frac{15+x+y}{7}=3$$
$$15+x+y=21$$
$$x+y=6$$

**Odpowiedź: $6$.**
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 29;

-- Zadanie 30
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**2 pkt** – poprawne uzupełnienie obu zdań: mediana $4{,}5$, dominanta $6$.
**1 pkt** – poprawne uzupełnienie jednego zdania.
**0 pkt** – brak spełnienia powyższych kryteriów.

**Nasza odpowiedź**
Z diagramu odczytujemy liczby uczniów:
ocena $1$ — $1$, ocena $2$ — $3$, ocena $3$ — $4$, ocena $4$ — $4$, ocena $5$ — $5$, ocena $6$ — $7$ (razem $24$).

**Mediana.** Przy $n=24$ mediana to średnia $12$. i $13$. wartości w uporządkowanym ciągu ocen.
Narastająco: oceny $1$–$3$ zajmują pozycje $1$–$8$, ocena $4$ — pozycje $9$–$12$, ocena $5$ — od pozycji $13$.
Zatem $12$. wartość to $4$, $13$. wartość to $5$:
$$\mathrm{Me}=\frac{4+5}{2}=4{,}5$$

**Dominanta.** Najczęściej występuje ocena $6$ ($7$ uczniów).

**Odpowiedź:** mediana $4{,}5$, dominanta $6$.
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 30;

-- Zadanie 31
UPDATE tasks
SET odpowiedz_tekstowa = $cke$
**Zasady oceniania**
**4 pkt** – zastosowanie poprawnej metody i poprawne wyniki, np.
$$P(x)=-2x^{2}+22x+88,\quad D=(0,11),\quad x=\frac{11}{2}$$
**3 pkt** – wyznaczenie poprawnego wzoru na pole powierzchni całkowitej prostopadłościanu $ABCDEFGH$ w zależności od $x$ oraz dziedziny $D$, np.
$$P(x)=-2x^{2}+22x+88,\quad D=(0,11)$$
ALBO
– wyznaczenie poprawnego wzoru $P(x)$ (bez dziedziny) oraz pierwszej współrzędnej wierzchołka wykresu $P$, np.
$$P(x)=-2x^{2}+22x+88,\quad x=\frac{11}{2}$$
**2 pkt** – wyznaczenie poprawnego wzoru $P(x)$ (bez dziedziny), np. $P(x)=-2x^{2}+22x+88$
ALBO
– zapisanie zależności między długościami krawędzi $BF$ i $AB$ oraz zakresu zmienności $x$, np.
$$x+4+|BF|=15\quad\text{oraz}\quad x\in(0,11)$$
**1 pkt** – zapisanie zależności między długościami krawędzi $BF$ i $AB$, np. $x+4+|BF|=15$
ALBO
– zapisanie wzoru na pole powierzchni całkowitej w zależności od $x$ oraz $|BF|$:
$$P=2\cdot\bigl(4x+x\cdot|BF|+4\cdot|BF|\bigr)$$
ALBO
– wyznaczenie zakresu zmienności $x$: $x\in(0,11)$.
**0 pkt** – rozwiązanie, w którym zastosowano niepoprawną metodę, albo brak rozwiązania.
**Uwagi**
– Jeżeli zdający zapisze jedynie $x\in(0,11)$ oraz że szukane $x=\dfrac{11}{2}$, to otrzymuje $1$ punkt. Samo $x=\dfrac{11}{2}$ bez uzasadnienia: $0$ punktów.
– Jeżeli zdający nie zapisze $P$ jako funkcji zmiennej $x$, a jedynie liczy pole dla wybranych długości i na tej podstawie wskazuje maksimum, to otrzymuje $0$ punktów (o ile nie nabył prawa do innej liczby punktów).
– Jeżeli zdający przyjmuje, że ściany $ABFE$ oraz $BCGF$ są przystającymi prostokątami i na tym opiera rozwiązanie, to może otrzymać co najwyżej $2$ punkty.
– Jeżeli zamiast $P(x)$ rozważa $\dfrac{1}{2}P(x)$ albo pole w zależności od długości $BF$, to może otrzymać co najwyżej $3$ punkty.
– Jeżeli stosuje rachunek różniczkowy i nie uzasadni, że w miejscu zerowym pochodnej jest największa wartość $P$, to może otrzymać co najwyżej $3$ punkty.

**Sposoby z klucza CKE**
**Sposób I**
Przyjmujemy oznaczenia jak na rysunku: $|AB|=x$, $|BC|=4$.
Suma długości trzech krawędzi wychodzących z wierzchołka $B$ jest równa $15$:
$$|AB|+|BC|+|BF|=15$$
$$x+4+|BF|=15$$
$$|BF|=11-x$$
Pole powierzchni całkowitej:
$$P=2\cdot\bigl(|AB|\cdot|BC|+|AB|\cdot|BF|+|BC|\cdot|BF|\bigr)$$
Podstawiamy $|AB|=x$, $|BC|=4$, $|BF|=11-x$:
$$P(x)=2\bigl[x\cdot 4+x\cdot(11-x)+4\cdot(11-x)\bigr]$$
$$P(x)=2(4x+11x-x^{2}+44-4x)=2(-x^{2}+11x+44)=-2x^{2}+22x+88$$
Dziedzina: $|AB|=x>0$ oraz $|BF|=11-x>0$, więc
$$D=(0,11)$$
Wykres $P$ to fragment paraboli skierowanej ramionami w dół. Pierwsza współrzędna wierzchołka:
$$p=\frac{-22}{2\cdot(-2)}=\frac{11}{2}\in(0,11)$$
Funkcja $P$ przyjmuje wartość największą dla $x=\dfrac{11}{2}$.
Spośród rozważanych prostopadłościanów największe pole powierzchni całkowitej ma ten, w którym $x=\dfrac{11}{2}$.

**Nasza odpowiedź**
$$|BF|=11-x,\quad x\in(0,11)$$
$$P(x)=-2x^{2}+22x+88$$
Maksimum w wierzchołku paraboli: $x=\dfrac{11}{2}$.

**Odpowiedź:** $P(x)=-2x^{2}+22x+88$, $D=(0,11)$, $x=\dfrac{11}{2}$.
$cke$
WHERE arkusz = '2025-maj-2023-pp-matura'
  AND nr = 31;
