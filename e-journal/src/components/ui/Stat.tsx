import { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
}

export function Stat({ label, value, hint, icon }: Props) {
  return (
    <div className="stat">
      {icon && <div className="stat__icon">{icon}</div>}
      <div className="stat__label">{label}</div>
      <div className="stat__value">{value}</div>
      {hint && <div className="stat__hint">{hint}</div>}
    </div>
  );
}
