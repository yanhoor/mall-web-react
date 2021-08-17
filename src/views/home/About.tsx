import { observer, inject } from 'mobx-react'

function About(props: any) {
    return (
        <h3>about232323{props.UserStore.userInfo.name}</h3>
    )
}

export default inject('UserStore')(observer(About))
