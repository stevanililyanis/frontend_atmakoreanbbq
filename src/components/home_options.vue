<template>
    <div>
    <b-container style="margin-top:7%">
        <b-card-group deck >
        <b-card variant="no-outline" @click="to('Customers')"  text-variant="grey" class="text-center card1" style="box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15)">
            <img src="../assets/customer.png" width="40%">
            <b-card-text style="font-weight:bold;font-size:20px; margin-top:20px">DATA CUSTOMER</b-card-text>
        </b-card>

        <b-card variant="no-outline" @click="to('Reservation')" text-variant="grey" class="text-center card1" style="box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15)">
            <img src="../assets/reservation.png" width="40%">
            <b-card-text style="font-weight:bold;font-size:20px; margin-top:20px">DATA RESERVASI</b-card-text>
        </b-card>

        <b-card v-if="jabatan.nama_jabatan=='Operasional Manager'||jabatan.nama_jabatan=='Chef'||jabatan.nama_jabatan=='Waiter'"
        variant="no-outline" text-variant="grey" class="text-center card1" style="box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15)">
            <img src="../assets/preservation.png" width="40%">
            <b-card-text  style="font-weight:bold;font-size:20px; margin-top:20px">PESANAN</b-card-text>
        </b-card>
        </b-card-group>

        <b-card-group deck style="margin-top:20px">
        <b-card v-if="jabatan.nama_jabatan=='Operasional Manager'||jabatan.nama_jabatan=='Kasir'" variant="no-outline" text-variant="grey" class="text-center card1" style="box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15)">
            <img src="../assets/cashier.png" width="40%">
            <b-card-text style="font-weight:bold;font-size:20px; margin-top:20px">KASIR</b-card-text>
        </b-card>

        <b-card variant="no-outline" @click="to('Display Menu')" text-variant="grey" class="text-center card1" style="box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15)">
            <img src="../assets/menu.png" width="40%">
            <b-card-text style="font-weight:bold;font-size:20px; margin-top:20px">MENU</b-card-text>
        </b-card>
        </b-card-group>
    </b-container>
  </div>
</template>
<script>
import router from "@/router";
export default {
    data(){
        return{
            jabatan:null
        }
    },
    beforeMount(){
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
        to(name){
            router.push({
                    name: name
                     })
        }
    }
}
</script>
<style scoped>
.card1 {
  margin: 1rem;
  transition: 0.3s ease-in-out;
}
.card1:hover {
  transform: scale(1.05);
}
</style>