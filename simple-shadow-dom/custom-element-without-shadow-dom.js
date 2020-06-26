class CustomElementWithoutShadowDom extends HTMLElement {
  constructor() {
    const self = super();
    const p = document.createElement("p");
    const style = document.createElement("style");
    p.textContent = "I am a custom element with a closed shadow dom!";
    style.textContent = `
      p {
        color: yellow;
      }
      p::first-letter {
        color: orange;
      }
    `;
    this.appendChild(style);
    this.appendChild(p);
    return self;
  }
}

customElements.define(
  "custom-element-without-shadow-dom",
  CustomElementWithoutShadowDom
);
