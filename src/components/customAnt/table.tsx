import React from 'react'
import { Table, Button, } from 'antd'
import { ColumnsType, ColumnProps, TablePaginationConfig } from 'antd/es/table'
import styles from '../components.module.css'

interface Item{
    [name: string]: any
}

interface Props{
    // columns: ColumnsType<Item>
    columns: ColumnProps<Item>[]
    dataSource: Item[]
    rowKey?: string
    pagination?: TablePaginationConfig
    onChange: (page: TablePaginationConfig, filters: any, sorter: any) => void
    // fetchOptions: {
    //     url: string
    //     params?: FetchParams
    //     options?: RequestOptions
    // }
}

export default function CustomTable({ columns, rowKey = 'id', onChange, pagination, dataSource }: Props){

    const modifyColumns = (): ColumnProps<Item>[] => {
        const hasIndex = columns.some((column) => column.key === 'index')
        const hasLastTime = columns.some((column) => column.key === 'modify_time')
        if(!hasIndex){
            columns.unshift({
                title: '#',
                dataIndex: '',
                key: 'index',
                render: (text: string, record: any, index: number) => {
                    return index + 1
                }
            })
        }
        if(!hasLastTime){
            columns.splice(-1, 0, {
                title: '最后修改时间',
                dataIndex: 'modify_time',
                key: 'modify_time'
            })
        }
        return columns
    }

    return (
        <Table<Item>
            size="middle"
            rowClassName={(record, index) => {
                if(index % 2 === 1) return styles.table_striped
                return ''
            }}
            pagination={pagination}
            onChange={onChange}
            dataSource={ dataSource }
            rowKey={rowKey}>
            {
                modifyColumns().map(column => {
                    return (
                        <Table.Column<Item>
                            {...column}
                        />
                    )
                })
            }
        </Table>
    )
}
