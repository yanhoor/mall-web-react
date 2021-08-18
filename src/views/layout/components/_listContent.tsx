import React from 'react'
import styles from '../layout.module.less'

interface Props{
    top: React.ReactNode
    actions: React.ReactNode
    table: React.ReactNode
}

export default function LayoutList({top, table, actions}: Props){
    return (
        <div className="Layout_list">
            <div className="filter_form">
                { top }
            </div>
            <div className={styles.filter_actions}>
                { actions }
            </div>
            <div className="list_content">
                { table }
            </div>
        </div>
    )
}
