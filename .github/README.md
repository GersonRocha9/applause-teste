# GitHub Workflows

Este projeto tem 3 workflows simples para automação:

## 🧪 CI - Tests & Build
**Arquivo:** `.github/workflows/ci.yml`

**Dispara quando:**
- Push para `main`, `develop`, `staging`
- Pull requests para essas branches

**O que faz:**
1. Instala dependências
2. Roda lint (`npm run lint`)
3. Roda testes (`npm run test:coverage`)
4. Faz build (`npm run build`)

## 🏷️ Release
**Arquivo:** `.github/workflows/release.yml`

**Dispara quando:**
- Push para `main`
- Manualmente pelo GitHub Actions

**O que faz:**
1. Roda testes e build
2. Incrementa a versão (patch, minor, major)
3. Cria tag e release no GitHub

## 🚀 Deploy
**Arquivo:** `.github/workflows/deploy.yml`

**Dispara quando:**
- Push para `main`
- Manualmente pelo GitHub Actions

**O que faz:**
1. Roda lint, testes e build
2. Faz deploy para Vercel

## ⚙️ Configuração

Para funcionar corretamente, configure estes secrets no GitHub:

- `VERCEL_TOKEN`: Token da Vercel
- `VERCEL_ORG_ID`: ID da organização Vercel
- `VERCEL_PROJECT_ID`: ID do projeto Vercel
- `CODECOV_TOKEN`: Token do Codecov (opcional)

## 📦 Dependabot

O Dependabot atualiza automaticamente as dependências toda semana.
Arquivo: `.github/dependabot.yml` 