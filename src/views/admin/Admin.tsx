import React from 'react'
import { observer, inject } from 'mobx-react'
import { Descriptions } from 'antd'

interface Props{
    UserStore: {
        userInfo: any
    }
}

function AdminIndex({UserStore}: Props){
    const { userInfo } = UserStore
    return (
        <Descriptions title="个人信息" bordered>
            <Descriptions.Item label="用户名">{ userInfo.name }</Descriptions.Item>
            <Descriptions.Item label="手机号">{ userInfo.mobile }</Descriptions.Item>
            <Descriptions.Item label="密码">{ userInfo.password }</Descriptions.Item>
            <Descriptions.Item label="注册时间">{ userInfo.create_time }</Descriptions.Item>
            <Descriptions.Item label="最后修改时间">{ userInfo.modify_time }</Descriptions.Item>
            <Descriptions.Item label="头像">{ userInfo.name }</Descriptions.Item>
        </Descriptions>
    )
}

export default inject('UserStore')(observer(AdminIndex))
