declare module 'bootstrap' {
  export class Modal {
    constructor(element: Element, options?: Record<string, unknown>);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
    static getInstance(element: Element | null): Modal | null;
    static getOrCreateInstance(element: Element): Modal;
  }

  export class Toast {
    constructor(element: Element, options?: Record<string, unknown>);
    show(): void;
    hide(): void;
    dispose(): void;
    static getInstance(element: Element | null): Toast | null;
  }

  export class Tooltip {
    constructor(element: Element, options?: Record<string, unknown>);
    show(): void;
    hide(): void;
    dispose(): void;
    static getInstance(element: Element | null): Tooltip | null;
  }

  export class Dropdown {
    constructor(element: Element, options?: Record<string, unknown>);
    show(): void;
    hide(): void;
    dispose(): void;
    static getInstance(element: Element | null): Dropdown | null;
  }

  export class Collapse {
    constructor(element: Element, options?: Record<string, unknown>);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
    static getInstance(element: Element | null): Collapse | null;
  }

  export class Offcanvas {
    constructor(element: Element, options?: Record<string, unknown>);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
    static getInstance(element: Element | null): Offcanvas | null;
  }
}
