import {html as $8ptIG$html, LitElement as $8ptIG$LitElement, css as $8ptIG$css} from "lit";

// @ts-nocheck

const $a54bcddd1699ab92$var$$$tabindex = Symbol('tabindex');
const $a54bcddd1699ab92$var$$$oldTabindex = Symbol('oldTabindex');
const $a54bcddd1699ab92$var$$$newTabindex = Symbol('newTabindex');
const $a54bcddd1699ab92$export$bfd52848c59c7c40 = (superClass)=>class extends superClass {
        static get properties() {
            return {
                tabIndex: {
                    converter: {
                        fromAttribute: Number,
                        toAttribute: (value)=>value == null ? null : value.toString()
                    },
                    noAccessor: true,
                    reflect: true
                },
                /**
         * If true, the user cannot interact with this element.
         */ disabled: {
                    type: Boolean,
                    reflect: true
                }
            };
        }
        constructor(){
            super();
            if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
        }
        get tabIndex() {
            return this[$a54bcddd1699ab92$var$$$tabindex];
        }
        set tabIndex(value) {
            const oldValue = this[$a54bcddd1699ab92$var$$$tabindex];
            this[$a54bcddd1699ab92$var$$$tabindex] = value;
            this.requestUpdate('tabIndex', oldValue);
        }
        firstUpdated() {
            this.addEventListener('focusin', (e)=>{
                if (e.composedPath()[0] === this) this._focus();
            });
            this.addEventListener('keydown', (e)=>{
                if (!e.defaultPrevented && e.shiftKey && e.keyCode === 9) {
                    this._isShiftTabbing = true;
                    HTMLElement.prototype.focus.apply(this);
                    setTimeout(()=>{
                        this._isShiftTabbing = false;
                    }, 0);
                }
            });
        }
        update(props) {
            if (props.has('disabled')) this._disabledChanged(this.disabled, props.get('disabled'));
            if (props.has('tabIndex')) {
                this[$a54bcddd1699ab92$var$$$newTabindex] = this.tabIndex;
                this._tabIndexChanged(this.tabIndex);
            }
            super.update(props);
        }
        updated(props) {
            super.updated(props);
            if (props.has('disabled')) {
                this.focusElement.disabled = this.disabled;
                if (this.disabled) this.blur();
            }
            if (props.has('tabIndex') && this[$a54bcddd1699ab92$var$$$newTabindex] !== undefined) {
                this.focusElement.tabIndex = this[$a54bcddd1699ab92$var$$$newTabindex];
                this[$a54bcddd1699ab92$var$$$newTabindex] = undefined;
            }
        }
        get focusElement() {
            window.console.warn(`Please implement the 'focusElement' property in <${this.localName}>`);
            return this;
        }
        _focus() {
            if (this._isShiftTabbing) return;
            this.focusElement.focus();
        }
        focus() {
            if (this.disabled) return;
            this.focusElement.focus();
        }
        blur() {
            this.focusElement.blur();
        }
        _disabledChanged(disabled, oldDisabled) {
            if (disabled) {
                this[$a54bcddd1699ab92$var$$$oldTabindex] = this.tabIndex;
                this.tabIndex = -1;
                this.setAttribute('aria-disabled', 'true');
            } else if (oldDisabled) {
                if (this[$a54bcddd1699ab92$var$$$oldTabindex] !== undefined) this.tabIndex = this[$a54bcddd1699ab92$var$$$oldTabindex];
                this.removeAttribute('aria-disabled');
            }
        }
        _tabIndexChanged(tabindex) {
            if (this.disabled && tabindex) {
                if (this.tabIndex !== -1) this[$a54bcddd1699ab92$var$$$oldTabindex] = this.tabIndex;
                this.tabIndex = null;
            }
        }
    };



const $3fc421fd875beaac$export$19a3970fbcd4ca20 = (0, $8ptIG$css)`
  * {
    cursor: pointer;
    font-weight: 500;
    text-transform: uppercase;
    text-decoration: none;
    letter-spacing: 0.04em;
    white-space: normal;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    background-color: transparent;
    border-color: transparent;
    border-radius: 0;
    transition:
      color 0.15s ease-in-out,
      background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out;
    margin: 0;
    border-radius: 0;
    font-family:
      proxima-nova,
      calibri,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      Arial,
      'Noto Sans',
      sans-serif,
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'Noto Color Emoji';
    line-height: 1.5;
  }

  .makeitred {
    color: red;
  }
  .default {
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
  }

  .large {
    padding: 0.5rem 1rem;
    font-size: 1.25rem;
  }

  .medium {
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
  }

  .small {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }

  .red,
  .outline-red:hover {
    background-color: #8b0015;
    color: white;
  }

  .red:hover,
  .red[active] {
    background-color: #ab0520 !important;
    color: white !important;
  }

  .blue,
  .outline-blue:hover {
    background-color: #0c234b;
    color: white;
  }

  .blue:hover,
  .blue[active] {
    background-color: #1e5288;
    color: white;
  }

  .success,
  .outline-success:hover {
    background-color: #70b865;
    color: #001c48;
  }

  .success:hover,
  .success[active] {
    background-color: #5aa94e;
    color: #001c48;
  }

  .danger,
  .outline-danger:hover {
    background-color: #a95c42;
    color: white;
  }

  .danger:hover,
  .danger[active] {
    background-color: #8d4d37;
    color: white;
  }

  .warning,
  .outline-warning:hover {
    background-color: #f19e1f;
    color: #000;
  }

  .warning:hover,
  .warning[active] {
    background-color: #dc8a0e;
    color: #000;
  }

  .info,
  .outline-info:hover {
    background-color: #81d3eb;
    color: #001c48;
  }

  .info:hover,
  .info[active] {
    background-color: #60c7e6;
  }

  .light,
  .outline-light:hover {
    background-color: #dee2e6;
    color: #001c48;
  }

  .light:hover,
  .light[active] {
    background-color: #c8cfd6;
  }

  .dark,
  .outline-dark:hover {
    background-color: #343a40;
    color: white;
  }

  .dark:hover,
  .dark[active] {
    background-color: #23272b;
  }

  .white,
  .white[active],
  .outline-white:hover {
    background-color: #fff;
    color: #343a40;
  }

  .outline-red {
    background-color: transparent;
    color: #8b0015;
    border: 2px solid #8b0015;
  }

  .outline-blue {
    background-color: transparent;
    color: #0c234b;
    border: 2px solid #0c234b;
  }

  .outline-success {
    background-color: transparent;
    color: #70b865;
    border: 2px solid #70b865;
  }

  .outline-danger {
    background-color: transparent;
    color: #a95c42;
    border: 2px solid #a95c42;
  }

  .outline-warning {
    background-color: transparent;
    color: #403635;
    border: 2px solid #f19e1f;
  }

  .outline-info {
    background-color: transparent;
    color: #1e5288;
    border: 2px solid #81d3eb;
  }

  .outline-light {
    background-color: transparent;
    color: #403635;
    border: 2px solid #dee2e6;
  }

  .outline-dark {
    background-color: transparent;
    color: #343a40;
    border: 2px solid #343a40;
  }

  .outline-white {
    background-color: transparent;
    color: #fff;
    border: 2px solid #fff;
  }

  .button[block] {
    width: 100% !important;
    display: block !important;
    margin: 0.5rem;
  }

  .button[btn-arrow]:after {
    content: ' »';
  }

  .button[disabled] {
    opacity: 0.65;
  }
`;


const $3ec7ef81de56299a$export$567722ec5f02624e = (e, location = '')=>{
    window.dataLayer = window.dataLayer || [];
    var targetElement = e.composedPath()[0];
    var parentDropDown = e.composedPath()[3].innerText ? e.composedPath()[3].innerText.split("\n")[0] : '';
    window.dataLayer.push({
        event: 'shadow_event_' + e.type,
        shadow_event: {
            elementInnerHTML: targetElement.textContent || '',
            elementInnerText: targetElement.innerText || '',
            title: 'shadow-dom-link',
            element: targetElement,
            elementClasses: targetElement.className || '',
            elementId: targetElement.id || '',
            elementLocation: location || '',
            elementTarget: targetElement.target || '',
            elementUrl: targetElement.href || targetElement.action || '',
            originalEvent: e,
            parent: parentDropDown || "",
            inShadowDom: true
        }
    });
};


class $74c0cb58ecac5e6e$export$2e2bcd8739ae039 extends (0, $a54bcddd1699ab92$export$bfd52848c59c7c40)((0, $8ptIG$LitElement)) {
    static get properties() {
        return {
            ...super.properties,
            theme: {
                type: String,
                reflect: true
            },
            outline: {
                type: Boolean,
                reflect: true
            },
            size: {
                type: String,
                reflect: true
            },
            block: {
                type: Boolean,
                reflect: true
            },
            redbar: {
                type: Boolean,
                reflect: true
            },
            active: {
                type: Boolean,
                reflect: true
            },
            link: {
                type: String,
                reflect: true
            },
            target: {
                type: String,
                reflect: true
            },
            toggle: {
                type: String,
                reflect: true
            },
            event: {
                type: String,
                reflect: true
            },
            elmid: {
                type: String,
                reflect: true
            },
            value: {
                type: String,
                reflect: true
            }
        };
    }
    static get styles() {
        return [
            (0, $3fc421fd875beaac$export$19a3970fbcd4ca20)
        ];
    }
    constructor(){
        super(), this.theme = 'primary', this.outline = false, this.size = 'default', this.block = false, this.redbar = false, this.active = false, this.link = '', this.target = '', this.toggle = '', this.event = '', this.elmid = '', this.value = '';
    }
    attributeChangedCallback(name, oldVal, newVal) {
        super.attributeChangedCallback(name, oldVal, newVal);
    }
    changeAttributes() {
        this.setAttribute('closed', 'true');
        this.setAttribute('aria-expanded', 'true');
        this.requestUpdate();
    }
    get themeClass() {
        const theme = this.theme || 'primary';
        if (this.outline) {
            if (theme === 'blue') return 'outline-blue';
            if (theme === 'success') return 'outline-success';
            if (theme === 'danger') return 'outline-danger';
            if (theme === 'warning') return 'outline-warning';
            if (theme === 'info') return 'outline-info';
            if (theme === 'light') return 'outline-light';
            if (theme === 'dark') return 'outline-dark';
            return 'outline-red';
        }
        if (theme === 'blue') return 'blue';
        if (theme === 'success') return 'success';
        if (theme === 'danger') return 'danger';
        if (theme === 'warning') return 'warning';
        if (theme === 'info') return 'info';
        if (theme === 'light') return 'light';
        if (theme === 'dark') return 'dark';
        if (theme === 'white') return 'white';
        return 'red';
    }
    _handleClick(e) {
        (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, '');
        if (this.event) {
            const dispatchedEvent = new Event(this.event);
            document.querySelector(this.target).dispatchEvent(dispatchedEvent);
            return;
        }
        const openAzOffCanvasMenu = new Event('open-az-offcanvas-menu');
        document.querySelector(this.target).dispatchEvent(openAzOffCanvasMenu);
    }
    render() {
        return (0, $8ptIG$html)`
      ${this.link ? (0, $8ptIG$html)`<a class="button ${this.size || ''} ${this.themeClass}" href="${this.link}" ?disabled="${this.disabled}" ?active="${this.active}" ?block="${this.block}" ?btn-arrow="${this.redbar}" @click="${0, $3ec7ef81de56299a$export$567722ec5f02624e}" id="${this.elmid}">${this.value}<slot></slot></a>` : (0, $8ptIG$html)`<button type="button" class="button ${this.size || ''} ${this.themeClass}" ?disabled="${this.disabled}" role="presentation" ?active="${this.active}" ?block="${this.block}" ?btn-arrow="${this.redbar}" @click="${this._handleClick}" id="${this.elmid}">${this.value}<slot></slot></button>`}
    `;
    }
    firstUpdated() {
        super.firstUpdated();
        this.setAttribute('role', 'button');
    }
    /**
   * @protected
   */ get focusElement() {
        return this.shadowRoot.querySelector('.button');
    }
}
customElements.get('az-button') || customElements.define('az-button', $74c0cb58ecac5e6e$export$2e2bcd8739ae039);




// @ts-nocheck
// @ts-nocheck



class $c6fed9b7d3437e21$export$2e2bcd8739ae039 extends (0, $8ptIG$LitElement) {
    static{
        this.properties = {
            baseurl: {
                type: String,
                reflect: true
            },
            menuId: {
                type: String,
                reflect: true
            }
        };
    }
    static{
        this.styles = (0, $8ptIG$css)`
    * {
      box-sizing: border-box;
    }

    .input-group .form-control,
    .input-group-addon,
    .input-group-btn {
      display: table-cell;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }

    .btn {
      display: inline-block;
      margin-bottom: 0;
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      touch-action: manipulation;
      cursor: pointer;
      background-image: none;
      border: 1px solid transparent;
      padding: 6px 12px;
      font-size: 16px;
      line-height: 1.5;
      border-radius: 0;
      user-select: none;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      white-space: normal;
      font-family: inherit;
    }

    .input-group-addon,
    .input-group-btn {
      width: 1%;
      white-space: nowrap;
      vertical-align: middle;
    }

    .input-group-addon {
      padding: 6px 12px;
      font-size: 16px;
      font-weight: 400;
      line-height: 1;
      color: #49595e;
      text-align: center;
      background-color: #fff;
      border: 1px solid #cbd1e0;
      border-radius: 0;
    }

    .form-control {
      display: block;
      width: 100%;
      height: 38px;
      padding: 6px 12px;
      font-size: 16px;
      line-height: 1.5;
      color: #49595e;
      background-color: #fff;
      background-image: none;
      border: 2px solid #cbd1e0;
      border-radius: 0;
      box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
      transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
      font-family: inherit;
    }

    select.select-primary:active,
    select.select-primary:focus,
    select.select-primary:hover {
      box-shadow: none;
      outline: 0;
    }

    select.select-primary:focus,
    select.select-primary:hover {
      border-bottom: 3px solid #ab0520;
    }

    .input-group-addon.input-group-addon-no-border {
      border: none;
    }

    select.select-primary {
      appearance: none;
      background-color: #f4f6f9;
      background-repeat: no-repeat;
      background-position: calc(100% - 10px) 50%;
      border-top: 1px solid transparent;
      border-right: 0;
      border-bottom: 3px solid #cbd1e0;
      border-left: 0;
      border-radius: 0;
      box-shadow: none;
      color: #57585a;
      font-size: 16px;
      font-family: MiloWeb, sans-serif;
      font-weight: 700;
      letter-spacing: 0.25px;
      line-height: 1.5em;
      outline: none;
      text-indent: 0.01px;
      transition: 0.15s all ease-in-out;
      text-overflow: '';
    }

    .select-menu-label {
      padding: 6px 12px;
      border: 1px solid #cbd1e0;
      background: #fff;
      color: #49595e;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .input-group-btn .btn {
      background: #0c234b;
      color: #fff;
    }
  `;
    }
    render() {
        return (0, $8ptIG$html)`
      <form aria-describedby="tooltip">
        <div id="tooltip" role="tooltip">
          Please make a selection.
          <div id="arrow" data-popper-arrow></div>
        </div>

        <div class="input-group">
          <span class="input-group-addon input-group-addon-no-border">
            <div class="select-menu-label">I am</div>
          </span>
          <label
            for="uaqs-navigation-select-menu-uaqs-audience-select-menu"
            class="sr-only"
          >
            Select your audience
          </label>
          <select
            id="uaqs-navigation-select-menu-uaqs-audience-select-menu"
            class="form-control select-primary"
            aria-invalid="true"
          >
            <option>choose an option</option>
            <option>Prospective Student</option>
            <option>Current Student</option>
            <option>Faculty or Staff</option>
          </select>
          <span class="input-group-btn">
            <button
              id="button"
              class="btn btn-primary btn-blue disabled"
              role="button"
              type="button"
              tabindex="0"
            >
              Go<span class="sr-only">to the page for that group</span>
            </button>
          </span>
        </div>
      </form>
    `;
    }
    constructor(...args){
        super(...args), this.baseurl = '', this.menuId = '';
    }
}
customElements.get('az-select-menu') || customElements.define('az-select-menu', $c6fed9b7d3437e21$export$2e2bcd8739ae039);


class $006bea8753e7b169$export$2e2bcd8739ae039 extends (0, $8ptIG$LitElement) {
    static{
        this.styles = (0, $8ptIG$css)`
			:host {
				font-family: inherit;
				-ms-text-size-adjust: inherit;
				-webkit-text-size-adjust: inherit;
			}
			body {
				margin: 0;
			}
			header,
			menu {
				display: block;
			}
			[hidden] {
				display: none;
			}
			a {
				background-color: transparent;
			}
			a:active,
			a:hover {
				outline: 0;
			}
			img {
				border: 0;
			}
			select {
				color: inherit;
				font: inherit;
				margin: 0;
			}

			select {
				text-transform: none;
			}
			@media print {
				*,
				:after,
				:before {
					color: #000 !important;
					text-shadow: none !important;
					background: 0 0 !important;
					-webkit-box-shadow: none !important;
					box-shadow: none !important;
				}
				a,
				a:visited {
					text-decoration: underline;
				}
				a[href]:after {
					content: " (" attr(href) ")";
				}
				a[href^="#"]:after,
				a[href^="javascript:"]:after {
					content: "";
				}
				img {
					page-break-inside: avoid;
				}
				img {
					max-width: 100% !important;
				}
				.label {
					border: 1px solid #000;
				}
			}
			* {
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
			}
			:after,
			:before {
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
			}
			html {
				font-size: 10px;
				-webkit-tap-highlight-color: transparent;
			}
			body {
				font-family: MiloWeb-Text, Verdana, Geneva, sans-serif;
				font-size: 16px;
				line-height: 1.5;
				color: #403635;
				background-color: #fff;
			}
			select {
				font-family: inherit;
				font-size: inherit;
				line-height: inherit;
			}
			a {
				color: #8b0015;
				text-decoration: none;
			}
			a:focus,
			a:hover {
				color: #8b0015;
				text-decoration: underline;
			}
			a:focus {
				outline: 5px auto -webkit-focus-ring-color;
				outline-offset: -2px;
			}
			img {
				vertical-align: middle;
			}
			[role="button"] {
				cursor: pointer;
			}
			.page-header {
				padding-bottom: 11px;
				margin: 48px 0 24px;
				border-bottom: 1px solid #fff;
			}
			.page-row > .row {
				border-bottom: 1px solid #e2e9eb;
			}
			.container {
				padding-right: 16px;
				padding-left: 16px;
				margin-right: auto;
				margin-left: auto;
			}
			.container:after,
			.container:before {
				display: table;
				content: " ";
			}
			.container:after {
				clear: both;
			}

			#block-bean-cta-request-info {
				margin-top: 17px;
				padding-left: 23px;
				max-width: 539px;
			}

			#block-bean-cta-apply {
				margin-top: 16px;
				padding-left: 23px;
				max-width: 539px;
				margin-bottom: 16px;
			}

			.region-header-2 {
				max-width: 540px;
				margin: auto;
			}

			@media (min-width: 768px) {
				.container {
					width: 752px;
				}
				.region #block-bean-uaqs-audience-select {
					padding-right: 35px;
					padding-left: 25px;
					margin-top: 27px;
				}
				#block-bean-cta-request-info {
					margin-top: 39px;
					padding-left: 23px;
					max-width: 352px;
				}

				#block-bean-cta-apply {
					margin-top: 16px;
					padding-left: 23px;
					max-width: 352px;
					margin-bottom: 16px;
				}
			}
			@media (min-width: 992px) {
				#block-bean-cta-request-info {
					margin-top: 0;
					padding-left: 0;
				}
				#block-bean-cta-apply {
					margin-top: 0;
					padding-left: 0;
				}
				.region #block-bean-uaqs-audience-select {
					padding-right: 33px;
					padding-left: 15px;
					margin-top: 0px;
				}
				.region-header-2 {
					max-width: 100%;
				}
			}
			@media (min-width: 1200px) {
				.region #block-bean-uaqs-audience-select {
					padding-right: 16px;
					padding-left: 29px;
					margin-top: 0px;
				}
				#block-bean-cta-request-info {
					margin-top: 0px;
					padding-left: 0;
					max-width: 100%;
				}

				#block-bean-cta-apply {
					margin-top: 0px;
					padding-left: 0;
					max-width: 100%;
					margin-bottom: 0;
				}
			}
			@media (min-width: 992px) {
				.region-header-2 {
					margin-top: 23px;
				}
				.container {
					width: 972px;
				}
			}
			@media (min-width: 1200px) {
				.container {
					width: 1172px;
				}
			}
			.row {
				margin-right: -15px;
				margin-left: -15px;
			}
			.row:after,
			.row:before {
				display: table;
				content: " ";
			}
			.row:after {
				clear: both;
			}
			.col-lg-1,
			.col-lg-10,
			.col-lg-11,
			.col-lg-12,
			.col-lg-2,
			.col-lg-3,
			.col-lg-4,
			.col-lg-5,
			.col-lg-6,
			.col-lg-7,
			.col-lg-8,
			.col-lg-9,
			.col-md-1,
			.col-md-10,
			.col-md-11,
			.col-md-12,
			.col-md-2,
			.col-md-3,
			.col-md-4,
			.col-md-5,
			.col-md-6,
			.col-md-7,
			.col-md-8,
			.col-md-9,
			.col-sm-1,
			.col-sm-10,
			.col-sm-11,
			.col-sm-12,
			.col-sm-2,
			.col-sm-3,
			.col-sm-4,
			.col-sm-5,
			.col-sm-6,
			.col-sm-7,
			.col-sm-8,
			.col-sm-9,
			.col-xs-1,
			.col-xs-10,
			.col-xs-11,
			.col-xs-12,
			.col-xs-2,
			.col-xs-3,
			.col-xs-4,
			.col-xs-5,
			.col-xs-6,
			.col-xs-7,
			.col-xs-8,
			.col-xs-9 {
				position: relative;
				min-height: 1px;
				padding-right: 11px;
				padding-left: 2px;
			}
			.col-xs-1,
			.col-xs-10,
			.col-xs-11,
			.col-xs-12,
			.col-xs-2,
			.col-xs-3,
			.col-xs-4,
			.col-xs-5,
			.col-xs-6,
			.col-xs-7,
			.col-xs-8,
			.col-xs-9 {
				float: left;
			}
			.col-xs-1 {
				width: 8.333333%;
			}
			.col-xs-2 {
				width: 16.666667%;
			}
			.col-xs-3 {
				width: 25%;
			}
			.col-xs-4 {
				width: 33.333333%;
			}
			.col-xs-5 {
				width: 41.666667%;
			}
			.col-xs-6 {
				width: 50%;
			}
			.col-xs-7 {
				width: 58.333333%;
			}
			.col-xs-8 {
				width: 66.666667%;
			}
			.col-xs-9 {
				width: 75%;
			}
			.col-xs-10 {
				width: 83.333333%;
			}
			.col-xs-11 {
				width: 91.666667%;
			}
			.col-xs-12 {
				width: 100%;
			}
			.col-xs-offset-0 {
				margin-left: 0;
			}
			.col-xs-offset-1 {
				margin-left: 8.333333%;
			}
			.col-xs-offset-2 {
				margin-left: 16.666667%;
			}
			.col-xs-offset-3 {
				margin-left: 25%;
			}
			.col-xs-offset-4 {
				margin-left: 33.333333%;
			}
			.col-xs-offset-5 {
				margin-left: 41.666667%;
			}
			.col-xs-offset-6 {
				margin-left: 50%;
			}
			.col-xs-offset-7 {
				margin-left: 58.333333%;
			}
			.col-xs-offset-8 {
				margin-left: 66.666667%;
			}
			.col-xs-offset-9 {
				margin-left: 75%;
			}
			.col-xs-offset-10 {
				margin-left: 83.333333%;
			}
			.col-xs-offset-11 {
				margin-left: 91.666667%;
			}
			.col-xs-offset-12 {
				margin-left: 100%;
			}
			#block-bean-uaqs-audience-select {
				padding-right: 20px;
				padding-left: 26px;
				margin-top: 18px;
			}
			@media (min-width: 768px) {
				.col-sm-1,
				.col-sm-10,
				.col-sm-11,
				.col-sm-12,
				.col-sm-2,
				.col-sm-3,
				.col-sm-4,
				.col-sm-5,
				.col-sm-6,
				.col-sm-7,
				.col-sm-8,
				.col-sm-9 {
					float: left;
				}
				.col-sm-1 {
					width: 8.333333%;
				}
				.col-sm-2 {
					width: 16.666667%;
				}
				.col-sm-3 {
					width: 25%;
				}
				.col-sm-4 {
					width: 33.333333%;
				}
				.col-sm-5 {
					width: 41.666667%;
				}
				.col-sm-6 {
					width: 50%;
				}
				.col-sm-7 {
					width: 58.333333%;
				}
				.col-sm-8 {
					width: 66.666667%;
				}
				.col-sm-9 {
					width: 75%;
				}
				.col-sm-10 {
					width: 83.333333%;
				}
				.col-sm-11 {
					width: 91.666667%;
				}
				.col-sm-12 {
					width: 100%;
				}
				.col-sm-offset-0 {
					margin-left: 0;
				}
				.col-sm-offset-1 {
					margin-left: 8.333333%;
				}
				.col-sm-offset-2 {
					margin-left: 16.666667%;
				}
				.col-sm-offset-3 {
					margin-left: 25%;
				}
				.col-sm-offset-4 {
					margin-left: 33.333333%;
				}
				.col-sm-offset-5 {
					margin-left: 41.666667%;
				}
				.col-sm-offset-6 {
					margin-left: 50%;
				}
				.col-sm-offset-7 {
					margin-left: 58.333333%;
				}
				.col-sm-offset-8 {
					margin-left: 66.666667%;
				}
				.col-sm-offset-9 {
					margin-left: 75%;
				}
				.col-sm-offset-10 {
					margin-left: 83.333333%;
				}
				.col-sm-offset-11 {
					margin-left: 91.666667%;
				}
				.col-sm-offset-12 {
					margin-left: 100%;
				}
			}
			@media (min-width: 992px) {
				.col-md-1,
				.col-md-10,
				.col-md-11,
				.col-md-12,
				.col-md-2,
				.col-md-3,
				.col-md-4,
				.col-md-5,
				.col-md-6,
				.col-md-7,
				.col-md-8,
				.col-md-9 {
					float: left;
				}
				.col-md-1 {
					width: 8.333333%;
				}
				.col-md-2 {
					width: 16.666667%;
				}
				.col-md-3 {
					width: 25%;
				}
				.col-md-4 {
					width: 33.333333%;
				}
				.col-md-5 {
					width: 41.666667%;
				}
				.col-md-6 {
					width: 50%;
				}
				.col-md-7 {
					width: 58.333333%;
				}
				.col-md-8 {
					width: 66.666667%;
				}
				.col-md-9 {
					width: 75%;
				}
				.col-md-10 {
					width: 83.333333%;
				}
				.col-md-11 {
					width: 91.666667%;
				}
				.col-md-12 {
					width: 100%;
				}
				.col-md-offset-0 {
					margin-left: 0;
				}
				.col-md-offset-1 {
					margin-left: 8.333333%;
				}
				.col-md-offset-2 {
					margin-left: 16.666667%;
				}
				.col-md-offset-3 {
					margin-left: 25%;
				}
				.col-md-offset-4 {
					margin-left: 33.333333%;
				}
				.col-md-offset-5 {
					margin-left: 41.666667%;
				}
				.col-md-offset-6 {
					margin-left: 50%;
				}
				.col-md-offset-7 {
					margin-left: 58.333333%;
				}
				.col-md-offset-8 {
					margin-left: 66.666667%;
				}
				.col-md-offset-9 {
					margin-left: 75%;
				}
				.col-md-offset-10 {
					margin-left: 83.333333%;
				}
				.col-md-offset-11 {
					margin-left: 91.666667%;
				}
				.col-md-offset-12 {
					margin-left: 100%;
				}
			}
			@media (min-width: 992px) {
				.col-lg-1,
				.col-lg-10,
				.col-lg-11,
				.col-lg-12,
				.col-lg-2,
				.col-lg-3,
				.col-lg-4,
				.col-lg-5,
				.col-lg-6,
				.col-lg-7,
				.col-lg-8,
				.col-lg-9 {
					float: left;
				}
				.col-lg-1 {
					width: 8.333333%;
				}
				.col-lg-2 {
					width: 16.666667%;
				}
				.col-lg-3 {
					width: 25%;
				}
				.col-lg-4 {
					width: 33.333333%;
				}
				.col-lg-5 {
					width: 41.666667%;
				}
				.col-lg-6 {
					width: 50%;
				}
				.col-lg-7 {
					width: 58.333333%;
				}
				.col-lg-8 {
					width: 66.666667%;
				}
				.col-lg-9 {
					width: 75%;
				}
				.col-lg-10 {
					width: 83.333333%;
				}
				.col-lg-11 {
					width: 91.666667%;
				}
				.col-lg-12 {
					width: 100%;
				}
				.col-lg-offset-0 {
					margin-left: 0;
				}
				.col-lg-offset-1 {
					margin-left: 8.333333%;
				}
				.col-lg-offset-2 {
					margin-left: 16.666667%;
				}
				.col-lg-offset-3 {
					margin-left: 25%;
				}
				.col-lg-offset-4 {
					margin-left: 33.333333%;
				}
				.col-lg-offset-5 {
					margin-left: 41.666667%;
				}
				.col-lg-offset-6 {
					margin-left: 50%;
				}
				.col-lg-offset-7 {
					margin-left: 58.333333%;
				}
				.col-lg-offset-8 {
					margin-left: 66.666667%;
				}
				.col-lg-offset-9 {
					margin-left: 75%;
				}
				.col-lg-offset-10 {
					margin-left: 83.333333%;
				}
				.col-lg-offset-11 {
					margin-left: 91.666667%;
				}
				.col-lg-offset-12 {
					margin-left: 100%;
				}
			}
			label {
				display: inline-block;
				max-width: 100%;
				margin-bottom: 5px;
				font-weight: 700;
			}
			select[multiple],
			select[size] {
				height: auto;
			}
			.label {
				display: inline;
				padding: 0.2em 0.6em 0.3em;
				font-size: 75%;
				font-weight: 700;
				line-height: 1;
				color: #fff;
				text-align: center;
				white-space: nowrap;
				vertical-align: baseline;
				border-radius: 0.25em;
			}
			.label:empty {
				display: none;
			}
			a.label:focus,
			a.label:hover {
				color: #fff;
				text-decoration: none;
				cursor: pointer;
			}
			.label-default {
				background-color: #ab0520;
			}
			.label-default[href]:focus,
			.label-default[href]:hover {
				background-color: #790417;
			}
			.label-info {
				background-color: #81d3eb;
			}
			.label-info[href]:focus,
			.label-info[href]:hover {
				background-color: #55c4e4;
			}
			@-webkit-keyframes progress-bar-stripes {
				from {
					background-position: 40px 0;
				}
				to {
					background-position: 0 0;
				}
			}
			@keyframes progress-bar-stripes {
				from {
					background-position: 40px 0;
				}
				to {
					background-position: 0 0;
				}
			}
			html {
				font-size: 16px;
			}
			a {
				font-weight: 700;
				-webkit-transition: color 0.1s ease-in-out;
				transition: color 0.1s ease-in-out;
			}
			.page-header {
				margin: 3rem 0 2rem;
				line-height: 1.2;
			}
			label {
				color: #49595e;
			}
			.label {
				border-radius: 0;
			}
			select {
				border: 0;
				outline: 1px solid #cbd1e0;
				background-color: #fff;
				border-radius: 0;
			}
			.label {
				font-size: 0.7em;
				font-weight: 700;
				line-height: 1.5;
				color: #fff;
				margin: 0 0.5em;
			}
			img {
				max-width: 100%;
				height: auto;
			}
			a.link-container {
				color: inherit;
				display: block;
				font-weight: inherit;
			}
			a.link-container:focus,
			a.link-container:hover {
				background-color: #eef1f1;
				outline: 0;
				text-decoration: none;
				color: inherit;
			}
			.arizona-logo {
				display: inline-block;
				height: 20px;
				margin: 19px 0 20px;
				max-width: 80%;
				float: left;
				width: 276px;
				padding: 0 0 0 0.6rem;
			}
			.bottom-buffer-xs-0 {
				margin-bottom: 0;
			}
			.bottom-buffer-1,
			.bottom-buffer-xs-1 {
				margin-bottom: 1px;
			}
			.bottom-buffer-5,
			.bottom-buffer-xs-5 {
				margin-bottom: 5px;
			}
			.bottom-buffer-10,
			.bottom-buffer-xs-10 {
				margin-bottom: 10px;
			}
			.bottom-buffer-15,
			.bottom-buffer-xs-15 {
				margin-bottom: 15px;
			}
			.bottom-buffer-20,
			.bottom-buffer-xs-20 {
				margin-bottom: 20px;
			}
			.bottom-buffer-25,
			.bottom-buffer-xs-25 {
				margin-bottom: 25px;
			}
			.bottom-buffer-30,
			.bottom-buffer-xs-30 {
				margin-bottom: 30px;
			}
			.bottom-buffer-50,
			.bottom-buffer-xs-50 {
				margin-bottom: 50px;
			}
			@media (min-width: 768px) {
				.bottom-buffer-sm-0,
				.bottom-buffer-sm-reset {
					margin-bottom: 0;
				}
				.bottom-buffer-sm-1 {
					margin-bottom: 1px;
				}
				.bottom-buffer-sm-5 {
					margin-bottom: 5px;
				}
				.bottom-buffer-sm-10 {
					margin-bottom: 10px;
				}
				.bottom-buffer-sm-15 {
					margin-bottom: 15px;
				}
				.bottom-buffer-sm-20 {
					margin-bottom: 20px;
				}
				.bottom-buffer-sm-25 {
					margin-bottom: 25px;
				}
				.bottom-buffer-sm-30 {
					margin-bottom: 30px;
				}
				.bottom-buffer-sm-50 {
					margin-bottom: 50px;
				}
			}
			@media (min-width: 992px) {
				.bottom-buffer-md-0,
				.bottom-buffer-md-reset {
					margin-bottom: 0;
				}
				.bottom-buffer-md-1 {
					margin-bottom: 1px;
				}
				.bottom-buffer-md-5 {
					margin-bottom: 5px;
				}
				.bottom-buffer-md-10 {
					margin-bottom: 10px;
				}
				.bottom-buffer-md-15 {
					margin-bottom: 15px;
				}
				.bottom-buffer-md-20 {
					margin-bottom: 20px;
				}
				.bottom-buffer-md-25 {
					margin-bottom: 25px;
				}
				.bottom-buffer-md-30 {
					margin-bottom: 30px;
				}
				.bottom-buffer-md-50 {
					margin-bottom: 50px;
				}
			}
			@media (min-width: 1200px) {
				.bottom-buffer-lg-0,
				.bottom-buffer-lg-reset {
					margin-bottom: 0;
				}
				.bottom-buffer-lg-1 {
					margin-bottom: 1px;
				}
				.bottom-buffer-lg-5 {
					margin-bottom: 5px;
				}
				.bottom-buffer-lg-10 {
					margin-bottom: 10px;
				}
				.bottom-buffer-lg-15 {
					margin-bottom: 15px;
				}
				.bottom-buffer-lg-20 {
					margin-bottom: 20px;
				}
				.bottom-buffer-lg-25 {
					margin-bottom: 25px;
				}
				.bottom-buffer-lg-30 {
					margin-bottom: 30px;
				}
				.bottom-buffer-lg-50 {
					margin-bottom: 50px;
				}
			}
			.top-buffer-xs-0 {
				margin-top: 0;
			}
			.top-buffer-xs-1 {
				margin-top: 1px;
			}
			.top-buffer-xs-5 {
				margin-top: 5px;
			}
			.top-buffer-xs-10 {
				margin-top: 10px;
			}
			.top-buffer-xs-15 {
				margin-top: 15px;
			}
			.top-buffer-xs-20 {
				margin-top: 20px;
			}
			.top-buffer-xs-25 {
				margin-top: 25px;
			}
			.top-buffer-xs-30 {
				margin-top: 30px;
			}
			.top-buffer-xs-50 {
				margin-top: 50px;
			}
			@media (min-width: 768px) {
				.top-buffer-sm-0,
				.top-buffer-sm-reset {
					margin-top: 0;
				}
				.top-buffer-sm-1 {
					margin-top: 1px;
				}
				.top-buffer-sm-5 {
					margin-top: 5px;
				}
				.top-buffer-sm-10 {
					margin-top: 10px;
				}
				.top-buffer-sm-15 {
					margin-top: 15px;
				}
				.top-buffer-sm-20 {
					margin-top: 20px;
				}
				.top-buffer-sm-25 {
					margin-top: 25px;
				}
				.top-buffer-sm-30 {
					margin-top: 30px;
				}
				.top-buffer-sm-50 {
					margin-top: 50px;
				}
			}
			@media (min-width: 992px) {
				.top-buffer-md-0,
				.top-buffer-md-reset {
					margin-top: 0;
				}
				.top-buffer-md-1 {
					margin-top: 1px;
				}
				.top-buffer-md-5 {
					margin-top: 5px;
				}
				.top-buffer-md-10 {
					margin-top: 10px;
				}
				.top-buffer-md-15 {
					margin-top: 15px;
				}
				.top-buffer-md-20 {
					margin-top: 20px;
				}
				.top-buffer-md-25 {
					margin-top: 25px;
				}
				.top-buffer-md-30 {
					margin-top: 30px;
				}
				.top-buffer-md-50 {
					margin-top: 50px;
				}
			}
			@media (min-width: 1200px) {
				.top-buffer-lg-0,
				.top-buffer-lg-reset {
					margin-top: 0;
				}
				.top-buffer-lg-1 {
					margin-top: 1px;
				}
				.top-buffer-lg-5 {
					margin-top: 5px;
				}
				.top-buffer-lg-10 {
					margin-top: 10px;
				}
				.top-buffer-lg-15 {
					margin-top: 15px;
				}
				.top-buffer-lg-20 {
					margin-top: 20px;
				}
				.top-buffer-lg-25 {
					margin-top: 25px;
				}
				.top-buffer-lg-30 {
					margin-top: 30px;
				}
				.top-buffer-lg-50 {
					margin-top: 50px;
				}
			}
			.right-buffer-xs-0 {
				padding-right: 0;
			}
			.right-buffer-xs-1 {
				padding-right: 1px;
			}
			.right-buffer-xs-5 {
				padding-right: 5px;
			}
			.right-buffer-xs-10 {
				padding-right: 10px;
			}
			.right-buffer-xs-15 {
				padding-right: 15px;
			}
			.right-buffer-xs-20 {
				padding-right: 20px;
			}
			.right-buffer-xs-30 {
				padding-right: 30px;
			}
			.left-buffer-xs-0 {
				padding-left: 0;
			}
			.left-buffer-xs-1 {
				padding-left: 1px;
			}
			.left-buffer-xs-5 {
				padding-left: 5px;
			}
			.left-buffer-xs-10 {
				padding-left: 10px;
			}
			.left-buffer-xs-15 {
				padding-left: 15px;
			}
			.left-buffer-xs-20 {
				padding-left: 20px;
			}
			.left-buffer-xs-30 {
				padding-left: 30px;
			}
			@media (min-width: 768px) {
				.right-buffer-sm-0 {
					padding-right: 0;
				}
				.right-buffer-sm-1 {
					padding-right: 1px;
				}
				.right-buffer-sm-5 {
					padding-right: 5px;
				}
				.right-buffer-sm-10 {
					padding-right: 10px;
				}
				.right-buffer-sm-reset {
					padding-right: 16px;
				}
				.right-buffer-sm-15 {
					padding-right: 15px;
				}
				.right-buffer-sm-20 {
					padding-right: 20px;
				}
				.right-buffer-sm-30 {
					padding-right: 30px;
				}
				.left-buffer-sm-0 {
					padding-left: 0;
				}
				.left-buffer-sm-1 {
					padding-left: 1px;
				}
				.left-buffer-sm-5 {
					padding-left: 5px;
				}
				.left-buffer-sm-10 {
					padding-left: 10px;
				}
				.left-buffer-sm-15 {
					padding-left: 15px;
				}
				.left-buffer-sm-reset {
					padding-left: 16px;
				}
				.left-buffer-sm-20 {
					padding-left: 20px;
				}
				.left-buffer-sm-30 {
					padding-left: 30px;
				}
			}
			@media (min-width: 992px) {
				.right-buffer-md-0 {
					padding-right: 0;
				}
				.right-buffer-md-1 {
					padding-right: 1px;
				}
				.right-buffer-md-5 {
					padding-right: 5px;
				}
				.right-buffer-md-10 {
					padding-right: 10px;
				}
				.right-buffer-md-15 {
					padding-right: 15px;
				}
				.right-buffer-md-reset {
					padding-right: 16px;
				}
				.right-buffer-md-20 {
					padding-right: 20px;
				}
				.right-buffer-md-30 {
					padding-right: 30px;
				}
				.left-buffer-md-0 {
					padding-left: 0;
				}
				.left-buffer-md-1 {
					padding-left: 1px;
				}
				.left-buffer-md-5 {
					padding-left: 5px;
				}
				.left-buffer-md-10 {
					padding-left: 10px;
				}
				.left-buffer-md-15 {
					padding-left: 15px;
				}
				.left-buffer-md-reset {
					padding-left: 16px;
				}
				.left-buffer-md-20 {
					padding-left: 20px;
				}
				.left-buffer-md-30 {
					padding-left: 30px;
				}
			}
			@media (min-width: 1200px) {
				.right-buffer-lg-0 {
					padding-right: 0;
				}
				.right-buffer-lg-1 {
					padding-right: 1px;
				}
				.right-buffer-lg-5 {
					padding-right: 5px;
				}
				.right-buffer-lg-10 {
					padding-right: 10px;
				}
				.right-buffer-lg-15 {
					padding-right: 15px;
				}
				.right-buffer-lg-reset {
					padding-right: 16px;
				}
				.right-buffer-lg-20 {
					padding-right: 20px;
				}
				.right-buffer-lg-30 {
					padding-right: 30px;
				}
				.left-buffer-lg-0 {
					padding-left: 0;
				}
				.left-buffer-lg-1 {
					padding-left: 1px;
				}
				.left-buffer-lg-5 {
					padding-left: 5px;
				}
				.left-buffer-lg-10 {
					padding-left: 10px;
				}
				.left-buffer-lg-15 {
					padding-left: 15px;
				}
				.left-buffer-lg-reset {
					padding-left: 16px;
				}
				.left-buffer-lg-20 {
					padding-left: 20px;
				}
				.left-buffer-lg-30 {
					padding-left: 30px;
				}
			}
			header {
				display: block;
			}
			[hidden] {
				display: none;
			}
			html {
				font-family: MiloWeb, Verdana, Geneva, sans-serif;
				font-size: 100%;
				-ms-text-size-adjust: 100%;
				-webkit-text-size-adjust: 100%;
				line-height: 1.5em;
			}
			body {
				margin: 0;
				padding: 0;
			}
			.header__logo {
				float: left;
				width: 100%;
				text-align: center;
				// margin: 24px 0;
				// margin: 1.5rem 0;
				margin: 39px 0 24px;
				padding: 0;
			}
			@media (min-width: 48em) {
				.header__logo {
					width: 100%;
					text-align: left;
					margin: 30px 26px;
				}
			}
			.header__logo-image {
				vertical-align: bottom;
				width: 100%;
				max-width: 510px;
				height: auto;
			}
			@media (min-width: 768px) {
				.header__logo-image {
					max-width: 332px;
				}
			}
			.header__site-link:link,
			.header__site-link:visited {
				color: #000;
				text-decoration: none;
			}
			.header__site-link:focus,
			.header__site-link:hover {
				text-decoration: underline;
			}
			#logo a.webheader,
			#logo a.webheader:hover,
			#logo.webheader {
				font-weight: 700;
				text-transform: uppercase;
				color: #0c234b;
				font-size: 1.8em;
				text-decoration: none;
				display: flex;
				line-height: 0.9em;
				text-align: left;
			}
			header#header_ua {
				max-height: 59px;
				min-height: 10px;
			}
			@media print {
				a:link,
				a:visited {
					text-decoration: underline !important;
				}
				a:link.header__site-link,
				a:visited.header__site-link {
					text-decoration: none !important;
				}
				#page,
				body {
					color: #000;
					background-color: transparent !important;
					background-image: none !important;
				}
			}
	`;
    }
    render() {
        return (0, $8ptIG$html)`
    <header class="header page-row" id="header_site" role="banner">
        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-4">
                    <a href="https://www.arizona.edu/" title="The University of Arizona, Tucson, Arizona | Home" class="header__logo active" rel="home" id="logo"><img src="https://www.arizona.edu/sites/default/files/www_webheader-01.svg" alt="The University of Arizona, Tucson, Arizona | Home" class="header__logo-image"></a>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-8">
                    <div class="row">
                        <div class="region region-header-2">
                            <div id="block-bean-uaqs-audience-select" class="block first odd col-12 col-lg-6 block-az-select-menu block-az-select-menuselect-menu" role="complementary" aria-label="select menu">
                                <az-select-menu baseurl="https://live-az-admissions.pantheonsite.io" menuId="header----select-menu"></az-select-menu>
                            </div>
                            <div class="col-12 pr-0 col-lg-6 block block-block-content block-block-content6c97ac4e-e033-4a8e-90d7-0d93867d625a">
                                <div class="col-lg-6 pl-lg-1 pr-lg-1">
                                    <div id="block-bean-cta-request-info" class="block block-bean even" role="complementary" aria-label="call to action link">
                                        <az-button theme="primary" block outline="true" link="https://www.arizona.edu/admissions/visit" elmid="cta-visit" value="Visit"></az-button>
                                    </div>
                                </div>
                                <div class="col-lg-6 pl-lg-2 pr-0"><div id="block-bean-cta-apply" class="block block-bean last even" role="complementary" aria-label="call to action link">
                                    <az-button theme="primary" block link="https://www.arizona.edu/admissions/apply" elmid="cta-apply" value="Apply"></az-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> <!-- /.row -->
        </div> <!-- /.container -->
    </header>
    `;
    }
}
customElements.get("az-header") || customElements.define("az-header", $006bea8753e7b169$export$2e2bcd8739ae039);


// @ts-nocheck
// @ts-nocheck


class $a3840bb5e86c1b3a$export$2e2bcd8739ae039 extends (0, $8ptIG$LitElement) {
    static{
        this.styles = (0, $8ptIG$css)`
		* {
			box-sizing: border-box;
		}
		[class*=" ua-brand-"],
		[class^="ua-brand-"] {
			font-family: ua-brand-symbols !important;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			speak: none;
			font-style: normal;
			font-weight: 400;
			font-variant: normal;
			text-transform: none;
			line-height: 1;
		}
		html.sticky-footer body {
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-orient: vertical;
			-webkit-box-direction: normal;
			-ms-flex-direction: column;
			flex-direction: column;
			min-height: 100vh;
			height: 100%;
			font-size: 16px;
			line-height: 1.5;
		}
		body {
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			text-shadow: 1px 1px 1px rgb(0 0 0 / 0%);
			font-size: 16px;
			line-height: 1.5;
		}
		footer,
		nav,
		section,
		summary {
			display: block;
		}
		hr {
			position: relative;
			background: url(https://www.arizona.edu/img/sky-triangles-hr.svg) center
				center no-repeat;
			background-size: 2em 0.625em;
			border-top: 0;
			border-color: #007d84;
			height: 10px;
			width: 100%;
			margin-top: 24px;
			margin-bottom: 24px;
			border: 0;
			box-sizing: content-box;
		}
		#footer_site hr:after,
		#footer_site hr:before {
			border-color: transparent;
			border-color: rgba(55, 55, 55, 0.09);
			width: 100%;
		}
		hr:before {
			content: " ";
			border-top-width: 1px;
			border-top-style: solid;
			border-top-color: inherit;
			position: absolute;
			width: calc(50% - 26px);
			top: 4px;
			left: 0;
		}
		hr:after {
			content: " ";
			border-top-width: 1px;
			border-top-style: solid;
			border-top-color: inherit;
			position: absolute;
			width: calc(50% - 26px);
			top: 4px;
			right: 0;
		}
		p {
			margin: 0 0 12px;
			font-size: 16px;
		}
		p.smal {
			font-size: 87%;
		}
		.text-center {
			text-align: center;
		}
		.text-align-center {
			text-align: center;
		}
		@media (min-width: 1200px) {
			.text-right-lg {
				text-align: right;
			}
		}
		.page-row {
			-webkit-box-flex: 0;
			-ms-flex: none;
			flex: none;
		}
		.container {
			width: 100%;
			padding-right: 15px;
			padding-left: 15px;
			margin-right: auto;
			margin-left: auto;
		}
		.container:after,
		.container:before {
			display: table;
			content: " ";
		}
		@media (min-width: 576px) {
			.container,
			.container-sm {
				max-width: 540px;
			}
		}
		@media (min-width: 768px) {
			.container,
			.container-md,
			.container-sm {
				max-width: 720px;
			}
		}
		@media (min-width: 992px) {
			.container,
			.container-lg,
			.container-md,
			.container-sm {
				max-width: 960px;
			}
		}
		@media (min-width: 1200px) {
			.container,
			.container-lg,
			.container-md,
			.container-sm,
			.container-xl {
				max-width: 1140px;
			}
		}
		.row section {
			align-items: center;
		}
		.row:before,
		.row:after {
			display: table;
			content: " ";
		}

		.page-row-padding-bottom:after,
		.page-row-padding-top:before {
			height: 0.8em;
			background: #f4ede5;
		}

		.container {
			padding-right: 16px;
			padding-left: 16px;
			margin-right: auto;
			margin-left: auto;
		}

		.container:after,
		.container:before {
			display: table;
			content: " ";
		}
		.container:after {
			clear: both;
		}
		@media (min-width: 768px) {
			.container {
				width: 752px;
			}
		}
		@media (min-width: 992px) {
			.container {
				width: 972px;
			}
		}
		@media (min-width: 1200px) {
			.container {
				width: 1172px;
			}
		}
		.row {
			margin-right: -15px;
			margin-left: -15px;
		}
		.row:after,
		.row:before {
			display: table;
			content: " ";
		}
		.row:after {
			clear: both;
		}
		.col-lg-1,
		.col-lg-10,
		.col-lg-11,
		.col-lg-12,
		.col-lg-2,
		.col-lg-3,
		.col-lg-4,
		.col-lg-5,
		.col-lg-6,
		.col-lg-7,
		.col-lg-8,
		.col-lg-9,
		.col-md-1,
		.col-md-10,
		.col-md-11,
		.col-md-12,
		.col-md-2,
		.col-md-3,
		.col-md-4,
		.col-md-5,
		.col-md-6,
		.col-md-7,
		.col-md-8,
		.col-md-9,
		.col-sm-1,
		.col-sm-10,
		.col-sm-11,
		.col-sm-12,
		.col-sm-2,
		.col-sm-3,
		.col-sm-4,
		.col-sm-5,
		.col-sm-6,
		.col-sm-7,
		.col-sm-8,
		.col-sm-9,
		.col-xs-1,
		.col-xs-10,
		.col-xs-11,
		.col-xs-12,
		.col-xs-2,
		.col-xs-3,
		.col-xs-4,
		.col-xs-5,
		.col-xs-6,
		.col-xs-7,
		.col-xs-8,
		.col-xs-9 {
			position: relative;
			min-height: 1px;
			padding-right: 16px;
			padding-left: 16px;
		}
		.col-xs-1,
		.col-xs-10,
		.col-xs-11,
		.col-xs-12,
		.col-xs-2,
		.col-xs-3,
		.col-xs-4,
		.col-xs-5,
		.col-xs-6,
		.col-xs-7,
		.col-xs-8,
		.col-xs-9 {
			float: left;
		}
		.col-xs-1 {
			width: 8.333333%;
		}
		.col-xs-2 {
			width: 16.666667%;
		}
		.col-xs-3 {
			width: 25%;
		}
		.col-xs-4 {
			width: 33.333333%;
		}
		.col-xs-5 {
			width: 41.666667%;
		}
		.col-xs-6 {
			width: 50%;
		}
		.col-xs-7 {
			width: 58.333333%;
		}
		.col-xs-8 {
			width: 66.666667%;
		}
		.col-xs-9 {
			width: 75%;
		}
		.col-xs-10 {
			width: 83.333333%;
		}
		.col-xs-11 {
			width: 91.666667%;
		}
		.col-xs-12 {
			width: 100%;
		}
		.col-xs-offset-0 {
			margin-left: 0;
		}
		.col-xs-offset-1 {
			margin-left: 8.333333%;
		}
		.col-xs-offset-2 {
			margin-left: 16.666667%;
		}
		.col-xs-offset-3 {
			margin-left: 25%;
		}
		.col-xs-offset-4 {
			margin-left: 33.333333%;
		}
		.col-xs-offset-5 {
			margin-left: 41.666667%;
		}
		.col-xs-offset-6 {
			margin-left: 50%;
		}
		.col-xs-offset-7 {
			margin-left: 58.333333%;
		}
		.col-xs-offset-8 {
			margin-left: 66.666667%;
		}
		.col-xs-offset-9 {
			margin-left: 75%;
		}
		.col-xs-offset-10 {
			margin-left: 83.333333%;
		}
		.col-xs-offset-11 {
			margin-left: 91.666667%;
		}
		.col-xs-offset-12 {
			margin-left: 100%;
		}
		@media (min-width: 768px) {
			.col-sm-1,
			.col-sm-10,
			.col-sm-11,
			.col-sm-12,
			.col-sm-2,
			.col-sm-3,
			.col-sm-4,
			.col-sm-5,
			.col-sm-6,
			.col-sm-7,
			.col-sm-8,
			.col-sm-9 {
				float: left;
			}
			.col-sm-1 {
				width: 8.333333%;
			}
			.col-sm-2 {
				width: 16.666667%;
			}
			.col-sm-3 {
				width: 25%;
			}
			.col-sm-4 {
				width: 33.333333%;
			}
			.col-sm-5 {
				width: 41.666667%;
			}
			.col-sm-6 {
				width: 50%;
			}
			.col-sm-7 {
				width: 58.333333%;
			}
			.col-sm-8 {
				width: 66.666667%;
			}
			.col-sm-9 {
				width: 75%;
			}
			.col-sm-10 {
				width: 83.333333%;
			}
			.col-sm-11 {
				width: 91.666667%;
			}
			.col-sm-12 {
				width: 100%;
			}
			.col-sm-offset-0 {
				margin-left: 0;
			}
			.col-sm-offset-1 {
				margin-left: 8.333333%;
			}
			.col-sm-offset-2 {
				margin-left: 16.666667%;
			}
			.col-sm-offset-3 {
				margin-left: 25%;
			}
			.col-sm-offset-4 {
				margin-left: 33.333333%;
			}
			.col-sm-offset-5 {
				margin-left: 41.666667%;
			}
			.col-sm-offset-6 {
				margin-left: 50%;
			}
			.col-sm-offset-7 {
				margin-left: 58.333333%;
			}
			.col-sm-offset-8 {
				margin-left: 66.666667%;
			}
			.col-sm-offset-9 {
				margin-left: 75%;
			}
			.col-sm-offset-10 {
				margin-left: 83.333333%;
			}
			.col-sm-offset-11 {
				margin-left: 91.666667%;
			}
			.col-sm-offset-12 {
				margin-left: 100%;
			}
		}
		@media (min-width: 992px) {
			.col-md-1,
			.col-md-10,
			.col-md-11,
			.col-md-12,
			.col-md-2,
			.col-md-3,
			.col-md-4,
			.col-md-5,
			.col-md-6,
			.col-md-7,
			.col-md-8,
			.col-md-9 {
				float: left;
			}
			.col-md-1 {
				width: 8.333333%;
			}
			.col-md-2 {
				width: 16.666667%;
			}
			.col-md-3 {
				width: 25%;
			}
			.col-md-4 {
				width: 33.333333%;
			}
			.col-md-5 {
				width: 41.666667%;
			}
			.col-md-6 {
				width: 50%;
			}
			.col-md-7 {
				width: 58.333333%;
			}
			.col-md-8 {
				width: 66.666667%;
			}
			.col-md-9 {
				width: 75%;
			}
			.col-md-10 {
				width: 83.333333%;
			}
			.col-md-11 {
				width: 91.666667%;
			}
			.col-md-12 {
				width: 100%;
			}
			.col-md-offset-0 {
				margin-left: 0;
			}
			.col-md-offset-1 {
				margin-left: 8.333333%;
			}
			.col-md-offset-2 {
				margin-left: 16.666667%;
			}
			.col-md-offset-3 {
				margin-left: 25%;
			}
			.col-md-offset-4 {
				margin-left: 33.333333%;
			}
			.col-md-offset-5 {
				margin-left: 41.666667%;
			}
			.col-md-offset-6 {
				margin-left: 50%;
			}
			.col-md-offset-7 {
				margin-left: 58.333333%;
			}
			.col-md-offset-8 {
				margin-left: 66.666667%;
			}
			.col-md-offset-9 {
				margin-left: 75%;
			}
			.col-md-offset-10 {
				margin-left: 83.333333%;
			}
			.col-md-offset-11 {
				margin-left: 91.666667%;
			}
			.col-md-offset-12 {
				margin-left: 100%;
			}
		}
		@media (min-width: 1200px) {
			.col-lg-1,
			.col-lg-10,
			.col-lg-11,
			.col-lg-12,
			.col-lg-2,
			.col-lg-3,
			.col-lg-4,
			.col-lg-5,
			.col-lg-6,
			.col-lg-7,
			.col-lg-8,
			.col-lg-9 {
				float: left;
			}
			.col-lg-1 {
				width: 8.333333%;
			}
			.col-lg-2 {
				width: 16.666667%;
			}
			.col-lg-3 {
				width: 25%;
			}
			.col-lg-4 {
				width: 33.333333%;
			}
			.col-lg-5 {
				width: 41.666667%;
			}
			.col-lg-6 {
				width: 50%;
			}
			.col-lg-7 {
				width: 58.333333%;
			}
			.col-lg-8 {
				width: 66.666667%;
			}
			.col-lg-9 {
				width: 75%;
			}
			.col-lg-10 {
				width: 83.333333%;
			}
			.col-lg-11 {
				width: 91.666667%;
			}
			.col-lg-12 {
				width: 100%;
			}
			.col-lg-offset-0 {
				margin-left: 0;
			}
			.col-lg-offset-1 {
				margin-left: 8.333333%;
			}
			.col-lg-offset-2 {
				margin-left: 16.666667%;
			}
			.col-lg-offset-3 {
				margin-left: 25%;
			}
			.col-lg-offset-4 {
				margin-left: 33.333333%;
			}
			.col-lg-offset-5 {
				margin-left: 41.666667%;
			}
			.col-lg-offset-6 {
				margin-left: 50%;
			}
			.col-lg-offset-7 {
				margin-left: 58.333333%;
			}
			.col-lg-offset-8 {
				margin-left: 66.666667%;
			}
			.col-lg-offset-9 {
				margin-left: 75%;
			}
			.col-lg-offset-10 {
				margin-left: 83.333333%;
			}
			.col-lg-offset-11 {
				margin-left: 91.666667%;
			}
			.col-lg-offset-12 {
				margin-left: 100%;
			}
		}
		label {
			display: inline-block;
			max-width: 100%;
			margin-bottom: 5px;
			font-weight: 700;
		}
		select[multiple],
		select[size] {
			height: auto;
		}
		.label {
			display: inline;
			padding: 0.2em 0.6em 0.3em;
			font-size: 75%;
			font-weight: 700;
			line-height: 1;
			color: #fff;
			text-align: center;
			white-space: nowrap;
			vertical-align: baseline;
			border-radius: 0.25em;
		}
		.label:empty {
			display: none;
		}
		a.label:focus,
		a.label:hover {
			color: #fff;
			text-decoration: none;
			cursor: pointer;
		}
		.label-default {
			background-color: #ab0520;
		}
		.label-default[href]:focus,
		.label-default[href]:hover {
			background-color: #790417;
		}
		.label-info {
			background-color: #81d3eb;
		}
		.label-info[href]:focus,
		.label-info[href]:hover {
			background-color: #55c4e4;
		}
		@-webkit-keyframes progress-bar-stripes {
			from {
				background-position: 40px 0;
			}
			to {
				background-position: 0 0;
			}
		}
		@keyframes progress-bar-stripes {
			from {
				background-position: 40px 0;
			}
			to {
				background-position: 0 0;
			}
		}
		a {
			font-weight: 700;
			-webkit-transition: color 0.1s ease-in-out;
			transition: color 0.1s ease-in-out;
		}
		.page-header {
			margin: 3rem 0 2rem;
			line-height: 1.2;
		}
		label {
			color: #49595e;
		}
		.label {
			border-radius: 0;
		}
		select {
			border: 0;
			outline: 1px solid #cbd1e0;
			background-color: #fff;
			border-radius: 0;
		}
		.label {
			font-size: 0.7em;
			font-weight: 700;
			line-height: 1.5;
			color: #fff;
			margin: 0 0.5em;
		}
		img {
			max-width: 100%;
			height: auto;
			border: 0;
			vertical-align: middle;
		}
		a.link-container {
			color: inherit;
			display: block;
			font-weight: inherit;
		}
		a.link-container:focus,
		a.link-container:hover {
			background-color: #eef1f1;
			outline: 0;
			text-decoration: none;
			color: inherit;
		}
		ol,
		ul {
			margin-top: 0;
			margin-bottom: 12px;
		}
		.h3,
		.h4,
		.h5,
		.h6,
		h3,
		h4,
		h5,
		h6 {
			font-weight: 500;
			line-height: 1.1;
			color: #49595e;
		}
		.h5,
		h5 {
			font-size: 16px;
		}
		.h4,
		.h5,
		.h6,
		h4,
		h5,
		h6 {
			margin-top: 12px;
			margin-bottom: 12px;
		}
		.h1,
		.h2,
		.h3,
		.h4,
		.h5,
		.h6,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			font-weight: 500;
			line-height: 1.1;
			color: #49595e;
		}
		.initialism,
		.text-uppercase {
			text-transform: uppercase;
		}
		.bold,
		bold,
		strong {
			font-weight: 700;
		}
		b,
		strong {
			font-weight: 700;
		}

		.arizona-logo {
			display: inline-block;
			height: 20px;
			margin: 19px 0 20px;
			max-width: 80%;
			float: left;
			width: 276px;
			padding: 0 0 0 0.6rem;
		}
		.bottom-buffer-xs-0 {
			margin-bottom: 0;
		}
		.bottom-buffer-1,
		.bottom-buffer-xs-1 {
			margin-bottom: 1px;
		}
		.bottom-buffer-5,
		.bottom-buffer-xs-5 {
			margin-bottom: 5px;
		}
		.bottom-buffer-10,
		.bottom-buffer-xs-10 {
			margin-bottom: 10px;
		}
		.bottom-buffer-15,
		.bottom-buffer-xs-15 {
			margin-bottom: 15px;
		}
		.bottom-buffer-20,
		.bottom-buffer-xs-20 {
			margin-bottom: 20px;
		}
		.bottom-buffer-25,
		.bottom-buffer-xs-25 {
			margin-bottom: 25px;
		}
		.bottom-buffer-30,
		.bottom-buffer-xs-30 {
			margin-bottom: 30px;
		}
		.bottom-buffer-50,
		.bottom-buffer-xs-50 {
			margin-bottom: 50px;
		}
		@media (min-width: 768px) {
			.bottom-buffer-sm-0,
			.bottom-buffer-sm-reset {
				margin-bottom: 0;
			}
			.bottom-buffer-sm-1 {
				margin-bottom: 1px;
			}
			.bottom-buffer-sm-5 {
				margin-bottom: 5px;
			}
			.bottom-buffer-sm-10 {
				margin-bottom: 10px;
			}
			.bottom-buffer-sm-15 {
				margin-bottom: 15px;
			}
			.bottom-buffer-sm-20 {
				margin-bottom: 20px;
			}
			.bottom-buffer-sm-25 {
				margin-bottom: 25px;
			}
			.bottom-buffer-sm-30 {
				margin-bottom: 30px;
			}
			.bottom-buffer-sm-50 {
				margin-bottom: 50px;
			}
		}
		@media (min-width: 992px) {
			.bottom-buffer-md-0,
			.bottom-buffer-md-reset {
				margin-bottom: 0;
			}
			.bottom-buffer-md-1 {
				margin-bottom: 1px;
			}
			.bottom-buffer-md-5 {
				margin-bottom: 5px;
			}
			.bottom-buffer-md-10 {
				margin-bottom: 10px;
			}
			.bottom-buffer-md-15 {
				margin-bottom: 15px;
			}
			.bottom-buffer-md-20 {
				margin-bottom: 20px;
			}
			.bottom-buffer-md-25 {
				margin-bottom: 25px;
			}
			.bottom-buffer-md-30 {
				margin-bottom: 30px;
			}
			.bottom-buffer-md-50 {
				margin-bottom: 50px;
			}
		}
		@media (min-width: 1200px) {
			.bottom-buffer-lg-0,
			.bottom-buffer-lg-reset {
				margin-bottom: 0;
			}
			.bottom-buffer-lg-1 {
				margin-bottom: 1px;
			}
			.bottom-buffer-lg-5 {
				margin-bottom: 5px;
			}
			.bottom-buffer-lg-10 {
				margin-bottom: 10px;
			}
			.bottom-buffer-lg-15 {
				margin-bottom: 15px;
			}
			.bottom-buffer-lg-20 {
				margin-bottom: 20px;
			}
			.bottom-buffer-lg-25 {
				margin-bottom: 25px;
			}
			.bottom-buffer-lg-30 {
				margin-bottom: 30px;
			}
			.bottom-buffer-lg-50 {
				margin-bottom: 50px;
			}
		}
		.top-buffer-xs-0 {
			margin-top: 0;
		}
		.top-buffer-xs-1 {
			margin-top: 1px;
		}
		.top-buffer-xs-5 {
			margin-top: 5px;
		}
		.top-buffer-xs-10 {
			margin-top: 10px;
		}
		.top-buffer-xs-15 {
			margin-top: 15px;
		}
		.top-buffer-xs-20 {
			margin-top: 20px;
		}
		.top-buffer-xs-25 {
			margin-top: 25px;
		}
		.top-buffer-xs-30 {
			margin-top: 30px;
		}
		.top-buffer-xs-50 {
			margin-top: 50px;
		}
		@media (min-width: 768px) {
			.top-buffer-sm-0,
			.top-buffer-sm-reset {
				margin-top: 0;
			}
			.top-buffer-sm-1 {
				margin-top: 1px;
			}
			.top-buffer-sm-5 {
				margin-top: 5px;
			}
			.top-buffer-sm-10 {
				margin-top: 10px;
			}
			.top-buffer-sm-15 {
				margin-top: 15px;
			}
			.top-buffer-sm-20 {
				margin-top: 20px;
			}
			.top-buffer-sm-25 {
				margin-top: 25px;
			}
			.top-buffer-sm-30 {
				margin-top: 30px;
			}
			.top-buffer-sm-50 {
				margin-top: 50px;
			}
		}
		@media (min-width: 992px) {
			.top-buffer-md-0,
			.top-buffer-md-reset {
				margin-top: 0;
			}
			.top-buffer-md-1 {
				margin-top: 1px;
			}
			.top-buffer-md-5 {
				margin-top: 5px;
			}
			.top-buffer-md-10 {
				margin-top: 10px;
			}
			.top-buffer-md-15 {
				margin-top: 15px;
			}
			.top-buffer-md-20 {
				margin-top: 20px;
			}
			.top-buffer-md-25 {
				margin-top: 25px;
			}
			.top-buffer-md-30 {
				margin-top: 30px;
			}
			.top-buffer-md-50 {
				margin-top: 50px;
			}
		}
		@media (min-width: 1200px) {
			.top-buffer-lg-0,
			.top-buffer-lg-reset {
				margin-top: 0;
			}
			.top-buffer-lg-1 {
				margin-top: 1px;
			}
			.top-buffer-lg-5 {
				margin-top: 5px;
			}
			.top-buffer-lg-10 {
				margin-top: 10px;
			}
			.top-buffer-lg-15 {
				margin-top: 15px;
			}
			.top-buffer-lg-20 {
				margin-top: 20px;
			}
			.top-buffer-lg-25 {
				margin-top: 25px;
			}
			.top-buffer-lg-30 {
				margin-top: 30px;
			}
			.top-buffer-lg-50 {
				margin-top: 50px;
			}
		}
		.right-buffer-xs-0 {
			padding-right: 0;
		}
		.right-buffer-xs-1 {
			padding-right: 1px;
		}
		.right-buffer-xs-5 {
			padding-right: 5px;
		}
		.right-buffer-xs-10 {
			padding-right: 10px;
		}
		.right-buffer-xs-15 {
			padding-right: 15px;
		}
		.right-buffer-xs-20 {
			padding-right: 20px;
		}
		.right-buffer-xs-30 {
			padding-right: 30px;
		}
		.left-buffer-xs-0 {
			padding-left: 0;
		}
		.left-buffer-xs-1 {
			padding-left: 1px;
		}
		.left-buffer-xs-5 {
			padding-left: 5px;
		}
		.left-buffer-xs-10 {
			padding-left: 10px;
		}
		.left-buffer-xs-15 {
			padding-left: 15px;
		}
		.left-buffer-xs-20 {
			padding-left: 20px;
		}
		.left-buffer-xs-30 {
			padding-left: 30px;
		}
		@media (min-width: 768px) {
			.right-buffer-sm-0 {
				padding-right: 0;
			}
			.right-buffer-sm-1 {
				padding-right: 1px;
			}
			.right-buffer-sm-5 {
				padding-right: 5px;
			}
			.right-buffer-sm-10 {
				padding-right: 10px;
			}
			.right-buffer-sm-reset {
				padding-right: 16px;
			}
			.right-buffer-sm-15 {
				padding-right: 15px;
			}
			.right-buffer-sm-20 {
				padding-right: 20px;
			}
			.right-buffer-sm-30 {
				padding-right: 30px;
			}
			.left-buffer-sm-0 {
				padding-left: 0;
			}
			.left-buffer-sm-1 {
				padding-left: 1px;
			}
			.left-buffer-sm-5 {
				padding-left: 5px;
			}
			.left-buffer-sm-10 {
				padding-left: 10px;
			}
			.left-buffer-sm-15 {
				padding-left: 15px;
			}
			.left-buffer-sm-reset {
				padding-left: 16px;
			}
			.left-buffer-sm-20 {
				padding-left: 20px;
			}
			.left-buffer-sm-30 {
				padding-left: 30px;
			}
		}
		@media (min-width: 992px) {
			.right-buffer-md-0 {
				padding-right: 0;
			}
			.right-buffer-md-1 {
				padding-right: 1px;
			}
			.right-buffer-md-5 {
				padding-right: 5px;
			}
			.right-buffer-md-10 {
				padding-right: 10px;
			}
			.right-buffer-md-15 {
				padding-right: 15px;
			}
			.right-buffer-md-reset {
				padding-right: 16px;
			}
			.right-buffer-md-20 {
				padding-right: 20px;
			}
			.right-buffer-md-30 {
				padding-right: 30px;
			}
			.left-buffer-md-0 {
				padding-left: 0;
			}
			.left-buffer-md-1 {
				padding-left: 1px;
			}
			.left-buffer-md-5 {
				padding-left: 5px;
			}
			.left-buffer-md-10 {
				padding-left: 10px;
			}
			.left-buffer-md-15 {
				padding-left: 15px;
			}
			.left-buffer-md-reset {
				padding-left: 16px;
			}
			.left-buffer-md-20 {
				padding-left: 20px;
			}
			.left-buffer-md-30 {
				padding-left: 30px;
			}
		}
		@media (min-width: 1200px) {
			.right-buffer-lg-0 {
				padding-right: 0;
			}
			.right-buffer-lg-1 {
				padding-right: 1px;
			}
			.right-buffer-lg-5 {
				padding-right: 5px;
			}
			.right-buffer-lg-10 {
				padding-right: 10px;
			}
			.right-buffer-lg-15 {
				padding-right: 15px;
			}
			.right-buffer-lg-reset {
				padding-right: 16px;
			}
			.right-buffer-lg-20 {
				padding-right: 20px;
			}
			.right-buffer-lg-30 {
				padding-right: 30px;
			}
			.left-buffer-lg-0 {
				padding-left: 0;
			}
			.left-buffer-lg-1 {
				padding-left: 1px;
			}
			.left-buffer-lg-5 {
				padding-left: 5px;
			}
			.left-buffer-lg-10 {
				padding-left: 10px;
			}
			.left-buffer-lg-15 {
				padding-left: 15px;
			}
			.left-buffer-lg-reset {
				padding-left: 16px;
			}
			.left-buffer-lg-20 {
				padding-left: 20px;
			}
			.left-buffer-lg-30 {
				padding-left: 30px;
			}
		}
		.mb-0,
		.my-0 {
			margin-bottom: 0 !important;
			margin-bottom: 0 !important;
		}
		.mt-0,
		.my-0 {
			margin-top: 0 !important;
			margin-top: 0 !important;
		}
		.text-muted {
			color: #495057;
		}
		.container-collapsed .column {
			min-height: initial;
		}
		.visible-lg-block,
		.visible-lg-inline,
		.visible-lg-inline-block,
		.visible-md-block,
		.visible-md-inline,
		.visible-md-inline-block,
		.visible-sm-block,
		.visible-sm-inline,
		.visible-sm-inline-block,
		.visible-xs-block,
		.visible-xs-inline,
		.visible-xs-inline-block {
			display: none !important;
		}
		.small,
		small {
			font-size: 87%;
		}
		html.ua-brand-icons.external-links
			.remove-external-link-icon[target="_blank"]
			.pseudo-link
			span,
		html.ua-brand-icons.external-links
			.remove-external-link-icon[target="_blank"]
			.psuedo-link
			span,
		html.ua-brand-icons.external-links [target="_blank"] {
			padding-right: 0.8em;
		}
		html.external-links .pseudo-link:after,
		html.external-links [target="_blank"]:after {
			border-bottom: 0.3125em solid transparent;
			border-left: 0.3125em solid transparent;
			border-right: 0.3125em solid #8f1124;
			border-top: 0.3125em solid #8f1124;
			content: "";
			display: inline-block;
			height: 0;
			position: relative;
			top: 0;
			width: 0;
			right: 0;
		}
		html.ua-brand-icons.external-links
			.remove-external-link-icon[target="_blank"]
			.pseudo-link
			span:after,
		html.ua-brand-icons.external-links
			.remove-external-link-icon[target="_blank"]
			.psuedo-link
			span:after,
		html.ua-brand-icons.external-links [target="_blank"]:after {
			content: "\E648";
			font-family: ua-brand-symbols;
			font-size: 0.7em;
			border-width: 0;
		}
		#footer_site {
			background: #f4ede5;
			padding: 2.5rem 0;
			color: #49595e;
			line-height: 1.5;
		}
		#footer_site hr {
			background: 0 0;
		}
		#footer_site a {
			color: #8b0015;
			text-decoration: underline;
		}
		#footer_site ul {
			display: inline-block;
			margin: 0;
			padding: 1rem 0 0;
		}
		#block-bean-uaqs-footer-links-bean-informa h5 strong {
			font-size: 16px;
			font-weight: 500;
			color: black;
		}
		#footer_site #block-bean-uaqs-footer-links-bean-main ul {
			display: inline-block;
			padding: 0;
			margin: 0 0 12px;
			text-align: right;
		}
		@media (min-width: 768px) {
			text-align: left;
		}
		#footer_site ul > li {
			border-right: 1px solid #e2e9eb;
			display: inline-block;
			list-style: none;
			padding: 0 0.75rem;
		}
		#footer_site ul > li.last {
			border-right: 0;
		}
		#footer_site #block-bean-uaqs-footer-links-bean-main ul li {
			border-right: 0px solid hsl(196, 8%, 74%);
			display: inline-block;
			list-style: none;
			padding: 0 0.45rem 0 0.45rem;
		}
		#footer_site #block-bean-uaqs-footer-links-bean-main ul li a {
			color: #49595e;
			text-decoration: none;
			text-transform: none;
			margin: 0;
		}

		#footer_site #footer_sub ul {
			display: block;
			margin: 0;
			padding: 0 0 0;
			width: 100%;
		}
		#footer_site #footer_sub .two-col-menu ul {
			-moz-column-count: 2;
			-moz-column-gap: 2em;
			-webkit-column-count: 2;
			-webkit-column-gap: 2em;
			column-count: 2;
			column-gap: 2em;
			display: block;
		}
		#footer_site #footer_sub ul li {
			border-right: 0px solid #b6bec1;
			display: block;
			list-style: none;
			padding: 0;
			margin: 0;
			width: max-content;
			width: -moz-max-content;
		}
		#footer_site ul li a {
			color: #49595e;
			font-weight: 600;
			display: block;
			text-decoration: none;
			font-size: 16px;
			line-height: inherit;
			vertical-align: top;
			text-transform: none;
			margin: 7px 0;
		}
		#footer_sub ul.menu li a i {
			margin: 0 0.5em 0 0;
		}
		.bg-warm-gray {
			background-color: #f4ede5;
		}
		.paragraphs-item-uaqs-full-width-bg-wrapper {
			margin-top: -1px;
		}
		.background-wrapper {
			padding: 3rem 0;
		}
		#footer_sub .background-wrapper {
			padding: 0;
			margin: 0 -16px;
		}

		#footer_site .footer-top-wrap {
			padding: 0 13px;
		}

		#footer_site .top-menu li {
			font-size: 16px;
			font-weight: 600;
		}

		#footer_site .footer-top-wrap hr {
			margin-top: 32px;
			margin-bottom: 17px;
		}

		#footer_site ul.menu-bottom li a {
			margin: 3px 0;
			max-width: 222px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		#footer_site ul li a {
			border-bottom: 2px solid transparent;
		}

		#footer_site ul li a:hover {
			border-bottom: 2px solid #49595e;
		}

		#footer_site ul.menu-bottom li a i {
			margin: 0 9px 0 0;
		}

		#footer_site ul.menu-bottom li a i::before {
			display: inline-block;
			width: 16px;
			height: 16px;
		}

		.topic-menu {
			columns: 2;
		}

		.bottom-text-wrap {
			color: black;
		}

		@media screen and (max-width: 991px) {
			#footer_site #block-bean-uaqs-footer-links-bean-main ul {
				text-align: right;
			}
			.bottom-text-wrap {
				text-align: right;
			}
			.number-bottom {
				display: block;
			}
			.topic-menu {
				columns: 1;
			}
			#footer_site #footer_sub ul.menu-bottom {
				margin-bottom: 21px;
			}
		}

		@media screen and (max-width: 767px) {
			#footer_site #block-bean-uaqs-footer-links-bean-main ul {
				margin-top: 21px;
				text-align: center;
			}

			.bottom-text-wrap {
				text-align: center;
			}
		}
		@font-face {
			font-family: "az-icons";
			src: url("fonts/az-icons.eot?d54800");
			src: url("fonts/az-icons.eot?d54800#iefix") format("embedded-opentype"),
				url("fonts/az-icons.ttf?d54800") format("truetype"),
				url("fonts/az-icons.woff?d54800") format("woff"),
				url("fonts/az-icons.svg?d54800#az-icons") format("svg");
			font-weight: normal;
			font-style: normal;
			font-display: block;
		}

		[class^="az-icon-"]::before,
		[class*=" az-icon-"]::before {
			/* use !important to prevent issues with browser extensions that change fonts */
			font-family: "az-icons" !important;
			speak: never;
			font-style: normal;
			font-weight: normal;
			font-variant: normal;
			text-transform: none;
			line-height: 1;

			/* Better Font Rendering =========== */
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		}

		.az-icon-arizona:before {
			content: "\\e900";
		}
		.az-icon-award:before {
			content: "\\e901";
		}
		.az-icon-cost:before {
			content: "\\e902";
		}
		.az-icon-facebook:before {
			content: "\\e903";
		}
		.az-icon-financial-aid:before {
			content: "\\e904";
		}
		.az-icon-grad-cap:before {
			content: "\\e905";
		}
		.az-icon-instagram:before {
			content: "\\e906";
		}
		.az-icon-linkedin:before {
			content: "\\e907";
		}
		.az-icon-majors-and-degrees:before {
			content: "\\e908";
		}
		.az-icon-map-marker:before {
			content: "\\e909";
		}
		.az-icon-pinterest:before {
			content: "\\e90a";
		}
		.az-icon-scholarship:before {
			content: "\\e90b";
		}
		.az-icon-sign-post:before {
			content: "\\e90c";
		}
		.az-icon-spotify:before {
			content: "\\e90d";
		}
		.az-icon-spring-fling:before {
			content: "\\e90e";
		}
		.az-icon-tiktok:before {
			content: "\\e90f";
		}
		.az-icon-twitter:before {
			content: "\\e910";
		}
		.az-icon-x-twitter:before {
			content: "\\e914";
		}
		.az-icon-wildcat:before {
			content: "\\e911";
		}
		.az-icon-youtube:before {
			content: "\\e912";
		}
		.az-icon-vimeo:before {
			content: "\\e913";
		}
	`;
    }
    render() {
        return (0, $8ptIG$html)`
			<footer id="footer_site" class="page page-row" role="contentinfo">
				<div class="region region-footer">
					<div
						class="container d-flex footer-top-wrap justify-content-between align-items-center"
					>
						<div class="row">
							<div class="page-row-padding-top page-row-padding-bottom"></div>
							<div class="page-row-padding-top page-row-padding-bottom"></div>
							<div
								class="col-xs-12 col-sm-4 col-md-4 col-lg-4 text-center-xs text-left-not-xs"
							>
								<div class="row px-0">
									<div class="col-xs-12">
										<a
											href="https://www.arizona.edu/"
											title="Home"
											class="remove-external-link-icon active"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											><img
												src="https://www.arizona.edu/sites/default/files/UA_horiz_rgb_webheader.png"
												alt="Home"
										/></a>
									</div>
								</div>
							</div>
							<!-- Add the extra clearfix for only the required viewport -->
							<div class="clearfix visible-xs-block"></div>
							<div class="col-xs-12 col-sm-8 col-md-8 col-lg-8 py-0">
								<div
									id="block-bean-uaqs-footer-links-bean-main"
									class="block block-bean first odd small text-right-lg text-right-md  text-right-sm text-center-xs"
									role="complementary"
								>
									<ul class="menu top-menu">
										<li class="menu__item is-leaf first leaf">
											<a
												href="https://talent.arizona.edu"
												title=""
												class="menu__link"
												@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
												>Employment</a
											>
										</li>
										<li class="menu__item is-leaf leaf">
											<a
												href="https://cirt.arizona.edu"
												title=""
												class="menu__link"
												@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
												>Emergency Information</a
											>
										</li>
										<li class="menu__item is-leaf leaf">
											<a
												href="https://www.arizona.edu/nondiscrimination"
												title=""
												class="menu__link"
												@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
												>Nondiscrimination</a
											>
										</li>
										<li class="menu__item is-leaf leaf">
											<a
												href="https://safety.arizona.edu/"
												title=""
												class="menu__link"
												@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
												>Campus Safety</a
											>
										</li>
										<li class="menu__item is-leaf leaf">
											<a
												href="https://www.arizona.edu/copyright"
												title=""
												class="menu__link"
												@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
												>Copyright</a
											>
										</li>
										<li class="menu__item is-leaf leaf">
											<a
												href="https://www.arizona.edu/campus-accessibility"
												title=""
												class="menu__link"
												@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
												>Campus Accessibility</a
											>
										</li>
										<li class="menu__item is-leaf leaf">
											<a
												href="https://www.arizona.edu/contact-us"
												title=""
												class="menu__link"
												@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
												>Contact Us</a
											>
										</li>
										<li class="menu__item is-leaf last leaf">
											<a
												href="https://www.arizona.edu/website-feedback"
												title=""
												class="menu__link"
												@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
												>Feedback</a
											>
										</li>
									</ul>
								</div>
								<div
									id="block-bean-footer-university-address"
									class="block block-bean last even"
									role="complementary"
								>
									<div
										class="entity entity-bean bean-uaqs-contact-summary clearfix"
										about="/block/footer---university-address"
									>
										<div class="content">
											<p
												class="bottom-text-wrap text-right text-right-sm text-right-md text-right-lg"
											>
												The University of Arizona | Tucson, Arizona 85721 |
												<span class="number-bottom"
													><a href="tel:520-621-2211">520-621-2211</a></span
												>
											</p>
										</div>
									</div>
								</div>
							</div>
							<div class="col-xs-12"><hr /></div>
						</div>
					</div>
				</div>
				<div id="footer_sub" class="region region-footer-sub">
					<div class="container">
						<div class="row">
							<div
								id="block-bean-uaqs-footer-links-bean-information"
								class="block block-bean first odd col-xs-12 col-sm-6 col-md-3 col-lg-3"
								role="complementary"
							>
								<h5><strong class="text-uppercase">Information for</strong></h5>
								<ul class="menu menu-bottom">
									<li class="menu__item is-leaf first leaf">
										<a
											href="https://www.arizona.edu/admissions"
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Future Students</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://www.arizona.edu/students"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Current Students</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://www.arizona.edu/faculty-staff"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Faculty &amp; Staff</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://www.arizona.edu/alumni-donors"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Alumni &amp; Donors</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://www.arizona.edu/parents-visitors"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Parents &amp; Visitors</a
										>
									</li>
									<li class="menu__item is-leaf last leaf">
										<a
											href="https://corporate.arizona.edu/"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Corporations &amp; Businesses</a
										>
									</li>
								</ul>
							</div>
							<div class="clearfix visible-xs-block col-xs-12">
								<hr />
							</div>
							<div
								id="block-bean-uaqs-footer-links-bean-topics"
								class="block block-bean even col-xs-12 col-sm-6 col-md-5"
								role="complementary"
							>
								<h5><strong class="text-uppercase">Topics</strong></h5>
								<ul class="menu menu-bottom topic-menu">
									<li class="menu__item is-leaf first leaf">
										<a
											href="https://www.arizona.edu/about"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>About the University</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://www.arizona.edu/academics"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Academics</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://www.arizona.edu/arts-museums"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Arts &amp; Museums</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://www.arizona.edu/athletics-recreation"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Athletics &amp; Recreation</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://shop.arizona.edu/"
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Campus Store</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://www.arizona.edu/colleges-schools"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Colleges, Schools, Departments</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://www.environment.arizona.edu"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Environment &amp; Sustainability</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://international.arizona.edu"
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>International Engagement</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://healthsciences.arizona.edu/"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Health &amp; Medical</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://www.arizona.edu/libraries"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Libraries</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://research.arizona.edu"
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Research &amp; Innovation</a
										>
									</li>
									<li class="menu__item is-leaf last leaf">
										<a
											href="https://www.arizona.edu/purpose-mission-values"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											>Purpose, Mission &amp; Values</a
										>
									</li>
								</ul>
							</div>
							<div class="clearfix visible-xs-block col-xs-12">
								<hr />
							</div>
							<div class="clearfix visible-sm-block col-xs-12">
								<hr />
							</div>
							<div
								id="block-bean-uaqs-footer-links-bean-resources"
								class="block block-bean odd col-xs-12 col-sm-6 col-md-2 clearfix"
								role="complementary"
							>
								<h5><strong class="text-uppercase">Resources</strong></h5>
								<ul class="menu menu-bottom">
									<li class="menu__item is-leaf first leaf">
										<a
											href="https://directory.arizona.edu/all"
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											><i class="ua-brand-directory"></i>A-Z Directory</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://www.arizona.edu/calendars-events"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											><i class="ua-brand-calendar"></i>Calendars</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://map.arizona.edu"
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											><i class="ua-brand-campus-map"></i>Campus Map</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://news.arizona.edu"
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											><i class="ua-brand-news"></i>News</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://phonebook.arizona.edu/"
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											><i class="ua-brand-directory"></i>Phonebook</a
										>
									</li>
									<li class="menu__item is-leaf last leaf">
										<a
											href="https://www.arizona.edu/weather"
											title=""
											class="menu__link"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											><i class="ua-brand-weather"></i>Weather</a
										>
									</li>
								</ul>
							</div>
							<div
								id="block-bean-uaqs-footer-links-bean-connect"
								class="block block-bean even col-xs-12 col-sm-6 col-md-2 clearfix"
								role="complementary"
							>
								<h5><strong class="text-uppercase">Connect</strong></h5>
								<ul class="menu menu-bottom">
									<li class="menu__item is-leaf first leaf">
										<a
											class="menu__link"
											href="https://facebook.com/uarizona"
											target="_blank"
											title="Click here to visit our Facebook page"
											rel="noopener noreferrer"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											><i class="az-icon-facebook"></i>Facebook</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://x.com/uarizona"
											target="_blank"
											title="Click here to visit our X, formerly Twitter page"
											rel="noopener noreferrer"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											><i class="az-icon-x-twitter"></i>X, formerly Twitter</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://instagram.com/uarizona"
											target="_blank"
											title="Click here to visit our Instagram page"
											rel="noopener noreferrer"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											><i class="az-icon-instagram"></i>Instagram</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://linkedin.com/edu/university-of-arizona-17783"
											target="_blank"
											title="Click here to visit our LinkedIn page"
											rel="noopener noreferrer"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											><i class="az-icon-linkedin"></i>LinkedIn</a
										>
									</li>
									<li class="menu__item is-leaf leaf">
										<a
											href="https://youtube.com/universityofarizona"
											target="_blank"
											title="Click here to visit our YouTube page"
											rel="noopener noreferrer"
											@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
											><i class="az-icon-youtube"></i>YouTube</a
										>
									</li>
								</ul>
							</div>
							<div
								id="block-bean-uaqs-footer"
								class="block block-bean last odd"
								role="complementary"
							>
								<div
									class="entity entity-bean bean-uaqs-flexible-block clearfix"
									about="/block/uaqs-footer"
								>
									<div class="content"></div>
								</div>
							</div>
						</div>
						<div
							class="entity entity-paragraphs-item paragraphs-item-uaqs-full-width-bg-wrapper mb-0  background-wrapper bg-warm-gray"
						>
							<div class="container">
								<div class="row">
									<div class="col-sm-12">
										<hr />
										<p class="text-align-center text-muted mt-0 mb-0">
											<em
												>We respectfully acknowledge <a
										href="https://www.arizona.edu/university-arizona-land-acknowledgment"
										target="_blank"
										@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
										>the University of Arizona is on the land and territories of Indigenous peoples</a>. 
												Today, Arizona is home to 22 federally recognized
												tribes, with Tucson being home to the O’odham and the
												Yaqui. The
												university strives to build sustainable relationships
												with sovereign Native Nations and Indigenous communities
												through education offerings, partnerships, and community
												service.</em
											>
										</p>
									</div>
								</div>
							</div>
						</div>
						<!--Close wrapper-->
						<div class="container container-collapsed">
							<div class="row">
								<div class="column col-sm-12"><div></div></div>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-12 text-center">
								<hr />
								<p class="small">
									<a
										href="https://www.arizona.edu/information-security-privacy"
										target="_blank"
										@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
										>University Information Security and Privacy</a
									>
								</p>
								<p class="copyright small">
									© <span>${new Date().getFullYear()}</span> The Arizona Board
									of Regents on behalf of
									<a
										href="https://www.arizona.edu"
										target="_blank"
										@click="${(e)=>{
            (0, $3ec7ef81de56299a$export$567722ec5f02624e)(e, "az-footer");
        }}"
										>The University of Arizona</a
									>.
								</p>
							</div>
						</div>
					</div>
				</div>
			</footer>
		`;
    }
}
customElements.get('az-footer') || customElements.define('az-footer', $a3840bb5e86c1b3a$export$2e2bcd8739ae039);





export {$74c0cb58ecac5e6e$export$2e2bcd8739ae039 as AzButton, $006bea8753e7b169$export$2e2bcd8739ae039 as AzHeader, $a3840bb5e86c1b3a$export$2e2bcd8739ae039 as AzFooter, $c6fed9b7d3437e21$export$2e2bcd8739ae039 as AzSelectMenu};
