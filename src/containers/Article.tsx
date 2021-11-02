import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { Box } from "@mui/system";
import { Backdrop, CircularProgress, Fab, Typography, Zoom } from "@mui/material";
import { Add, ArrowBack, Close, ZoomIn, ZoomOut } from "@mui/icons-material";

import { fetchArticleById } from "../api";

// used as the structure for the article
interface Article {
    title: string;
    content: string;
}

const Article = () => {
    const { articleId } = useParams<{ articleId: string }>();
    const [article, setArticle] = useState<Article>();
    const [fontSize, setFontSize] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showBtns, setShowBtns] = useState<boolean>(false);

    useEffect(() => {
        fetchArticleById(articleId).then((response) => {
            setArticle(response.data);
        })
            .finally(() => {
                setIsLoading(false);
            })
    }, []);

    const zoomIn = () => {
        if (fontSize < 16) {
            setFontSize(fontSize * 1.1);
        }
    }

    const zoomOut = () => {
        if (fontSize > 1) {
            setFontSize(fontSize * 0.9);
        }
    }

    const toggleShowBtns = () => {
        setShowBtns(!showBtns);
    }

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box display="flex" flexDirection="column" alignItems="center" padding={4}>
                <Box width={"100%"} maxWidth={800}>
                    <Typography variant="h4" align="center">
                        {article?.title}
                    </Typography>
                    <div dangerouslySetInnerHTML={{ __html: article?.content || "" }} style={{ fontSize: `${fontSize}em` }}>
                    </div>
                </Box>
                <Box position="fixed" bottom={16} right={16}>
                    <Zoom in={true}>
                        <Fab color="primary" aria-label="back" onClick={() => { toggleShowBtns() }}>
                            {
                                showBtns ?
                                    <Close />
                                    :
                                    <Add />
                            }

                        </Fab>
                    </Zoom>
                </Box>
                {
                    showBtns ?
                        (
                            <>
                                <Box position="fixed" bottom={90} right={16}>
                                    <Zoom in={true}>
                                        <Fab color="primary" aria-label="back" href="/">
                                            <ArrowBack />
                                        </Fab>
                                    </Zoom>
                                </Box>
                                <Box position="fixed" bottom={164} right={16}>
                                    <Zoom in={true}>
                                        <Fab color="primary" aria-label="back" onClick={event => { zoomOut() }}>
                                            <ZoomOut />
                                        </Fab>
                                    </Zoom>
                                </Box>
                                <Box position="fixed" bottom={238} right={16}>
                                    <Zoom in={true}>
                                        <Fab color="primary" aria-label="back" onClick={event => { zoomIn() }}>
                                            <ZoomIn />
                                        </Fab>
                                    </Zoom>
                                </Box>
                            </>
                        )
                        :
                        ""
                }
            </Box>
        </>
    );
};

export default Article;
