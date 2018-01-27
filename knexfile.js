module.exports = {
    development: {
        client: 'pg',
        connection: {
            socketPath: '/var/run/postgresql',
            user: 'artlive',
            password: 'artlive',
            database: 'artlive'
        }    
    },

    production: {
    	client: 'pg',
    	connection: process.env.DATABASE_URL
    }

};
