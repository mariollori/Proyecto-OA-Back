import { Pool } from 'pg'


export const pool = new Pool({
   
    ssl: {
        rejectUnauthorized: false
    },
    host: 'ec2-23-23-128-222.compute-1.amazonaws.com',
    user: 'mppplnafgfsjhq',
    password: '75f735a54ca6eac1f8d4cd788e05aeb3e7836a765d4f4fbbc489a169f7beb87f',
    database: 'd2v580k0in2ih6',
    port: 5432,
    
});
