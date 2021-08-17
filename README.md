# mall-web-react

## 创建过程

- `npx create-react-app mall-web-react --template typescript`

- 添加路由

  - `npm i -S react-router-dom`

  - `npm i -S @types/react-router-dom`

- 引入 `antd`

  - 安装 `cpn i -S antd`

  - 在 `index.tsx` 引入 `import 'antd/dist/antd.css'`

- 增加 `@` 别名：

  - 根目录增加 `tsconfig.paths.json`

  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
    }
  }
  ```

  - 在 `tsconfig.json` 的 `extends` 选项引入

  ```json
  {
    "extends": "./tsconfig.paths.json",
    "compilerOptions": {...}
  }
  ```

## `CSS Module` 语法

- 文件名以 `.module.css` 结尾

  ```CSS
  <!-- Login.module.css -->
  .container{
      width: 400px;
      position: relative;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: #fefefe;
      padding: 30px;
      border-radius: 5px;
      text-align: center;
  }

  .actions button{
      width: 100%;
      margin-bottom: 10px;
  }
  ```

- 引入 `import styles from './Login.module.css'`

- 在对应元素上使用 `className`

  ```jsx
  function Login(){
      return (
          <p className={styles.container}></p>
          <div className={styles.actions}>
              <button>点击</button>
          </div>
      )
  }
  ```

## `mobx` 使用

- 构建响应式类

  ```TypeScript
  // userStore.ts
  import { makeAutoObservable } from 'mobx'

  class UserStore{
      constructor(){
          makeAutoObservable(this) // 将类实例变成响应式，组件用到的相关属性发生变化时，会触发渲染
      }

      userInfo = {
          name: ''
      }

      updateUser(){
          this.userInfo = { name: 'mike' }
      }
  }

  export default new UserStore()
  ```

- 在组件使用

  ```tsx
  import {observer} from "mobx-react"
  import React, { useState } from 'react'
  import UserStore from './userStore.ts'

  const UserView = observe(() => {
      const [ userStore ] = useState(() => UserStore)

      return (
          <div>{userStore.userInfo.name}</div>
      )
  })

  // 或者
  import { observer, inject } from 'mobx-react'

  function About(props: any) {
      return (
          <h3>about232323{props.UserStore.userInfo.name}</h3>
      )
  }

  export default inject('UserStore')(observer(About))
  ```
