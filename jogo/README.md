# 🐆 AURA RUN — Os Zé Manés | Maranata 2026

Jogo 2D de corrida por três pistas, construído em **HTML5 Canvas + CSS + JavaScript puro**, com foco em celulares. Integra a identidade rosa/neon do grupo e desafios bíblicos, mantendo a competição no espírito de brincadeira.

## Jogar

Quando publicado na Vercel do projeto principal, abra:

**https://os-mais-mais.vercel.app/jogo/**

## Como jogar

- Deslize para a esquerda/direita ou toque nas laterais do cenário; há também botões grandes na tela.
- No computador, use **← / →** ou **A / D**. **P ou Espaço** pausa.
- Colete estrelas rosa para farmar aura e multiplicar pontos por combo.
- Evite pedras; são três vidas. Um escudo pode proteger de uma colisão.
- Responda a **três perguntas bíblicas** nos checkpoints de 20, 41 e 56 segundos; acertos dão 75 pontos de aura fictícia, erros não causam perda de vida.
- Complete os **65 segundos** para chegar ao Maranata; veja seu recorde e compartilhe a pontuação com os amigos.

## Estrutura

- `index.html`: interface mobile e telas de início, quiz, pausa e resultado.
- `game.css`: HUD, botões, responsividade e animações.
- `game.js`: loop de jogo com Canvas, movimentação, colisões, pontuação e perguntas.
- `favicon.svg`: ícone do jogo.

Sem servidor, banco de dados, frameworks, downloads de áudio ou anúncios. Recorde individual salvo apenas no `localStorage` do visitante. Não há ranking global nem monitoramento de outros jogadores.

## Fé e propósito

O conteúdo cita **João 13:34**, **1 Coríntios 16:22** e **Salmos 133:1**. O jogo enfatiza amor, união e esperança em Cristo. Pontos, escudos e aura são elementos lúdicos e não medem fé, favor divino ou garantem vitória em competições.

## Para publicar

O diretório `/jogo` foi adicionado ao repositório principal `FelipeAlves4/Os-mais-mais`. A Vercel conectada ao repositório normalmente publica este caminho na mesma implantação. Não precisa configurar build.

## Verificação

Testar o site no celular em Chrome/Android e Safari/iOS, especialmente controles por toque, opções da pergunta, pausa, efeitos de som e compartilhamento. Alguns navegadores exigem um gesto de usuário para iniciar o áudio; por isso os efeitos só tentam tocar depois da interação.
