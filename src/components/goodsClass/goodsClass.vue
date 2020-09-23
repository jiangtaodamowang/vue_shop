<template>
  <div>
    <!--1.面包屑区域-->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <!--2.卡片视图区域 -->
    <el-card class="card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="handleAddCate()"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 3.表格区域 -->
      <!-- 分类表格
          :data(设置数据源 数组) :columns(设置表格中列配置信息) :selection-type(是否有复选框)
          :expand-type(是否展开数据) show-index(是否设置索引列) index-text(设置索引列头)
          border(是否添加纵向边框) :show-row-hover(是否鼠标悬停高亮) -->
      <tree-table
        class="treeTable"
        show-index
        index-text="#"
        border
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:green"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="waring" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="danger" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <template slot="option" slot-scope="scope">
          <!-- 修改按钮 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
          </el-tooltip>
          <!-- 删除按钮 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="showDeleteDialog(scope.row.id)"
              >删除</el-button
            >
          </el-tooltip>
        </template>
      </tree-table>
      <!--4. 分页区域 -->
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--5.1 添加分类弹框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogAddCateVisible"
      @close="addcateDialogVisible"
    >
      <el-form :model="addCateForm" :rules="rules" ref="addCateForm">
        <el-form-item
          label="分类名称:"
          prop="cat_name"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="addCateForm.cat_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级分类:" :label-width="formLabelWidth">
          <!-- options 指定数据源 -->
          <!-- props 用来指定级联选择器配置选象 -->
          <!-- v-model 必须绑定的是数组 -->
          <!-- change-on-select 允许选择任意一个 -->
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            @change="handleChange"
            :props="cascaderProps"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsClass()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类的数据列表
      cateList: [],
      //查询条件
      queryInfo: {
        type: 3,
        //当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5
      },
      //总数据条数
      total: 0,
      //为table指定列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 自定义模板列
          type: 'template',
          // 模板名
          template: 'isOk'
        },
        {
          label: '排序',
          prop: 'cat_level',
          // 自定义模板列
          type: 'template',
          // 模板名
          template: 'sort'
        },
        {
          label: '操作',
          // 自定义模板列
          type: 'template',
          // 模板名
          template: 'option'
        }
      ],
      // 控制添加分类的显示与隐藏
      dialogAddCateVisible: false,
      //修改用户对话框
      dialogFormVisibleEdit: false,
      form: {},
      formLabelWidth: '90px',
      //添加分类的表单
      addCateForm: {
        // 将要添加分类的名称
        cat_name: '',
        // 分类的等级 默认等级为一级
        cat_level: 0,
        // 父级父类的id
        cat_pid: 0
      },
      //添加分类表达的验证规则
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      //父级分类的列表
      parentCateList: [],
      //指定级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        children: 'children',
        label: 'cat_name'
      },
      //选中的父级分类id数
      selectKeys: []
    }
  },
  created() {
    this.getGoodsCateList()
  },
  methods: {
    // 获取父级分类列表的数据
    async getGoodsCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data.result
      //为总数据赋值
      this.total = res.data.total
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getGoodsCateList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getGoodsCateList()
    },
    //点击添加分类按钮 打开对话框
    handleAddCate() {
      //先获取父级分类的列表
      this.getGoodsCateListBtn()
      //在展开对话框
      this.dialogAddCateVisible = true
    },
    async getGoodsCateListBtn() {
      const { data: res } = await this.$http.get(`categories`, {
        params: { type: 2 }
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化时触发这个函数
    handleChange() {
      // console.log(this.selectKeys)
      // 如果selectKeys的length大于0 证明选中父级分类
      // 反正等于0 则没有选中父级分类
      if (this.selectKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    async addGoodsClass() {
      this.$refs.addCateForm.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories`,
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        console.log(res)
        this.$message.success(res.meta.msg)
      })

      //重新获取数据
      this.getGoodsCateList()
      //关闭对话框
      this.dialogAddCateVisible = false
    },
    //监听对话框关闭事件 重置表单数据
    addcateDialogVisible() {
      this.$refs.addCateForm.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    showDeleteDialog(id) {
      this.$confirm('删除该分类文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          //发送一个删除的请求:id 用户id
          const { data: res } = await this.$http.delete('categories/' + id)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          //提示
          this.$message.success(res.meta.msg)
          //重新获取列表数据
          this.getGoodsCateList()
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
    showEditDialog() {}
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-top: 15px;
}
.treeTable {
  margin-top: 10px;
}
.pagination {
  margin-top: 10px;
}
.el-cascader {
  width: 100%;
}
</style>
