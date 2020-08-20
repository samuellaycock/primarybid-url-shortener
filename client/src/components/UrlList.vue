<template>
    <section class="url-list">
        <div class="sr-only">
            <h2 data-testid="url-list-heading">URL List</h2>
        </div>
        <div v-if="error" class="url-list__error" data-testid="url-list-error">
            {{ error }}
        </div>
        <div>
            <ul class="url-list__list" data-testid="url-list">
                <li v-for="url in urls" :key="url.code" class="url-list__list__item" data-testid="url-list-item">
                    <div class="url-list__list__item__content">
                        <a :href="url.link" target="_blank">
                            <div class="url-list__list__item__content__url">
                                <span data-testid="url-list-item-url">
                                    {{ url.url }}
                                </span>
                            </div>
                            <div class="url-list__list__item__content__link">
                                <span data-testid="url-list-item-link">
                                    {{ url.link }}
                                </span>
                            </div>
                        </a>
                    </div>
                    <div class="url-list__list__item__actions">
                        <div class="url-list__list__item__actions--copy">
                            <button @click="copyUrl($event, url.link)" data-testid="url-list-item-copy">
                                Copy
                            </button>
                        </div>
                        <div class="url-list__list__item__actions--delete">
                            <button @click="deleteUrl($event, url.code)" data-testid="url-list-item-delete">
                                Delete
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-if="!loading && urls.length === 0" class="url-list__message">
                Add a URL to get started
            </div>
            <div v-if="loading" class="url-list__loading" data-testid="url-list-loading">
                Loading...
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import Vue from "vue";
import events from "../events";

export default Vue.extend({
    name: "UrlList",
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
        copyUrl(e: Event, link: string) {
            navigator.clipboard.writeText(link);
        },
    },
});
</script>

<style scoped>
.url-list {
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: var(--grey-light);
    border-radius: 0.5rem;
}

.url-list__list__item {
    display: flex;
    margin-bottom: 1rem;
    background-color: var(--white);
    border-radius: 0.25rem;
    overflow: hidden
}

.url-list__list__item:last-child {
    margin-bottom: 0;
}

.url-list__list__item__content {
    flex: 1;
    overflow: hidden;
}

.url-list__list__item__content a {
    display: block;
    padding: .75rem;
    color: var(--black);
    text-decoration: none;
    border: 2px solid transparent;
    border-radius: 0.25rem 0 0 0.25rem;
}

.url-list__list__item__content a:hover {
    border: 2px solid var(--navy);
}

.url-list__list__item__content__url,
.url-list__list__item__content__link {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.url-list__list__item__content__url {
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
}

.url-list__list__item__content__link {
    font-size: 0.8rem;
}

.url-list__list__item__actions {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.url-list__list__item__actions--copy,
.url-list__list__item__actions--delete {
    flex: 1;
}

.url-list__list__item__actions--copy button,
.url-list__list__item__actions--delete button {
    height: 100%;
    width: 100%;
    padding: 0 0.5rem;
    appearance: none;
    -webkit-appearance: none;
    border: none;
}

.url-list__list__item__actions--copy button {
    color: var(--white);
    background-color: var(--grey);
}

.url-list__list__item__actions--delete button {
    color: var(--white);
    background-color: var(--red);
}

.url-list__list__item__actions--copy button:hover,
.url-list__list__item__actions--delete button:hover {
    cursor: pointer;
}

.url-list__list__item__actions--copy button:hover {
    background-color: var(--grey-dark);
}

.url-list__list__item__actions--delete button:hover {
    background-color: var(--red-dark);
}

.url-list__loading,
.url-list__message {
    color: var(--grey-dark);
    text-align: center;
}

@media only screen and (min-width: 50rem) {
    .url-list {
        margin-bottom: 2rem;
        padding: 1.5rem;
    }

    .url-list__list__item__content__url {
        margin-bottom: 0.75rem;
        font-size: 1.25rem;
    }

    .url-list__list__item__content__link {
        font-size: 1rem;
    }

    .url-list__list__item__actions--copy button,
    .url-list__list__item__actions--delete button {
        padding: 0 1rem;
    }
}
</style>