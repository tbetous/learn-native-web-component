const xTabsTemplate = document.createElement("template");
xTabsTemplate.innerHTML = `
    <style>
      :host {
        display: flex;
        flex-wrap: wrap;
      }
      ::slotted(x-tab) {
        padding: 1em;
        border: 1px solid black;
        cursor: pointer;
      }
      ::slotted(x-tab[selected]) {
        background-color: #666666;
        color: #FFFFFF;
      }
      ::slotted(x-panel) {
        flex-basis: 100%;
        padding: 1em;
        border: 1px solid black;
      }
    </style>
    <slot name="tabs">TABS</slot>
    <slot name="panels">PANELS</slot>
`;

const KEYCODE = {
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  HOME: 36,
  END: 35,
};

class Tabs extends HTMLElement {
  constructor() {
    const self = super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(xTabsTemplate.content.cloneNode(true));
    this._tabsSlot = this.shadowRoot.querySelector("slot[name=tabs]");
    this._panelsSlot = this.shadowRoot.querySelector("slot[name=panels]");
    this._tabsSlot.addEventListener("slotchange", this._linkTabs.bind(this));
    this._panelsSlot.addEventListener("slotchange", this._linkTabs.bind(this));
    this.addEventListener("click", this._onClick);
    this.addEventListener("keydown", this._onKeydown);
    return self;
  }

  connectedCallback() {
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "tablist");
    }
  }

  _linkTabs() {
    const tabs = this._getTabs();
    tabs.forEach((tab) => {
      const panel = tab.nextElementSibling;
      if (panel && panel.tagName.toLowerCase() === "x-panel") {
        panel.setAttribute("aria-labelledby", tab.id);
        tab.setAttribute("aria-controls", panel.id);
      }
    });

    const selectedTab = tabs.find((tab) => tab.selected) || tabs[0];
    this._selectTab(selectedTab);
  }

  _getTabs() {
    return Array.from(this.querySelectorAll("x-tab"));
  }

  _getFirstTab() {
    const tabs = this._getTabs();
    return tabs[0];
  }

  _getLastTab() {
    const tabs = this._getTabs();
    return tabs[tabs.length - 1];
  }

  _getPreviousTab() {
    const tabs = this._getTabs();
    const index = tabs.findIndex((tab) => document.activeElement == tab);
    if (index == 0) {
      return this._getLastTab();
    } else {
      return tabs[index - 1];
    }
  }

  _getNextTab() {
    const tabs = this._getTabs();
    const index = tabs.findIndex((tab) => document.activeElement == tab);
    if (index == tabs.length - 1) {
      return this._getFirstTab();
    } else {
      return tabs[index + 1];
    }
  }

  _getPanels() {
    return Array.from(this.querySelectorAll("x-panel"));
  }

  _clear() {
    const tabs = this._getTabs();
    const panels = this._getPanels();
    tabs.forEach((tab) => (tab.selected = false));
    panels.forEach((panel) => (panel.hidden = true));
  }

  _selectTab(tab) {
    this._clear();
    tab.selected = true;
    const panel = this.querySelector(`#${tab.getAttribute("aria-controls")}`);
    if (panel) {
      panel.hidden = false;
    }
    tab.focus();
  }

  _onClick(event) {
    if (event.target.getAttribute("role") === "tab") {
      this._selectTab(event.target);
    }
  }

  _onKeydown(event) {
    switch (event.keyCode) {
      case KEYCODE.HOME:
        this._selectTab(this._getFirstTab());
        break;
      case KEYCODE.END:
        this._selectTab(this._getLastTab());
        break;
      case KEYCODE.DOWN:
      case KEYCODE.RIGHT:
        this._selectTab(this._getNextTab());
        break;
      case KEYCODE.UP:
      case KEYCODE.LEFT:
        this._selectTab(this._getPreviousTab());
        break;
      default:
        break;
    }
  }
}

let tabCount = 0;

class Tab extends HTMLElement {
  constructor() {
    const self = super();
    return self;
  }

  get selected() {
    this.hasAttribute("selected");
  }

  set selected(value) {
    if (value === true) {
      this.setAttribute("selected", "");
    } else {
      this.removeAttribute("selected");
    }
  }

  static get observedAttributes() {
    return ["selected"];
  }

  connectedCallback() {
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "tab");
    }
    if (!this.hasAttribute("id")) {
      this.setAttribute("id", `tab-generated-id-${tabCount}`);
      tabCount++;
    }
    if (!this.hasAttribute("selected")) {
      this.setAttribute("aria-selected", false);
      this.setAttribute("tabindex", -1);
    }
    this._upgradeProperty();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const hasValue = newValue !== null;
    if (name === "selected") {
      this.setAttribute("aria-selected", hasValue);
      this.setAttribute("tabindex", hasValue ? 0 : -1);
    }
  }

  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
}

let panelCount = 0;

class Panel extends HTMLElement {
  constructor() {
    const self = super();
    return self;
  }

  get hidden() {
    this.hasAttribute("hidden");
  }

  set hidden(value) {
    if (value === true) {
      this.setAttribute("hidden", "");
    } else {
      this.removeAttribute("hidden");
    }
  }

  static get observedAttributes() {
    return ["hidden"];
  }

  connectedCallback() {
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "tabpanel");
    }
    if (!this.hasAttribute("id")) {
      this.setAttribute("id", `panel-generated-id-${panelCount}`);
      panelCount++;
    }
  }

  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
}

customElements.define("x-tabs", Tabs);
customElements.define("x-tab", Tab);
customElements.define("x-panel", Panel);
