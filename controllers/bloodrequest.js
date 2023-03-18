const { Samples, Requests}=require('../models/users')
const jwt = require("jsonwebtoken")
const SECRETKEY = "JWTSECRET"


module.exports.addBloodRequest = async(req,res)=>{
    try {
        const token = req.cookies.jwt
        if(token){
            const decoded = jwt.verify(token,SECRETKEY)
            if(decoded.role === 'reciever'){
                const sample = await Samples.findOne({_id:req.params.id})
                const request = new Requests({
                    Receiver:decoded.username,
                    Hospital:sample.Hospital,
                    bloodType:sample.bloodType
                })

                await request.save()
                res.send('Request added')
            }else{
                res.send('you dont have permission')
            }

        }else{
            res.send('you need to login')
        }
        
    } catch (error) {
        console.error(error)       
    }

}
module.exports.listBloodRequest = async(req,res)=>{
    try {
        const token = req.cookies.jwt
        if(token){
            const decoded = jwt.verify(token,SECRETKEY)
            if(decoded.role === 'hospital'){
                
                    const HospitalRequest = await Requests.find({Hospital:decoded.username})
                    console.log(HospitalRequest)
                    res.send(HospitalRequest)
               
                
            }else{
                res.send('you dont have permission')
            }

        }else{
            res.send('you need to login')
        }
        
    } catch (error) {
        console.error(error)       
    }
}