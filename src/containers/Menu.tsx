import { List, ListItemButton, ListItemText } from "@mui/material"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchMenu } from "../api"

interface MenuItem {
    id: string,
    title: string
}

const Menu = () => {
    let [menuItems, setMenuItems] = useState<MenuItem[]>([])

    useEffect(() => {
        fetchMenu().then(response => {
            setMenuItems(response.data.menuItems)
        })
    }, [])

    return (
        <>
            <div>
                <List>
                {
                    menuItems.map((item) => {
                        return (
                            <ListItemButton alignItems="justify-content" key={item.id} component="a" href={`/article/${item.id}`}>
                                <ListItemText primary={item.title} />
                            </ListItemButton>
                        )
                    })
                }
                </List>
            </div>
        </>
    )
}


export default Menu