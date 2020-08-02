<template>
  <div>
    <div class="login-box">
      <!-- 通过:rules="loginFormRules"来绑定输入内容的校验规则 -->
      <el-form :rules="loginFormRules" ref="loginForm" :model="loginForm" label-position="right" label-width="auto"
        show-message>
        <span class="login-title">欢迎登录</span>
        <div style="margin-top: 5px"></div>
        <el-form-item label="用户名" prop="userName">
          <el-col :span="22">
            <el-input type="text" v-model="loginForm.userName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-col :span="22">
            <el-input type="password" v-model="loginForm.userPassword"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginSubmit('loginForm')">登录</el-button>
          <el-button type="primary" @click="onRegit()">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-dialog title="新增用户" :visible.sync="dialogCreateVisible" style="text-align: left">
        <el-form :rules="addFormRules" ref="addForm" :model="addForm" :label-width="addFormLabelWidth">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="addForm.userName" name="userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-input v-model="addForm.userPassword" name="userPassword"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="addForm.realName" name="realName"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-input v-model="addForm.gender" name="gender"></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="identityCard">
            <el-input v-model="addForm.identityCard" name="identityCard"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="addForm.phone" name="phone"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="addForm.address" name="address"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="createReset">取消</el-button>
          <el-button @click.native="createSubmit" :loading="addLoading" type="primary">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    name: "login",
    data() {
      return {
        loginForm: {
          userName: '',
          userPassword: ''
        },
        // 表单验证，需要在 el-form-item 元素中增加 prop 属性
        loginFormRules: {
          userName: [{
            required: true,
            message: '账号不可为空',
            trigger: 'blur'
          }],
          userPassword: [{
            required: true,
            message: '密码不可为空',
            trigger: 'blur'
          }]
        },
        // 新增表单
        addForm: {
          userName: '',
          userPassword: '',
          realName: '',
          gender: '',
          identityCard: '',
          phone: '',
          address: ''
        },
        dialogCreateVisible: false,
        addFormLabelWidth: '80px',
        addLoading: false,
        addFormRules: {
          userName: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          userPassword: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          realName: [{
            required: true,
            message: "请输入真实姓名",
            trigger: "blur"
          }],
          gender: [{
            required: true,
            message: "请输入性别",
            trigger: "blur"
          }],
          identityCard: [{
            required: true,
            message: '请输入身份证号码',
            trigger: 'blur'
          }, ],
          phone: [{
            required: true,
            message: '请输入手机',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '请输入地址',
            trigger: 'blur'
          }],
        },
      }
    },
    methods: {
      loginSubmit(formName) {
        // 为表单绑定验证功能
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let parematers = {
              userName: this.loginForm.userName,
              userPassword: this.loginForm.userPassword
            };
            var data = this.$qs.stringify(parematers);
            this.$http.post('/user/login', data).then((response) => {

              if (response.data.message == '登陆成功') {
                // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
                // console.log("to loginSuccess")
                this.$router.replace("/record");
              } else {
                // this.$router.replace("/");
              }
            })

          } else {
            return false;
          }
        });
      },
      onRegit() {
        this.dialogCreateVisible = true;
        this.addForm = {
          userName: '',
          userPassword: '',
          realName: '',
          gender: '',
          identityCard: '',
          phone: '',
          address: ''
        };
      },
      createReset() {
        this.dialogCreateVisible = false;
      },
      //  提交新增用户信息
      createSubmit() {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交？', '提示', {}).then(() => {
              this.addLoading = true;
              let parematers = {
                userName: this.addForm.userName,
                userPassword: this.addForm.userPassword,
                realName: this.addForm.realName,
                gender: this.addForm.gender,
                identityCard: this.addForm.identityCard,
                phone: this.addForm.phone,
                address: this.addForm.address,
              };
              var data = this.$qs.stringify(parematers);
              console.log(data);
              this.$http.post('/user/register', data).then(res => {
                this.addLoading = false;
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                this.dialogCreateVisible = false;
                //注册成功，登录
                this.$router.replace("./");
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
    }
  }
</script>
<style scoped>
  .login-box {
    border: 1px solid #DCDFE6;
    width: 350px;
    margin: 180px auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px palegreen;
  }

  .login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #66CD00;
    font-size: 30px;
    font-weight: bold;
  }
</style>
