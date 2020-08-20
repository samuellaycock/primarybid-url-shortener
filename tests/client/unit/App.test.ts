import { shallowMount } from "@vue/test-utils";
import App from "../../../client/src/App.vue";

describe("App", () => {
    test("it renders the heading correctly", () => {
        const wrapper = shallowMount(App);

        const heading = wrapper.find("h1");

        expect(heading.exists()).toBe(true);
        expect(heading.text()).toBe("URL Shortener");
    });
});
