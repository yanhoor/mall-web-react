import React, { useState } from 'react'
import { Form, Input, Row, Col, Button } from 'antd'
import { observer, inject } from 'mobx-react'
import LayoutList from "@/views/layout/components/_listContent"
import CustomTable from "@/components/customAnt/table"
import CustomDrawer from "@/components/customAnt/drawer"
import urls from "@/http/urls"
import {TablePaginationConfig} from "antd/es/table"
import { usePageList } from "@/hooks"
import ShopCategoryEdit from "@/views/shopCategory/Edit"

function ShopCategoryList(props: any){
    const [ formRef ] = Form.useForm()
    const [editVisible, setEditVisible] = useState(false)
    const [editId, setEditId] = useState('')
    let { pageList, pagination, getPageList, setPagination } = usePageList({
        url: urls.shopCategoryList,
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
                    <Form.Item label="分类名称" name="name">
                        <Input />
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
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '图标',
            dataIndex: 'icon',
            key: 'icon',
            render: (text: string, record: any, index: number) => {
                return record.icon ? (
                    <img src={urls.IMG_HOST + record.icon} style={{maxWidth: '50px', height: '50px'}}/>
                ) : '/';
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
                />}
            />
            <CustomDrawer
                title={editId ? '编辑分类' : '新建分类'}
                visible={editVisible}
                onClose={onCloseEdit}
                content={<ShopCategoryEdit id={editId} onClose={onCloseEdit} visible={editVisible}/>}
            />
        </>
    )
}

export default inject('UserStore')(observer(ShopCategoryList))
