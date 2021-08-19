import React from 'react'
import { Drawer } from 'antd'

interface Props{
    title: string
    onClose: () => void
    visible: boolean
    content: React.ReactNode
    width?: number
}

export default function CustomDrawer({ title, onClose, visible, content, width = 500 }: Props){
    return (
        <Drawer title={title} onClose={onClose} visible={visible} width={width}>
            {content}
        </Drawer>
    )
}
