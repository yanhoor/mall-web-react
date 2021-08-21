import React from 'react'
import { Row, Col } from 'antd'
import { observer, inject } from 'mobx-react'
import ShopEdit from "@/views/shop/Edit"
import GoodsCategory from "./_goodsCategory"
import styles from './shop.module.less'

interface Props{
    UserStore: any
}

function ShopManagement({ UserStore }: Props){
    const shop_id = UserStore.userInfo.shop_id ?? ''

    return (
        <>
            <Row>
                <Col span={8}>
                    <GoodsCategory shop_id={shop_id}/>
                </Col>
                <Col span={16}>
                    <div className={styles.shop_manage_wrapper}>
                        <ShopEdit id={shop_id} visible={true} />
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default inject('UserStore')(observer(ShopManagement))
