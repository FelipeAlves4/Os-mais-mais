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
- **Trilha instrumental épica original**, sintetizada localmente com Web Audio API (sem downloads, serviços pagos ou conteúdo de terceiros). Play/Pause e volume;
- Link para ouvir o hino cantado no Suno. **O arquivo do Suno não está hospedado aqui.**

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
O botão principal toca uma composição instrumental gerada em JavaScript pelo próprio navegador e não faz autoplay. O hino cantado é aberto por link, hospedado no Suno. A plataforma indica que músicas criadas no plano gratuito são destinadas ao uso pessoal e não comercial. Este projeto não tem monetização; não publique a gravação em serviços de distribuição musical sem licença apropriada.

## Observações
- Os versículos trazem trechos/paráfrases curtas e referências para leitura contextualizada. A Bíblia não é apresentada como garantia de vencer a gincana.
- A representação artística de Jesus não é um retrato histórico.
- A aura é apenas parte da brincadeira; não representa fé, mérito ou placar oficial.
- As informações da pontuação ficam apenas no navegador local do visitante.
