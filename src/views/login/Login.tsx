import { Form, Button, Input, Radio } from 'antd'
import React, { useState, useEffect } from 'react'
import rules from '../../config/rules'
import { UserOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons'
import './Login.css'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
}

export default function Login() {
    const [ formRef ] = Form.useForm()
    const [isRegister, setIsRegister] = useState(false)
    const options = [
        {label: '超级管理员', value: 1},
        {label: '店铺管理员', value: 2},
    ]

    const resetForm = () => {
        formRef.setFieldsValue({
            id: '',
            name: '',
            mobile: '',
            password: '',
            type: 1,
        })
    }

    const validateForm = () => {
        formRef.validateFields().then(r => {
            console.log('------r--------', r)
        }).catch(e => {
            console.log('--------------', e)
        })
    }

    return (
        <div className="login_page">
            <div className="container">
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
                {isRegister ? (<Button type="primary" onClick={validateForm}>注册</Button> ): (<Button type="primary" onClick={validateForm}>登录</Button>)}

                {
                    isRegister ? (<Button type="link" onClick={() => setIsRegister(false)}>已有账号？去登录</Button>) : (<Button type="link" onClick={() => setIsRegister(true)}>没有账号？去注册</Button>)
                }
            </div>
        </div>
    )
}
