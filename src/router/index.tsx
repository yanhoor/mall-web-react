import {Route, useLocation, Redirect, useRouteMatch} from "react-router-dom"
import React from 'react'
import { RouteProps as BaseRouteProps } from 'react-router'
import ContentLayout from '../views/layout/Layout'
import About from '../views/home/About'
import Login from '../views/login/Login'
import PageNotFound from '../views/PageNotFound'

interface RouteProps extends BaseRouteProps{
    component?: any,
    redirect?: string,
    from?: string,
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
                return (<route.component {...props} children={route.children} />)
            }}
        />
    )
}

// 没有对应路由
// todo: 不能匹配到不存在的子路由，如 /about 有子路由 /about/about2，但是访问不存在的 /about/about3 时没有进入这里，需要在 /about 里面添加这个 NoMatchRoute 组件
const NoMatchRoute = () => {
    let location = useLocation();

    return (
        <PageNotFound path={location.pathname}/>
    )
}

const routes: RouteProps[] = [
    {
        redirect: '/home/about',
        from: '/',
        exact: true,
    },
    {
        path: '/home',
        component: ContentLayout,
        // exact: true,
        // strict: true,
        children: [
            {
                redirect: '/home/about',
                exact: true,
                from: '/home'
            },
            {
                path: '/home/about',
                // exact: true,
                component: About,
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
