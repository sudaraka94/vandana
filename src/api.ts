import axios from "axios";

const baseUrl = "/content"

export const fetchArticleById = async (articleId: string) => {
    try {
        let response = await axios.get(`${baseUrl}/${articleId}.json`);

        return {
            data: response.data,
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: error,
        }
    }
}

export const fetchMenu = async () => {
    try {
        let response = await axios.get(`${baseUrl}/menu.json`);

        return {
            data: response.data,
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: error,
        }
    }
}