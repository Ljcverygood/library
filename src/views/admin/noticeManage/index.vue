<template>
  <div style="margin: 10px auto;width: 1200px">
    <el-input
        placeholder="输入公告主题"
        v-model="topic"
        class="input-with-select"
        size="large"
    ></el-input>
    <el-button type="primary" style=" margin-bottom: 10px" :icon="Search" @click="getNoticeInfo"/>
    <el-button type="primary" style="margin-bottom: 10px" :icon="Plus" @click="dialogFormVisible=true">发布公告</el-button>
  <el-table :data="tableData" border stripe style="width: 100%">
    <el-table-column align="center" prop="topic" label="公告主题"/>
<!--    <el-table-column align="center" prop="content" label="公告内容"/>-->
    <el-table-column align="center" prop="createTime" label="发布时间"/>
    <el-table-column label="操作" align="center" min-width="100%">
      <template v-slot="scope">
        <el-button type="primary" size="small" text @click="noticeDetail(scope.row.id)">详情</el-button>
        <el-button type="danger" size="small" text @click="deleteById(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
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

<!--  发布公告弹窗-->
  <el-dialog title="发布公告" v-model="dialogFormVisible" >
    <el-form
        label-width="100px"
        :model="dialogForm"
        >
      <el-form-item label="主题" >
        <el-input v-model="dialogForm.topic" ></el-input>
      </el-form-item>
      <el-form-item label="内容" >
        <el-input type="textarea" :rows="6" v-model="dialogForm.content" ></el-input>
      </el-form-item>
      <el-button type="info" @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="pubNotice">保存</el-button>
    </el-form>
  </el-dialog>

  <el-dialog title="公告详情" v-model="dialogListVisible">
    <el-descriptions column="1" size="default" border >
      <el-descriptions-item label-align="right"  label="主题">
        {{ dialogList.topic }}
      </el-descriptions-item>
      <el-descriptions-item label-align="right" label="内容">
        {{ dialogList.content }}
      </el-descriptions-item>
    </el-descriptions>
    <el-button type="primary" style="margin-top: 10px;" @click="dialogListVisible=false"> 关闭</el-button>

  </el-dialog>
</template>
<script setup>
import {Search,Plus} from "@element-plus/icons-vue";
</script>
<script>
import request from "@/utils/request";

export default {
  name: "noticeManage",
  data(){
    return{
      dialogForm:{},
      tableData:[],
      dialogList:{},
      dialogFormVisible:false,
      dialogListVisible:false,
      //搜索条件
      topic:'',
      //分页
      currentPage: 1,
      pageSize: 10,
      total: 0,
    }
  },
  created() {
    this.getNoticeInfo()
  },
  methods:{
    getNoticeInfo(){
      request.post("/admin/noticeInfo/getNotice",
          {"currentPage":this.currentPage,"pageSize":this.pageSize,"topic":this.topic}).then(res=>{
            if(res.code==0){
              this.tableData=res.content.records
              this.total=res.content.total
            }else {
              this.$message.error(res.message)
            }
      })
    },
    //关闭弹窗
    closeDialog(){
      this.dialogForm={}
      this.dialogFormVisible=false
    },
    //发布公告
    pubNotice(){
      if(this.dialogForm.topic==null){
        this.$message.warning("公告主题不能为空")
        return
      }
      if(this.dialogForm.content==null){
        this.$message.warning("公告内容不能为空")
        return
      }
      request.post('/admin/noticeInfo/pubNotice',this.dialogForm).then(res=>{
        if(res.code==0){
          this.$message.success(res.message)
          this.dialogFormVisible=false
          this.getNoticeInfo()
        }else {
          this.$message.error(res.message)
          this.getNoticeInfo()
        }
      })
    },
    deleteById(id){
      this.$confirm('确定要删除此条公告吗?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(()=>{
        request.delete("/admin/noticeInfo/deleteById/"+id).then(res=>{
          if(res.code==0){
            this.$message.success(res.message)
            this.getNoticeInfo()
          }else {
            this.$message.error(res.message)
            this.getNoticeInfo()
          }
        })
      })
    },

    //公告详情
    noticeDetail(id){
      this.dialogListVisible=true
      request.get("/admin/noticeInfo/getById/"+id).then(res=>{
        if(res.code==0){
          this.dialogList=res.content
        }else {
          this.$message.error(res.message)
        }
      })
    },
    //更改每页条数
    handleSizeChange(pageSize) {
      this.pageSize=pageSize
      this.getNoticeInfo()
    },
    //更改当前页
    handleCurrentChange(currentPage) {
      this.currentPage=currentPage
      this.getNoticeInfo()
    },
  }
}
</script>

<style lang="stylus" scoped>
.input-with-select {
  width: 300px;
  margin-bottom: 10px;
  margin-right: 20px;
}

.demo-collapse {
  border 1px black
}
</style>