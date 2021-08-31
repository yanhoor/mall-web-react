import {useCallback, useEffect, useState} from 'react'
import { message } from 'antd'
import $http from "@/http"
import {PaginationProps} from "antd/es"
import {useUnmounted} from './useUnmounted'
import PageState from "@/config/pageState"

interface PageListProps{
    url: string
    params?: FetchParams
    options?: RequestOptions
}

// 列表查询
function usePageList({ url, params, options }: PageListProps){
    const [pageList, setPageList] = useState([])
    const [pageState, setPageState] = useState<PageState>(PageState.loading)
    const [pagination, setPagination] = useState<PaginationProps>({
        current: 1,
        pageSize: 20,
        total: 0,
        pageSizeOptions: ['3', '5', '10', '20', '30'],
        showSizeChanger: true
    })
    const unmounted = useUnmounted()

    const getPaginationParams = useCallback(() => {
        return {
            current: pagination.current,
            pageSize: pagination.pageSize,
        }
    }, [pagination.current, pagination.pageSize])

    const getPageList = (p: FetchParams = {}) => {
        setPageState(PageState.loading)
        $http.fetch(url, {...params, ...getPaginationParams(), ...p}, options).then( r => {
            if(!unmounted && r.success){
                setPageState(PageState.completed)
                setPageList(r.list)
                setPagination(preVal => {
                    return {
                        ...preVal,
                        total: r.amount,
                    }
                })
            }else{
                message.error('获取列表出错')
            }
        }).catch(e => {
            setPageState(PageState.error)
            message.error('获取列表出错')
        })
    }

    useEffect(getPageList, [ getPaginationParams ])

    // 如果是数组，使用 setPagination 时会报错，具体 https://stackoverflow.com/questions/65657572/custom-useinput-hook-and-typescript-error
    return { pageList, pagination, getPageList, setPagination, pageState }
}

export { usePageList }
