<img src="https://github.com/LuckyStar04/TechBlogCore.Vue/blob/master/src/assets/logo.png" height="60%" width="60%"/>

----

## Introduction

A front-end minimalist style blog based on **Vue3 + TypeScript + Element-Plus + marked.js**.

Back-end based on ASP.NET Core RestAPI + JWT Authorization, see https://github.com/LuckyStar04/TechBlogCore

Back-end based on ASP.NET Core AOT, see https://github.com/LuckyStar04/TechBlogCore.AOT

If you want a preview please visit [here](https://techblogcore.top/)

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
