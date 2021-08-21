import { Result, Button } from 'antd'
import { useHistory } from "react-router-dom"

interface Props {
    path: string
}
export default function PageNotFound({ path }: Props) {
    const history = useHistory()

    const onClick = () => {
        history.replace('/')
    }

    return (
        <>
            <Result
                status="404"
                title="404"
                subTitle="想写几句骚话..."
                extra={<Button type="primary" onClick={onClick}>返回首页</Button>}
            />,
        </>
    )
}
