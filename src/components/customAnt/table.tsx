import React, {useEffect, useState} from 'react'
import { Table} from 'antd'
import { ColumnProps, TablePaginationConfig } from 'antd/es/table'
import styles from '../components.module.less'
import {ExpandableConfig} from "rc-table/lib/interface"
import { debounce } from 'lodash'
import PageState from "@/config/pageState"

interface Item{
    [name: string]: any
}

interface Props{
    // columns: ColumnsType<Item>
    pageState?: PageState
    columns: ColumnProps<Item>[]
    dataSource: Item[]
    rowKey?: string
    pagination?: TablePaginationConfig
    onChange: (page: TablePaginationConfig, filters: any, sorter: any) => void
    expandable?: ExpandableConfig<Item>
}

export default function CustomTable({ columns, rowKey = 'id', onChange, pagination, dataSource, expandable, pageState }: Props){

    const [tableScrollHeight, setTableScrollHeight] = useState<number>()

    useEffect(() => {
        window.addEventListener('resize', adjustTable)
        return () => window.removeEventListener('resize', adjustTable)
    }, [])

    useEffect(() => {
        adjustTable()
    }, [dataSource])

    const modifyColumns: ColumnProps<Item>[] = [
        {
            title: '#',
            dataIndex: '',
            key: 'index',
            render: (text: string, record: any, index: number) => {
                return index + 1
            }
        },
        ...columns,
    ]
    modifyColumns.splice(-1, 0, {
        title: '最后修改时间',
        dataIndex: 'modify_time',
        key: 'modify_time'
    })

    const adjustTable = debounce(async () => {
        const rh = document.querySelector('#layoutRight')?.clientHeight as number
        const dh = document.documentElement.clientHeight
        const table = document.querySelector('#pageTable')
        if(table){
            const offset = table.getBoundingClientRect()
            if(rh > dh){
                setTableScrollHeight(offset.height - (rh - dh) - 110)
            }else{
                setTableScrollHeight(rh - offset.top - 150)
            }
        }
    }, 20)

    return (
        <Table<Item>
            id="pageTable"
            size="middle"
            rowClassName={(record, index) => {
                if(index % 2 === 1) return styles.table_striped
                return ''
            }}
            loading={pageState === PageState.loading}
            pagination={pagination}
            onChange={onChange}
            dataSource={ dataSource }
            expandable={expandable}
            scroll={{y: tableScrollHeight}}
            rowKey={rowKey}>
            {
                modifyColumns.map(column => {
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
