const rating = "general"; // The rating you want to use. "General" rating is used by Gelbooru to define the SFW posts, but other boorus might use the "safe" rating instead.
const site = "gelbooru"; // The website you want to send pictures from.
const allowedTagsFile = "allowed_tags.txt"; // The file containing the tags you want to include in the search. The code will pick a random tag instead of using all the tags at once.
const disallowedTagsFile = "disallowed_tags.txt"; // The file containing the tags you want to exclude from all the searches.

const logToFile = "logs.csv"; // The file you want to log every post that was sent. Use "var logToFile = false" if you don't want to log it.
const deleteLogsOlderThan = 7; // Days

const sendAtStart = false; // If you want to send the post when the script starts and then every hour at minute zero (true) or only every hour at minute zero (false).
