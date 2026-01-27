const express = require('express')
const bc = require('bcryptjs')
const router = express.Router()
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// API สำหรับ Get ข้อมูล
router.get('/eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [rows] = await db.query(`select id_member,first_name,last_name,email,username,role where role='ผู้รับการประเมินผล' order by id_member desc`)
        res.json(rows)
    }catch(err){
        console.error('Error Get',err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Get ข้อมูล
router.get('/commit',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [rows] = await db.query(`select id_member,first_name,last_name,email,username,role where role='กรรมการประเมิน' order by id_member desc`)
        res.json(rows)
    }catch(err){
        console.error('Error Get',err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Get ข้อมูล where params
router.get('/:id_member',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_member} = req.params
        const [rows] = await db.query(`select id_member,first_name,last_name,email,username,role where id_member='${id_member}' order by id_member desc`)
        if(rows.length === 0) return res.status(403).json({message:'ไม่พบข้อมูล'})
        res.json(rows)
    }catch(err){
        console.error('Error Get',err)
        res.status(500).json({message:'Error Get'})
    }
})

module.exports = router