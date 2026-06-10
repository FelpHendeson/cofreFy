/**
 * Tipos do banco compartilhados entre pacotes do monorepo.
 *
 * O Prisma Client singleton permanece em `apps/web/lib/prisma.ts`
 * conforme docs/00-infraestrutura-e-arquitetura.md.
 * Este pacote exporta apenas tipos até haver necessidade de
 * compartilhamento cross-app do client.
 */
export type { Category, CategoryType } from "@prisma/client";
