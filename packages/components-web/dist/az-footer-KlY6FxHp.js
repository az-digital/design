import { n as az, t as define } from "./define-CYUzZ04X.js";
import { LitElement, css, html, nothing, svg, unsafeCSS } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
//#region src/footer/footer-links.ts
/**
* The University footer's links, as on Arizona Quickstart 3 sites (for
* example president.arizona.edu). They're fixed University content, the same
* on every site, so they aren't configurable. Twitter is listed as X, its
* current name.
*/
var utilityLinks = [
	{
		label: "Employment",
		href: "https://talent.arizona.edu/"
	},
	{
		label: "Emergency Information",
		href: "https://cirt.arizona.edu"
	},
	{
		label: "Nondiscrimination",
		href: "https://www.arizona.edu/nondiscrimination"
	},
	{
		label: "Campus Safety",
		href: "https://safety.arizona.edu"
	},
	{
		label: "Copyright",
		href: "https://www.arizona.edu/copyright"
	},
	{
		label: "Campus Accessibility",
		href: "https://www.arizona.edu/campus-accessibility"
	},
	{
		label: "Contact Us",
		href: "https://www.arizona.edu/contact-us"
	},
	{
		label: "Feedback",
		href: "https://www.arizona.edu/website-feedback"
	}
];
var informationFor = {
	heading: "Information For",
	links: [
		{
			label: "Future Students",
			href: "https://www.arizona.edu/admissions"
		},
		{
			label: "Current Students",
			href: "https://www.arizona.edu/students"
		},
		{
			label: "Faculty & Staff",
			href: "https://www.arizona.edu/faculty-staff"
		},
		{
			label: "Alumni & Donors",
			href: "https://www.arizona.edu/alumni-donors"
		},
		{
			label: "Parents & Visitors",
			href: "https://www.arizona.edu/parents-visitors"
		},
		{
			label: "Corporations & Businesses",
			href: "https://corporate.arizona.edu"
		}
	]
};
var topics = {
	heading: "Topics",
	links: [
		{
			label: "About the University",
			href: "https://www.arizona.edu/about"
		},
		{
			label: "Academics",
			href: "https://www.arizona.edu/academics"
		},
		{
			label: "Arts & Museums",
			href: "https://www.arizona.edu/arts-museums"
		},
		{
			label: "Athletics & Recreation",
			href: "https://www.arizona.edu/athletics-recreation"
		},
		{
			label: "Campus Store",
			href: "https://shop.arizona.edu/"
		},
		{
			label: "Colleges, Schools, Departments",
			href: "https://www.arizona.edu/colleges-schools"
		},
		{
			label: "Environment & Sustainability",
			href: "https://www.environment.arizona.edu"
		},
		{
			label: "International Engagement",
			href: "https://international.arizona.edu"
		},
		{
			label: "Health & Medical",
			href: "https://healthsciences.arizona.edu/"
		},
		{
			label: "Libraries",
			href: "https://www.arizona.edu/libraries"
		},
		{
			label: "Research & Innovation",
			href: "https://research.arizona.edu"
		},
		{
			label: "Purpose, Mission & Values",
			href: "https://www.arizona.edu/purpose-mission-values"
		}
	]
};
var resources = {
	heading: "Resources",
	links: [
		{
			label: "Directory",
			href: "https://directory.arizona.edu"
		},
		{
			label: "Calendars",
			href: "https://www.arizona.edu/calendars-events"
		},
		{
			label: "Campus Map",
			href: "https://map.arizona.edu"
		},
		{
			label: "News",
			href: "https://news.arizona.edu"
		},
		{
			label: "Phonebook",
			href: "https://phonebook.arizona.edu"
		},
		{
			label: "Weather",
			href: "https://www.arizona.edu/weather"
		}
	]
};
var connect = {
	heading: "Connect",
	links: [
		{
			label: "X, formerly Twitter",
			href: "https://x.com/uarizona",
			icon: "x"
		},
		{
			label: "Instagram",
			href: "https://instagram.com/uarizona",
			icon: "instagram"
		},
		{
			label: "Facebook",
			href: "https://facebook.com/uarizona",
			icon: "facebook"
		},
		{
			label: "LinkedIn",
			href: "https://linkedin.com/edu/university-of-arizona-17783",
			icon: "linkedin"
		},
		{
			label: "YouTube",
			href: "https://youtube.com/universityofarizona",
			icon: "youtube"
		}
	]
};
var landAcknowledgment = {
	href: "https://www.arizona.edu/university-arizona-land-acknowledgment",
	linkText: "the University of Arizona is on the land and territories of Indigenous peoples"
};
//#endregion
//#region src/footer/icons.ts
var socialIcons = {
	facebook: "M0 960h1024v-1024h-1024v1024zM638.464 459.808l12.352 102.304h-92.16v50.592c0 25.856 2.24 40.448 40.48 40.448h50.592v101.152h-82.048c-97.792 0-132.64-49.472-132.64-132.64v-60.704h-60.704v-101.152h60.704v-295.616h121.408v295.616h82.048z",
	instagram: "M775.312 528.496c-0.656 25.264-1.616 50.624-4.208 75.776-2.432 24.048-10.896 46.192-27.12 64.896-22.736 26.192-52.72 37.2-85.904 39.232-37.792 2.288-75.648 2.848-113.52 3.312-37.696 0.464-75.376 0.32-113.056-0.416-25.264-0.512-50.624-1.616-75.776-4.144-24.048-2.464-46.192-10.944-64.896-27.184-26.16-22.688-37.2-52.672-39.2-85.872-2.32-37.792-2.88-75.696-3.344-113.552-0.464-37.664-0.32-75.36 0.464-113.056 0.48-25.264 1.568-50.624 4.112-75.76 2.464-24.048 10.944-46.208 27.184-64.912 22.688-26.16 52.672-37.2 85.872-39.232 37.792-2.272 75.696-2.848 113.552-3.296 37.664-0.464 75.376-0.48 113.024 0.48 27.808 0.736 55.888 1.248 83.28 5.552 46.848 7.36 78.496 34.496 91.104 80.96 4.080 15.040 6.192 30.96 6.8 46.56 1.6 43.36 1.904 86.8 2.752 130.224-0.336 0-0.672 0-0.992 0 0.016 26.784 0.528 53.616-0.128 80.432zM511.536 282.512c-91.216 0.144-165.088 74.24-164.992 165.632 0.048 91.584 74.208 165.472 165.92 165.344 91.248-0.176 165.088-74.24 165.056-165.648-0.048-91.536-74.256-165.472-165.984-165.328zM683.792 580.928c-21.296-0.016-38.928 17.696-38.848 39.088 0.080 21.152 17.44 38.512 38.56 38.624 21.664 0.096 39.088-17.12 39.136-38.656 0.016-21.536-17.344-38.992-38.848-39.056zM513.056 555.12c-59.952 0.048-108.176-47.6-108.176-106.864s47.968-107.392 107.024-107.392c58.608 0 107.184 47.952 107.232 105.936 0.032 59.696-47.536 108.288-106.080 108.32zM0 960v-1024h1024v1024h-1024zM834 341.936c-0.336-2-0.976-4.032-0.976-6.032-0.736-24.896-1.888-49.728-7.952-74.032-13.776-54.864-45.6-94.736-97.904-117.376-28.352-12.288-58.496-15.808-89.040-17.056-6.704-0.304-13.376-0.96-20.064-1.44-70.704 0-141.392 0-212.128 0-2 0.336-4 0.944-6.032 0.992-24.864 0.736-49.728 1.888-74.032 7.984-54.832 13.728-94.736 45.536-117.344 97.84-12.272 28.352-15.808 58.496-17.056 89.008-0.288 6.736-0.944 13.408-1.456 20.096 0 70.704 0 141.392 0 212.128 0.368 2 0.976 4 1.024 6.032 0.736 24.896 1.856 49.728 7.984 74.032 13.744 54.832 45.568 94.736 97.856 117.344 28.352 12.272 58.48 15.84 89.040 17.056 6.688 0.288 13.344 0.976 20.032 1.456 70.736 0 141.424 0 212.128 0 2.032-0.336 4-0.976 6.032-1.024 24.928-0.736 49.728-1.856 74.032-7.952 54.832-13.776 94.736-45.568 117.344-97.888 12.32-28.352 15.84-58.48 17.088-89.008 0.304-6.72 0.992-13.376 1.44-20.064-0.016-70.704-0.016-141.392-0.016-212.096z",
	linkedin: "M365.312 628.416c28.096 0 44.96-17.984 44.96-42.72 0-23.616-17.984-42.72-46.080-42.72v0c-26.976 0-44.96 19.104-44.96 42.72 0 24.736 17.984 42.72 46.080 42.72zM323.712 265.344v245.024h80.928v-245.056h-80.928zM604.736 516c53.952 0 93.28-34.848 93.28-110.144v-139.392h-80.928v130.4c0 32.608-12.352 55.072-41.6 55.072-22.464 0-35.968-14.624-41.6-29.216-2.24-5.632-2.24-12.352-2.24-20.224v-137.12h-80.928c0 0 1.12 222.56 0 245.056h80.928v-34.848c10.112 16.864 30.336 40.448 73.056 40.448v0zM0 960h1024v-1024h-1024v1024zM768.032 230.208l-0.032 435.552c0 21.344-16.864 38.208-39.328 38.208l-433.344-0.384c-21.344 0-39.328-16.864-39.328-38.208l-0.032-435.488c0-21.376 16.864-38.208 39.328-38.208l433.408 0.32c21.344 0 39.328 16.864 39.328 38.208z",
	youtube: "M448.768 355.168l0.128 183.328 174.528-92.704-174.656-90.592zM0 960h1024v-1025.12h-1024v1025.12zM847.328 414.24v0 50.624c0 55.136-6.752 109.152-6.752 109.152s-6.752 46.144-27.008 66.4c-25.888 25.888-54.016 27.008-67.52 28.128-93.408 6.752-234.048 6.752-234.048 6.752v0c0 0-140.672 0-234.048-6.752-13.504-1.12-41.632-1.12-67.52-28.128-20.256-20.256-27.008-66.4-27.008-66.4s-6.752-55.136-6.752-109.152v-50.624c0-55.136 6.752-109.152 6.752-109.152s6.752-46.144 27.008-66.4c25.888-27.008 59.648-25.888 74.272-29.248 52.896-5.632 227.296-6.752 227.296-6.752s140.672 0 234.048 7.872c13.504 1.12 41.632 1.12 67.52 28.128 20.256 20.256 27.008 66.4 27.008 66.4s6.752 55.136 6.752 109.152v0z",
	x: "M246.4 752l460.8-604.8h70.4l-457.6 604.8zM0 960v-1024h1024v1024h-1024zM672 70.4l-201.6 262.4-230.4-262.4h-128l297.6 342.4-313.6 412.8h262.4l182.4-240 211.2 240h128l-278.4-320 326.4-435.2h-256z"
};
//#endregion
//#region src/footer/ua-wordmark.ts
var uaWordmark = `<svg class="ua-wordmark" viewBox="0 0 150 35.558" aria-hidden="true" focusable="false"><g transform="translate(75 17.779)"><g transform="translate(-75 -17.779)"><path d="M112.106 26.262a4 4 0 0 0 .156 1.29 1.9 1.9 0 0 0 .515.748h-3.107a1.9 1.9 0 0 0 .519-.748 4 4 0 0 0 .152-1.29v-8.211h-.915a6.5 6.5 0 0 0-1.529.147 2.1 2.1 0 0 0-.936.479l.561-1.888h8.09l-.53 1.855a1.5 1.5 0 0 0-.663-.449 3.2 3.2 0 0 0-1.039-.144h-1.273v8.21Z" class="lettering" transform="translate(-69.144 -10.853)"/><path d="M134.91 28.791a3.7 3.7 0 0 0 .134 1.149 1.7 1.7 0 0 0 .461.669h-2.772a1.7 1.7 0 0 0 .456-.669 3.6 3.6 0 0 0 .138-1.149v-6.647a3.5 3.5 0 0 0-.138-1.144 1.7 1.7 0 0 0-.456-.658h2.767a1.6 1.6 0 0 0-.461.658 3.7 3.7 0 0 0-.134 1.148v2.3h5.444v-2.3a3.6 3.6 0 0 0-.131-1.148 1.6 1.6 0 0 0-.461-.658h2.773a1.66 1.66 0 0 0-.456.658 3.6 3.6 0 0 0-.138 1.148v6.648a3.6 3.6 0 0 0 .134 1.149 1.7 1.7 0 0 0 .46.669h-2.773a1.65 1.65 0 0 0 .461-.669 3.7 3.7 0 0 0 .135-1.149v-3.169h-5.443z" class="lettering" transform="translate(-85.805 -13.147)"/><path d="M164.249 30.609a1.7 1.7 0 0 0 .456-.669 3.5 3.5 0 0 0 .138-1.151V22.15A3.5 3.5 0 0 0 164.7 21a1.66 1.66 0 0 0-.456-.661h5.535v1.621a2.4 2.4 0 0 0-.815-.433 3.6 3.6 0 0 0-1.024-.134 5 5 0 0 0-.67.048c-.249.032-.525.082-.837.146v2.893h2.483v1.493a.95.95 0 0 0-.475-.294 4.7 4.7 0 0 0-1.094-.086h-.914v3.683q.576.086 1.042.13c.466.044.578.045.806.045a5 5 0 0 0 1.456-.209 5.4 5.4 0 0 0 1.347-.641l-.707 2.01h-6.133Z" class="lettering" transform="translate(-106.179 -13.147)"/><path d="M205.614 28.391v-.867a6.6 6.6 0 0 1-1.666.9 5.1 5.1 0 0 1-1.7.3 4.5 4.5 0 0 1-1.757-.33 3.55 3.55 0 0 1-1.331-.99 3.1 3.1 0 0 1-.63-1.208 7.2 7.2 0 0 1-.191-1.851v-5.396a4.1 4.1 0 0 0-.149-1.279 1.84 1.84 0 0 0-.508-.735h3.08a1.8 1.8 0 0 0-.5.735 4 4 0 0 0-.149 1.279v5.034a10 10 0 0 0 .112 1.75 2.1 2.1 0 0 0 .383.907 1.96 1.96 0 0 0 .865.608 3.7 3.7 0 0 0 1.286.2 3.5 3.5 0 0 0 1.159-.187 2.75 2.75 0 0 0 .94-.539 1.64 1.64 0 0 0 .514-.771 4.4 4.4 0 0 0 .153-1.291v-5.711a4.1 4.1 0 0 0-.148-1.3 1.75 1.75 0 0 0-.508-.713h3.1a1.75 1.75 0 0 0-.515.751 4 4 0 0 0-.153 1.262v7.417a4 4 0 0 0 .153 1.28 1.9 1.9 0 0 0 .515.744h-2.35Z" class="lettering" transform="translate(-127.789 -10.948)"/><path d="M240.847 20.338a1.6 1.6 0 0 0-.461.658 3.6 3.6 0 0 0-.134 1.146v8.705a1.83 1.83 0 0 1-1.007-.348 6.3 6.3 0 0 1-1.193-1.266l-5.223-6.686v6.241a3.7 3.7 0 0 0 .133 1.171 1.6 1.6 0 0 0 .451.649h-2.3a1.7 1.7 0 0 0 .457-.669 3.5 3.5 0 0 0 .138-1.151v-6.646a3.5 3.5 0 0 0-.135-1.142 1.63 1.63 0 0 0-.457-.658h2.055l5.986 7.713v-5.913A3.6 3.6 0 0 0 239.02 21a1.7 1.7 0 0 0-.457-.658Z" class="lettering" transform="translate(-149.405 -13.147)"/><path d="M265.5 28.789a3.6 3.6 0 0 0 .134 1.151 1.65 1.65 0 0 0 .46.669h-2.773a1.66 1.66 0 0 0 .461-.669 3.7 3.7 0 0 0 .133-1.151v-6.647A3.7 3.7 0 0 0 263.78 21a1.6 1.6 0 0 0-.461-.658h2.773a1.6 1.6 0 0 0-.46.658 3.6 3.6 0 0 0-.134 1.146v6.647Z" class="lettering" transform="translate(-170.222 -13.147)"/><path d="M278.692 30.869a2.06 2.06 0 0 1-1.1-.744 5.7 5.7 0 0 1-.847-1.711l-2.048-5.983a11 11 0 0 0-.47-1.206 7.5 7.5 0 0 0-.5-.887l2.091.007a4 4 0 0 0 .052.466 3 3 0 0 0 .093.407l2.462 7.35 2.33-6.122a5 5 0 0 0 .164-.567 2.5 2.5 0 0 0 .062-.521 1 1 0 0 0-.117-.439 3.6 3.6 0 0 0-.392-.581h2.319l-4.1 10.532Z" class="lettering" transform="translate(-176.95 -13.147)"/><path d="M301.358 30.609a1.7 1.7 0 0 0 .457-.669 3.5 3.5 0 0 0 .14-1.151V22.15a3.5 3.5 0 0 0-.14-1.151 1.65 1.65 0 0 0-.457-.661h5.535v1.621a2.4 2.4 0 0 0-.814-.433 3.6 3.6 0 0 0-1.026-.134 5 5 0 0 0-.666.048q-.375.049-.838.146v2.893h2.482v1.493a.94.94 0 0 0-.475-.294 4.7 4.7 0 0 0-1.094-.086h-.913v3.683q.576.086 1.041.13c.465.044.579.045.808.045a5 5 0 0 0 1.453-.209 5.4 5.4 0 0 0 1.349-.641l-.707 2.01z" class="lettering" transform="translate(-194.813 -13.147)"/><path d="M324.873 28.791a3.6 3.6 0 0 0 .135 1.149 1.64 1.64 0 0 0 .459.669h-2.773a1.7 1.7 0 0 0 .457-.669 3.5 3.5 0 0 0 .137-1.149v-6.645a3.5 3.5 0 0 0-.137-1.146 1.7 1.7 0 0 0-.457-.659h3.5a3.8 3.8 0 0 1 2.417.724 2.3 2.3 0 0 1 .922 1.887 2.2 2.2 0 0 1-.554 1.487 4.56 4.56 0 0 1-1.718 1.133l2.629 3.556a7 7 0 0 0 .559.672q.327.356.748.739l-.785.073h-.124a2.16 2.16 0 0 1-1.078-.3 2.7 2.7 0 0 1-.887-.812l-3.011-4.216a4.7 4.7 0 0 0 1.966-.834 1.7 1.7 0 0 0 .62-1.366 1.63 1.63 0 0 0-.533-1.265 1.98 1.98 0 0 0-1.4-.489 4 4 0 0 0-.474.033q-.276.035-.624.1v7.326Z" class="lettering" transform="translate(-208.605 -13.147)"/><path d="m347.261 29.99-.481-1.864a7.5 7.5 0 0 0 1.707.89 5 5 0 0 0 1.647.293 2.8 2.8 0 0 0 1.673-.455 1.4 1.4 0 0 0 .631-1.179 1.45 1.45 0 0 0-.255-.806 5.5 5.5 0 0 0-1.853-1.206q-.398-.193-.619-.3a6.9 6.9 0 0 1-2.024-1.392 2.23 2.23 0 0 1-.55-1.51 2.34 2.34 0 0 1 1.006-1.987 4.57 4.57 0 0 1 2.752-.737A10 10 0 0 1 352 19.8q.6.065 1.312.206v1.726a4.9 4.9 0 0 0-1.26-.721 3.7 3.7 0 0 0-1.317-.238 2.35 2.35 0 0 0-1.4.378 1.16 1.16 0 0 0-.527.984 1.31 1.31 0 0 0 .418.956 7.7 7.7 0 0 0 1.856 1.111q.081.037.25.118a9.6 9.6 0 0 1 1.827 1.05 2.5 2.5 0 0 1 .7.864 2.4 2.4 0 0 1 .251 1.089 2.75 2.75 0 0 1-1.193 2.246 4.74 4.74 0 0 1-2.983.92 6.7 6.7 0 0 1-1.236-.126 12 12 0 0 1-1.443-.377Z" class="lettering" transform="translate(-224.176 -12.758)"/><path d="M373.593 28.789a3.6 3.6 0 0 0 .136 1.151 1.64 1.64 0 0 0 .461.669h-2.776a1.64 1.64 0 0 0 .462-.669 3.6 3.6 0 0 0 .135-1.151v-6.647a3.6 3.6 0 0 0-.135-1.142 1.6 1.6 0 0 0-.462-.658h2.776a1.6 1.6 0 0 0-.461.658 3.6 3.6 0 0 0-.136 1.146v6.647Z" class="lettering" transform="translate(-240.1 -13.147)"/><path d="m206.343 62.469-1.675 4.276h3.315zm.193-3.674.914 2.229 3.475 8.7a3.95 3.95 0 0 0 1.635 2.4v.052h-3.425v-.052c.82-.37.685-.555.236-1.74L208.47 68h-4.24l-.867 2.392c-.352.949-.468 1.438.333 1.74v.052h-3.073v-.052a3.8 3.8 0 0 0 1.619-2.4l4.3-10.864V58.8Z" class="lettering" transform="translate(-129.693 -38.008)"/><path d="M146.408 68.047a3.64 3.64 0 0 0-2.784 1.175 4.23 4.23 0 0 0-1.1 3 4.6 4.6 0 0 0 1.085 3.132 3.44 3.44 0 0 0 2.71 1.246 3.63 3.63 0 0 0 2.779-1.179 4.26 4.26 0 0 0 1.091-3.014 4.56 4.56 0 0 0-1.083-3.124 3.44 3.44 0 0 0-2.7-1.24Zm-.055 9.662a6.3 6.3 0 0 1-2.182-.375 5 5 0 0 1-1.757-1.074 5.1 5.1 0 0 1-1.193-1.742 5.5 5.5 0 0 1-.152-3.785 5.5 5.5 0 0 1 .776-1.519 5.36 5.36 0 0 1 1.961-1.668 5.6 5.6 0 0 1 2.547-.585 6.4 6.4 0 0 1 2.2.374 4.9 4.9 0 0 1 1.758 1.076 5 5 0 0 1 1.2 1.75 5.7 5.7 0 0 1 .415 2.178 5.1 5.1 0 0 1-.465 2.1 5.7 5.7 0 0 1-1.312 1.819 5.15 5.15 0 0 1-1.726 1.083 5.8 5.8 0 0 1-2.074.367Z" class="lettering" transform="translate(-91.023 -43.286)"/><path d="M176.845 76.083a3.6 3.6 0 0 0 .133 1.149 1.66 1.66 0 0 0 .464.664h-2.775a1.7 1.7 0 0 0 .457-.664 3.6 3.6 0 0 0 .138-1.149v-6.64a3.6 3.6 0 0 0-.138-1.152 1.7 1.7 0 0 0-.457-.66h5.542v1.621a2.4 2.4 0 0 0-.812-.436 3.6 3.6 0 0 0-1.03-.133 5 5 0 0 0-.673.048q-.372.048-.837.148v2.892h2.491v1.492a.93.93 0 0 0-.477-.293 4.7 4.7 0 0 0-1.1-.086h-.925v3.2Z" class="lettering" transform="translate(-112.913 -43.72)"/><path d="M238.669 76.086a3.6 3.6 0 0 0 .135 1.146 1.66 1.66 0 0 0 .46.664h-2.773a1.7 1.7 0 0 0 .457-.664 3.5 3.5 0 0 0 .138-1.146v-6.649a3.5 3.5 0 0 0-.138-1.149 1.65 1.65 0 0 0-.457-.657h3.5a3.8 3.8 0 0 1 2.42.724 2.3 2.3 0 0 1 .919 1.887 2.2 2.2 0 0 1-.552 1.487 4.55 4.55 0 0 1-1.718 1.131l2.627 3.558a7 7 0 0 0 .562.671q.325.353.748.735l-.786.073h-.124a2.15 2.15 0 0 1-1.076-.294 2.7 2.7 0 0 1-.888-.806l-3.011-4.22a4.64 4.64 0 0 0 1.965-.833 1.72 1.72 0 0 0 .622-1.364 1.63 1.63 0 0 0-.535-1.266 2 2 0 0 0-1.4-.49 4 4 0 0 0-.472.036 8 8 0 0 0-.626.1v7.328Z" class="lettering" transform="translate(-152.879 -43.72)"/><path d="M265.178 76.083a3.6 3.6 0 0 0 .133 1.149 1.63 1.63 0 0 0 .461.664H263a1.7 1.7 0 0 0 .459-.664 3.6 3.6 0 0 0 .135-1.149v-6.649a3.6 3.6 0 0 0-.135-1.146 1.6 1.6 0 0 0-.459-.657h2.773a1.6 1.6 0 0 0-.461.657 3.6 3.6 0 0 0-.133 1.146v6.649Z" class="lettering" transform="translate(-170.015 -43.72)"/><path d="m282.413 75.976-.736 1.921h-7.888l5.384-8.946a11 11 0 0 0-1.138-.229 7 7 0 0 0-.994-.075 4.9 4.9 0 0 0-1.293.169 5.5 5.5 0 0 0-1.269.53l.7-1.715h6.56l-5.379 8.941q.898.104 1.508.149c.61.045.758.047 1.055.047a8.6 8.6 0 0 0 1.914-.2 6 6 0 0 0 1.579-.594Z" class="lettering" transform="translate(-176.99 -43.72)"/><path d="M304.571 68.047a3.64 3.64 0 0 0-2.787 1.175 4.24 4.24 0 0 0-1.1 3 4.6 4.6 0 0 0 1.087 3.132 3.44 3.44 0 0 0 2.708 1.246 3.63 3.63 0 0 0 2.779-1.179 4.26 4.26 0 0 0 1.094-3.014 4.57 4.57 0 0 0-1.083-3.124 3.44 3.44 0 0 0-2.7-1.24Zm-.055 9.662a6.3 6.3 0 0 1-2.182-.375 5 5 0 0 1-1.76-1.074 5.1 5.1 0 0 1-1.19-1.742 5.4 5.4 0 0 1-.417-2.106 5.3 5.3 0 0 1 .265-1.679 5.45 5.45 0 0 1 2.738-3.188 5.6 5.6 0 0 1 2.547-.585 6.3 6.3 0 0 1 2.2.374 5.01 5.01 0 0 1 2.961 2.826 5.7 5.7 0 0 1 .414 2.178 5 5 0 0 1-.467 2.1 5.7 5.7 0 0 1-1.309 1.819 5.2 5.2 0 0 1-1.726 1.083 5.8 5.8 0 0 1-2.075.367Z" class="lettering" transform="translate(-193.267 -43.286)"/><path d="M342.489 67.631a1.57 1.57 0 0 0-.461.657 3.6 3.6 0 0 0-.134 1.146v8.7a1.84 1.84 0 0 1-1.008-.345 6.3 6.3 0 0 1-1.193-1.259l-5.222-6.687v6.243a3.7 3.7 0 0 0 .131 1.167 1.6 1.6 0 0 0 .45.646h-2.294a1.7 1.7 0 0 0 .456-.664 3.5 3.5 0 0 0 .14-1.149v-6.652a3.5 3.5 0 0 0-.14-1.146 1.7 1.7 0 0 0-.456-.657h2.051l5.99 7.713v-5.91a3.5 3.5 0 0 0-.14-1.146 1.65 1.65 0 0 0-.457-.657Z" class="lettering" transform="translate(-215.112 -43.72)"/><path d="M364.538 73.025h2.983l-1.43-3.969zm-1.367 3.487a1.4 1.4 0 0 0-.1.322 2 2 0 0 0-.03.341.6.6 0 0 0 .1.323 2 2 0 0 0 .341.4h-2.389a2 2 0 0 0 .534-.565 5.6 5.6 0 0 0 .485-.989l2.847-7.331a2.4 2.4 0 0 0 .131-.406 1.7 1.7 0 0 0 .043-.354.66.66 0 0 0-.081-.326 1.1 1.1 0 0 0-.275-.3h2.3l3.22 8.609a4.3 4.3 0 0 0 .485.949 4 4 0 0 0 .667.709h-2.9l.037-.037q.402-.427.4-.624a2.2 2.2 0 0 0-.174-.693l-.037-.11-.867-2.376h-3.773l-.966 2.457Z" class="lettering" transform="translate(-233.429 -43.72)"/><path d="m390.4 20.293 2.634 4.477 1.77-2.915a3 3 0 0 0 .246-.485 1.1 1.1 0 0 0 .082-.375.66.66 0 0 0-.1-.349 1.4 1.4 0 0 0-.326-.352h2.368l-3.474 5.653v2.8a3.6 3.6 0 0 0 .137 1.152 1.7 1.7 0 0 0 .459.669h-2.79a1.6 1.6 0 0 0 .461-.669 3.7 3.7 0 0 0 .133-1.148v-2.834L389.626 22a1.06 1.06 0 0 0-.646-.487 3.7 3.7 0 0 0-1.034-.095h-1.136v7.335a3.5 3.5 0 0 0 .138 1.15 1.7 1.7 0 0 0 .459.669h-2.776a1.67 1.67 0 0 0 .461-.669 3.7 3.7 0 0 0 .131-1.15v-7.335h-.812a5.7 5.7 0 0 0-1.369.133 1.9 1.9 0 0 0-.84.429l.5-1.687Z" class="lettering" transform="translate(-247.075 -13.118)"/><path d="M31.031 0v11.551l-1.17-.005L34.523 24l4 .005v11.553H0v-11.54h3.968l4.7-12.487H7.473L7.48 0Z" class="substrate"/><path d="M21.791 6.832h7.439v2.976h-3.09l8.126 20.942h2.4v3.081H26.6v-3h-2.829v5.877h15.9v-8.76l-3.569.006L30.375 12.7h1.8V3.94H11.41v8.76h1.8L7.485 27.935l-3.569.013v8.764h15.9v-5.878h-2.832v3H6.913V30.75h2.4l8.129-20.942h-3.09V6.832z" style="fill:#0c234b" transform="translate(-2.531 -2.547)"/><path d="M113.34 88.655a1.47 1.47 0 0 1 0 2.087 1.55 1.55 0 0 1-2.131 0 1.47 1.47 0 0 1 0-2.087 1.543 1.543 0 0 1 2.129 0Zm-.211.177a1.2 1.2 0 0 0-1.706 0 1.255 1.255 0 0 0 0 1.734 1.206 1.206 0 0 0 1.7 0 1.254 1.254 0 0 0 0-1.734Zm-1.5.017h.681a.7.7 0 0 1 .432.122.4.4 0 0 1 .156.339.46.46 0 0 1-.157.369.57.57 0 0 1-.3.125l.489.744h-.309l-.44-.734h-.284v.733h-.267v-1.7Zm.267.74h.362a.45.45 0 0 0 .275-.067.25.25 0 0 0 .087-.211.21.21 0 0 0-.087-.186.5.5 0 0 0-.275-.059h-.362z" class="lettering" transform="translate(-71.611 -57.036)"/><path d="m34.324 12.2 8.25 21.393s1.057 2.6 2.774 2.6h-6.007s.3.044.6-.457a1 1 0 0 0 .027-.715l-1.858-4.776h-7.56l-1.86 4.775a1 1 0 0 0 .03.715c.3.5.6.457.6.457h-6.006c1.716 0 2.774-2.6 2.774-2.6zm-.006 15.781h2.907l-2.9-7.5-2.9 7.5Z" style="fill:#ab0520" transform="translate(-15.071 -7.884)"/></g></g></svg>`;
//#endregion
//#region src/footer/az-footer.ts
var t = (value) => unsafeCSS(value);
var utility = az.component.nav.utility;
/**
* University of Arizona footer as a custom element: `<az-footer>`.
*
* The layout and content follow the footer on Arizona Quickstart 3 sites (for
* example president.arizona.edu): site logo and University utility links,
* then Information For, Topics, Resources, and Connect, the land
* acknowledgment, and the copyright. The links are fixed University content
* (see `footer-links.ts`). It replaces the `<az-footer>` built from
* az-marketing/slate-template, which vendor sites such as catalog.arizona.edu
* load from cdn.digital.arizona.edu/lib/temp-web-components/.
*
* Shows the University wordmark by default. A site can show its own logo
* instead by slotting in a link:
*
* ```html
* <az-footer>
*   <a slot="logo" href="/"><img src="/logo.png" alt="Office of the President | Home"></a>
* </az-footer>
* ```
*
* Analytics: Google Tag Manager's click triggers can't see inside a shadow
* root, so each link click pushes a `shadow_event_click` entry to
* `window.dataLayer`, in the same shape as the Slate template's footer, so
* existing GTM triggers keep working.
*
* Token gaps, hardcoded from Arizona Quickstart 3 until tokens exist:
* - Link color `#49595e`, the same gap as Nav's utility variant.
* - Text color, heading type, small text size, and the divider.
* - Layout: the 576/768px breakpoints and container widths follow Arizona
*   Bootstrap 5, as in `az-arizona-header`.
* - Logo size: 226px wide, as the Slate footer shows the wordmark today.
*
* @slot logo - A link wrapping the site's own logo. Defaults to the University wordmark.
* @csspart footer - The `<footer>` element.
*/
var AzFooter = class extends LitElement {
	static {
		this.styles = css`
    :host {
      display: block;
      --_link: #49595e;
      --_text: #000;
      --_focus-ring: ${t(az.color.brand.red)};
    }

    :host([hidden]) {
      display: none;
    }

    footer {
      background-color: ${t(az.color.brand.caliche)};
      color: var(--_text);
      padding-block: 48px;
      font-size: 16px;
      line-height: 1.5;
    }

    .container {
      box-sizing: border-box;
      width: 100%;
      margin-inline: auto;
      padding-inline: 12px;
    }

    a {
      color: ${t(az.color.brand.red)};
      text-decoration: underline;
    }

    a:focus-visible {
      outline: 0;
      border-radius: 2px;
      box-shadow: 0 0 0 2px var(--_focus-ring);
    }

    hr {
      margin: 16px 0;
      color: inherit;
      border: 0;
      border-top: 1px solid currentColor;
      opacity: 0.25;
    }

    /* Logo and utility links. */
    /* Bootstrap's 12-column grid with 24px gutters, so columns line up with Quickstart's. */
    .top,
    .columns {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 0 24px;
    }

    .top > *,
    .columns > * {
      grid-column: span 12;
    }

    .top {
      justify-items: center;
    }

    .logo {
      display: block;
      margin-bottom: 40px;
    }

    /* A slotted logo is the site's own markup, so the site sizes its image. */
    ::slotted(a) {
      display: block;
    }

    .ua-wordmark {
      display: block;
      width: 226px;
      max-width: 100%;
      height: auto;
    }

    /* Navy lettering on a light background makes the reversed wordmark the full-color logo. */
    .ua-wordmark .lettering {
      fill: ${t(az.color.brand.blue)};
    }

    .ua-wordmark .substrate {
      fill: ${t(az.color.brand.white)};
    }

    /* Link lists, styled as Nav's utility variant (az.component.nav.utility.*). */
    ul {
      list-style: none;
      margin: ${t(utility.margin.top)} 0 ${t(utility.margin.bottom)};
      padding: 0;
    }

    .menu a {
      display: inline-flex;
      align-items: center;
      gap: 0.4em;
      font-weight: ${t(utility.label.font.weight)};
      color: var(--_link);
      text-decoration: none;
      border-bottom: 2px solid transparent;
    }

    .menu a:hover,
    .menu a:focus {
      border-bottom-color: var(--_link);
    }

    .utility {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    .utility li {
      padding: 0 ${t(utility.item.padding.x)};
    }

    /* Flex keeps each item's bottom margin inside its list, as in Quickstart. */
    .columns ul {
      display: flex;
      flex-direction: column;
      line-height: 1.375;
    }

    .columns li {
      display: flex;
      margin-bottom: 4px;
    }

    h2 {
      margin: 16.672px 0 10.672px;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.2;
      text-transform: uppercase;
    }

    .icon {
      width: 1em;
      height: 1em;
      flex: none;
      fill: currentColor;
    }

    /* Land acknowledgment and copyright. */
    .bottom {
      text-align: center;
    }

    .bottom p {
      margin: 0 0 16px;
    }

    .acknowledgment {
      font-style: italic;
      font-weight: 300;
    }

    .small {
      font-size: 14px;
    }

    .bottom .security {
      margin-bottom: 4px;
    }

    @media (min-width: 576px) {
      .container {
        max-width: 540px;
      }

      .top {
        justify-items: stretch;
        align-items: start;
      }

      .top > .logo {
        grid-column: span 5;
        margin-bottom: 30px;
      }

      .top > nav {
        grid-column: span 7;
      }

      .utility {
        justify-content: flex-end;
      }

      .columns > * {
        grid-column: span 6;
      }
    }

    @media (min-width: 768px) {
      .container {
        max-width: 720px;
      }

      .top > .logo {
        grid-column: span 4;
      }

      .top > nav {
        grid-column: span 8;
      }

      .columns > :nth-child(1) {
        grid-column: span 3;
      }

      .columns > :nth-child(2) {
        grid-column: span 5;
      }

      .columns > :nth-child(3),
      .columns > :nth-child(4) {
        grid-column: span 2;
      }

      .columns li {
        margin-bottom: 8px;
      }

      h2 {
        margin-top: 16px;
      }

      .topics ul {
        display: block;
        column-count: 2;
      }
    }

    @media (min-width: 992px) {
      .container {
        max-width: 960px;
      }
    }

    @media (min-width: 1200px) {
      .container {
        max-width: 1140px;
      }
    }

    @media (min-width: 1400px) {
      .container {
        max-width: 1320px;
      }
    }
  `;
	}
	constructor() {
		super();
		this.pushClickToDataLayer = (event) => {
			const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
			if (!link) return;
			const menu = link.closest("nav")?.querySelector("h2")?.textContent ?? "";
			const w = window;
			w.dataLayer = w.dataLayer || [];
			w.dataLayer.push({
				event: `shadow_event_${event.type}`,
				shadow_event: {
					elementInnerHTML: link.textContent || "",
					elementInnerText: link.innerText || "",
					title: "shadow-dom-link",
					element: link,
					elementClasses: link.className || "",
					elementId: link.id || "",
					elementLocation: "az-footer",
					elementTarget: link.target || "",
					elementUrl: link.href || "",
					originalEvent: event,
					parent: menu,
					inShadowDom: true
				}
			});
		};
		this.addEventListener("click", this.pushClickToDataLayer);
	}
	link({ label, href, icon }) {
		return html`<li><a href=${href}>${icon ? this.icon(icon) : nothing}${label}</a></li>`;
	}
	icon(name) {
		return html`<svg class="icon" viewBox="0 0 1024 1024" aria-hidden="true" focusable="false">${svg`<path transform="translate(0 960) scale(1 -1)" d=${socialIcons[name]}></path>`}</svg>`;
	}
	menu({ heading, links }, className = "") {
		const id = `az-footer-${heading.toLowerCase().replace(/\W+/g, "-")}`;
		return html`<nav class="menu ${className}" aria-labelledby=${id}>
      <h2 id=${id}>${heading}</h2>
      <ul>
        ${links.map((link) => this.link(link))}
      </ul>
    </nav>`;
	}
	render() {
		return html`<footer part="footer" role="contentinfo">
      <div class="container">
        <div class="top">
          <div class="logo">
            <slot name="logo">
              <a href="https://www.arizona.edu" aria-label="The University of Arizona homepage">${unsafeSVG(uaWordmark)}</a>
            </slot>
          </div>
          <nav class="menu" aria-label="University">
            <ul class="utility">
              ${utilityLinks.map((link) => this.link(link))}
            </ul>
          </nav>
        </div>
        <hr />
        <div class="columns">
          ${this.menu(informationFor)} ${this.menu(topics, "topics")} ${this.menu(resources)} ${this.menu(connect)}
        </div>
        <div class="bottom">
          <hr />
          <p class="acknowledgment">
            We respectfully acknowledge <a href=${landAcknowledgment.href}>${landAcknowledgment.linkText}</a>. Today, Arizona is home
            to 22 federally recognized tribes, with Tucson being home to the O’odham and the Yaqui. The university strives to build
            sustainable relationships with sovereign Native Nations and Indigenous communities through education offerings,
            partnerships, and community service.
          </p>
          <hr />
          <p class="small security"><a href="https://www.arizona.edu/information-security-privacy">University Information Security and Privacy</a></p>
          <p class="small">
            © ${(/* @__PURE__ */ new Date()).getFullYear()} The Arizona Board of Regents on behalf of
            <a href="https://www.arizona.edu">The University of Arizona</a>.
          </p>
        </div>
      </div>
    </footer>`;
	}
};
define("az-footer", AzFooter);
//#endregion
export { AzFooter as t };
