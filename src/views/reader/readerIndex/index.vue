<template>
  <div style="display: inline-block">
    <el-card class="announcement">
      <h3 style="margin-left: 50px" >公告栏</h3>
      <div  class="loading-container">
        <el-loading-spinner></el-loading-spinner>
      </div>
      <div v-if="noticeList.length === 0" class="no-data">
        <p>暂无公告</p >
      </div>
      <div v-else>
        <el-timeline>
          <el-timeline-item
              v-for="(notice, index) in noticeList"
              :key="index"
              :timestamp="notice.createTime"
          >
            <h4>{{ notice.title }}</h4>
            <p>{{ notice.content }}</p >
          </el-timeline-item>
        </el-timeline>
      </div>

      <div style="padding: 10px 0; margin-left: 50px">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>


  <div style="width: 600px;display: inline-block">
    <el-card>
      <div >
        <h3 style="margin-left: 20px" > 本月热点图书</h3>

      </div>
      <div class="chart-container">
        <div ref="chart" class="chart"></div>
      </div>
      <div>
        <el-radio-group v-model="type" class="ml-4" @change="getMapData">
          <el-radio label='1' size="large">借阅最多</el-radio>
          <el-radio label='2' size="large">评论最多</el-radio>
        </el-radio-group>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";
import * as echarts from 'echarts'
export default {
  name: "readerIndex",
  data() {
    return {
      type:'1',
      noticeList: [],
      //分页
      currentPage: 1,
      pageSize: 5,
      total: 0,
    };
  },
  mounted() {
    this.getNotice();
    this.getMapData()
  },
  methods: {
    getNotice() {

        request.post("/reader/noticeInfo/getNotice/"+this.currentPage+'/'+this.pageSize).then(res=>{
          if(res.code==0){
            this.noticeList=res.content.records
            this.total=res.content.total
          }else {
            this.$message.error(res.message)
          }
        })
    },

    getMapData(){
      request.get('/reader/bookInfo/getMapData/'+this.type).then(res=>{
        if(res.code==0){
          const chart = echarts.init(this.$refs.chart)
          chart.setOption(
              {
                xAxis: {
                  type: 'category',
                  data: res.content.name,
                  axisLabel: {
                    //x轴文字的配置
                    show: true,
                    interval: 0,//使x轴文字显示全
                  }

                },
                tooltip:{
                  show:true
                },
                yAxis: {
                  type: 'value'
                },

                series: [
                  {
                    data: res.content.data,
                    type: 'bar',
                    itemStyle: {
                      color: function(params) {
                        //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                        var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622'];
                        return colorList[params.dataIndex]
                      }
                    }
                  }
                ]
              }
          )
          chart.on('click',(params)=>{
            request.get('/reader/bookInfo/getBookByName/'+params.name).then(res=>{
              if(res.code==0){
                let bookId=res.content.bookId
                 this.$router.push({ name: 'bookDetail', params: { bookId }})
              }else {
                this.$message.error(res.message)
              }
            })
            console.log(params.name)
            // this.$router.push({ name: 'bookDetail', params: { params. }})
          })

          // this.chartData.xAxis.data=res.content.name
          // this.chartData.series[0].data=res.content.data
        }else {
          this.$message.error(res.message)
        }
      })
    },

    //更改每页条数
    handleSizeChange(pageSize) {
      this.pageSize=pageSize
      this.getNotice()
    },
    //更改当前页
    handleCurrentChange(currentPage) {
      this.currentPage=currentPage
      this.getNotice()
    },
  },

}
</script>

<style scoped>
.announcement {
  width: 600px;
  height: 630px;
  margin: 0 50px;
}
.loading-container {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.no-data {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.chart-container {
  width: 100%;
  height: 490px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>