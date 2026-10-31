"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

const navItems = [
  { href: "/", name: "Home" },
  { href: "/about", name: "About" },
  { href: "/photos", name: "Photos" },
  { href: "/contact", name: "Contact" },
];

type Underline = { x: number; width: number };

export function Navbar() {
  const pathname = usePathname();
  const linksRef = useRef<HTMLDivElement>(null);
  const [underline, setUnderline] = useState<Underline | null>(null);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const container = linksRef.current;
    if (!container) return;

    const measure = () => {
      const active = container.querySelector<HTMLElement>('[aria-current="page"]');
      setUnderline(active ? { x: active.offsetLeft, width: active.offsetWidth } : null);
    };

    measure();
    // Skip the glide on first placement so the underline doesn't slide in from the left.
    const frame = requestAnimationFrame(() => setAnimate(true));
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-40 w-full border-b border-line bg-bg/80 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-[720px] items-center justify-between px-4 sm:px-7">
        <Link
          href="/"
          className="py-2 font-semibold tracking-[-0.02em] text-ink"
        >
          sid.
        </Link>
        <div className="flex items-center">
          <div ref={linksRef} className="relative flex gap-1 text-sm sm:gap-2">
            {navItems.map(({ href, name }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-2.5 py-2 transition-colors ${
                    isActive ? "text-ink" : "text-mute hover:text-ink"
                  }`}
                >
                  {name}
                </Link>
              );
            })}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-0 left-0 h-px w-px origin-left bg-ink motion-reduce:transition-none ${
                animate
                  ? "transition-transform duration-[250ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
                  : ""
              } ${underline ? "opacity-100" : "opacity-0"}`}
              style={{
                transform: `translateX(${underline?.x ?? 0}px) scaleX(${underline?.width ?? 1})`,
              }}
            />
          </div>
          {/* Task 9: theme toggle slot */}
        </div>
      </div>
    </nav>
  );
}
