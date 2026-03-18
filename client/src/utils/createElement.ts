interface ElementOptions {
  tag: string;
  className?: string;
  textContent?: string;
  innerHTML?: string;
  attributes?: Record<string, string>;
  children?: HTMLElement[];
  onClick?: (e: MouseEvent) => void;
  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
}

export const createElement = (opts: ElementOptions): HTMLElement => {
  const el: HTMLElement = document.createElement(opts.tag);

  if (opts.className) el.className = opts.className;
  if (opts.textContent) el.textContent = opts.textContent;
  if (opts.innerHTML) el.innerHTML = opts.innerHTML;

  if (opts.attributes) {
    Object.entries(opts.attributes).forEach(([k, v]: [string, string]) => {
      el.setAttribute(k, v);
    });
  }

  if (opts.children) {
    opts.children.forEach((child: HTMLElement) => el.appendChild(child));
  }

  if (opts.onClick) el.addEventListener('click', opts.onClick);
  if (opts.onInput) el.addEventListener('input', opts.onInput);
  if (opts.onChange) el.addEventListener('change', opts.onChange);

  return el;
};