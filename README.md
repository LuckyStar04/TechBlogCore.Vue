<img src="https://github.com/LuckyStar04/TechBlogCore.Vue/blob/master/src/assets/logo.png" height="60%" width="60%"/>

----

## 简介 | Introduction

基于 **Vue3全家桶 + TypeScript + Element-Plus + marked.js** 的博客前端。

采用简约风格，实现了包括PC/移动端适配，Dark模式切换。

后端采用 ASP.NET Core RestAPI + JWT 鉴权，项目地址：https://github.com/LuckyStar04/TechBlogCore

需要项目预览，请移步 [这里](https://lhyy2022.xyz/)

A front-end minimalist style blog based on **Vue3 + TypeScript + Element-Plus + marked.js**.

Back-end based on ASP.NET Core RestAPI + JWT Authorization, see https://github.com/LuckyStar04/TechBlogCore

If you want a preview please visit [here](https://lhyy2022.xyz/)

## Project Setup

```sh
npm install
```

### Change back-end IP address & port in `/src/utils/request.ts`

```js
this.baseURL = import.meta.env.MODE === 'development' ? 'http://192.168.2.233:7084/api/' : '/api/'
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
