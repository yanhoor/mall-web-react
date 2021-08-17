import { Menu } from 'antd'
import menus from './menus'
import React from 'react'
import {useHistory, useLocation} from "react-router-dom"

const { SubMenu } = Menu

export default function LayoutMenu() {

    let history = useHistory()
    let location = useLocation()

    function getMenuItem(children: Array<any>): React.ReactNode {

        let onClickMenuItem = (path: string) => {
            if(location.pathname !== path){
                history.push(path)
            }
        }

        return children.map(item => {
            if(item.children){
                return (
                    <SubMenu key={item.key} title={item.title} icon={<item.icon/>}>
                        {getMenuItem(item.children)}
                    </SubMenu>
                )
            }else{
                return (
                    <Menu.Item key={item.key} icon={<item.icon/>} onClick={() => onClickMenuItem(item.path)}> {item.title} </Menu.Item>
                )
            }
        })
    }

    return (
        <Menu mode="inline" theme="dark">
            {getMenuItem(menus)}
        </Menu>
    )
}
