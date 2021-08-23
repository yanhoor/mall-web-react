import React, { useEffect } from 'react'
import { Cascader } from 'antd'
import { CascaderProps } from 'antd/es/cascader'
import $http from "@/http"
import urls from "@/http/urls"

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
    value?: string[]
    onChange?: OnChange
    UserStore?: any
}

export default function GoodsCategoryCascader({ value, onChange, UserStore }: Props){
    const { userInfo } = UserStore
    const [options, setOptions] = React.useState([])

    useEffect(() => {
        initData()
    }, [])

    const initData = async () => {
        const d = await fetchChildren()
        const result = d.map((item: any) => {
            item.level = 1
            item.isLeaf = false
            return item
        })
        setOptions(result)
    }

    const loadData = async (selectedOptions: Option[]) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true
        const list = await fetchChildren(targetOption.id)
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

    const fetchChildren = async (id: number | string = 0) => {
        return $http.fetch(urls.goodsCategoryChildren, { shop_id: userInfo.shop_id, parent_id: id }, { method: 'get' }).then(r => {
            if(r.success){
                return r.list
            }
        })
    }

    return (
        <div>
            <Cascader
                // defaultValue={value}
                value={value} // 导致 onChange 参数最后一个选项为空
                options={options}
                fieldNames={{ label: 'name', value: 'id' }}
                onChange={onChange}
                loadData={(val: any) => loadData(val)}
                changeOnSelect
            />
        </div>
    )
}
