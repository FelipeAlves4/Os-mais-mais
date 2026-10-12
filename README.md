# 🐆 OS MAIS MAIS — A AURA DESPERTOU
**Maranata 2026 • Grupo rosa • Cristo em primeiro lugar**

Landing page estática, responsiva e gratuita para a resenha amistosa do pré-campa.

## Funcionalidades
- Entrada cinematográfica neon rosa/preto e mascote pantera em SVG original;
- Ilustração simbólica de Cristo, mensagem bíblica e versículos por tema;
- Explicação sobre “Maranata” em 1 Coríntios 16:22;
- Galeria com três modos da pantera;
- Minigame local de aura (pontos salvos no navegador, sem placar compartilhado);
- Compartilhamento do site e da pontuação no WhatsApp;
- Player incorporado do vídeo de referência do YouTube, repetindo o vídeo completo quando a incorporação for permitida;
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

Essas quatro imagens **não estão neste commit**. Elas estão no ZIP da V2 gerado na conversa. Para usá-las, faça upload da pasta `assets` do ZIP, mantendo os nomes. O site preserva o mascote SVG como fallback se não houver imagens.

## Música e direitos
O player tenta iniciar automaticamente sem som e oferece um botão para ativar áudio. O site usa um player incorporado do YouTube, sem baixar o áudio. Para tocar diretamente uma gravação de terceiros, verifique os direitos e as permissões de incorporação antes.

## Observações
- Os versículos trazem trechos/paráfrases curtas e referências para leitura contextualizada. A Bíblia não é apresentada como garantia de vencer a gincana.
- A representação artística de Jesus não é um retrato histórico.
- A aura é apenas parte da brincadeira; não representa fé, mérito ou placar oficial.
- As informações da pontuação ficam apenas no navegador local do visitante.
