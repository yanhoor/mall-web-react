import {useEffect, useState} from "react"

// 组件是否已卸载
function useUnmounted(){
    const [unmounted, setUnmounted] = useState(false)

    useEffect(() => {
        setUnmounted(false)
        return () => {
            setUnmounted(true)
        }
    }, [])

    return unmounted
}

export { useUnmounted }
