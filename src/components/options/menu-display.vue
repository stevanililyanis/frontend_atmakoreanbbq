<template>
    <body>
         <b-button to="/home" size="md" variant="no-outline" style="margin-bottom:20px;background-color:#A53A1D;font-weight:bold;color:white"><b-icon icon="arrow-bar-left"></b-icon> Kembali</b-button>
           <div >
                <h2 style="font-weight:bold;color:#A53A1D">MENU ATMA KOREAN BBQ</h2>
            </div>
            <input v-model="filter" type="text" class="form-control"
                        placeholder="Search Menu...." >
        <b-row style="height:5%">
                <b-col
                class="col-md-3 col-sm-12"
                 v-for="item in filteredMenu" :key="item.id_menu">
           
          <b-card-group deck style="margin-top:20px" >
              <b-card 
                :title="item.nama_menu"
                :img-src="`http://127.0.0.1:8000` + item.gambar"
                img-top
                tag="article"
                img-height="200rem"
                img-width="20rem"
                class="mb-2"
                :footer="`Rp `+item.harga_menu+`,-`"
                footer-bg-variant="warning"
                align="center">
                  <b-row>
                      {{item.deskripsi_menu}}
                  </b-row>
                  <template #footer>

                  </template>
                  
              </b-card>
          </b-card-group>
               </b-col>
        </b-row>
    </body>
</template>
<script>
export default {
    data(){
        return{
            menus:[],
            filter:'',
        }
    },
    methods:{
        readData(){
            var url = this.$api + '/menu'
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.menus = response.data.data
           })
        }
    },
    computed:{
        filteredMenu(){
            return this.menus.filter(m => {
            return m.nama_menu?.toString().toLowerCase().includes(this.filter?.toLowerCase()) ||
            m.deskripsi_menu?.toLowerCase().includes(this.filter?.toLowerCase())
            });
        }
    },
    beforeMount(){
        this.readData()
    }
}
</script>
<style scoped>
body{

  padding-left: 5%;
  padding-right: 5%;
  margin-top:7%; 
}
</style>