<template>
  <el-container class="container">
    <el-header class="header" height="85px">
      <Header-com></Header-com>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <Aside-com></Aside-com>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from '../../components/header'
import Aside from '../../components/aside'
export default {
  components: {
    'Header-com': Header,
    'Aside-com': Aside
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
}</style>
