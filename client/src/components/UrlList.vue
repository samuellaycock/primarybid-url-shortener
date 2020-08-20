<template>
    <section>
        <div>
            <h2 data-testid="url-list-heading">URL List</h2>
        </div>
        <error-panel v-if="error" data-testid="url-list-error">
            {{ error }}
        </error-panel>
        <div>
            <ul data-testid="url-list">
                <li v-for="url in urls" :key="url.code" data-testid="url-list-item">
                    <div>
                        <a v-bind:href="url.link" target="_blank">
                            {{ url.link }}
                        </a>
                    </div>
                    <div>
                        <span>
                            {{ url.url }}
                        </span>
                    </div>
                    <div>
                        <button @click="deleteUrl($event, url.code)" data-testid="url-list-item-delete">Delete</button>
                    </div>
                </li>
            </ul>
        </div>
        <div v-if="loading" data-testid="url-list-loading">
            Loading...
        </div>
    </section>
</template>

<script lang="ts">
import Vue from "vue";
import ErrorPanel from "./ErrorPanel.vue";
import events from "../events";

export default Vue.extend({
    name: "UrlList",
    components: {
        ErrorPanel,
    },
    data() {
        return {
            urls: [],
            loading: true,
            error: null,
        };
    },
    created() {
        events.$on("url-created", () => {
            this.getUrls();
        });
    },
    async mounted() {
        this.getUrls();
    },
    methods: {
        async getUrls() {
            this.loading = true;

            const res = await fetch("/api/v1/urls");

            if (res.ok) {
                const { data } = await res.json();

                this.urls = data;
            } else {
                const { error } = await res.json();

                this.error = error;

                setTimeout(() => (this.error = null), 3000);
            }

            this.loading = false;
        },
        async deleteUrl(e: Event, code: string) {
            e.preventDefault();

            const res = await fetch(`/api/v1/urls/${code}`, {
                method: "DELETE",
            });

            if (res.ok) {
                const { data } = await res.json();

                await this.getUrls();
            } else {
                const { error } = await res.json();

                this.error = error;

                setTimeout(() => (this.error = null), 3000);
            }
        },
    },
});
</script>
