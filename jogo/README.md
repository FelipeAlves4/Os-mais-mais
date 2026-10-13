# 🐆 AURA RUN V2 — Aura Suprema | Os Zé Manés

Jogo 2D de corrida por três pistas, construído em **HTML5 Canvas + CSS + JavaScript puro**, com foco em celulares. Integra a identidade rosa/neon do grupo e desafios bíblicos, mantendo a competição no espírito de brincadeira.

## Jogar

Quando publicado na Vercel do projeto principal, abra:

**https://os-mais-mais.vercel.app/jogo/**

## Como jogar

- Deslize para a esquerda/direita ou toque nas laterais do cenário; há também botões grandes na tela.
- No computador, use **← / →** ou **A / D**. **P ou Espaço** pausa.
- Colete estrelas rosa para farmar aura e multiplicar pontos por combo. Ao coletar **10 estrelas**, ativa-se o **Modo Aura Suprema** por 7 segundos: pontos das estrelas ×3, magnetismo de itens não perigosos próximos e efeitos visuais.
- Bônus **Six Seven (67)**: aparece ocasionalmente e vale 67 pontos, ou 201 durante a Aura Suprema.
- Evite pedras; são três vidas. Um escudo pode proteger de uma colisão.
- Responda a **três perguntas bíblicas** nos checkpoints de 20, 41 e 56 segundos; acertos dão 75 pontos de aura fictícia, erros não causam perda de vida.
- Complete os **65 segundos** para chegar ao Maranata; veja seu recorde e compartilhe a pontuação com os amigos.
- **Missões:** 12 estrelas, combo máximo de 6, duas respostas corretas. Cada conquista dá 100 pontos adicionais.
- Na tela final, **salve um card de pontuação em PNG** com a arte original da pantera, ou compartilhe o desafio como texto.

## Estrutura

- `index.html`: interface mobile e telas de início, quiz, pausa e resultado.
- `game.css`: HUD, botões, responsividade e animações.
- `game.js`: loop de jogo com Canvas, movimentação, colisões, pontuação e perguntas.
- `favicon.svg`: ícone do jogo.

Sem servidor, banco de dados, frameworks, downloads de áudio ou anúncios. A imagem do card é produzida no próprio navegador. Recorde individual salvo apenas no `localStorage` do visitante. Não há ranking global nem monitoramento de outros jogadores.

## Fé e propósito

O conteúdo cita **João 13:34**, **1 Coríntios 16:22** e **Salmos 133:1**. O jogo enfatiza amor, união e esperança em Cristo. Pontos, escudos e aura são elementos lúdicos e não medem fé, favor divino ou garantem vitória em competições.

## Para publicar

O diretório `/jogo` foi adicionado ao repositório principal `FelipeAlves4/Os-mais-mais`. A Vercel conectada ao repositório normalmente publica este caminho na mesma implantação. Não precisa configurar build.

## Verificação

Testar o site no celular em Chrome/Android e Safari/iOS, especialmente controles por toque, opções da pergunta, pausa, efeitos de som e compartilhamento. Alguns navegadores exigem um gesto de usuário para iniciar o áudio; por isso os efeitos só tentam tocar depois da interação.

## V2: considerações técnicas

- Interface continua mobile-first (Canvas em coordenadas lógicas de 420 × 720), preservando três pistas e vidas; dificuldade de colisões não foi aumentada.
- HUD é atualizado aproximadamente 10 vezes por segundo, para evitar reflow desnecessário em smartphones. Cena Canvas usa requestAnimationFrame e limita delta time.
- A Aura Suprema não bloqueia pedras; ela apenas aumenta pontos e atrai itens não perigosos de pistas adjacentes.
- Efeitos intensos são reduzidos com `prefers-reduced-motion`.
- O bônus Six Seven e missões são locais da partida; não existe placar global nem sistema para falsificar votos entre equipes.
- As perguntas bíblicas seguem a proposta de amor, unidade e esperança. Os pontos não representam bênçãos nem mérito espiritual.
