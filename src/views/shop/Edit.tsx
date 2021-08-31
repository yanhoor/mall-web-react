import React, {useEffect, useState} from 'react'
import {Button, Form, Input, InputNumber, message, Spin, TimePicker} from 'antd'
import $http from "@/http"
import urls from "@/http/urls"
import rules from "@/config/rules"
import CustomUpload from "@/components/customAnt/upload"
import styles from './shop.module.less'
import AddressPicker from "@/components/customAnt/addressPicker"
import ShopCategorySelect from "@/components/business/shopCategorySelect"
import {inject, observer} from "mobx-react"
import moment from "moment"
import {useUnmounted} from "@/hooks"
import PageState from "@/config/pageState"

interface Props{
    id?: number | string
    onClose?: () => void
    visible: boolean
    UserStore?: any
}

function ShopEdit({id, onClose, visible, UserStore}: Props){
    const [ formRef ] = Form.useForm()
    let [addressName, setAddressName] = useState<any>('')
    const [address, setAddress] = useState('')
    const unmounted = useUnmounted()
    const [pageState, setPageState] = useState<PageState>(PageState.completed)

    useEffect(() => {
        initForm()
    }, [id])

    const initForm = () => {
        if(!id) {
            setAddressName('')
            formRef.setFieldsValue({
                id: '',
                create_time: '',
                modify_time: '',
                name: '', // 店名
                contract: '', // 联系电话
                shop_category_id: '', // 分类id
                desc: '', // 店铺简介
                slogan: '', // 店铺标语
                opening_range: [],
                avatar: '', // 头像
                business_license: '', // 营业执照
                service_permission: '', // 服务许可证
                deliver_fee: '', // 配送费
                deliver_fee_start_amount: '', // 配送费起送价
                provinceCode: '',
                cityCode: '',
                countyCode: '',
                codeList: [],
                headAddress: '',
                tailAddress: '',
            })
            return
        }

        setPageState(PageState.loading)
        $http.fetch(urls.shopDetail, { id }, {method: 'get'}).then( r => {
            if(r.success){
                const data = r.info
                const timeRange = data.opening_range ? data.opening_range.map((t: string) => moment(t)) : []
                formRef.setFieldsValue({
                    ...r.info,
                    opening_range: timeRange,
                    codeList: [r.info.provinceCode, r.info.cityCode, r.info.countyCode]
                })
                if(!unmounted){
                    setPageState(PageState.completed)
                    setAddressName(r.info.headAddress)
                }
            }else{
                if(!unmounted){
                    setPageState(PageState.error)
                }
                message.error(r.msg)
            }
        }).catch(e => {
            setPageState(PageState.error)
            message.error('获取信息出错')
        })
    }

    const saveForm = () => {
        formRef.validateFields().then(val => {
            const [ provinceCode, cityCode, countyCode ] = val.codeList
            $http.fetch(urls.shopSave, { ...val, provinceCode, cityCode, countyCode, headAddress: address || addressName, id }).then( r => {
                if(r.success){
                    onClose?.()
                    message.success(r.msg)
                    if(!id) {
                        UserStore.updateUser()
                    }
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
                    <Form.Item label="店铺名称" name="name" rules={[rules.required()]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="联系电话" name="contract" rules={[rules.required(), rules.mobile()]}>
                        <Input maxLength={11}/>
                    </Form.Item>
                    <Form.Item label="店铺类别" name="shop_category_id" rules={[rules.required()]}>
                        <ShopCategorySelect />
                    </Form.Item>
                    <Form.Item label="店铺简介" name="desc" rules={[rules.required()]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="店铺标语" name="slogan">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="营业时间" name="opening_range">
                        <TimePicker.RangePicker format={'HH:mm'}/>
                    </Form.Item>
                    <Form.Item label="店铺头像" name="avatar" rules={[rules.required()]}>
                        <CustomUpload />
                    </Form.Item>
                    <Form.Item label="营业执照" name="business_license" rules={[rules.required()]}>
                        <CustomUpload />
                    </Form.Item>
                    <Form.Item label="服务许可证" name="service_permission" rules={[rules.required()]}>
                        <CustomUpload />
                    </Form.Item>
                    <Form.Item label="配送费" name="deliver_fee" rules={[rules.required()]}>
                        <InputNumber className={styles.number_input}/>
                    </Form.Item>
                    <Form.Item label="起送价" name="deliver_fee_start_amount" rules={[rules.required()]}>
                        <InputNumber className={styles.number_input}/>
                    </Form.Item>
                    <Form.Item label="地区" name="codeList" rules={[rules.required()]}>
                        <AddressPicker addressName={addressName} onUpdate={ (adr: string) => setAddress(adr) }/>
                    </Form.Item>
                    <Form.Item label="详细地址" name="tailAddress" rules={[rules.required()]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Spin>
            <Button type="primary" onClick={saveForm}>保存</Button>
        </>
    )
}

export default inject('UserStore')(observer(ShopEdit))
