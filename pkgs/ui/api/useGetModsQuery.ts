import { useFetch } from "./useFetch.js";
import { useAppStore } from "../stores/app.js";
import { SuccessResponse } from "../../manager/app/types/response.js";
import { ModItemList } from "../../server/features/mods/types";

const store = useAppStore();

type ModListResponse = SuccessResponse<{ mods: ModItemList }>;
export const useGetAllModsQuery = () => {
  const query = useFetch<ModListResponse>("/api/mods/", {
    async afterFetch({ data }: { data: ModListResponse }) {
      store.mods = data.data.mods;
      return { data };
    },
  });
  return query;
};
