import React, { useState, useEffect } from 'react'
import { Select } from 'antd'
import $http from "@/http"
import urls from "@/http/urls"
import { useUnmounted } from '@/hooks'

interface Props{
    value?: string
    onChange?: (val: string) => void
}

/** 店铺类别选择器 */
export default function ShopCategorySelect({ value, onChange }: Props){
    const [cateList, setCateList] = useState([])
    const unmounted = useUnmounted()

    useEffect(() => {
        $http.fetch(urls.shopCategoryList, {},{ method: 'get' }).then(r => {
            if(r.success && !unmounted) setCateList(r.list)
        })
    }, [])

    return (
        <Select value={value} onChange={onChange} allowClear>
            {
                cateList.map((cate: any) => (
                    <Select.Option value={cate.id} key={cate.id}>
                        {cate.name}
                    </Select.Option>
                ))
            }
        </Select>
    )
}
