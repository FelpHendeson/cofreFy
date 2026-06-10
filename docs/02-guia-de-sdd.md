# 02 — Guia de SDD

## Projeto

**CofreFy**

## Objetivo deste documento

Este documento define como o projeto CofreFy deve ser conduzido usando **Specification Driven Development**.

O objetivo é garantir que a implementação seja guiada por especificações claras, evitando decisões improvisadas, escopo solto e funcionalidades criadas sem necessidade.

---

## O que é SDD neste projeto

Neste projeto, Specification Driven Development significa que toda funcionalidade relevante deve ser documentada antes de ser implementada.

A ordem correta é:

```txt
Definir → Especificar → Implementar → Testar → Revisar
```

O agente de IA ou desenvolvedor não deve começar pela implementação.

A especificação deve vir primeiro.

---

## Fluxo de trabalho

O fluxo padrão do CofreFy será:

```txt
1. Definir a necessidade
2. Criar ou atualizar documento de especificação
3. Revisar escopo
4. Enviar prompt para o agente
5. Implementar apenas o que foi especificado
6. Testar comportamento
7. Registrar pendências
8. Ajustar documentação se necessário
```

---

## Ordem dos documentos

A documentação deve seguir esta organização inicial:

```txt
docs/
├── 00-infraestrutura-e-arquitetura.md
├── 01-visao-geral-do-produto.md
├── 02-guia-de-sdd.md
├── 03-modulo-movimentacoes.md
├── 04-modulo-categorias.md
├── 05-modulo-dashboard-mensal.md
├── 06-modulo-balancete.md
├── 07-plano-de-testes.md
└── 08-prompts-para-agente.md
```

---

## Responsabilidade de cada documento

### 00 — Infraestrutura e Arquitetura

Define a base técnica do projeto.

Inclui:

- Stack.
- Monorepo.
- Docker.
- Banco de dados.
- ORM.
- Estrutura de pastas.
- Deploy planejado.
- Decisões técnicas iniciais.

---

### 01 — Visão Geral do Produto

Define o que é o CofreFy e qual problema ele resolve.

Inclui:

- Objetivo do produto.
- Problema.
- Solução.
- Público-alvo.
- Escopo do MVP.
- Fora do escopo.
- Conceitos principais.
- Critérios de sucesso.

---

### 02 — Guia de SDD

Define como o projeto será conduzido.

Inclui:

- Fluxo de especificação.
- Regras para uso de agente.
- Critérios para iniciar implementação.
- Como lidar com mudanças.
- Como registrar pendências.

---

### Documentos de módulo

Cada módulo deve ter seu próprio documento.

Exemplos:

- Movimentações.
- Categorias.
- Dashboard.
- Balancete.
- Relatórios.

Cada documento de módulo deve conter:

- Objetivo do módulo.
- Escopo.
- Fora do escopo.
- Entidades envolvidas.
- Campos.
- Regras de negócio.
- Fluxos principais.
- Estados de tela.
- Validações.
- Critérios de aceite.
- Casos de teste.

---

## Regra principal

Nenhuma funcionalidade relevante deve ser implementada sem especificação.

Antes de implementar, deve existir ao menos:

- Objetivo claro.
- Escopo definido.
- Regras de negócio.
- Critérios de aceite.
- Prompt de implementação.

---

## Como passar tarefas para o agente

O agente deve receber contexto e limite de escopo.

Um prompt nunca deve ser genérico demais.

Evitar prompts como:

```txt
Crie um sistema financeiro completo.
```

Usar prompts objetivos como:

```txt
Implemente somente o módulo de movimentações conforme o documento docs/03-modulo-movimentacoes.md.

Não implemente dashboard.
Não implemente autenticação.
Não implemente relatórios.
Não crie funcionalidades fora da especificação.

Ao final, informe:
1. Arquivos criados.
2. Arquivos alterados.
3. Como testar.
4. Pendências encontradas.
```

---

## Prompt inicial de leitura de contexto

Antes de implementar, o agente deve ser orientado a ler os documentos base.

Exemplo:

```txt
Você está trabalhando no projeto CofreFy.

Leia os documentos:
- docs/00-infraestrutura-e-arquitetura.md
- docs/01-visao-geral-do-produto.md
- docs/02-guia-de-sdd.md

Não implemente nada ainda.

Apenas confirme que entendeu:
1. A arquitetura escolhida.
2. A stack principal.
3. O escopo do MVP.
4. O que está fora do escopo.
5. O fluxo de trabalho SDD.
```

---

## Prompt inicial de setup técnico

Depois da leitura de contexto, o agente pode receber a primeira tarefa técnica.

Exemplo:

```txt
Você está trabalhando no projeto CofreFy, um gerenciador de finanças pessoais construído com Specification Driven Development.

Use como base:
- docs/00-infraestrutura-e-arquitetura.md
- docs/01-visao-geral-do-produto.md
- docs/02-guia-de-sdd.md

Objetivo:
Preparar somente a base técnica inicial do projeto.

Crie:
- Estrutura de monorepo
- Aplicação Next.js em apps/web
- Estrutura packages
- Estrutura docs
- Docker Compose para MySQL
- Configuração inicial do Prisma
- .env.example
- README.md com instruções locais
- pnpm-workspace.yaml

Use:
- TypeScript
- Next.js
- Tailwind CSS
- Prisma
- MySQL via Docker
- pnpm

Restrições:
- Não implemente funcionalidades financeiras ainda.
- Não crie dashboard.
- Não crie login.
- Não crie backend separado.
- Não crie CRUDs de negócio.
- Não adicione bibliotecas fora da stack definida sem justificar.

Ao final, informe:
1. O que foi criado.
2. Comandos para rodar.
3. Como validar a conexão com o banco.
4. Pendências técnicas.
```

---

## Como lidar com mudanças

Sempre que uma decisão mudar, a documentação deve ser atualizada antes da implementação.

Exemplo:

Se o banco mudar de MySQL para PostgreSQL, deve ser atualizado primeiro:

- Documento de infraestrutura.
- `.env.example`.
- Docker Compose.
- Configuração do Prisma.
- README.

Depois disso, a implementação pode ser ajustada.

---

## Como lidar com escopo novo

Se uma nova funcionalidade surgir, ela deve virar uma especificação.

Exemplo:

Funcionalidade nova:

```txt
Quero controlar cartão de crédito.
```

Antes de implementar, criar documento:

```txt
docs/09-modulo-cartao-de-credito.md
```

Esse documento deve definir:

- Como funciona o cartão.
- Como lidar com fechamento.
- Como lidar com vencimento.
- Como tratar parcelas.
- Como impacta o balancete.
- Quais telas serão necessárias.
- Critérios de aceite.

---

## Como validar entregas do agente

Toda entrega do agente deve ser validada com base na especificação.

Perguntas obrigatórias:

- Ele implementou apenas o que foi pedido?
- Criou algo fora do escopo?
- Seguiu a stack definida?
- Respeitou a estrutura do monorepo?
- O código roda localmente?
- O banco sobe via Docker?
- As variáveis estão documentadas?
- Existem pendências?
- O README foi atualizado quando necessário?

---

## Critérios para aceitar uma implementação

Uma implementação só deve ser aceita quando:

- Atende ao documento de especificação.
- Não cria funcionalidades extras sem autorização.
- Não quebra a arquitetura definida.
- Pode ser executada localmente.
- Tem instruções claras de teste.
- Não deixa regra de negócio escondida em componente visual.
- Mantém organização por domínio.
- Informa pendências de forma clara.

---

## Critérios para rejeitar ou revisar uma implementação

Uma implementação deve ser revisada se:

- Criar login sem ter sido pedido.
- Criar backend separado sem decisão prévia.
- Trocar o banco definido.
- Ignorar Docker.
- Ignorar Prisma.
- Criar dashboard antes do módulo de movimentações.
- Misturar regra financeira diretamente em componentes visuais.
- Criar funcionalidades que não estão no documento.
- Não explicar como testar.
- Quebrar comandos básicos do projeto.

---

## Registro de pendências

Ao final de cada implementação, o agente deve registrar pendências no resumo.

Formato recomendado:

```txt
Pendências:
- [ ] Ajustar validação de valor monetário.
- [ ] Criar testes para cálculo de saldo mensal.
- [ ] Revisar responsividade da listagem.
```

Pendências relevantes devem ser transformadas em tarefas ou atualizações de especificação.

---

## Filosofia do projeto

O CofreFy deve crescer de forma controlada.

A prioridade não é criar muitas funcionalidades rapidamente.

A prioridade é criar uma base clara, confiável e fácil de evoluir.

O objetivo é evitar que o projeto vire uma pilha de código gerado sem direção.

Implementar rápido é bom.

Implementar certo é melhor.

Implementar rápido e certo é o golpe crítico.
