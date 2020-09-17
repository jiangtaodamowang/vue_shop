<template>
  <div>
    <!--1.面包屑-->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 2.卡片 -->
    <el-card class="card">
      <el-button type="primary" class="addBtn">添加角色</el-button>
      <!-- 2.1 表格 -->
      <el-table :data="roleList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['borderBottom', index1 === 0 ? 'borderTop' : '']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  class="elTag"
                  @close="handleDelete(scope.row, item1.id)"
                >
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="['borderBottom', index2 === 0 ? 'borderTop' : '']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      class="elTag"
                      @close="handleDelete(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-row
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      :class="['borderBottom', index3 === 0 ? 'borderTop' : '']"
                    >
                      <el-tag
                        closable
                        type="warning"
                        class="elTag"
                        @close="handleDelete(scope.row, item3.id)"
                      >
                        {{ item3.authName }}
                      </el-tag>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <span v-if="scope.row.children.length===0">未分配权限 </span>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="80"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          width="250"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
                >编辑</el-button
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="showDeleteDialog(scope.row.id)"
                >删除</el-button
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <!-- 分配角色按钮 -->
              <el-button
                type="success"
                icon="el-icon-check"
                size="mini"
                @click="showSetRightDialog(scope.row)"
                >分配角色</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限弹框 -->
      <el-dialog title="分配权限" :visible.sync="dialogSetRightVisible"  @close="handleCloseDialog">
        <!-- 树型控件 -->
        <el-tree
          ref="tree"
          :data="rightsListData"
          show-checkbox
          default-expand-all
          node-key="id"
          :default-checked-keys="arrayCheck"
          :props="treeProps"
        >
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSetRightVisible = false">取 消</el-button>
          <el-button type="primary" @click="setSaveRightBtn()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      //分配角色对话框显示和隐藏
      dialogSetRightVisible: false,
      formLabelWidth: '80px',
      form: {
        name: '',
        region: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      //所有权限数据
      rightsListData: [],
      //树型控件绑定的属性对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      //默认选中权限id数组
      arrayCheck: [],
      //当前选中的角色id
      currRoleId: -1
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get(`roles`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        this.roleList = res.data
      }
    },
    //根据id删除对应权限
    // eslint-disable-next-line
    async handleDelete(role, rightId) {
      const confirmResult = await this.$confirm(
        '删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      // roles/:roleId/rights/:rightId
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      role.children = res.data
    },
    //分配权限 显示角色拥有的权限
    async showSetRightDialog(role) {
      // console.log(role)
      this.currRoleId = role.id
      this.dialogSetRightVisible = true
      //获取所有权限数据
      const { data: res } = await this.$http.get(`rights/tree`)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsListData = res.data
      
      //获取当前角色role的权限id
      const arrtemp = []
      role.children.forEach(item1 => {
        // arrtemp.push(item1.id)
        item1.children.forEach(item2 => {
          // arrtemp.push(item2.id)
          item2.children.forEach(item3 => {
            arrtemp.push(item3.id)
          })
        })
      })
      this.arrayCheck = arrtemp
    },
    //点击权限分配确定按钮
    // 请求路径：roles/:roleId/rights
    // roelId: 在上一个打开弹框的方法中 this.currRoleId = role,id
    // rid: 全选半选的id数组
    // 全选id数组 方法名getCheckedKeys()
    // 半选id数组 方法名getHalfCheckedKeys()

    async setSaveRightBtn() {
      let arr1 = this.$refs.tree.getCheckedKeys()
      let arr2 = this.$refs.tree.getHalfCheckedKeys()
      // ES6 展开运算符 ...数组或对象
      let arr = [...arr1, ...arr2]
      // console.log(arr1);
      // console.log(arr2);
      console.log(arr);
      const { data: res } = await this.$http.post(
        `roles/${this.currRoleId}/rights`,
        {
          rids: arr.join(',')
        }
      )
      console.log(res);
      if(res.meta.status !==200) {
        return this.$message.error(res.meta.msg)
      }
      //关闭对话框
      this.dialogSetRightVisible = false
      //更新视图
      this.getRoleList()
    },
    //关闭弹框 清空数组
    handleCloseDialog() {
      this.arrayCheck =[]
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-top: 15px;
  box-shadow: rgba(0, 0, 0, 0.15);
}
.addBtn {
  margin-bottom: 15px;
}
.borderTop {
  border-top: 1px solid #eee;
}
.borderBottom {
  border-bottom: 1px solid #eee;
}
.elTag {
  margin: 7px;
}
.el-col el-col-5 {
  display: flex;
  align-items: center;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
