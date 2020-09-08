<template>
  <div class="app">
    <el-row>
      <el-button type="warning" @click="quit()" plain>安全退出</el-button>
      <el-button type="primary" @click="OilRecord()" plain>加油记录</el-button>
      <el-button type="primary" @click="toPrint()" plain>打印记录</el-button>
      <el-button type="primary" @click="toXiYaoPerson()" plain>西姚村花名册</el-button>
      <el-button type="primary"  @click="toLifeRecord()" plain>收支明细</el-button>
      <el-button type="primary" plain>用户列表</el-button>
    </el-row>
    <el-table :data="tableData.slice((currentPage-1)*size,currentPage*size)" style="width: 100%">
      <el-table-column prop="realName" label="姓名" width="200px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.realName" style="width:150px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="170px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.gender" style="width:140px;" @blur="handleUpdate(scope.row)">
          </el-input>
        </template>
      </el-table-column>

      <el-table-column prop="identityCard" label="身份证号" width="220px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.identityCard" style="width:200px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="address" label="地址" width="300px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.address" style="width:280px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机" width="240px" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.phone" style="width:220px;" @blur="handleUpdate(scope.row)"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="390px"  align="center">
          <template slot-scope="scope">
              <el-button size="mini" type="danger"  @click="handleDelete(scope.row)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>

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
        dialogCreateVisible: false,
        addFormLabelWidth: '80px',
        addLoading: false,
      }
    },
    methods: {
      /*查询*/
      getall() {
        this.$http.get('/user/findAllUser').then((res) => {
          this.tableData = res.data.data; //把传回来数据赋给table

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
        this.$http.post('/user/deleteUser', data).then((response) => {
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
      toLifeRecord() {
        // console.log("record")toXiYaoPerson
        this.$router.replace("/liferecord");
      },
      OilRecord() {
      console.log("OilRecord")
      this.$router.replace("/oilrecord");
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
