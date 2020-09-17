<template>
  <div>
    <el-menu
      class="el-menu-vertical-demo"
      :unique-opened="true"
      :router="true"
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <div class="toggen-button" @click="handleToggen()">|||</div>
      <el-submenu
        :index="item1.path"
        v-for="(item1, index) in menuList"
        :key="index"
      >
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span>{{ item1.authName }}</span>
        </template>
        <el-menu-item
          :index="item2.path"
          v-for="(item2, index) in item1.children"
          :key="index"
        >
          <i class="el-icon-location"></i>{{ item2.authName }}</el-menu-item
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
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    //点击按钮 进行菜单折叠和展开
    handleToggen() {
      this.isCollapse = !this.isCollapse
    }
  }
}
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
