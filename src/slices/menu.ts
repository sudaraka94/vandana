import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface MenuArticle {
    id: string
    title: string
    keywords?: string[]
    collections?: string[]
    // Optional, from content frontmatter: a one-line note and recitation order.
    note?: string
    order?: number
    // English name and one-line English summary, for search engines.
    english?: string
    about?: string
    description?: string
}

export interface Collection {
    id: string
    title: string
    articles: string[]
}

export interface MenuState {
    isMenuLoading: boolean
    hasMenuError: boolean
    articles: { [id: string]: MenuArticle }
    collections: { [id: string]: Collection }
}

const initialState: MenuState = {
    isMenuLoading: true,
    hasMenuError: false,
    articles: {},
    collections: {}
}

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        menuLoading: (state) => {
            state.isMenuLoading = true
            state.hasMenuError = false
        },
        updateMenu: (state, action: PayloadAction<Pick<MenuState, 'articles' | 'collections'>>) => {
            state.articles = action.payload.articles
            state.collections = action.payload.collections
            state.isMenuLoading = false
            state.hasMenuError = false
        },
        menuFailed: (state) => {
            state.isMenuLoading = false
            state.hasMenuError = true
        },
    },
});

export const selectArticles = (collectionId: string) => (state: RootState) => {
    const articles: { [id: string]: MenuArticle } = {}
    state.menu.collections[collectionId]?.articles.forEach((key) => {
        if (state.menu.articles[key]) {
            articles[key] = state.menu.articles[key];
        }
    })

    return articles;
}

export const selectIsMenuLoading = (state: RootState) => state.menu.isMenuLoading
export const selectHasMenuError = (state: RootState) => state.menu.hasMenuError
export const selectCollections = (state: RootState) => state.menu.collections
export const selectAllArticles = (state: RootState) => state.menu.articles

export const { menuLoading, updateMenu, menuFailed } = menuSlice.actions;

export default menuSlice.reducer
