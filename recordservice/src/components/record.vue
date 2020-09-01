<script src="../printService/js/record.js"></script>
<!--<style src="../printService/css/record.css"></style>-->
<template>
  <div class="app">
    <el-row>
       <el-button type="warning" @click="quit()" plain>安全退出</el-button>
       <el-button type="primary" @click="OilRecord()" plain>加油记录</el-button>
       <el-button type="primary" @click="PrintRecord()" plain>打印记录</el-button>
       <el-button type="primary" plain>查看</el-button>
    </el-row>
    <el-table :data="tableData.slice((currentPage-1)*size,currentPage*size)" style="width: 100%">
      <!--  <el-table-column prop="id" label="序号" width="350">
        <template slot-scope="scope">
          <el-input v-model="scope.row.id" style="width:275px;" :disabled="true"></el-input>
        </template>
      </el-table-column>-->
      <el-table-column prop="date" label="日期" width="350">
        <template slot-scope="scope">
          <el-input v-model="scope.row.date" style="width:275px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="收入" width="350">

        <template slot-scope="scope">
          <el-input v-model="scope.row.money" style="width:275px;" @blur="handleUpdate(scope.row)" placeholder="请输入收入"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}">
          </el-input>
        </template>

      </el-table-column>

      <el-table-column prop="remark" label="备注" width="350">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" style="width:275px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
   <div>
      <el-table :data="table2Data" style="width: 100%">

        <el-table-column prop="printSum" label="打印收入总和" width="200px">  </el-table-column>

      </el-table>
    </div>
    <!--增加书本内容-->
    <el-dialog title="新增记录" :visible.sync="dialogCreateVisible" style="text-align: left">
      <el-form :rules="addFormRules" ref="addForm" :model="addForm" :label-width="addFormLabelWidth">
        <el-form-item label="时间" :picker-options="pickerOptions">
          <el-date-picker v-model="addForm.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">

          </el-date-picker>

          <el-time-picker v-model="addForm.time" :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
            placeholder="任意时间点" value-format='HH:mm:ss'>
          </el-time-picker>

        </el-form-item>
        <!-- <el-form-item label="时间" prop="date">
          <el-input v-model="addForm.date" name="date" auto-complete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="收入" prop="money">

          <el-input v-model="addForm.money" placeholder="请输入收入"></el-input>

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
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
      </el-pagination>
    </div>
  </div>
</template>
<style scoped>
  a {
    color: #42b983;
  }
</style>
