module.exports = {
    disallowedRatings: "explicit questionable", // The rating you want to exclude. "General" rating is used by Gelbooru to define the SFW posts, but other boorus might use the "safe" rating instead.
    site: "gelbooru", // The website you want to send pictures from.
    allowedTagsFile: "allowed_tags.txt", // The file containing the tags you want to include in the search. The code will pick a random tag instead of using all the tags at once.
    disallowedTagsFile: "disallowed_tags.txt", // The file containing the tags you want to exclude from all the searches.

    logToFile: "logs.csv", // The file you want to log every post that was sent. Use "logToFile: false" if you don't want to log it.
    deleteLogsOlderThan: 7, // Days
    preventDuplicates: true, // If enabled the code will reject any posts that already had been sent and will try sending another post (notice: the logging must be enabled for this feature to work)

    sendAtStart: false, // If you want to send the post when the script starts and then every hour at minute zero (true) or only every hour at minute zero (false).
}