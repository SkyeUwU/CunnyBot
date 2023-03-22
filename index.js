require('dotenv').config();
const { rating, site, allowedTagsFile, disallowedTagsFile, logToFile, deleteLogsOlderThan, preventDuplicates, sendAtStart } = require('./configs.js');
const Discord = require('discord.js');
const { CronJob } = require('cron');
const Booru = require('booru');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvParser = require("csvtojson");

const client = new Discord.WebhookClient({ id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN });

var allowed_tags = fs.readFileSync(allowedTagsFile, { encoding: 'utf8' }).trim().split(/\s+/g).filter(tag => !!tag);
var unused_tags = allowed_tags;
var disallowed_tags = fs.readFileSync(disallowedTagsFile, { encoding: 'utf8' }).trim().split(/\s+/g).filter(tag => !!tag);

async function postToDiscord() {
    antiFlood()
    if (!allowed_tags.length) {
        console.error("No tags has been found! The script got killed x-x")
        process.kill(process.pid);
    }

    if (!unused_tags.length) unused_tags = allowed_tags;
    console.log(`Tags left: ${unused_tags.join(", ")}`)
    var disallowedTags = disallowed_tags.map((tag) => '-' + tag);
    var tags = new Array();
    var tag = unused_tags[Math.floor(Math.random() * unused_tags.length)];
    tags = tags.concat(disallowedTags);
    tags.push(tag);
    tags.push(`rating:${rating}`);

    unused_tags = unused_tags.filter(a => a != tag);

    var posts = (await Booru.search(site, tags, { limit: 100, random: true })).posts;
    if (!posts.length) {
        console.error(`The tag "${tag}" returned no posts...`)
        allowed_tags = allowed_tags.filter(a => a != tag);
        postToDiscord();
        return;
    }

    var post = posts[Math.floor(Math.random() * posts.length)];

    if (await isInLogs(post.id)) return postToDiscord();

    console.log(`Sending post with id "${post.id}"...`)
    console.log(`Using the tags: ${tags.join(", ")}`)

    var tagBeautified = tag.split("_").map(t => t.startsWith("(") ? ("(" + t[1].toUpperCase() + t.substring(2)) : (t[0].toUpperCase() + t.substring(1))).join(" ")

    await client.send({
        content: post.fileUrl,
        avatarURL: 'https://media.discordapp.net/attachments/759466522312704000/1083769825047875775/20230310_171040.jpg',
        username: `CunnyBot - ${tagBeautified}`
    }).then(() => {
        console.log("The post has been sent successfully!")
        console.log("\n");
        logFunction(post.id, tag, true)
    });
}

async function check() {
    console.log(`Checking for new posts...`);
    try {
        await postToDiscord();
    } catch (error) {
        console.error(error);
        console.log("\n");
    }
}

var job = new CronJob('0 * * * *', check, null, true, 'America/Los_Angeles');
job.start();
if (sendAtStart) check();
console.log("Job started!");

async function logFunction(postID, tagUsed, wasSuccessful) {
    if (!logToFile) return false;
    try {
        const csvHeader = [
            { id: 'postID', title: 'postID' },
            { id: 'tagUsed', title: 'tagUsed' },
            { id: 'timestamp', title: 'timestamp' },
            { id: 'successful', title: 'successful' }
        ]

        var newData = [{
            postID: postID,
            tagUsed: tagUsed,
            timestamp: Date.now(),
            successful: wasSuccessful
        }];

        if (!fs.existsSync(logToFile)) {
            const csvWriter = createCsvWriter({ path: logToFile, header: csvHeader });
            await csvWriter.writeRecords(newData);
        } else {
            const csvWriter = createCsvWriter({ path: logToFile, header: csvHeader, append: true });
            await csvWriter.writeRecords(newData);
        }

        var read = fs.createReadStream(logToFile);

        const json = await csvParser({
            noheader: false,
            output: "json"
        }).fromStream(read);

        const newJSON = json.filter(row => Date.now() - parseInt(row.timestamp) < daysToMs(deleteLogsOlderThan));
        if (!arraysEqual(newJSON, json)) {
            const csvWriter = createCsvWriter({ path: logToFile, header: csvHeader, append: false });
            await csvWriter.writeRecords(newJSON);
        }
    } catch (error) {
        console.log(error)
    }
}

async function isInLogs(postID) {
    if (!logToFile || !preventDuplicates) return false;
    if (!fs.existsSync(logToFile)) return false;
    var read = fs.createReadStream(logToFile);

    var json = await csvParser({
        noheader: false,
        output: "json"
    }).fromStream(read);

    var isInRows = false;

    json.forEach(row => {
        if (parseInt(row.postID) == postID && row.successful == 'true') isInRows = true;
    })

    return isInRows;
}

function daysToMs(days) {
    const hours = days * 24;
    const minutes = hours * 60;
    const seconds = minutes * 60;
    const ms = seconds * 1000;
    return ms;
}

function arraysEqual(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
    for (let i = 0; i < array1.length; i++) {
        if (!objectsEqual(array1[i], array2[i])) {
            return false;
        }
    }
    return true;
}

function objectsEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }
    return true;
}

var floods = 0;
var timeout;

function antiFlood() {
    if (floods > 10) {
        console.error(`The script tried to send posts too fast!\nSolutions:\n1. Clean the logs file "${logToFile}" or completely disable logging.\n2. Check the allowed and disallowed tags for tags that doesn't exist.\n3. Check if the rating is valid for the booru you picked.\n4. Check if the booru you picked is valid (you can check the "booru" npm package docs for more info).\n5. Disable the duplicated posts checking feature in the config.js`)
        process.kill(process.pid);
    }
    if (timeout) clearTimeout(timeout);
    floods++
    timeout = setTimeout(function () {
        floods = 0;
    }, 5000)
}
