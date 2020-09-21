<template>
  <div>
    <!--1.面包屑-->
    <my-bread level1="用户管理" level2="用户管理"></my-bread>
    <el-card class="card">
      <!--2.输入框-->
      <el-input
        placeholder="请输入内容"
        class="input-with-select"
        v-model="query"
        clearable
        @clear="handleClear()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getUserListData()"
        ></el-button>
      </el-input>
      <el-button type="success" class="addUser" @click="handleAddUser()" plain
        >添加用户</el-button
      >

      <!--3.表格-->
      <el-table
        :data="userListData"
        style="width: 100%"
        class="el-table"
        border
        stripe
      >
        <el-table-column type="index" label="#" width="100"> </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180"
        ></el-table-column>
        <el-table-column prop="email" label="邮箱" width="220">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="220">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="220">
        </el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleUserStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
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
                circle
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
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
                circle
                size="mini"
                @click="showDeleteDialog(scope.row.id)"
              ></el-button>
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
                circle
                size="mini"
                @click="showSetUserRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 4.分页 接口支持分页 接口有pagesize或者pagenum之类 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 2, 5, 8]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--5. 对话框 -->
    <!--5.1.添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogFormVisibleAdd"
      width="40%"
      @close="handleClose()"
    >
      <el-form
        :model="ruleForm"
        :rules="addRules"
        ref="ruleFormRef"
        :label-width="formLabelWidth"
      >
        <el-form-item
          label="用户名"
          prop="username"
          :label-width="formLabelWidth"
        >
          <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          :label-width="formLabelWidth"
        >
          <el-input v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleCancle()">取 消</el-button>
        <el-button type="primary" @click="handledefineBtn()">确 定</el-button>
      </div>
    </el-dialog>
    <!--5.2.修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogFormVisibleEdit"
      @close="handleEditClose()"
    >
      <el-form :model="editForm" :rules="editRules" ref="editFormRef">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input
            v-model="editForm.username"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" :label-width="formLabelWidth">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleEditUserInfo()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--5.3.分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogSetRoleVisible">
      <el-form :model="ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{ userInfo.username }}
        </el-form-item>
        <el-form-item label="角色名" :label-width="formLabelWidth">
          {{ userInfo.role_name }}
        </el-form-item>
        <el-form-item label="分配新角色" :label-width="formLabelWidth">
          <!-- 如果el-select绑定的数据值和options的value一样，就会显示option的lable值 -->
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="(item, index) in rolesList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSetRoleVisible= false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        //合法的邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    //验证手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3|4|5|7|8]\d{9}$/
      if (regMobile.test(value)) {
        //合法的手机号码
        return callback()
      }
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0,
      userListData: [],
      //保存所有角色数据列表
      rolesList: [],
      //需要被分配的角色用户信息
      userInfo: {},
      //添加用户对话框
      dialogFormVisibleAdd: false,
      //修改用户对话框
      dialogFormVisibleEdit: false,
      //分配角色对话框
      dialogSetRoleVisible: false,
      currUserName: '',
      selectRoleId: -1,
      ruleForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      //查询到的用户信息
      editForm: {
        mobile: '',
        email: ''
      },
      //添加用户验证规则对象
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      //修改用户验证规则对象
      editRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      formLabelWidth: '90px'
    }
  },
  created() {
    this.getUserListData()
  },
  methods: {
    handleSizeChange(val) {
      this.pagenum = val
      this.getUserListData()
    },
    handleCurrentChange(val) {
      this.pagesize = val
      this.getUserListData()
    },
    //获取用户列表数据
    async getUserListData() {
      const { data: res } = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      )
      // console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('获取列表数据失败')
      this.userListData = res.data.users
      this.total = res.data.total
    },
    //调用api接口 保存用户状态 数据库存储起来
    async handleUserStateChange(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      console.log(res)

      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('保存用户状态失败')
      }
      this.$message.success('保存用户状态成功')
    },
    //清空按钮 重新发送请求获取列表数据
    handleClear() {
      this.getUserListData()
    },
    //点击按钮 添加用户
    handleAddUser() {
      this.dialogFormVisibleAdd = true
    },
    dialogFormVisibleCancle() {
      this.ruleForm = {}
      this.dialogFormVisibleAdd = false
    },
    //添加用户对话框关闭重置表单
    handleClose() {
      this.$refs.ruleFormRef.resetFields()
    },
    //点击添加用户对话框确定按钮
    handledefineBtn() {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return
        //可以发起添加用户的网络请求
        const { data: res } = await this.$http.post(`users`, this.ruleForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getUserListData()
        //清空列表内容
        this.$refs.ruleFormRef.resetFields()
        this.dialogFormVisibleAdd = false
      })
    },
    //编辑按钮
    async showEditDialog(id) {
      console.log(id)
      this.dialogFormVisibleEdit = true
      const { data: res } = await this.$http.get(`users/` + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
    },
    //关闭修改对话框 重置表单
    handleEditClose() {
      this.$refs.editFormRef.resetFields()
    },
    //点击修改对话框确定按钮 修改用户信息并提交
    handleEditUserInfo() {
      //提交之前要预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error(res.meta.msg)
        //通过就发送api请求 修改用户信息
        const { data: res } = await this.$http.put(
          `users/` + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        //关闭对话框
        this.dialogFormVisibleEdit = false
        //提示
        this.$message.success(res.meta.msg)
        //重新获取列表数据
        this.getUserListData()
      })
    },
    //删除用户角色
    showDeleteDialog(id) {
      this.$confirm('删除文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          //发送一个删除的请求:id 用户id
          const { data: res } = await this.$http.delete('users/' + id)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          ////提示
          this.$message.success(res.meta.msg)
          //重新获取列表数据
          this, this.getUserListData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //分配用户角色
    async showSetUserRoleDialog(userInfo) {
      this.userInfo = userInfo
      this.dialogSetRoleVisible = true
      console.log(userInfo);
       //获取角色列表
      const { data: res1 } = await this.$http.get(`roles`)
      console.log(res1)
      this.rolesList = res1.data
    },
    //分配用户角色对话框确定按钮
    async saveRoleInfo() {
      if(!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色')
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId
        }
      )
      console.log(res)
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg),
        this.dialogSetRoleVisible = false
      }
      this.$message.success(res.meta.msg)
      this.getUserListData()
      this.dialogSetRoleVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-top: 15px;
  box-shadow: rgba(0, 0, 0, 0.15);
}
.input-with-select {
  width: 25%;
  margin-top: 5px;
}
.addUser {
  margin-left: 10px;
}
.table {
  margin-top: 15px;
}
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
