<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4"">
                        <h1 class="text-h5 text-center font-weight-bold">รายงานผลการประเมินที่สำเร็จ</h1>
                    </v-sheet>
                    <v-card-text>
                        รายผู้รับการประเมินผล
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ชื่อ-นามสกุล</th>
                                    <th class="border text-center">อีเมล</th>
                                    <th class="border text-center">ชื่อผู้ใช้</th>
                                    <th class="border text-center">คะแนนประเมินของผู้รับการประเมิน</th>
                                    <th class="border text-center">คะแนนประเมินของกรรมการประเมิน</th>
                                    <th class="border text-center">สถานะการประเมิน</th>
                                    <!-- <th class="border text-center">จัดการ</th> -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_member">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.first_name }} {{ items.last_name }}<br><span class="opacity-85">{{ items.role }}</span></td>
                                    <td class="border text-center">{{ items.email }}</td>
                                    <td class="border text-center">{{ items.username }}</td>
                                    <td class="border text-center">{{ items.total_eva === null ? '00.00' : items.total_eva }}</td>
                                    <td class="border text-center">{{ items.total_commit === null ? '00.00' : items.total_commit }}</td>
                                    <td class="border text-center">
                                       {{ items.status_eva === 1 ? 'ประเมินตนเอง' : items.status_eva === 2 ? 'กรรมการประเมิน' : 'ประเมินเสร็จสิ้น' }}
                                    </td>
                                    <!-- <td class="border text-center">
                                        <v-btn class="text-white" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>&nbsp;
                                        <v-btn class="text-white" size="small" color="error" @click="del(items.id_member)">ลบ</v-btn>
                                    </td> -->
                                </tr>
                                <tr v-if="result.length === 0">
                                    <td class="text-center border" colspan="10">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                        <br>
                        <center><v-btn class="text-white noP" color="warning" @click="print()" prepend-icon="mdi-printer">พิมพ์</v-btn></center>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../../API/base'

const token = process.client ? localStorage.getItem('token') : null

const result = ref([])

const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/eva/y`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fething',err)
    }
}
const print = () => {
    window.print()
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}


@media print {
    .v-btn,.noP{
        display: none;
    }
}
</style>