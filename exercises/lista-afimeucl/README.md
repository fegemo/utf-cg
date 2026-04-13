# Lista de Exercícios
## Geometria Afim e Euclidiana

Esta lista de exercícios vale 4 pontos + 2 extras (referente à questão prática).
Os exercícios de geometria devem ser feitos em papel e você deve tirar foto
para entregá-los. Crie um repositório no Github e coloque as fotinhas lá.
Envie a URL do repositório no SIGAA.

Se fizer a Questão 4 (prática), valendo pontos extras, coloque lá no 
repositório também.

### **Questão 1** - 1 ponto:

Considerando as matrizes de transformação que vimos em aula (translação,
rotação, escala), escreva a matriz de transformação
**composta** (quando aplicável) para as operações seguintes. Você deve
escrever as matrizes com as coordenadas homogêneas.

1. Translação em 2D com um deslocamento t = (4, 9)
1. Rotação 2D no eixo Z por um ângulo &theta; = π/4
   - Considere `sin(π/4) = cos(π/4) = 0,71`
1. Escala não uniforme de 200% no eixo x, 75% no eixo y em 2D
1. Reflexão pelos eixos X e Y em 2D
1. [Composta\] Rotação 2D em torno de si (&theta;=π/4) combinado com 
   translação (t=(4,9)) para um objeto que será desenhado na origem
   - Não precisa efetuar a multiplicação
     <details>
       <summary>Diquentinha</summary>
       <p>Serão 2 transformações</p>
     </details>
1. [Composta\] Rotação 2D em torno de si (&theta;=π/4) combinado com 
   translação (t=(4,9)) para um objeto que será desenhado com seu centro no
   ponto (2,3)
   - Não precisa efetuar a multiplicação
     <details>
       <summary>Diquentinha</summary>
       <p>Serão 3 transformações</p>
     </details>
1. [Composta\] matriz modelo para posicionar a Terra no sistema solar, com sua
rotação em torno de si (&theta;) e "translação"¹ em torno do sol. Considere: 
   - trabalhe em 3D, portanto, matriz com 4 dimensões;
   - a Terra é uma esfera que será desenhada com (0,0,0) em seu centro;
   - o sistema de coordenadas global ("ortho") tem (0,0,0) no
     centro do sistema solar;
   - o centro da Terra está a uma distância `d` do centro do sistema solar;
   - a Terra gira em torno de si (&theta;) exatamente ao redor do eixo Y
     <details>
       <summary>Na vida real...</summary>
       <p>
         A Terra gira em torno de um eixo que fica inclinado ~23.5° 
         em relação ao plano orbital. Mas você pode supor que a rotação é
         em torno do eixo Y.
       </p>
     </details>
   - a órbita é circular e
     está totalmente contida no plano orbital XZ (ie, Sol tem mesmo y que a Terra);
     <details>
       <summary>Na vida real...</summary>
       <p>
         A órbita da Terra é elíptica. Mas pode considerá-la circular.
       </p> 
     </details>
   - como eu não especifiquei o dia do ano, nem a hora do dia, a matriz conterá
     variáveis;
   - não precisa multiplicar as matrizes.

<details>
  <summary>¹"translação" em torno do Sol</summary>
  <p>
    Coloquei entre aspas porque o que convencionamos
    chamar de translação da Terra envolve duas operações da Geometria Afim: 
    uma translação e uma rotação (mas qual ordem?).
  </p>
</details>

---
### **Questão 2** - 1 ponto:

Para as tarefas a seguir, explique como você as resolveria usando métodos das
geometrias afim ou euclidiana que discutimos em sala. Tente expressar suas
respostas em termos de operações de alto nível como combinações afins, produto
interno e produto vetorial em vez de manipulações de coordenadas de baixo
nível ou funções trigonométricas.

![](images/geoafim-ab.png)

1. Dado um triângulo `△pqr` no plano, explique como determinar um quarto
ponto `s` tal que `{p, s, q, r}` defina um paralelogramo que tem pq como
diagonal (veja Figura a).
  <!--
    Basta fazer s = q + rp, com rp = p-r, ou
                s = p + rq, com rq = q-r
   -->

1. Um observador está localizado em um ponto `e` no espaço R<sup>3</sup> e
ele enxerga um triângulo definido pelos vértices `p`, `q` e `r`. O lado da
frente desse triângulo é o lado para o qual `p`, `q` e `r` aparecem no
sentido anti-horário e o outro lado é lado de trás. Assumindo que `e` não
é co-planar com o triângulo, **discuta** se o observador vê o lado da
frente do triângulo ou o de trás (veja Figura b).
   <!--
     Achamos a normal n fazendo pq x pr.
     Achamos o vetor pe (e - p)
     Se o ângulo entre n e pe for menor que 90, eles
     o ponto e está olhando para o lado de cima. Se
     o ângulo for maior que 90, está olhando por trás.

     Para achar o ângulo, basta usar produto interno dos
     vetores unitários de n e pe, encontrando o cosseno.
    -->

---
### **Questão 3: mudança de sistema de coordenadas** - 2 pontos

Nos itens a seguir - (a) e (b) - você vai exercitar a mudança 
de sistema de coordenadas.

(a) Considere um cenário em que temos dois sistemas de coordenadas: da janela
(`J`) e do mundo (`M`), definidos em WebGL da seguinte forma:

```javascript
// Define sistema J
gl.viewport(0, 0, 800, 600)

// Define sistema M
const projecao = ortho(0, 800, 0, 600, -1, 1)
                    // l,   r, b,   t,  n, f
gl.uniformMatrix4fv(projecaoLoc, false, projecao)
```

![Sistemas de coordenadas da janela e do mundo, com pontos P[J] = (200,100) e Q[J] = (400,300)](images/sistema-coordenadas-1.png)

Dois cliques foram dados nos pontos `P` e `Q`, e suas coordenadas são
capturadas no sistema da janela (`J`). Pede-se:

1. Represente a base e a origem do sistema `J` (_i.e._, `O`<sub>J</sub>,
   `x`<sub>J</sub>, `y`<sub>J</sub>) no sistema M.
   <details>
     <summary>Dikentinha</summary>
     <p>Olhando para a imagem e os dados dos sistemas, responda em seu coração:</p>
     <blockquote>-- Quantos x<sub>M</sub> vale 1 x<sub>J</sub>?</blockquote>
     <p>
       ...Faça o mesmo para y: quantos y<sub>M</sub> vale 1 y<sub>J</sub>. 
       Depois, faça o mesmo para ponto de origem e construa a resposta.
     </p>
   </details>
   <!--
     Pergunta-se: quantos Xm vale 1 Xj?
     Raciocínio: 800Xm equivalem a 800Xj. Logo, Xj = Xm. Sendo assim,
                 Xj[M] = (1, 0).

                 e quantos Ym vale 1 Yj?
                 600Ym equivalem a 600Yj, mas no sentido contrário. Logo,
                 Yj = -1 Ym. Sendo assim, Yj[M] = (0, -1)

                 e como chegamos em Oj a partir de Om?
                 Precisamos deslocar no sentido Ym 75 vezes. Logo,
                 Oj[M] = (0, 600)

   -->
1. Encontre a matriz de mudança de sistema de coordenadas que leva um ponto
   ou vetor do sistema `J` para o sistema `M`. Lembre-se da 
   [aula sobre mudança de sistema de coordenadas][slide-matriz-mudanca].
   <!--
     Portanto, a matriz de transformação é:
     |  1   0    0  |
     |  0  -1   600 |
     |  0   0    1  |
   -->
1. Use a matriz para calcular as coordenadas de `P` e `Q` no sistema `M`.
   <!--
     Basta multiplicar o vetor coluna de cada ponto pela matriz. Para P:
     |  1   0    0 |   | 200 |   | 200 |
     |  0  -1  600 | x | 100 | = | 500 |
     |  0   0    1 |   |   1 |   |   1 |

     Para Q:
     |  1    0   0 |   | 400 |   | 400 |
     |  0  -1  600 | x | 300 | = | 300 |
     |  0   0    1 |   |   1 |   |   1 |

   -->
   - Aqui, execute a multiplicação. Se quiser conferir o resultado, você pode
     usar o [octave-online][octave-online]


(b) Agora, considere que o sistema da janela é o mesmo, mas o 
sistema de coordenadas do mundo (`M`) está definido assim:

```javascript
// Define sistema J (igual)
gl.viewport(0, 0, 800, 600)

// Define sistema M (mudou)
const projecao = ortho(0, 100, 0, 75, -1, 1)
                    // l,   r, b,  t,  n, f
gl.uniformMatrix4fv(projecaoLoc, false, projecao)
```

![Sistemas de coordenadas da janela e do mundo, com pontos P[J] = (200,100) e Q[J] = (400,300)](images/sistema-coordenadas-2.png)

Dois cliques foram dados nos pontos `P` e `Q`, e suas coordenadas são
capturadas no sistema da janela (`J`). Pede-se:

1. Represente a base e a origem do sistema `J` (_i.e._, `O`<sub>J</sub>,
   `x`<sub>J</sub>, `y`<sub>J</sub>) no sistema M.
   <details>
     <summary>Dikentinha</summary>
     <p>
       Faça o mesmo que antes. Mas agora, quantos x<sub>M</sub> vale 
       1 x<sub>J</sub>? E para Y?
     </p>
     <p>
       Já para o ponto de origem, quantas "setinhas" x e y precisamos somar
       para irmos de O<sub>M</sub> até O<sub>J</sub>?
     </p>
   </details>
   <!--
     Pergunta-se: quantos Xm vale 1 Xj?
     Raciocínio: 100Xm equivalem a 800Xj. Logo, Xj = 1/8 Xm. Sendo assim,
                 Xj[M] = (1/8, 0).

                 e quantos Ym vale 1 Yj?
                 75Ym equivalem a 600Yj, mas no sentido contrário. Logo,
                 Yj = -1/8 Ym. Sendo assim, Yj[M] = (0, -1/8)

                 e como chegamos em Oj a partir de Om?
                 Precisamos deslocar no sentido Ym 75 vezes. Logo,
                 Oj[M] = (0, 75)

   -->
1. Encontre a matriz de mudança de sistema de coordenadas que leva um ponto
   ou vetor do sistema `J` para o sistema `M`.
   <!--
     Portanto, a matriz de transformação é:
     | 1/8  0    0  |
     |  0 -1/8  75  |
     |  0   0    1  |
   -->
1. Use a matriz para calcular as coordenadas de `P` e `Q` no sistema `M`.
   <!--
     Basta multiplicar o vetor coluna de cada ponto pela matriz. Para P:
     | 1/8  0    0  |   | 200 |   |   25 |
     |  0 -1/8  75  | x | 100 | = | 62,5 |
     |  0   0    1  |   |   1 |   |    1 |

     Para Q:
     | 1/8  0    0  |   | 400 |   |   50 |
     |  0 -1/8  75  | x | 300 | = | 37,5 |
     |  0   0    1  |   |   1 |   |    1 |

   -->
1. Encontre a matriz inversa daquela encontrada em (1). Se você já aprendeu
   a fazer isso, você pode usar um dos métodos para matrizes 3x3, como
   Gauss-Jordan. Ou, então, use uma calculadora de matrizes inversas online.
   <!--
     A matriz inversa M-¹ é:
     | 8   0     0 |
     | 0  -8   600 |
     | 0   0     1 |
   -->
1. Considerando um ponto `R[M] = (4, 60)`, converta ele para o sistema `J`
   para saber em que pixel ele será desenhado dentro da tela.
   <!--
     Para encontrar R, dado em coordenadas do mundo, no sistema da janela,
     basta multiplicar suas coordenadas pela matriz inversa da encontrada:
     | 8   0     0 |   |  4 |   |         32 |   |  32 |
     | 0  -8   600 | x | 60 | = | -480 + 600 | = | 120 |
     | 0   0     1 |   |  1 |   | 1          |   |   1 |

   -->

---
### **Questão 4** (prática) - 2 pontos extras:

Crie dois utilitários para operar com (a) pontos (ou vetores) em 3D + 
coordenada homogênea para representar esses conceitos da geometria afim e
também matrizes para 3D + coordenada homogênea. 

Para a (a) estrutura de dados/classe de ponto ou vetor 
(sugestão de nome: `vec4`), as seguintes operações devem ser implementadas:

- Multiplicação por um escalar
- Soma de dois vetores
- Criação de um vetor por meio de dois pontos (da subtração deles)
- Cálculo da norma de um vetor
- Normalização do vetor
- Produto vetorial
- Produto escalar (_dot product_)
- Menor ângulo entre dois vetores
- Combinação afim de dois pontos

Para a (b) matriz, implemente:

- identity()
- translate(tx, ty, tz)
- rotateZ(alpha)
- rotateY(alpha)
- rotateX(alpha)
- scale(sx, sy, sz)
- mult(A, B)
- ortho(l,r,b,t,n,f)
- perspective(fovY, aspect, n, f)
- asFloat32Array()
  - Retorna um vetor 1D para o programador poder 
    passar para `gl.uniformMatrix4fv(...)`

<!-- Você deve fazer seu TAD em um módulo `coordenadas.c` e `coordenadas.h` usando
a linguagem C. Você deve pegar [o código fonte seminal][codigo-seminal], já
contendo uma estrutura de dados `struct coordenada` e dois tipos `vetor` e
`ponto` e implementar o corpo das funções. -->

<!-- #### Notas sobre o **código seminal**

Repare que o código é composto por 3 arquivos:

- `coordenadas.h` e `coordenadas.c` (módulo `coordenadas`)
- `teste-coordenadas.c`, que contém um `int main(...)` e verifica se as
  operações que você implementou estão corretas
  - O código usa uma biblioteca padrão do C chamada `assert.h`, que vai
    verificar se as operações foram devidamente implementadas e, em caso
    negativo, mostra uma mensagem de erro e encerra o programa.

Devido ao uso do `assert.h`, até que todas as funções estejam devidamente
implementadas, o programa será encerrado com erro. Portanto, sugiro
implementar o corpo das funções (`coordenadas.c`) de cima pra baixo. Se o
seu programa imprimir uma mensagem de sucesso para todos os testes, ele
estará pronto e funcionando perfeitamente.

Para desenvolver e executar o código, você pode usar uma das duas alternativas:

- O Makefile, com os comandos:
  - Para compilar:
    ```
    $ make
    ```
  - Para executar os testes (arquivo `teste-coordenadas.c`):
    ```
    $ make run
    ```
  - Para apagar os arquivos temporários e binário:
    ```
    $ make clean
    ```
- O projeto do CodeBlocks -->

[codigo-seminal]: https://github.com/fegemo/tad-coordenadas/archive/master.zip
[slide-matriz-mudanca]: https://fegemo.github.io/utf-cg/classes/coordinate-systems/#mudanca-de-sistema-2-2
[slide-matriz-inversa]: https://fegemo.github.io/utf-cg/classes/coordinate-systems/#matriz-inversa
[octave-online]: https://octave-online.net/
