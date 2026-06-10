# 01 — Visão Geral do Produto

## Projeto

**CofreFy**

## Descrição

O CofreFy é um sistema web de gerenciamento de finanças pessoais, voltado para controle individual de entradas, saídas e balancete mensal.

O objetivo é permitir que o usuário registre seus créditos e débitos, classifique seus gastos, acompanhe sua renda mensal e visualize sua situação financeira de forma clara.

---

## Objetivo principal

Criar uma aplicação simples, organizada e evolutiva para controle financeiro pessoal.

O sistema deve ajudar o usuário a responder perguntas como:

- Quanto dinheiro entrou no mês?
- Quanto dinheiro saiu no mês?
- Qual foi o saldo final?
- Em quais categorias eu mais gastei?
- Quais gastos foram essenciais?
- Quais gastos foram supérfluos?
- Quanto da minha renda foi comprometida?
- Estou fechando o mês positivo ou negativo?

---

## Problema

Muitas pessoas recebem salário ou outros tipos de renda, mas não conseguem acompanhar com clareza para onde o dinheiro está indo.

O controle financeiro costuma ficar espalhado entre:

- Aplicativo de banco.
- Cartão de crédito.
- Anotações manuais.
- Planilhas.
- Memória.
- Comprovantes soltos.

Isso dificulta a análise mensal, o planejamento financeiro e a identificação de gastos desnecessários.

---

## Solução proposta

O CofreFy permitirá que o usuário registre movimentações financeiras de entrada e saída.

Cada movimentação poderá ser classificada por tipo, categoria e qualificação.

Com esses dados, o sistema apresentará um resumo mensal com totais, saldo, indicadores e distribuição dos gastos.

---

## Público-alvo inicial

O público inicial é uma pessoa que deseja controlar suas próprias finanças de forma individual.

O sistema não será multiusuário no MVP.

O foco inicial é controle pessoal, não gestão empresarial.

---

## Conceitos principais

### Entrada

Representa qualquer valor recebido pelo usuário.

Exemplos:

- Salário.
- Freelance.
- Reembolso.
- Décimo terceiro.
- Férias.
- Venda de item.
- Presente recebido.
- Rendimentos.
- Outros recebimentos.

---

### Saída

Representa qualquer valor gasto, debitado ou comprometido.

Exemplos:

- Aluguel.
- Energia.
- Água.
- Internet.
- Mercado.
- Transporte.
- Saúde.
- Educação.
- Lazer.
- Assinaturas.
- Cartão.
- Dívidas.
- Compras pessoais.

---

### Categoria

Representa um agrupamento utilizado para organizar movimentações.

Exemplos:

- Moradia.
- Alimentação.
- Transporte.
- Saúde.
- Educação.
- Lazer.
- Dívidas.
- Investimentos.
- Assinaturas.
- Compras pessoais.
- Outros.

---

### Qualificação do gasto

Representa uma análise qualitativa aplicada principalmente às saídas.

Exemplos:

- Essencial.
- Importante.
- Supérfluo.
- Investimento.
- Dívida.
- Emergência.

Essa informação serve para entender não apenas quanto foi gasto, mas também a qualidade do gasto.

---

### Balancete mensal

Representa o resumo financeiro de um mês.

O balancete mensal deve considerar:

- Total de entradas.
- Total de saídas.
- Saldo final.
- Percentual da renda comprometida.
- Percentual economizado.
- Gastos por categoria.
- Gastos por qualificação.
- Situação financeira do mês.

Fórmula principal:

```txt
Saldo final = Total de entradas - Total de saídas
```

---

## Escopo do MVP

O MVP do CofreFy deverá conter:

- Cadastro de movimentações financeiras.
- Cadastro de entradas.
- Cadastro de saídas.
- Edição de movimentações.
- Exclusão de movimentações.
- Cadastro ou uso de categorias.
- Classificação de movimentações por categoria.
- Qualificação de gastos.
- Filtro por mês e ano.
- Dashboard mensal.
- Cálculo de total de entradas.
- Cálculo de total de saídas.
- Cálculo de saldo final.
- Identificação de mês positivo, neutro ou negativo.
- Listagem de movimentações.

---

## Fora do escopo do MVP

A primeira versão não deverá conter:

- Login.
- Controle de múltiplos usuários.
- Integração com banco.
- Importação automática de extratos.
- Exportação para Excel.
- Exportação para PDF.
- Controle avançado de cartão de crédito.
- Parcelamentos complexos.
- Controle de investimentos.
- Metas financeiras avançadas.
- Inteligência artificial para classificar gastos.
- Aplicativo mobile nativo.
- Notificações.
- Sincronização em nuvem.

Esses recursos podem ser avaliados em versões futuras.

---

## Indicadores iniciais

O sistema deverá exibir os seguintes indicadores:

- Total de entradas do mês.
- Total de saídas do mês.
- Saldo final do mês.
- Percentual da renda comprometida.
- Percentual da renda economizada.
- Categoria com maior gasto.
- Maior movimentação de saída.
- Total por categoria.
- Total por qualificação.
- Situação do mês.

---

## Situação do mês

A situação do mês deve ser calculada com base no saldo final.

### Positiva

Quando o saldo final for maior que zero.

```txt
totalEntradas > totalSaidas
```

### Neutra

Quando o saldo final for igual a zero.

```txt
totalEntradas = totalSaidas
```

### Negativa

Quando o saldo final for menor que zero.

```txt
totalEntradas < totalSaidas
```

---

## Experiência esperada

A aplicação deve ser simples, objetiva e fácil de usar.

O usuário deve conseguir registrar uma movimentação rapidamente e visualizar o resultado no balancete mensal.

A tela inicial deve priorizar os principais números financeiros.

A interface deve evitar excesso de informação visual.

O sistema deve transmitir clareza e controle.

---

## Direção visual

A identidade visual deve seguir uma linha moderna, limpa e confiável.

Sugestões de estilo:

- Visual minimalista.
- Cores associadas a finanças, estabilidade e clareza.
- Cards para indicadores.
- Tabelas ou listas limpas para movimentações.
- Gráficos simples para distribuição de gastos.
- Boa experiência em telas menores.
- Responsividade desde o início.

---

## Critérios de sucesso do MVP

O MVP será considerado funcional quando o usuário conseguir:

- Registrar entradas e saídas.
- Visualizar o total recebido no mês.
- Visualizar o total gasto no mês.
- Visualizar o saldo final.
- Saber se o mês ficou positivo, neutro ou negativo.
- Classificar gastos por categoria.
- Qualificar gastos por tipo de importância.
- Filtrar movimentações por mês.
- Editar uma movimentação.
- Excluir uma movimentação.
- Identificar onde mais gastou.
