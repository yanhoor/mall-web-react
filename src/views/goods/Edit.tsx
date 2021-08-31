import React, {useEffect, useState} from 'react'
import {Button, Card, Form, Input, InputNumber, message, Spin} from 'antd'
import $http from "@/http"
import urls from "@/http/urls"
import rules from "@/config/rules"
import UploadList from "@/components/customAnt/uploadList"
import GoodsLabelSelect from './components/_goodsLabelSelect'
import GoodsCategoryCascader from './components/_goodsCategoryCascader'
import {inject, observer} from "mobx-react"
import styles from "@/views/goods/goods.module.less"
import PageState from "@/config/pageState"

interface Item {
    id: number | string,
    name: string,
    category_ids: number[] | string[],
    label_ids: number[] | string[],
    desc: string,
    pic_list: [],
    sku_list: SkuItem[],
}

interface SkuItem{
    price: number | string,
    pack_fee: number | string,
    name: string,
}

interface Props{
    id?: number | string
    onClose: () => void
    visible: boolean
    UserStore?: any
}

function GoodsEdit({id, onClose, UserStore}: Props){
    const [ formRef ] = Form.useForm()
    const [pageState, setPageState] = useState<PageState>(PageState.completed)

    useEffect(() => {
        initForm()
    }, [id])

    const createSkuItem = (): SkuItem => {
        return {
            price: '',
            pack_fee: '',
            name: '',
        }
    }

    const initForm = () => {
        if(!id) {
            let form: Item = {
                id: '',
                name: '',
                category_ids: [],
                label_ids: [],
                desc: '',
                sku_list: [],
                pic_list: [],
            }
            form.sku_list = [createSkuItem()]
            formRef.setFieldsValue(form)
            return
        }

        setPageState(PageState.loading)
        $http.fetch(urls.goodsDetail, { id }, {method: 'get'}).then( r => {
            if(r.success){
                formRef.setFieldsValue(r.info)
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
            $http.fetch(urls.goodsSave, { ...val, id }).then( r => {
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
                <Form form={formRef} name="baseForm" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                    <Form.Item label="商品名称" name="name" rules={[rules.required()]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="商品描述" name="desc">
                        <Input />
                    </Form.Item>
                    <Form.Item label="商品标签" name="label_ids" rules={[rules.required()]}>
                        <GoodsLabelSelect />
                    </Form.Item>
                    <Form.Item label="所属分类" name="category_ids" rules={[rules.required()]}>
                        <GoodsCategoryCascader UserStore={UserStore}/>
                    </Form.Item>
                    <Form.Item label="商品图片" name="pic_list" rules={[rules.required()]}>
                        <UploadList/>
                    </Form.Item>
                    <Form.List name="sku_list">
                        {(fields, { add, remove }) => (
                            <>
                                <h4>Sku列表 <Button onClick={() => add()} type="text" style={{color: '#4098ef'}}>添加</Button></h4>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <div key={key} className={styles.sku_item_wrapper}>
                                        <Card>
                                            <Form.Item {...restField} fieldKey={[fieldKey, 'name']} label="名称" name={[name, 'name']} rules={[rules.required()]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item {...restField} fieldKey={[fieldKey, 'price']} label="价格" name={[name, 'price']} rules={[rules.required()]}>
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item {...restField} fieldKey={[fieldKey, 'pack_fee']} label="包装费" name={[name, 'pack_fee']} rules={[rules.required()]}>
                                                <InputNumber />
                                            </Form.Item>
                                        </Card>
                                    </div>
                                ))}
                            </>
                        )}
                    </Form.List>
                </Form>
            </Spin>
            <Button type="primary" onClick={saveForm}>保存</Button>
        </>
    )
}

export default inject('UserStore')(observer(GoodsEdit))
