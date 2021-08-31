import React, { useState } from 'react'
import { Form, Input, Row, Col, Button, Tag } from 'antd'
import { observer, inject } from 'mobx-react'
import LayoutList from "@/views/layout/components/_listContent"
import CustomTable from "@/components/customAnt/table"
import CustomDrawer from "@/components/customAnt/drawer"
import urls from "@/http/urls"
import {TablePaginationConfig} from "antd/es/table"
import { usePageList } from "@/hooks"
import GoodsEdit from "./Edit"

function GoodsList(props: any){
    const [ formRef ] = Form.useForm()
    const [editVisible, setEditVisible] = useState(false)
    const [editId, setEditId] = useState('')
    let { pageList, pagination, getPageList, setPagination } = usePageList({
        url: urls.goodsList
    })

    const onQuery = (init: boolean = false) => {
        const val = formRef.getFieldsValue()
        setPagination(preVal => {
            return {
                ...preVal,
                current: 1
            }
        })
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

    const exportExcel = () => {
        const form = document.querySelector('#downloadForm') as HTMLFormElement
        form.submit()
    }

    const top = (
        <Form form={formRef}>
            <Row gutter={[0, 10]}>
                <Col span={8}>
                    <Form.Item label="商品名称" name="name">
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
            <Button onClick={exportExcel}>导出</Button>
        </>
    )

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '商品描述',
            dataIndex: 'desc',
            key: 'desc'
        },
        {
            title: '商品标签',
            dataIndex: 'label_list',
            key: 'label_list',
            width: 200,
            render: (text: string, record: any, index: number) => {
                return record.label_list.map((label: any) => (
                    <Tag key={label.id} color={label.color}>{ label.name }</Tag>
                ))
            }
        },
        {
            title: '所属分类',
            dataIndex: 'category_list',
            key: 'category_list',
            render: (text: string, record: any, index: number) => {
                return record.category_list.map((c: any) => c.name).join('/')
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
                title={editId ? '编辑商品' : '新建商品'}
                width={600}
                visible={editVisible}
                onClose={onCloseEdit}
                content={<GoodsEdit id={editId} onClose={onCloseEdit} visible={editVisible}/>}
            />
            <iframe name="download" style={{display: 'none'}} />
            <form action="/api/goods/export/goods_export" target="download" id="downloadForm" style={{display: 'none'}}>
            </form>
        </>
    )
}

export default inject('UserStore')(observer(GoodsList))
