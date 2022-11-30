<template>
  <Teleport to="body">
    <div class="bg-wrapper">
      <StarryBackground></StarryBackground>
    </div>
  </Teleport>
  <div class="home-main">
    <link href="/src/assets/home.css" rel="stylesheet" type="text/css" />
    <div class="avatar-wrapper">
      <img class="avatar" :src="avatar" />
    </div>
    <p class="title">TechBlogCore.Vue</p>
    <div class="navigations">
      <RouterLink :to="{ name: 'login' }">登录</RouterLink>
      <RouterLink :to="{ name: 'articles' }">文章</RouterLink>
      <RouterLink :to="{ name: 'editArticle', params: { id: 2 } }">编辑</RouterLink>
      <RouterLink :to="{ name: 'createArticle' }">新建</RouterLink>
    </div>
    <p class="description">A tech Blog focus on full-stack Web development.</p>
  </div>
</template>
<script lang="ts" setup>
import StarryBackground from '@/components/StarryBackground.vue';
import avatar from '../assets/avatar-2.png'

</script>
<style scoped>
.home-main {
  margin: auto;
  color: white;
  display: flex;
  flex-flow: column;
  align-items: center;
  overflow: auto;
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
  line-height: 0;
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
  letter-spacing: 1rem;
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
    font-size: 1rem;
    letter-spacing: .6rem;
  }
}
</style>