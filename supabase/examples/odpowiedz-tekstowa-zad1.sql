-- Matura PP maj 2025 (arkusz 2025-maj-2023-pp-matura) — zadanie 1
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
