const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 0.9em;
            width: 0.9em;
            padding: 0.25em;
            border: black 1px solid;
            border-radius: 2px;
            cursor: pointer;
            user-select: none;
        }

        :host([disabled]) {
          opacity: 0.4;
          cursor: inherit;
        }
    </style>
`;

const KEYCODE = {
  space: 32,
};

const EMOJI = {
  thumbsUp: "👍",
  thumbsDown: "👎",
};

class EmojiCheckbox extends HTMLElement {
  constructor() {
    const self = super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    return self;
  }

  static get observedAttributes() {
    return ["checked", "disabled"];
  }

  set checked(value) {
    const isChecked = Boolean(value);
    if (isChecked) {
      this.setAttribute("checked", "");
    } else {
      this.removeAttribute("checked");
    }
  }

  get checked() {
    return this.hasAttribute("checked");
  }

  set disabled(value) {
    const isDisabled = Boolean(value);
    if (isDisabled) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  connectedCallback() {
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "checkbox");
    }
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", 0);
    }
    this._defaultTabIndex = this.hasAttribute("tabindex")
      ? this.getAttribute("tabindex")
      : 0;
    this._upgradeProperty("checked");
    this._upgradeProperty("disabled");
    this._processCheck();
    this._processDisable();
    this.addEventListener("click", this._onClick);
    this.addEventListener("keyup", this._onKeyUp);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
    const hasValue = newValue !== null;
    if (name === "checked") {
      this.setAttribute("aria-checked", hasValue);
      this._processCheck();
    } else if (name === "disabled") {
      this.setAttribute("aria-disabled", hasValue);
      this._processDisable();
    }
  }

  _processCheck() {
    if (this.hasAttribute("checked")) {
      this.shadowRoot.lastChild.textContent = EMOJI.thumbsUp;
    } else {
      this.shadowRoot.lastChild.textContent = EMOJI.thumbsDown;
    }
  }

  _processDisable() {
    if (this.hasAttribute("disabled")) {
      this.removeAttribute("tabindex");
      this.blur();
    } else {
      this.setAttribute("tabindex", 0);
    }
  }

  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  _onKeyUp(event) {
    if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey)
      return;
    switch (event.keyCode) {
      case KEYCODE.space:
        event.preventDefault();
        this._toggleChecked();
        break;
      default:
        break;
    }
  }

  _onClick() {
    this._toggleChecked();
  }

  _toggleChecked() {
    if (this.hasAttribute("disabled")) return;
    this.checked = !this.checked;
  }
}

customElements.define("emoji-checkbox", EmojiCheckbox);
