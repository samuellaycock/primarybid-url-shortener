<template>
    <div>
        <div>
            <h1>URL Shortener</h1>
        </div>
        <div>
            <url-form></url-form>
        </div>
        <div>
            <url-list></url-list>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { UrlForm, UrlList } from "./components";

export default Vue.extend({ name: "App", components: { UrlForm, UrlList } });
</script>

<style>
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
</style>
