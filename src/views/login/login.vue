<template>
  <div class="login">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>登录与注册</span>
      </div>
      <div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          label-width="80px"
          :rules="loginFormRules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              prefix-icon="el-icon-user-solid"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              prefix-icon="el-icon-lock"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="loginBtn" type="primary" @click="handleLogin()"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200)
          return this.$message.error('用户名或密码错误,登录失败')
        this.$message.success('恭喜你,登录成功')
        //1.将登录成功之后的token，保存到客户端的sessionStroage
        //  1.1 项目中除了登录之外的API接口,必须在登录之后才能访问
        //  1.2 token只在当前网站打开期间生效 所以将token保存在sessionStroage中
        window.sessionStorage.setItem('token', res.data.token)
        //2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
}
.box-card {
  width: 550px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.box-card span {
  font-weight: bold;
  font-size: 20px;
}
.loginBtn {
  width: 200px;
  height: 40px;
  margin-left: 80px;
  background: #409eff;
  border-color: #409eff;
}
</style>
