const { connect, StringCodec } = require('nats')
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.API_KEY, { polling: false });
/** @type {import('nats').NatsConnection} */
let nc = null
const sc = StringCodec()

// Not sure how to get these reliable especially with multiple replicas
// Can't call getUpdates mutliple times at the same time and it would only
// contain new messages anyway. There's no api to get all chat ids for bot
const chatIds = [693795979]

async function init() {

    nc = await connect({ servers: process.env.NATS_URL })
    nc.subscribe('newTodo', {
        callback: (err, msg) => {
            const event = sc.decode(msg.data)
            console.log(event)
            const formattedJson = JSON.stringify(JSON.parse(event), null, 4)
            const msgToSend = `New TODO! \n${formattedJson}`
            chatIds.forEach((chatId) => {
                bot.sendMessage(chatId, msgToSend)
            })
        },
        queue: 'app2-subscriber'
    })
}

init()
