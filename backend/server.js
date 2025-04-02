const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const port = 5000;
app.listen(port, '0.0.0.0', () => {
    console.log(`server running at ${port}`);
});

const fs = require('fs');
const jwt = require('jsonwebtoken');

function getUser(username){
    let data = fs.readFileSync('./storage/users.json', 'utf-8');
    data = JSON.parse(data);
    return data[username];
}

function addUser(username, name, password){
    let data = fs.readFileSync('./storage/users.json', 'utf-8');
    data = JSON.parse(data);
    data[username] = {name : name, password : password};
    fs.writeFileSync('./storage/users.json', JSON.stringify(data), 'utf-8');
}


app.post("/register", (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;

    if(getUser(username)){
        res.json({
            ok : false,
            message : "username already exists"
        });
    }

    if(username == '' || password == '' || name == ''){
        res.json({
            ok : false,
            message : "username, password or name cannot be empty"
        });
    }

    addUser(username, name, password);
    res.json({
        ok : true
    })
});

app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let user = getUser(username);
    if(user == undefined){
        res.json({
            ok : false,
            message : "user not found"
        });
    }
    else if(user.password != password){
        res.json({
            ok : false,
            message : "wrong password"
        });
    }
    else{
        const token = jwt.sign(
            { username : username }, 
            process.env.SECRET_KEY, 
            { expiresIn: '1h' }
        );
        
        res.cookie('token', token, {
          httpOnly: true,// Not accessible via JavaScript
          secure: false, // Use true in production (requires HTTPS)
          sameSite: 'strict',   // Helps prevent CSRF attacks
          maxAge: 3600000       // 1 hour
        });
        
        res.json({
            ok : true,
            name : getUser(username).name
        })
    }
});

function authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Not Authenticated'});
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token'});
        }
        next();
    });
}

function allUsers(){
    let data = fs.readFileSync('./storage/users.json', 'utf-8');
    data = JSON.parse(data);
    return Object.keys(data);
}

app.get("/users",authenticate, (req,res) => {
    res.status(200).json({ users : allUsers()});
})

function getPending(username){
    const data = JSON.parse(fs.readFileSync('./storage/pending.json', 'utf-8'));
    return data[username] ?? {pay : 0, to : {}};
}

function updatePending(username, data){
    let pending = fs.readFileSync('./storage/pending.json', 'utf-8');
    pending = JSON.parse(pending);
    pending[username] = data;
    fs.writeFileSync('./storage/pending.json', JSON.stringify(pending), 'utf-8');
}

app.get("/pending", authenticate, (req,res) => {
    const username = req.query.user;
    res.json(getPending(username));
});

app.post('/transaction', authenticate, (req,res) => {
    const amt = req.body.amt;
    const p1 = req.body.from;
    const p2 = req.body.to;
    
    if(!getUser(p1) || !getUser(p2)){
        res.status(400).send("Users not found");
        return;
    }

    let Txs_p2 = getPending(p2);
    let Txs_p1 = getPending(p1);

    Txs_p2.pay += amt;
    Txs_p2.to[p1] = (Txs_p2.to[p1] ? Txs_p2.to[p1] : 0) + amt;

    Txs_p1.pay -= amt;
    Txs_p1.to[p2] = (Txs_p1.to[p2] ? Txs_p1.to[p2] : 0) - amt;

    updatePending(p2, Txs_p2);
    updatePending(p1, Txs_p1);
    res.sendStatus(200);
});

app.put('/simplify', authenticate, (req,res) => {
    simplify(); 
    res.status(200).send("Simplifed the Payments");    
});

function getAllPending(){
    let data = fs.readFileSync('./storage/pending.json', 'utf-8');
    data = JSON.parse(data);
    return data;
}

function updateAllPending(data){
    fs.writeFileSync('./storage/pending.json', JSON.stringify(data), 'utf-8');
}

function simplify(){
    let payers = [];
    let receivers = [];

    Txs = getAllPending();
    
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
        Txs[receivers[j].user] = {pay : -receivers[j].receive, to : {}};
    }

    let j = 0;
    for(let i = 0; i < payers.length; i++){
        let payer = payers[i].user;
        while(payers[i].pay > 0){
            let receiver = receivers[j].user;
            let amt = Math.min(payers[i].pay,receivers[j].receive);
            Txs[payer].to[receiver] = amt;
            payers[i].pay -= amt;
            
            Txs[receiver].to[payer] = -amt;
            receivers[j].receive -= amt;
            if(receivers[j].pay == 0){
                j++;
            }
        }
    }

    updateAllPending(Txs);
}
