<template>
<div style="width: 800px;margin: 30px auto">
  <h2 style="margin-right: 400px">对图书馆或本系统提出您宝贵的意见</h2>
  <hr>
  <el-form :model="adviceForm" style="margin-top: 20px">
    <el-form-item title="内容">
      <el-input type="textarea"  v-model="adviceForm.content" :rows="6" placeholder="请填写反馈内容"/>
    </el-form-item>
  </el-form>
  <div style="float: right">
  <el-button type="primary" style="margin-top: 10px;" @click="saveAdvice"> 提交</el-button>
  <el-button type="info" style="margin-top: 10px;" @click="adviceForm.content=null"> 清除</el-button>
  </div>
</div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "advice",
  data(){
    return{
      adviceForm:{}
    }
  },
  methods:{
    saveAdvice(){
      if(this.adviceForm.content==null){
        this.$message.warning("反馈内容不能为空！")
        return
      }
      request.post('/reader/adviceInfo/saveAdvice',this.adviceForm).then(res=>{
        if(res.code==0){
          this.$message.success(res.message)
          this.adviceForm.content=null
        }else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>