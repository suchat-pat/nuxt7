<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="text-h5 font-weight-bold">แบบประเมินตนเอง</h1>
                <v-card class="mt-2 pa-2">
                    <p>ชื่อ - นามสกุล : {{ user.first_name }} {{ user.last_name }}</p>
                    <p>รอบประเมิน : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                </v-card>
                <v-row class="mt-2" v-for="(topic,index1) in topics" :key="topic.id_topic">
                    <v-col cols="12">
                        <h1 class="text-h6">{{ index1+1 }}.{{ topic.name_topic }}</h1>
                        <v-card class="pa-2">
                            <v-row>
                                <v-col cols="12" v-for="(indicate,index2) in topic.indicates" :key="indicate.id_indicate">
                                    <p>
                                        {{ index1+1 }}.{{ index2+1 }} {{ indicate.name_indicate }} รายละเอียดตัวชี้วัด : {{ indicate.detail_indicate }} น้ำหนักคะแนน : {{ topic.point_indicate }} คะแนนเต็ม : {{ topic.point_indicate*4 }}
                                    </p>
                                    <v-textarea label="ชื่อ" v-model="indicate.detail_eva" rows="2"></v-textarea>
                                    <v-file-input label="file" accept="image/*,.pdf" @change="onFileChange($event,topic.id_topic,indicate.id_indicate)"></v-file-input>
                                    <v-select v-if="indicate.check_indicate" label="ใส่คะแนนประเมิน 1-4" :items="[1,2,3,4]" v-model="indicate.score"></v-select>
                                    <v-text-field v-else label="ใส่คะแนนประเมิน 1-4" @input="indicate.score < 4 ? indicate.score === 4 : null" v-model="indicate.score" ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import {eva} from '../../API/base'

const user = ref<any>({})
const topics = ref<any>([])
const token = process.client ? localStorage.getItem('token') : null

const fetchUser = async () =>{
    try{
        const res = await axios.get(`${eva}/selfeva/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error GET User!',err)
    }
}
const fetchTopic = async () =>{
    try{
        const res = await axios.get(`${eva}/selfeva/indicate`,{headers:{Authorization:`Bearer ${token}`}})
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