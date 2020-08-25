const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: inline-block;
            cursor: pointer;
        }

        :host([disabled]) {
            opacity: 0.5;
            cursor: unset;
        }

        :host([checked]) .switch {
            background-color: green;
        }

        .switch {
            position: relative;
            height: 20px;
            width: 40px;
            background-color: black;
            border-radius: 10px;
            transition: color ease-in-out 0.5s;
        }
        
        .checked-indicator {
            position: absolute;
            display: inline-block;
            top: 1px;
            height: 18px;
            width: 18px;
            background-color: white;
            border-radius: 9px;
            transition: all ease-in-out 0.1s;
        }
    </style>
    <div class="switch" part="switch">
        <span class="checked-indicator" part="checked-indicator"></span>
    </div>
`;

const KEYCODE = {
  SPACE: 32,
};

class Switch extends HTMLElement {
  constructor() {
    const self = super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    return self;
  }

  get checked() {
    return this.hasAttribute("checked");
  }

  set checked(value) {
    if (value) {
      this.setAttribute("checked", "");
    } else {
      this.removeAttribute("checked");
    }
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  static get observedAttributes() {
    return ["checked", "disabled"];
  }

  connectedCallback() {
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "switch");
    }
    if (!this.hasAttribute("checked")) {
      this.attributeChangedCallback("checked", null, null);
    }
    if (!this.hasAttribute("disabled")) {
      this.attributeChangedCallback("disabled", null, null);
    }
    this.addEventListener("click", this._onClick);
    this.addEventListener("keydown", this._onKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    this.removeEventListener("keydown", this._onKeydown);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const hasValue = newValue !== null;
    if (name === "checked") {
      const checkedIndicator = this.shadowRoot.querySelector(
        ".checked-indicator"
      );
      checkedIndicator.style.left = hasValue ? "21px" : "1px";
      this.setAttribute("aria-checked", hasValue);
    }
    if (name === "disabled") {
      this.setAttribute("aria-disabled", hasValue);
      if (!hasValue) {
        this.setAttribute("tabindex", 0);
      } else {
        this.removeAttribute("tabindex");
      }
    }
  }

  _toggleCheck() {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            checked: this.checked,
          },
          bubbles: true,
        })
      );
    }
  }

  _onClick(event) {
    this._toggleCheck();
    event.preventDefault();
  }

  _onKeydown(event) {
    if (event.altKey) return;
    if (event.keyCode === KEYCODE.SPACE) {
      this._toggleCheck();
      event.preventDefault();
    }
  }

  _updateProperty(prop) {
    const value = this[prop];
    delete this[prop];
    this[prop] = value;
  }
}

customElements.define("x-switch", Switch);
