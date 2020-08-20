import { shallowMount } from "@vue/test-utils";
import { FetchMock, APIMock } from "../mocks";
import UrlList from "../../../client/src/components/UrlList.vue";

describe("UrlList", () => {
    test("it renders the loading state correctly", (done) => {
        const api = new APIMock(0);
        const fetchMock = new FetchMock(api);

        global.fetch = jest.fn().mockImplementation(fetchMock.fetch);

        const wrapper = shallowMount(UrlList);
        const loading = wrapper.find("[data-testid=url-list-loading]");

        expect(loading.exists()).toBe(true);

        process.nextTick(() => {
            expect(global.fetch as jest.Mock).toBeCalledTimes(1);

            (global.fetch as jest.Mock).mockClear();

            delete global.fetch;

            done();
        });
    });

    test("it renders the URL list correctly", (done) => {
        const api = new APIMock(5);
        const fetchMock = new FetchMock(api);

        global.fetch = jest.fn().mockImplementation(fetchMock.fetch);

        const wrapper = shallowMount(UrlList);

        process.nextTick(() => {
            const loading = wrapper.find("[data-testid=url-list-loading]");
            const listItems = wrapper.findAll("[data-testid=url-list-item]");
            const { urls } = api.getSnapshot();

            expect(global.fetch as jest.Mock).toBeCalledTimes(1);
            expect(loading.exists()).toBe(false);
            expect(listItems.length).toBe(urls.length);
            expect(listItems.at(0).find("[data-testid=url-list-item-url]").text()).toBe(urls[0].url);
            expect(listItems.at(0).find("[data-testid=url-list-item-link]").text()).toBe(urls[0].link);

            (global.fetch as jest.Mock).mockClear();

            delete global.fetch;

            done();
        });
    });

    test("it removes deleted URLs from the URL list correctly", (done) => {
        const api = new APIMock(5);
        const fetchMock = new FetchMock(api);

        global.fetch = jest.fn().mockImplementation(fetchMock.fetch);

        const wrapper = shallowMount(UrlList);

        process.nextTick(() => {
            const listItems = wrapper.findAll("[data-testid=url-list-item]");
            const toDelete = listItems.at(0);

            toDelete.find("[data-testid=url-list-item-delete]")
                .trigger("click");

            // Timeout here because there are two more API calls to be made...
            setTimeout(() => {
                const listItems = wrapper.findAll("[data-testid=url-list-item]");

                expect(global.fetch as jest.Mock).toBeCalledTimes(3);
                expect(listItems.at(0).find("[data-testid=url-list-item-link]").text())
                    .not.toBe(toDelete.find("[data-testid=url-list-item-link]").text());

                (global.fetch as jest.Mock).mockClear();

                delete global.fetch;

                done();
            }, 100);
        });
    });
});
