<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4"">
                        <h1 class="text-h5 text-center font-weight-bold">จัดการหัวข้อการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-select v-model="form.id_topic" :items="topic.map(p => ({title:p.name_topic,value:p.id_topic}))" :error-messages="error.id_topic" label="หัวข้อการประเมิน" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อตัวชี้วัด" v-model="form.name_indicate" :error-messages="error.name_indicate" />
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-textarea rows="3" label="รายละเอียด" v-model="form.detail_indicate" :error-messages="error.detail_indicate" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="น้ำหนักคะแนน" v-model="form.point_indicate" :items="[1,2,3,4,5]" :error-messages="error.point_indicate" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="ลักษณะตัวเลือกคะแนน" v-model="form.check_indicate" :items="[{title:'มี',value:'y'},{title:'ไม่มี',value:'n'}]" :error-messages="error.check_indicate" />
                                </v-col>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-btn class="text-white" color="blue" type="submit" block>{{ form.id_indicate ? 'อัปเดต' : 'บันทึก' }}</v-btn>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-btn class="text-white" color="error" type="reset" block>ยกเลิก</v-btn>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-form>

                        <br><br>

                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">หัวข้อการประเมิน</th>
                                    <th class="border text-center">ตัวชี้วัด</th>
                                    <th class="border text-center">น้ำหนักคะแนน</th>
                                    <th class="border text-center">ลักษณะตัวเลือกคะแนน</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_indicate">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.name_topic }}</td>
                                    <td class="border text-center">{{ items.name_indicate }}<br><span class="opacity-85">{{ items.detail_indicate }}</span></td>
                                    <td class="border text-center">{{ items.point_indicate }}</td>
                                    <td class="border text-center">{{ items.check_indicate === 'y' ? 'มี' : 'ไม่มี' }}</td>
                                    <td class="border text-center">
                                        <v-btn class="text-white" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>&nbsp;
                                        <v-btn class="text-white" size="small" color="error" @click="del(items.id_indicate)">ลบ</v-btn>
                                    </td>
                                </tr>
                                <tr v-if="result.length === 0">
                                    <td class="text-center border" colspan="10">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../../API/base'

const token = process.client ? localStorage.getItem('token') : null

const result = ref([])
const topic = ref([])

const form = ref({
    id_indicate: null,
    id_topic: '',
    name_indicate:'',
    detail_indicate:'',
    point_indicate:'',
    check_indicate:'',
})

const reset = () => {
    form.value = {
        id_indicate: null,
        id_topic: '',
        name_indicate:'',
        detail_indicate:'',
        point_indicate:'',
        check_indicate:'',
    }
}

const edit = (items:any) => {
    form.value = {...items}
}

const error = ref<Record<string,string>>({})

function vaildateForm(){
    error.value = {}
    const f = form.value
    if(!f.id_topic)error.value.id_topic='กรุณาเลือกหัวข้อ'
    if(!f.name_indicate)error.value.name_indicate='กรุณากรอกชื่อตัวชี้วัด'
    if(!f.detail_indicate)error.value.detail_indicate='กรุณากรอกรายละเอียด'
    if(!f.point_indicate)error.value.point_indicate='กรุณาเลือกน้ำหนักคะแนน'
    if(!f.check_indicate)error.value.check_indicate='กรุณาเลือกลักษณะตัวเลือกคะแนน'
    return Object.keys(error.value).length === 0
}

const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/topic`,{headers:{Authorization:`Bearer ${token}`}})
        topic.value = res.data
        const r = await axios.get(`${staff}/indicate`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = r.data
    }catch(err){
        console.error('Error Fething',err)
    }
}

const saveMember = async () =>{
    if(!vaildateForm())return
    try{
        form.value.id_indicate
            ? await axios.put(`${staff}/indicate/${form.value.id_indicate}`,form.value,{headers:{Authorization: `Bearer ${token}`}})
            : await axios.post(`${staff}/indicate`,form.value,{headers:{Authorization: `Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    }catch(err){
        console.error('Error!',err)
    }
}

const del = async (id_indicate:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่')) return
        await axios.delete(`${staff}/indicate/${id_indicate}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    }catch(err){
        console.error('Error Delete',err)
    }
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>