export declare const az: {
    readonly color: {
        readonly brand: {
            readonly red: "var(--az-color-brand-red, #ab0520)";
            readonly blue: "var(--az-color-brand-blue, #0c234b)";
            readonly tinta: "var(--az-color-brand-tinta, #03132e)";
            readonly azurite: "var(--az-color-brand-azurite, #1e5288)";
            readonly arroyoBlue: "var(--az-color-brand-arroyo-blue, #106ab1)";
            readonly rain: "var(--az-color-brand-rain, #81ceeb)";
            readonly sonoranRed: "var(--az-color-brand-sonoran-red, #850000)";
            readonly bougainvillea: "var(--az-color-brand-bougainvillea, #c62840)";
            readonly saguaro: "var(--az-color-brand-saguaro, #7f8b5a)";
            readonly shade: "var(--az-color-brand-shade, #3f7a7a)";
            readonly brick: "var(--az-color-brand-brick, #85372b)";
            readonly cloud: "var(--az-color-brand-cloud, #e5eff7)";
            readonly caliche: "var(--az-color-brand-caliche, #f2efea)";
            readonly white: "var(--az-color-brand-white, #ffffff)";
        };
        readonly semantic: {
            readonly action: {
                readonly default: "var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520))";
                readonly hover: "var(--az-color-semantic-action-hover, var(--az-color-brand-sonoran-red, #850000))";
                readonly focusRing: "var(--az-color-semantic-action-focus-ring, var(--az-color-brand-bougainvillea, #c62840))";
            };
            readonly onAction: {
                readonly default: "var(--az-color-semantic-on-action-default, var(--az-color-brand-white, #ffffff))";
            };
            readonly surface: {
                readonly default: "var(--az-color-semantic-surface-default, var(--az-color-brand-white, #ffffff))";
            };
            readonly text: {
                readonly default: "var(--az-color-semantic-text-default, var(--az-color-brand-tinta, #03132e))";
            };
        };
    };
    readonly dimension: {
        readonly "1": "var(--az-dimension-1, 1px)";
        readonly "2": "var(--az-dimension-2, 2px)";
        readonly "4": "var(--az-dimension-4, 4px)";
        readonly "6": "var(--az-dimension-6, 6px)";
        readonly "8": "var(--az-dimension-8, 8px)";
        readonly "10": "var(--az-dimension-10, 10px)";
        readonly "12": "var(--az-dimension-12, 12px)";
        readonly "14": "var(--az-dimension-14, 14px)";
        readonly "16": "var(--az-dimension-16, 16px)";
        readonly "18": "var(--az-dimension-18, 18px)";
        readonly "20": "var(--az-dimension-20, 20px)";
        readonly "22": "var(--az-dimension-22, 22px)";
        readonly "24": "var(--az-dimension-24, 24px)";
        readonly "30": "var(--az-dimension-30, 30px)";
        readonly "36": "var(--az-dimension-36, 36px)";
        readonly "48": "var(--az-dimension-48, 48px)";
        readonly "50": "var(--az-dimension-50, 50px)";
        readonly "211": "var(--az-dimension-211, 211px)";
        readonly "9-6": "var(--az-dimension-9-6, 9.6px)";
        readonly "19-8": "var(--az-dimension-19-8, 19.8px)";
        readonly "266-41": "var(--az-dimension-266-41, 266.41px)";
    };
    readonly fontWeight: {
        readonly "500": "var(--az-font-weight-500, 500)";
        readonly "700": "var(--az-font-weight-700, 700)";
    };
    readonly opacity: {
        readonly "65": "var(--az-opacity-65, 0.65)";
    };
    readonly component: {
        readonly button: {
            readonly label: {
                readonly font: {
                    readonly size: "var(--az-component-button-label-font-size, var(--az-dimension-18, 18px))";
                    readonly weight: "var(--az-component-button-label-font-weight, var(--az-font-weight-700, 700))";
                };
            };
            readonly padding: {
                readonly x: "var(--az-component-button-padding-x, var(--az-dimension-30, 30px))";
                readonly y: "var(--az-component-button-padding-y, var(--az-dimension-12, 12px))";
            };
            readonly border: {
                readonly width: "var(--az-component-button-border-width, var(--az-dimension-2, 2px))";
                readonly radius: "var(--az-component-button-border-radius, var(--az-dimension-24, 24px))";
            };
            readonly disabled: {
                readonly opacity: "var(--az-component-button-disabled-opacity, var(--az-opacity-65, 0.65))";
            };
            readonly focusVisible: {
                readonly ring: "var(--az-component-button-focus-visible-ring, var(--az-color-semantic-action-focus-ring, var(--az-color-brand-bougainvillea, #c62840)))";
            };
            readonly size: {
                readonly sm: {
                    readonly padding: {
                        readonly x: "var(--az-component-button-size-sm-padding-x, var(--az-dimension-8, 8px))";
                        readonly y: "var(--az-component-button-size-sm-padding-y, var(--az-dimension-4, 4px))";
                    };
                    readonly label: {
                        readonly font: {
                            readonly size: "var(--az-component-button-size-sm-label-font-size, var(--az-dimension-14, 14px))";
                        };
                    };
                };
                readonly lg: {
                    readonly padding: {
                        readonly x: "var(--az-component-button-size-lg-padding-x, var(--az-dimension-36, 36px))";
                        readonly y: "var(--az-component-button-size-lg-padding-y, var(--az-dimension-14, 14px))";
                    };
                    readonly label: {
                        readonly font: {
                            readonly size: "var(--az-component-button-size-lg-label-font-size, var(--az-dimension-22, 22px))";
                        };
                    };
                    readonly border: {
                        readonly radius: "var(--az-component-button-size-lg-border-radius, var(--az-dimension-30, 30px))";
                    };
                };
            };
            readonly solid: {
                readonly container: {
                    readonly color: "var(--az-component-button-solid-container-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520)))";
                };
                readonly label: {
                    readonly color: "var(--az-component-button-solid-label-color, var(--az-color-semantic-on-action-default, var(--az-color-brand-white, #ffffff)))";
                };
                readonly hover: {
                    readonly container: {
                        readonly color: "var(--az-component-button-solid-hover-container-color, var(--az-color-semantic-action-hover, var(--az-color-brand-sonoran-red, #850000)))";
                    };
                };
                readonly focus: {
                    readonly container: {
                        readonly color: "var(--az-component-button-solid-focus-container-color, var(--az-component-button-solid-container-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520))))";
                    };
                };
            };
            readonly outline: {
                readonly border: {
                    readonly color: "var(--az-component-button-outline-border-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520)))";
                };
                readonly label: {
                    readonly color: "var(--az-component-button-outline-label-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520)))";
                };
                readonly hover: {
                    readonly container: {
                        readonly color: "var(--az-component-button-outline-hover-container-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520)))";
                    };
                    readonly border: {
                        readonly color: "var(--az-component-button-outline-hover-border-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520)))";
                    };
                    readonly label: {
                        readonly color: "var(--az-component-button-outline-hover-label-color, var(--az-color-semantic-on-action-default, var(--az-color-brand-white, #ffffff)))";
                    };
                };
                readonly focus: {
                    readonly container: {
                        readonly color: "var(--az-component-button-outline-focus-container-color, var(--az-component-button-outline-hover-container-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520))))";
                    };
                    readonly border: {
                        readonly color: "var(--az-component-button-outline-focus-border-color, var(--az-component-button-outline-hover-border-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520))))";
                    };
                    readonly label: {
                        readonly color: "var(--az-component-button-outline-focus-label-color, var(--az-component-button-outline-hover-label-color, var(--az-color-semantic-on-action-default, var(--az-color-brand-white, #ffffff))))";
                    };
                };
            };
        };
        readonly accordion: {
            readonly button: {
                readonly padding: {
                    readonly x: "var(--az-component-accordion-button-padding-x, var(--az-dimension-20, 20px))";
                    readonly y: "var(--az-component-accordion-button-padding-y, var(--az-dimension-16, 16px))";
                };
                readonly label: {
                    readonly font: {
                        readonly size: "var(--az-component-accordion-button-label-font-size, var(--az-dimension-18, 18px))";
                    };
                };
            };
            readonly body: {
                readonly padding: {
                    readonly x: "var(--az-component-accordion-body-padding-x, var(--az-dimension-20, 20px))";
                    readonly y: "var(--az-component-accordion-body-padding-y, var(--az-dimension-16, 16px))";
                };
            };
            readonly border: {
                readonly width: "var(--az-component-accordion-border-width, var(--az-dimension-1, 1px))";
                readonly radius: "var(--az-component-accordion-border-radius, var(--az-dimension-6, 6px))";
            };
        };
        readonly tabs: {
            readonly label: {
                readonly padding: {
                    readonly x: "var(--az-component-tabs-label-padding-x, var(--az-dimension-16, 16px))";
                    readonly y: "var(--az-component-tabs-label-padding-y, var(--az-dimension-8, 8px))";
                };
                readonly font: {
                    readonly weight: "var(--az-component-tabs-label-font-weight, var(--az-font-weight-700, 700))";
                };
                readonly color: "var(--az-component-tabs-label-color, var(--az-color-brand-azurite, #1e5288))";
                readonly hover: {
                    readonly color: "var(--az-component-tabs-label-hover-color, var(--az-color-brand-tinta, #03132e))";
                };
                readonly active: {
                    readonly color: "var(--az-component-tabs-label-active-color, var(--az-component-tabs-label-hover-color, var(--az-color-brand-tinta, #03132e)))";
                };
            };
            readonly variant: {
                readonly tabs: {
                    readonly active: {
                        readonly background: "var(--az-component-tabs-variant-tabs-active-background, var(--az-color-brand-white, #ffffff))";
                    };
                };
                readonly underline: {
                    readonly gap: "var(--az-component-tabs-variant-underline-gap, var(--az-dimension-16, 16px))";
                    readonly border: {
                        readonly width: "var(--az-component-tabs-variant-underline-border-width, var(--az-dimension-2, 2px))";
                    };
                };
            };
        };
        readonly nav: {
            readonly utility: {
                readonly margin: {
                    readonly top: "var(--az-component-nav-utility-margin-top, var(--az-dimension-16, 16px))";
                    readonly bottom: "var(--az-component-nav-utility-margin-bottom, var(--az-dimension-24, 24px))";
                };
                readonly item: {
                    readonly padding: {
                        readonly x: "var(--az-component-nav-utility-item-padding-x, var(--az-dimension-9-6, 9.6px))";
                    };
                };
                readonly label: {
                    readonly font: {
                        readonly weight: "var(--az-component-nav-utility-label-font-weight, var(--az-font-weight-500, 500))";
                    };
                };
            };
        };
        readonly card: {
            readonly body: {
                readonly padding: {
                    readonly x: "var(--az-component-card-body-padding-x, var(--az-dimension-16, 16px))";
                    readonly y: "var(--az-component-card-body-padding-y, var(--az-dimension-16, 16px))";
                };
            };
            readonly title: {
                readonly margin: {
                    readonly bottom: "var(--az-component-card-title-margin-bottom, var(--az-dimension-8, 8px))";
                };
            };
            readonly border: {
                readonly width: "var(--az-component-card-border-width, var(--az-dimension-1, 1px))";
                readonly radius: "var(--az-component-card-border-radius, var(--az-dimension-6, 6px))";
            };
            readonly cap: {
                readonly padding: {
                    readonly x: "var(--az-component-card-cap-padding-x, var(--az-dimension-16, 16px))";
                    readonly y: "var(--az-component-card-cap-padding-y, var(--az-dimension-8, 8px))";
                };
            };
        };
        readonly arizonaHeader: {
            readonly height: "var(--az-component-arizona-header-height, var(--az-dimension-50, 50px))";
            readonly logo: {
                readonly marginLeft: "var(--az-component-arizona-header-logo-margin-left, var(--az-dimension-10, 10px))";
                readonly width: "var(--az-component-arizona-header-logo-width, var(--az-dimension-211, 211px))";
                readonly height: "var(--az-component-arizona-header-logo-height, var(--az-dimension-16, 16px))";
                readonly sm: {
                    readonly width: "var(--az-component-arizona-header-logo-sm-width, var(--az-dimension-266-41, 266.41px))";
                    readonly height: "var(--az-component-arizona-header-logo-sm-height, var(--az-dimension-19-8, 19.8px))";
                };
            };
        };
    };
};
