import {Switch, Route, HashRouter as Router} from 'react-router-dom'
import {NoMatchRoute, RouterView, routes} from "../../router";
import React from "react"
import $http from '../../http'
import styles from './home.module.less'

interface Props{
    children: Array<any>
}

export default function Home({ children }: Props) {
    const onClick = () => {
        $http.fetch('/shop/category_list', {}, { method: 'get' }).then( r => {
            console.log(r)
        })
    }
    return (
        <>
            <h1 onClick={onClick}>Home</h1>
            <div className={styles.div1} />
            <div className={styles.div2} />
        </>
    )
}
