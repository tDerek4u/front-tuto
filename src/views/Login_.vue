<template>
   <div class="container">
    <br>
    <br>
    <br>
    <div class="row d-flex justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card bg-white shadow-lg">
          <div class="card-body p-5">
            <form class="mb-3 mt-md-4">
              <h2 class="fw-bold mb-2 text-uppercase ">Login Form</h2>
              <p class=" mb-5">Please enter your login and password!</p>
              <div class="mb-3">
                <label for="email" class="form-label ">Email address</label>
                <input type="email" class="form-control" :class="hasError('email') ? 'is-invalid' : ''" v-model="datas.email" id="email" placeholder="name@example.com" required>
                <div class="invalid-feedback" v-if="hasError('email')" >
                  {{ getError('email') }}
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label ">Password</label>
                <input type="password" class="form-control" :class="hasError('password') ? 'is-invalid' : ''" v-model="datas.password" id="password" placeholder="*******" required>
                <div class="invalid-feedback" v-if="hasError('password')" >
                  {{ getError('password') }}
                </div>
              </div>
              <div class="d-grid">
                <button class="btn btn-outline-dark" type="button" @click="accountLog()">Login</button>
              </div>
            </form>
            <hr>
            <div class="d-flex justify-content-center">
              <span class="">Already have an account ?</span><router-link class="text-decoration-none ms-3" :to="{name:'register_'}" >Sign up</router-link>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";


export default ({
    name: 'Login_',
    data() {
        return {
            datas : {
                email : "",
                password : ""
            },
            errors : {},
           
        }
    },

    methods: {
        home(){
            this.$router.push({
                name : "home_"
            })
        },
        async accountLog(){
            axios.post("http://127.0.0.1:8000/api/login", this.datas).then((response) => {
                    if(response.data.token != null){
                        this.userStatus = false
                        this.datas.email = ""
                        this.datas.password = ""
                        localStorage.setItem("setToken",response.data.token)
                        this.home();
                    }else{
                        this.userStatus = true;
                        this.datas.email = ""
                        this.datas.password = ""
                    }
            }).catch((error) => {
                if(error.response.status == 422){
                    this.setErrors(error.response.data.errors)
                }else{
                   //
                }
                
            })
        },
        setErrors(errors){
            this.errors = errors;
        },
        hasError(filedName){
            return (filedName in this.errors)
        },
        getError(fieldName){
            return this.errors[fieldName][0];
        },
    },
  });
</script>
