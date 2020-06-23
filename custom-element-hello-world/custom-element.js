class CustomElement extends HTMLElement {
  constructor() {
    const self = super();
    const span = document.createElement("span");
    span.textContent = this.getAttribute("data-text");
    this.appendChild(span);
    return self;
  }

  connectedCallback() {
    console.log("Custom element has been added to a page.");
  }

  disconnectedCallback() {
    console.log("Custom element has been removed from a page.");
  }

  adoptedCallback() {
    console.log("Custom element has been moved to a new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("Custom element attributes changed.");
    if (name === "data-text") {
      this.getElementsByTagName("span")[0].textContent = newValue;
    }
  }

  static get observedAttributes() {
    return ["data-text"];
  }
}

customElements.define("custom-element", CustomElement);
