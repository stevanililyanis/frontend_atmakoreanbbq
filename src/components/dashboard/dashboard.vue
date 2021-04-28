<template>
  <div>
     <b-navbar fixed="top" toggleable="lg"  class="nav-item" style=" background-color:white" >

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-button style="background-color:#EC7309;color:white" variant="no-outline" v-b-toggle.sidebar-no-header > <b-icon icon="chevron-bar-right"></b-icon></b-button>
            <b-button style="background-color:#EC7309; margin-left:10px; color:white" variant="no-outline" to="/home" > <b-icon icon="house-door-fill"></b-icon></b-button>
            
            <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto" >
                <b-nav-item-dropdown :text="username" right>
                  <b-dropdown-item to="/profile"><b-icon icon="person-fill"></b-icon> Profile</b-dropdown-item>
                  <b-dropdown-item to="/jabatan">Dashboard</b-dropdown-item>
                  <b-dropdown-item @click="logout">Logout<b-icon icon="arrow-bar-right" style="margin-left:10px"></b-icon></b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
            </b-collapse>
        </b-navbar>

  <div id="side_button">
          
  </div>
     <b-sidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" no-header shadow>
      <template #default="{ hide }">
         <div class="d-flex text-dark align-items-center px-2 py-2">
        <strong class="mr-auto">
          <img src="../../assets/logo_akb.png" style="margin-left:20%" width="20%" >
        </strong>
         <b-button style="background-color:#EC7309;color:white" variant="no-outline" @click="hide"><b-icon icon="chevron-bar-left"></b-icon></b-button>
       </div>
       <h4 style="font-weight:bold;margin:0">Atma Korean BBQ</h4>
        <div class="p-3">
          
          <br>
          <p style="background-color:#A53A1D; color:white; font-size:15pt; font-weight:bold">DASHBOARD</p>
          <nav class="mb-3" >
       
              <b-row style="margin:10px;text-align:left; font-size:14pt">
                <b-nav vertical >
                  <b-nav-item v-if="jabatan.nama_jabatan=='Operasional Manager'||jabatan.nama_jabatan=='Owner'" to="/Jabatan" @click="hide">
                        <div class="warnaSD">
                        <b-row> 
                        <b-col cols="2">
                            <b-icon icon="person-bounding-box"></b-icon>
                        </b-col>
                        <b-col>
                          Data Jabatan
                        </b-col>
                        </b-row>
                        </div>
                    </b-nav-item><br>
                      <b-nav-item v-if="jabatan.nama_jabatan=='Operasional Manager'||jabatan.nama_jabatan=='Owner'" to="/Karyawan" @click="hide">
                        <div class="warnaSD">
                        <b-row> 
                        <b-col cols="2">
                            <b-icon icon="person-fill"></b-icon>
                        </b-col>
                        <b-col>
                          Data Karyawan
                        </b-col>
                        </b-row>
                        </div>
                    </b-nav-item><br>
                    <b-nav-item v-if="jabatan.nama_jabatan=='Operasional Manager'" to="/Menu" @click="hide">
                    <div class="warnaSD">
                        <b-row> 
                        <b-col cols="2">
                            <b-icon icon="journal-bookmark-fill"></b-icon>
                        </b-col>
                        <b-col>
                            Data Menu
                        </b-col>
                        </b-row>
                        
                    </div>
                    </b-nav-item><br>
                    <b-nav-item v-if="jabatan.nama_jabatan=='Operasional Manager'" to="/Meja" @click="hide">
                    <div class="warnaSD">
                        <b-row> 
                        <b-col cols="2">
                            <b-icon icon="bricks"></b-icon>
                        </b-col>
                        <b-col>
                            Data Meja
                        </b-col>
                        </b-row>
                        
                    </div>
                    </b-nav-item><br>
                  <!--   <b-nav-item to="/Data-reservasi" @click="hide">
                        <div class="warnaSD">
                        <b-row> 
                        <b-col cols="2">
                            <b-icon icon="person-fill"></b-icon>
                        </b-col>
                        <b-col>
                          Data Reservasi
                        </b-col>
                        </b-row>
                        </div>
                    </b-nav-item><br> -->
                     <b-nav-item v-if="jabatan.nama_jabatan=='Operasional Manager'" to="/Bahan" @click="hide">
                        <div class="warnaSD">
                        <b-row> 
                        <b-col cols="2">
                            <b-icon icon="list-check"></b-icon>
                        </b-col>
                        <b-col>
                          Data Bahan
                        </b-col>
                        </b-row>
                      
                        </div>
                    </b-nav-item><br>
                     <b-nav-item v-if="jabatan.nama_jabatan=='Operasional Manager'||jabatan.nama_jabatan=='Chef'" to="/history" @click="hide">
                        <div class="warnaSD">
                        <b-row> 
                        <b-col cols="2">
                            <b-icon icon="truck"></b-icon>
                        </b-col>
                        <b-col>
                          Riwayat Keluar & Masuk Bahan
                        </b-col>
                        </b-row>
                      
                        </div>
                    </b-nav-item><br>
                    <b-nav-item v-if="jabatan.nama_jabatan=='Operasional Manager'||jabatan.nama_jabatan=='Owner'" to="/UpdateBerita" @click="hide" >
                        <div class="warnaSD">
                        <b-row> 
                        <b-col cols="2">
                            <b-icon icon="file-earmark-spreadsheet"></b-icon>
                        </b-col>
                        <b-col>
                            Laporan Transaksi
                        </b-col>
                        </b-row>
                        </div>
                    </b-nav-item><br>
                  
                </b-nav>
              </b-row>
        
             
           
          </nav>
          
        </div>
      </template>
    </b-sidebar>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data(){
    return{
      username:localStorage.getItem('email'),
      isLogedin:false,
      jabatan:null
    }
    
  },
  beforeMount(){
    this.authentication()
    this.readJabatan()
  },
  methods:{
    readJabatan(){
        var url = this.$api + '/jabatan/'+ localStorage.getItem('roleId')
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.jabatan = response.data.data
           })
      },
    authentication(){
           this.isLogedin=this.$user.get().isLogedin
        },
    logout(){
        let user;
        this.item = new FormData;
        var url = this.$api + '/logout'
              this.load = true
              this.$http.post(url, this.item, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
              }).then(response => {
                this.error_message = response.data.message;
                localStorage.setItem('token',null);
                localStorage.setItem('access_token',null);
                localStorage.setItem('isLogedin',0);
                localStorage.setItem('email',null);
                localStorage.setItem('roleId',null);
                user={
                  role:"unauthenticated",
                  id:null,
                  isLogedin:false
                }
                this.isLogedin=false
                this.$user.set(user);
                 this.$router.push({
                  name:"Login"
                });

              }).catch(error => {
                this.error_message = error.response.data.message;
              })          
              
             
        },
  }
}
</script>
<style>
#side_button{
    position: relative !important;
    margin: 0%;
}
.warnaSD{
    color: #A53A1D;
}
.warnaSD:hover{
    color: #EC7309;
}
</style>