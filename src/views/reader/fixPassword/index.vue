<template>
  <div style="margin: 20px auto;width: 500px">
    <el-form :model="passwordFrom" label-width="100px" ref="passwordFrom" :rules="rules">
      <el-form-item label="旧密码：" prop="oldPassword">
        <el-input v-model="passwordFrom.oldPassword" show-password/>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPassword">
        <el-input v-model="passwordFrom.newPassword" show-password/>
      </el-form-item>
      <el-button type="primary" @click="editPassword">保存</el-button>
    </el-form>
  </div>


</template>

<script>
import request from "@/utils/request";

export default {
  name: "fixPassword",
  data(){
    return{
      passwordFrom:{},
      rules:{
        newPassword:[{required:true,message:'请输入由大写字母、小写字母、数字、特殊符号中的2种及以上类型密码',trigger:'blur',pattern:/(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$)/}]
      }
    }
  },
  methods:{
    editPassword(){
      this.$refs['passwordFrom'].validate((valid) => {
        if (!valid) {
          this.$message.warning('请输入由大写字母、小写字母、数字、特殊符号中的2种及以上类型密码')
          return
        }else{
          request.put('/readerCard/editPassword',this.passwordFrom).then(res=>{
            if(res.code==0){
              this.$message.success(res.message)
              request.get("/admin/logout").then(res=>{
                if(res.code==0){
                  localStorage.clear();
                  this.$router.push('/login')
                }else {
                  this.$message.error(res.message)
                }
              })
            }else {
              this.$message.error(res.message)
            }
          })
        }

      })
    }
  }
}
</script>

<style scoped>

</style>