<template>
    <body>
         <b-button to="/home" size="md" variant="no-outline" style="margin-bottom:20px;background-color:#A53A1D;font-weight:bold;color:white"><b-icon icon="arrow-bar-left"></b-icon> Kembali</b-button>
           <div >
                <h2 style="font-weight:bold;color:#A53A1D">MENU ATMA KOREAN BBQ</h2>
            </div>
          <b-card-group deck >
              <b-card v-for="item in menus" :key="item.id_menu"
                :title="item.nama_menu"
                :img-src="`http://127.0.0.1:8000` + item.gambar"
                img-top
                tag="article"
                style="max-width: 20rem;"
                class="mb-2">
                  {{item.deskripsi_menu}}
                  Rp {{item.harga_menu}},-
              </b-card>
          </b-card-group>
    </body>
</template>
<script>
export default {
    data(){
        return{
            menus:[]
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