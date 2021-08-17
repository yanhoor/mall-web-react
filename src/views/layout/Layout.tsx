import { Layout, Card } from 'antd'
import { RouterView } from "../../router"
import { Switch } from "react-router-dom"
import React from "react"
import './layout.css'
import LayoutMenu from './_menu'

const { Header, Sider, Content } = Layout

interface Props{
    children: Array<any>
}
export default function ContentLayout({ children }: Props) {
    return (
        <Layout>
            <Sider className="layout_left" collapsible>
                <LayoutMenu/>
            </Sider>
            <Layout className="layout_right">
                <Header className="layout_header">

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
