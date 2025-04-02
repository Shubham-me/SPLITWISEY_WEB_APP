import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

function refreshUsers(self, setUsers) {
    fetch('api/users', {
        method: 'GET',
        credentials: 'include',
    })
        .then((response) => response.json())
        .then((data) => {
            setUsers(data.users.filter((user) => user !== self));
        })
        .catch((error) => console.error('Error fetching users : ', error));
}

function refreshPendings(self, setPayments) {
    const queryParams = new URLSearchParams({ user: self });
    const url = `/api/pending?${queryParams}`;
    fetch(url, {
        method: 'GET',
        credentials: 'include',
    })
        .then((response) => response.json())
        .then((pending) => {
            const paymentsList = [];
            for (const user in pending.to) {
                paymentsList.push({ pay: pending.to[user], to: user });
            }
            setPayments(paymentsList);
        })
        .catch((error) => console.error('Error fetching payments data:', error));
}

function handlePayment(user, to, amt, setPayments) {
    fetch('/api/transaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amt: amt,
            from: user,
            to: to,
        }),
        credentials: 'include',
    })
        .then(() => {
            refreshPendings(user, setPayments);
            alert(`${amt} paid to ${to}`);
        })
        .catch((error) => console.error('Error making payment', error));
}

function PayList({ self, payments, setPayments }) {
    let total = payments.filter((entry) => parseFloat(entry.pay) > 0).reduce((cum, entry) => cum + parseFloat(entry.pay), 0);
    return (
        <>
            {total > 0 && (
                <div style={{ border: '1px solid #e0e0e0', padding: '20px', margin: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', width: '300px' }}>
                    <h2 style={{ fontSize: '1.5em', marginBottom: '15px', color: '#333' }}>PAY TO</h2>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {payments
                            .filter((entry) => parseFloat(entry.pay) > 0)
                            .map((entry) => (
                                <li key={entry.to} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#555' }}>{entry.to}:</span>
                                    <button
                                        onClick={() => handlePayment(self, entry.to, parseFloat(entry.pay), setPayments)}
                                        style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em' }}
                                    >
                                        {entry.pay.toFixed(2)}
                                    </button>
                                </li>
                            ))}
                    </ul>
                    <p style={{ fontWeight: 'bold', marginTop: '15px', color: '#333' }}>Total: {total.toFixed(2)}</p>
                </div>
            )}
        </>
    );
}

function ReceiveList({ payments }) {
    let total = payments.filter((entry) => parseFloat(entry.pay) < 0).reduce((cum, entry) => cum - parseFloat(entry.pay), 0);
    return (
        <>
            {total > 0 && (
                <div style={{ border: '1px solid #e0e0e0', padding: '20px', margin: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', width: '300px' }}>
                    <h2 style={{ fontSize: '1.5em', marginBottom: '15px', color: '#333' }}>RECEIVE FROM</h2>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {payments
                            .filter((entry) => parseFloat(entry.pay) < 0)
                            .map((entry) => (
                                <li key={entry.to} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#555' }}>{entry.to}:</span>
                                    <span style={{ color: '#555' }}>{(-parseFloat(entry.pay)).toFixed(2)}</span>
                                </li>
                            ))}
                    </ul>
                    <p style={{ fontWeight: 'bold', marginTop: '15px', color: '#333' }}>Total: {total.toFixed(2)}</p>
                </div>
            )}
        </>
    );
}

function User({ self, user, setPayments }) {
    const [visible, setVisible] = useState(false);
    const [amount, setAmount] = useState(0);
    return (
        <li style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#555' }}>{user}</span>
            <div>
                <button
                    onClick={() => setVisible(!visible)}
                    style={{ backgroundColor: visible ? '#d32f2f' : '#1976d2', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em', marginRight: '5px' }}
                >
                    {visible ? 'Cancel' : 'Pay'}
                </button>
                {visible && (
                    <>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '5px', width: '80px' }}
                        />
                        <button
                            onClick={() => {
                                try {
                                    if (parseFloat(amount) > 0) {
                                        handlePayment(self, user, parseFloat(parseFloat(amount).toFixed(2)), setPayments);
                                        setVisible(false);
                                        setAmount(0);
                                    } else {
                                        alert('Invalid Amount');
                                        setAmount(0);
                                    }
                                } catch (err) {
                                    console.error(err.toString());
                                    alert('Invalid Amount');
                                    setAmount(0);
                                }
                            }}
                            style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em' }}
                        >
                            Make Payment
                        </button>
                    </>
                )}
            </div>
        </li>
    );
}

function Users({ self, users, setPayments }) {
    return (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            {users.map((user) => (
                <User key={user} self={self} user={user} setPayments={setPayments} />
            ))}
        </ul>
    );
}

function AddTransaction({ self, users, setPayments }) {
    const [visible, setVisible] = useState(false);
    return (
        <div style={{ margin: '20px' }}>
            <button
                onClick={() => setVisible(!visible)}
                style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}
            >
                Add Payment
            </button>
            {visible && <div style={{ marginTop: '10px' }}><Users self={self} users={users} setPayments={setPayments} /></div>}
        </div>
    );
}

function simplify(self, setPayments) {
    fetch('/api/simplify', {
        method: 'PUT',
        credentials: 'include',
    })
        .then(() => refreshPendings(self, setPayments))
        .catch((err) => console.error(err.toString()));
}

function App() {
    const self = sessionStorage.getItem('username');
    const name = sessionStorage.getItem('name');
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!self) {
            navigate('/login');
        }
        refreshUsers(self, setUsers);
        refreshPendings(self, setPayments);
    }, [self, navigate]);

    return (
        <>
            <header style={{
                backgroundColor: '#282c34', // Darker, modern background
                color: '#61dafb', // Vibrant, contrasting text color (React blue)
                padding: '20px 30px', // Increased padding for a more spacious feel
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Deeper shadow for a more pronounced effect
                borderRadius: '8px', // Rounded corners for a softer look
                fontFamily: 'Arial, sans-serif', // Modern font choice
                fontWeight: '600', // Semi-bold font for emphasis
                fontSize: '1.2em', // Slightly larger font size
                borderBottom: '2px solid #4a5568', // Subtle bottom border for separation
            }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    Tractor
                </div>
                <nav style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <NavLink
                        to="/login"
                        onClick={() => {
                            sessionStorage.removeItem('username');
                            sessionStorage.removeItem('name');
                        }}
                        style={{ textDecoration: 'none', backgroundColor: '#dc3545', color: 'white', padding: '8px 15px', borderRadius: '4px', fontSize: '0.9em' }}
                    >
                        Logout
                    </NavLink>
                </nav>
            </header>
            <main style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
                <h1 style={{ fontSize: '2em', marginBottom: '15px', color: '#333' }}>Hi {name}</h1>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <AddTransaction self={self} users={users} setPayments={setPayments} />
                    <button
                        onClick={() => simplify(self, setPayments)}
                        style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em', margin: '20px' }}
                    >
                        Simplify
                    </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                    <PayList self={self} payments={payments} setPayments={setPayments} />
                    <ReceiveList payments={payments} />
                </div>
            </main>
        </>
    );
}

export default App;