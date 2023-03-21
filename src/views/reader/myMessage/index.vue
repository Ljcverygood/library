<template>
  <div style="margin-top: 15px; background: white">
    <el-card>
      <div class="el-card__header" style="text-align: left;padding: 0">
        <h1 style="margin: 0;">消息列表</h1>
      </div>
      <ul style="padding: 0;" class="comment-list">
        <li class="comment" v-for="comment in commentList" :key="comment.id">
          <!--          <el-avatar v-if="comment.avatar.substring(0,9) === 'http://q1'" :src="`${comment.avatar}`"></el-avatar>-->
          <el-avatar  :src=comment.avatar></el-avatar>
          <div class="content">
            <div style="display: flex;justify-content: space-between;width: 100%">
              <div class="nkname">
                <span class="name"><b>{{ comment.username }}</b></span>
                <span class="date">{{ comment.createTime }}</span>
                <span class="rp" >回复了你</span>
                <span @click="toDetail(comment.bookId)" class="blog">{{ comment.name }}</span>
              </div>
              <div class="op">
                <span  class="reply1" @click="reply(comment.pid,comment.bookId, comment.username)">回复</span>
              </div>
            </div>
            <p class="reply">{{ comment.content }}</p>
          </div>
        </li>
      </ul>
    </el-card>

    <div style="padding: 10px 0; margin-left: 500px">
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

<script>
import request from "@/utils/request";

export default {
  name: "myMessage",
  data(){
    return{
      commentList: [],
      replyComment: {},
      dialogFormVisible: false,
      replyFormRules: {
        commentContent: [
          {required: true, message: '请填写评论内容', trigger: 'blur'}
        ],
      },
      palceholderContent:'',
      //分页
      currentPage: 1,
      pageSize: 5,
      total: 0,
    }
  },

  created() {
    this.getComment()
  },
  methods:{
    //获取消息
    getComment(){
      request.post('/comment/getComment/'+this.currentPage+'/'+this.pageSize).then(res => {
        if (res.code === 0) {
          this.commentList = res.content.records
          this.total=res.content.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    reply(pid,bookId, target) {
      this.replyComment={pid:pid,bookId:bookId,target:target}
      this.palceholderContent="回复给"+target
      this.dialogFormVisible = true
    },
    toDetail(bookId){
      this.$router.push({ name: 'bookDetail', params: { bookId }})
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
    //更改每页条数
    handleSizeChange(pageSize) {
      this.pageSize=pageSize
      this.getCommentList()
    },
    //更改当前页
    handleCurrentChange(currentPage) {
      this.currentPage=currentPage
      this.getCommentList()
    },
  }

}
</script>

<style  scoped lang="less">
.comment {
  border-bottom: 1px dashed #ccc;
  margin: 10px 0;
  display: flex;
}

.el-avatar {
  width: 35px;
  height: 35px;
  border: 2px solid white;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, .06);
  flex-shrink: 0;
}

.content {
  text-align: left;
  font-size: 14px;
  flex-grow: 1;

  .nkname {
    margin-left: 10px;
    max-width: 530px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    .rp, .date {
      color: #999;
      margin-left: 10px;
    }

    .blog {
      color: #349edf;
      margin-left: 10px;
      cursor: pointer;
    }
  }

  .reply {
    margin-left: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .op {
    color: #ddd;

    font-weight: lighter;

    .rep {
      color: #349edf;
    }

    .del {
      color: red;
    }

    .reply1 {
      margin-right: 20px;
      color: blue;
    }
  }

  .op:hover {
    cursor: pointer;
  }
}

</style>