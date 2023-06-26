<template>
  <div class="container my-5">
    <div class="row text-center">
      <h1 v-if="!tokenStatus">You Don't Have Permission To Get Data :- [</h1>
    </div>
    <div class="row justify-content-end"  v-if="tokenStatus">
      <div class="col-4 mb-3 ">
        <button class="btn btn-primary" @click="create()">Create</button>
      </div>
      <div class="col-4  mb-3">
        <button class="btn btn-warning" v-if="tokenStatus" @click="logout()">Logout</button>
      </div>
    </div>
    <div class="row"  v-if="tokenStatus">
      <div class="col-4">
        <div class="card">
          <h4 class="card-header">{{ isEdit ? 'Edit' : 'Create' }}</h4>
          <div class="card-body">
            <form action="">
              <div class="form-group">
                <label>Item</label>
                <input type="text" v-model="order.item" class="form-control" :class="hasError('item') ? 'is-invalid' : ''" >
                <div class="invalid-feedback" v-if="hasError('item')" >
                  {{ getError('item') }}
                </div>
              </div>
              <div class="form-group">
                <label>Quantity</label>

                <input type="text"  v-model="order.quantity"  class="form-control" :class="hasError('quantity') ? 'is-invalid' : ''">
                <div class="invalid-feedback"  v-if="hasError('quantity')">
                  {{ getError('quantity') }}
                </div>
              </div>
              <button type="button" class="btn btn-primary mt-3" @click="isEdit ? update() : addOrder()">Save</button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-8">
        <table class="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.item }}</td>
              <td>{{ order.quantity }}</td>
              <td></td>
              <td>
                <button type="button" class="btn btn-success me-2  btn-sm"  @click="editOrder(order)" >Edit</button>
                <button   type="button" class="btn btn-danger btn-sm" @click="deleteOrder(order.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  
import axios from "axios"
import { Form } from "vform";

    export default {
        name : "HomePage",
        data: ()=> ({
            tokenStatus : false,
            isEdit : false,
            orders : [],
            order : new Form({
                id : "",
                item: "",
                quantity: ""
            }),
            errors: {}
        }),
        methods: {
            login(){
                this.$router.push("/")
            },
            getOrders() {
                const  token = localStorage.getItem("setToken")
                axios.get("http://127.0.0.1:8000/api/orders",{headers:{'Authorization' : `Bearer ${token} `}}).then((response) => {
                    this.orders = response.data.orders
                }); 

            },
            addOrder(){
                
                const  token = localStorage.getItem("setToken")
                this.order.post("http://127.0.0.1:8000/api/add/order",{headers:{'Authorization' : `Bearer ${token} `}})
                .then(() => {
                  this.getOrders()
                  this.order.id = ""
                  this.order.item = ""
                  this.order.quantity = ""
                }).catch((error) => {
                    if(error.response.status == 422){
                        this.setErrors(error.response.data.errors)
                    }else{
                        this.onFailure(error.response.data.message)
                    }
                })
            },
            setErrors(errors){
                this.errors = errors;
            },
            hasError(fieldName){
                return (fieldName in this.errors);
            },
            getError(fieldName){
                return this.errors[fieldName][0];
            },
            create(){
                this.isEdit = false;
                this.order.item = ""
                this.order.quantity = ""
            },
            editOrder(order){
                this.isEdit = true
                this.order.id = order.id;
                this.order.item = order.item;
                this.order.quantity = order.quantity;
            },
            update(){
                const  token = localStorage.getItem("setToken")
                this.order.post(`http://127.0.0.1:8000/api/update/${this.order.id}`,{headers:{'Authorization' : `Bearer ${token} `}})
                .then((response) => {
                  console.log(response.data)
                  this.getOrders()
                  this.order.id = ""
                  this.order.item = ""
                  this.order.quantity = ""

                })
                
            },
            deleteOrder(id){
                
                const  token = localStorage.getItem("setToken")
                console.log(token);
                this.order.post(`http://127.0.0.1:8000/api/delete/${id}`,{headers:{'Authorization' : `Bearer ${token} `}}).then(() => {
                  this.getOrders()
                }); 
            },
            logout(){
                const  token = localStorage.getItem("setToken")
                
                this.order.post(`http://127.0.0.1:8000/api/logout`,{headers:{'Authorization' : `Bearer ${token} `}}).then(() => {
                    
                    localStorage.removeItem("setToken")
                    this.login()
                }); 
            },
            checkToken(){
                const  token = localStorage.getItem("setToken")
                if(token != null){
                    this.tokenStatus = true;
                }else{
                    this.tokenStatus = false;
                }
            },
            
        },
        created(){
            this.checkToken()
          if(this.tokenStatus){
            this.getOrders();
          }
            
          
                
            
        }
    }
</script>