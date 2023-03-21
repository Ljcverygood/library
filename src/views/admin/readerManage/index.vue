<!--管理员读者管理页面-->
<template>
  <div class="mt-4">
    <el-input
        v-model="readerId"
        placeholder="读者号"
        class="input-with-select"
        size="large"
    >
    </el-input>
    <el-input
        v-model="username"
        placeholder="姓名"
        class="input-with-select"
        size="large"
    >
    </el-input>
    <el-button type="primary" style="margin-bottom: 10px" :icon="Search" @click="search"/>
    <el-button type="primary" style="margin-bottom: 10px" :icon="Plus" @click="toEditOrAdd(2)">新增</el-button>
    <el-button type="primary" style="margin-bottom: 10px" :icon="RefreshLeft" @click="resetSearch">重置</el-button>
  </div>

  <el-table :data="tableData" border stripe style="width: 100%">
    <el-table-column align="center" prop="readerId" label="读者号"/>
    <el-table-column align="center" prop="username" label="姓名"/>
    <el-table-column align="center" prop="sex" label="性别">
      <template v-slot="scope">
        <el-tag v-if="scope.row.sex==0">女</el-tag>
        <el-tag v-if="scope.row.sex==1">男</el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="birth" label="生日"/>
    <el-table-column align="center" prop="address" label="地址"/>
    <el-table-column align="center" prop="phone" label="电话"/>
    <el-table-column label="操作" width="300px" align="center">
      <template v-slot="scope">
        <el-button type="primary" size="small" text @click="readerInfo(scope.row.readerId)">查看</el-button>
        <el-button type="danger"  size="small" text v-if="scope.row.status==0" @click="changeReaderStatus(scope.row.readerId)">禁用</el-button>
        <el-button type="primary" size="small" text v-if="scope.row.status==1" @click="changeReaderStatus(scope.row.readerId)">解禁</el-button>
        <el-button type="success" size="small" text @click="toEditOrAdd(1,scope.row.readerId)">编辑 <i class="el-icon-edit"></i></el-button>

      </template>
    </el-table-column>
  </el-table>
  <!--  读者信息对话框-->
  <el-dialog v-model="dialogFormVisible4look" :show-close="false" title="读者信息">

    <el-descriptions
        :column="1"
        size="default"
        border
    >
      <el-descriptions-item label="读者证号">
        {{dialogForm4look.readerId}}
      </el-descriptions-item>
      <el-descriptions-item label="姓名">
        {{dialogForm4look.username}}
      </el-descriptions-item>
      <el-descriptions-item label="密码">
        {{dialogForm4look.password}}
      </el-descriptions-item>
      <el-descriptions-item label="邮箱">
        {{dialogForm4look.email}}
      </el-descriptions-item>
      <el-descriptions-item label="性别" v-if="dialogForm4look.sex==0">
        女
      </el-descriptions-item>
      <el-descriptions-item label="性别" v-else>
        男
      </el-descriptions-item>
      <el-descriptions-item label="生日">
        {{dialogForm4look.birth}}
      </el-descriptions-item>
      <el-descriptions-item label="地址">
        {{dialogForm4look.address}}
      </el-descriptions-item>
      <el-descriptions-item label="电话">
        {{dialogForm4look.phone}}
      </el-descriptions-item>

    </el-descriptions>
    <el-button type="info" @click="this.dialogFormVisible4look=false">关闭</el-button>
  </el-dialog>
  <!--编辑和新增读者页面-->
  <el-dialog v-model="dialogFormVisible" :show-close="false" v-model:title="this.actionTitle">
    <el-form
        ref="dialogForm"
        label-width="100px"
        :model="dialogForm"
        v-if="action==1||action==2"
        :rules="rules"
    >
      <el-form-item label="读者证号：" prop="readerId" v-if="this.action!=2">
        <el-input :disabled="disable" v-model="dialogForm.readerId"/>
      </el-form-item>
      <el-form-item label="姓名：" prop="username">
        <el-input :disabled="disable" v-model="dialogForm.username"/>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input show-password  v-model="dialogForm.password"/>
      </el-form-item>
      <el-form-item label="邮箱："  prop="email">
        <el-input  v-model="dialogForm.email" :disabled="disable"/>
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-select v-model="dialogForm.sex" placeholder="请选择" style="width: 40%;">
          <el-option :value="1" label="男"></el-option>
          <el-option :value="0" label="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生日：" prop="birth">
        <el-date-picker

            v-model="dialogForm.birth"
            type="date"
            placeholder="选择出生日期"
            style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="dialogForm.address"/>
      </el-form-item>
      <el-form-item label="电话：" prop="phone">
        <el-input v-model="dialogForm.phone"/>
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
import {Search} from '@element-plus/icons-vue'
import {Plus,RefreshLeft} from "@element-plus/icons-vue";
</script>
<script>
import request from "@/utils/request";

export default {
  name: "readerManage",
  data() {
    return {
      tableData: [

      ],
      dialogForm: {},
      dialogFormVisible: false,
      dialogForm4look: {},

      dialogFormVisible4look: false,
      action: null,

      actionTitle: null,

      //分页
      currentPage: 1,
      pageSize: 5,
      total: 0,
      readerId:null,
      username:null,

      disable: null,
      rules: {
        username: [{required: true, message: '请输入姓名', trigger: 'blur'}],
        email:[{required:true,message:'请输入正确邮箱',trigger:'blur',pattern:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/}],
        password:[{required:true,message:'请输入由大写字母、小写字母、数字、特殊符号中的2种及以上类型密码',trigger:'blur',pattern:/(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$)/}],
        // sex: [{required: true, message: '请选择性别', trigger: 'blur'}],
        // birth: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        // address: [{required: true, message: '请输入地址', trigger: 'blur'}],
        // phone: [{required: true, message: '请输入电话号', trigger: 'blur'}],
      }
    }
  },
  created() {
    this.getReaderInfo()
  },
  methods: {
    getReaderInfo(){
      request.post("/admin/readerInfo/pageQuery",
          {"currentPage":this.currentPage,"pageSize":this.pageSize,"readerId":this.readerId,"username":this.username}).then(res=>{
          if(res.code==0){
            this.tableData=res.content.records
            this.total=res.content.total
          }else {
            this.$message.error(res.message)
          }
      })
    },
    //读者详情
    readerInfo(readerId) {
      this.dialogFormVisible4look = true
      request.get("/admin/readerInfo/getById/"+readerId).then(res=>{
        if(res.code==0){
          this.dialogForm4look=res.content
        }else {
          this.$message.error(res.message)
        }
      })
    },

    toEditOrAdd(action, readerId) {
      this.action = action //  1的话是编辑  2是保存
      this.dialogFormVisible = true
      if (action == 1) {
        this.actionTitle = '编辑读者信息'
        this.disable = true
        request.get("/admin/readerInfo/getById/"+readerId).then(res=>{
            if(res.code==0){
              this.dialogForm=res.content
            }else {
              this.$message.error(res.message)
            }
        })

      } else {
        this.resetForm()
        this.disable = false
        this.actionTitle = '新增读者'
      }
    },
    resetForm() {
      this.dialogForm = {}
      this.$refs['dialogForm'].clearValidate()
    },
    //新增或编辑读者
    doEditOrAdd() {
      this.$refs['dialogForm'].validate((valid) => {
        if (!valid) {
          this.$message.warning('* 号为必填项，请重新输入')
          return
        }
        if (this.action == 1) {
          request.put("/admin/readerInfo/updateReaderInfo/",this.dialogForm).then(res=>{
            if(res.code==0){
              this.$message.success(res.message)
              this.dialogFormVisible=false
              this.getReaderInfo()
            }else {
              this.$message.error(res.message)
              this.getReaderInfo()
            }
          })
        } else {

          request.post("/admin/readerInfo/addReaderInfo/",this.dialogForm).then(res=>{
            if(res.code==0){
              this.$message.success(res.message)
              this.dialogFormVisible=false
              this.getBookInfo()
            }else {
              this.$message.error(res.message)

              this.getBookInfo()
            }
          })
          alert('保存成功')//执行新增操作
        }
      })

    },
    //取消弹窗
    cancelEdit() {
      this.resetForm()
      this.dialogFormVisible = false
    },
    search(){
      this.getReaderInfo()
    },

    //更改读者账号状态
    changeReaderStatus(readerId){
      request.put("/admin/readerInfo/changeReaderStatus/"+readerId).then(res=>{
        if (res.code==0){
          this.getReaderInfo()
          this.$message.success(res.message)
        }else {
          this.getReaderInfo()
          this.$message.error(res.message)
        }
      })
    },

    //重置搜索条件
    resetSearch(){
      this.readerId=null
      this.username=null
      this.getReaderInfo()
    },
    //更改每页条数
    handleSizeChange(pageSize) {
      this.pageSize=pageSize
      this.getReaderInfo()
    },
    //更改当前页
    handleCurrentChange(currentPage) {
      this.currentPage=currentPage
      this.getReaderInfo()
    },
  }
}
</script>

<style scoped>
.input-with-select {
  width: 300px;
  margin-bottom: 10px;
  margin-right: 20px;
}
</style>