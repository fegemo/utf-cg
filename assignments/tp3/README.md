# Trabalho Prático 3 - _Ray Tracer_

![Esquema de um ray tracer](../../images/ray-tracing.png)

Neste trabalho, vamos completar a implementação de um _ray tracer_ simples, 
que pode se tornar recursivo ou até distribuído, para
compreendermos bem como funciona um modelo de iluminação global.

A implementação está dividida nas duas partes descritas a seguir.
**Vocês <u>precisam da primeira parte feita</u> para fazer a segunda.** 
Cada parte do trabalho vale a metade da pontuação.

Após ler este enunciado geral do TP3, **leia também o enunciado** da 
[primeira parte (colisão)][enunciado-colisao] ou da
[segunda parte (sombreamento)][enunciado-sombreamento].

[enunciado-colisao]: collision/README.md
[enunciado-sombreamento]: shading/README.md


## Funcionamento do Programa

O nosso _ray tracer_ é um programa que recebe, como entrada, um arquivo 
que descreve uma cena tridimensional e produz, como saída, um arquivo de 
imagem com a cena renderizada.

![](../../images/raytracer-input-output.svg)

O programa abre o arquivo de entrada que lhe é passado como primeiro 
argumento em linha de comando e gera uma imagem no mesmo diretório do 
arquivo de entrada, com o mesmo nome.

A cena é descrita em um arquivo de texto simples e contém informações 
sobre (a) a configuração da câmera, (b) as fontes de luz, (c) os pigmentos 
(as "tintas"), (d) os materiais e, por último, (e) os objetos.

![](../../images/raytracer-input-file.png)

O código para carregar o arquivo de entrada nesse formato e também o código 
para gerar uma imagem nos formatos bmp, ppm e png já está escrito e funcionando.

Para entender o código a primeira vez, recomendo:
1. Ler o código de entrada "main"
   - JavaScript: `js/main.js`
   - C++: `cpp/main.cpp`
   - Java: `java/src/raytracer/Main.java`
1. Ler o código do lançador de raios
   - JavaScript: `js/raytracer.js`
   - C++: `cpp/raytracer.h|cpp`
   - Java: `java/src/raytracer/Raytracer.java`
1. Ler o código da classe `Ray`
   - JavaScript: `js/ray.js`
   - C++: `cpp/ray.h`
   - Java: `java/src/raytracer/Ray.java`
1. Ler o código da classe `Object` e, depois, de `Sphere`
   - JavaScript: `js/scene/objects/*.*`
   - C++: `cpp/scene/objects/*.*`
   - Java: `java/src/raytracer/scene/objects/*.*`
1. Ler o código da classe `RayResponse`
   - JavaScript:  `js/ray.js`
   - C++:  `cpp/ray.h`
   - Java: `java/src/raytracer/RayResponse.java`

O código em cada linguagem possui um utilitário de vetor com as operações
geométricas que serão necessárias. Você não precisa implementá-las e todas 
as operações que você vai precisar estão lá.

- JavaScript: Vector definido em `js/math/vector.js`
  ```js
  import Vector from '../../math/vector.js'
  // é um vec4: xyzw, com w=1 por padrão
  
  const u = new Vector(0.5, 1, 0, 0)
  const cor = new Vector(0, 0, 0, 1)
  ```
- C++: Vector3 ou Vector4 definidos em `cpp/math/vector.h`
  ```cpp
  #include "../../math/vector.h"

  Vector3 u = Vector3(0.5, 1, 0);
  Vector4 cor = Vector4(0, 0, 0, 1);
  ```
- Java: Vector3 em `java/src/raytracer/math/Vector3.java` e Vector4 na mesma 
  pasta
  ```java
  import raytracer.math.Vector3;
  import raytracer.math.Vector4;

  Vector3 u = Vector3(0.5, 1, 0);
  Vector4 cor = Vector4(0, 0, 0, 1);
  ```

As operações implementadas estão divididas em dois grupos: mutáveis e 
imutáveis (maioria). As **imutáveis** não alteram o operando,
e são estas:
- `v.add(u)`: soma
- `v.diff(u)`: subtração
- `v.mult(num)`: multiplicação por escalar
- `v.cwMult(u)`: multiplicação de cada coordenada dos dois vetores
- `v.cross(u)`: produto vetorial
- `v.dot(u)`: produto escalar
- `v.norm()`: retorna a norma (tamanho)
- `v.equals(v)`: comparação de igualdade
- `v.normalized()`: retorna novo vetor que é `v` normalizado

As operações mutáveis alteram o operando, e são estas:
- `v.normalize()`: normaliza `v`
- `v.truncate()`: trunca cada componente entre 0 e 1


## Entradas para Teste

Há 7 arquivos de entrada disponibilizados para teste:

| Cena                    | Descrição                                                                                         | Primitivas                                  | Sombras? |     Recursivo?     | Objetivo                                   |
|-------------------------|---------------------------------------------------------------------------------------------------|---------------------------------------------|:--------:|:------------------:|--------------------------------------------|
| `cena-simples.txt`      | Uma fonte de luz e uma esfera verde no centro da cena.                                            | Esfera                                      |    Não   |         Não        | ![](images/cena-simples.png)      |
| `cena-primitivas.txt`   | Uma fonte de luz e uma de cada primitiva geométrica suportada.                                    | Esfera, Plano, Círculo, Cilindro, Triângulo |    Sim   |         Não        | ![](images/cena-primitivas.png)   |
| `cena-2-fontes-luz.txt` | Duas fontes de luz e uma esfera azul no centro, com material que também responde à luz especular. | Esfera                                      |    Não   |         Não        | ![](images/cena-2-fontes-luz.png) |
| `cena-arvore.txt`       | Uma árvore, um chão e um cubo de madeira, com um céu.                                              | Esfera, Plano, Cilindro, Triângulo          | Sim      | Não                | ![](images/cena-arvore.png)       |
| `cena-empilhadas.txt`   | Três fontes de luz, dez esferas empilhadas que são reflexivas, assim como o chão.                 | Esfera                                      |    Sim   |      Reflexão      | ![](images/cena-empilhadas.png)   |
| `cena-whitted.txt`      | Uma fonte de luz, uma esfera transparente e outra reflexiva e uma esfera para o chão.             | Esfera                                      |    Sim   | Reflexão, Refração | ![](images/cena-whitted.png)      |
| `cena-cornell-box.txt`  | Uma fonte de luz, três esferas em uma sala, sendo uma opaca, uma reflexiva e outra transparente.  | Esfera                                      |    Sim   | Reflexão, Refração | ![](images/cena-cornell-box.png)  |


## Opções de Desenvolvimento

O código seminal está disponibilizado em JavaScript, C++ e Java. Você tem a 
liberdade de escolha da linguagem e de sistema operacional entre 
Windows e Linux.


### JavaScript (Node.js)

Você pode usar o VS Code ou qualquer outro editor de código para abrir o
programa. É necessário ter o Node.js instalado, porque é ele quem vai
executar o código do raytracer (e não o navegador).

Para instalar as dependências:
```bash
cd js
npm install
```

Para executar o raytracer para 1 cena em particular, você deve estar na pasta
raiz do projeto (raytracer -- onde existem os arquivos de cena) e:

```bash
node js/main.js cena-NOME.txt
```


### C++

Como ambiente de desenvolvimento do projeto em C++, estão disponíveis:

- Um **arquivo de projeto do CodeBlocks** na pasta `cpp/CodeBlocks` 
  devidamente configurado tanto para Windows quanto para Linux.
  - Para alterar qual imagem de entrada será usada, basta passar o nome 
    do arquivo desejado como argumento de linha de comando para o programa. 
    Para fazer isso no CodeBlocks:
    ![](images/codeblocks-input-change.png)
- Um **Makefile** configurado para compilação **no Linux** na pasta 
  `cpp/Makefile` com os seguintes _targets_:
  - `make clean`, para limpar arquivos temporários e executáveis
  - `make all`, para compilar
  - `make run-simples`, para executar com `cena-simples.txt`
  - `make run-primitivas`, idem para `cena-primitivas.txt`
  - `make run-2-fontes-luz`, idem para `cena-2-fontes-luz.txt`
  - `make run-arvore`, idem para `cena-arvore.txt`
  - `make run-empilhadas`, idem para `cena-empilhadas.txt`
  - `make run-whitted`, idem para `cena-whitted.txt`
  - `make run-cornell-box`, idem para `cena-cornell-box.txt`


### Java

Para desenvolver em Java, o código seminal inclui um **projeto no NetBeans** 
que pode ser usado tanto no Windows quanto no Linux, sem modificação.

Para alterar o arquivo de entrada, basta selecionar a "Configuração de Execução"
desejada:
![](images/netbeans-input-change.png)

É possível usar a IDE Eclipse também, porém a configuração de execução dos
arquivos de entrada deve ser feita por você.


## Entrega do Trabalho

Você deve entregar no sistema acadêmico um **arquivo compactado contendo**:
1. O código fonte (apenas a pasta da linguagem escolhida -- **exclua as outras**)
1. Os arquivos de projeto (eg do Netbeans, ou do CodeBlocks ou Makefile - 
   que já estão no lugar certo)
1. O executável gerado automaticamente ao compilar/executar

O trabalho básico deve ser durante a aula (professor dará "visto") 
e itens opcionais podem ser entregues 
**até imediatamente <u>antes da próxima aula</u> da matéria**.



