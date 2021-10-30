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
                {
                    menuItems.map((item) => {
                        return (<Link key={item.id} to={`/article/${item.id}`}>{item.title}</Link>)
                    })
                }
            </div>
        </>
    )
}


export default Menu