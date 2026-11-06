import { fetchMenu } from "./api";
import { menuFailed, menuLoading, updateMenu } from "./slices/menu";
import { AppDispatch } from "./store";

export const loadMenu = async (dispatch: AppDispatch) => {
    dispatch(menuLoading());
    const response = await fetchMenu();
    const data = response.data;
    if (!data || typeof data !== "object" || !data.articles || !data.collections) {
        dispatch(menuFailed());
        return;
    }
    dispatch(updateMenu({ articles: data.articles, collections: data.collections }));
};
