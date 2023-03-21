
<template>
  <div class="mt-4">
    <el-input
        v-model="booKId"
        placeholder="图书号"
        class="input-with-select"
        size="large">
    </el-input>
    <el-input
        v-model="readerId"
        placeholder="读者号"
        class="input-with-select"
        size="large"
    >
    </el-input>
  <el-select style="margin-bottom: 12px;margin-right: 10px" @change="getLendInfo" v-model="lookType" class="m-2" placeholder="选择分类" size="large">
    <el-option
        v-for="item in brOption"
        :key="item.value"
        :label="item.label"
        :value="item.value"
    />
  </el-select>
    <el-button type="primary" style=" margin-bottom: 10px" :icon="Search" @click="getLendInfo"/>
    <el-button type="primary" style="margin-bottom: 10px" :icon="RefreshLeft" @click="resetSearch">重置</el-button>
  </div>
  <el-table :data="tableData" border stripe style="width: 100%">
    <el-table-column align="center" prop="serNum" label="流水号"/>
    <el-table-column align="center" prop="bookId" label="图书号"/>
    <el-table-column align="center" prop="name" label="图书名"/>
    <el-table-column align="center" prop="readerId" label="读者证号"/>
    <el-table-column align="center" prop="lendDate" label="借出日期"/>
    <el-table-column align="center" prop="expirationDate" label="到期日期"/>
    <el-table-column align="center" prop="backDate" label="归还日期"/>
    <el-table-column align="center" label="状态">
      <template v-slot="scope">
        <el-tag v-if="scope.row.status==0">待归还</el-tag>
        <el-tag type="success" v-else-if="scope.row.status==1">已还</el-tag>
        <el-tag type="danger" v-else-if="scope.row.status==2">逾期</el-tag>
        <el-tag type="danger" v-else-if="scope.row.status==3">续借</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template v-slot="scope">
        <el-button type="primary" text v-if="scope.row.status==2" @click="tipReturn(scope.row.serNum)">提醒还书</el-button>
        <el-button type="success" text v-if="scope.row.backDate==null" @click="returnBook(scope.row.serNum)">归还</el-button>
        <el-button type="danger"  text v-if="scope.row.status==1" @click="deleteById(scope.row.serNum)">删除</el-button>
      </template>
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
<script setup>
import {Search, RefreshLeft} from "@element-plus/icons-vue";



</script>

<script>
import request from "@/utils/request";

export default {
  name: "brManage",
  data(){
    return{
      tableData:[

      ],
      lookType:-1,
      brOption:[
        {
          value:-1,
          label:"全部"
        }  ,
        {
          value: 0,
          label: "待还"
        },
        {
          value: 1,
          label: "已还"
        },
        {
          value: 2,
          label: "逾期"
        },
        {
          value: 3,
          label: "续借"
        },
      ],

      //分页
      currentPage: 1,
      pageSize: 5,
      total: 0,
      booKId:null,
      readerId:null

    }
  },
  created() {
    this.getLendInfo()
  },
  methods:{
    //分页查询
      getLendInfo(){
        request.post("/admin/lendList/pageQuery",
            {"currentPage":this.currentPage,"pageSize":this.pageSize,"readerId":this.readerId,"bookId":this.booKId,"lookType":this.lookType}).then(res=>{
          if(res.code==0){
            this.tableData=res.content.records
            this.total=res.content.total
          }else {
            this.$message.error(res.message)
          }
        })
      },
    //重置搜索条件
    resetSearch(){
        this.readerId=null
      this.booKId=null
      this.getLendInfo()
    },
    //根据id删除
    deleteById(serNum){
      this.$confirm('确认要删除该记录吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        request.delete("/admin/lendList/deleteById/"+serNum).then(res=>{
          if(res.code==0){
            this.$message.success(res.message)
            this.getLendInfo()
          }else {
            this.$message.error((res.message))
          }
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    //归还图书
    returnBook(serNum){
      this.$confirm('确认图书已经归还？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        request.put('/admin/lendList/returnBook/'+serNum).then(res=>{
          if (res.code==0){
            this.getLendInfo()
            this.$message.success(res.message)
          }else {
            this.$message.error(res.message)
            this.getLendInfo()
          }
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '操作已取消'
        });
      })
    },
    //提醒还书
    tipReturn(serNum){
      request.get("/admin/lendList/"+serNum).then(res=>{
        if(res.code==0){
          this.$message.success(res.message)
        }else{
          this.$message.error(res.message)
        }
      })
    },
    //更改每页条数
    handleSizeChange(pageSize) {
      this.pageSize=pageSize
      this.getLendInfo()
    },
    //更改当前页
    handleCurrentChange(currentPage) {
      this.currentPage=currentPage
      this.getLendInfo()
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