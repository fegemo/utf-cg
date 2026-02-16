# Trabalho Prático 0 - Minha Primeira Página Web

Você, como um assíduo e responsável programador, vai preparar o ninho de
produção intelecto-científica que tem em casa (vulgarmente chamado
computador) para poder começar a escrever deliciosos programas em WebGL.

## O que deve ser feito

Neste trabalhinho, você vai exercitar o fluxo de desenvolvimento e entrega 
de trabalhos desta disciplina:
1. Configurar ambiente de desenvolvimento
2. Criar uma página web sobre você
3. Publicar sua página

Para iniciar, você deve **(1) configurar seu ambiente de desenvolvimento** para
começar a criar seus programinhas web com WebGL. Esse ambiente é composto por:

- Um **editor de texto** ou **IDE**. Exemplos:
  - VSCode (🌟 professor's _seal of approval_)
    - Editor de texto bem bacana
    - +Extensão "Live Server" com um servidor de desenvolvimento[¹][nota-1]
  - WebStorm
    - IDE parrudona
- Um **navegador** capaz de WebGL2. Exemplos:
  - Chrome v56+ - 2017 em diante (🌟 professor's _seal of approval_)
  - Edge v79+ - 2020 em diante
  - Firefox v51+ - 2017 em diante
  - Opera v43+ - 2017 em diante
  - Safari v15+ - 2021 em diante
- O **Git**, e conta no **Github** (ou similar)
  - Todo trabalho será submetido como um repositório público

[nota-1]: #nota-1


Em seguida, você vai **(2) criar uma página Web simples**, descrevendo a 
sua pessoa. Não precisa inventar moda: a ideia é ter um primeiro 
contato com a plataforma Web como alvo do desenvolvimento, 
e a programação dirigita por eventos.

Sua página deve conter:
1. Código HTML referente a um "esqueleto básico" de página HTML5
2. Um título no cabeçalho (ie, no &lt;head>&lt;/head>) com seu nome
3. Uma foto sua (pode ser do cachorro)
4. Um ou mais parágrafos descrevendo você
5. Estilização simples em CSS, em um arquivo de folha de estilos (ie, `.css`).
   Por exemplo, você pode:
   - Mudar a cor de fundo (ou [colocar uma imagem][imagem-de-fundo])
   - Mudar a fonte do texto (pode usar fontes bonitas do 
     [Google Fonts][google-fonts])
   - Mudar o tamanho do texto
   - Colocar uma borda arredondada na sua foto
   - Posicionar a foto à direita ou à esquerda, com o texto ao redor dela
   - Outras coisinhas que achar legal
6. Ter um misterioso botão (ie, `<button>Clique aqui</button>`) na página que 
   faça alguma coisinha usando JavaScript [ao ser clicado][eventos-mouse].
   Pode colocar todo o código JavaScript dentro de 
   `<script>todo o código aqui</script>`. Algumas ideias:
   - Toque um efeito sonoro
     - `new Audio(urlParaAudio).play()`
   - Troque sua foto por outra que seja mais ecologicamente correta
     - [Alterando atributos][alterando-atributos] de elementos com JavaScript
   - Dispare uma centena de mensagens de alerta, fazendo com que o usuário 
     (o professor né) precise fechar e abrir o navegador (perde ponto, ok)
     - `alert(mensagem)`
   - Altere o estilo de algum elemento:
     - [Colocar ou remover uma classe][add-remove-classe] CSS de um elemento
     - [Definir uma propriedade][definir-propriedade] CSS diretamente
   - Fazer algum elemento (eg, um gif de abelhinha?) se mover na tela
     - Posicionar [elemento de forma absoluta][position-absolute]
     - Ao longo do tempo (eg, [`setInterval`][set-interval]), 
       definir suas propriedades de posição x e y para um novo valor 
       a cada atualização
   - Etc... por que não implementar todas essas e muito mais?


Por fim, você deve **(3) tornar a pasta um repositório Git** (pô, devia ter feito
isso antes do item 2 hein... estamos de 👀), faça um ou mais _commits_ e, então,
publique em algum hotelzinho de repositórios, como o Github. Vais gerar uma
URL no formato: `github.com/adamastor/utf-cg-tp0` (se o seu nome de 
usuário for adamastor). Entre nessa URL e confira que seus arquivos estão lá.
Em seguida, vá até as configurações do repositório ("Settings"), 
opção "Pages", e configure para que o Github publique o repositório como uma
página web no endereço `adamastor.github.io/utf-cg-tp0`. Veja os passos na
imagem:

![Captura de tela do Github mostrando os passos para publicar um repositório como uma página web: (1) clicar em "Settings" na página do repositório, depois (2) clicar em "Pages", (3) depois selecionar em "Source" a opção "Deploy from branch" e (4) escolher o branch chamado "main"](images/instrucoes-github-pages.webp)

<a id="nota-1"></a>
¹Servidor de desenvolvimento: até podemos visualizar um arquivo HTML "dando
dois cliques" nele e aguardando o navegador abrir e mostrar 
(usando o protocolo `file` em vez do `http`). Contudo, é interessante usar
o protocolo HTTP mesmo, visto que o FILE tem permissões e funcionalidades 
bem mais restritas. Para tanto, podemos usar uma extensão do VSCode (ou outro)
que cria um servidor web na pasta do projeto e apenas distribui (ie, serve) os
arquivos de forma estática. Além disso, essa extensão também: (a) abre o
navegador automaticamente assim que iniciada e (b) atualiza a página no 
navegador sempre que você salva um arquivo do projeto.


## O que deve ser entregue

A URL para o professor visualizar sua primeira página publicada via sistema
acadêmico ([Moodle][moodle]). A URL tem a forma: 
`seuusuario.github.io/utf-cg-tp0`.


[google-fonts]: https://fonts.google.com/
[imagem-de-fundo]: https://fegemo.github.io/cefet-front-end/classes/html3/#imagem-de-fundo
[alterando-atributos]: https://fegemo.github.io/cefet-front-end/classes/js2/#alterando-atributos
[add-remove-classe]: https://fegemo.github.io/cefet-front-end/classes/js2/#colocando-removendo-classes
[definir-propriedade]: https://fegemo.github.io/cefet-front-end/classes/js3/#15
[position-absolute]: https://fegemo.github.io/cefet-front-end/classes/css5/#posicionamento-absoluto
[eventos-mouse]: https://fegemo.github.io/cefet-front-end/classes/js3/#eventos-de-mouse
[set-interval]: https://fegemo.github.io/cefet-front-end/classes/js3/#11
[moodle]: http://ava.cefetmg.br
