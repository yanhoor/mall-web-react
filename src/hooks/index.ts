import { useState, useEffect } from 'react'
import $http from "@/http"
import { PaginationProps } from "antd/es"

interface PageListProps{
    url: string
    params?: FetchParams
    options?: RequestOptions
}

// 列表查询
function usePageList({ url, params, options }: PageListProps){
    let [pageList, setPageList] = useState([])
    let [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 20,
        total: 0,
        pageSizeOptions: ['3', '5', '10', '20', '30'],
        showSizeChanger: true
    })

    const getPaginationParams = () => {
        return {
            current: pagination.current,
            pageSize: pagination.pageSize,
        }
    }

    const getPageList = (p: FetchParams = {}) => {
        $http.fetch(url, {...params, ...getPaginationParams(), ...p}, options).then( r => {
            setPageList(r.list)
            setPagination(preVal => {
                return {
                    ...preVal,
                    total: r.amount
                }
            })
        })
    }

    useEffect(getPageList, [pagination.current, pagination.pageSize])

    return { pageList, pagination, getPageList, setPagination } // 如果是数组，使用时会报错
}

export { usePageList }
