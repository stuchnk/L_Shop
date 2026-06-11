import { InputHTMLAttributes, ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: ReactNode;
  error?: string;
}

export function Input({ label, hint, error, id, ...rest }: Props) {
  const inputId = id ?? `in-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} className="input" {...rest} />
      {hint && !error && <div className="field__hint">{hint}</div>}
      {error && <div className="field__hint" style={{ color: "var(--danger)" }}>{error}</div>}
    </div>
  );
}
