# CunnyBot

CunnyBot is a cute and funny bot that sends any image from your favorite image board (booru) to your Discord webhook every hour :3

## Instalation

1. Run `npm install` to install all the required modules. All the required modules will be pulled automatically from the package.json
2. Create a ".env" file inside the root path of the project
3. Insert the text below replacing it with your own values
```python
WEBHOOK_ID=your-webhook-id-here
WEBHOOK_TOKEN=your-webhook-token-here
RATING=general
SITE=gelbooru
```
4. Create two text files, "allowed_tags.txt" and "disallowed_tags.txt" and insert your tags separated by spaces, new lines or booth in same time.
```python
# Example allowed tags:
gawr_gura murasaki_shion laplus_darknesss
uruha_rushia blue_archive hoshino_(blue_archive)
arona_(blue_archive) arisu_(blue_archive) iroha_(blue_archive)
```
```python
# Example disallowed tags:
guro vore scat gore pee scat
```
5. Execute `node index.js` to run the script

## Output

Here's a example of what it might output:<br>
![example](https://cdn.discordapp.com/attachments/759466522312704000/1084357219614728202/image.png)

You're free to modify the script to give any desired output you want, like adding embeds, modifying the schedule and everything else

## Collaboration

1. How can i collaboare?
- Just make a pull request and i will look into it c:

2. What happens after I made the pull request?
- I will regularly look at the pull requests and if I find you version is gonna it will become part of the next updates.
