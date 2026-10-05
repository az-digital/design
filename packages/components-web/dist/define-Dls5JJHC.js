//#region src/generated/tokens.ts
var az = {
	"color": {
		"brand": {
			"red": "var(--az-color-brand-red, #ab0520)",
			"blue": "var(--az-color-brand-blue, #0c234b)",
			"tinta": "var(--az-color-brand-tinta, #03132e)",
			"azurite": "var(--az-color-brand-azurite, #1e5288)",
			"arroyoBlue": "var(--az-color-brand-arroyo-blue, #106ab1)",
			"rain": "var(--az-color-brand-rain, #81ceeb)",
			"sonoranRed": "var(--az-color-brand-sonoran-red, #850000)",
			"bougainvillea": "var(--az-color-brand-bougainvillea, #c62840)",
			"saguaro": "var(--az-color-brand-saguaro, #7f8b5a)",
			"shade": "var(--az-color-brand-shade, #3f7a7a)",
			"brick": "var(--az-color-brand-brick, #85372b)",
			"cloud": "var(--az-color-brand-cloud, #e5eff7)",
			"caliche": "var(--az-color-brand-caliche, #f2efea)",
			"white": "var(--az-color-brand-white, #ffffff)"
		},
		"semantic": { "action": {
			"default": "var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520))",
			"hover": "var(--az-color-semantic-action-hover, var(--az-color-brand-sonoran-red, #850000))",
			"focusRing": "var(--az-color-semantic-action-focus-ring, var(--az-color-brand-bougainvillea, #c62840))"
		} }
	},
	"dimension": {
		"1": "var(--az-dimension-1, 1px)",
		"2": "var(--az-dimension-2, 2px)",
		"4": "var(--az-dimension-4, 4px)",
		"6": "var(--az-dimension-6, 6px)",
		"8": "var(--az-dimension-8, 8px)",
		"10": "var(--az-dimension-10, 10px)",
		"12": "var(--az-dimension-12, 12px)",
		"14": "var(--az-dimension-14, 14px)",
		"16": "var(--az-dimension-16, 16px)",
		"18": "var(--az-dimension-18, 18px)",
		"20": "var(--az-dimension-20, 20px)",
		"22": "var(--az-dimension-22, 22px)",
		"24": "var(--az-dimension-24, 24px)",
		"30": "var(--az-dimension-30, 30px)",
		"36": "var(--az-dimension-36, 36px)",
		"48": "var(--az-dimension-48, 48px)",
		"50": "var(--az-dimension-50, 50px)",
		"211": "var(--az-dimension-211, 211px)",
		"9-6": "var(--az-dimension-9-6, 9.6px)",
		"19-8": "var(--az-dimension-19-8, 19.8px)",
		"266-41": "var(--az-dimension-266-41, 266.41px)"
	},
	"fontWeight": {
		"500": "var(--az-font-weight-500, 500)",
		"700": "var(--az-font-weight-700, 700)"
	},
	"opacity": { "65": "var(--az-opacity-65, 0.65)" },
	"component": {
		"button": {
			"label": { "font": {
				"size": "var(--az-component-button-label-font-size, var(--az-dimension-18, 18px))",
				"weight": "var(--az-component-button-label-font-weight, var(--az-font-weight-700, 700))"
			} },
			"padding": {
				"x": "var(--az-component-button-padding-x, var(--az-dimension-30, 30px))",
				"y": "var(--az-component-button-padding-y, var(--az-dimension-12, 12px))"
			},
			"border": {
				"width": "var(--az-component-button-border-width, var(--az-dimension-2, 2px))",
				"radius": "var(--az-component-button-border-radius, var(--az-dimension-24, 24px))"
			},
			"disabled": { "opacity": "var(--az-component-button-disabled-opacity, var(--az-opacity-65, 0.65))" },
			"focusVisible": { "ring": "var(--az-component-button-focus-visible-ring, var(--az-color-semantic-action-focus-ring, var(--az-color-brand-bougainvillea, #c62840)))" },
			"size": {
				"sm": {
					"padding": {
						"x": "var(--az-component-button-size-sm-padding-x, var(--az-dimension-8, 8px))",
						"y": "var(--az-component-button-size-sm-padding-y, var(--az-dimension-4, 4px))"
					},
					"label": { "font": { "size": "var(--az-component-button-size-sm-label-font-size, var(--az-dimension-14, 14px))" } }
				},
				"lg": {
					"padding": {
						"x": "var(--az-component-button-size-lg-padding-x, var(--az-dimension-36, 36px))",
						"y": "var(--az-component-button-size-lg-padding-y, var(--az-dimension-14, 14px))"
					},
					"label": { "font": { "size": "var(--az-component-button-size-lg-label-font-size, var(--az-dimension-22, 22px))" } },
					"border": { "radius": "var(--az-component-button-size-lg-border-radius, var(--az-dimension-30, 30px))" }
				}
			},
			"solid": {
				"container": { "color": "var(--az-component-button-solid-container-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520)))" },
				"label": { "color": "var(--az-component-button-solid-label-color, var(--az-color-brand-white, #ffffff))" },
				"hover": { "container": { "color": "var(--az-component-button-solid-hover-container-color, var(--az-color-semantic-action-hover, var(--az-color-brand-sonoran-red, #850000)))" } },
				"focus": { "container": { "color": "var(--az-component-button-solid-focus-container-color, var(--az-component-button-solid-container-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520))))" } }
			},
			"outline": {
				"border": { "color": "var(--az-component-button-outline-border-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520)))" },
				"label": { "color": "var(--az-component-button-outline-label-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520)))" },
				"hover": {
					"container": { "color": "var(--az-component-button-outline-hover-container-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520)))" },
					"border": { "color": "var(--az-component-button-outline-hover-border-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520)))" },
					"label": { "color": "var(--az-component-button-outline-hover-label-color, var(--az-color-brand-white, #ffffff))" }
				},
				"focus": {
					"container": { "color": "var(--az-component-button-outline-focus-container-color, var(--az-component-button-outline-hover-container-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520))))" },
					"border": { "color": "var(--az-component-button-outline-focus-border-color, var(--az-component-button-outline-hover-border-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520))))" },
					"label": { "color": "var(--az-component-button-outline-focus-label-color, var(--az-component-button-outline-hover-label-color, var(--az-color-brand-white, #ffffff)))" }
				}
			}
		},
		"accordion": {
			"button": {
				"padding": {
					"x": "var(--az-component-accordion-button-padding-x, var(--az-dimension-20, 20px))",
					"y": "var(--az-component-accordion-button-padding-y, var(--az-dimension-16, 16px))"
				},
				"label": { "font": { "size": "var(--az-component-accordion-button-label-font-size, var(--az-dimension-18, 18px))" } }
			},
			"body": { "padding": {
				"x": "var(--az-component-accordion-body-padding-x, var(--az-dimension-20, 20px))",
				"y": "var(--az-component-accordion-body-padding-y, var(--az-dimension-16, 16px))"
			} },
			"border": {
				"width": "var(--az-component-accordion-border-width, var(--az-dimension-1, 1px))",
				"radius": "var(--az-component-accordion-border-radius, var(--az-dimension-6, 6px))"
			}
		},
		"tabs": {
			"label": {
				"padding": {
					"x": "var(--az-component-tabs-label-padding-x, var(--az-dimension-16, 16px))",
					"y": "var(--az-component-tabs-label-padding-y, var(--az-dimension-8, 8px))"
				},
				"font": { "weight": "var(--az-component-tabs-label-font-weight, var(--az-font-weight-700, 700))" },
				"color": "var(--az-component-tabs-label-color, var(--az-color-brand-azurite, #1e5288))",
				"hover": { "color": "var(--az-component-tabs-label-hover-color, var(--az-color-brand-tinta, #03132e))" },
				"active": { "color": "var(--az-component-tabs-label-active-color, var(--az-component-tabs-label-hover-color, var(--az-color-brand-tinta, #03132e)))" }
			},
			"variant": {
				"tabs": { "active": { "background": "var(--az-component-tabs-variant-tabs-active-background, var(--az-color-brand-white, #ffffff))" } },
				"underline": {
					"gap": "var(--az-component-tabs-variant-underline-gap, var(--az-dimension-16, 16px))",
					"border": { "width": "var(--az-component-tabs-variant-underline-border-width, var(--az-dimension-2, 2px))" }
				}
			}
		},
		"nav": { "utility": {
			"margin": {
				"top": "var(--az-component-nav-utility-margin-top, var(--az-dimension-16, 16px))",
				"bottom": "var(--az-component-nav-utility-margin-bottom, var(--az-dimension-24, 24px))"
			},
			"item": { "padding": { "x": "var(--az-component-nav-utility-item-padding-x, var(--az-dimension-9-6, 9.6px))" } },
			"label": { "font": { "weight": "var(--az-component-nav-utility-label-font-weight, var(--az-font-weight-500, 500))" } }
		} },
		"card": {
			"body": { "padding": {
				"x": "var(--az-component-card-body-padding-x, var(--az-dimension-16, 16px))",
				"y": "var(--az-component-card-body-padding-y, var(--az-dimension-16, 16px))"
			} },
			"title": { "margin": { "bottom": "var(--az-component-card-title-margin-bottom, var(--az-dimension-8, 8px))" } },
			"border": {
				"width": "var(--az-component-card-border-width, var(--az-dimension-1, 1px))",
				"radius": "var(--az-component-card-border-radius, var(--az-dimension-6, 6px))"
			},
			"cap": { "padding": {
				"x": "var(--az-component-card-cap-padding-x, var(--az-dimension-16, 16px))",
				"y": "var(--az-component-card-cap-padding-y, var(--az-dimension-8, 8px))"
			} }
		},
		"arizonaHeader": {
			"height": "var(--az-component-arizona-header-height, var(--az-dimension-50, 50px))",
			"logo": {
				"marginLeft": "var(--az-component-arizona-header-logo-margin-left, var(--az-dimension-10, 10px))",
				"width": "var(--az-component-arizona-header-logo-width, var(--az-dimension-211, 211px))",
				"height": "var(--az-component-arizona-header-logo-height, var(--az-dimension-16, 16px))",
				"sm": {
					"width": "var(--az-component-arizona-header-logo-sm-width, var(--az-dimension-266-41, 266.41px))",
					"height": "var(--az-component-arizona-header-logo-sm-height, var(--az-dimension-19-8, 19.8px))"
				}
			}
		}
	}
};
//#endregion
//#region src/define.ts
/**
* Registers a custom element unless that tag is already defined, so a page
* that loads the components twice (say, the CDN bundle and an npm import)
* doesn't throw.
*/
function define(tag, element) {
	if (!customElements.get(tag)) customElements.define(tag, element);
}
//#endregion
export { az as n, define as t };
