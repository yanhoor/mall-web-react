import { useState, useEffect, useCallback } from 'react'
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

    const getPaginationParams = useCallback(() => {
        return {
            current: pagination.current,
            pageSize: pagination.pageSize,
        }
    }, [pagination.current, pagination.pageSize])

    const getPageList = (p: FetchParams = {}) => {
        $http.fetch(url, {...params, ...getPaginationParams(), ...p}, options).then( r => {
            setPageList(r.list)
            setPagination(preVal => {
                return {
                    ...preVal,
                    total: r.amount,
                }
            })
        })
    }

    useEffect(getPageList, [ getPaginationParams ])

    // 如果是数组，使用 setPagination 时会报错，具体 https://stackoverflow.com/questions/65657572/custom-useinput-hook-and-typescript-error
    return { pageList, pagination, getPageList, setPagination }
}

export { usePageList }
