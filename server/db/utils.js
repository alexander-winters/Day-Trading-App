const User = require('./models/user');

async function generate_user_id() {
    const highest_user = await User.findOne().sort('-user_id');
    if (!highest_user) {
        return 1;
    }
    return highest_user.user_id + 1;
}

module.exports = { generate_user_id };