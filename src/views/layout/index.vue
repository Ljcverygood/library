<template>

  <div class="common-layout">
    <el-container>
      <el-header>

        <el-menu
            :default-active="$route.path" router
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            @select="handleSelect"
            style="width: 100%"
        >
          <span class="title" v-if="this.userInfo.username=='admin'">图书馆后台管理系统</span>
          <span class="title" v-else style="display: flex">欢迎来到在线图书馆</span>

          <el-menu-item index="readerIndex" v-if="userInfo.username!='admin'">首页</el-menu-item>
          <el-menu-item index="bookManage" v-if="userInfo.username=='admin'">图书管理</el-menu-item>
          <el-menu-item index="bookQuery" v-else>图书查询</el-menu-item>
          <el-menu-item index="readerManage" v-if="userInfo.username=='admin'">读者管理</el-menu-item>
          <el-menu-item index="personal" v-else>个人信息</el-menu-item>
          <el-menu-item index="brManage" v-if="userInfo.username=='admin'">借还管理</el-menu-item>
          <el-menu-item index="noticeManage" v-if="userInfo.username=='admin'">公告管理</el-menu-item>
          <el-menu-item index="myBR" v-else>我的借还</el-menu-item>
          <el-menu-item index="comments" v-if="userInfo.username=='admin'">评论管理</el-menu-item>
          <el-menu-item index="myMessage" v-if="userInfo.username!='admin'">我的消息</el-menu-item>
          <el-menu-item index="adviceInfo" v-if="userInfo.username=='admin'">反馈列表</el-menu-item>
          <el-menu-item index="advice" v-else>意见反馈</el-menu-item>
          <el-menu-item index="fixPassword" v-if="userInfo.username!='admin'">密码修改</el-menu-item>
          <el-menu-item index="bookDetail" v-if="1==0">图书详情</el-menu-item>

          <div v-if="userInfo.username=='admin'" style=" margin-left: 340px;text-align: center;">
            <div style="float: left">
              <el-avatar style="margin-top: 5px"
                         src="https://ts1.cn.mm.bing.net/th/id/R-C.2ce48cd4a70b48403a56e9ea8c710355?rik=tU9CL%2fR0TMLEYA&riu=http%3a%2f%2fwww.kutoo8.com%2fupload%2fimage%2f63051471%2f4_1920x1080.jpg&ehk=wZm6BwD%2b8TIDXmqxTntxftDP8IzjD8g3hhI6bEwdb54%3d&risl=&pid=ImgRaw&r=0"></el-avatar>
            </div>
            <div style="float: right;margin-top: 15px;margin-left: 5px">
              <span style="font-size: 20px;color: white">{{ userInfo.username }}</span>
              <el-button link type="" style="font-size: 10px;color: white;margin-left: 5px;" @click="logout">退出登录
              </el-button>
            </div>
          </div>

          <div v-else style=" margin-left: 280px;text-align: center;">
            <div style="float: left">
              <el-avatar style="margin-top: 5px" :src="this.userInfo.avatar"></el-avatar>
            </div>
            <div style="float: right;margin-top: 15px;margin-left: 5px">
              <span style="font-size: 20px;color: white">{{ userInfo.username }}</span>
              <el-button link type="" style="font-size: 10px;color: white;margin-left: 5px;" @click="logout">退出登录
              </el-button>
            </div>
          </div>
        </el-menu>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>



  <el-dialog v-model="dialogFormVisible" :show-close="false" :close-on-click-modal="false" title="首次登录完善个人信息">
    <el-form
        ref="dialogForm"
        label-width="100px"
        :model="dialogForm"
        :rules="rules"
    >
      <el-form-item label="头像：">
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

      <el-form-item label="姓名：" prop="username">
        <el-input v-model="dialogForm.username"/>
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-select v-model="dialogForm.sex" placeholder="请选择" style="width: 40%;">
          <el-option :value="1" label="男"></el-option>
          <el-option :value="0" label="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期：" prop="birth">
        <el-date-picker
            v-model="dialogForm.birth"
            type="date"
            placeholder="选择出生日期"
            style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="dialogForm.address"/>
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input v-model="dialogForm.phone"/>
      </el-form-item>
      <el-button type="primary" @click="saveInfo">保存</el-button>
    </el-form>

  </el-dialog>
</template>

<script setup>
import { Plus} from "@element-plus/icons-vue";
</script>
<script>
import request from "@/utils/request";
import router from "@/router";

export default {
  name: "admin",
  data() {
    return {
      userInfo: {
        avatar: '',
        username: ''
      },
      imageUrl:null,
      //自动上传
      autoUpload:true,
      dialogForm:{},
      dialogFormVisible:false,
      activeIndex: '',
      rules: {
        username: [{required: true, message: '请输入姓名', trigger: 'blur'}],
        sex: [{required: true, message: '请选择性别', trigger: 'blur'}],
        birth: [{required: true, message: '请选择出生日期', trigger: 'blur'}],
        address: [{required: true, message: '请输入地址', trigger: 'blur'}],
        phone: [{required: true, message: '请输入手机号', trigger: 'blur'}],
      },

    }
  },
  watch: {
    $route() {
      this.handleSelect(this.activeIndex)
    }
  },
  created() {

    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      console.log('router',router.currentRoute.value.path.slice(1,6));
      let currentPage=router.currentRoute.value.fullPath.slice(1,6)
      if (currentPage=='admin') {
        request.get('/admin/getAdmin').then(res => {
          if (res.code === 0) {
            this.userInfo.username = res.content
          }else {
            this.$message.error(res.message)
          }
        })
      }else {
        request.get('/readerCard/getReader').then(res=>{
          if(res.code==0){
            this.userInfo.username=res.content.username
            this.userInfo.avatar=res.content.avatar
            if(res.content.isFirstLogin==0){
              this.dialogFormVisible=true
              this.dialogForm=res.content
            }
          }else {
            this.$message.error(res.message)
          }
        })
      }
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
    //
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
    handleSelect(index) {
      this.activeIndex = index
    },
    logout() {
      this.$confirm('确认要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        request.get("/admin/logout").then(res=>{
          if(res.code==0){
            localStorage.clear();
            this.$router.push('/login')
          }else {
            this.$message.error(res.message)
          }
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消退出登录'
        });
      })



    }
  }
}
</script>

<style scoped>
.title {
  font-size: 30px;
  color: white;
  justify-content: center;
  margin: auto 30px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
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