import React, { useState, useEffect } from 'react'
import { Input, Button, Cascader } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { CascaderProps } from 'antd/es/cascader'
import $http from "@/http"
import urls from "@/http/urls"
import styles from '../components.module.less'

type OnChange = CascaderProps['onChange']

interface Option{
    fullname: string,
    id: string,
    location: {
        lat: number,
        lng: number
    },
    name: string,
    pinyin: string[],
    children?: Option[],
    loading?: boolean,
    isLeaf?: boolean,
    level: number,
}

interface Props{
    addressName: string
    value?: string[]
    onChange?: OnChange
    onUpdate?: (adr: string) => void
}

export default function AddressPicker({ addressName, value, onChange, onUpdate }: Props){
    const [options, setOptions] = React.useState([])
    const [addressText, setAddressText] = useState(addressName)

    useEffect(() => {
        initData()
    }, [])

    useEffect(() => {
        setAddressText(addressName)
    }, [addressName])

    const initData = async () => {
        const d = await fetchChildren()
        const result = d.result[0].map((item: any) => {
            item.level = 1
            item.isLeaf = false
            return item
        })
        setOptions(result)
    }

    const loadData = async (selectedOptions: Option[]) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true
        const d = await fetchChildren(targetOption.id)
        const list = d.result[0]
        if(targetOption.level != 3){
            targetOption.children = list.map((item: any) => {
                item.level = targetOption.level + 1
                item.isLeaf = item.level === 3
                return item
            })
        }
        targetOption.loading = false
        setOptions([...options])
    }

    const fetchChildren = async (id = '') => {
        return $http.fetch(urls.addressChildren, { parentCode: id }, { method: 'get' })
    }

    const onValueChange = (val: any, options: any) => {
        const adr = options.map((op: Option) => op ? op.fullname : '').join('/')
        setAddressText(adr)
        onUpdate?.(adr)
        onChange?.(val, options)
    }

    return (
        <div className={styles.picker_container}>
            <Input disabled value={addressText} title={addressText}/>
            <Cascader
                defaultValue={value}
                // value={value} // 导致 onChange 参数最后一个选项为空
                options={options}
                fieldNames={{ label: 'fullname', value: 'id' }}
                onChange={onValueChange}
                loadData={(val: any) => loadData(val)}
                // changeOnSelect
            >
                <Button icon={<EditOutlined />} />
            </Cascader>
        </div>
    )
}
