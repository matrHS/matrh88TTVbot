const tmi = require('tmi.js');
const { ChatClient, SlowModeRateLimiter, AlternateMessageModifier  } = require("dank-twitch-irc")
const config = require("./Config.json")
var i;



// Define configuration options
  // Create a client with our options
  //const client = new tmi.client(opts);


  let client = new ChatClient(config); 
  
  // Register our event handlers (defined below)
  client.on("ready", () => console.log("Successfully connected to chat"));
  client.on("close", (error) => {
    if (error != null) {
      console.error("Client closed due to error", error);
    }
  });

  client.on("PRIVMSG", (msg) => {
    console.log(`[#${msg.channelName}] ${msg.displayName}: ${msg.messageText}`);
  });

  //client.on('message', onMessageHandler);
  //client.on('connected', onConnectedHandler);
  
  client.use(new SlowModeRateLimiter(client));
  client.use(new AlternateMessageModifier(client));
  
  // Connect to Twitch:
  client.connect();
  
  client.joinAll(["matrh88","supinic", "tolekk"]);

  client.on("connect", async () => {
    await client.say("matrh88", "Sierrapine joined.");
  });

  client.on("PRIVMSG", async (msg) => {
    if (msg.messageText[0] === "¤") {
      const channel = msg.channelName
      const splitCommand = msg.messageText.slice(1).split(" ");
      console.log(splitCommand[0])
      switch (splitCommand[0]) {
        case 'ping':
          await client.say(channel, "coom")
          break;
        case 'dice':
          const num = rollDice();
          //client.say(target, `Kden ${context.username} `);
          await client.say(channel, `You rolled a ${num}`)
          //chatSay(target, `You rolled a ${num}`);
          console.log(`* Executed ${splitCommand} command`);
          break;
        case 'deathroll':
          if (isNaN(splitCommand[1]) || splitCommand[1] <= 0){
            await client.say(channel, `"Ok dipwit, Syntax is: ¤Deathroll number(greater than 0) userA userB`)
            break;
          }
          //Does a deathroll
          var results = await deathRoll(channel, splitCommand[1], splitCommand[2], splitCommand[3])
          console.log(results)
          
          
          for (var obj in results){
            console.log(`"${results[obj]['user']}" rolled "${results[obj]['roll']}"`);
            await client.say(channel, `"${results[obj]['user']}" rolled "${results[obj]['roll']}"`)
            if (results[obj]['roll'] == 1){
              await client.say(channel, `"${results[obj]['user']}" DIED in the deathroll"`)
            }
          }
          
          break;

        case 'pyramid':
          if (isNaN(splitCommand[1]) || splitCommand[1] <= 0){
            await client.say(channel, `"Ok dipwit, Syntax is: ¤Pyramid width(greater than) emote`)
            break;
          }
          if (splitCommand[1] > 50) {
            splitCommand[1] = 50;
          }
          if (splitCommand[2] == undefined) {
            splitCommand[2] = "Kappa";
          }
          //pyramidCreator("matrh88", splitCommand[1], splitCommand[2])
          var sayString;
          var term = String(splitCommand[2]);
          var peak = splitCommand[1];
          term = term + ' ';
          //console.log(term);
          for (i = 1; i < peak; i++) {
            sayString = term.repeat(i);
            console.log(sayString);
            await client.say(channel, sayString);
            
          }
          for (i = peak; i > 0; i--) {
            sayString = term.repeat(i);
            await client.say(channel, sayString);
            console.log(`*${sayString}`);
          }
          break;
        case 'github':
          await client.say(channel, "The githup page for this bot: https://github.com/matrh88/matrh88TTVbot");

          break;
        case 'slowmode':
          var saystring = 'test';
          for (i=0; i < 5; i++){
            saystring = saystring + "\u2800"
            await client.say(channel, saystring)
          }
          break;

      }

    
    }
  })


  // Function called when the "dice" command is issued
  function rollDice () {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
  }

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }

  function deathRoll (channel=channel,number='10000', a="userA", b="userB") {
    var currentNumber;
    var i;
    var activeUser
    
    var deathrollArray = []

    i = 0;
    currentNumber = number
    
    while (currentNumber != 1) {
      currentNumber = Math.floor(Math.random() * (currentNumber-1)+1)
      if (i%2 == 0){
        activeUser = a;
      } else {
        activeUser = b;
      }
      //client.say(channel, `"${activeUser}" rolled "${currentNumber}"`)
      //chatSay(channel, `"${activeUser}" rolled "${currentNumber}"`, i);
      
      //deathrollDict[currentNumber] = activeUser;
      var deathrollObj = {
        key: i,
        roll: currentNumber,
        user: activeUser
      };

      deathrollArray.push(deathrollObj)

      //client.say("matrh88", `"${activeUser}" rolled "${currentNumber}"`)
      

      console.log(`*"${deathrollArray[i]}"`);
      i++
    }

    
    //console.log(`*${activeUser}" just DIED!`);
    //chatSay(channel, `${activeUser}" just DIED!`,i);
    //client.say("matrh88", `${activeUser}" just DIED!`)
    //client.say(channel, `${activeUser}" just DIED!`)
    return deathrollArray;
  }

  //Pyramid creator
  function pyramidCreator (channel='matrh88', term='Kappa', peak='3' ) {
    var i;
    var sayString;
    term = term + ' ';
    for (i = 0; i < peak; i++) {
      sayString = term.repeat(i);
      client.say(channel, `${sayString}`, i);
      console.log(`*${sayString}`);
    }
    for (i = peak; i > 0; i--) {
      sayString = term.repeat(i);
      client.say(channel, `${sayString}`, i);
      console.log(`*${sayString}`);
    }
  }
  