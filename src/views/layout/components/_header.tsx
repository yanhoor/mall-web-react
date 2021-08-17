import React, {useState} from 'react'
import { Dropdown, Avatar, Menu, Modal, message } from 'antd'
import { LogoutOutlined, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import urls from "../../../http/urls"
import {observer} from "mobx-react"
import { UserStore } from '../../../store'
import {useHistory, useLocation} from "react-router-dom"
import $http from "../../../http"

const LayoutHeader = observer(() => {
    let [ userStore ] = useState(() => UserStore) as any
    const path = urls.IMG_HOST + userStore.userInfo.avatar
    const history = useHistory()
    const location = useLocation()

    const handleClickMenu = (index: number) => {
        switch (index){
            case 1:
                if(location.pathname !== '/home/me'){
                    history.push('/home/me')
                }
                break
            case 2:
                Modal.confirm({
                    title: '确认退出？',
                    icon: <ExclamationCircleOutlined />,
                    onOk(){
                        $http.fetch(urls.adminLogout).then(r => {
                            if(r.success){
                                history.push('/login')
                            }
                            message.success(r.msg)
                        })
                    },
                })
                break
        }
    }

    const DropMenu = (
        <Menu>
            <Menu.Item key="1" icon={<UserOutlined/>} onClick={() => handleClickMenu(1)}>
                个人信息
            </Menu.Item>
            <Menu.Item key="2" icon={<LogoutOutlined/>} onClick={() => handleClickMenu(2)}>
                退出登录
            </Menu.Item>
        </Menu>
    )

    return (
        <>
            <div></div>
            <Dropdown overlay={DropMenu}>
                <Avatar src={path}/>
            </Dropdown>
        </>
    )
})

export default LayoutHeader
