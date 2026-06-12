"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/balance", label: "Balancete" },
  { href: "/categories", label: "Categorias" },
  { href: "/transactions", label: "Movimentações" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/dashboard"
          className="text-base font-semibold tracking-tight text-slate-900"
        >
          CofreFy
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100/80 p-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
