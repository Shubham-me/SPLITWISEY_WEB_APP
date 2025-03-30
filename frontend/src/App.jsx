import { useState, useEffect} from 'react'

function refreshUsers(self,setUsers){
  fetch('api/users',{
    method : "GET"
  })
  .then((response) => response.json())
  .then(data => {
      setUsers(data.users.filter((user) => user != self));
    }
  )
  .catch((error) => console.error("Error fetching users : ", error));
}

function refreshPendings(self,setPayments) {
  const queryParams = new URLSearchParams({user : self}); 
  const url = `/api/pending?${queryParams}`;
  fetch(url, {
    method : "GET"
  })
  .then((response) => (response.json()))
  .then((data) => data.pending)
  .then(pending => {
    let paymentsList = [];
    for(let user in pending.to){
      paymentsList.push({pay : pending.to[user], to : user});
    }
    setPayments(paymentsList);
  })
  .catch((error) => console.error("Error fetching payments data:", error));
}

function handlePayment(user,to,amt,setPayments){
  fetch("/api/transaction",{
    method : 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body : JSON.stringify({
      amt : amt,
      from : user,
      to : to
    })
  })
  .then(() => {
    refreshPendings(user,setPayments);
    alert(`${amt} paid to ${to}`);
  })
  .catch((error) => console.error("Error making payment", error));
}

function PayList({self,payments,setPayments}){
  return (
    <>
    <h1> PAY TO </h1>
    <ul>
    {
      payments.filter((entry) => (parseFloat(entry.pay) > 0)).map((entry, index) => (
        <li key={entry.to}>
          {entry.to} : {parseFloat(entry.pay)}
          <button onClick = {() => handlePayment(self,entry.to,parseFloat(entry.pay),setPayments)}> Pay </button>
        </li>
      ))
    }
    </ul>
    <p> NET AMT TO PAY : {payments.filter((entry) => (parseFloat(entry.pay) > 0)).reduce((cum, entry) => cum + parseFloat(entry.pay),0)}</p>
    </>
  )
}

function ReceiveList({payments}){
  return (
    <>
    <h1> RECEIVE FROM</h1>
    <ul>
    {
      payments.filter((entry) => (parseFloat(entry.pay) < 0)).map((entry, index) => (
      <li key={entry.to}>{entry.to} : {-parseFloat(entry.pay)}</li>
      ))
    }
    </ul>
    <p> NET AMT TO RECEIVE : {payments.filter((entry) => (parseFloat(entry.pay) < 0)).reduce((cum, entry) => cum - parseFloat(entry.pay),0)}</p>
    </>
  )
}

function User({self,user,setPayments}){
  const [visible, setVisible] = useState(false);
  const [amount,setAmount] = useState(0);
  return (
    <li>
      <span> {user} </span> 
      <button onClick = {
        () => {
          setVisible(!visible);
        }
      }>{visible ? "Cancel" : "Pay"}</button> 
      {visible ?
        (
          <>
          <span>Enter Amount : </span>
          <input 
            type="number"
            min="0"
            step="0.01"
            value={amount} 
            onChange={(event) => {
            setAmount(event.target.value);
          }} />
          <button onClick = {
            () => {
              try{
                handlePayment(self,user,parseFloat(amount),setPayments);
              }
              catch(err){
                console.error(err.toString());
              }
              setVisible(!visible);
              setAmount(0);
            }
          }>
          Make Payment
          </button>
          </>
        )
        :
        null
      }
    </li>
  )
}

function Users({self,users,setPayments}){
  return (
    <>
    <ul>
    {
      users.map((user) => 
        (<User key = {user} self = {self} user = {user} setPayments={setPayments}></User>)
      )
    }
    </ul>
    </>
  )
}

function AddTransaction({self,users,setPayments}){
  const [visible,setVisible] = useState(false);
  return (
    <>
    <button onClick = {() => {
        setVisible(!visible);
      }
    }> Add Payment </button>
    {visible ? 
      (
        <Users self = {self} users = {users} setPayments={setPayments}></Users>
      ) 
      : 
      null
    }
    </>
  )
}

function simplify(self,setPayments){
  fetch("/api/simplify", {
    method : "PUT",
  })
  .then(() => {
    refreshPendings(self,setPayments);
  })
  .catch((err) => {
    console.error(err.toString());
  })
}

function App() {
  const [self, setSelf] = useState(-1);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    fetch("/api/login",
        {
          method : "POST", 
          headers: {
            "Content-Type": "application/json"
          },
          body : JSON.stringify({id : self})
        }
      )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSelf(data.id);
        setUsers(data.users.filter((user) => user != self));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    console.log(users);
    console.log(self);
    setUsers(users.filter((user) => user != self));
  },[self]);
  
  return (
    <>
      <h1>User = {self}</h1>
      <button onClick={() => {
        refreshPendings(self,setPayments);
        refreshUsers(self,setUsers);
      }}> Refresh </button>

      <div>
        <AddTransaction self = {self} users = {users} setPayments = {setPayments}></AddTransaction>
      </div>

      <div>
        <button onClick = {() => simplify(self,setPayments)}> Simplify </button>
      </div>

      <div>
        <PayList self = {self} payments = {payments} setPayments = {setPayments}></PayList>
        <ReceiveList payments = {payments}></ReceiveList>
      </div>
    </>
  )
}

export default App;
