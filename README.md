# 🐆 OS ZÉ MANÉS — A AURA DESPERTOU V3
**Maranata 2026 • Grupo rosa • Cristo em primeiro lugar**

Landing page estática, responsiva e gratuita para a resenha amistosa do pré-campa.

## Funcionalidades
- Entrada cinematográfica neon rosa/preto e mascote pantera em SVG original;
- Ilustração simbólica de Cristo, mensagem bíblica e versículos por tema;
- Explicação sobre “Maranata” em 1 Coríntios 16:22;
- Galeria com quatro modos da pantera, incluindo Six Seven, com imagem completa, sem cortes no versículo;
- Minigame local de aura (pontos salvos no navegador, sem placar compartilhado);
- Compartilhamento do site e da pontuação no WhatsApp;
- Tela de entrada para iniciar a música por clique; player visível do YouTube, com controles de Play, fechar, reabrir e tentar novamente. O vídeo é configurado para repetir quando permitido;
- O vídeo usado é https://youtu.be/-xUkPo2q3zc. O site não hospeda ou copia o áudio. A reprodução automática com som não é garantida pelos navegadores.

## Como publicar no Vercel
1. Vá em https://vercel.com/new e importe `FelipeAlves4/Os-mais-mais`.
2. Escolha **Other** como Framework Preset.
3. Root Directory: `./`; deixe Build Command vazio.
4. Clique em **Deploy**. A página inicial é `index.html`.

**Tecnologia:** `index.html` + `v3.css` + `v3.js` e ilustrações locais. Sem `npm install`, banco de dados, frameworks ou credenciais.

## Usando as imagens originais da V2
O site já funciona completamente com sua arte SVG integrada. Também detecta automaticamente estas imagens opcionais em `assets/` e as usa assim que forem adicionadas ao GitHub:

- `assets/pantera-poster.webp` — tela inicial e galeria;
- `assets/pantera-original.webp` — galeria, modo resenha;
- `assets/pantera-fe.webp` — galeria, modo fé;
- `assets/cristo-amanhecer.webp` — representação artística de Jesus.

As quatro imagens **já estão no repositório** e são carregadas automaticamente; o site preserva o mascote SVG como fallback quando uma imagem não carrega.

## Música, compatibilidade e direitos
O visitante entra pelo botão **“Entrar com a trilha de aura”**. O site então tenta iniciar **com som** a reprodução no player visível do YouTube; se o navegador bloquear o autoplay, o visitante deve tocar em **▶** no vídeo. Há ainda opções de **tentar novamente**, **fechar/parar**, **reabrir** e **ouvir diretamente no YouTube**.

Não existe garantia de autoplay com som em Chrome, Safari, Firefox, Android ou iOS: cada navegador define suas próprias regras e extensões/bloqueios também podem interferir. O vídeo pode não estar disponível para incorporação. A solução não baixa, hospeda nem copia o áudio da referência. Para maior compatibilidade sem YouTube, seria necessário um arquivo de áudio original/licenciado fornecido com autorização para uso no site.

## Observações
- Os versículos trazem trechos/paráfrases curtas e referências para leitura contextualizada. A Bíblia não é apresentada como garantia de vencer a gincana.
- A representação artística de Jesus não é um retrato histórico.
- A aura é apenas parte da brincadeira; não representa fé, mérito ou placar oficial.
- As informações da pontuação ficam apenas no navegador local do visitante.

## Experiência V3
- Hero cinematográfico com botão **Despertar a Pantera**, revelação modal acessível e modo de movimento reduzido;
- Barra discreta de progresso da leitura;
- **Arena Bíblica** com quatro rodadas e explicações de referências (Davi e Golias, Maranata, amor de Cristo e união). Resultado local; compartilhamento por texto, sem placar global fictício;
- **Card da Tropa:** cada visitante digita um apelido (somente em seu dispositivo) e gera um PNG de 1080 × 1350 pixels com uma arte original para WhatsApp;
- O desbloqueio de **1.000 pontos de aura** também abre o portal visual, mas não promete vitória na gincana;
- Mantidos o player compacto do YouTube (som dependente da política do navegador) e o minigame Six Seven;
- A implementação V3 usa CSS e JS separados para manter o site fácil de evoluir. Os recursos da V2 continuam funcionando.

### Testes rápidos após um deploy
1. Abrir em celular e computador; acionar **Entrar com a trilha** e confirmar os controles do player.
2. Testar o **Despertar da Pantera**, fechar por X, Escape ou botão, e conferir que o scroll retorna.
3. Jogar todas as rodadas do quiz e testar o botão **Jogar de novo**.
4. Criar o card com apelido curto e com 22 caracteres, baixar e abrir o PNG.
5. Testar o modo Six Seven e o progresso de aura. Conferir que o site continua utilizável com redução de movimento ativada.
