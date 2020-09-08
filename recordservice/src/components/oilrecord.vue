<template>
  <div class="app">
    <el-row>
      <el-button type="warning" @click="quit()" plain>安全退出</el-button>
      <el-button type="primary" plain>加油记录</el-button>
      <el-button type="primary" @click="toPrint()" plain>打印记录</el-button>
      <el-button type="primary" @click="toXiYaoPerson()" plain>西姚村花名册</el-button>
      <el-button type="primary"  @click="toLifeRecord()" plain>收支明细</el-button>
       <el-button type="primary"  @click="toUser()" plain>用户列表</el-button>

    </el-row>

    <el-table :data="tableData.slice((currentPage-1)*size,currentPage*size)" style="width: 100%">
      <!--  <el-table-column prop="id" label="序号" width="350">
        <template slot-scope="scope">
          <el-input v-model="scope.row.id" style="width:275px;" :disabled="true"></el-input>
        </template>
      </el-table-column>-->
      <el-table-column prop="addOilDate" label="加油日期" width="200px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.addOilDate" style="width:170px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="oilVolume" label="加油量(L)" width="100px">

        <template slot-scope="scope">
          <el-input v-model="scope.row.oilVolume" style="width:70px;" @blur="handleUpdate(scope.row)" oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}">
          </el-input>
        </template>

      </el-table-column>

      <el-table-column prop="dashboardMileage" label="当前里程(Km)" width="160px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.dashboardMileage" style="width:90px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="cost" label="应付金额(RMB)" width="150px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.cost" style="width:100px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="realCost" label="实付金额(RMB)" width="150px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.realCost" style="width:100px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="oilUnitPrice" label="油品单价(RMB/L)" width="150px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.oilUnitPrice" style="width:100px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="realOilUnitPrice" label="实付单价(RMB/L)" width="150px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.realOilUnitPrice" style="width:100px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="备注" width="300px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" style="width:200px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <!--   <el-table-column prop="recordFirstDate" label="首次记录时间" width="220px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.recordFirstDate" style="width:175px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="recordLastUpdateDate" label="最后修改时间" width="220px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.recordLastUpdateDate" style="width:174px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" width="100px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.operator" style="width80px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>-->

      <el-table-column label="操作">
       <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleAdd()">新增</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
          </template>

      </el-table-column>
    </el-table>
    <div>
      <el-table :data="table2Data" style="width: 100%">

        <el-table-column prop="OilSum" label="加油量总和" width="350px"> </el-table-column>
        <el-table-column prop="OilCostSum" label="加油花费" width="350px"> </el-table-column>
        <el-table-column prop="OilRealCostSum" label="加油实际总花费" width="350px"> </el-table-column>
      </el-table>
    </div>

    <!--增加加油记录内容-->
    <el-dialog title="新增加油记录" :visible.sync="dialogCreateVisible" style="text-align: left">
      <el-form :rules="addFormRules" ref="addForm" :model="addForm" :label-width="addFormLabelWidth">
        <el-form-item label="加油时间" :picker-options="pickerOptions">
          <el-date-picker v-model="addForm.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-time-picker v-model="addForm.time" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
            placeholder="任意时间点" value-format='HH:mm:ss'>
          </el-time-picker>

        </el-form-item>

        <el-form-item label="加油量(L)" prop="oilVolume">
          <el-input v-model="addForm.oilVolume" placeholder="请输入本次加油量"></el-input>
        </el-form-item>
        <el-form-item label="里程(Km)" prop="dashboardMileage">
          <el-input v-model="addForm.dashboardMileage" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="加油费用" prop="cost">
          <el-input v-model="addForm.cost" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="实际费用" prop="realCost">
          <el-input v-model="addForm.realCost" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="油品单价" prop="oilUnitPrice">
          <el-input v-model="addForm.oilUnitPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="实际单价" prop="realOilUnitPrice">
          <el-input v-model="addForm.realOilUnitPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="记录时间" prop="recordFirstDate">
          <el-input v-model="addForm.recordFirstDate" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="修改时间" prop="recordLastUpdateDate">
          <el-input v-model="addForm.recordLastUpdateDate" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-input v-model="addForm.operator" auto-complete="off"></el-input>
        </el-form-item>
        <!---->
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
        currentPage: 1,
        size: 5,
        tableData: [],
        table2Data: [],
        // 新增表单
        addForm: {
          date: '',
          time: '',
          addOilDate: '',
          oilVolume: '',
          dashboardMileage: '',
          cost: '',
          realCost: '',
          oilUnitPrice: '',
          realOilUnitPrice: '',
          remark: '',
          recordFirstDate: '',
          recordLastUpdateDate: '',
          operator: ''
        },
        dialogCreateVisible: false,
        addFormLabelWidth: '80px',
        addLoading: false,
        addFormRules: {
          addOilDate: [{
            required: false,
            message: '请输入本次加油日期',
            trigger: 'blur'
          }],
          time: [{
            required: false,
            message: '请输入时间',
            trigger: 'blur'
          }],
          cost: [{
            "message": "请输入本次花费",
            "required": true,
            "trigger": "blur"
          }, {
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入正确的数值'
          }],
          realCost: [{
            "message": "请输入本次实际花费收入",
            "required": false,
            "trigger": "blur"
          }, {
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入正确的数值'
          }],
          oilUnitPrice: [{
            "message": "请输入本次所加油品单价",
            "required": false,
            "trigger": "blur"
          }, {
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入正确的数值'
          }],
          realOilUnitPrice: [{
            "message": "请输入所加油品优惠之后实际单价",
            "required": false,
            "trigger": "blur"
          }, {
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入正确的数值'
          }],
          remark: [{
            required: false,
            message: '备注',
            trigger: 'blur'
          }, ],

        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        time: ""

      }
    },
    methods: {
      //  显示新增
      handleAdd() {
        this.dialogCreateVisible = true;
        this.addForm = {
          date: '',
          time: '',
          addOilDate: '',
          oilVolume: '',
          dashboardMileage: '',
          cost: '',
          realCost: '',
          oilUnitPrice: '',
          realOilUnitPrice: '',
          remark: '',
          recordFirstDate: '',
          recordLastUpdateDate: '',
          operator: ''
        };
      },
      //  提交新增书籍信息
      createSubmit() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交？', '提示', {}).then(() => {
              this.addLoading = true;
              let parematers = {
                addOilDate: this.addForm.date + " " + this.addForm.time,
                oilVolume: this.addForm.oilVolume,
                dashboardMileage: this.addForm.dashboardMileage,
                cost: this.addForm.cost,
                realCost: this.addForm.realCost,
                oilUnitPrice: this.addForm.oilUnitPrice,
                realOilUnitPrice: this.addForm.realOilUnitPrice,
                remark: this.addForm.remark,
                recordFirstDate: this.addForm.recordFirstDate,
                recordLastUpdateDate: this.addForm.recordLastUpdateDate,
                operator: this.addForm.operator,
              };
              var data = this.$qs.stringify(parematers);
              // console.log(data);
              this.$http.post('/oil/addOilRecord', data).then(res => {
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
        this.$http.get('/oil/findAll').then((res) => {
          this.tableData = res.data.data; //把传回来数据赋给table
          var table2obj = {};
          var OilSum = 0;
          var OilCostSum = 0;
          var OilRealCostSum = 0;
          for (var i = 0; i < res.data.data.length; i++) {
            OilSum = OilSum + res.data.data[i].oilVolume;
            OilCostSum = OilCostSum + res.data.data[i].cost;
            OilRealCostSum = OilRealCostSum + res.data.data[i].realCost;
          }

          //保留两位小数
          table2obj['OilSum'] = OilSum.toFixed(2);

          table2obj['OilCostSum'] = OilCostSum;
          table2obj['OilRealCostSum'] = OilRealCostSum;
          this.table2Data.push(table2obj);

        }).catch(function(error) {
          console.log(error);
        })
      },
      getMockOilData() {
        this.$http.get('/mock/findAllMockDatas').then((res) => {
          this.tableData = res.data.data.data; //把传回来数据赋给table
          var table2obj = {};
          var OilSum = 0;
          var OilCostSum = 0;
          var OilRealCostSum = 0;
          for (var i = 0; i < res.data.data.data.length; i++) {
            OilSum = OilSum + res.data.data.data[i].oilVolume;
            OilCostSum = OilCostSum + res.data.data.data[i].cost;
            OilRealCostSum = OilRealCostSum + res.data.data.data[i].realCost;
          }

          //保留两位小数
          table2obj['OilSum'] = OilSum.toFixed(2);

          table2obj['OilCostSum'] = OilCostSum;
          table2obj['OilRealCostSum'] = OilRealCostSum;
          this.table2Data.push(table2obj);

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
        this.$http.post('/oil/deleteOilRecordByID', data).then((response) => {
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
          addOilDate: index.addOilDate,
          oilVolume: index.oilVolume,
          dashboardMileage: index.dashboardMileage,
          cost: index.cost,
          realCost: index.realCost,
          oilUnitPrice: index.oilUnitPrice,
          realOilUnitPrice: index.realOilUnitPrice,
          remark: index.remark,
          recordFirstDate: index.recordFirstDate,
          recordLastUpdateDate: index.recordLastUpdateDate,
          operator: index.operator
        };
        var data = this.$qs.stringify(parematers);
        this.$http.post('/oil/updateRecordById', data).then((response) => {
          // console.log(response.status);
          // this.getall();
        })
      },
      quit() {
        // console.log("quit")
        this.$router.replace("./");
      },
      toPrint() {
        // console.log("record")toXiYaoPerson
        this.$router.replace("/record");
      },
      toXiYaoPerson() {
        // console.log("record")toXiYaoPerson
        this.$router.replace("/xiyaoperson");
      },
      toUser() {
        this.$router.replace("/user");
      },
      toLifeRecord() {
        // console.log("record")toXiYaoPerson
        this.$router.replace("/liferecord");
      },


    },
    mounted: function() {
      this.getall()
    },

  }
</script>
<style scoped>
  a {
    color: #42b983;
  }
</style>
