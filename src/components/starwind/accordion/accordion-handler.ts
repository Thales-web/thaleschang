type AccordionType = "single" | "multiple";
type AccordionState = "open" | "closed";

interface AccordionItem {
  element: HTMLElement;
  trigger: HTMLElement;
  content: HTMLElement;
  value: string;
}

class AccordionHandler {
  private accordion: HTMLElement;
  private type: AccordionType;
  private items: AccordionItem[];
  private itemsByValue: Map<string, AccordionItem>;
  private accordionId: string;

  constructor(accordion: HTMLElement, idx: number) {
    this.accordion = accordion;
    this.type = (accordion.dataset.type || "single") as AccordionType;
    this.accordionId = `starwind-accordion${idx}`;

    this.items = this.initializeItems();
    this.itemsByValue = new Map(this.items.map((item) => [item.value, item]));

    this.setupItems();
    this.setInitialState();
  }

  private initializeItems(): AccordionItem[] {
    return Array.from(this.accordion.querySelectorAll<HTMLElement>(".starwind-accordion-item"))
      .map((element, idx) => {
        const trigger = element.querySelector<HTMLElement>(".starwind-accordion-trigger");
        const content = element.querySelector<HTMLElement>(".starwind-accordion-content");
        const value = element.getAttribute("data-value") || String(idx);

        if (!trigger || !content) return null;

        return { element, trigger, content, value };
      })
      .filter((item): item is AccordionItem => item !== null);
  }

  private setupItems(): void {
    this.items.forEach((item, idx) => {
      this.setupAccessibility(item, idx);
      this.setContentHeight(item.content);
      this.setupEventListeners(item);
    });
  }

  private setupAccessibility(item: AccordionItem, idx: number): void {
    const triggerId = `${this.accordionId}-t${idx}`;
    const contentId = `${this.accordionId}-c${idx}`;

    item.trigger.id = triggerId;
    item.trigger.setAttribute("aria-controls", contentId);
    item.trigger.setAttribute("aria-expanded", "false");

    item.content.id = contentId;
    item.content.setAttribute("aria-labelledby", triggerId);
    item.content.setAttribute("role", "region");
  }

  private setContentHeight(content: HTMLElement): void {
    const contentInner = content.firstElementChild as HTMLElement;
    if (contentInner) {
      const height = contentInner.getBoundingClientRect().height;
      content.style.setProperty("--starwind-accordion-content-height", `${height}px`);
    }
  }

  private setInitialState(): void {
    const defaultValue = this.accordion.dataset.value;
    if (defaultValue) {
      const item = this.itemsByValue.get(defaultValue);
      if (item) {
        this.setItemState(item, true);
      }
    }
  }

  private setupEventListeners(item: AccordionItem): void {
    item.trigger.addEventListener("click", () => this.handleClick(item));
    item.trigger.addEventListener("keydown", (e) => this.handleKeyDown(e, item));
  }

  private handleClick(item: AccordionItem): void {
    const isOpen = item.element.getAttribute("data-state") === "open";
    this.toggleItem(item, !isOpen);
  }

  private handleKeyDown(event: KeyboardEvent, item: AccordionItem): void {
    const index = this.items.indexOf(item);

    const keyActions: Record<string, () => void> = {
      ArrowDown: () => this.focusItem(index + 1),
      ArrowUp: () => this.focusItem(index - 1),
      Home: () => this.focusItem(0),
      End: () => this.focusItem(this.items.length - 1),
    };

    const action = keyActions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }

  private focusItem(index: number): void {
    const targetIndex = (index + this.items.length) % this.items.length;
    this.items[targetIndex].trigger.focus();
  }

  private toggleItem(item: AccordionItem, shouldOpen: boolean): void {
    if (this.type === "single" && shouldOpen) {
      this.items.forEach((otherItem) => {
        if (otherItem !== item && otherItem.element.getAttribute("data-state") === "open") {
          this.setItemState(otherItem, false);
        }
      });
    }

    this.setItemState(item, shouldOpen);
  }

  private setItemState(item: AccordionItem, isOpen: boolean): void {
    const state: AccordionState = isOpen ? "open" : "closed";

    if (isOpen) {
      item.content.style.removeProperty("animation");
    }

    this.setContentHeight(item.content);

    item.element.setAttribute("data-state", state);
    item.content.setAttribute("data-state", state);
    item.trigger.setAttribute("data-state", state);
    item.trigger.setAttribute("aria-expanded", isOpen.toString());
  }
}

const accordionInstances = new WeakMap<HTMLElement, AccordionHandler>();

/**
 * Initialize all accordion elements matching the given selector.
 * Call once on load and again on `astro:after-swap` for view transitions.
 */
export function setupAccordions(selector: string): void {
  document.querySelectorAll<HTMLElement>(selector).forEach((accordion, idx) => {
    if (!accordionInstances.has(accordion)) {
      accordionInstances.set(accordion, new AccordionHandler(accordion, idx));
    }
  });
}
