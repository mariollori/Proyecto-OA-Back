import { Pool } from 'pg'


export const pool = new Pool({




    connectionString: process.env.d2v580k0in2ih6,
    ssl: {
        rejectUnauthorized: false
    },
    host: 'ec2-23-23-128-222.compute-1.amazonaws.com',
    user: 'mppplnafgfsjhq',
    password: '75f735a54ca6eac1f8d4cd788e05aeb3e7836a765d4f4fbbc489a169f7beb87f',
    database: 'd2v580k0in2ih6',
    port: 5432,

    // connectionString: process.env.d2551rmfn1grev,
    // ssl: {
    //     rejectUnauthorized: false
    // },
    // host: 'ec2-44-194-4-127.compute-1.amazonaws.com',
    // user: 'syacvojnuukuje',
    // password: '1586dec41df270f687fea1c8553bd5c79e25e9bee63241731c7c7780dde8c342',
    // database: 'd2551rmfn1grev',
    // port: 5432,
    
});
