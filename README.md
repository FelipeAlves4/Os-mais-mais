# 🐆 OS MAIS MAIS — A AURA DESPERTOU
**Maranata 2026 • Grupo rosa • Cristo em primeiro lugar**

Landing page estática, responsiva e gratuita para a resenha amistosa do pré-campa.

## Funcionalidades
- Entrada cinematográfica neon rosa/preto e mascote pantera em SVG original;
- Ilustração simbólica de Cristo, mensagem bíblica e versículos por tema;
- Explicação sobre “Maranata” em 1 Coríntios 16:22;
- Galeria com três modos da pantera, com imagem completa, sem cortes no versículo;
- Minigame local de aura (pontos salvos no navegador, sem placar compartilhado);
- Compartilhamento do site e da pontuação no WhatsApp;
- Tela de entrada para iniciar a música por clique; player visível do YouTube, com controles de Play, fechar, reabrir e tentar novamente. O vídeo é configurado para repetir quando permitido;
- O vídeo usado é https://youtu.be/-xUkPo2q3zc. O site não hospeda ou copia o áudio. A reprodução automática com som não é garantida pelos navegadores.

## Como publicar no Vercel
1. Vá em https://vercel.com/new e importe `FelipeAlves4/Os-mais-mais`.
2. Escolha **Other** como Framework Preset.
3. Root Directory: `./`; deixe Build Command vazio.
4. Clique em **Deploy**. A página inicial é `index.html`.

**Tecnologia:** um único `index.html` com CSS, JavaScript e ilustração SVG integrados. Sem `npm install`, banco de dados, frameworks ou credenciais.

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
