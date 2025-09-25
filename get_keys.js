const freekeys = require('freekeys');
const fs = require('fs');

freekeys().then(params => {
    console.log(params);
    const envContent = `TMDB_KEY=${params.tmdb_key}\nIMDB_KEY=${params.imdb_key}\n`;
    fs.writeFileSync('.env', envContent);
    console.log('Keys saved to .env');
}).catch(err => {
    console.error('Error fetching keys:', err);
});