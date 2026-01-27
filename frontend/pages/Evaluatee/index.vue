<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4">
                        <h1 class="text-h5 text-center font-weight-bold">Dashboard - Evaluatee</h1><br>
                        <v-row>
                            <v-col cols="12" md="4" v-for="b in box" :key="b">
                                <v-card elevation="4" class="pa-4">
                                    <div class=" font-weight-bold">{{ b.title }}</div>
                                    <div class="text-h3 ">{{ b.value }}</div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-sheet>
                    <v-card-text>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../../API/base'

const token = process.client ? localStorage.getItem('token') : null

const result = ref([])
const box = ref([])
const box2 = ref([])

const fetch = async () => {
    try{
        const res = await axios.get(`${api}/dash/eva`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res.data.box
        console.log('api',box.value)
    }catch(err){
        console.error('Error Fething',err)
    }
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>