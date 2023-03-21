<template>
<div style="width: 1300px;margin: 30px auto">
  <el-table :data="adviceData" border stripe title="反馈列表">
    <el-table-column align="center" prop="adviceId" label="反馈号"/>
    <el-table-column align="center" prop="readerId" label="读者号"/>
    <el-table-column align="left" prop="content" label="反馈内容"/>
    <el-table-column align="center" prop="createTime" label="反馈时间"/>
  </el-table>
  <div style="margin: 15px 450px">
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
</div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "adviceInfo",
  data(){
    return{
      adviceData:[],
      //分页
      currentPage: 1,
      pageSize: 10,
      total: 0,
    }
  },
  created() {
    this.getAdvice()
  },
  methods:{
    getAdvice(){
      request.post('/admin/adviceInfo/getAdvice/'+this.currentPage+'/'+this.pageSize).then(res=>{
        if (res.code==0){
          this.adviceData=res.content.records
          this.total=res.content.total
        }else {
          this.$message.error(res.message)
        }
      })
    },
    //更改每页条数
    handleSizeChange(pageSize) {
      this.pageSize=pageSize
      this.getAdvice()
    },
    //更改当前页
    handleCurrentChange(currentPage) {
      this.currentPage=currentPage
      this.getAdvice()
    },
  }
}
</script>

<style scoped>

</style>