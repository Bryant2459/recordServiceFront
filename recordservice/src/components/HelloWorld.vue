<template>
 <div class="app">
      <el-table :data="tableData.slice((currentPage-1)*size,currentPage*size)"  style="width: 100%">
         <el-table-column   prop="id"       label="序号"       width="350">
           <template slot-scope="scope">
                    <el-input v-model="scope.row.id" style="width:275px;" :disabled="true"></el-input>
           </template>
         </el-table-column>
         <el-table-column   prop="date"     label="日期"       width="350">
           <template slot-scope="scope">
                    <el-input v-model="scope.row.date" style="width:275px;" @blur="handleUpdate(scope.row)"></el-input>
           </template>
         </el-table-column>
         <el-table-column   prop="money"    label="收入"       width="350" >

              <template slot-scope="scope">
                    <el-input v-model="scope.row.money" style="width:275px;" @blur="handleUpdate(scope.row)" placeholder="请输入收入"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}">
                     </el-input>
              </template>

         </el-table-column>

         <el-table-column   prop="remark"   label="备注"     width="350">
             <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" style="width:275px;" @blur="handleUpdate(scope.row)"></el-input>
             </template>
         </el-table-column>
         <el-table-column                   label="操作"     >
           <template slot-scope="scope">
              <el-button type="text" size="small">
                 <span>
                   <i class="el-icon-circle-plus" @click="handleAdd()"></i>
                   <i class="el-icon-delete"  @click="handleDelete(scope.row)"></i>
                 </span>
             </el-button>
           </template>
         </el-table-column>
      </el-table>

    <!--增加书本内容-->
    <el-dialog
      title="新增记录"
      :visible.sync="dialogCreateVisible"
      style="text-align: left">
      <el-form :rules="addFormRules" ref="addForm" :model="addForm" :label-width="addFormLabelWidth">
          <el-form-item label="时间" :picker-options="pickerOptions">
        			<el-date-picker v-model="addForm.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">

              </el-date-picker>

              <el-time-picker
                  v-model="addForm.time"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                  placeholder="任意时间点"
                  value-format='HH:mm:ss'
                  >
                </el-time-picker>

          </el-form-item>
        <!-- <el-form-item label="时间" prop="date">
          <el-input v-model="addForm.date" name="date" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="收入" prop="money">

          <el-input v-model="addForm.money"  placeholder="请输入收入"></el-input>

        </el-form-item>
        <el-form-item label="备注" prop="remak">
          <el-input v-model="addForm.remark" name="remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createReset">取消</el-button>
        <el-button @click.native="createSubmit" :loading="addLoading" type="primary">确定</el-button>
      </div>
    </el-dialog>
      <div class="block" style="margin-left:30%">
          <!-- <span class="demonstration">完整功能</span> -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length">
          </el-pagination>
        </div>
</div>
</template>

<script>
export default {

  data () {
    return {
     currentPage:1,
            size:5,
       tableData: [],

       // 新增表单
         addForm: {
                    date: '',
                    time:'',
                   money: '',
                  remark: ''
               },
dialogCreateVisible: false,
  addFormLabelWidth: '80px',
         addLoading: false,
         addFormRules: {
                   date: [
                     { required: false, message: '请输入日期', trigger: 'blur'}
                   ],
                   time: [
                     { required: false, message: '请输入时间', trigger: 'blur'}
                   ],
                   money: [
                    {
                        "message": "请输入收入",
                        "required": true,
                        "trigger": "blur"
                    },
                    {
                    		pattern: /^\d+(\.\d+)?$/,
                    		message: '请输入正确的数值'
                    }

                   ],
                   remark: [
                     { required: false, message: '备注', trigger: 'blur' },

                   ],

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
       handleAdd () {
                this.dialogCreateVisible = true;
                this.addForm = {
                date: '',
                 money: '',
                remark: ''
                };
              },
        //  提交新增书籍信息
        createSubmit() {
                    this.$refs.addForm.validate((valid) => {
                        if (valid) {
                          this.$confirm('确认提交？', '提示', {}).then(() => {
                          this.addLoading = true;
                     let parematers= {
                           date: this.addForm.date +" "+ this.addForm.time,
                           money:this.addForm.money,
                           remark:this.addForm.remark,
                         };
                    var data =this.$qs.stringify(parematers);
                     console.log(data);
                           this.$http.post('/addRecord',data).then(res => {
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
                        }
                        else {
                          console.log('error');
                          return false;
                        }
                      })
         },
         createReset(){
           this.dialogCreateVisible = false;
         },
        /*查询*/
        getall() {
            this.$http.get('/all').then((res) => {
                this.tableData = res.data.data;//把传回来数据赋给table
        }).catch(function(error){
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

               this.tableData.splice(index+1, 1);//---前端删除index要+1 !!!!!!!
                let parematers= {
                         id: index.id
                       };
                var data =this.$qs.stringify(parematers);
                this.$http.post('/deleteRecord',data).then((response)=>{
                 this.getall();
                 //alert(response.data);
                 //这里是del成功以后需要做的。
                })
         },
         //失焦保存
          handleUpdate(index) {
                // this.tableData.splice(index+1, 1);//---前端删除index要+1 !!!!!!!
                  let parematers= {
                           id: index.id,
                           date:index.date,
                           remark:index.remark,
                           money:index.money
                         };
                  var data =this.$qs.stringify(parematers);
                  this.$http.post('/updateRecordById',data).then((response)=>{
                   console.log(response.status);
                  })
           },

    },
   mounted: function() {
     this.getall()
   },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
</style>
