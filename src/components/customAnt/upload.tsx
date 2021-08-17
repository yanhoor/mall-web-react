import React from 'react'
import { Upload, message, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload/interface'
import $http from "../../http"
import urls from "../../http/urls"
import styles from '../components.module.css'

type FileItem = RcFile

interface Props {
    typeList?: string[]
    uploadPath?: string
    value: string
    maxSize?: number // M
    onChange?: (value: string) => void
}

export default function CustomUpload(props: Props){

    let {
        value,
        maxSize = 10,
        typeList = ['.jpg', '.jpeg', '.png', '.gif'],
        uploadPath = '/file/upload',
        onChange
    } = props

    const imgFullPath = urls.IMG_HOST + value

    const beforeUpload = (file: FileItem, fileList?: Array<FileItem>) => {
        const ldx = file.name?.lastIndexOf('.')
        const ext = file.name?.substring(ldx as number)
        const isLimit = file.size / 1024 / 1024 > maxSize
        if (isLimit) {
            message.error(`最大不能超过 ${maxSize}M`)
        }
        return typeList.includes(ext as string) && !isLimit
    }

    const customRequest = (prop: any) => {
        const { file } = prop
        if(beforeUpload(file)){
            $http.fetch(uploadPath, { file, lastFilePath: value }, { formData: true }).then(r => {
                if(r.success){
                    onChange?.(r.path)
                }
            })
        }
    }

    return (
        <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={customRequest}
        >
            {
                value
                    ? <Tooltip title="点击修改">
                        <img src={imgFullPath} className={styles.img_preview} />
                    </Tooltip>
                    : <div className={styles.upload_action}>
                        <PlusOutlined style={{fontSize: '36px'}} />
                        <p>点击上传</p>
                    </div>
            }
        </Upload>
    )
}
