# CBEV 2027 — Ecoa, Rio!

Site do Congresso Brasileiro de Ecografia Vascular, de 02 a 04 de setembro de 2027, no Windsor Marapendi Hotel, Rio de Janeiro.

## Estrutura

- `dist/index.html`: conteúdo da home.
- `dist/style.css`: estilos responsivos.
- `dist/app.js`: carrossel, menu e calendário.
- `dist/assets/`: imagens e logos.

## Prévia local

```sh
python -m http.server 8765 --directory dist
```

## Vercel

Importe este repositório. Framework: Other. A configuração em `vercel.json` publica a pasta `dist`, sem etapa de build.

As alterações devem preservar os assets oficiais e ser verificadas no desktop e no celular antes da publicação.
