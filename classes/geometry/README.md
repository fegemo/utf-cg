<!-- {"layout": "title"} -->
# Operações Geométricas
## Uma breve revisão

---
<!-- {"layout": "centered"} -->
# Roteiro

1. [Geometria Afim](#geometria-afim)
1. [Operações básicas](#operacoes-basicas)
1. [Outras operações](#outras-operacoes)
1. [Representação de objetos](#representacao-de-objetos)

---
<!-- {"layout": "regular"} -->
# Problemas Típicos <small>(1/2)</small>

- **Interseção** (ou colisão)
  - Dado um cubo e um raio (uma semi-reta), o raio acerta
    o cubo?
    - Se acerta, em qual face?
    - Se ele refletir dessa face, em qual direção?
- **Transformação**
  - Dados 4 vértices formando um polígono, quais seriam as novas coordenadas se
    o polígono fosse rotacionado 30° no eixo X?
    - Ou então se mudarmos a câmera de posição

---
<!-- {"layout": "regular"} -->
# Problemas Típicos <small>(2/2)</small>

- **Orientação**
  - 3 pontos não-colineares definem um plano. Dado um quarto ponto, ele está
    acima, abaixo ou pertence ao plano?
- **Mudança de coordenadas**
  - Dada uma esfera em um sistema de coordenadas (e.g., polar), quais seriam
    as coordenadas da esfera em um outro sistema de coordenadas
    (_e.g._, cartesiano)?

---
<!-- {"layout": "centered-horizontal"} -->
# Exemplo de problema: **rotação**

Para gerar a segunda figura a partir da primeira, precisamos reescrever as
coordenadas de cada vértice "na mão"?

![Figura mostrando um quadrado](../../images/geometry-square-transform1.png)
![Figura mostrando o mesmo quadrado da figura anterior, porém girado em 45º](../../images/geometry-square-transform2.png)

É possível! Mas dá muito trabalho e **bons programadores são preguiçosos**!

---
<!-- {"layout": "centered-horizontal"} -->
# Exemplo de problema: **rotação** (cont.)

E se quisermos fazer uma animação?

<iframe src="../../samples/rotate/rotate-anim.htm" width="400" height="400" frameborder="0"></iframe>

---
<!-- {"layout": "section-header", "slideClass": "geometria-afim", "hash": "geometria-afim"} -->
# Geometria Afim

1. História
1. Definição
1. Elementos fundamentais

---
<!-- {"layout": "regular"} -->
# **Geometria Afim**

- Por volta de **1600 d.C.**, com Descartes, as coordenadas
  cartesianas foram desenvolvidas
  - Possibilitando conceitos geométricos serem representados algebricamente
- A partir dos anos **1800 d.C.** começou-se a questionar se a geometria
  de Euclides era a única geometria possível
  - Novas geometrias foram propostas:
    - Lobachevski (hiperbólica), Gauss (diferencial)
- Vamos discutir 3 geometrias ao longo da matéria:
  - Geometria euclidiana (300 a.C.)
  - Geometria afim (1800+ d.C.)
  - Geometria projetiva (1900 d.C.)

---
<!-- {"layout": "regular"} -->
# **Definição** de Geometria Afim

- Estudo de propriedades geométricas preservadas por
  transformações afim
  - Informalmente chamada de "estudo das linhas paralelas"
- Conceitos:
  - **Transformação linear**: <span class="math">f(\vec{v})=A\vec{v}</span>
    - Mapeia vetor em vetor
    - Mantém a origem fixa
    - **Exemplos**: <!-- {.alternate-color} --> rotação, escala, reflexão, _shear_
  - **Transformação afim**: <span class="math">f(\vec{v})=A\vec{v}+\vec{b}</span>
    - Permite movimentar origem
    - Daí é possível representar uma translação também
    - **Exemplos**: <!-- {.alternate-color} --> lineares + translação

---
<!-- {"layout": "regular"} -->
# Elementos da Geometria Afim

- Elementos fundamentais:
  - **Escalares**: números reais
  - **Pontos**
  - **Vetores**:
    - Representam apenas um <u>deslocamento em uma direção/sentido</u>
    - Não são posicionados (são **livres** no espaço)
  - ~~Distâncias~~, ~~Ângulos~~
- Não há uma origem fixa do mundo
- Premissa da geometria afim: preservar **paralelismo** e **colinearidade**

---
<!-- {"layout": "regular"} -->
# **Escalar**, **Ponto** e **Vetor**

- **Escalar** <!-- {ul:.layout-split-3 style="height: auto;"} -->
  - Um número real
  - Representa uma **grandeza não geométrica**
  - Notação típica:
    - <span class="math">\alpha, \beta, \gamma, x, t</span>
- **Ponto**
  - Representa uma localização no espaço
  - Notação típica:
    - <span class="math">P, Q, R</span>
- **Vetor**
  - Representa uma grandeza geométrica. Entendido como um deslocamento.
  - Notação típica:
    - <span class="math">\vec{u}, \vec{v}, \vec{w}</span>

Pontos e vetores podem ser representados por um conjunto de coordenadas
(escalares) no espaço (<span class="math">R^2, R^3, R^n</span>). <!-- {p:.note.info style="max-width: 80%; margin-inline: auto;"} -->

---
<!-- {"layout": "section-header", "hash": "operacoes-basicas", "slideClass": "operacoes-basicas-afim"} -->
# Operações Básicas

- Soma e subtração de vetor
- Multiplicação vetor x escalar
- Soma de ponto com vetor
- Subtração de pontos (distância)
- Combinação linear e afim

---
<!-- {"layout": "regular", "slideClass": "operacoes-basicas", "embeddedStyles": ".operacoes-basicas ul.card-list > li > h2 {background-color: #fff5; padding: 0.5em; color: #980598; border-radius: 5px; border: 1px solid currentColor; width: fit-content; align-self: center; margin-bottom: 2rem !important; order: 0;}"} -->
# Operações básicas

- ## Escalar x vetor <!-- {ul:.card-list} --> <!-- {li:.bullet} -->
  ![](../../images/afim-multiplicacao-escalar.png) <!-- {style="width: 220px"} -->
  - <span class="math">\vec{v} = \alpha \times \vec{u}\text{, ou}</span>
  - <span class="math">\vec{v} = \alpha\vec{u}</span>
- ## Vetor + vetor <!-- {li:.bullet} -->
  ![](../../images/afim-soma-vetores.png)  <!-- {style="width: 220px"} -->
  - <span class="math">\vec{w} = \vec{u} + \vec{v}</span>
  - <span class="math">\vec{w} = \vec{u} - \vec{v}</span>
    - <span class="math">\vec{w} = \vec{u} + (-1 \times \vec{v})</span>
- ## Ponto - ponto <!-- {li:.bullet} -->
  ![](../../images/afim-subtracao-pontos.png)  <!-- {style="width: 170px"} -->
  - <span class="math">\vec{v} = P - Q</span>
- ## Ponto + vetor <!-- {li:.bullet} -->
  ![](../../images/afim-soma-vetor-ponto.png)  <!-- {style="width: 220px"} -->
  - <span class="math">Q = P + \vec{u}</span>
  - <span class="math">Q = P - \vec{u}</span>

---
<!-- {"layout": "regular"} -->
# Operação: Combinação Afim <small>(1/3)</small>

- ![](../../images/combinacao-afim.png) <!-- {.push-right style="width: 220px"} -->
  Dados dois pontos <span class="math">P</span> e <span class="math">Q</span>,
  um ponto entre <span class="math">P</span> e <span class="math">Q</span> que
  divide o segmento <span class="math">PQ</span> em
  dois com proporções <span class="math">\alpha</span> e
  <span class="math">(1 - \alpha)</span>, <span class="math">\alpha \in [0, 1]</span>
  - No ponto central, <span class="math">\alpha = \frac{1}{2}</span>
- Corresponde a pegar o vetor <span class="math">P - Q</span>, multiplicar
  pelo escalar <span class="math">\alpha</span>, e então somar o vetor
  resultante ao ponto <span class="math">Q</span>:
  <div class="math bullet">R = Q + \alpha (P-Q)</div>
  <div class="math bullet">R = Q + \alpha P - \alpha Q</div>
  <div class="math bullet">R = (1 - \alpha) Q + \alpha P</div>

---
<!-- {"layout": "regular"} -->
# Operação: Combinação Afim <small>(2/3)</small>

- Observe que na medida em que <span class="math">\alpha</span> varia entre
  <span class="math">0</span> e <span class="math">1</span>,
  <span class="math">R</span> varia de <span class="math">Q</span> até
  <span class="math">P</span>
- Podemos permitir <span class="math">\alpha</span> variar arbitrariamente,
  definindo toda a reta
  - Aí temos uma **combinação linear**
- No caso particular em que <span class="math">\alpha \in [0,1]</span>,
  chamamos a combinação afim de **combinação convexa**
- Vimos uma combinação afim entre dois pontos, mas pode haver mais pontos... <!-- {ul:.bullet} -->

Como podemos definir uma combinação afim para <span class="math">n</span>
pontos? <!-- {.note.info.bullet style="margin-inline: auto;"} -->

---
<!-- {"layout": "regular"} -->
# **Definição geral** da combinação afim <small>(3/3)</small>

Dada uma sequência de pontos <span class="math">P_1, P_2, ..., P_n</span>,
uma combinação afim seria uma soma:
  <div class="math centered">\alpha_1 P_1 + \alpha_2 P_2 + ... + \alpha_n P_n</div>

  ...onde os escalares satisfazem a regra: <!-- {p:.no-margin} -->

  <div class="math centered" style="margin-top: 0; margin-bottom: 0">\sum_{i=1}^{n} {\alpha} = 1</div>

- Para combinação convexa, <span class="math">\alpha_i \ge 0</span>
- O que seria uma combinação afim de 3 pontos? E uma combinação convexa?

---
<!-- {"layout": "regular"} -->
## Exemplo: combinação de 3 pontos

- ![](../../images/combinacao-afim-3.png) <!-- {.push-right} -->
  Combinação afim: <!-- {ul:.bulleted} -->
  - É o plano
- Combinação convexa:
  - O triângulo

Nota: o WebGL usa uma combinação convexa para determinar a cor dos polígonos
quando os vértices possuem cores diferentes <!-- {p:.note.info.large-width} -->

---
<!-- {"layout": "section-header", "slideClass": "euclidean-geometry", "hash": "outras-operacoes"} -->
# Outras Operações

- Geometria Euclidiana
  - Produto interno (ou escalar)
  - Normalização de vetor
  - Projeção de vetores
  - Produto vetorial
- Colisão
  - Entre círculos
  - Entre retângulos

---
<!-- {"layout": "regular"} -->
# Geometria Euclidiana

- Não existem elementos para expressar ângulos e distâncias em geometria afim
- Acrescenta-se uma operação: **produto interno**:
  - Transforma dois vetores em um escalar
  - Expressa como <span class="math">(\vec{u}, \vec{v})</span> ou
    <span class="math">\vec{u} \cdot \vec{v}</span>
  - Várias propriedades
    - Positividade: <span class="math">(\vec{u}, \vec{u}) \ge 0</span> e
      <span class="math">(\vec{u}, \vec{u}) = 0 \Leftrightarrow \vec{u} = \vec{0}</span>
    - Simetria: <span class="math">(\vec{u}, \vec{v})</span> =
      <span class="math">(\vec{v}, \vec{u})</span>
    - Bilinearidade: <span class="math">(\vec{u}, \vec{v}+\vec{w}) =
      (\vec{u}, \vec{v}) + (\vec{u}, \vec{w})</span> e
      <span class="math">(\vec{u}, \alpha \vec{v}) = \alpha (\vec{u}, \vec{v})</span>

---
<!-- {"layout": "regular"} -->
# Produto Interno

- Há duas definições:
  - **Algébrica** (usa as coordenadas cartesianas):

    <div class="math">\vec{u} \cdot \vec{v} = \sum_{i=0}^{n-1} u_i v_i</div>
  - **Geométrica** (geometria euclidiana):

    <div class="math">\vec{u} \cdot \vec{v} = \lVert \vec{u} \rVert \lVert \vec{v} \rVert \cos \theta</div >

---
<!-- {"layout": "regular"} -->
# Comprimento e Normalização

- **Comprimento (norma)**:
  - Dado pela raiz quadrada da do produto interno do vetor consigo mesmo

    <div class="math">\lVert \vec{v} \rVert = \sqrt{\vec{v} \cdot \vec{v}}</div>
- **Normalização**:
  - <div class="math" style="float: right;">\hat{v} = \frac{\vec{v}}{\lVert \vec{v} \rVert}</div>
    Um vetor não nulo normalizado corresponde a um vetor na mesma direção do
    vetor original, porém com comprimento unitário

---
<!-- {"layout": "regular"} -->
# Distância, Ângulo e Ortogonalidade

- <span class="math" style="float: right;">dist(P,Q) = \lVert P-Q \rVert</span>
  **Distância entre dois pontos**:
  - Corresponde ao comprimento do vetor diferença
- **Ângulo**:
  - ![](../../images/angle.svg) <!-- {.push-right} -->
    O ângulo entre dois vetores corersponde ao arco-cosseno do produto interno
    dos dois vetores normalizados    
    <div class="math" style="float: left">ang(\vec{u}, \vec{v}) = \cos^{-1} \left(\frac{\vec{u} \cdot \vec{v}}{\lVert \vec{u} \rVert \lVert \vec{v} \rVert} \right) = \cos^{-1} \left( \hat{u} \cdot \hat{v} \right)</div>
    <div style="clear:both"></div>
- **Ortogonalidade**:
  - Dois vetores são ditos ortogonais (perpendiculares) se o produto interno é 0

---
<!-- {"layout": "regular"} -->
# Decomposição e Projeção

- **Decomposição ortogonal**:
  - Dados <span class="math">\vec{u}</span> e <span class="math">\vec{v}</span>,
    pode-se representar u como sendo a soma de dois vetores
    <span class="math">\vec{u}_1</span> e
    <span class="math">\vec{u}_2</span> tais que
    <span class="math">\vec{u}_1</span> é paralelo a
    <span class="math">\vec{v}</span> e
    <span class="math">\vec{u}_2</span> é perpendicular
    ![](../../images/ortho-projection.svg)
- **Projeção ortogonal**:
  - <span class="math">\vec{u}_1</span> é chamado a projeção ortogonal de
    <span class="math">\vec{u}</span> em <span class="math">\vec{v}</span>
    <div class="math" style="">proj_{\vec{v}} \vec{u} = \vec{u_1} = \frac{\vec{u} \cdot \vec{v}}{\vec{v} \cdot \vec{v}} \vec{v}</div>

---
<!-- {"layout": "regular"} -->
# Produto vetorial

- ![right](../../images/prod-vetorial-grafico.png)
  Encontra um vetor perpendicular a outros dois
  <div class="math push-right" style="font-size: 0.8em;">
    \vec{u} \times \vec{v} = \begin{bmatrix}u_y v_z - u_z v_y \\ u_z v_x - u_x v_z \\ u_x v_y - u_y v_x\end{bmatrix}
  </div>  
- Propriedades (assume-se <span class="math">\vec{u}</span>, <span class="math">\vec{v}</span> linearmente independentes):
  - Antissimetria: <span class="math">\vec{u} \times \vec{v} = -\vec{v} \times \vec{u}</span>
  - Bilinearidade:
    - <span class="math">\vec{u} \times (\alpha \vec{v}) = \alpha (\vec{u} \times \vec{v})</span>  e
    - <span class="math">\vec{u} \times (\vec{v} + \vec{w}) = (\vec{u} \times \vec{v}) + (\vec{u} \times \vec{w})</span>
  - <span class="math">\vec{u} \times \vec{v}</span> é perpendicular tanto a <span class="math">\vec{u}</span> quanto a <span class="math">\vec{v}</span>
  - O comprimento de <span class="math">\vec{u} \times \vec{v}</span> é igual à área do paralelogramo definido por  <span class="math">\vec{u}</span> e <span class="math">\vec{v}</span>, isto é, <span class="math">\lVert \vec{u} \times \vec{v} \rVert = \lVert \vec{u} \rVert \lVert \vec{v} \rVert \sin \theta</span>

---
<!-- {"layout": "centered-horizontal", "embeddedStyles": ".slide-thumbs img {width: 90%; border: 2px solid silver; box-shadow: 4px 4px #999; transition: all 200ms; will-change: translate; &:hover {translate: 0 -4px; box-shadow: 6px 6px 4px #ccc} }"} -->
# **Extra**: Detecção de Colisão

- <!-- {ul:.slide-thumbs.card-list.no-margin.no-padding.full-width.center-aligned style="margin-top: 5rem;"} -->
  **Entidades colidíveis**
  [![Tela de um slide que fala sobre entidades colidíveis em jogos](../../images/screenshot-slide-entidades-colidiveis.webp)][slide-entidades-colidiveis] <!-- {a:target="_blank"} -->
  [Slide de Jogos][slide-entidades-colidiveis]  <!-- {target="_blank"} -->
- **Entre círculos**
  [![Tela de um slide que fala sobre colisão entre círculos (2d) ou esferas (3d)](../../images/screenshot-slide-circulo-e-esfera.webp)][slide-circulo-e-esfera] <!-- {a:target="_blank"} -->
  [Slide de Jogos][slide-circulo-e-esfera] <!-- {target="_blank"} -->
- **Entre retângulos**
  [![Tela de um slide que fala sobre colisão entre retângulos (2d) ou caixas (3d)](../../images/screenshot-slide-retangulo-e-caixa.webp)][slide-retangulo-e-caixa] <!-- {a:target="_blank"} -->
  [Slide de Jogos][slide-retangulo-e-caixa] <!-- {target="_blank"} -->


[slide-entidades-colidiveis]: https://fegemo.github.io/cefet-games/classes/collision/#5
[slide-circulo-e-esfera]: https://fegemo.github.io/cefet-games/classes/collision/#7
[slide-retangulo-e-caixa]: https://fegemo.github.io/cefet-games/classes/collision/#8

---
<!-- {"layout": "section-header", "hash": "representacao-de-objetos"} -->
# Representação de Objetos

- Vetores
- Pontos
- Sistemas de coordenadas
- Coordenadas homogêneas

---
<!-- {"layout": "regular"} -->
## Representação de objetos

- Se a geometria afim não define uma origem, não temos como representar objetos
  ainda
- A partir de 2 vetores **linearmente independentes**
  (<span class="math">\vec{u}_1</span> e <span class="math">\vec{u}_2</span>)
  é possível representar unicamente qualquer outro vetor num plano
  - Conceito de algebra linear
  - Combinação linear:

    <div class="math">\vec{v} = \alpha_1 \vec{u}_1 + \alpha_2 \vec{u}_2</div>

---
<!-- {"layout": "regular"} -->
## Representação de objetos: **vetores**

![](../../images/ortho-basis.png) <!-- {p:.full-width.center-aligned} -->
![](../../images/ortho-vectors.png)

- Dada uma base ortonormal (ortogonal, unitária) e o espaço R³
  - Qualquer vetor pode ser expresso como a combinação linear:
    <div class="math">\vec{v} = \alpha_x \vec{e}_x + \alpha_y \vec{e}_y + \alpha_z \vec{e}_z</div>
  - A tupla <span class="math">(\alpha_x, \alpha_y, \alpha_z)</span>
    contém as **coordenadas cartesianas** do vetor <span class="math">\vec{v}</span>

---
<!-- {"layout": "regular"} -->
## Representação de objetos: **pontos**

- Vamos considerar um ponto arbitrário O como o centro do nosso espaço
- Consideremos, também, uma base (<span class="math">\vec{e}_x</span>,
  <span class="math">\vec{e}_y</span>, <span class="math">\vec{e}_z</span>)
- Dado um ponto <span class="math">P</span> qualquer,
  <span class="math">P-O</span> é um vetor
  - Que pode ser expresso a partir de uma combinação linear dos
    vetores da base:

    <div class="math">P = \alpha_x \vec{e}_x + \alpha_y \vec{u}_y + \alpha_z \vec{u}_z + O</div>

    - <span class="math">(\alpha_x, \alpha_y, \alpha_z)</span> contém
      as coordenadas cartesianas de <span class="math">P</span>

---
<!-- {"layout": "regular"} -->
# Sistema de Coordenadas

Um sistema de coordenadas para um espaço afim <span class="math">n</span>-
dimensional consiste de um **ponto origem** e um conjunto de
**<span class="math">n</span> vetores de base linearmente independentes**

---
<!-- {"layout": "centered-horizontal"} -->
## Exemplo

![](../../images/sample-frame.png)

---
<!-- {"layout": "regular"} -->
## **Coordenadas Homogêneas**

- Vetores e pontos no espaço <span class="math">R^n</span> são normalmente
  representados por uma tupla com <span class="math">n+1</span> escalares
  - Define-se que o último componente seja:
    - 0 para vetores, _e.g._, <span class="math">\vec{u} = (3, 4, -1, 0)</span>
    - 1 para pontos, _e.g._, <span class="math">S = (0, 2, -8, 1)</span>
- A coordenada homogênea é usada para se distinguir um ponto de um vetor
  - última coordenada = 1 &hArr; ponto
  - última coordenada = 0 &hArr; vetor
  - outros valores, operação ilegal

---
<!-- {"layout": "regular", "backdrop": "white-noise", "slideClass": "operacoes-basicas", "embeddedStyles": ".operacoes-basicas ul.card-list > li > h2 {background-color: #fff5; padding: 0.5em; color: #980598; border-radius: 5px; border: 1px solid currentColor; width: fit-content; align-self: center; margin-bottom: 2rem !important; order: 0;}"} -->
# Operações básicas

- ## Escalar x vetor <!-- {ul:.card-list} --> <!-- {li:.bullet} -->
  ![](../../images/afim-multiplicacao-escalar.png) <!-- {style="width: 220px"} -->
  - <span class="math">\vec{v} = \alpha \times \vec{u}\text{, ou}</span>
  - <span class="math">\vec{v} = \alpha\vec{u}</span>
- ## Vetor + vetor <!-- {li:.bullet} -->
  ![](../../images/afim-soma-vetores.png)  <!-- {style="width: 220px"} -->
  - <span class="math">\vec{w} = \vec{u} + \vec{v}</span>
  - <span class="math">\vec{w} = \vec{u} - \vec{v}</span>
    - <span class="math">\vec{w} = \vec{u} + (-1 \times \vec{v})</span>
- ## Ponto - ponto <!-- {li:.bullet} -->
  ![](../../images/afim-subtracao-pontos.png)  <!-- {style="width: 170px"} -->
  - <span class="math">\vec{v} = P - Q</span>
- ## Ponto + vetor <!-- {li:.bullet} -->
  ![](../../images/afim-soma-vetor-ponto.png)  <!-- {style="width: 220px"} -->
  - <span class="math">Q = P + \vec{u}</span>
  - <span class="math">Q = P - \vec{u}</span>

---
<!-- {"layout": "regular"} -->
## Sistema de Coordenadas Padrão

- Juntando uma **base ortonormal** e um **ponto de origem**, formamos um
  **sistema de coordenadas**
- Consideremos o seguinte sistema... parece com alguma coisa?
  - <figure class="picture-steps clean push-right" style="margin: 0;">
      <div class="math bullet">\begin{bmatrix} \vec{e}_0 & \vec{e}_1 & \vec{e}_2 & O \end{bmatrix}</div>
      <div class="math bullet">\begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}</div>
    </figure>
    <span class="math">\vec{e}_0 = (1, 0, 0, 0)</span>
  - <span class="math">\vec{e}_1 = (0, 1, 0, 0)</span>
  - <span class="math">\vec{e}_2 = (0, 0, 1, 0)</span>
  - <span class="math">O = (0, 0, 0, 1)^T</span> <!-- {ul^0:.bullet} -->

---
<!-- {"layout": "centered"} -->
# Referências

1. Apêndice A do livro Real-Time Rendering
1. Lições 6 e 7 das anotações do prof. David Mount
