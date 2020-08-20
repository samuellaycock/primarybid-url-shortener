import Vue, { VNode } from "vue";
import App from "./App.vue";

new Vue({
    el: "#root",
    render(h): VNode {
        return h(App)
    }
});
