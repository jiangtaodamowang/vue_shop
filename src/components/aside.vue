<template>
  <div>
    <el-menu class="el-menu-vertical-demo" :unique-opened="true" :router="true" :collapse='isCollapse' :collapse-transition='false'>
      <div class="toggen-button" @click="handleToggen()">|||</div>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item index="user">
          <i class="el-icon-location"></i>用户列表</el-menu-item
        >
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-key"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item index="roleList"
          ><i class="el-icon-s-custom"></i>角色列表</el-menu-item
        >
        <el-menu-item index="authority"
          ><i class="el-icon-lollipop"></i>权限列表</el-menu-item
        >
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-sell"></i>
          <span>商品管理</span>
        </template>
        <el-menu-item index="3-1"
          ><i class="el-icon-menu"></i>商品列表</el-menu-item
        >
        <el-menu-item index="3-2"
          ><i class="el-icon-set-up"></i>分类参数</el-menu-item
        >
        <el-menu-item index="3-3"
          ><i class="el-icon-wallet"></i>商品分类</el-menu-item
        >
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-s-shop"></i>
          <span>订单管理</span>
        </template>
        <el-menu-item index="4-1"
          ><i class="el-icon-location"></i>订单列表</el-menu-item
        >
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-s-data"></i>
          <span>数据统计</span>
        </template>
        <el-menu-item index="5-1">
          <i class="el-icon-pie-chart"></i>数据报表</el-menu-item
        >
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      if(res.meta.status !==200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    //点击按钮 进行菜单折叠和展开
    handleToggen() {
      this.isCollapse = !this.isCollapse
    }
  }
};
</script>

<style lang="less" scoped>
.el-menu-vertical-demo {
  background-color: #d3dce6;
}
.toggen-button {
  height: 20px;
  width: 100%;
  text-align: center;
  line-height: 20px;
}
</style>
