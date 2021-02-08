<template>
  <div class="app">
    <el-row>
      <el-button type="warning" @click="quit()" plain>安全退出</el-button>
      <el-button type="primary" @click="OilRecord()" plain>加油记录</el-button>
      <el-button type="primary" @click="toPrint()" plain>打印记录</el-button>
      <el-button type="primary" @click="toXiYaoPerson()" plain>西姚村花名册</el-button>
      <el-button type="primary" @click="toLifeRecord()" plain>收支明细</el-button>
      <el-button type="primary" @click="toUser()" plain>用户列表</el-button>
      <el-button type="primary" plain>学生列表</el-button>
      <el-button type="success">Kobe Bryant</el-button>
    </el-row>
    <el-table :data="tableData.slice((currentPage-1)*size,currentPage*size)" style="width: 100%">

      <el-table-column prop="name" label="学生姓名" align="center" width="200px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" style="width:150px;" @blur="handleUpdate(scope.row)">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="sid" label="学号" align="center" width="200px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sid" style="width:150px;" @blur="handleUpdate(scope.row)">
          </el-input>
        </template>
      </el-table-column>

      <el-table-column prop="classes" label="年级" align="center" width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.classes" style="width:120px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="grade" label="班级" align="center" width="200px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.grade" style="width:100px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="roldId" label="角色" align="center" width="200px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.roldId" style="width:150px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="firstDate" label="新增时间" align="center" width="200px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.firstDate" style="width:180px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="lastDate" label="上次修改时间" align="center" width="300px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.lastDate" style="width:280px;" @blur="handleUpdate(scope.row)"></el-input>
        </template> -->
      </el-table-column>


      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleAdd()">新增</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>

      </el-table-column>
    </el-table>

    <!--增加西姚人员内容-->
    <el-dialog title="新增学生信息" :visible.sync="dialogCreateVisible" style="text-align: left">
      <el-form :rules="addFormRules" ref="addForm" :model="addForm" :label-width="addFormLabelWidth">


        <el-form-item label="学生姓名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="sid">
          <el-input v-model="addForm.sid" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="classes">
          <el-input v-model="addForm.classes" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="grade">
          <el-input v-model="addForm.grade" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="角色" prop="roldId">
          <el-input v-model="addForm.roldId" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createReset">取消</el-button>
        <el-button @click.native="createSubmit" :loading="addLoading" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <div class="block" style="margin-left:30%">
      <!-- <span class="demonstration">完整功能</span> -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[5, 10, 15,20]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        rowList: [],
        spanArr: [],
        position: 0,
        listData: [],
        currentPage: 1,
        size: 10,
        tableData: [],
        //table2Data: [],
        // 新增表单
        addForm: {
          name: '',
          sid: '',
          classes: '',
          grade: '',
          roldId: '',
        },
        dialogCreateVisible: false,
        addFormLabelWidth: '80px',
        addLoading: false,
        addFormRules: {
          name: [{
            "message": "请输入学生姓名",
            "required": true,
            "trigger": "blur"
          }],
          sid: [{
            "message": "请输入学号",
            "required": false,
            "trigger": "blur"
          }],
          classes: [{
            "message": "请输入年级",
            "required": false,
            "trigger": "blur"
          }],
          grade: [{
            "message": "请输入班级",
            "required": false,
            "trigger": "blur"
          }],
          roldId: [{
            required: false,
            message: '备注',
            trigger: 'blur'
          }],


        },


      }
    },
    methods: {
      //  显示新增
      handleAdd() {
        this.dialogCreateVisible = true;
        this.addForm = {
          name: '',
          sid: '',
          classes: '',
          grade: '',
          roldId: ''
        };
      },
      //  提交新增学生信息
      createSubmit() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交？', '提示', {}).then(() => {
              this.addLoading = true;
              let parematers = {
                name: this.addForm.name,
                sId: this.addForm.sid,
                classes: this.addForm.classes,
                grade: this.addForm.grade,
                roldId: this.addForm.roldId
              };
              var data = this.$qs.stringify(parematers);
              // console.log(data);
              this.$http.post('/student/addStudent', data).then(res => {
                this.addLoading = false;
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                this.dialogCreateVisible = false;
                this.getall();
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消新增'
              });
            })
          } else {
            console.log('error');
            return false;
          }
        })
      },
      createReset() {
        this.dialogCreateVisible = false;
      },
      /*查询*/
      getall() {
        this.$http.get('/student/selectStudents').then((res) => {
          this.tableData = res.data.data; //把传回来数据赋给table
          //this.rowspan();
        }).catch(function(error) {
          console.log(error);
        })
      },

      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.size = val
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.currentPage = val
      },
      //删除
      handleDelete(index) {

        this.tableData.splice(index + 1, 1); //---前端删除index要+1 !!!!!!!
        let parematers = {
          id: index.id
        };
        var data = this.$qs.stringify(parematers);
        this.$http.post('/student/deleteStudentByID', data).then((response) => {
          this.getall();
          //alert(response.data);
          //这里是del成功以后需要做的。
        })
      },
      //失焦保存
      handleUpdate(index) {
        // this.tableData.splice(index+1, 1);//---前端删除index要+1 !!!!!!!
        let parematers = {
          id: index.id,
          name: index.name,
          sId: index.sid,
          classes: index.classes,
          grade: index.grade,
          roldId: index.roldId

        };
        var data = this.$qs.stringify(parematers);
        this.$http.post('/student/updateStudentByID', data).then((response) => {
          // console.log(response.status);
          //this.getall();
        })
      },
      quit() {
        // console.log("quit")
        this.$router.replace("./");
      },
      toPrint() {
        // console.log("record")
        this.$router.replace("/record");
      },
      OilRecord() {
        // console.log("record")
        this.$router.replace("/oilrecord");
      },
      toLifeRecord() {
        // console.log("record")
        this.$router.replace("/liferecord");
      },
      toUser() {
        this.$router.replace("/user");
      },
      toXiYaoPerson() {
        this.$router.replace("/xiyaoperson");
      },

    },
    mounted: function() {
      this.getall()
    },

  }
</script>

<style>
</style>
