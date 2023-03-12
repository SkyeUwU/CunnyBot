require('dotenv').config();
var Discord = require('discord.js');
var { CronJob } = require('cron');
var Booru = require('booru');
var fs = require('fs');

var rating = process.env.RATING;
var site = process.env.SITE;
var allowed_tags = fs.readFileSync("allowed_tags.txt", { encoding: 'utf8' }).trim().split(/\s+/g);
var unused_tags = allowed_tags;
var disallowed_tags = fs.readFileSync("disallowed_tags.txt", { encoding: 'utf8' }).trim().split(/\s+/g);

var client = new Discord.WebhookClient({ id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN });

async function postToDiscord() {
    if (!allowed_tags.length) process.kill(process.pid, "No tags has been found! The script has been killed")

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

    var post = posts[Math.floor(Math.random() * posts.length)]

    console.log(`Sending post with id "${post.id}"...`)
    console.log(`Using the tags: ${tags.join(", ")}`)

    var tagBeautified = tag.split("_").map(t => t.startsWith("(") ? ("(" + t[1].toUpperCase() + t.substring(2)) : (t[0].toUpperCase() + t.substring(1))).join(" ")

    await client.send({
        content: post.fileUrl,
        avatarURL: 'https://media.discordapp.net/attachments/759466522312704000/1083769825047875775/20230310_171040.jpg',
        username: `CunnyBot - ${tagBeautified}`
    }).then(() => {
        console.log("The posts has been sent successfully!")
        console.log("\n");
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

console.log("Job started!")
