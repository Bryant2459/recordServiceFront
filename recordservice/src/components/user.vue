<template>
  <div class="app">
    <el-row>
      <el-button type="warning" @click="quit()" plain>安全退出</el-button>
      <el-button type="primary" @click="OilRecord()" plain>加油记录</el-button>
      <el-button type="primary" @click="toPrint()" plain>打印记录</el-button>
      <el-button type="primary" @click="toXiYaoPerson()" plain>西姚村花名册</el-button>
      <el-button type="primary" @click="toLifeRecord()" plain>收支明细</el-button>
      <el-button type="primary" plain>用户列表</el-button>
      <el-button type="primary" @click="toStudent()" plain>学生列表</el-button>
      <el-button type="success">Kobe Bryant</el-button>
    </el-row>
    <el-table :data="tableData.slice((currentPage-1)*size,currentPage*size)" style="width: 100%">
      <el-table-column prop="picture" label="头像" width="200px" align="center">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
      </el-table-column>
      <el-table-column prop="uploadPic" label="修改头像" width="380px" align="center">

        <el-upload name="file" 　　 class="avatar-uploader" :action="updateUrl" :data="itemForm" 　　 :before-upload="beforeAvatarUpload"
          :on-error="handleError" :on-progress="handleProgress" 　　 :on-success="handleAvatarSuccess" ref="newupload">

          <el-button slot="trigger" size="small" icon="el-icon-upload" style="margin-top: 0px;">选择上传文件
            　　</el-button>
          　　<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb </div>
        </el-upload>

      </el-table-column>
      <el-table-column prop="realName" label="姓名" width="150px" align="center"> </el-table-column>
      <el-table-column prop="gender" label="性别" width="100px" align="center"></el-table-column>
      <el-table-column prop="address" label="地址" width="250px" align="center"></el-table-column>
      <el-table-column prop="role" label="角色" width="100px" align="center"> </el-table-column>
      <el-table-column prop="phone" label="手机" width="170px" align="center"> </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
        imageUrl: "",
        itemForm: {
          id: "",
        },
        fd: '', //向服务器进行传递的参数（带有图片formdata）
        updateUrl: '/api/file/upload',
        currentPage: 1,
        size: 5,
        tableData: [],
        dialogCreateVisible: false,
        addFormLabelWidth: '80px',
        addLoading: false,
      }
    },
    methods: {
      handleClick(index) {

        this.id = index.id;



        //alert(response.data);
        //这里是del成功以后需要做的。

      },
      handleAvatarSuccess(res, file) {
        if (res.message == "上传成功") {

          this.imageUrl = 'http://localhost:8081/file/image/' + res.data;
          var srt = "";
          console.log(this.imageUrl);
        } else {
          alert("上传图片失败");
        }
      },
      handleError() {

      },
      handleProgress(event, file, fileList) {
        this.loading = true; //  上传时执行loading事件
      },
      beforeAvatarUpload(file) {
        //在头像上传之前需要做的判断，如判断文件格式
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.warning('上传头像图片只能是 JPG/PNG/GIF 格式!')
          return isJPG
        }
        if (!isLt2M) {
          this.$message.warning('上传头像图片大小不能超过 2MB!')
          return isLt2M
        }
        this.file = file
        return isJPG && isLt2M
      },
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
      toStudent() {
        this.$router.replace("/student");
        //toPicTable
      }

    },
    mounted: function() {
      this.getall()
    },

  }
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
