<template>
  <div>
    <!--1.面包屑-->
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <!--2.卡片  -->
    <el-card>
      <!-- 输入框 -->
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="index" label="#" width="80"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="380">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100">
        </el-table-column>
        <el-table-column label="是否付款" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success">
              <!-- {{scope.row.pay_status===0?'未付款':'已付款'}} -->
              已付款
            </el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100">
        </el-table-column>
        <el-table-column label="下单时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.create_time | fmdate }}
          </template>
        </el-table-column>
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
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="定位"
              placement="top"
              :enterable="false"
            >
              <!-- 定位按钮 -->
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="showLocalDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
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
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogLoaclFormVisible"
      width="50%"
      @closed="handleClose()"
    >
      <el-form
        :model="addressForm"
        :rules="modifyAddressRules"
        ref="modifyFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县:" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="citydata"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详情地址:" prop="address2">
          <el-input
            v-model="addressForm.address2"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLoaclFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogLoaclFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 查看物流对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogProgressiveVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      orderList: [],
      total: 0,
      // 控制修改地址对话框显示与隐藏的按钮
      dialogLoaclFormVisible: false,
      addressForm: {
        address1: '',
        address2: ''
      },
      modifyAddressRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写具体地址', trigger: 'blur' }
        ]
      },
      // 城市列表数据
      citydata: citydata,
      // 控制查看物流进度的对话框
      dialogProgressiveVisible: false,
      // 物流信息数据
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get(`orders`, {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getOrderList()
    },
    // 点击编辑按钮 展示对话框
    showEditDialog() {
      this.dialogLoaclFormVisible = true
    },
    handleChange() {
      console.log('ok')
    },
    // 关闭对话框
    handleClose() {
      this.$refs.modifyFormRef.resetFields()
    },
    async showLocalDialog() {
      this.dialogProgressiveVisible = true
      const { data: res } = await this.$http.get(`/kuaidi/1106975712662`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.progressInfo = res.data
      console.log(this.progressInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.el-input {
  width: 380px;
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.el-cascader {
  width: 46%;
}
</style>
