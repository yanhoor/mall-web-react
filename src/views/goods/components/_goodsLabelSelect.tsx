import React, { useState, useEffect } from 'react'
import { Select } from 'antd'
import $http from "@/http"
import urls from "@/http/urls"

interface Props{
    value?: string
    onChange?: (val: string) => void
}

/** 商品标签选择器 */
export default function GoodsLabelSelect({ value, onChange }: Props){
    const [optionList, setOptionList] = useState([])

    useEffect(() => {
        $http.fetch(urls.goodsLabelList, {},{ method: 'get' }).then(r => {
            if(r.success) setOptionList(r.list)
        })
    }, [])

    return (
        <Select value={value} onChange={onChange} allowClear mode="multiple">
            {
                optionList.map((option: any) => (
                    <Select.Option value={option.id} key={option.id}>
                        {option.name}
                    </Select.Option>
                ))
            }
        </Select>
    )
}
