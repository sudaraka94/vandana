import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchArticleById } from "../api";

// used as the structure for the article
interface Article {
    title: string,
    content: string
}


const Article = () => {
    let { articleId } = useParams<{articleId:string}>();
    let [article, setArticle] = useState<Article>();

    useEffect(() => {
        fetchArticleById(articleId).then(response => {
            setArticle(response.data)
        });
    }, [])

    return (
        <>
            <Link to="/">Home</Link>
            <p>{article?.title}</p>
            {article?.content}
        </>
    )
}

export default Article