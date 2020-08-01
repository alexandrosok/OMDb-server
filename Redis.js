var redis = require('redis');
require('dotenv').config();

class Redis {
    constructor() {
        this.host = process.env.REDIS_HOST;
        this.port = process.env.REDIS_PORT;
        this.password = process.env.REDIS_PASSWORD;
        this.connected = false;
        this.client = null
    }

    getConnection() {
        if (this.connected) return this.client;
        else {
            this.client = redis.createClient({
                host: this.host,
                port: this.port,
                password: this.password
            });
            return this.client
        }
    }


}

module.exports = new Redis();
