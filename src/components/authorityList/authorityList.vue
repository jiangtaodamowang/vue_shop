<template>
  <div>
    <!--1.面包屑-->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <!-- 2.卡片 -->
    <el-card class="card">
      <!-- 2.1 表格 -->
      <el-table :data="authorityList" style="width: 100%" border>
        <el-table-column prop="date" label="#" type="index" width="150">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="448">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="448">
        </el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      authorityList: []
    }
  },
  created() {
    this.getAuthorityList()
  },
  methods: {
    async getAuthorityList() {
      const { data: res } = await this.$http.get(`rights/list`)
      console.log(res)
      this.authorityList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-top: 15px;
  box-shadow: rgba(0, 0, 0, 0.15);
}
</style>
