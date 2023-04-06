require('dotenv').config();
const {
    rating,
    site,
    allowedTagsFile,
    disallowedTagsFile,
    allowAnimations,
    logToFile,
    deleteLogsOlderThan,
    preventDuplicates,
    sendAtStart 
} = require('./configs.js');
const Discord = require('discord.js');
const { CronJob } = require('cron');
const Booru = require('booru');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvParser = require("csvtojson");

const client = new Discord.WebhookClient({ url: process.env.WEBHOOK_URL });

const read_stream = logToFile ? fs.createReadStream(logToFile) : null;

const allowedTags = fs.readFileSync(allowedTagsFile, { encoding: "utf8" })
                      .trim()
                      .split(/\s+/g)
                      .filter(tag => tag);

const disallowedTags = fs.readFileSync(disallowedTagsFile, { encoding: "utf8" })
                         .trim()
                         .split(/\s+/g)
                         .filter(tag => tag)
                         .map(tag => `-${tag}`);
if (!allowAnimations)
    disallowedTags.push("-animated");

const unusedTags = [...allowedTags];

const getRandomItemFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

const removeTagFromArray = (array, tag) => {
    const index = array.findIndex(arrTag => arrTag === tag);
    array.splice(index, 1);
};

const isAlreadyPosted = async (post) => {
    const json = await csvParser({
        noheader: false,
        output: "json"
    }).fromStream(read_stream);

    return !json.every(row => row.postID != post.id);
};

const getFreshPost = async (postsArray) => {
    let post = postsArray[0];
    if (preventDuplicates) {
        let index = 1;
        const postsArrayLength = postsArray.length;
        for (; (await isAlreadyPosted(post)) && index < postsArrayLength; ++index)
            post = postsArray[index];
        if (index === postsArray)
            return false;
    }
    return post;
};

const beautifyTag = (tag) => {
    let index;
    return tag.split('_')
              .map(token => (((index = +(token[0] === '('))) ? '(' : "").concat(token[index++].toUpperCase(), token.slice(index)))
              .join(' ');
};

const postImage = async () => {
    do {
        if (!allowedTags.length) {
            console.error("No tags have been found! The script got killed x-x");
            process.kill(process.pid);
        }

        if (!unusedTags.length)
            unusedTags.concat(allowedTags);

        const currentTag = getRandomItemFromArray(unusedTags);

        const tags = [
            ...disallowedTags,
            currentTag,
        ];

        if (rating)
            tags.push(`rating:${rating}`);

        removeTagFromArray(unusedTags, currentTag);

        const posts = (await Booru.search(site, tags, { limit: 3, random: true })).posts;
        if (!posts.length) {
            console.log(`The tag ${currentTag} returned no posts`);
            removeTagFromArray(allowedTags, currentTag);
            continue;
        }

        const post = await getFreshPost(posts);

        console.log(`Sending image with ID: (${post.id})\nUsing the tags: ${tags.join(", ")}`);

        await client.send({
            content: post.fileUrl,
            avatarURL: 'https://media.discordapp.net/attachments/759466522312704000/1083769825047875775/20230310_171040.jpg',
            username: `CunnyBot - ${beautifyTag(currentTag)}`
        });

        console.log("The post has been sent successfully!\n");

        if (logToFile)
            logPost(post, tags);
    } while (0);
}

async function check() {
    console.log(`Checking for new posts...`);
    try {
        await postImage();
    } catch (error) {
        console.error(error, '\n');
    }
}

function daysToMs(days) {
    // 86400000 is constant from (24 * 60^2 * 1000)
    return days * 86400000;
}

const logHeader = [
    { id: 'postID', title: 'postID' },
    { id: 'tagUsed', title: 'tagUsed' },
    { id: 'timestamp', title: 'timestamp' }
];

const logPost = async (post, tagUsed) => {
    try {
        const json = await csvParser({
            noheader: false,
            output: "json"
        }).fromStream(read_stream);

        const newData = [{
            postID: post.id,
            tagUsed: tagUsed,
            timestamp: Date.now()
        }];

        const csvWriterOptions = { path: logToFile, header: logHeader, append: false };
        let expiredIndex = json.findIndex(data => (Date.now() - parseInt(data.timestamp)) < daysToMs(deleteLogsOlderThan));
        let logsToWrite;
        if (expiredIndex != -1) {
            logsToWrite = [];
            for (++expiredIndex; expiredIndex < json.length; ++expiredIndex) {
                const data = json[expiredIndex];
                if (isDataFresh(data))
                    logsToWrite.push(data);
            }
            logsToWrite.push(newData[0]);
        }
        else {
            csvWriterOptions.append = true;
            logsToWrite = newData;
        }

        await createCsvWriter(csvWriterOptions).writeRecords(logsToWrite);
        console.log("Logged", logsToWrite);
    }
    catch (error) {
        console.error(error);
    }
};

const job = new CronJob('0 * * * *', check, null, true, 'America/Los_Angeles');
job.start();
if (sendAtStart)
    check();
console.log("Job started!");
