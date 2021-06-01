<template>
    <div>
    <b-container style="margin-top:7%">
        <b-card-group deck >

        <b-card variant="no-outline" @click="to('Laporan Stok')" text-variant="grey" class="text-center card1" style="box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15)">
            <img src="../../assets/stock.png" width="40%">
            <b-card-text style="font-weight:bold;font-size:20px; margin-top:20px">LAPORAN STOK</b-card-text>
        </b-card>

        <b-card 
        variant="no-outline" @click="to('Laporan Pengeluaran')" text-variant="grey" class="text-center card1" style="box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15)">
            <img src="../../assets/pengeluaran.png" width="40%">
            <b-card-text  style="font-weight:bold;font-size:20px; margin-top:20px">LAPORAN PENGELUARAN</b-card-text>
        </b-card>
        </b-card-group>

        <b-card-group deck style="margin-top:20px">
        <b-card variant="no-outline" text-variant="grey" @click="to('Laporan Pendapatan')" class="text-center card1" style="box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15)">
            <img src="../../assets/pendapatan.png" width="40%">
            <b-card-text style="font-weight:bold;font-size:20px; margin-top:20px">LAPORAN PENDAPATAN</b-card-text>
        </b-card>

        <b-card variant="no-outline" @click="to('Laporan Penjualan')" text-variant="grey" class="text-center card1" style="box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15)">
            <img src="../../assets/penjualan.png" width="40%">
            <b-card-text style="font-weight:bold;font-size:20px; margin-top:20px">LAPORAN PENJUALAN</b-card-text>
        </b-card>
        </b-card-group>
    </b-container>
  </div>
</template>
<script>
import router from "@/router";
export default {
    methods:{
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