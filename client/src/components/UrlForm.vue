<template>
    <div class="url-form">
        <div class="sr-only">
            <h2 data-testid="url-form-heading">URL Form</h2>
        </div>
        <div>
            <form class="url-form__form" @submit="submitForm" data-testid="url-form">
                <div class="url-form__form__contents">
                    <input v-model="url" class="url-form__form__input" placeholder="Enter a URL..." required data-testid="url-form-input">
                    <button type="submit" class="url-form__form__submit" v-bind:disabled="submitting" data-testid="url-form-submit">Shorten URL</button>
                </div>
            </form>
        </div>
        <div v-if="error" class="url-form__error" data-testid="url-form-error">
            {{ error }}
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import events from "../events";

export default Vue.extend({
    name: "UrlForm",
    data() {
        return {
            url: "",
            submitting: false,
            error: null,
        };
    },
    methods: {
        async submitForm(e: Event) {
            e.preventDefault();

            this.submitting = true;
            this.error = null;

            try {
                const res = await fetch("/api/v1/urls", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ url: this.url }),
                });

                if (res.ok) {
                    const { data } = await res.json();

                    this.url = "";

                    events.$emit("url-created");
                } else {
                    const { error } = await res.json();

                    throw new Error(error);
                }
            } catch ({ message }) {
                this.error = message;
            }

            this.submitting = false;
        },
    },
});
</script>

<style scoped>
.url-form {
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: var(--grey-light);
    border-radius: 0.5rem;
}

.url-form__form__contents {
    display: flex;
    flex-direction: column;
}

.url-form__form__input,
.url-form__form__submit {
    display: inline-block;
    width: 100%;
}

.url-form__form__input {
    height: 2.25rem;
    padding: 0 0.5rem;
    text-align: center;
    line-height: 2.25rem;
    border: 2px solid transparent;
    border-radius: .313rem .313rem 0 0;
}

.url-form__form__input:focus,
.url-form__form__input:active {
    outline: none;
    border: 2px solid var(--navy);
}

.url-form__form__submit {
    height: 2.25rem;
    padding: 0 0.5rem;
    background-color: var(--navy);
    color: var(--white);
    line-height: 2.25rem;
    border: 2px solid transparent;
    border-radius: 0 0 .313rem .313rem;
}

.url-form__form__submit:hover,
.url-form__form__submit:focus,
.url-form__form__submit:active {
    background-color: var(--navy-dark);
    cursor: pointer;
}

.url-form__form__submit:disabled,
.url-form__form__submit[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}

.url-form__error {
    margin-top: 1rem;
    color: var(--red);
    text-align: center;
}

@media only screen and (min-width: 50rem) {
    .url-form {
        margin-bottom: 2rem;
        padding: 1.5rem;
    }

    .url-form__form__contents {
        flex-direction: row;
    }

    .url-form__form__input,
    .url-form__form__submit {
        padding: 0 1.5rem;
        height: 2.5rem;
        line-height: 2.5rem;
    }

    .url-form__form__input {
        flex: 1;
        text-align: left;
        border-radius: 0.313rem 0 0 0.313rem;
    }

    .url-form__form__submit {
        flex-shrink: 0;
        width: auto;
        border-radius: 0 0.313rem 0.313rem 0;
    }

    .url-form__error {
        text-align: left;
    }
}
</style>
