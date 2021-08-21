import React, { useState, useEffect } from 'react'
import {Button, Tree, Dropdown, Modal, Menu, Form, Input, message} from 'antd'
import $http from "@/http"
import urls from "@/http/urls"
import rules from "@/config/rules"

interface Item{
    id: number | string,
    create_time: string,
    modify_time: string,
    name: string,
    level: number | string, // 节点等级，0开始
    parent_id: number | string, // 上级节点
    shop_id: number | string,
    isLeaf?: boolean
    children?: Item[]
}

interface DataNode {
    title: string;
    key: string;
    id: string;
    isLeaf?: boolean;
    children?: DataNode[];
}

interface Props{
    shop_id: number
}

export default function GoodsCategory({ shop_id }: Props){
    const [ formRef ] = Form.useForm()
    const [treeData, setTreeData] = useState<DataNode[]>([])
    const [editNode, setEditNode] = useState<any>()
    const [menuKey, setMenuKey] = useState('')
    const [showEdit, setShowEdit] = useState(false)
    const [postForm, setPostForm] = useState<any>() // 提交的form，含antd Form组件其他不包含的必需信息

    useEffect(() => {
        getChildren(0).then( (r: any) => {
            setTreeData(r)
        })
    }, [])

    const onAddFirst = () => {
        if(!shop_id){
            message.error('请先添加店铺')
            return
        }

        setEditNode(null)
        setShowEdit(true)
        setMenuKey('2')
        setPostForm({
            parent_id: 0,
            name: '',
            shop_id,
            level: 0
        })
        formRef.setFieldsValue({
            name: '',
        })
    }

    // 给节点添加子节点
    const appendTreeChildren = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] => {
        return list.map(node => {
            if (node.key === key) {
                return {
                    ...node,
                    children,
                };
            }
            if (node.children) {
                return {
                    ...node,
                    children: appendTreeChildren(node.children, key, children),
                };
            }
            return node
        });
    }

    const onLoadData = (treeNode: any) => {
        return new Promise<void>((resolve, reject) => {
            if (treeNode.children) {
                return resolve()
            }
            getChildren(treeNode.id).then(r => {
                setTreeData(origin => {
                    return appendTreeChildren(origin, treeNode.key, r)
                })
                return resolve()
            }).catch(e => {
                reject()
            })
        })
    }

    const onContextMenuClick = (key: string, node: any) => {
        setMenuKey(key)
        setEditNode(node)
        switch(key){
            case '1':
                formRef.setFieldsValue(node)
                setPostForm(node)
                setShowEdit(true)
                break

            case '2':
                formRef.setFieldsValue({
                    name: '',
                })
                setPostForm({
                    parent_id: node.id,
                    name: '',
                    shop_id,
                    level: node.level + 1
                })
                setShowEdit(true)
                break
        }
    }

    const titleRender = (nodeData: any): React.ReactNode => {
        const overlay = (
            <Menu onClick={({ key: menuKey }) => onContextMenuClick(menuKey, nodeData)}>
                <Menu.Item key={'1'}> 修改名称 </Menu.Item>
                { nodeData.level === 2 ? null : <Menu.Item key={'2'}> 添加子分类 </Menu.Item>}
                <Menu.Item key={'3'}> 删除该分类及下级分类 </Menu.Item>
            </Menu>
        )
        return (
            <Dropdown overlay={overlay} trigger={['contextMenu']}>
                <span>{nodeData.name}</span>
            </Dropdown>
        )
    }

    const getChildren = (parent_id: number): Promise<any> => {
        // if(!shop_id) return Promise.resolve()

        return $http.fetch(urls.goodsCategoryChildren, { shop_id, parent_id }, { method: 'get' }).then( r => {
            if(r.success){
                return r.list.map((item: any) => {
                    item.key = item.id
                    return item
                })
            }
        })
    }

    const saveForm = () => {
        formRef.validateFields().then(val => {
            let postData = {
                ...postForm,
                ...val
            }
            $http.fetch(urls.goodsCategorySave, postData).then(r => {
                if(r.success){
                    setShowEdit(false)

                    // 修改节点名称
                    if(menuKey === '1'){
                        editNode.name = r.data.name
                        const old = treeData
                        setTreeData([])
                        setTreeData(old)
                        return
                    }

                    // 新增节点
                    let newData = r.data
                    newData.key = newData.id
                    if(!editNode){
                        setTreeData([...treeData, newData])
                    }else if(editNode.children){
                        editNode.children.push(newData)
                        const old = treeData
                        setTreeData([])
                        setTreeData(old)
                    }else{
                        editNode.children = [newData]
                        const old = treeData
                        setTreeData([])
                        setTreeData(old)
                    }
                    message.success(r.msg)
                }else{
                    message.error(r.msg)
                }
            })
        }).catch(e => {
            console.log('--------------', e)
        })
    }

    return (
        <>
            <h3>商品分类管理 <span style={{fontSize: '12px'}}>（节点右键添加子节点）</span></h3>
            <Button onClick={onAddFirst}>添加一级分类</Button>
            <Tree showLine loadData={onLoadData} treeData={treeData} titleRender={titleRender}>

            </Tree>
            <Modal title={menuKey === '1' ? '修改分类名称' : '新增下级分类'} visible={showEdit} onOk={saveForm} onCancel={() => setShowEdit(false)}>
                <Form form={formRef}>
                    {
                        menuKey === '2'
                            ? <Form.Item label="上级分类">
                                <Input disabled value={editNode?.name ?? '无'}/>
                            </Form.Item>
                            : null
                    }
                    <Form.Item label="分类名称" name="name" rules={[rules.required()]}>
                        <Input placeholder="请输入分类名称"/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
