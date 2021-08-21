import {Route, useLocation, Redirect, useRouteMatch} from "react-router-dom"
import React, { useState } from 'react'
import jsCookie from "js-cookie"
import {observer} from "mobx-react"
import { message } from 'antd'
import { RouteProps as BaseRouteProps } from 'react-router'
import { UserStore } from '../store'
import ContentLayout from '../views/layout/Layout'
import About from '../views/home/About'
import Login from '../views/login/Login'
import AdminIndex from '../views/admin/Admin'
import AdminList from "@/views/admin/List"
import GoodsLabelList from "@/views/goodsLabel/List"
import ShopList from "@/views/shop/List"
import ShopCategoryList from "@/views/shopCategory/List"
import ShopManagement from "@/views/shop/Management"
import PageNotFound from '../views/PageNotFound'

interface RouteProps extends BaseRouteProps{
    component?: any,
    redirect?: string,
    from?: string,
    roles?: string[],
    children?: RouteProps[]
}

// 路由组件
const RouterView = (route: RouteProps) => {
    console.log('----------------RouterView-----------------', route)
    console.log('----------------useRouteMatch-----------------', useRouteMatch())
    return (
        route.redirect
            ? <Redirect
                exact={route.exact}
                strict={route.strict}
                from={route.from}
                to={route.redirect}/>
            : <Route
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={props => {
                console.log('-------------route.props----------', props)
                // pass the sub-routes down to keep nesting
                return (
                    route.roles
                    ? <AuthRoute routeProps={props} route={route} children={route.children}/>
                    : <route.component {...props} children={route.children} />
                )
            }}
        />
    )
}

// 需要授权路由
const AuthRoute = observer((props: any) => {
    let [ userStore ] = useState(() => UserStore) as any
    const userInfo = userStore.userInfo
    const sid = jsCookie.get('SID')
    const routeRoles = props.route.roles
    let location = useLocation()

    if(!sid){
        message.error('未登录')
        return (<Redirect to={{pathname: '/login'}}/>)
    }else{
        const adminRoles = userInfo.roles
        if(!userInfo.id){
            console.log('权限路由，先获取登录信息', props.route.path)
            userStore.checkAndGetUserInfo()
            return null
        }else if(adminRoles.includes('super') || adminRoles.some((item: string) => routeRoles.includes(item))){
            console.log('权限路由，登录信息已获取', props.route.path)
            return (
                <props.route.component {...props.routeProps} children={props.children}/>
            )
        }else{
            return (
                <PageNotFound path={location.pathname}/>
            )
        }
    }
})

// 没有对应路由
// todo: 不能匹配到不存在的子路由，如 /about 有子路由 /about/about2，但是访问不存在的 /about/about3 时没有进入这里，需要在 /about 里面添加这个 NoMatchRoute 组件
const NoMatchRoute = () => {
    let location = useLocation()

    return (
        <PageNotFound path={location.pathname}/>
    )
}

const allAuth = ['super', 'admin']
const superAuth = ['super']

const routes: RouteProps[] = [
    {
        redirect: '/home/me',
        from: '/',
        exact: true,
    },
    {
        path: '/home',
        component: ContentLayout,
        // exact: true, // 这样不会进入子路由
        // strict: true,
        children: [
            {
                redirect: '/home/me',
                exact: true,
                from: '/home'
            },
            {
                path: '/home/admin',
                component: AdminList,
                roles: superAuth
            },
            {
                path: '/home/about',
                // exact: true,
                component: About,
                roles: superAuth
            },
            {
                path: '/home/shopCategory',
                component: ShopCategoryList,
                roles: allAuth
            },
            {
                path: '/home/shopList',
                component: ShopList,
                roles: superAuth
            },
            {
                path: '/home/shopDetail',
                component: ShopManagement,
                roles: allAuth
            },
            {
                path: '/home/goodsLabel',
                component: GoodsLabelList,
                roles: allAuth
            },
            {
                path: '/home/me',
                // exact: true,
                component: AdminIndex,
                roles: allAuth
            },
        ],
    },
    {
        path: '/login',
        component: Login,
    },
]

// 获取所有路由，含父路由
function RouteTree2List(list: Array<any>) {
    let  result: Array<any> = []
    list.forEach(item => {
        if(item.children){
            result = result.concat(RouteTree2List(item.children))
            result.push(item)
        }else{
            result.push(item)
        }
    })

    return result
}

const routeList = RouteTree2List(routes)

export { routes, RouterView, NoMatchRoute, routeList }
