import React, { useState } from 'react'
import { Form, Input, Row, Col, Button } from 'antd'
import { observer, inject } from 'mobx-react'
import LayoutList from "@/views/layout/components/_listContent"
import CustomTable from "@/components/customAnt/table"
import CustomDrawer from "@/components/customAnt/drawer"
import urls from "@/http/urls"
import {TablePaginationConfig} from "antd/es/table"
import { usePageList } from "@/hooks"
import ShopEdit from "@/views/shop/Edit"
import ShopCategorySelect from "@/components/business/shopCategorySelect"
import styles from './shop.module.less'
import moment from "moment"

function ShopList(props: any){
    const [ formRef ] = Form.useForm()
    const [editVisible, setEditVisible] = useState(false)
    const [editId, setEditId] = useState('')
    let { pageList, pagination, getPageList, setPagination } = usePageList({
        url: urls.shopList,
        options: { method: 'get' }
    })

    const onQuery = (init: boolean = false) => {
        const val = formRef.getFieldsValue()
        if(init){
            val.current = 1
        }
        getPageList(val)
    }

    const onResetQuery = (e: any) => {
        formRef.resetFields()
        onQuery(true)
    }

    const handleTableChange = (page: TablePaginationConfig, filters: any, sorter: any) => {
        setPagination(page)
    }

    const handleEdit = (id: string = '') => {
        setEditId(id)
        setEditVisible(true)
    }

    const onCloseEdit = () => {
        setEditVisible(false)
        onQuery()
    }

    const top = (
        <Form form={formRef}>
            <Row gutter={[0, 10]}>
                <Col span={8}>
                    <Form.Item label="店铺名称" name="name">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="店铺类别" name="shop_category_id">
                        <ShopCategorySelect />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )

    const actions = (
        <>
            <Button onClick={() => onQuery()}>查询</Button>
            <Button onClick={onResetQuery}>重置</Button>
            <Button onClick={() => handleEdit()}>新增</Button>
        </>
    )

    const columns = [
        {
            title: '店铺名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '联系电话',
            dataIndex: 'contract',
            key: 'contract'
        },
        {
            title: '所属分类',
            dataIndex: 'shop_category',
            key: 'shop_category',
            render: (text: string, record: any, index: number) => {

                return record.shop_category.name
            }
        },
        {
            title: '简介',
            dataIndex: 'desc',
            key: 'desc'
        },
        {
            title: '地址',
            dataIndex: 'headAddress',
            key: 'headAddress',
            render: (text: string, record: any, index: number) => {
                return record.headAddress + record.tailAddress
            }
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time'
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text: string, record: any, index: number) => {

                return (
                    <p>
                        <Button type="link" onClick={() => handleEdit(record.id)}>编辑</Button>
                    </p>
                )
            }
        },
    ]

    return (
        <>
            <LayoutList
                top={top}
                actions={actions}
                table={<CustomTable
                    columns={columns}
                    onChange={handleTableChange}
                    dataSource={pageList}
                    pagination={pagination}
                    expandable={{
                        expandedRowRender: (record) => (<RowExpanded record={record}/>)
                    }}
                />}
            />
            <CustomDrawer
                title={editId ? '编辑店铺' : '新建店铺'}
                visible={editVisible}
                onClose={onCloseEdit}
                content={<ShopEdit id={editId} onClose={onCloseEdit} visible={editVisible}/>}
            />
        </>
    )
}

interface RowExpandedProps{
    record: any
}

function RowExpanded({ record }: RowExpandedProps){
    const { admin } = record
    return (
        <Form layout="inline" labelCol={{span: 6}} wrapperCol={{span: 18}} className={styles.expanded_form}>
            <Form.Item label="店铺名称">
                <span className={styles.expand_item_content}>{record.name}</span>
            </Form.Item>
            <Form.Item label="联系电话">
                <span className={styles.expand_item_content}>{record.contract}</span>
            </Form.Item>
            <Form.Item label="所属分类">
                <span className={styles.expand_item_content}>{record.shop_category.name}</span>
            </Form.Item>
            <Form.Item label="简介">
                <span className={styles.expand_item_content}>{record.desc}</span>
            </Form.Item>
            <Form.Item label="标语">
                <span className={styles.expand_item_content}>{record.slogan}</span>
            </Form.Item>
            <Form.Item label="营业时间">
                <span className={styles.expand_item_content}>{
                    record.opening_range.map((time: any) => moment(time).format('HH:mm:ss')).join(' 至 ')
                }</span>
            </Form.Item>
            <Form.Item label="配送费">
                <span className={styles.expand_item_content}>{record.deliver_fee}</span>
            </Form.Item>
            <Form.Item label="起送价">
                <span className={styles.expand_item_content}>{record.deliver_fee_start_amount}</span>
            </Form.Item>
            <Form.Item label="地址">
                <span className={styles.expand_item_content}>{ record.headAddress + record.tailAddress }</span>
            </Form.Item>
            <Form.Item label="创建人">
                <span className={styles.expand_item_content}>{admin.name}</span>
            </Form.Item>
            <Form.Item label="创建时间">
                <span className={styles.expand_item_content}>{record.create_time}</span>
            </Form.Item>
            <Form.Item label="最后修改时间">
                <span className={styles.expand_item_content}>{record.modify_time}</span>
            </Form.Item>
        </Form>
    )
}

export default inject('UserStore')(observer(ShopList))
