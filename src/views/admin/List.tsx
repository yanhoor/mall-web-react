import React from 'react'
import { Form, Input, Row, Col, Button, Tag, message } from 'antd'
import { observer, inject } from 'mobx-react'
import LayoutList from "@/views/layout/components/_listContent"
import CustomTable from "@/components/customAnt/table"
import urls from "@/http/urls"
import {TablePaginationConfig} from "antd/es/table"
import { usePageList } from "@/hooks"
import $http from "@/http"

function AdminList(props: any){
    const [ formRef ] = Form.useForm()
    const { UserStore } = props
    let { pageList, pagination, getPageList, setPagination } = usePageList({
        url: urls.adminList,
        options: { method: 'get' }
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

    const handleChangeAdminState = (id: number, state: number) => {
        $http.fetch(urls.adminChangeState, { state, id }).then(r => {
            if(r.success){
                message.success(r.msg)
                onQuery()
                return r
            }else{
                message.error(r.msg)
            }
        })
    }

    const top = (
        <Form form={formRef}>
            <Row gutter={[0, 10]}>
                <Col span={8}>
                    <Form.Item label="用户名" name="name">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="手机号" name="mobile">
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
        </>
    )

    const columns = [
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile'
        },
        {
            title: '权限类型',
            dataIndex: 'type',
            key: 'type',
            render: (text: string, record: any, index: number) => {
                let r = ''
                switch (record.type) {
                    case 1:
                        r = '超级管理员'
                        break
                    default:
                    case 2:
                        r = '店铺管理员'
                        break
                }
                return r
            }
        },
        {
            title: '用户状态',
            dataIndex: 'state',
            key: 'state',
            render: (text: string, record: any, index: number) => {
                return (
                    <Tag color={record.state === 1 ? "green" : 'grey'}>
                        {record.state === 1 ? "启用" : '禁用'}
                    </Tag>
                )
            }
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text: string, record: any, index: number) => {
                return record.avatar ? (
                    <img src={urls.IMG_HOST + record.avatar} style={{maxWidth: '50px', height: '50px'}}/>
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
                const disabled = UserStore.userInfo.id === record.id

                return (
                    <p>
                        {
                            record.state === 1
                                ? <Button type="link" disabled={disabled} onClick={() => handleChangeAdminState(record.id, 2)}>禁用</Button>
                                : <Button type="link" disabled={disabled} onClick={() => handleChangeAdminState(record.id, 1)}>启用</Button>
                        }
                    </p>
                )
            }
        },
    ]

    return (
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
    )
}

export default inject('UserStore')(observer(AdminList))
