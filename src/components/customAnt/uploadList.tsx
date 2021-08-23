import React, { useState, useMemo } from 'react'
import { Upload, Modal, message } from 'antd'
import { UploadFile } from 'antd/es/upload/interface'
import { PlusOutlined } from '@ant-design/icons'
import $http from "@/http"
import urls from "@/http/urls"

interface Props{
    typeList?: string[]
    value?: string[]
    uploadPath?: string
    maxCount?: number
    onChange?: (value: string[]) => void
}

export default function UploadList({ typeList = ['.jpg', '.jpeg', '.png', '.gif'], value = [], onChange, uploadPath = '/file/upload', maxCount = 5 }: Props){
    const [showPreview, setShowPreview] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | undefined>('')

    const completedFileList: unknown = useMemo(() => {
        return value.map((path: string, index: number) => ({
            uid: index,
            url: urls.IMG_HOST + path
        }))
    }, [value])


    const beforeUpload = (file: UploadFile, fileList?: Array<UploadFile>) => {
        const ldx = file.name?.lastIndexOf('.')
        const ext = file.name?.substring(ldx as number)
        const typeCheck = typeList.includes(ext as string)
        if(!typeCheck){
            message.error(`仅允许 ${typeList.join('/')} 格式`)
        }
        return typeCheck
    }

    const customRequest = (prop: any) => {
        const { file } = prop
        if(beforeUpload(file)){
            $http.fetch(uploadPath, { file }, { formData: true }).then(r => {
                if(r.success){
                    onChange?.([...value, r.path])
                }
            })
        }
    }

    // 移除文件
    const removeFile = (file: UploadFile): Promise<boolean | void> => {
        return new Promise((resolve, reject) => {
            if(file.url){
                const index = file.url.lastIndexOf('/upload/')
                const path = file.url.substring(index + 8)
                $http.fetch('/file/delete', { path }).then(r => {
                    if(r.success){
                        const idx = value.indexOf(path)
                        value.splice(idx, 1)
                        onChange?.([...value])
                        message.success(r.msg)
                        return resolve(true)
                    }else{
                        return reject()
                    }
                })
            }else{
                return reject()
            }
        })
    }

    const handlePreview = (file: UploadFile) => {
        setPreviewImage(file.url)
        setShowPreview(true)
    }

    return (
        <>
            <Upload
                // multiple
                listType="picture-card"
                fileList={completedFileList as UploadFile[]}
                customRequest={customRequest}
                onPreview={handlePreview}
                onRemove={removeFile}
                accept="image/*"
            >
                {
                    (completedFileList as UploadFile[]).length <= maxCount
                        ? (
                            <>
                                <PlusOutlined size={48}/>
                            </>
                        )
                        : null
                }
            </Upload>
            <Modal visible={showPreview} footer={null} onCancel={() => setShowPreview(false)}>
                <img alt="example" style={{width: '100%'}} src={previewImage} />
            </Modal>
        </>
    )
}
