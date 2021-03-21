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
        money: '',
        remark: ''
      },
      dialogCreateVisible: false,
      addFormLabelWidth: '80px',
      addLoading: false,
      addFormRules: {
        date: [{
          required: false,
          message: '请输入日期',
          trigger: 'blur'
        }],
        time: [{
          required: false,
          message: '请输入时间',
          trigger: 'blur'
        }],
        money: [{
          "message": "请输入收入",
          "required": true,
          "trigger": "blur"
        },
          {
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入正确的数值'
          }

        ],
        remark: [{
          required: false,
          message: '备注',
          trigger: 'blur'
        },

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
    handleAdd() {
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
            let parematers = {
              date: this.addForm.date + " " + this.addForm.time,
              money: this.addForm.money,
              remark: this.addForm.remark,
            };
            var data = this.$qs.stringify(parematers);
            console.log(data);
            this.$http.post('/print/addPrintRecord', data).then(res => {
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
      this.$http.get('/print/findAllPrintRecords').then((res) => {
        this.tableData = res.data.data; //把传回来数据赋给table
        var table2obj = {};
        var printSum = 0;
        for (var i = 0; i < res.data.data.length; i++) {
          printSum = printSum + res.data.data[i].money;
        }
        table2obj['printSum'] = printSum;
        this.table2Data.push(table2obj);

      }).catch(function (error) {
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
      this.$http.post('/print/deletePrintRecord', data).then((response) => {
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
        date: index.date,
        remark: index.remark,
        money: index.money
      };
      var data = this.$qs.stringify(parematers);
      this.$http.post('/print/updatePrintRecordById', data).then((response) => {
        console.log(response.status);
        //  this.getall();
      })
    },
    quit() {
      console.log("quit")
      this.$router.replace("./");
    },
    OilRecord() {
      console.log("OilRecord")
      this.$router.replace("/oilrecord");
    },
    PrintRecord() {
      console.log("record")
      this.$router.replace("/record");
    },
    toXiYaoPerson() {
      console.log("xiyaoperson")
      this.$router.replace("/xiyaoperson");
    },
    toLifeRecord() {
      // console.log("record")
      this.$router.replace("/liferecord");
    },
    toUser() {
      this.$router.replace("/user");
    },
    OilRecord() {
      this.$router.replace("/oilrecord");
    },
    toStudent() {
      this.$router.replace("/student");
      //toPicTable
    }

  },
  mounted: function () {
    this.getall()
  },
}
