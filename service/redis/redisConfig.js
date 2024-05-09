
const redisConfig = {
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
}
exports.redisUrl = {
    url: `redis://:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}`
};
