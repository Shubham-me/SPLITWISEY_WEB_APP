const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

var Txs = {}; 
var users = [];
let numUsers = 0;

const port = 5000;
app.listen(port,() => {
    console.log(`server running at ${port}`);
});

function generateId(){
    return numUsers;
}

app.post("/login", (req, res) => {
    let id = req.body.id;
    if(id === -1){
        id = generateId();
        users.push(id);
        numUsers++;
    }
    res.json({id : id, users : users});
});

app.get("/users",(req,res) => {
    res.json({users : users});
})

app.get("/pending", (req,res) => {
    let user = req.query.user;
    res.json({pending : (Txs[user] ? Txs[user] : {pay : 0, to : []})});
});

app.post('/transaction',(req,res) => {
    const amt = req.body.amt;
    const p1 = req.body.from;
    const p2 = req.body.to;
    /* p1 gave amt to p2 */
    if(!(p1 in Txs)){
        Txs[p1] = {pay : 0, to : {}};
    }
    if(!(p2 in Txs)){
        Txs[p2] = {pay : 0, to : {}};
    }
    Txs[p2].pay += amt;
    Txs[p2].to[p1] = (Txs[p2].to[p1] ? Txs[p2].to[p1] : 0) + amt;

    Txs[p1].pay -= amt;
    Txs[p1].to[p2] = (Txs[p1].to[p2] ? Txs[p1].to[p2] : 0) - amt;

    res.sendStatus(200);
});

app.put('/simplify', (req,res) => {
    simplify(); 
    res.status(200).send("Simplifed the Payments");    
});

function simplify(){
    payers = [];
    receivers = [];
    for(const usr in Txs){
        if(Txs[usr].pay > 0){
            payers.push({user : usr, pay : Txs[usr].pay});
        }
        if(Txs[usr].pay < 0){
            receivers.push({user : usr, receive : -Txs[usr].pay});
        }
    }

    Txs = {};
    for(let i = 0; i < payers.length; i++){
        Txs[payers[i].user] = {pay : payers[i].pay, to : {}};
    }
    for(let j = 0; j < receivers.length; j++){
        Txs[receivers[j].user] = {pay : -receivers[j].pay, to : {}};
    }

    let j = 0;
    for(let i = 0; i < payers.length; i++){
        let payer = payers[i].user;
        while(payers[i].pay > 0){
            let receiver = receivers[j].user;
            let amt = min(payers[i].pay,receivers[j].pay);
            Txs[payer].to[receiver] = amt;
            payers[i].pay -= amt;
            
            Txs[receiver].to[payer] = -amt;
            receivers[j].receive -= amt;
            if(receivers[j].pay == 0){
                j++;
            }
        }
    }
}
