import { Form, Button, Input, Radio, message } from 'antd'
import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import rules from '../../config/rules'
import { UserOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons'
import styles from './Login.module.css'
import $http from '../../http'
import urls from '../../http/urls'
import jsCookie from "js-cookie"

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
}

export default function Login() {
    const [ formRef ] = Form.useForm()
    const history = useHistory()
    const [isRegister, setIsRegister] = useState(false)
    const options = [
        {label: '超级管理员', value: 1},
        {label: '店铺管理员', value: 2},
    ]

    jsCookie.remove('SID') // 清空登录信息

    const validateForm = (type: number) => {
        formRef.validateFields().then(val => {
            if(type === 2){
                handleLogin(val)
            }else{
                handleRegister(val)
            }
        }).catch(e => {
            console.log('--------------', e)
        })
    }

    const handleLogin = (data: any) => {
        $http.fetch(urls.adminLogin, data).then( r => {
            if(r.success){
                message.success(r.msg)
                history.replace('/home')
            }else{
                message.error(r.msg)
            }
        })
    }

    const handleRegister = (data: any) => {
        $http.fetch(urls.adminRegister, data).then( r => {
            if(r.success){
                message.success(r.msg)
            }else{
                message.error(r.msg)
            }
        })
    }

    return (
        <div className={styles.login_page}>
            <div className={styles.container}>
                <Form {...layout} form={formRef}>
                    {
                        isRegister ? (<Form.Item label="用户名" name="name" rules={[rules.required()]}>
                            <Input prefix={<UserOutlined/>}/>
                        </Form.Item>) : null
                    }
                    <Form.Item label="手机号" name="mobile" rules={[rules.required(), rules.mobile()]}>
                        <Input prefix={<PhoneOutlined/>}/>
                    </Form.Item>
                    <Form.Item label="密码" name="password" rules={[rules.required()]}>
                        <Input type="password" prefix={<LockOutlined/>}/>
                    </Form.Item>
                    {
                        isRegister ? (<Form.Item label="账户类型" name="type" rules={[rules.required()]}>
                            <Radio.Group options={options} optionType="button" buttonStyle="solid"/>
                        </Form.Item>) : null
                    }
                </Form>
                <div className={styles.actions}>
                    {isRegister ? (<Button type="primary" onClick={() => validateForm(1)}>注册</Button> ): (<Button type="primary" onClick={() => validateForm(2)}>登录</Button>)}

                    {
                        isRegister ? (<Button type="link" onClick={() => setIsRegister(false)}>已有账号？去登录</Button>) : (<Button type="link" onClick={() => setIsRegister(true)}>没有账号？去注册</Button>)
                    }
                </div>
            </div>
        </div>
    )
}
