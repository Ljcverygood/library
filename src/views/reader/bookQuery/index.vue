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
    <el-button type="primary" style="margin-bottom: 10px" :icon="RefreshLeft" @click="resetSearch">重置</el-button>
  </div>

  <el-table :data="tableData" border stripe style="width: 100%">

    <el-table-column align="center" prop="name" label="书名"/>
    <el-table-column align="center" prop="author" label="作者"/>
    <el-table-column align="center" prop="publish" label="出版社"/>
    <el-table-column align="center" prop="isbn" label="ISBN"/>
    <el-table-column align="center" prop="price" label="价格"/>
    <el-table-column align="center" prop="number" label="剩余数量"/>
    <el-table-column v-slot="scope" label="操作" align="center" min-width="100%"  >
      <el-button type="primary" size="small" text @click="toDetail(scope.row.bookId)">详情</el-button>
      <el-button type="danger" size="small" text  v-if="this.myLendList.includes(scope.row.bookId)"    >借阅中</el-button>
      <el-button type="info" size="small" text v-else-if="scope.row.number==0" disabled>已空</el-button>
      <el-button type="primary" size="small"  text v-else @click="borrow(scope.row.bookId)">借阅</el-button>
      <!--      </div>-->


    </el-table-column>
  </el-table>

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

<script  setup>
import {Search, Plus, RefreshLeft} from "@element-plus/icons-vue";

</script>
<script >
import request from "@/utils/request";



export default {
  name: "bookQuery",
  data(){
    return{
      lendBookArr:[],
      tableData:[],
      myLendList:[],
      temLend:{},

     lend:false,
      //分页
      currentPage: 1,
      pageSize: 10,
      total: 0,


      //搜索
      classInfo:[],//分类信息
      classId:null,
      name:null,//书名
      author:null,//作者
    }
  },
  created() {
    this.getLendList()
    this.getBookInfo()
    this.getClassInfo()
  },
  methods:{
    getBookInfo(){
     request.post('/reader/bookInfo/pageQuery',
         {"currentPage":this.currentPage,"pageSize":this.pageSize,"name":this.name,"author":this.author,"classId":this.classId}).then(res=>{
           if(res.code==0){
             this.tableData=res.content.records;
             this.total=res.content.total
           }else {
             this.$message.error(res.message)
           }
     })
    },
    getLendList(){
      request.post('/reader/lendList/getLendList').then(res=>{
        if(res.code==0){
          this.myLendList=res.content
        }else {
          this.$message.error(res.message)
        }
      })
    },

    toDetail(bookId){
      this.$router.push({ name: 'bookDetail', params: { bookId }})
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



    //重置搜索条件
    resetSearch(){
      this.name=null
      this.author=null
      this.classId=null
      this.getBookInfo()
    },
    //借阅图书
    borrow(bookId){
       request.post('/reader/bookInfo/borrow/'+bookId).then(res=>{
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
    },
    // //归还图书
    // returnBook(bookId){
    //   request.put('/reader/bookInfo/returnBook/'+bookId).then(res=>{
    //     if (res.code==0){
    //       this.$message.success(res.message)
    //         this.getBookInfo()
    //         this.getLendList()
    //         this.getClassInfo()
    //     }else {
    //       this.$message.error(res.message)
    //       this.getBookInfo()
    //       this.getLendList()
    //       this.getClassInfo()
    //     }
    //   })
    // },

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