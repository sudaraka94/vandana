import { Breadcrumbs, Typography, Link } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

interface BCProps {
    links?: { to: string, text: string, icon?: JSX.Element }[]
    title: string
    titleIcon?: JSX.Element
}

const BreadcrumbNav = (props: BCProps) => {
    return (
        <Breadcrumbs sx={{ margin: "9px 12px 0px" }} aria-label="breadcrumb">
            {
                props.links?.map(link => (
                    <Link underline="hover" color="inherit" component={RouterLink} to={link.to} key={link.to}>
                        {link.icon}
                        {link.text}
                    </Link>
                ))
            }

            <Typography color="text.primary">{props.titleIcon}{props.title}</Typography>
        </Breadcrumbs>
    );
}

export default BreadcrumbNav;