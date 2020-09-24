<template>
  <div>
    <!--1.面包屑-->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!--.卡片区域  -->
    <el-card>
      <el-alert
        title="添加商品信息"
        center
        type="info"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsRules"
        ref="addGoodsFormRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <!-- :before-leave="beforeTabLeave" 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。Function(activeName, oldActiveName) -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="handleTabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodsForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- props 级联选择器配置项 必须有 -->
              <!-- v-model="addGoodsForm.goods_cat" 必须绑定数组 -->
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                @change="handleChange"
                :props="cateProps"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染列表的item项 -->
            <el-form-item
              :lable="item.attr_name"
              v-for="item in manyTabData"
              :key="item.attr_id"
            >
              {{ item.attr_name }}
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item1"
                  v-for="(item1, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- list-type 图片上传方式 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addGoods" @click="handleAddGoods()"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片展示 -->
    <el-dialog title="图片展示" :visible.sync="imgDialogVisible" width="50%">
      <img :src="fileUrl" class="fileImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'addGoods',
  data() {
    return {
      activeIndex: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类所属的数组
        goods_cat: [],
        // 存储图片的数组
        pics: [],
        // 商品详情介绍
        goods_introduce: '',
        // 商品的参数
        attrs: []
      },
      addGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      //选中的父级分类id数组
      // selectKeys: [],
      //指定级联选择器配置对象
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      //动态参数列表数据
      manyTabData: [],
      //静态参数列表数据
      onlyTabData: [],
      // 图片上传的地址
      uploadUrl: 'http://timemeetyou.com:8889/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      fileUrl: '',

      // 控制图片的显示与隐藏
      imgDialogVisible: false
    }
  },
  created() {
    // 获取所有分类商品数据
    this.getCateList()
  },
  methods: {
    // 获取分类数据
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.cateList = res.data
    },
    // 层级选择器
    handleChange(value) {
      console.log(value)
      // 不允许选择二级或者一级
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // tabs切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请选择未填项')
        return false
      }
    },
    //切换tab
    async handleTabClick(activeName) {
      // 证明访问的事动态参数面板
      if (activeName.index === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        // 给attr_vals转化成数组并以空格展示
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTabData = res.data
      } else if (activeName.index === '') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.onlyTabData = res.data
      }
    },
    // 点击预览事件
    handlePreview(file) {
      console.log(file)
      this.fileUrl = file.response.data.url
      this.imgDialogVisible = true
    },
    // 点击移除事件
    handleRemove(file) {
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      console.log(file)
      // 2. 从pics数组中，找到这个图片的索引值
      const i = this.addGoodsForm.pics.findIndex(x => {
        x.pic === filePath
      })
      // 3. 调用数组的splice方法 把图片信息对象从pics数组中删除
      this.addGoodsForm.pics.splice(i, 1)
      console.log(this.addGoodsForm)
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      console.log(response)
      // 1 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2 将图片信息对象 push到pics数组中
      this.addGoodsForm.pics.push(picInfo)
      // console.log(this.addGoodsForm)
    },
    // 添加商品按钮
    handleAddGoods() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请完成填写必要的空白项')
        }
        // 执行添加的业务逻辑
        // 级联选择器v-model绑定的goods_cat必须是数组 而提交商品业务逻辑goods_cat又要是字符串 这就有点尴尬了
        // 这个时候就需要用到loadsh cloneDeep(obj)  深拷贝一个addGoodsForm为form给提交商品用 而级联选择器还是用原来的addGoodsForm
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        console.log(form)

        // 处理动态参数
        this.manyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addGoodsForm.attrs.push(newInfo)
        })

        // 处理静态属性
        this.onlyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        form.attrs = this.addGoodsForm.attrs
        console.log(form)

        //发送请求 添加商品
        const {data: res} = await this.$http.post(`goods`,form)
        console.log(res)
         if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
  height: auto;
}
.el-steps {
  margin-top: 15px;
}
.el-tabs {
  margin-top: 15px;
}
.fileImg {
  width: 100%;
}
.ql-editor {
  min-height: 280px;
}
.addGoods {
  margin-top: 15px;
}
</style>
