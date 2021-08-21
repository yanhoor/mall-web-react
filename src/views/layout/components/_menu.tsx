import { Menu } from 'antd'
import menus from '../menus'
import React from 'react'
import { inject, observer } from "mobx-react"
import {useHistory, useLocation} from "react-router-dom"
import { routeList } from '@/router'

const { SubMenu } = Menu

function LayoutMenu({ UserStore }: any) {
    let history = useHistory()
    let location = useLocation()
    const userRoles = UserStore.userInfo.roles

    const accessRoutes = routeList.filter((route) => {
        return route.roles && route.roles.some( (r: any) => userRoles.includes(r) )
    }).map( r => r.path)

    const filterMenus = (menus: Array<any>) => {
        let result: any[] = []
        menus.forEach(item => {
            const temp = { ...item }
            if(item.children){
                let children = filterMenus(item.children)
                temp.children = children
            }
            if(accessRoutes.includes(temp.path) || (temp.children && temp.children.length)) result.push(temp)
        })
        return result
    }

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
            {getMenuItem(filterMenus(menus))}
        </Menu>
    )
}

export default inject('UserStore')(observer(LayoutMenu))
