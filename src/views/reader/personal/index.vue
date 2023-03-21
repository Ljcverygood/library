<template>
  <div style="margin: 20px auto;width: 500px">
    <el-card>
    <el-descriptions column="1" size="default" border title="我的信息">
      <el-descriptions-item label-align="right"  label="头像">
        <el-image style="width: 50px" :src="userInfo.avatar"></el-image>
      </el-descriptions-item>
      <el-descriptions-item label-align="right"  label="读者号">
        {{ userInfo.readerId }}
      </el-descriptions-item>
      <el-descriptions-item label-align="right" label="姓名">
        {{ userInfo.username }}
      </el-descriptions-item>
      <el-descriptions-item label-align="right" label="性别">
        <span v-if="userInfo.sex==0">女</span>
        <span v-if="userInfo.sex==1">男</span>
      </el-descriptions-item>
      <el-descriptions-item label-align="right" label="出生日期">
        {{ userInfo.birth }}
      </el-descriptions-item>
      <el-descriptions-item label-align="right" label="地址">
        {{ userInfo.address }}
      </el-descriptions-item>
      <el-descriptions-item label-align="right" label="电话">
        {{ userInfo.phone }}
      </el-descriptions-item>
      <el-descriptions-item label-align="right" label="邮箱">
        {{ userInfo.email }}
      </el-descriptions-item>
    </el-descriptions>
      <el-button type="primary" style="margin-top: 10px;" @click="showDialog"> 编辑</el-button>
    </el-card>
  </div>

  <el-dialog title="编辑个人信息" v-model="dialogFormVisible" >
    <el-form
        ref="dialogForm"
        label-width="100px"
        :model="dialogForm"
        :rules="rules">
      <el-form-item label="头像" prop="avatar">
        <el-upload
            class="avatar-uploader"
            action="http://localhost:8081/readerInfo/upload"
            :show-file-list="false"
            name="imgFile"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="读者号" prop="readerId">
        <el-input v-model="dialogForm.readerId" disabled></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="username">
        <el-input v-model="dialogForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="dialogForm.sex"  placeholder="请选择" style="width: 40%;">
          <el-option :value="1" label="男"></el-option>
          <el-option :value="0" label="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期" prop="birth">
        <el-date-picker
            v-model="dialogForm.birth"
            type="date"
            placeholder="选择出生日期"
            style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="dialogForm.address"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="dialogForm.phone" ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dialogForm.email" disabled></el-input>
      </el-form-item>
      <el-button type="info" @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="saveInfo">保存</el-button>
    </el-form>

  </el-dialog>
</template>
<script setup>
import { Plus} from "@element-plus/icons-vue";
</script>
<script>
import request from "@/utils/request";

export default {
  name: "personal",

  data() {
    return {
      userInfo: {},
      dialogForm: {},
      dialogFormVisible: false,
      imageUrl:null,
      //自动上传
      autoUpload:true,
      rules: {
        username: [{required: true, message: '请输入姓名', trigger: 'blur'}],
        sex: [{required: true, message: '请选择性别', trigger: 'blur'}],
        birth: [{required: true, message: '请选择出生日期', trigger: 'blur'}],
        address: [{required: true, message: '请输入地址', trigger: 'blur'}],
        phone: [{required: true, message: '请输入手机号', trigger: 'blur'}],
      },
    }
  },
  created() {
    this.getUserInfo()
  },
  methods:{
    getUserInfo(){
      request.get('/readerInfo/getUserInfo').then(res=>{
        if(res.code==0){
          this.userInfo=res.content
        }else {
          this.$message.error(res.message)
        }
      })
    },

    //上传成功后
    //文件上传成功后的钩子，response为服务端返回的值，file为当前上传的文件封装成的js对象
    handleAvatarSuccess(response, file) {
      this.imageUrl=response.content;
      this.$message({
        message: response.message,
        type: response.code==0 ? 'success' : 'error'
      });
      //设置模型数据（图片名称），后续提交ajax请求时会提交到后台最终保存到数据库
      this.dialogForm.avatar = response.content;
    },
    //上传头像之前
    beforeAvatarUpload(file){
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    showDialog(){
      this.dialogFormVisible=true
      request.get('/readerInfo/getUserInfo').then(res=>{
        if(res.code==0){
          this.dialogForm=res.content
          this.imageUrl=this.dialogForm.avatar
        }else {
          this.$message.error(res.message)
        }
      })
    },
    saveInfo(){
      this.$refs['dialogForm'].validate((valid) => {
        if (!valid) {
          this.$message.warning('* 号为必填项，请重新输入')
          return
        }else if(!/^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/.test(this.dialogForm.phone)){
          this.$message.error("请输入正确的手机号码")
          return;
        }
        request.post('/readerInfo/refineInfo',this.dialogForm).then(res=>{
          if(res.code==0){
            this.dialogFormVisible=false
            this.getUserInfo()
            this.$message.success(res.message)
          }else {
            this.$message.error(res.message)
          }

        })
      })
    },
    //关闭弹窗
    closeDialog(){
      this.dialogFormVisible=false
      this.$refs['dialogForm'].clearValidate()
    }
  }
}
</script>

<style scoped>
.el-descriptions-item {
  width: 0px;
}
.title {
  font-size: 30px;
  color: white;
  justify-content: center;
  margin: auto 30px;
}

.avatar-uploader .avatar {
  width: 100px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>