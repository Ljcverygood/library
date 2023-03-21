<template>
  <div class="login clearfix">
    <div style="margin-top: 100px;font-size: 40px;font-style: oblique;color: white">欢迎使用在线图书馆</div>
    <div class="login-wrap">
      <el-row type="flex" justify="center">
        <el-form ref="loginForm" :model="user" status-icon label-width="80px">
          <h3>注册</h3>
          <hr>
          <el-form-item prop="username" label="用户名">
            <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱" :inline="true">

            <el-input v-model="user.email" placeholder="请输入邮箱"></el-input>
            <el-button style="width: 80px;margin-top: 10px;margin-left: 1px" size='small' @click="send" v-if="isSend">
              发送验证码
            </el-button>
            <el-button style="width: 80px;margin-top: 10px;margin-left: 1px" size='small' v-if="!isSend">
              {{ this.sendMsg }}
            </el-button>

          </el-form-item>
          <!--          <el-form-item style="margin-left: 50px">-->
          <!--            -->
          <!--          </el-form-item>-->
          <el-form-item label="验证码">
            <el-input v-model="this.captcha" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="设置密码">
            <el-input v-model="user.password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-left: -10px;margin-top: 10px" icon @click="doRegister">注册账号
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-button type="info" style="width: 80px;margin-left: 220px" text :icon="Back" @click="this.$router.go(-1)">返回
      </el-button>
    </div>
  </div>
</template>

<script setup>
import {Back} from "@element-plus/icons-vue";


</script>
<script>

import request from "@/utils/request";

export default {
  name: 'register',
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: ""
      },
      isSend: true,
      sendMsg: '发送验证码',
      captcha: ''//验证码
    };
  },
  created() {
    // console.log($);
    // console.log("1111");
  },
  methods: {
    send() {
      if (!this.user.email) {
        this.$message.warning("请输入邮箱！");
        return;
      } else if (this.user.email != null) {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!reg.test(this.user.email)) {
          this.$message.warning("请输入有效的邮箱！");
        } else {
          request.get('/readerCard/getRegisterCaptcha?email=' + this.user.email).then(res => {
            if (res.code == 0) {
              this.$message.success(res.message)
              this.isSend = false;
              let timer = 60;
              this.sendMsg = timer + "s";
              this.timeFun = setInterval(() => {
                --timer;
                this.sendMsg = timer + "s";
                if (timer == 0) {
                  this.isSend = true;
                  this.sendMsg = "重新发送";
                  clearInterval(this.timeFun);
                }
              }, 1000);
            } else {
              this.$message.error(res.message)
            }
          })
        }
      }
    },
    doRegister() {
      if (!this.user.username) {
        this.$message.warning("请输入用户名！");
        return;
      } else if (!this.user.email) {
        this.$message.warning("请输入邮箱！");
        return;
      } else if (!this.user.password) {
        this.$message.warning("请输入密码！");
        return;
      } else if (!this.captcha) {
        this.$message.warning("请输入验证码！")
        return;
      } else if (this.user.email != null) {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!reg.test(this.user.email)) {
          this.$message.warning("请输入有效的邮箱！");
          return;
        } else if (this.user.password != null) {
          var passwordReg = /(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$)/;
          if (!passwordReg.test(this.user.password)) {
            this.$message.warning('密码必须由大写字母、小写字母、数字、特殊符号中的2种及以上类型组成!');
            return;
          }
        }

        request.post("/readerCard/register", {
          username: this.user.username,
          email: this.user.email,
          password: this.user.password,
          captcha: this.captcha
        })
            .then(res => {
              if (res.code === 0) {
                this.$message.success(res.message)
                this.$router.push({path: "/login"});
              } else {
                this.$message.error(res.message)
              }
            });

      }
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
  background-size: cover;
  border-radius: 20px;

  width: 450px;
  height: 450px;
  margin: 50px auto;
  overflow: hidden;
  padding-top: 10px;
  line-height: 20px;
}

h3 {
  color: #0babeab8;
  font-size: 24px;
}

hr {
  background-color: #444;
  margin: 20px auto;
}

.el-button {
  width: 80%;
  margin-left: -50px;
}
</style>