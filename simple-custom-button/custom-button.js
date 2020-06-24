class CustomButton extends HTMLButtonElement {
  constructor() {
    const self = super();
    const icon = document.createElement("span");
    const text = document.createElement("span");
    icon.innerHTML = this.getIcon(this.getAttribute("data-icon"));
    icon.setAttribute("role", "img");
    icon.setAttribute("alt", "");
    text.textContent = this.getAttribute("data-text");
    this.appendChild(icon);
    this.appendChild(text);
    return self;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data-icon") {
      this.getElementsByTagName("span")[0].textContent = this.getIcon(newValue);
    }
    if (name === "data-text") {
      this.getElementsByTagName("span")[1].textContent = newValue;
    }
  }

  getIcon(label) {
    switch (this.getAttribute("data-icon")) {
      case "search":
        return "🔎";
      case "check":
        return "✅";
      case "cancel":
        return "❌";
      default:
        return "";
    }
  }

  static get observedAttributes() {
    return ["data-text", "data-icon"];
  }
}

customElements.define("custom-button", CustomButton, { extends: "button" });
