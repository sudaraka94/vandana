import React from "react";
import { Box, IconButton, List, ListItem, ListItemButton, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Link, useLocation } from "react-router";

import { MenuArticle } from "../menu";
import { usePrefs } from "../prefs";
import { SERIF } from "../theme/theme";

interface ArticleListProps {
  articles: MenuArticle[];
  numbered?: boolean;
  currentId?: string;
  // Small tag at the end of each row, e.g. the collection name in search results.
  tagFor?: (article: MenuArticle) => string | undefined;
  highlight?: string;
}

const Highlighted = ({ text, query }: { text: string; query?: string }) => {
  const index = query ? text.toLowerCase().indexOf(query) : -1;
  if (!query || index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <Box component="mark" sx={{ backgroundColor: (t) => t.tokens.accentTint, color: "inherit", borderRadius: 0.5 }}>
        {text.slice(index, index + query.length)}
      </Box>
      {text.slice(index + query.length)}
    </>
  );
};

const ArticleList = ({ articles, numbered, currentId, tagFor, highlight }: ArticleListProps) => {
  const { isFavourite, toggleFavourite } = usePrefs();
  const location = useLocation();

  return (
    <List disablePadding>
      {articles.map((article, index) => {
        const favourite = isFavourite(article.id);
        const tag = tagFor?.(article);
        return (
          <ListItem
            key={article.id}
            disablePadding
            divider
            secondaryAction={
              <IconButton
                edge="end"
                aria-label={favourite ? "ප්‍රියතම වලින් ඉවත් කරන්න" : "ප්‍රියතම වලට එක් කරන්න"}
                aria-pressed={favourite}
                onClick={() => toggleFavourite(article.id)}
                sx={{ color: favourite ? "primary.main" : "text.secondary" }}
              >
                {favourite ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
              </IconButton>
            }
          >
            <ListItemButton
              component={Link}
              to={`/articles/${article.id}`}
              state={{ from: location.pathname }}
              selected={article.id === currentId}
              sx={{
                minHeight: 60,
                gap: 1.5,
                pl: 2,
                pr: 7,
                "&.Mui-selected": { bgcolor: (t) => t.tokens.accentTint },
                "&.Mui-selected:hover": { bgcolor: (t) => t.tokens.accentTint },
              }}
            >
              {numbered && (
                <Typography
                  component="span"
                  sx={{ width: 22, flex: "none", textAlign: "right", color: "primary.main", fontWeight: 600, fontSize: 13, fontFamily: "system-ui, sans-serif" }}
                >
                  {index + 1}
                </Typography>
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontFamily: SERIF, fontWeight: 600, fontSize: 17, lineHeight: 1.35 }}>
                  <Highlighted text={article.title} query={highlight} />
                </Typography>
                {article.note && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5 }}>
                    {article.note}
                  </Typography>
                )}
              </Box>
              {tag && (
                <Typography
                  component="span"
                  sx={{ fontSize: 11, fontWeight: 600, color: "primary.main", bgcolor: (t) => t.tokens.accentTint, borderRadius: 1, px: 1, py: 0.25, flex: "none" }}
                >
                  {tag}
                </Typography>
              )}
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default ArticleList;
