class CustomElementWithClosedShadowDom extends HTMLElement {
  constructor() {
    const self = super();
    const shadow = this.attachShadow({ mode: "closed" });
    const p = document.createElement("p");
    const style = document.createElement("style");
    p.textContent = "I am a custom element with a closed shadow dom!";
    style.textContent = `
      p {
        color: red;
      }
    `;
    shadow.appendChild(style);
    shadow.appendChild(p);
    return self;
  }
}

customElements.define(
  "custom-element-with-closed-shadow-dom",
  CustomElementWithClosedShadowDom
);
