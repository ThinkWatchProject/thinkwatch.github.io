import { useRef, type ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  /** max pull in pixels */
  pull?: number;
  external?: boolean;
};

export default function MagneticButton({
  href,
  children,
  className = "",
  pull = 10,
  external = false,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const dx = (x / rect.width) * pull * 2;
    const dy = (y / rect.height) * pull * 2;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  return (
    <a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </a>
  );
}
