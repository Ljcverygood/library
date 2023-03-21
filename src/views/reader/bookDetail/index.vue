<template>
  <div style="margin:-20px auto;width: 1300px;">
    <div style="margin: 15px auto">
      <el-button type="info" size="large" text :icon="Back" style="float: left" @click="this.$router.go(-1)"/>
      <span style="font-size: 20px;margin-top: 20px;margin-right: 30px">图书详情</span>
    </div>
    <div>
      <el-descriptions :column="3" border>
        <el-descriptions-item
            label="书名"
            label-align="right"
            align="center"
            label-class-name="my-label"
            class-name="my-content"
            width="150px"
        >{{ bookInfo.name }}
        </el-descriptions-item
        >
        <el-descriptions-item label="作者" label-align="right" align="center"
        >{{ bookInfo.author }}
        </el-descriptions-item
        >
        <el-descriptions-item label="出版社" label-align="right" align="center"
        >{{ bookInfo.publish }}
        </el-descriptions-item
        >
        <el-descriptions-item label="ISBN" label-align="right" align="center">
          {{ bookInfo.isbn }}
        </el-descriptions-item>
        <el-descriptions-item label="语言" label-align="right" align="center">
          {{ bookInfo.language }}
        </el-descriptions-item>
        <el-descriptions-item label="价格" label-align="right" align="center">
          {{ bookInfo.price }}
        </el-descriptions-item>
        <el-descriptions-item label="出版日期" label-align="right" align="center">
          {{ bookInfo.pubDate }}
        </el-descriptions-item>
        <el-descriptions-item label="类别" label-align="right" align="center">
          {{ className }}
        </el-descriptions-item>
        <el-descriptions-item label="数量" label-align="right" align="center">
          {{ bookInfo.number }}
        </el-descriptions-item>
        <el-descriptions-item label="简介" label-align="right" align="left">
          {{ bookInfo.introduction }}
        </el-descriptions-item>
      </el-descriptions>
      <el-button type="danger"  style="margin-top: 10px;margin-bottom:10px;float: right"  v-if="this.isBr" >借阅中</el-button>
      <el-button type="info"  style="margin-top: 10px;margin-bottom:10px;float: right"  v-else-if="this.bookInfo.number==0" disabled>已空</el-button>
      <el-button type="primary"  style="margin-top: 10px;margin-bottom:10px;float: right" v-else
                 @click="borrow">借阅
      </el-button>
    </div>
  </div>
  <div style="margin: 40px auto;width: 1300px">
    <div style="margin: 10px 0">
      <el-input type="textarea" v-model="this.comment" placeholder="请输入评论"></el-input>
      <div style="text-align: right;margin: 10px 0">
        <el-button type="primary" @click="submitComment">提交</el-button>
      </div>
    </div>
  </div>

  <!--评论-->
  <div style="margin: -40px auto;width: 1300px">
    <div style="margin: 10px 0; font-size: 24px; padding: 10px 0; border-bottom: 1px solid #ccc; text-align: left">
      评论列表
    </div>

    <div style="margin: 20px 0;  text-align: left;" v-if="comments.length>0">
      <div style="padding: 10px 0; " v-for="item in comments" :key="item.id">
        <div style="display: flex">
          <div style="width: 80px">
            <el-avatar :size="50"  fit="fill" :src=item.avatar></el-avatar>
          </div>
          <div style="flex: 1">
            <div>{{ item.username }} <span style="margin-left: 10px">{{ item.createTime }}</span></div>
            <div style="margin-top: 10px; color: #666">{{ item.content }}
              <div style="float: right">
                <el-icon><ChatLineSquare /></el-icon>
                <span style="margin-left: 5px">{{item.children.length}}</span>
              </div>
            </div>
            <div>
              <el-button type="text" @click="reply(item.id, item.username)">回复</el-button>
            </div>

            <!-- 回复列表 -->
            <div v-if="item.children.length"
                 style="margin-left: 100px; background-color: aliceblue; padding: 10px; border-radius: 10px">
              <div v-for="sub in item.children" :key="sub.id">
                <div style="padding:5px 0"><b style="cursor: pointer"
                                              @click="reply(sub.pid, sub.username)">{{ sub.username }}</b>
                  <span>回复 <span style="color: cornflowerblue">@{{ sub.target }}</span>
                    <span style="color: #666; margin-left: 10px">{{ sub.content }}</span></span>
                  <span style="float: right; font-size: 13px; color: #666; margin-top: 3px">{{ sub.createTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr  style="border:1px dashed grey;opacity: 0.5" >
      </div>

    </div>
    <div style="margin: 20px auto;  text-align: center;" v-else>
      暂无评论~快来点评图书吧~
    </div>
  </div>
  <el-dialog title="回复" v-model="dialogFormVisible" width="40%">
    <el-form :model="replyComment" >
      <el-form-item label="内容" :label-width="100">
        <el-input v-model="replyComment.content" autocomplete="off" :placeholder="palceholderContent" style="width: 80%"></el-input>
      </el-form-item>
    </el-form>
    <div  class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="savaReply">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import {Back,ChatLineSquare,CaretRight,CaretBottom} from "@element-plus/icons-vue";
</script>
<script>
import router from "@/router";
import request from "@/utils/request";

export default {
  name: "bookDetail",
  data() {
    return {
      isBr:null,
      bookId: null,
      className: "",
      bookInfo: {},
      comment:"",
      comments: [],
      replyComment: {},
      dialogFormVisible: false,
      replyFormRules: {
        commentContent: [
          {required: true, message: '请填写评论内容', trigger: 'blur'}
        ],
      },
      palceholderContent:''
    }
  },
  created() {
    this.bookId = this.$route.params.bookId
    this.isBr=false
    this.getBookInfo()
    this.getClassInfo()
    this.getComments()
    this.getIsBr()
  },
  methods: {
    //获取图书信息
    getBookInfo() {
      request.get('/reader/bookInfo/getBookByid/' + this.bookId).then(res => {
        if (res.code == 0) {
          this.bookInfo = res.content
        } else {
          this.$message.error(res.message)
        }
      })
    },

    //获取分类信息
    getClassInfo() {
      request.get('/reader/bookInfo/getClassName/' + this.bookId).then(res => {
        if (res.code == 0) {
          this.className = res.content
        } else {
          this.$message.error(res.message)
        }
      })
    },

    getIsBr(){
      request.post('/reader/lendList/isBr/'+this.bookId).then(res=>{
        if(res.code==0){
          this.isBr=res.content==0?false:true
        }else {
          this.$message.error(res.message)
        }
      })
    },
    //获取评论列表
    getComments(){
      request.post('/comment/getComment/'+this.bookId).then(res=>{
        if(res.code==0){
          this.comments=res.content
        }else {
          this.$message.error(res.message)
        }
      })
    },
    // //获取评论列表
    // getSubComments(id){
    //   request.post('/comment/getSubComment/'+id).then(res=>{
    //     if(res.code==0){
    //       this.subCommentVisable=false
    //       this.subConments=res.content
    //     }else {
    //       this.$message.error(res.message)
    //     }
    //   })
    // },
    submitComment(){
      if(!this.comment){
        this.$message.error("评论内容不能为空！")
      }else {
        request.post("/comment/submitComment/"+this.bookId,this.comment).then(res=>{
          if(res.code==0){
            this.dialogFormVisible=false
            this.comment=''
            this.getComments()
            this.$message.success(res.message)
          }else{
            this.dialogFormVisible=false
            this.getComments()
            this.$message.error(res.message)
          }
        })
      }
    },
    reply(pid, target) {
      this.replyComment={pid:pid,bookId:this.bookId,target:target}
      this.palceholderContent="回复给"+target
      this.dialogFormVisible = true
    },

    savaReply(){
      if(!this.replyComment.content){
        this.$message.error("回复内容不能为空！")
      }else{
        request.post("/comment/saveReply",this.replyComment).then(res=>{
          if(res.code==0){
            this.$message.success(res.message)
            this.replyComment.content=""
            this.dialogFormVisible=false
          }else{
            this.$message.error(res.message)
          }
        })
      }
    },
    borrow(){
      request.post('/reader/bookInfo/borrow/'+this.bookId).then(res=>{
        if (res.code==0){
          this.$alert(res.message,'提示',{
            'confirmButtonText': '确定',
            'type': 'info'
          }).then(()=>{
            this.getBookInfo()
            this.getLendList()
            this.getClassInfo()
          })
        }else {
          this.$alert(res.message,'提示',{
            'confirmButtonText': '确定',
            'type': 'warning'
          }).then(()=>{
            this.getBookInfo()
            this.getLendList()
            this.getClassInfo()
          })
        }
      })
    }

  }


}
</script>

<style scoped>
.my-label {
  background: var(--el-color-success-light-9);
}

.my-content {
  background: var(--el-color-danger-light-9);
}
</style>