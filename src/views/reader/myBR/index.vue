<template>
  <el-select style="margin-bottom: 12px;margin-right: 10px;float: right" @change="getLendInfo" v-model="lookType" class="m-2" placeholder="选择分类" size="large">
    <el-option
        v-for="item in brOption"
        :key="item.value"
        :label="item.label"
        :value="item.value"
    />
  </el-select>
  <el-table :data="tableData" border stripe style="width: 100%" title="我的借还日志">
    <el-table-column align="center" prop="bookId" label="图书号"/>
    <el-table-column align="center" prop="name" label="图书名"/>
    <el-table-column align="center" prop="lendDate" label="借出日期"/>
    <el-table-column align="center" prop="expirationDate" label="到期日期"/>
    <el-table-column align="center" prop="backDate" label="归还日期"/>
    <el-table-column align="center"  label="状态">
      <template v-slot="scope">
        <el-tag v-if="scope.row.status==0">待归还</el-tag>
        <el-tag type="success" v-else-if="scope.row.status==1">已还</el-tag>
        <el-tag type="danger" v-else-if="scope.row.status==2">逾期</el-tag>
        <el-tag type="danger" v-else-if="scope.row.status==3">续借</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" min-width="100%">
      <template v-slot="scope">
        <el-button type="primary" v-if="scope.row.status==0" size="small" text @click="renew(scope.row.serNum)">续借</el-button>

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

<script>
import request from "@/utils/request";

export default {
  name: "myBR",
  data(){
    return{
      lookType:-1,
      tableData:[],
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
      pageSize: 10,
      total: 0,
    }
  },
  created() {
  this.getLendInfo()
    },
  methods:{
    //获取借还日志列表
    getLendInfo(){
      request.post('/reader/lendList/getLendInfo',{"currentPage":this.currentPage,"pageSize":this.pageSize,"status":this.lookType}).then(res=>{
        if(res.code==0){
          this.tableData=res.content.records
          this.total=res.content.total
        }else {
          this.$message.error(res.message)
        }
      })
    },
    //续借
    renew(serNum){
      this.$confirm('确定要续借该图书吗?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(()=>{
        request.put("/reader/lendList/renew/"+serNum).then(res=>{
          if(res.code==0){
            this.$message.success(res.message)
            this.getLendInfo()
          }else {
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

<style scoped>

</style>