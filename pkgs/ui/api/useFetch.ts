import { createFetch } from "@vueuse/core";

export const useFetch = createFetch({
  fetchOptions: {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
});
