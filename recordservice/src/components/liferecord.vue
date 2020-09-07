<template>
  <div class="app">
    <el-row>
      <el-button type="warning" @click="quit()" plain>安全退出</el-button>
      <el-button type="primary" @click="OilRecord()" plain>加油记录</el-button>
      <el-button type="primary" @click="toPrint()" plain>打印记录</el-button>
      <el-button type="primary" @click="toXiYaoPerson()" plain>西姚村花名册</el-button>
      <el-button type="primary" plain>收支明细</el-button>
      <el-button type="primary" plain>查看</el-button>
    </el-row>

    <el-table :data="tableData.slice((currentPage-1)*size,currentPage*size)" style="width: 100%">
      <!--  <el-table-column prop="id" label="序号" width="100px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.id" style="width:70px;" :disabled="true"></el-input>
        </template>
      </el-table-column>-->
      <el-table-column prop="produceRecordDate" label="日期" align="center" width="200px">
        <!-- <template slot-scope="scope">
          <el-input v-model="scope.row.produceRecordDate" style="width:180px;" @blur="handleUpdate(scope.row)"></el-input>
        </template> -->
      </el-table-column>
      <!-- <el-table-column prop="categoryId" label="分类" align="center" width="100px">

        <template slot-scope="scope">
          <el-input v-model="scope.row.categoryId" style="width:80px;" @blur="handleUpdate(scope.row)">
          </el-input>
        </template>

      </el-table-column> -->

      <el-table-column prop="category" label="类别" align="center" width="150px">
        <!-- <template slot-scope="scope">
          <el-input v-model="scope.row.category" style="width:120px;" @blur="handleUpdate(scope.row)"></el-input>
        </template> -->
      </el-table-column>

      <el-table-column prop="recordProducer" label="收入/支出人" align="center" width="120px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.recordProducer" style="width:100px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="收入/支出(RMB)" align="center" width="150px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.money" style="width:120px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="firstAddDate" label="首次存入时间" align="center" width="200px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.firstAddDate" style="width:180px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="lastUpdateDate" label="修改时间" align="center" width="200px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.lastUpdateDate" style="width:180px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column> -->
      <el-table-column prop="remark" label="备注" align="center" width="350px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" style="width:300px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>

     <!-- <el-table-column prop="operator" label="操作人" align="center" width="100px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.operator" style="width:80px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column> -->

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small">
            <span>
              <i class="el-icon-circle-plus" @click="handleAdd()"></i>
              <i class="el-icon-delete" @click="handleDelete(scope.row)"></i>
            </span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  <div>
      <el-table :data="table2Data" style="width: 100%">

        <el-table-column prop="OilSum" label="加油量总和" width="350px">  </el-table-column>
        <el-table-column prop="OilCostSum" label="加油花费" width="350px">  </el-table-column>
         <el-table-column prop="OilRealCostSum" label="加油实际总花费" width="350px">  </el-table-column>
      </el-table>
    </div>
 -->
    <!--增加西姚人员内容-->
    <el-dialog title="新增收支信息" :visible.sync="dialogCreateVisible" style="text-align: left">
      <el-form :rules="addFormRules" ref="addForm" :model="addForm" :label-width="addFormLabelWidth">
        <el-form-item label="新增时间" :picker-options="pickerOptions">
          <el-date-picker v-model="addForm.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-time-picker v-model="addForm.time" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
            placeholder="任意时间点" value-format='HH:mm:ss'>
          </el-time-picker>

        </el-form-item>

        <el-form-item label="分类" prop="categoryId">
          <!--  <el-input v-model="addForm.categoryId"></el-input> -->
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!--   <el-form-item label="类别" prop="category">
          <el-input v-model="addForm.category" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="收/支人" prop="recordProducer">
        <el-select v-model="person" placeholder="请选择">
          <el-option v-for="item in persons" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="收入/支出" prop="money">
          <el-input v-model="addForm.money" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark" auto-complete="off"></el-input>
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
        options: [{
          value: '1',
          label: '超市'
        }, {
          value: '2',
          label: '工资'
        }, {
          value: '3',
          label: '车辆'
        }, {
          value: '4',
          label: '打印'
        }, {
          value: '5',
          label: '上课'
        }, {
          value: '6',
          label: '回家'
        }, {
          value: '7',
          label: '其他'
        }],
        value: '',
        person: '',
        persons: [{
          value: '1',
          label: '李阳'
        }, {
          value: '2',
          label: '党玉莹'
        } ,{
          value: '3',
          label: '其他'
        }],
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
          date: '',
          time: '',
          categoryId: '',
          category: '',
          money: '',
          recordProducer: '',
          remark: '',
          operator: ''
        },
        dialogCreateVisible: false,
        addFormLabelWidth: '80px',
        addLoading: false,
        addFormRules: {

          remark: [{
            required: false,
            message: '备注',
            trigger: 'blur'
          }],
          time: [{
            required: false,
            message: '请输入时间',
            trigger: 'blur'
          }],

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
          categoryId: '',
          category: '',
          money: '',
          recordProducer: '',
          remark: '',
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
                produceRecordDate: this.addForm.date + " " + this.addForm.time,
                categoryId: this.value,
                category: this.addForm.category,
                recordProducer: this.person,
                money: this.addForm.money,
                remark: this.addForm.remark,
                operator: this.addForm.operator,
              };
              var data = this.$qs.stringify(parematers);
              // console.log(data);
              this.$http.post('/lifeRecord/addLifeRecord', data).then(res => {
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
        this.$http.get('/lifeRecord/selectAllLifeRecord').then((res) => {
          this.tableData = res.data.data; //把传回来数据赋给table
          // this.rowspan();
        }).catch(function(error) {
          console.log(error);
        })
      },
      rowspan() {
        this.tableData.forEach((item, index) => {
          if (index === 0) {
            this.spanArr.push(1);
            this.position = 0;
          } else {
            if (this.tableData[index].headHousHold === this.tableData[index - 1].headHousHold) {
              this.spanArr[this.position] += 1;
              this.spanArr.push(0);
            } else {
              this.spanArr.push(1);
              this.position = index;
            }
          }
        })
      },
      objectSpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) { //表格合并行
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          }
        }
        // if(columnIndex === 1){
        //     const _row = this.spanArr[rowIndex];
        //     const _col = _row>0 ? 1 : 0;
        //     return {
        //         rowspan: _row,
        //         colspan: _col
        //     }
        // }
      },
      getMockOilData() {
        this.$http.get('/mock/findAllMockDatas').then((res) => {
          this.tableData = res.data.data.data; //把传回来数据赋给table
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
        this.$http.post('/lifeRecord/deleteLifeRecordByID', data).then((response) => {
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
          produceRecordDate: index.produceRecordDate,
          categoryId: index.categoryId,
          category: index.category,
          money: index.money,
          recordProducer: index.recordProducer,
          remark: index.remark,
          operator: index.operator
        };
        var data = this.$qs.stringify(parematers);
        this.$http.post('/lifeRecord/updateLifeRecordByID', data).then((response) => {
          // console.log(response.status);
          this.getall();
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
      toXiYaoPerson() {
        // console.log("record")toXiYaoPerson
        this.$router.replace("/xiyaoperson");
      }

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
