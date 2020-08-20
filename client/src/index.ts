import Vue, { VNode } from "vue";
import App from "./App.vue";

if (process.env.NODE_ENV !== "development") {
    Vue.config.productionTip = false;
}

new Vue({
    el: "#root",
    render(h): VNode {
        return h(App)
    }
});
