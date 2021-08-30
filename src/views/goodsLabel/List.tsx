import React, { useState } from 'react'
import { Form, Input, Row, Col, Button, Tag, message } from 'antd'
import { observer, inject } from 'mobx-react'
import LayoutList from "@/views/layout/components/_listContent"
import CustomTable from "@/components/customAnt/table"
import CustomDrawer from "@/components/customAnt/drawer"
import urls from "@/http/urls"
import {TablePaginationConfig} from "antd/es/table"
import { usePageList } from "@/hooks"
import GoodsLabelEdit from "@/views/goodsLabel/Edit"

function GoodsLabelList(props: any){
    const [ formRef ] = Form.useForm()
    const [editVisible, setEditVisible] = useState(false)
    const [editId, setEditId] = useState('')
    const { UserStore } = props
    let { pageList, pagination, getPageList, setPagination } = usePageList({
        url: urls.goodsLabelList,
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
        if(!id && !UserStore.userInfo.shop_id){
            message.error('请先添加店铺')
            return
        }
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
                    <Form.Item label="标签名称" name="name">
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
            title: '颜色',
            dataIndex: 'color',
            key: 'color',
            render: (text: string, record: any, index: number) => {

                return (
                    <Tag color={record.color}>
                        {record.color}
                    </Tag>
                )
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
                title={editId ? '编辑标签' : '新建标签'}
                visible={editVisible}
                onClose={onCloseEdit}
                content={<GoodsLabelEdit id={editId} onClose={onCloseEdit} visible={editVisible}/>}
            />
        </>
    )
}

export default inject('UserStore')(observer(GoodsLabelList))
