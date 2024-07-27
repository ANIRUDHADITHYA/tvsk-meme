const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let khBalance = 0; // Example initial balance for kh
let dtBalance = 0; // Example initial balance for dt

app.post('/api/update-balance', (req, res) => {
    const { coinType } = req.body;

    if (coinType === 'kh') {
        khBalance += 1;
        res.json({ balance: khBalance });
    } else if (coinType === 'dt') {
        dtBalance += 1;
        res.json({ balance: dtBalance });
    } else {
        res.status(400).json({ error: 'Invalid coin type' });
    }
});

app.get('/api/get-balances', (req, res) => {
    res.json({ khBalance, dtBalance });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
