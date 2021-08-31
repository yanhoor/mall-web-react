import React, {useEffect, useState} from 'react'
import {Button, Form, Input, message, Spin} from 'antd'
import $http from "@/http"
import urls from "@/http/urls"
import rules from "@/config/rules"
import CustomUpload from "@/components/customAnt/upload"
import PageState from "@/config/pageState"

interface Props{
    id?: number | string
    onClose: () => void
    visible: boolean
}

export default function ShopCategoryEdit({id, onClose, visible}: Props){
    const [ formRef ] = Form.useForm()
    const [pageState, setPageState] = useState<PageState>(PageState.completed)

    useEffect(() => {
        initForm()
    }, [id])

    const initForm = () => {
        if(!id) {
            formRef.setFieldsValue({
                id: '',
                name: '',
                icon: ''
            })
            return
        }

        setPageState(PageState.loading)
        $http.fetch(urls.shopCategoryDetail, { id }, {method: 'get'}).then( r => {
            if(r.success){
                formRef.setFieldsValue(r.data)
                setPageState(PageState.completed)
            }else{
                setPageState(PageState.error)
                message.error(r.msg)
            }
        }).catch(e => {
            setPageState(PageState.error)
            message.error('获取信息出错')
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
            <Spin spinning={pageState === PageState.loading}>
                <Form form={formRef} labelCol={{span: 8}} wrapperCol={{span: 12}}>
                    <Form.Item label="分类名称" name="name" rules={[rules.required()]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="图标" name="icon" rules={[rules.required()]}>
                        <CustomUpload />
                    </Form.Item>
                </Form>
            </Spin>
            <Button type="primary" onClick={saveForm}>保存</Button>
        </>
    )
}
