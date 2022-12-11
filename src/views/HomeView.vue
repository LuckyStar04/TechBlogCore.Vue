<script lang="ts" setup>
import StarryBackground from '@/components/StarryBackground.vue';
import { onBeforeMount } from 'vue';
import avatar from '@/assets/avatar-1.png'

onBeforeMount(() => {
    let classes = document.querySelector('body')!.classList
    classes.remove('not-found')
    classes.add('fixed')
    document.querySelector('meta[name="theme-color"]')!.setAttribute("content", "#16161e")
})

</script>
<template>
  <Teleport to="body">
    <div class="bg-wrapper">
      <StarryBackground></StarryBackground>
    </div>
  </Teleport>
  <div class="home-main">
    <div class="avatar-wrapper">
      <img class="avatar" :src="avatar" />
    </div>
    <p class="title">TechBlogCore.Vue</p>
    <div class="navigations">
      <RouterLink :to="{ name: 'login' }">登&nbsp;&nbsp;&nbsp;录</RouterLink>
      <RouterLink :to="{ name: 'articles' }">文&nbsp;&nbsp;&nbsp;章</RouterLink>
      <RouterLink :to="{ name: 'archived' }">归&nbsp;&nbsp;&nbsp;档</RouterLink>
      <!-- <RouterLink :to="{ name: 'editArticle', params: { id: 2 } }">编辑</RouterLink>
      <RouterLink :to="{ name: 'createArticle' }">新建</RouterLink> -->
      <a href="https://github.com/LuckyStar04/TechBlogCore.Vue" target="_blank">Github</a>
    </div>
    <p class="description">A tech Blog focus on Linux & full-stack Web development.</p>
    <div class="block-div"></div>
  </div>
</template>
<style scoped>
.home-main {
  margin: auto;
  color: white;
  display: flex;
  flex-flow: column;
  align-items: center;
  overflow: auto;
  animation: mainanime 1.2s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
}

@keyframes mainanime {
  from {
    transform: scale(.9);
  }
  to {
    transform: scale(1.12);
  }
}

.home-main>.title {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-weight: bold;
  font-size: 4rem;
  line-height: 0;
  text-shadow: 0 0 12px lightgray;
}

.home-main>.description {
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-size: 1rem;
  text-shadow: 0 0 4px lightgray;
  line-height: 3rem;
}

.avatar-wrapper {
  height: 248px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  border-radius: 50%;
  width: 200px;
  height: 200px;
  animation: avataranime .6s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  background-color: #3b2e5c;
}

@keyframes avataranime {
  0% {
    transform: scale(.6) rotateY(-10deg);
  }

  25% {
    transform: scale(1.06) rotateY(45deg);
  }

  50% {
    transform: scale(1.12) rotateY(90deg)
  }

  100% {
    transform: scale(1.24) rotateY(180deg);
  }
}

.navigations {
  display: flex;
  width: 100%;
  justify-content: space-around;
  max-width: 653px;
}

.navigations a {
  text-decoration: none;
  color: #d6dbc0;
  font-family: '微软雅黑', Verdana, Geneva, Tahoma, sans-serif;
  font-size: 1.6rem;
  font-weight: lighter;
}

.navigations a:hover {
  color: white;
  text-shadow: 0 0 4px lightgray;
  transform: scale(1.06);
}

.bg-wrapper {
  z-index: -999;
  position: fixed;
  top: 0;
  left: 0;
}

.block-div {
  width: 100px;
  height: 100px;
  display: none;
}

@media only screen and (max-width: 768px) {
  .avatar {
    width: 10rem;
    height: 10rem;
  }

  .home-main>.title {
    font-size: 2rem;
    text-shadow: 0 0 12px lightgray;
  }

  .home-main>.description {
    font-size: .6rem;
    text-shadow: 0 0 4px lightgray;
    line-height: 3rem;
  }

  .navigations a {
    font-size: 1.2rem;
  }
  .block-div {
    display: block;
  }
}
</style>