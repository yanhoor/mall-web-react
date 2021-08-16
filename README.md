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
