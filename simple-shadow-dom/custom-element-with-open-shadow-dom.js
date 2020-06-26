class CustomElementWithOpenShadowDom extends HTMLElement {
  constructor() {
    const self = super();
    const shadow = this.attachShadow({ mode: "open" });
    const p = document.createElement("p");
    const style = document.createElement("style");
    p.textContent = "I am a custom element with a open shadow dom!";
    style.textContent = `
        p {
          color: blue;
        }
      `;
    shadow.appendChild(style);
    shadow.appendChild(p);
    return self;
  }
}

customElements.define(
  "custom-element-with-open-shadow-dom",
  CustomElementWithOpenShadowDom
);
