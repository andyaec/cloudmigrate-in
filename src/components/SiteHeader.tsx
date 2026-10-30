"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { clouds, services } from "@/content/site";
import { Brand } from "./Brand";

export function SiteHeader() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);

  const closeMenus = (keep?: Element | null) => {
    ref.current?.querySelectorAll("details[open]").forEach((d) => {
      if (d !== keep) d.removeAttribute("open");
    });
  };

  // Close menus after navigating to another page.
  useEffect(() => closeMenus(), [pathname]);

  // Close menus on a click outside them (including opening the other menu) or on Escape.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => closeMenus((e.target as Element).closest?.("details"));
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && closeMenus();
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Close menus when one of their links is chosen (covers same-page links such as /services#poc).
  const onClick = (e: React.MouseEvent) => {
    if ((e.target as Element).closest(".menu a, .mobile-menu a")) closeMenus();
  };

  const current = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)) ? "page" : undefined;
  const advisor = "/clouds/azure/sales";

  return (
    <header className="site-header" ref={ref} onClick={onClick}>
      <div className="wrap">
        <Brand />
        <nav className="nav" aria-label="Primary">
          <Link href="/" aria-current={current("/")}>
            Home
          </Link>
          <details>
            <summary>Clouds</summary>
            <div className="menu">
              {clouds.map((c) => (
                <Link key={c.slug} href={`/clouds/${c.slug}`}>
                  <img src={c.logo} alt="" />
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
          </details>
          <details>
            <summary>Services</summary>
            <div className="menu">
              {services.map((s) => (
                <Link key={s.slug} href={`/services#${s.slug}`}>
                  <span className="mono small" style={{ color: "var(--accent)" }}>{s.n}</span>
                  <span>{s.title}</span>
                </Link>
              ))}
            </div>
          </details>
          <Link prefetch={false} href={advisor} aria-current={current(advisor)}>
            Azure Funding Advisor
          </Link>
          <Link href="/resources" aria-current={current("/resources")}>
            Resources
          </Link>
          <Link href="/contact" className="btn small">
            Talk to an architect
          </Link>
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Open menu">Menu</summary>
          <div className="mobile-menu">
            <Link href="/">Home</Link>
            {clouds.map((c) => (
              <Link key={c.slug} href={`/clouds/${c.slug}`}>
                <img src={c.logo} alt="" />
                {c.name}
              </Link>
            ))}
            <Link href="/services">All services</Link>
            <Link prefetch={false} href={advisor}>
              Azure Funding Advisor
            </Link>
            <Link href="/resources">Resources & templates</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
