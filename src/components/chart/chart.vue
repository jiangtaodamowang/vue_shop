<template>
  <div>
    <!--1.面包屑-->
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <!--2.卡片-->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'loadsh'

export default {
  data() {
    return {
      // options用来和后端数据合并的

      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  // created() {
  //   this,getReportList()
  // },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get(`reports/type/1`)
    console.log(res.data)
    
    const resultData = _.merge(res.data,this.options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(resultData)
  }
  // methods: {
  //   getReportList() {

  //   }
  // }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>
