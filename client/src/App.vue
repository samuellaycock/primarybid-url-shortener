<template>
    <div class="app">
        <div class="app__container">
            <div class="app__heading">
                <h1 class="app__heading__heading">
                    URL Shortener
                </h1>
                <span class="app__heading__subheading">
                    Enter a URL below to get a short link
                </span>
            </div>
            <div>
                <url-form></url-form>
            </div>
            <div>
                <url-list></url-list>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { UrlForm, UrlList } from "./components";

export default Vue.extend({
    name: "App",
    components: { UrlForm, UrlList },
});
</script>

<style>
/* Begin reset */
html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

*, *:before, *:after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
}

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}

article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 16px;
	line-height: 1;
}

ol, ul {
	list-style: none;
}

blockquote, q {
	quotes: none;
}

blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}

table {
	border-collapse: collapse;
	border-spacing: 0;
}
/* End reset */

/* Being utilities */
html,
body {
    --white: #FFFFFF;
    --grey-lightest: #F7FAFC;
    --grey-light: #EDF2F7;
    --grey: #A0AEC0;
    --grey-dark: #718096;
    --black: #1A202C;
    --navy: #2B6CB0;
    --navy-dark: #2C5282;
    --red: #E53E3E;
    --red-dark: #C53030;
}

.sr-only {
    border: 0 !important;
	clip: rect(1px, 1px, 1px, 1px) !important;
	-webkit-clip-path: inset(50%) !important;
		clip-path: inset(50%) !important;
	height: 1px !important;
	margin: -1px !important;
	overflow: hidden !important;
	padding: 0 !important;
	position: absolute !important;
	width: 1px !important;
	white-space: nowrap !important;
}

.sr-only-focusable:focus,
.sr-only-focusable:active {
	clip: auto !important;
	-webkit-clip-path: none !important;
		clip-path: none !important;
	height: auto !important;
	margin: auto !important;
	overflow: visible !important;
	width: auto !important;
	white-space: normal !important;
}
/* End utilities */

.app {
    display: flex;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    padding: 1rem;
    background-color: var(--grey-lightest);
    overflow-y: auto;
}

.app__container {
    width: 100%;
    max-width: 60rem;
}

.app__heading {
    padding: 2rem 0;
    text-align: center;
}

.app__heading__heading {
    margin-bottom: 0.8rem;
    font-size: 1.8rem;
}

.app__heading__subheading {
    font-size: 1rem;
}

@media only screen and (min-width: 50rem) {
    .app__heading__heading {
        margin-bottom: 1rem;
        font-size: 2.4rem;
    }

    .app__heading__subheading {
        font-size: 1.2rem;
    }
}
</style>
