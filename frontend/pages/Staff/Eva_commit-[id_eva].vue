<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4"">
                        <h1 class="text-h5 text-center font-weight-bold">เพิ่มกรรมการ</h1>
                        <p class="text-center">ผู้รับการประเมิน : {{ header.first_name }} {{ header.last_name }}</p>
                        <p class="text-center">รอบการประเมิน : รอบการประเมินที่ {{ header.round_sys }} ปี {{ header.year_sys }}</p>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <template v-for="(c,index) in List" :key="index">
                                    <v-col cols="12" md="6">
                                        <v-select v-model="c.id_member" :label="`กรรมการคนที่ ${index+1}`" :items="MEMBER(index).map( p => ({title:`${p.fullname_commit}`,value:p.id_member}))"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select v-model="c.role" :label="`ตำแหน่งที่ ${index+1}`" :items="ROLE(index)"></v-select>
                                    </v-col>
                                </template>
                                <v-btn class="text-white" block type="submit" color="blue">บันทึก</v-btn>
                            </v-row>
                        </v-form>

                        <br><br>

                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">กรรมการ</th>
                                    <th class="border text-center">ตำแหน่ง</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in List" :key="items.id_commit">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ nameOf(items.id_member) }}</td>
                                    <td class="border text-center">{{ items.role }}</td>
                                    <td class="border text-center">
                                        <!-- <v-btn class="text-white" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>&nbsp; -->
                                        <v-btn class="text-white" size="small" color="error" @click="del(items.id_commit)">ลบ</v-btn>
                                    </td>
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
const id_eva = useRoute().params.id_eva

const people = ref([])
const header = ref([])
const role = ['ประธาน','กรรมการ','เลขา']
const List = ref([
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''},
])

const nameMap = computed( () => Object.fromEntries(people.value.map(p => [p.id_member,p.fullname_commit])) )
const nameOf = (id:number) => nameMap.value[id]

const fetch = async () => {
    try{
        const h = await axios.get(`${staff}/commit/header/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        header.value = h.data[0]
        const m = await axios.get(`${staff}/commit/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        people.value = m.data.before
        console.log('Commit',people.value)
        const useData = m.data.after
        if(useData.length === 0){
            List.value = [
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''},
                {id_commit:null,id_member:'',role:''},
            ]
        }else{
            List.value = useData.map(c=> ({
                id_commit:c.id_commit,id_member:c.id_member,role:c.role
            }))
            while(List.value.length < 3) List.value.push({id_commit:null,id_member:'',role:''})
        }
    }catch(err){
        console.error('Error Fething',err)
    }
}

const MEMBER = (idx:number) => {
    const picked = List.value.map( (c,i) => (i !== idx ? c.id_member : null) )
    return people.value.filter( (p) => !picked.includes(p.id_member) )
}

const ROLE = (idx:number) => {
    const picked = List.value.map( (c,i) => (i !== idx ? c.role : null) )
    return role.filter( (p) => !picked.includes(p) )
}

const saveMember = async () =>{
    try{
        await axios.post(`${staff}/commit/${id_eva}`,List.value,{headers:{Authorization: `Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
    }catch(err){
        console.error('Error!',err)
    }
}

const del = async (id_commit:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่')) return
        await axios.delete(`${staff}/commit/${id_commit}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
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