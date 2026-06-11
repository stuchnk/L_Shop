import { ReactNode } from "react";

interface Props {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, action, children, className = "" }: Props) {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="card__title">
          <span>{title}</span>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
