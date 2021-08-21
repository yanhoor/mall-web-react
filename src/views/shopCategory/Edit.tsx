import React, { useEffect } from 'react'
import { Form, Input, Button, message } from 'antd'
import $http from "@/http"
import urls from "@/http/urls"
import rules from "@/config/rules"
import CustomUpload from "@/components/customAnt/upload"

interface Props{
    id?: number | string
    onClose: () => void
    visible: boolean
}

export default function ShopCategoryEdit({id, onClose, visible}: Props){
    const [ formRef ] = Form.useForm()
    useEffect(() => {
        initForm()
    }, [visible])

    const initForm = () => {
        if(!id) {
            formRef.setFieldsValue({
                id: '',
                name: '',
                icon: ''
            })
            return
        }

        $http.fetch(urls.shopCategoryDetail, { id }, {method: 'get'}).then( r => {
            if(r.success){
                formRef.setFieldsValue(r.data)
            }else{
                message.error(r.msg)
            }
        })
    }

    const saveForm = () => {
        formRef.validateFields().then(val => {
            $http.fetch(urls.shopCategorySave, { ...val, id }).then( r => {
                if(r.success){
                    onClose()
                    message.success(r.msg)
                }else{
                    message.error(r.msg)
                }
            })
        }).catch(e => {
            console.log('--------------', e)
        })
    }

    return (
        <>
            <Form form={formRef} labelCol={{span: 8}} wrapperCol={{span: 12}}>
                <Form.Item label="分类名称" name="name" rules={[rules.required()]}>
                    <Input />
                </Form.Item>
                <Form.Item label="图标" name="icon" rules={[rules.required()]}>
                    <CustomUpload />
                </Form.Item>
            </Form>
            <Button type="primary" onClick={saveForm}>保存</Button>
        </>
    )
}
