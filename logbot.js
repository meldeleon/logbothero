const tmi = require("tmi.js")
const chalk = require("chalk")

// DEFINE YOUR OWN .env file with OAUTH exported
const opts = {
  identity: {
    username: "logbothero",
    password: process.env.OAUTH,
  },
  //REPLACE WITH YOUR CHANNEL
  channels: ["juiceboxhero"],
}
// Create a client with our options
const client = new tmi.client(opts)

// Register our event handlers (defined below)
client.on("message", onMessageHandler)
client.on("connected", onConnectedHandler)

// Connect to Twitch:
client.connect()

// Called every time a message comes in
function onMessageHandler(channel, userstate, message, self) {
  //define userstate into digestable variables

  if (self) {
    return
    //do nothing
  }
  if (channel === "#juiceboxhero") {
    let nameHex = userstate["color"] || "#008080"
    let userName = userstate["username"].replace(/ /g, "")

    let badges = userstate["badges-raw"]
    let badgesArray = []
    let badgeCharacters = []
    if (badges) {
      badgesArray = badges.split(",")
      badgeCharacters = getBadgeCharacters(badgesArray)
    }

    console.log(
      chalk.hex(nameHex)(badgeCharacters) +
        chalk.hex(nameHex).underline(userName) +
        ": " +
        message
    )
  }
}
// Function called when the "dice" command is issued
// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
  client.say("#juiceboxhero", `chat logging has begun`)
}

function getBadgeCharacters(badgesArray) {
  let badges = []
  badgesArray.forEach((item) => {
    if (item.includes("staff")) badges.push(chalk.black("⚙"))
    if (item.includes("subscriber")) badges.push("☆")
    if (item.includes("bits")) badges.push("❖")
    if (item.includes("premium")) badges.push("♕")
  })
  return badges.join("")
}
