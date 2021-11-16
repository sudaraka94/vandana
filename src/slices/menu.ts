import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Article from "../containers/Article";
import { RootState } from "../store";

export interface Collection {
    id: string
    title: string
    articles: string[]
}

export interface MenuState {
    isMenuLoading: boolean
    articles: {[id: string]: Article}
    collections: {[id: string]: Collection}
}

const initialState: MenuState = {
    isMenuLoading: true,
    articles: {},
    collections: {}
}

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        updateMenu: (state, action: PayloadAction<MenuState>) => {
            state.articles = action.payload.articles
            state.collections = action.payload.collections
            state.isMenuLoading = state.isMenuLoading
        },
    },
});

// Other code such as selectors can use the imported `RootState` type
export const selectArticles = (state: RootState) => state.menu.articles
export const selectIsMenuLoading = (state: RootState) => state.menu.isMenuLoading
export const selectCollections = (state: RootState) => state.menu.collections

export const { updateMenu } = menuSlice.actions;

export default menuSlice.reducer
