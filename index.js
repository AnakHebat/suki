const { create, client } = require('@open-wa/wa-automate');

//module
const prefix = "/";
const db = require('quick.db');
const fs = require("fs");
const ms = require("parse-ms");
const { scheduleJob } = require("node-schedule");
let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();
let time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

//database non object
const xpfile = require('./db/lb/level.json');
const dlprice = require('./dl.json');
/*const moneyfile = require('./db/lb/money.json');*/

//text
const regis = "Kamu Belum Termasuk Register Di Account Bot";
const regis1 = "Kamu Sudah Termasuk Register Di Account Bot";
const regis2 = "User Belum Termasuk Register Di Account Bot";
const banned = "Kamu Telah Terbanned Dari System Bot";
const banned1 = "User Telah Terbanned Dari System Bot";

//Trading Updater
/*if (!fs.existsSync('./trade.json')) {
  let create = {
    percent:0,
    moenyget:200000,
    navigator:"+"
  }
  fs.writeFileSync('./trade.json', JSON.stringify(create));
}

scheduleJob('1 * * * *', function() {
  const trading = require('./trade.json');
  let nav = ["+", "-"];
  const percent = Math.floor((Math.random() * 100) + 1);
  trading.percent = percent;
  var navget = nav[Math.floor(Math.random() * nav.length)];
  if (trading.navigator === "+" || navget === "+") {
    trading.moneyget *= trading.percent;
  }
  else if (trading.navigator === "-"|| navget === "-") {
    trading.moneyget *- trading.percent;
  }
  fs.writeFile('./trade.json', JSON.stringify(trading), function(err) {
    if (err) console.log(err)
  });
  fs.writeFileSync('./trade.json', JSON.stringify(trading));
  console.log(navget)

});*/

//DL Auto Price
scheduleJob('*/1 * * * *', function(){
  var hargadl = Math.floor(Math.random() * 12000) + 9000;
  console.log(`[+]Diamond Lock Price Auto Update To ${hargadl.toLocaleString()}`);
  dlprice.price = hargadl;
  fs.writeFileSync('./dl.json', JSON.stringify(dlprice));
});

function start(adip) {
    console.clear()
    console.log('[DEV] Adip')
    console.log('[CLIENT] ADZ BOT V4 ONLINE!')
    console.log('=====================================')
  
    //info state
    adip.onStateChanged((state) => {
      console.log(`[STATE]${state}`)
      if (state === 'CONFLICT' || state === 'DISCONNECTED' || state === 'CONNECT') adip.forceRefocus();
    });

    //block telfon
    adip.onIncomingCall(async call => {
        // ketika seseorang menelpon nomor bot
        if (!call.isGroup || !call.participants.length > 1) {
            console.log(`Someone is calling bot id: ${call.peerJid}`)
            adip.sendText(call.peerJid, `Maaf tidak bisa menerima panggilan.\nIni robot, bukan manusia. Awas kena block!\nChat https://wa.me/+6289508837920 untuk buka block.`)
            setTimeout(() => {
                adip.contactBlock(call.peerJid)
            }, 1500)
        }
    });
  
    adip.onMessage(async message => {
      //function
      const { type, id, from, t, author, content, argv, sender, isGroupMsg, chat, chats, chatId, caption, isMedia, isGif, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
      let { body } = message
      body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
      const args = body.trim().split(/ +/).slice(1)
      const { name, formattedTitle } = chat
      let { pushname, verifiedName, formattedName } = sender
      pushname = pushname || verifiedName || formattedName
      const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
      const isCmd = body.startsWith(prefix)
      const groupId = isGroupMsg ? chat.groupMetadata.id : ''
      const AdipN = "6289508837920@c.us" || "6287742372337@c.us"
      const isAdip = AdipN.includes(sender.id)
      let tagger1 = mentionedJidList[0] || sender.id
      let role = "";
      let verified = "";
      
      //tag discord
      let tag = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
      //player system
      if (!fs.existsSync(`./db/players/${sender.id}.json`)) {
        let createp = {
            name:`${pushname}`,
            tag:`${tag}`,
            regis:false,
            admin:0,
            card:0,
            diamond:0,
            friends:'',
            msg:0,
            ban:false,
            verif:false,
            prem:false,
        };
        fs.writeFileSync(`./db/players/${sender.id}.json`, JSON.stringify(createp));
      };
      if (isCmd && mentionedJidList[0]) {
        if (fs.existsSync(`./db/players/${mentionedJidList[0]}.json`)){}
        else {
          return adip.reply(from, 'Player Belum Terdaftar Di Database Bot', id);
        }
      }
      const player = require(`./db/players/${sender.id}.json`)
      const player1 = require(`./db/players/${tagger1}.json`)
      //Maintenance
      const config = require('./config.json');
      if (isCmd && config.status === false) {
        if (isAdip || player.admin === "3" || player.admin === "4"){}
        else return adip.reply(from, `Hallo *${player.name}#${player.tag}* Bot Sedang Maintenance, Mungkin Ada Beberapa Kesalahan Mohon Bersabar Ya!`, id);
      }
      if (!isCmd && config.status === false) {
        if (isAdip || player.admin === "3" || player.admin === "4"){}
        else return;
      }
       //level system
       if (player.regis === false) {
      } else {
        var xpget = 0;
        var xptarget = 0;
        let timeoutboost = 600000
        let xpboost = db.fetch(`xpboost_${sender.id}`);
        if (xpboost !== null && timeoutboost - (Date.now() - xpboost) > 0) {
          xpget += 10;
          xptarget += 4;
        }
        else {
          xpget += 3;
          xptarget += 1;
        }
        var addXP = Math.floor(Math.random() * xpget) + xptarget;
        if(!xpfile[sender.id]){
            xpfile[sender.id] = {
               xp: 0,
               level: 1,
               reqxp: 200,
            }
            fs.writeFile("./db/lb/level.json", JSON.stringify(xpfile), function(err){
               if(err) console.log(err)
            });
        }
         xpfile[sender.id].xp += addXP
         if(xpfile[sender.id].xp > xpfile[sender.id].reqxp){
            if (player.regis === false) return;
            else if (player.ban === true) return;
            else {
              xpfile[sender.id].xp -= xpfile[sender.id].reqxp
              xpfile[sender.id].reqxp *= 2
              xpfile[sender.id].reqxp = Math.floor(xpfile[sender.id].reqxp)
              xpfile[sender.id].level += 1
      
              adip.reply(from, `*${player.name}#${player.tag} Now Up Level To ${xpfile[sender.id].level}*`, id);
            }
         }
         fs.writeFile("./db/lb/level.json", JSON.stringify(xpfile), function(err){
            if(err) console.log(err)
         });
      }
      let userInfo = xpfile[sender.id];
      let userInfo1 = xpfile[mentionedJidList[0]];
      //logs chat
      if (!isCmd && !isGroupMsg) {
        console.log(`[CHAT]@${pushname} Message In Dm:${message.body}`);
        player.msg++;
        fs.writeFileSync(`./db/players/${sender.id}.json`, JSON.stringify(player));
      }
      if (!isCmd && isGroupMsg) {
        console.log(`[CHAT]@${pushname} Message In Group ${name || formattedTitle}:${message.body}`);
        player.msg++;
        fs.writeFileSync(`./db/players/${sender.id}.json`, JSON.stringify(player));
      }
      if (isCmd && !isGroupMsg) {
        console.log(`[CMD]@${pushname} Command In Dm:${message.body}`);
        player.msg++;
        fs.writeFileSync(`./db/players/${sender.id}.json`, JSON.stringify(player));
      }
      if (isCmd && isGroupMsg) {
        console.log(`[CMD]@${pushname} Command In Group ${name || formattedTitle}:${message.body}`);
        player.msg++;
        fs.writeFileSync(`./db/players/${sender.id}.json`, JSON.stringify(player));
      }
      //Cooldown
      if (isCmd && isGroupMsg || isCmd && !isGroupMsg) {
          let timeout = 2000
          let timeout1 = 120000
          var dont = db.fetch(`dont_${sender.id}`);
          if (dont === null || dont === 0) db.add(`dont_${sender.id}`, 1);
          let cooldown = db.fetch(`cooldown_${sender.id}`);
          let cooldown1 = db.fetch(`cooldown1_${sender.id}`);
          let cooldowntime = ms(timeout1 - (Date.now() - cooldown1));
          if (cooldown !== null && timeout - (Date.now() - cooldown) > 0) {
            db.add(`dont_${sender.id}`, 1)
            return adip.reply(from, `Jangan Spam Ya Cooldown 2detik *(${dont}/5)*`, id);
          }
          if (cooldown1 !== null && timeout1 - (Date.now() - cooldown1) > 0) {
            return adip.reply(from, `Makanya Jangan Spam Cooldown *${cooldowntime.minutes} Menit ${cooldowntime.seconds} Detik*`, id);
          }
          else {
            if (dont > 4) {
              db.set(`cooldown1_${sender.id}`, Date.now());
              db.subtract(`dont_${sender.id}`, dont)
            }
            else {
              db.set(`cooldown_${sender.id}`, Date.now());
            }
          }
      }
      //friend system
      var prend = "";
      if (player.friends === "") prend = "Tidak Ada Teman Yang Di Tambahkan";
      else prend = `${player.friends}`;
      //Folder Nya
      if (!fs.existsSync(`./db/friends/${sender.id}`)) {
        fs.mkdirSync(`./db/friends/${sender.id}`);
      }

      //auto read
      adip.sendSeen(from)

      //money
      var money = db.fetch(`money_${sender.id}`);
      if (money === null) money = 0;
      var bank = db.fetch(`bank_${sender.id}`);
      if (bank === null) bank = 0;
      var gbank = db.fetch(`gbank`);
      if (gbank === null) gbank = 0;
      var playerregis = db.fetch(`playerregis`);
      if (playerregis === null) playerregis = 0;

      //Inventory
      var xphave = db.fetch(`xphave_${sender.id}`);
      if (xphave === null) xphave = 0;
      var antirobhave = db.fetch(`antirob_${sender.id}`);
      if (antirobhave === null) antirobhave = 0;

      //Shop Stock
      var xpstock = db.fetch(`xpstock`);
      if (xpstock === null) xpstock = 0;
      var antistock = db.fetch(`antistock`);
      if (antistock === null) antistock = 0;

      //Leaderboard
      /*if (player.regis === true) {
        if(!moneyfile[sender.id]){
          moneyfile[sender.id] = {
            name:`${player.name}#${player.tag}`,
            money:0
          }
          fs.writeFile("./db/lb/money.json", JSON.stringify(moneyfile), function(err){
             if(err) console.log(err)
          });
       }
       else {
         moneyfile[sender.id].name = `${player.name}#${player.tag}`;
         moneyfile[sender.id].money = money;
         fs.writeFile("./db/lb/money.json", JSON.stringify(moneyfile), function(err){
            if(err) console.log(err)
         }); //Auto Update Leaderboard Money
       }
      }*/

      //other money
      var money1 = db.fetch(`money_${mentionedJidList[0]}`);
      if (money1 === null) money1 = 0;
      var bank1 = db.fetch(`bank_${mentionedJidList[0]}`);
      if (bank1 === null) bank1 = 0;

      //message to get money
      if (player.msg === 50) {
        adip.reply(from, `Selamat Kamu Telah Mencapai ${player.msg} Message Dan Mendapatkan 50.000 Uang`, id);
        db.add(`money_${sender.id}`, 50000);
      }
      else if (player.msg === 100) {
        adip.reply(from, `Selamat Kamu Telah Mencapai ${player.msg} Message Dan Mendapatkan 100.000 Uang`, id);
        db.add(`money_${sender.id}`, 100000);
      }
      else if (player.msg === 200) {
        adip.reply(from, `Selamat Kamu Telah Mencapai ${player.msg} Message Dan Mendapatkan 200.000 Uang`, id);
        db.add(`money_${sender.id}`, 200000);
      }
      else if (player.msg === 300) {
        adip.reply(from, `Selamat Kamu Telah Mencapai ${player.msg} Message Dan Mendapatkan 300.000 Uang`, id);
        db.add(`money_${sender.id}`, 100000);
      }
      else if (player.msg === 400) {
        adip.reply(from, `Selamat Kamu Telah Mencapai ${player.msg} Message Dan Mendapatkan 400.000 Uang`, id);
        db.add(`money_${sender.id}`, 400000);
      }
      else if (player.msg === 500) {
        adip.reply(from, `Selamat Kamu Telah Mencapai ${player.msg} Message Dan Mendapatkan 500.000 Uang`, id);
        db.add(`money_${sender.id}`, 500000);
      }
      else if (player.msg === 600) {
        adip.reply(from, `Selamat Kamu Telah Mencapai ${player.msg} Message Dan Mendapatkan 600.000 Uang`, id);
        db.add(`money_${sender.id}`, 600000);
      }
      else if (player.msg === 700) {
        adip.reply(from, `Selamat Kamu Telah Mencapai ${player.msg} Message Dan Mendapatkan 700.000 Uang`, id);
        db.add(`money_${sender.id}`, 700000);
      }
      else if (player.msg === 800) {
        adip.reply(from, `Selamat Kamu Telah Mencapai ${player.msg} Message Dan Mendapatkan 800.000 Uang`, id);
        db.add(`money_${sender.id}`, 800000);
      }
      else if (player.msg === 900) {
        adip.reply(from, `Selamat Kamu Telah Mencapai ${player.msg} Message Dan Mendapatkan 900.000 Uang`, id);
        db.add(`money_${sender.id}`, 900000);
      }
      else if (player.msg === 1000) {
        adip.reply(from, `Selamat Kamu Telah Mencapai ${player.msg} Message Dan Mendapatkan 1.000.000 Uang`, id);
        db.add(`money_${sender.id}`, 1000000);
      }

      //Send PTT
      if (message.body === "@6289508837920") {
        adip.sendPtt(from, './db/music/tag.mpeg', id);
      }
      adip.setMyStatus(`ADZ V4 REGISTER ${playerregis.toLocaleString()} PLAYER`);
      //Role
      if (player.admin === "1") role = "Vip";
      else if (player.admin === "2") role = "Moderator";
      else if (player.admin === "3") role = "Co-Founder";
      else if (player.admin === "4") role = "Founder";
      else if (money > 1000000000000000) role = "Sultan(Rich)";
      else role = "Player";

      //Other Role
      var roles = "";
      if (player1.admin === "1") roles = "Vip";
      else if (player1.admin === "2") roles = "Moderator";
      else if (player1.admin === "3") roles = "Co-Founder";
      else if (player1.admin === "4") roles = "Founder";
      else if (money1 > 1000000000000000) roles = "Sultan(Rich)";
      else roles = "Player";

      //Prem & Verified
      if (player.verif === true) verified = "*(V)*";
      else if (player.prem === true) verified = "*(p)*";
      else if (player.verif === true && player.prem === true) verified = "*(V)* *(P)*";
      else verified = "";

      //Other
      var verif = "";
      if (player1.verif === true) verif = "*(V)*";
      else if (player1.prem === true) verif = "*(p)*";
      else if (player1.verif === true && player.prem === true) verif = "*(V)* *(P)*";
      else verif = "";

      //Banned Message
      var banneds = "";
      if (player.ban === true) banneds = "Account Have Been Banned";
      else banneds = "Account Not Have Banned";

      //Other Banned Message
      var bans = "";
      if (player1.ban === true) bans = "Account Have Been Banned";
      else bans = "Account Not Have Banned";

      if (isCmd) adip.simulateTyping(from, 2); //Visual Typing

      //PLAY
      if (command === "help") {
        if (isAdip || player.admin === "3" || player.admin === "4") {
          adip.reply(from, `*ADZ BOT V4*
Author:Adip/wa.me/6289508837920
Note:Bot Hanyalah Berbasis Economy Dan Bot Ini Bukan Sticker Maker Ato Yang Lain Melainkan Hanya Bersenang-senang Untuk Gambling
Donasi:https://saweria.co/AdipYT, Jangan Lupa Donasi:]

*LIST COMMAND*
${fs.readFileSync('./command.txt')}

*CO AND FOUNDER COMMAND*
${fs.readFileSync('./command1.txt')}

TIPS:Supaya Tidak Kena Ban Jangan Kalian Menelpon/Spam Pada Bot`, id) 
        }
        else {
          adip.reply(from, `*ADZ BOT V4*
Author:Adip/wa.me/6289508837920
Note:Bot Hanyalah Berbasis Economy Dan Bot Ini Bukan Sticker Maker Ato Yang Lain Melainkan Hanya Bersenang-senang Untuk Gambling
Donasi:https://saweria.co/AdipYT, Jangan Lupa Donasi:]

*LIST COMMAND*
${fs.readFileSync('./command.txt')}

TIPS:Supaya Tidak Kena Ban Jangan Kalian Menelpon/Spam Pada Bot`, id)
        }
      }
      else if (command === "bal") {
          //Active
          var xpactive;
          var xpactive1;
          let timeoutboost = 600000
          let xpboost = db.fetch(`xpboost_${sender.id}`);
          let xpboost1 = db.fetch(`xpboost_${mentionedJidList[0]}`);
          let xptime1 = ms(timeoutboost - (Date.now() - xpboost1));
          let xptime = ms(timeoutboost - (Date.now() - xpboost));

          if (xpboost !== null && timeoutboost - (Date.now() - xpboost) > 0) {
            xpactive = `Xp Boost:${xptime.minutes} Menit ${xptime.seconds} Detik`;
          }
          else {
            xpactive = 'Xp Boost:Tidak Digunakan';
          }

          if (xpboost1 !== null && timeoutboost - (Date.now() - xpboost1) > 0) {
            xpactive1 = `Xp Boost:${xptime1.minutes} Menit ${xptime1.seconds} Detik`;
          }
          else {
            xpactive1 = 'Xp Boost:Tidak Digunakan';
          }

          if (mentionedJidList[0]) {
            if (player.regis === false) return adip.reply(from, regis, id);
            else if (player1.regis === false) return adip.reply(from, regis2, id);
            else if (xpboost1 === null || xpboost1 === undefined) xpactive1 = 'Xp Boost:Tidak Digunakan';
            adip.reply(from, `*INFO PERSON'S ACCOUNT*
*>>* INFO *<<*
*Name*\n${player1.name}#${player1.tag} ${verif}
*Money*\n${money1.toLocaleString()}
*Bank*\n${bank1.toLocaleString()}
*Role*\n${roles}
*Message*\n${player1.msg.toLocaleString()}
*Ban*\n${bans}
*Active*\n${xpactive1}

*>>* LEVEL *<<*
*Level:*\r${userInfo1.level}
*XP:*\r${userInfo1.xp.toLocaleString()}/${userInfo1.reqxp.toLocaleString()}`, id);

          }
          else {
            if (player.regis === false) return adip.reply(from, regis, id);
            else if (xpboost === null || xpboost === undefined) xpactive = 'Xp Boost:Tidak Digunakan';
            adip.reply(from, `*MY ACCOUNT INFO*
*>>* INFO *<<*
*Name*\n${player.name}#${player.tag} ${verified}
*Money*\n${money.toLocaleString()}
*Bank*\n${bank.toLocaleString()}
*Role*\n${role}
*Message*\n${player.msg.toLocaleString()}
*Ban*\n${banneds}
*Active*\n${xpactive}

*>>* LEVEL *<<*
*Level:*\r${userInfo.level}
*XP:*\r${userInfo.xp.toLocaleString()}/${userInfo.reqxp.toLocaleString()}`, id);
          }
      }
      else if (command === "donatelist") {
        adip.reply(from, `*ADZ V4 DONATE LIST*
*DONATE*
PRICE:10K
FEATURE:
-GET 20.000.000 MONEY
-GET PREMIUM ROLE

PRICE:20K
FEATURE:
-GET 50.000.000 MONEY
-GET PREMIUM & VERIFY ROLE
-GET ACCESS PREMIUM DAILY

PRICE:50K
FEATURE:
-GET UNLIMITED MONEY
-GET CO-FOUNDER ROLE & PREMIUM & VERIFIED`, id);
      }
      else if (command === "bag") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban == true) return adip.reply(from, banned, id);
        else {
          adip.reply(from, `*${player.name}#${player.tag} Inventory*

1.Xp Boost || ${xphave.toLocaleString()}
2.Anti Rob || ${antirobhave.toLocaleString()}
`, id)
        }
      }
      else if (command === "gacha") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban == true) return adip.reply(from, banned, id);
        else if (money < 10000) return adip.reply(from, "Gacha Harus Memiliki Uang Diatas 10.000", id);
        else {
          const p = Math.floor((Math.random() * 50000) + 1);
          const p1 = Math.floor((Math.random() * 10) + 1);
          adip.reply(from, `*ADZ V4 GACHA*
          
Result:Kamu Mendapatkan ${p.toLocaleString()} Money, Dan Xp ${p1}`, id);
          db.add(`money_${sender.id}`, p);
          db.subtract(`money_${sender.id}`, 10000);
          userInfo.xp = p1;
        }
      }
      else if (command === "friendlist") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban == true) return adip.reply(from, banned, id);
        else {
          adip.reply(from, `*${player.name}#${player.tag} FRIEND LIST*
        
${prend}`, id);
        }
      }
      else if (command === "addfriend") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player1.regis === false) return adip.reply(from, regis2, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else if (player1.ban === true) return adip.reply(from, banned1, id);
        else if (mentionedJidList.length === 0) return adip.reply(from, "Tag Seseorang", id);
        else if (fs.existsSync(`./db/friends/${sender.id}/${mentionedJidList[0]}.txt`)) return adip.reply(from, `Anda Sudah Berteman Dengan *${player1.name}#${player1.tag}*`, id);
        else if (fs.existsSync(`./db/friends/${mentionedJidList[0]}/${sender.id}.txt`)) return adip.reply(from, `Anda Sudah Berteman Dengan *${player1.name}#${player1.tag}*`, id);
        else {
          try {
            adip.reply(from, `Berhasil, Tunggu *${player1.name}#${player1.tag}* Untuk Accept Friend Dengan Tulis (accept) Waktu Nya 30 Detik`, id);
            ya = (await adip.awaitMessages(message.from, m=>(m.sender.id === mentionedJidList[0] && m.body === "accept" || m.body === "Accept"), {time:30000, max:1, errors: ["time"]})).first().body
            adip.reply(from, `*${player1.name}#${player1.tag}* Sudah Mengaccept Pertemanan Anda Cek */friendlist*`, id);
            player1.friends += `${player.name}#${player.tag}\n`;
            player.friends += `${player1.name}#${player1.tag}\n`;

            //Save
            fs.writeFileSync(`./db/players/${mentionedJidList[0]}.json`, JSON.stringify(player1));
            fs.writeFileSync(`./db/players/${sender.id}.json`, JSON.stringify(player));
            fs.writeFileSync(`./db/friends/${sender.id}/${mentionedJidList[0]}.txt`, 'TEST');
            fs.writeFileSync(`./db/friends/${sender.id}/${sender.id}.txt`, 'TEST');
            fs.writeFileSync(`./db/friends/${mentionedJidList[0]}/${sender.id}.txt`, 'TEST');
            
          }
          catch (err) {
            adip.reply(from, `${player1.name}#${player1.tag}, Tidak Menerima Nya (Dibatalkan)`, id)
          }
        }
      }
      else if (command === "shop") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else {
          adip.reply(from, `*ADZ V4 SHOP*
||ITEM NAME||HARGA||STOCK||
1.XP Boost 10 Menit||200.000||${xpstock.toLocaleString()}||
2.Anti Rob 1 Jam||2.000.000||${antistock.toLocaleString()}||
3.Diamond Lock||${dlprice.price.toLocaleString()}||Unlimited||

Perintah:/buy {id item} {jumlah item}`, id);
        }
      }
      else if (command === "buy") {
        ////////SETTING////////
        var jumlah = args[1];
        var harga = args[1];
        ////////SETTING////////

        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else if (!args[0]) return adip.reply(from, "Masukkan ID Item Cek */shop*", id);
        else if (!args[1]) return adip.reply(from, "Masukkan Jumlah Item Cek */shop*", id);
        else if (isNaN(args[1])) return adip.reply(from, 'Jumlah Hanya Bisa Dengan Nomor');
        else if (message.content.includes('-')) return adip.reply(from, "Tidak Bisa Dengan Negative Point", id);
        else {
          if (args[1] > 10) return adip.reply(from, `Maksimum Pembelian Item Hanya 10`, id);
          if (args[0] === "1") {
            harga *= 200000;
            if (args[1] > money) return adip.reply(from, "Uang Kamu Tidak Cukup Untuk Membeli Item Ini", id);
            else if (args[1] > xpstock) return adip.reply(from, "Stock Item Ini Sudah Habis Kembalilah Pada Saat Sudah Di Stock", id);
            else if (args[1] === "0") return adip.reply(from, "Masukkan Jumlah Item", id);
            else {
              const logsbuy = `*ADZ V4 BUY CONFIRM*
          
Nama:${player.name}#${player.tag}
ItemID:${args[0]}
Jumlah:${jumlah.toLocaleString()}
Harga:${harga.toLocaleString()}`;
              adip.reply(from, logsbuy, id);
              db.subtract('xpstock', jumlah);
              db.subtract(`money_${sender.id}`, harga);
              db.add(`xphave_${sender.id}`, jumlah)
            }
          }
          else if (args[0] === "2") {
            harga *= 2000000;
            if (args[1] > money) return adip.reply(from, "Uang Kamu Tidak Cukup Untuk Membeli Item Ini", id);
            else if (args[1] > antistock) return adip.reply(from, "Stock Item Ini Sudah Habis Kembalilah Pada Saat Sudah Di Stock", id);
            else if (args[1] === "0") return adip.reply(from, "Masukkan Jumlah Item", id);
            else {
              const logsbuy = `*ADZ V4 BUY CONFIRM*
          
Nama:${player.name}#${player.tag}
ItemID:${args[0]}
Jumlah:${jumlah.toLocaleString()}
Harga:${harga.toLocaleString()}`;
              adip.reply(from, logsbuy, id);
              db.subtract('antistock', jumlah);
              db.subtract(`money_${sender.id}`, harga);
              db.add(`antirob_${sender.id}`, jumlah)
            }
          }
          else {
            return adip.reply(from, 'Item ID Tidak Ada Di Shop Cek */shop*', id);
          }
        }
      }
      else if (command === "use") {
        let timeoutboost = 600000
        let xpboost = db.fetch(`xpboost_${sender.id}`);
        let xptime = ms(timeoutboost - (Date.now() - xpboost));

        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else if (!args[0]) return adip.reply(from, 'Masukkan ID Item Cek */shop*', id);
        else {
          if (args[0] === "1") {
            if (xphave === 0) return adip.reply(from, 'Kamu Tidak Memiliki Xp Boost, Beli Di */shop*', id);
            else if (xpboost !== null && timeoutboost - (Date.now() - xpboost) > 0) {
              return adip.reply(from, `Kamu Sedang Memakai Xp Boost Cooldown *${xptime.minutes} Menit ${xptime.seconds} Detik*`, id);
            }
            else {
              adip.reply(from, 'Berhasil Menggunakan Xp Boost 10 Menit', id);
              db.subtract(`xphave_${sender.id}`, 1);
              db.set(`xpboost_${sender.id}`, Date.now());
            }
          }
          else {
            return adip.reply(from, 'ID Item Tidak Ditemukan', id);
          }
        }
      }
      else if (command === "bank") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else {
          adip.reply(from, `*ADZ V4 GLOBAL BANK*
          
*BANK*\n${gbank.toLocaleString()}`, id);
        }
      }
      else if (command === "pajak") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else if (money < 1) return adip.reply(from, "Uang Tidak Cukup Untuk Membayar Pajak", id);
        else if (!args[0]) return adip.reply(from, "Masukkan Jumlah Untuk Membayar Pajak", id);
        else if (message.content.includes('-')) return adip.reply(from, "Tidak Bisa Masukkan Nilai - Pada Pajak", id);
        else if (isNaN(args[0])) return adip.reply(from, "Nilai Pajak Hanya Bisa Dengan Nomor", id);
        else if (args[0] > money) return adip.reply(from, "Uang Tidak Cukup Untuk Membayar Pajak", id);
        else if (args[0] < 1000000) return adip.reply(from, "Minimum Pada Pajak Adalah 1.000.000", id);
        else {
          
          args[0] *= 1;
          adip.reply(from, `*ADZ V4 PAJAK CONFIRM*
          
Nama:${player.name}#${player.tag}
Jumlah:${args[0].toLocaleString()}
Waktu:${time}`, id);
        }
        db.add('gbank', args[0]);
        db.subtract(`money_${sender.id}`, args[0]);
        fs.appendFile(`./db/logs/${sender.id}.txt`, `[P]Berhasil Membayar Pajak Pada Waktu ${time} Sebanyak ${args[0].toLocaleString()}\n`, function (err) {
          if (err) throw err;
        });
      }
      else if (command === "howgay") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban === true) return adip.reply(from, banned, id);

        if (mentionedJidList[0]) {
          if (player1.regis === false) return adip.reply(from, regis2, id);
          else if (player1.ban === true) return adip.reply(from, banned1, id);
          else {
            const gay = Math.floor(Math.random() * 100);
            var gayresult;
            if (gay > 90) {
              gayresult = "Gay Bedebah Taik Kucink";
            }
            else if (gay < 50) {
              gayresult = "Gay Babi Taik Kucink";
            }
            adip.reply(from, `*ADZ V4 GAY TEST*
            
Name: *${player1.name}#${player1.tag}*
Percent: *${gay}%*

Result: *${gayresult}*`, id);
          }
        }
        else {
          if (player.regis === false) return adip.reply(from, regis, id);
          else if (player.ban === true) return adip.reply(from, banned, id);
          else {
            const gay = Math.floor(Math.random() * 100);
            var gayresult;
            if (gay > 90) {
              gayresult = "Gay Bedebah Taik Kucink";
            }
            else if (gay < 50) {
              gayresult = "Gay Babi Taik Kucink";
            }
            adip.reply(from, `*ADZ V4 GAY TEST*
            
Name: *${player.name}#${player.tag}*
Percent: *${gay}%*

Result: *${gayresult}*`, id);
          }
        }
      }
      else if (command === "kerja") {
        ///////////////////////////////////////////////////////////////////////////
        let timeout = 86400000
        let kerjacooldown = db.fetch(`kerjacooldown_${sender.id}`);
        let kerjacooldowntime = ms(timeout - (Date.now() - kerjacooldown));
        ///////////////////////////////////////////////////////////////////////////
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban == true) return adip.reply(from, banned, id);
        else if (!args[0]) return adip.reply(from, `*ADZ V4 KERJA*
        
_*COMMANDS*_
/kerja nama pekerjaan
/kerja list
/kerja out`, id);
        else if (kerjacooldown !== null && timeout - (Date.now() - kerjacooldown) > 0) {
          adip.reply(from, `Kerja Cooldown *${kerjacooldowntime.hours}Jam ${kerjacooldowntime.minutes}Menit*. Anda Sedang Tahap Cooldown Command */kerja* Kembalilah Pada Saat Waktu Tertentu`, id)
        }
        else {
          if (args[0] === "polisi" || args[0] === "POLISI") {
            var lvl = 10
            if (userInfo.level < lvl) return adip.reply(from, `Pekerjaan ${args[0]} Hanya Dapat Pada Level ${lvl}`, id);
            else if (fs.existsSync(`./db/kerja/polisi/${sender.id}.txt`)) return adip.reply(from, 'Gagal, Anda Sudah Punya Pekerjaan', id);
            else {
              fs.writeFileSync(`./db/kerja/polisi/${sender.id}.txt`, 'POLISI');
              adip.reply(from, 'Berhasil Masuk Pekerjaan Tersebut', id);
            }
          }
          else if (args[0] === "list") {
            adip.reply(from, `*ADZ V4 KERJA LIST*
            
${fs.readFileSync('./db/kerja/list.txt')}\n\nContoh:/kerja polisi\nNote:Pekerjaan Hanya Bisa Dimasuki 1, Jika Anda Keluar Dari Pekerjaan Anda Maka Akan Cooldown Selama 1Hari, Untuk Mendapat Kan Pekerjaan Yang Baru`, id);
          }
          else if (args[0] === "out") {
            if (fs.existsSync(`./db/kerja/polisi/${sender.id}.txt`)) {
              adip.reply(from, 'Anda Berhasil Keluar Dari Pekerjaan Polisi, Cooldown 1 Hari', id);
              fs.unlinkSync(`./db/kerja/polisi/${sender.id}.txt`);
              db.set(`kerjacooldown_${sender.id}`, Date.now())
            }
            else {
              adip.reply(from, 'Anda Tidak Memiliki Pekerjaan Apapun', id);
            }
          }
          else {
            adip.reply(from, 'Pekerjaan Tersebut Tidak Ditemukan, Coba Cari Di */kerja list*', id);
          }
        }
      }
      else if (command === "handcuffs") {
        //Time
        let timeoutrob = 1200000
        let timeoutrob1 = 300000
        let rob1 = db.fetch(`rob1_${mentionedJidList[0]}`);
        let robtime1 = ms(timeoutrob - (Date.now() - rob1));
        let rob11 = db.fetch(`rob11_${sender.id}`);
        let robtime11 = ms(timeoutrob1 - (Date.now() - rob11));

        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else if (!fs.existsSync(`./db/kerja/polisi/${sender.id}.txt`)) return adip.reply(from, 'Kamu Tidak Bekerja Di Polisi', id);
		    else if (mentionedJidList.length === 0) return adip.reply(from, 'Tag Seseorang', id);
        else if (rob1 !== null && timeoutrob - (Date.now() - rob1) > 0) {
          adip.reply(from, `${player1.name}#${player1.tag}, Sudah Dalam Penjara Cooldown *${robtime1.minutes} Menit*`, id)
        }
        else if (rob11 !== null && timeoutrob1 - (Date.now() - rob11) > 0) {
          adip.reply(from, `Kamu Sudah Memborgol Cooldown *${robtime11.minutes} Menit*`, id)
        }
        else {
          adip.reply(from, `${player1.name}#${player1.tag}, Berhasil Di Borgol Dan Kamu Mendapatkan 200.000`, id);
          db.set(`rob1_${mentionedJidList[0]}`, Date.now());
          db.set(`rob11_${sender.id}`, Date.now());
          db.add(`money_${sender.id}`, 200000);
        }
      }
      else if (command === "rules") {
        adip.reply(from, `*ADZ V4 RULES*

*PLAYER RULES*
1.Jangan Spam Pada Bot/Menelpon Bot Supaya Tidak Terjadinya Ban Account
2.Jangan Buat Alt Akun Hanya Untuk Spam Duit Kepada Akun Anda
3.Dilarang Register Nama "Adip" Kalo Tidak Ingin Di Ban Account
4.Jangan Trust Pada Siapapun, Kecuali Orang Yang Sudah Bertanda *(V)* Karena Verified Oleh Owner

*VERIFIED RULES*
1.Jangan Scam Maka Akan Terkena Ban Account Dan Di Lepas Tanda *(V)* Nya
2.Saling Berbagi Pada Orang Yang Baru Main

*ADZ-WHATSAPP-BOT 2021 RULES*`, id)
      }
      else if (command === "register") {
        if (player.regis === true) return adip.reply(from, regis1, id);
        else if (!args[0]) return adip.reply(from, 'Masukin Nama Anda', id);
        let cards = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        adip.reply(from, `*ACCOUNT CREATED*\nNama:${args[0]}\nTag:#${player.tag}\n\nKamu Mendapatkan 20,000 Karena Telah Register Cek */bal*\n\nSupaya Anda Tidak Terkena Banned Oleh Bot Harap Baca Rules */rules*`, id);
        player.name = args[0];
        player.regis = true;
        player.card = cards;
        fs.writeFileSync(`./db/players/${sender.id}.json`, JSON.stringify(player));
        db.add(`money_${sender.id}`, 20000);
        db.add(`playerregis`, 1);
      }
      else if (command === "judi") {
        //Random Counting Judi
        var roulette = Math.floor(Math.random() * 36);
        var roulette1 = Math.floor(Math.random() * 36);

        if (args[0] == "all" || args[0] == "ALL") {
          //Error Message
          if (player.regis == false) return adip.reply(from, regis, id);
          else if (player.ban == true) return adip.reply(from, banned, id);
          else if (money < 1) return adip.reply(from, "Uang Kamu Tidak Cukup Untuk Bermain Gambling", id);
          //Gambling Mode All
          if (roulette === 0) {
            money *= 2
            adip.reply(from, `*ADZ GAMBLING*

*${player.name}#${player.tag}:${roulette}*
*BOT:${roulette1}*

Message:You Won ${money.toLocaleString()} Money`, id);
            db.add(`money_${sender.id}`, money);
          }
          else if (roulette1 === 0) {
            money *= 1
            adip.reply(from, `*ADZ GAMBLING*

*${player.name}#${player.tag}:${roulette}*
*BOT:${roulette1}*

Message:You Lose ${money.toLocaleString()} Money`, id);
            db.subtract(`money_${sender.id}`, money);
          }
          else if (roulette > roulette1) {
            money *= 2
            adip.reply(from, `*ADZ GAMBLING*

*${player.name}#${player.tag}:${roulette}*
*BOT:${roulette1}*

Message:You Won ${money.toLocaleString()} Money`, id);
            db.add(`money_${sender.id}`, money);
          }
          else if (roulette < roulette1) {
            money *= 1
            adip.reply(from, `*ADZ GAMBLING*

*${player.name}#${player.tag}:${roulette}*
*BOT:${roulette1}*

Message:You Lose ${money.toLocaleString()} Money`, id);
            db.subtract(`money_${sender.id}`, money);
          }
          else if (roulette === roulette1) {
            adip.reply(from, `*ADZ GAMBLING*

*${player.name}#${player.tag}:${roulette}*
*BOT:${roulette1}*

Message:Tie!`, id);
          }
        }
        else {
          //Error Message
          if (player.regis == false) return adip.reply(from, regis, id);
          else if (player.ban == true) return adip.reply(from, banned, id);
          else if (money < 1) return adip.reply(from, "Uang Kamu Tidak Cukup Untuk Bermain Gambling", id);
          else if (!args[0]) return adip.reply(from, "Masukkan Jumlah Gambling", id);
          else if (message.content.includes('-')) return adip.reply(from, "Tidak Bisa Masukkan Nilai - Pada Gambling", id);
          else if (isNaN(args[0])) return adip.reply(from, "Nilai Gambling Hanya Bisa Dengan Nomor", id);
          else if (args[0] > money) return adip.reply(from, "Uang Kamu Tidak Cukup", id);
          else if (args[0] < 1000) return adip.reply(from, "Minimum Gambling 1000", id);
          //Gambling Mode
          if (roulette === 0) {
            args[0] *= 2
            adip.reply(from, `*ADZ GAMBLING*

*${player.name}#${player.tag}:${roulette}*
*BOT:${roulette1}*

Message:You Won ${args[0].toLocaleString()} Money`, id);
            db.add(`money_${sender.id}`, args[0]);
          }
          else if (roulette1 === 0) {
            args[0] *= 1
            adip.reply(from, `*ADZ GAMBLING*

*${player.name}#${player.tag}:${roulette}*
*BOT:${roulette1}*

Message:You Lose ${args[0].toLocaleString()} Money`, id);
            db.subtract(`money_${sender.id}`, args[0]);
          }
          else if (roulette > roulette1) {
            args[0] *= 2
            adip.reply(from, `*ADZ GAMBLING*

*${player.name}#${player.tag}:${roulette}*
*BOT:${roulette1}*

Message:You Won ${args[0].toLocaleString()} Money`, id);
            db.add(`money_${sender.id}`, args[0]);
          }
          else if (roulette < roulette1) {
            args[0] *= 1
            adip.reply(from, `*ADZ GAMBLING*

*${player.name}#${player.tag}:${roulette}*
*BOT:${roulette1}*

Message:You Lose ${args[0].toLocaleString()} Money`, id);
            db.subtract(`money_${sender.id}`, args[0]);
          }
          else if (roulette === roulette1) {
            adip.reply(from, `*ADZ GAMBLING*

*${player.name}#${player.tag}:${roulette}*
*BOT:${roulette1}*

Message:Tie!`, id);
          }
        }
      }
      else if (command === "redeem") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else if (userInfo.level < 2) return adip.reply(from, '*Redeem Hanya Dapat Di Access Pada Level 2*', id);
        else if (!args[0]) return adip.reply(from, '*Masukkan Code Redeem*', id);
        else if (!fs.existsSync(`./db/redeem/${args[0]}.json`)) return adip.reply(from, `*Code Redeem ${args[0]} Tidak Ada*`, id);
        else if (fs.existsSync(`./db/redeem/already/${args[0]}_${sender.id}.txt`)) return adip.reply(from, `*Kamu Sudah Menggunakan Code Ini*`, id);
        else {
          const code = require(`./db/redeem/${args[0]}.json`);
          code.duit *= 1
          adip.reply(from, `*_${args[0]}_* *Code Ini Berhasil Digunakan Dan Mendapatkan ${code.duit.toLocaleString()} Uang*`, id);
          db.add(`money_${sender.id}`, code.duit);
          fs.writeFileSync(`./db/redeem/already/${args[0]}_${sender.id}.txt`, 'ALREADY');
        }
      }
      else if (command === "pay") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player1.regis === false) return adip.reply(from, regis2, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else if (player1.ban === true) return adip.reply(from, banned1, id);
        else if (userInfo.level < 2) return adip.reply(from, '*Pay Hanya Dapat Di Access Pada Level 2*', id);
        else if (mentionedJidList.length === 0) return adip.reply(from, 'Tag Seseorang', id);
        else if (!args[1]) return adip.reply(from, 'Masukan Jumlah Uang', id);
        else if (isNaN(args[1])) return adip.reply(from, "Nilai Bayar Hanya Bisa Dengan Nomor", id);
        else if (message.content.includes('-')) return adip.reply(from, "Tidak Bisa Masukkan Nilai - Pada Pay", id);
        else if (money < 1) return adip.reply(from, 'Jumlah Uang Tidak Cukup Untuk Membayar', id);
        else if (args[1] === 0) return adip.reply(from, "?", id);
        else if (args[1] > money) return adip.reply(from, 'Jumlah Uang Tidak Cukup Untuk Membayar', id);
        else {
          args[1] *= 1
          adip.reply(from, `*${player.name}#${player.tag}*, Berhasil Membayar Kepada *${player1.name}#${player1.tag}* Sebanyak ${args[1].toLocaleString()}`, id);
          db.add(`money_${mentionedJidList[0]}`, args[1]);
          db.subtract(`money_${sender.id}`, args[1])
        }
      }
      else if (command === "rob") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player1.regis === false) return adip.reply(from, regis2, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else if (player1.ban === true) return adip.reply(from, banned1, id);
        else if (userInfo.level < 5) return adip.reply(from, "Rob Hanya Bisa Di Access Pada Level 5", id);
        else if (mentionedJidList.length === 0) return adip.reply(from, 'Tag Seseorang', id);
        else if (fs.existsSync(`./db/kerja/polisi/${sender.id}.txt`)) return adip.reply(from, 'Kamu Seorang Polisi Tidak Dapat Mencuri', id);
        else if (args[0] === "@6289508837920" || args[0] === "@6287742372337") return adip.reply(from, "User Ini Tidak Dapat Di Rob Karena High Role", id);
        else {
          //System Waktu
          let timeout = 1800000
          let timeoutother = 3600000
          let timeoutrob = 1200000
          let rob = db.fetch(`rob_${sender.id}`);
          let rob1 = db.fetch(`rob1_${sender.id}`);
          let robother = db.fetch(`robother_${mentionedJidList[0]}`);
          let robtime = ms(timeout - (Date.now() - rob));
          let robtime1 = ms(timeoutrob - (Date.now() - rob1));
          let robothertime = ms(timeoutother - (Date.now() - robother));
          if (rob !== null && timeout - (Date.now() - rob) > 0) {
            adip.reply(from, `Kamu Telah Melakukan Pencurian Cooldown Selama *${robtime.hours}Jam ${robtime.minutes}Menit*`, id)
          }
          else if (rob1 !== null && timeout - (Date.now() - rob1) > 0) {
            adip.reply(from, `Kamu Sedang Di Penjara, Cooldown *${robtime1.minutes} Menit*`, id)
          }
          else if (robother !== null && timeoutother - (Date.now() - robother) > 0) {
            adip.reply(from, `Orang Ini Telah Dicuri Ia Sedang Cooldown Selama *${robothertime.hours}Jam ${robothertime.minutes}Menit*`, id)
          }
          else {
            if (money1 < 5000) return adip.reply(from, "Orang Ini Tidak Mempunyai Uang", id);
            else if (money < 10000) return adip.reply(from, "Rob Harus Mempunyai Uang Sebesar *10.000*", id);
            else {
              const p = Math.floor((Math.random() * 4) + 1);
              const p2 = Math.floor(Math.random() * money1);
              if (p === 2 || p === 4) {
                adip.reply(from, `Kamu Berhasil Mencuri Dari *${player1.name}#${player1.tag}* Sebanyak *${p2.toLocaleString()}*`, id)
                db.add(`money_${sender.id}`, p2);
                db.subtract(`money_${mentionedJidList[0]}`, p2);
                db.set(`rob_${sender.id}`, Date.now());
                db.set(`robother_${mentionedJidList[0]}`, Date.now());
                fs.appendFile(`./db/logs/${mentionedJidList[0]}.txt`, `[B]${player.name}#${player.tag} Berhasil Mencuri Uang Mu Sebanyak ${p2.toLocaleString()}\n`,function (err) {
                  if (err) throw err;
                });
              }
              else {
                adip.reply(from, `Kamu Gagal Mencuri Dari *${player1.name}#${player1.tag}* Dan Membayar Kepada Dia Sebanyak 10.000`, id)
                db.add(`money_${mentionedJidList[0]}`, 10000);
                db.subtract(`money_${sender.id}`, 10000);
                db.set(`rob_${sender.id}`, Date.now());
                db.set(`robother_${mentionedJidList[0]}`, Date.now());
                fs.appendFile(`./db/logs/${mentionedJidList[0]}.txt`, `[G]${player.name}#${player.tag} Gagal Mencuri Dari Kamu\n`, function (err) {
                  if (err) throw err;
                });
              }
            }
          }
        }
      }
      else if (command === "mylogs") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else if (!fs.existsSync(`./db/logs/${sender.id}.txt`)) return adip.reply(from, "File Tidak Ada", id)
        else {
          const logs = fs.readFileSync(`./db/logs/${sender.id}.txt`);
          adip.reply(from, `*${player.name}#${player.tag}*
          
${logs.toString()}`, id)
        }
      }
      else if (command === "daily") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else {
          let timeout = 43200000
          let daily = db.fetch(`daily_${sender.id}`);
          let dailytime = ms(timeout - (Date.now() - daily));
          if (daily !== null && timeout - (Date.now() - daily) > 0) {
            adip.reply(from, `Daily Cooldown *${dailytime.hours}Jam ${dailytime.minutes}Menit* Kembalilah Pada Waktu Berikut`, id)
          } else {
            adip.reply(from, 'Anda Berhasil Mengambil Hadiah Harian Sebanyak 15.000!', id)
            db.add(`money_${sender.id}`, 15000)
            db.set(`daily_${sender.id}`, Date.now())
          }
        }
      }
      else if (command === "with" || command === "withdraw") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else if (args[0] === 0) return adip.reply(from, "?", id);
        else if (bank < 1) return adip.reply(from, "Kamu Tidak Mempunyai Uang Di Bank Untuk Withdraw", id);

        if (args[0] === "all") {
          adip.reply(from, `Berhasil Mengeluarkan Uang Dari Bank Sebanyak ${bank.toLocaleString()}`, id);
          db.subtract(`bank_${sender.id}`, bank);
          db.add(`money_${sender.id}`, bank);
        }
        else {
          if (isNaN(args[0])) return adip.reply(from, "Nilai Withdraw Hanya Bisa Dengan Nomor", id);
          else if (message.content.includes('-')) return adip.reply(from, "Tidak Bisa Masukkan Nilai - Pada Withdraw", id);
          else if (args[0] > bank) return adip.reply(from, "Nilai Bank Kamu Tidak Cukup Untuk Withdraw", id);
          args[0] *= 1;
          adip.reply(from, `Berhasil Mengeluarkan Uang Dari Bank Sebanyak ${args[0].toLocaleString()}`, id);
          db.subtract(`bank_${sender.id}`, args[0]);
          db.add(`money_${sender.id}`, args[0]);
        }
      }
      else if (command === "depo" || command === "deposit") {
        if (player.regis === false) return adip.reply(from, regis, id);
        else if (player.ban === true) return adip.reply(from, banned, id);
        else if (args[0] === 0) return adip.reply(from, "?", id);
        else if (money < 1) return adip.reply(from, "Kamu Tidak Mempunyai Uang Untuk Deposit", id);

        if (args[0] === "all") {
          adip.reply(from, `Berhasil Deposit Uang Ke Bank Sebanyak ${money.toLocaleString()}`, id);
          db.subtract(`money_${sender.id}`, money);
          db.add(`bank_${sender.id}`, money);
        }
        else {
          if (isNaN(args[0])) return adip.reply(from, "Nilai Deposit Hanya Bisa Dengan Nomor", id);
          else if (message.content.includes('-')) return adip.reply(from, "Tidak Bisa Masukkan Nilai - Pada Deposit", id);
          else if (args[0] > money) return adip.reply(from, "Nilai Uang Kamu Tidak Cukup Untuk Deposit", id);
          args[0] *= 1;
          adip.reply(from, `Berhasil Deposit Uang Ke Bank Sebanyak ${args[0].toLocaleString()}`, id);
          db.subtract(`money_${sender.id}`, args[0]);
          db.add(`bank_${sender.id}`, args[0]);
        }
      }
      //Admin Bot Command
      else if (command === "verify") {
        if (!isAdip) return adip.reply(from, "*Command Ini Hanya Bisa Di Akses Oleh Owner*", id);
        else if (player1.regis === false) return adip.reply(from, "*User Tidak Terdaftar Pada System Bot*", id);
        else if (player1.verif === true) return adip.reply(from, "*User Sudah Menjadi Verified Bot*", id);
        adip.reply(from, `*${player1.name}#${player1.tag}* Telah Di Beri Verified Oleh Owner\n\nDan Mendapatkan 5,000,000`, id);
        player1.verif = true;
        fs.writeFileSync(`./db/players/${tagger1}.json`, JSON.stringify(player));
        db.add(`money_${tagger1}`, 5000000);
      }
      else if (command === "setstatus") {
        var sts;
        if (isAdip || player.admin === "3" || player.admin === "4") {
          if (!args[0]) return adip.reply(from, `*ADZ V4 STATUS MODE*
  
[1]Maintenance
[2]UnMaintenance`, id);
          else {
            if (args[0] === "1") {
              sts = false;
            }
            else if (args[0] === "2") {
              sts = true;
            }
            else {
              return adip.reply(from, 'Mode Tidak Ada Dalam Bot', id);
            }
          }
          config.status = sts;
          fs.writeFile("./config.json", JSON.stringify(config), function(err){
            if(err) console.log(err)
          });
          adip.reply(from, "Status Berhasil Di Setting", id);
        }
        else { 
          return adip.reply(from, "*Command Ini Hanya Bisa Di Akses Oleh Owner*", id);
        }
      }
      else if (command === "unverify") {
        if (!isAdip) return adip.reply(from, "*Command Ini Hanya Bisa Di Akses Oleh Owner*", id);
        else if (player1.regis === false) return adip.reply(from, "*User Tidak Terdaftar Pada System Bot*", id);
        else if (player1.verif === false) return adip.reply(from, "*User Tidak Pernah Menjadi Verify Bot*", id);
        adip.reply(from, `*${player1.name}#${player1.tag}* Verify Telah Di Copot`, id);
        player1.verif = false;
        fs.writeFileSync(`./db/players/${tagger1}.json`, JSON.stringify(player));
      }
      else if (command === "setlevel") {
        if (isAdip || player.admin === "3" || player.admin === "4") {
          if (player.regis === false) return adip.reply(from, regis, id);
          else if (player1.regis === false) return adip.reply(from, regis2, id);
          else if (player.ban === true) return adip.reply(from, banned, id);
          else if (player1.ban === true) return adip.reply(from, banned1, id);
          else if (!args[1]) return;
          else if (mentionedJidList.length === 0) return adip.reply(from, '*Tag Seseorang*', id);
          else if (isNaN(args[1])) return adip.reply(from, "Nilai Level Hanya Bisa Dengan Nomor", id);
          else if (message.content.includes('-')) return adip.reply(from, "Tidak Bisa Masukkan Nilai - Pada Setlevel", id);
          else if (args[1] === 0) return;
          else {
            userInfo1.level = args[1];
            userInfo1.reqxp *= args[1];
            adip.reply(from, "*Level User Sudah Di Set*", id);
            fs.writeFile("./db/lb/level.json", JSON.stringify(userInfo1), function(err){
              if(err) console.log(err)
           });
          }
        }
        else { 
          date.toLocaleString()
          return adip.reply(from, "*Command Ini Hanya Bisa Di Akses Oleh Owner*", id);
        }
      }
      else if (command === "ban") {
        if (isAdip || player.admin === "3" || player.admin === "4") {
          if (player1.regis === false) return adip.reply(from, "*User Tidak Terdaftar Pada System Bot*", id);
          else if (mentionedJidList.length === 0) return adip.reply(from, '*Tag Seseorang*', id);
          else if (player1.ban === true) return adip.reply(from, "*User Sudah Terkena Banned Dari System Bot*", id);
          else {
            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();
            let time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            adip.reply(from, `*ADZ V4 BANNED*

Name:${player1.name}#${player1.tag}
Banned:Permanent
Time Banned:${time}

Akun Ini Telah Di Banned Dari System Bot Karena Melanggar Rules :] Jika Ingin Di Unban Harap Whatsapp Owner Dan Tidak Melanggar Rules Lagi
`, id);
            player1.ban = true;
            fs.writeFileSync(`./db/players/${tagger1}.json`, JSON.stringify(player1));
          }
        }
        else {
          return adip.reply(from, "*Command Ini Hanya Bisa Di Akses Oleh Owner*", id);
        }
      }
      else if (command === "restock") {
        if (isAdip || player.admin === "3" || player.admin === "4") {
          if (!args[0]) return adip.reply(from, 'Masukkan ID Item', id);
          else if (!args[1]) return adip.reply(from, 'Masukkan Jumlah Stock', id);
          else {
            if (args[0] === "1") {
              args[1] *= 1
              adip.reply(from, `Berhasil Mengrestock Xp Boost Sebanyak *${args[1].toLocaleString()}*`, id);
              db.add('xpstock', args[1]);
            }
            else if (args[0] === "2") {
              args[1] *= 1
              adip.reply(from, `Berhasil Mengrestock Anti Rob Sebanyak *${args[1].toLocaleString()}*`, id);
              db.add('antistock', args[1]);
            }
            else {
              return adip.reply(from, 'ID Item Tidak Ditemukan', id);
            }
          }
        }
        else {
          return adip.reply(from, "*Command Ini Hanya Bisa Di Akses Oleh Owner*", id);
        }
      }
      else if (command === "unban") {
        if (isAdip || player.admin === "3" || player.admin === "4") {
          if (player1.regis === false) return adip.reply(from, "*User Tidak Terdaftar Pada System Bot*", id);
          else if (mentionedJidList.length === 0) return adip.reply(from, '*Tag Seseorang*', id);
          else if (player1.ban === false) return adip.reply(from, "*User Tidak Terkena Banned Dari System Bot*", id);
          else {
            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();
            let time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            adip.reply(from, `*ADZ V4 UNBANNED*

Name:${player1.name}#${player1.tag}
Time Unbanned:${time}
`, id);
            player1.ban = false;
            fs.writeFileSync(`./db/players/${tagger1}.json`, JSON.stringify(player1));
          }
        }
        else {
          date.toLocaleString()
          return adip.reply(from, "*Command Ini Hanya Bisa Di Akses Oleh Owner*", id);
        }
      }
      else if (command === 'bc') {
        if (!isAdip) return adip.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
        if (args.length == 0) return adip.reply(from, `Untuk broadcast ke semua chat ketik:\n${prefix}bc [isi chat]`, id)
        let msg = body.slice(4)
        const chatz = await adip.getAllChatIds()
        for (let idk of chatz) {
          var cvk = await adip.getChatById(idk)
          if (!cvk.isReadOnly) adip.sendText(idk, `〘 *A D Z  B C* 〙\n\n${msg}`)
          if (cvk.isReadOnly) adip.sendText(idk, `〘 *A D Z B C* 〙\n\n${msg}`)
          }
          adip.reply(from, 'Broadcast Success!', id);
        }
      else if (command === "giverole") {
        if (!isAdip) return adip.reply(from, "*Command Ini Hanya Bisa Di Akses Oleh Owner*", id);
        else if (player1.regis === false) return adip.reply(from, "*User Tidak Terdaftar Pada System Bot*", id);
        else if (mentionedJidList.length === 0) return adip.reply(from, '*Tag Seseorang*', id);
        else if (!args[1]) return adip.reply(from, "Masukkan Nomor Role", id);
        else if (args[1] > 4 || args[1] === 0) return adip.reply(from, "Number Role Di System Bot Tidak Di Temukan", id);
        adip.reply(from, `${player1.name}#${player1.tag}, Role Telah Di Set`, id);
        player1.admin = args[1];
        fs.writeFileSync(`./db/players/${tagger1}.json`, JSON.stringify(player));
      }
      else if (command === "give") {
        if (isAdip || player.admin === "3" || player.admin === "4") {
          if (!args[0]) return adip.reply(from, 'Masukkan Jumlah Uang', id);
          else if (message.content.includes('-')) return adip.reply(from, "Tidak Bisa Masukkan Nilai - Pada Give", id);
          else if (isNaN(args[0])) return adip.reply(from, "Nilai Give Hanya Bisa Dengan Nomor", id);
          args[0] *= 1
          adip.reply(from, `Berhasil Menambahkan Uang Sebanyak ${args[0].toLocaleString()}`, id);
          db.add(`money_${sender.id}`, args[0]);
        }
        else {
          return adip.reply(from, "*Command Ini Hanya Bisa Di Akses Oleh Owner*", id);
        }
      }
      else if (command === "createredeem") {
        if (isAdip || player.admin === "3" || player.admin === "4") {
          if (!args[0]) return adip.reply(from, 'Masukkan Nama Code', id);
          else if (!args[1]) return adip.reply(from, 'Masukkan Jumlah Uang', id);
          else if (isNaN(args[1])) return adip.reply(from, "Nilai Redeem Uang Hanya Bisa Dengan Nomor", id);
          else {
            let credeem = { duit:args[1] };
            fs.writeFileSync(`./db/redeem/${args[0]}.json`, JSON.stringify(credeem));
            adip.reply(from, 'Code Berhasil Dibuat', id);
          }
        }
        else {
          return adip.reply(from, "*Command Ini Hanya Bisa Di Akses Oleh Owner*", id);
        }
      }
      else {
        if (command) return adip.reply(from, "*Command Not Found* _/help_ *Untuk Melihat Command Yang Ada*", id);    
      }
    });
};

//session
create({
    sessionId: "Adip",
    authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    hostNotificationLang: 'PT_BR',
    logConsole: false,
    popup: true,
    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));