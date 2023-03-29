const User = require('../server/db/models/user');
//require("dotenv").config({ path: "../server/config.env" });
const connectDB = require('../server/db/conn');

const trigger_process_interval_ms = 30000; // 30 seconds (in milliseconds)

let trigger_timer;

// Connect to MongoDB
connectDB();

function start_trigger_timer() {
    console.log(`Started a ${trigger_process_interval_ms}ms timer to process buy and sell triggers.`);
    trigger_timer = setInterval(process_triggers, trigger_process_interval_ms);
}

function stop_trigger_timer() {
    clearInterval(trigger_timer);
    console.log('Stopped trigger processing timer.');
}

// TODO: Implement buy/sell trigger processing
async function process_triggers() {
    const time = new Date(Date.now());
    console.log('Processing triggers - Time: ' + time.toISOString());

    // TODO: Process buy/sell triggers

}

module.exports = {
    start_trigger_timer,
    stop_trigger_timer,
    process_triggers
};