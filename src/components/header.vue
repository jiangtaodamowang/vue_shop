<template>
  <div class="header">
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <img src="../assets/image/header.png" />
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content bg-purple-light">
          <span>ππ商城后台管理系统</span>
        </div>
      </el-col>
      <el-col :span="2"
        ><div class="grid-content bg-purple-btn">
          <el-button @click.prevent="handleSingOut()">退出</el-button>
        </div></el-col
      >
    </el-row>
  </div>
</template>

<script>
export default {
  methods: {
    handleSingOut() {
      window.sessionStorage.clear()
      this.$message.success('退出成功')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  .bg-purple img {
    height: 85px;
    // width: 85px;
  }
}
.header {
  .bg-purple-light {
    color: #fff;
    font-weight: bold;
    font-size: 24px;
    line-height: 85px;
    text-align: center;
  }
}
.header {
  .bg-purple-btn {
    line-height: 85px;
    text-align: center;
  }
}
</style>
