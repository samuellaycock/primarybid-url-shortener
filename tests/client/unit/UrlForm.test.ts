import { shallowMount } from "@vue/test-utils";
import * as casual from "casual";
import { FetchMock, APIMock } from "../mocks";
import UrlForm from "../../../client/src/components/UrlForm.vue";
import events from "../../../client/src/events";

describe("UrlForm", () => {
    test("it renders the default state correctly", () => {
        const wrapper = shallowMount(UrlForm);

        const heading = wrapper.find("[data-testid=url-form-heading]");
        const form = wrapper.find("[data-testid=url-form]");
        const input = wrapper.find("[data-testid=url-form-input]");
        const button = wrapper.find("[data-testid=url-form-submit]")

        expect(heading.exists()).toBe(true);
        expect(heading.text()).toBe("URL Form");
        expect(form.exists()).toBe(true);
        expect(input.exists()).toBe(true);
        expect((input.element as HTMLInputElement).value).toBe("");
        expect(button.exists()).toBe(true);
    });

    test("it makes an API request when submitted with a valid URL input", async () => {
        const api = new APIMock(0);
        const fetchMock = new FetchMock(api);

        global.fetch = jest.fn().mockImplementation(fetchMock.fetch);

        const wrapper = shallowMount(UrlForm);
        const form = wrapper.find("[data-testid=url-form]");
        const input = wrapper.find("[data-testid=url-form-input]");

        await input.setValue(casual.url);
        await form.trigger("submit");

        const { urls } = api.getSnapshot();

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(urls.length).toBe(1);

        (global.fetch as jest.Mock).mockClear();

        delete global.fetch;
    });

    test("it resets the form after a successful submission", async (done) => {
        const api = new APIMock(0);
        const fetchMock = new FetchMock(api);

        global.fetch = jest.fn().mockImplementation(fetchMock.fetch);

        const wrapper = shallowMount(UrlForm);
        const form = wrapper.find("[data-testid=url-form]");
        const input = wrapper.find("[data-testid=url-form-input]");

        await input.setValue(casual.url);
        await form.trigger("submit");

        process.nextTick(() => {
            expect((input.element as HTMLInputElement).value).toBe("");

            (global.fetch as jest.Mock).mockClear();

            delete global.fetch;

            done();
        });
    });

    test("it displays an error message when submitted with an invalid URL input", async (done) => {
        const api = new APIMock(0);
        const fetchMock = new FetchMock(api);

        global.fetch = jest.fn().mockImplementation(fetchMock.fetch);

        const wrapper = shallowMount(UrlForm);
        const form = wrapper.find("[data-testid=url-form]");
        const input = wrapper.find("[data-testid=url-form-input]");

        await input.setValue("invalid_url");
        await form.trigger("submit");

        process.nextTick(() => {
            const error = wrapper.find("[data-testid=url-form-error]");

            expect(error.exists()).toBe(true);

            (global.fetch as jest.Mock).mockClear();

            delete global.fetch;

            done();
        });
    });
});
