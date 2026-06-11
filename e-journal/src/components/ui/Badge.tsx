import { ReactNode } from "react";

interface Props {
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
  children: ReactNode;
}

export function Badge({ variant = "primary", children }: Props) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}
