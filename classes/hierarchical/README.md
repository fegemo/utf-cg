<!-- { "layout": "title" } -->
# Modelagem Hieráquica

---
<!-- { "layout": "section-header", "slideClass": "modelagem-hierarquica" } -->
# Modelagem Hierárquica

---
<!-- { "layout": "regular" } -->
## Exemplo do carro (1/2)

```c
void desenhaCarroTodo(struct chassi_t chassi) {
    glPushMatrix();
        float* centroChassi = chassi.posicao;
        glTranslatef(centroChassi[0], centroChassi[1], centroChassi[2]);
        desenhaChassi();

        for (int i = 0; i < NUM_RODAS; i++) {
            float* centroRoda = chassi.rodas[i].posicao;
            glPushMatrix();
                glTranslatef(centroRoda[0], centroRoda[1], centroRoda[2]);
                desenhaRodaEPneu();
            glPopMatrix();      
        }
    glPopMatrix();
}
```

---
<!-- { "layout": "regular", "slideClass": "compact-code" } -->
## Exemplo do carro (2/2)

```c
void desenhaRodaEPneu() {
    desenhaRoda();

    for (int i = 0; i < NUM_PARAFUSOS; i++) {
        glPushMatrix();
            float angulo = ((float)i) / NUM_PARAFUSOS;
            glRotatef(angulo, 0, 0, 1);
            glTranslatef(RAIO_PARAFUSO, 0, 0);
            desenhaParafuso();
        glPopMatrix();      
    }
    desenhaPneu();
}
```

- Exemplo: [Braço do Robô](codeblocks:braco-robo/CodeBlocks/braco-robo.cbp)

---
<!-- { "layout": "main-point" } -->
# Trabalho Prático 2 \o/

_A wild TP2 appears..._ <!-- {style="color: white;"} -->

---
<!-- { "layout": "regular" } -->
## TP2: Parque de Diversões

<img alt="" src="https://raw.githubusercontent.com/fegemo/cefet-cg/master/assignments/tp2-amusement/images/rollercoasterTycoon.jpg"
  style="float: right; width: 450px; margin: 0 0 5px 20px">
  -- _A Disney comprou o CEFET ~~for legal reasons, that's a joke~~ e colocou
  a turma de Computação Gráfica para administrar os parques da empresa. Seu
  trabalho é projetar o próximo parque de diversões._

- Enunciado no Moodle (ou [na página do curso](https://github.com/fegemo/cefet-cg/blob/master/assignments/tp2-amusement/README.md)).
