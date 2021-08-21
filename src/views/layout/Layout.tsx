import { Layout, Card } from 'antd'
import { RouterView } from "../../router"
import { Switch } from "react-router-dom"
import React from "react"
import styles from './layout.module.less'
import LayoutMenu from './components/_menu'
import LayoutHeader from "./components/_header"

const { Header, Sider, Content } = Layout

interface Props{
    children: Array<any>
}
export default function ContentLayout({ children }: Props) {
    return (
        <Layout>
            <Sider className={styles.layout_left} collapsible>
                <LayoutMenu/>
            </Sider>
            <Layout className={styles.layout_right} id="layoutRight">
                <Header className={styles.layout_header}>
                    <LayoutHeader/>
                </Header>
                <Content>
                    <Card className="page_container">
                        <Switch>
                            {children.map((route, i) => {
                                return (
                                    <RouterView key={i} {...route}/>
                                )
                            })}

                        </Switch>
                    </Card>
                </Content>
            </Layout>
        </Layout>
    )
}
