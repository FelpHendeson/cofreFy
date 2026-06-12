# 08 — Plano de Navegação e Layout

## Projeto

**CofreFy**

## Objetivo deste documento

Este documento define o direcionamento inicial de navegação, layout e experiência visual do CofreFy.

O objetivo é padronizar a interface antes de novas funcionalidades serem adicionadas.

---

## Contexto atual

O CofreFy já possui telas principais para:

- Dashboard mensal.
- Balancete mensal.
- Categorias.
- Movimentações.

Com múltiplas telas funcionando, é necessário garantir uma navegação consistente, uma experiência visual coerente e padrões reutilizáveis de layout.

---

## Objetivos de UX

A interface do CofreFy deve ser:

- Clara.
- Simples.
- Responsiva.
- Rápida de usar.
- Fácil de navegar.
- Visualmente consistente.
- Focada em controle financeiro pessoal.

---

## Rotas principais

As rotas principais do MVP são:

```txt
/dashboard
/balance
/categories
/transactions
```

A rota `/` deve preferencialmente redirecionar para `/dashboard` ou renderizar o dashboard.

---

## Navegação principal

A aplicação deve possuir uma navegação principal visível e consistente.

Itens mínimos:

- Dashboard.
- Balancete.
- Movimentações.
- Categorias.

Sugestão de ordem:

```txt
Dashboard
Balancete
Movimentações
Categorias
```

Justificativa:

- Dashboard: visão rápida.
- Balancete: conferência mensal.
- Movimentações: operação diária.
- Categorias: configuração/base.

---

## Layout base

Todas as telas principais devem usar um layout comum.

O layout deve conter:

- Cabeçalho ou sidebar.
- Navegação principal.
- Área de conteúdo.
- Título da página.
- Descrição curta da página, quando útil.
- Espaçamento consistente.
- Responsividade.

---

## Padrão de página

Cada página principal deve seguir uma estrutura parecida:

```txt
Título da página
Descrição curta
Ações principais
Filtros
Conteúdo principal
Estados vazios
```

Exemplo:

```txt
Movimentações
Registre e acompanhe suas entradas e saídas financeiras.

[ Nova movimentação ]

[Filtros]

[Tabela]
```

---

## Padrão para formulários

Formulários de criação e edição não devem aparecer deslocados no final da página.

Padrão aprovado:

- Criar registro: abrir modal/dialog ou drawer.
- Editar registro: abrir o mesmo modal/dialog ou drawer preenchido.
- Cancelar: fechar sem alterar.
- Salvar: fechar após sucesso e atualizar listagem.

Esse padrão se aplica a:

- Categorias.
- Movimentações.
- Futuros cadastros.

---

## Padrão para exclusão

Ações destrutivas devem exigir confirmação.

Exemplo:

- Excluir movimentação.
- Excluir categoria, se permitido futuramente.

A confirmação deve deixar claro o impacto da ação.

---

## Padrão para estados vazios

Toda tela com lista ou dados calculados deve possuir estado vazio claro.

Exemplos:

```txt
Nenhuma categoria encontrada.
Nenhuma movimentação encontrada para este mês.
Nenhum dado disponível para o período selecionado.
```

Estados vazios devem orientar o próximo passo quando possível.

Exemplo:

```txt
Nenhuma movimentação encontrada. Crie sua primeira movimentação para começar.
```

---

## Padrão para filtros

Filtros devem ficar próximos ao conteúdo afetado.

Filtros mensais devem ser consistentes entre:

- Dashboard.
- Balancete.
- Movimentações.

Sempre que possível, usar o mesmo padrão visual e nomes semelhantes.

---

## Padrão para valores financeiros

Valores devem ser exibidos em formato monetário brasileiro.

Exemplo:

```txt
R$ 1.250,50
```

Entradas e créditos devem ter destaque positivo.

Saídas e débitos devem ter destaque negativo ou de alerta.

Saldo deve refletir a situação:

- Positivo.
- Neutro.
- Negativo.

---

## Padrão para datas

Datas devem ser exibidas em formato brasileiro.

Exemplo:

```txt
11/06/2026
```

Filtros de mês e ano devem usar nomes compreensíveis.

---

## Padrão para tabelas

Tabelas devem ser usadas quando a informação exigir conferência ou comparação.

Telas que devem priorizar tabelas:

- Categorias.
- Movimentações.
- Balancete.

Tabelas devem ter:

- Cabeçalho claro.
- Ações visíveis.
- Estado vazio.
- Responsividade.
- Boa leitura em mobile.

Em mobile, se tabela ficar ruim, pode ser usada lista em cards.

---

## Padrão para cards

Cards devem ser usados para indicadores e resumos.

Telas que devem usar cards:

- Dashboard.
- Balancete.

Cards devem ter:

- Título.
- Valor principal.
- Texto auxiliar, se necessário.
- Destaque visual moderado.

---

## Responsividade

O sistema deve funcionar bem em:

- Desktop.
- Notebook.
- Tablet.
- Mobile.

Prioridade:

1. Desktop/notebook.
2. Mobile.
3. Tablet.

Mesmo sendo um sistema web pessoal, as telas devem ser utilizáveis no celular.

---

## Padrão visual recomendado

Direção visual:

- Moderno.
- Limpo.
- Confiável.
- Pouco poluído.
- Focado em dados.

Evitar:

- Excesso de cores.
- Excesso de bordas pesadas.
- Componentes desalinhados.
- Formulários escondidos.
- Tabelas ilegíveis no mobile.

---

## Componentes reutilizáveis sugeridos

Criar ou consolidar componentes compartilhados quando fizer sentido:

```txt
PageHeader
MainNav
CurrencyValue
MonthYearFilter
EmptyState
ConfirmDialog
DataTable
StatusBadge
TypeBadge
```

Esses componentes podem ficar em:

```txt
apps/web/components/
```

ou em:

```txt
packages/ui/
```

No MVP, evitar abstração exagerada. Só extrair componente quando houver reutilização real.

---

## Critérios de aceite

Este plano será considerado aplicado quando:

- Todas as rotas principais estiverem acessíveis por navegação.
- A rota `/` apontar para o dashboard.
- Páginas principais usarem layout consistente.
- Formulários de criação/edição usarem modal/dialog ou drawer.
- Exclusões tiverem confirmação.
- Estados vazios forem claros.
- Filtros mensais forem consistentes.
- Valores financeiros estiverem formatados corretamente.
- Datas estiverem formatadas corretamente.
- A interface estiver usável em desktop e mobile.

---

## Fora do escopo

Este documento não exige:

- Redesign completo.
- Tema escuro.
- Sistema avançado de design tokens.
- Animações complexas.
- Gráficos avançados.
- Biblioteca nova de UI.
- Refatoração total da interface.

Melhorias visuais devem ser incrementais.
