<template>
  <el-select style="margin-left: 1200px" @change="getCommentList" v-model="queryParam" class="m-2" placeholder="选择分类" size="large">
    <el-option
        v-for="item in commentOption"
        :key="item.value"
        :label="item.label"
        :value="item.value"
    />
  </el-select>

  <div style="margin-top: 15px; background: white">
    <el-card>
      <div class="el-card__header" style="text-align: left;padding: 0">
        <h1 style="margin: 0;">评论管理</h1>
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
                  <span class="rp" v-if="comment.target==null">评论了图书</span>
                  <span class="rp" v-else>回复了</span>
                  <span class="rp" v-if="comment.target">{{comment.target}}</span>

                <span @click="getBlogInfo(comment.bookId)" class="blog">{{ comment.name }}</span>
              </div>
              <div class="op">
                <span v-if="comment.status === 0" class="reply1" @click="changeStatus(comment.id)">展示</span>
                <span v-else-if="comment.status === 1" class="reply1"
                      @click="changeStatus(comment.id)">隐藏</span>
                <el-divider direction="vertical"></el-divider>
                <span class="del" @click="deleteCommentById(comment.id)">删除</span>
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
</template>

<script>
import request from "@/utils/request";
export default {
  name: "comments",
  data() {
    return {
      editing: false,
      commentList: [

      ],
      formVisible: false,
      replyComment: {
        parentCommentId: null,
        ancestorCommentId: null,
        blogId: null,
        commentContent: '',
        status: 1,
      },
      replyFormRules: {
        commentContent: [
          {required: true, message: '请填写评论内容', trigger: 'blur'}
        ],
      },
      queryParam:-1,

      commentOption:[
        {
          value:-1,
          label:"全部"
        }  ,
        {
          value: 0,
          label: "未审批"
        },
        {
          value: 1,
          label: "已展示"
        }
      ],
      //分页
      currentPage: 1,
      pageSize: 5,
      total: 0,
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    // 获取评论列表
    getCommentList() {
      request.post('/admin/comment/getComment/'+this.currentPage+'/'+this.pageSize+'/'+this.queryParam).then(res => {
        if (res.code === 0) {
          this.commentList = res.content.records
          this.total=res.content.total
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 修改评论状态，展示到前台页面
    changeStatus(commentId) {
      this.$confirm('确定要改变该评论及其子评论状态吗, 是否继续?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        request.get(`/admin/comment/changeStatus/${commentId}`).then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
            this.getCommentList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    // 回复评论
    replyCommentForm(comment) {
      this.formVisible = true
      this.replyComment.parentCommentId = comment.commentId
      if (comment.ancestorCommentId !== null || comment.ancestorCommentId !== '') {
        this.replyComment.ancestorCommentId = comment.ancestorCommentId
      } else {
        this.replyComment.ancestorCommentId = comment.commentId
      }
      this.replyComment.blogId = comment.blogId
    },
    // 关闭对话框
    closeForm() {
      this.formVisible = false
      this.$refs.replyFormRef.resetFields()
      this.replyComment.parentCommentId = null
      this.replyComment.blogId = null
      this.replyComment.commentContent = ''
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
    // commitReplyComment() {
    //   this.$refs.replyFormRef.validate(async valid => {
    //     if (!valid) return
    //     request.post('/comment/reply', {
    //       'status': this.replyComment.status,
    //       'blogId': this.replyComment.blogId,
    //       'parentCommentId': this.replyComment.parentCommentId,
    //       'ancestorCommentId': this.replyComment.ancestorCommentId,
    //       'commentContent': this.replyComment.commentContent
    //     }).then(res => {
    //       if (res.code === 0) {
    //         this.$message.success(res.message)
    //       } else {
    //         this.$message.error(res.message)
    //       }
    //     }).finally(() => {
    //       this.closeForm()
    //       this.getCommentList()
    //     })
    //   })
    // },
    // // 删除评论
    async deleteCommentById(commentId) {
      this.$confirm('确定要删除该评论及其子评论吗, 是否继续?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        request.delete(`/admin/comment/delete/${commentId}`).then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
            this.getCommentList()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    // // 跳转到博客详情页
    // getBlogInfo(blogId) {
    //   let routeData = this.$router.resolve({path: '/blogInfo', query: {blogId: blogId}});
    //   window.open(routeData.href, '_blank');
    //   // this.$router.push({path: '/blogInfo', query: {blogId: blogId}});
    // },
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
  color: blue;
}
}

.op:hover {
  cursor: pointer;
}
}

</style>
