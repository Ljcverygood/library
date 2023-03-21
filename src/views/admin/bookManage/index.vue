<!--管理员图书管理页面-->
<template>
  <div class="mt-4">

    <el-input
        v-model="name"
        placeholder="书名"
        class="input-with-select"
        size="large"
    >
    </el-input>
    <el-input
        v-model="author"
        placeholder="作者"
        class="input-with-select"
        size="large"
    >
    </el-input>
    <el-select style="margin-bottom: 12px;margin-right: 10px" v-model="classId" class="m-2" placeholder="选择分类" size="large">
      <el-option
          v-for="item in classInfo"
          :key="item.classId"
          :label="item.className"
          :value="item.classId"
      />
    </el-select>
    <el-button type="primary" style=" margin-bottom: 10px" :icon="Search" @click="getBookInfo"/>
    <el-button type="primary" style="margin-bottom: 10px" :icon="Plus" @click="toEditOrAdd(2)">新增</el-button>
    <el-button type="primary" style="margin-bottom: 10px" :icon="RefreshLeft" @click="resetSearch">重置</el-button>
  </div>
  <el-table :data="tableData" border stripe style="width: 100%">

    <el-table-column align="center" prop="name" label="书名"/>
    <el-table-column align="center" prop="author" label="作者"/>
    <el-table-column align="center" prop="publish" label="出版社"/>
    <el-table-column align="center" prop="isbn" label="ISBN"/>
    <el-table-column align="center" prop="price" label="价格"/>
    <el-table-column align="center" prop="number" label="剩余数量"/>
    <el-table-column label="操作" align="center" min-width="100%">
      <template v-slot="scope">
        <el-button type="primary" size="small" text @click="look(scope.row.bookId)">查看</el-button>
        <el-button type="success" size="small" text @click="toEditOrAdd(1,scope.row.bookId)">编辑</el-button>
        <el-button type="danger" size="small" text v-if="scope.row.status==0" @click="changeBookStatus(scope.row.bookId,scope.row.status)">下架</el-button>
        <el-button type="primary" size="small" text v-if="scope.row.status==1" @click="changeBookStatus(scope.row.bookId)">上架</el-button>
<!--        <el-button type="danger" size="small" text @click="deleteById(scope.row.bookId)">删除</el-button>-->
      </template>
    </el-table-column>
  </el-table>

  <!--  图书详情弹窗页面-->
  <el-dialog v-model="dialogFormVisible4look" :show-close="false" title="图书详情" style="font-size: 24px">

    <el-descriptions
        :column="1"
        size="default"
        border
    >
      <el-descriptions-item label="书名" :contentStyle='contentStyle' :labelStyle='labelStyle'>
        {{ dialogForm4look.name }}
      </el-descriptions-item>
      <el-descriptions-item label="作者" :contentStyle='contentStyle' :labelStyle='labelStyle'>
        {{ dialogForm4look.author }}
      </el-descriptions-item>
      <el-descriptions-item label="出版社" :contentStyle='contentStyle' :labelStyle='labelStyle'>
        {{ dialogForm4look.publish }}
      </el-descriptions-item>
      <el-descriptions-item label="ISBN" :contentStyle='contentStyle' :labelStyle='labelStyle'>
        {{ dialogForm4look.isbn }}
      </el-descriptions-item>
      <el-descriptions-item label="简介" :contentStyle='contentStyle' :labelStyle='labelStyle'>
        {{ dialogForm4look.introduction }}
      </el-descriptions-item>
      <el-descriptions-item label="语言" :contentStyle='contentStyle' :labelStyle='labelStyle'>
        {{ dialogForm4look.language }}
      </el-descriptions-item>
      <el-descriptions-item label="价格" :contentStyle='contentStyle' :labelStyle='labelStyle'>
        {{ dialogForm4look.price }}
      </el-descriptions-item>
      <el-descriptions-item label="出版日期" :contentStyle='contentStyle' :labelStyle='labelStyle'>
        {{ dialogForm4look.pubDate }}
      </el-descriptions-item>
      <el-descriptions-item label="分类号" :contentStyle='contentStyle' :labelStyle='labelStyle'>
        {{ dialogForm4look.classId }}
      </el-descriptions-item>
      <el-descriptions-item label="数量" :contentStyle='contentStyle' :labelStyle='labelStyle'>
        {{ dialogForm4look.number }}
      </el-descriptions-item>
    </el-descriptions>

    <el-button type="info" style="margin-top: 5px" @click="this.dialogFormVisible4look=false">关闭</el-button>
  </el-dialog>

  <!--新增或编辑弹窗页面-->
  <el-dialog v-model="dialogFormVisible" :show-close="false" v-model:title="this.actionTitle">
    <el-form
        ref="dialogForm"
        label-width="100px"
        :model="dialogForm"
        v-if="action==1||action==2"
        :rules="rules"
    >
      <el-form-item label="书名：" prop="name">
        <el-input v-model="dialogForm.name"/>
      </el-form-item>
      <el-form-item label="作者：" prop="author">
        <el-input v-model="dialogForm.author"/>
      </el-form-item>
      <el-form-item label="出版社：" prop="publish">
        <el-input v-model="dialogForm.publish"/>
      </el-form-item>
      <el-form-item label="ISBN：" prop="isbn">
        <el-input v-model="dialogForm.isbn"/>
      </el-form-item>
      <el-form-item label="简介：" prop="introduction">
        <el-input v-model="dialogForm.introduction"/>
      </el-form-item>
      <el-form-item label="语言：" prop="language">
        <el-input v-model="dialogForm.language"/>
      </el-form-item>
      <el-form-item label="价格：" prop="price">
        <el-input v-model="dialogForm.price"/>
      </el-form-item>
      <el-form-item label="出版日期：" prop="pubDate">
        <el-date-picker
            v-model="dialogForm.pubDate"
            type="date"
            placeholder="选择出版日期"
            style="width: 100%"

        />
      </el-form-item>
      <el-form-item label="分类：" prop="classId">
<!--        <el-input v-model="dialogForm.classId"/>-->
        <el-select  v-model="dialogForm.classId" class="m-2" placeholder="选择分类" size="large">
          <el-option
              v-for="item in classInfo"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数量：" prop="number">
        <el-input v-model="dialogForm.number"/>
      </el-form-item>
      <el-button type="info" @click="cancelEdit">取消</el-button>
      <el-button type="primary" @click="doEditOrAdd">保存</el-button>
    </el-form>
  </el-dialog>
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
</template>

<script setup>
import {Search, Plus, RefreshLeft} from "@element-plus/icons-vue";
</script>
<script>
import request from "@/utils/request";
import {inject} from "vue";

export default {
  name: "bookManage",


  data() {
    return {
       tableData: [],
      dialogForm: {},
      dialogForm4look: {},
      dialogFormVisible: false,
      dialogFormVisible4look: false,
      action: null,
      actionTitle: null,
      //分页
      currentPage: 1,
      pageSize: 10,
      total: 0,

      //搜索
      classInfo:[],//分类信息
      classId:null,
      name:null,//书名
      author:null,//作者

      rules: {
        name: [{required: true, message: '请输入图书名', trigger: 'blur'}],
        author: [{required: true, message: '请输入作者', trigger: 'blur'}],
        publish: [{required: true, message: '请输入出版社', trigger: 'blur'}],
        introduction: [{required: true, message: '请输入图书简介', trigger: 'blur'}],
        isbn: [{required: true, message: '请输入ISBN', trigger: 'blur'}],
        price: [{required: true, message: '请输入价格', trigger: 'blur'}],
        number: [{required: true, message: '请输入库存', trigger: 'blur'}],
        language: [{required: true, message: '请输入语言', trigger: 'blur'}],
        pubDate: [{required: true, message: '请输入发行日期', trigger: 'blur'}],
        classId: [{required: true, message: '请输入分类号', trigger: 'blur'}]
      },
      //内容样式
      contentStyle: {
        'text-align': 'center',
        'word-break': 'break-all'
      },
      //label样式
      labelStyle: {
        'width': '80px',
        'word-break': 'keep-all'
      },


    }
  },
  created() {
    this.getBookInfo()
    this.getClassInfo()
  },
  methods: {

    //查询图书信息
    getBookInfo(){
     request.post("/admin/bookInfo/pageQuery",
         {"currentPage":this.currentPage,"pageSize":this.pageSize,"name":this.name,"author":this.author,"classId":this.classId}).then(res=>{
           if(res.code==0){
             this.tableData=res.content.records;
             this.total=res.content.total
           }else {
             this.$message.error(res.message)
           }
     })
    },
    //获取分类信息
    getClassInfo(){
      request.get('/classInfo/getClassInfo').then(res=>{
        if(res.code==0){
          this.classInfo=res.content
        }else {
          this.$message.error(res.message)
        }
      })
    },
    deleteById(id) {
      alert(id)
    },
    //重置搜索条件
    resetSearch(){
      this.name=null
      this.author=null
      this.classId=null
      this.getBookInfo()
    },
    //查看详情
    look(bookId) {
      this.dialogFormVisible4look = true
      let i;
      for (i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].bookId == bookId) {
          this.dialogForm4look = this.tableData[i];
          break
        }
      }
    },
    //编辑图书
    toEditOrAdd(action, bookId) {
      this.action = action //  1的话是编辑  2是保存
      this.dialogFormVisible = true

      if (action == 1) {
        this.actionTitle = '编辑图书'
       request.get('/admin/bookInfo/'+bookId).then(res=>{
         this.dialogForm=res.content;
       })
      } else {
        this.actionTitle = '新增图书'
        this.resetForm()
      }
    },
    resetForm() {
      this.dialogForm = {}
      this.$refs['dialogForm'].clearValidate()
    },
    //取消编辑图书
    cancelEdit() {
      this.resetForm()
      this.dialogFormVisible = false
    },
    //编辑图书
    doEditOrAdd() {
      this.$refs['dialogForm'].validate((valid) => {
        if (!valid) {
          this.$message.warning('* 号为必填项，请重新输入')
          return
        }
        if (this.action == 1) {
          request.put("/admin/bookInfo/updateBookInfo/",this.dialogForm).then(res=>{
            if(res.code==0){
              this.$message.success(res.message)
              this.dialogFormVisible=false
              this.getBookInfo()
            }else {
              this.$message.error(res.message)
              this.getBookInfo()
            }
          })

        } else {
          request.post("/admin/bookInfo/addBookInfo/",this.dialogForm).then(res=>{
              if(res.code==0){
                this.$message.success(res.message)
                this.dialogFormVisible=false
                this.getBookInfo()
              }else {
                this.$message.error(res.message)
                this.getBookInfo()
              }
          })
        }
      })
    },

    //更改图书上下架状态
    changeBookStatus(bookId,status){
      let content=status==0?'下架':'上架'
      this.$confirm('确定要'+content+'该图书吗？', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(()=>{
        request.put("/admin/bookInfo/changeBookStatus/"+bookId).then(res=>{
          if (res.code==0){
            this.getBookInfo()
            this.$message.success(res.message)
          }else {
            this.getBookInfo()
            this.$message.error(res.message)
          }
        })
      })

    },

    //更改每页条数
    handleSizeChange(pageSize) {
      this.pageSize=pageSize
      this.getBookInfo()
    },
    //更改当前页
    handleCurrentChange(currentPage) {
      this.currentPage=currentPage
      this.getBookInfo()
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

