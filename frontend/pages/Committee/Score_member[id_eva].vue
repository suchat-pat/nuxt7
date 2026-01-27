<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_eva === 2 || user.status_eva === 3">
                    <h1 class="text-h5 font-weight-bold">คะแนนประเมินตนเอง</h1>
                    <v-card class="mt-2 pa-2">
                        <p>ชื่อ - นามสกุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมิน : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row class="mt-2" v-for="(topic,index1) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6">{{ index1+1 }}.{{ topic.name_topic }}</h1>
                            <v-table class="table">
                                <tr>
                                    <th class="bg-grey text-black border pa-1" style="width: 10%;">ตัวชี้วัด</th>
                                    <th class="bg-grey text-black border pa-1" style="width: 10%;">รายละเอียดตัวชี้วัด</th>
                                    <th class="bg-grey text-black border pa-1" style="width: 10%;">น้ำหนักคะแนน</th>
                                    <th class="bg-grey text-black border pa-1" style="width: 10%;">คะแนนเต็ม</th>
                                    <th class="bg-grey text-black border pa-1" style="width: 10%;">รายละเอียด</th>
                                    <th class="bg-grey text-black border pa-1" style="width: 10%;">ไฟล์</th>
                                    <th class="bg-grey text-black border pa-1" style="width: 10%;">คะแนนที่ได้</th>
                                </tr>
                                <tr v-for="indicate in topic.indicates" :key="indicate.id_indicate">
                                    <th class="text-center border pa-1">{{ indicate.name_indicate }}</th>
                                    <th class="text-center border pa-1">{{ indicate.detail_indicate }}</th>
                                    <th class="text-center border pa-1">{{ indicate.point_indicate }}</th>
                                    <th class="text-center border pa-1">{{ indicate.point_indicate*4 }}</th>
                                    <th class="text-center border pa-1">{{ indicate.detail_eva || '-' }}</th>
                                    <th class="text-center border pa-1"><v-btn v-if="indicate.file_eva" @click="viweFile(indicate.file_eva)" color="blue">ดูไฟล์</v-btn><span v-else>-</span></th>
                                    <th class="text-center border pa-1">{{ indicate.score_member*indicate.point_indicate }}</th>
                                </tr>
                            </v-table>
                        </v-col>
                    </v-row>
                    <div class="mt-4 text-center">
                        <v-card class="pa-2 text-end" color="success">คะแนนรวม : {{ user.total_eva }} คะแนน</v-card>
                    </div>
                </v-form>
                <v-alert v-else-if="user.status_eva === 1" type="info">ยังไม่ได้ประเมินตนเอง</v-alert>
                <v-alert v-else>ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import {commit} from '../../API/base'

const id_eva = useRoute().params.id_eva
const user = ref<any>({})
const topics = ref<any>([])
const token = process.client ? localStorage.getItem('token') : null

const viweFile = (filename:string) =>{
    const url = `http://localhost:3001/uploads/evadetail/${filename}`
    window.open(url,'__blank')
}

const fetchUser = async () =>{
    try{
        const res = await axios.get(`${commit}/score_member/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error GET User!',err)
    }
}
const fetchTopic = async () =>{
    try{
        const res = await axios.get(`${commit}/score_member/indicate/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error GET User!',err)
    }
}
onMounted(async () =>{
    await Promise.all([fetchTopic(),fetchUser()])
})

</script>

<style scoped>

</style>