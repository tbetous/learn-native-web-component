class CustomArticle extends HTMLElement {
  constructor() {
    const self = super();
    const template = document.getElementById("custom-element-template");
    const templateContent = template.content;
    this.attachShadow({ mode: "open" }).appendChild(
      templateContent.cloneNode(true)
    );
    return self;
  }
}

customElements.define("custom-article", CustomArticle);
