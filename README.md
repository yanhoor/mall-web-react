# mall-web-react

## 技术栈

`React + React-router + Mobx + history + antd + less`

## 创建过程

- `npx create-react-app mall-web-react --template typescript`

- 添加路由

  - `npm i -S react-router-dom @types/react-router-dom`

- 本地开发代理

  - `cnpm i -D http-proxy-middleware`

  - `src` 下新增文件 `setupProxy.js`

  ```JavaScript
  const { createProxyMiddleware } = require('http-proxy-middleware');

  module.exports = function (app) {
      app.use(createProxyMiddleware('/api',{
          target: process.env.REACT_APP_BASE_URL,
          changeOrigin: true,
          pathRewrite: {
              '^/api': ''
          }
      }))

  };
  ```

- 增加 `@` 别名：

  - 安装 `cpm i -D customize-cra react-app-rewired`

  - 根目录添加 `config-overrides.js`

  ```JavaScript
  const { override, addWebpackAlias, addLessLoader } = require('customize-cra')
  const path = require('path')

  module.exports = override(
      addWebpackAlias({
          "@": path.resolve(__dirname, "src")
      }),
  )
  ```

  - `package.json` 启动命令修改

  ```json
  "scripts": {
      "start": "react-app-rewired start",
      "build": "react-app-rewired build",
      "test": "react-app-rewired test",
      "eject": "react-scripts eject"
  }
  ```

  - 根目录添加 `tsconfig.paths.json`

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

- 引入 `antd`

  - 安装 `cpn i -S antd`

  - 在 `index.tsx` 引入 `import 'antd/dist/antd.css'`（使用 `less` 引入的是 `import 'antd/dist/antd.less'`）

- 使用 `Less`

  - 安装 `cnpm i -D less less-loader@5.0.0`，`less-loader` 需要 `5.0.0` 版本，其他版本可能报错

  - 修改 `config-overrides.js`

    ```JavaScript
    const { override, addWebpackAlias, addLessLoader } = require('customize-cra')
    const path = require('path')

    module.exports = override(
        addLessLoader({
            javascriptEnabled: true,
            // 修改 antd 的主题色，同时需要 index.tsx 引入 import 'antd/dist/antd.less'
            modifyVars: {
                "@brand-primary": '#64BFBB',
                '@primary-color': '#1DA57A'
            }
        }),
    )
    ```

  - 在 `src` 下的 `react-app-env.d.ts` 新增

    ```TypeScript
    declare module "*.less"{
        const content: { [className: string]: string };
        export default content
    }
    ```

  - 其他类似使用 `CSS Module` 语法， 如文件名以 `.module.less` 结尾

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

- 引入并在对应元素上使用 `className`

  ```jsx
  import styles from './Login.module.css'

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

- 在 `App.tsx` 引入

  ```tsx
  import { Provider } from 'mobx-react'
  import UserStore from './userStore'

  const Store = { UserStore }

  function App() {
    return (
        <Provider {...Store}>
            <div className="App">

            </div>
        </Provider>
    )
  }
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
