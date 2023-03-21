<template>

  <div class="login" clearfix>
    <div style="margin-top: 100px;font-size: 40px;font-style: oblique;color: white">欢迎使用在线图书馆</div>
    <div class="login-wrap">
      <el-row type="flex" justify="center">
        <el-form ref="loginForm" :model="user" :rules="rules"  label-width="80px">
          <h3>登录</h3>
          <hr>
          <el-form-item prop="username" label="用户名">
            <el-input v-model="user.username" placeholder="请输入用户名" prefix-icon></el-input>
          </el-form-item>
          <el-form-item id="password" prop="password" label="密码">
            <el-input v-model="user.password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-checkbox v-model="isAdmin" style="margin-left: -30px"  label="管理员登录" size="small" />

          <el-form-item>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-button style="margin-top: 10px" type="primary" icon="el-icon-upload" @click="doLogin()">登 录</el-button>
          </el-form-item>
          <el-form-item style="margin-left: -30px">
            <router-link to="/findPassword">找回密码</router-link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <router-link to="/register">注册账号</router-link>
          </el-form-item>

        </el-form>
      </el-row>
    </div>
  </div>
</template>
 
<script>
import request from "@/utils/request";
export default {
  name:'login',
  data() {
    return {
      user: {
        username: "",
        password: ""
      }  ,
      isAdmin:false,
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
      },
    };
  },
  created() {},
  methods: {
    doLogin() {
      this.$refs['loginForm'].validate((valid) => {
        if (!valid) {
          this.$message.warning('* 号为必填项，请重新输入')
          return
        }
        if(this.isAdmin==true){
          request.post("/admin/login",{'username': this.user.username, 'password': this.user.password}).then(res=>{
            if(res.code==0){
              // // 存储token开始时间
              // window.localStorage.setItem('tokenStartTime',new Date().getTime())
              // 存储token
              console.log(res.content.token)
              localStorage.setItem('token', res.content.token)
              let token=localStorage.getItem('token')

              this.$router.push({path: "/admin" })

            }else {
              this.$message.error(res.message)
            }
          })
        }else {
          request.post("/readerCard/login",{'username': this.user.username, 'password': this.user.password}).then(res=>{
            if(res.code==0){
              // // 存储token开始时间
              // window.localStorage.setItem('tokenStartTime',new Date().getTime())
              // 存储token
              console.log(res.content.token)
              sessionStorage.setItem('id',res.content.id)
              localStorage.setItem('token', res.content.token)
              let token=localStorage.getItem('token')

              this.$router.push({path: "/reader" })

            }else {
              this.$message.error(res.message)
            }
          })
        }
      })
    }
  }
};
</script>
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.login {
  width: 100%;
  height: 740px;
  background: url("../../assets/images/bg1.jpg") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}
.login-wrap {
  background: url("../../assets/images/login-warp.png") no-repeat;
  border-radius: 20px;
  background-size: cover;
  width: 400px;
  height: 350px;
  margin: 50px auto;
  overflow: hidden;
  padding-top: 10px;
  line-height: 40px;
}
#password {
  margin-bottom: 5px;
}
h3 {
  color: #0babeab8;
  font-size: 24px;
}
hr {
  background-color: #444;
  margin: 20px auto;
}
a {
  text-decoration: none;
  color: #aaa;
  font-size: 15px;
}
a:hover {
  color: coral;
}
.el-button {
  width: 80%;
  margin-left: -50px;
}
</style>