import { APP_NAME } from "@cofrefy/config";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-16">
      <main className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-600">
          Setup técnico
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">{APP_NAME}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Infraestrutura inicial pronta. Módulos implementados conforme as
          especificações em <code className="text-sm">docs/</code>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/categories"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Categorias
          </a>
          <a
            href="/transactions"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Movimentações
          </a>
        </div>
        <ul className="mt-6 space-y-2 text-sm text-slate-500">
          <li>Next.js + TypeScript + Tailwind CSS</li>
          <li>Prisma + MySQL via Docker</li>
          <li>Monorepo com pnpm workspace</li>
        </ul>
      </main>
    </div>
  );
}
