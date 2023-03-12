# CunnyBot

CunnyBot is a cute and funny bot that sends any image from your favorite image board (booru) to your Discord webhook every hour :3

## Instalation

1. Run `npm install` to install all the required modules. All the required modules will be pulled automatically from the package.json
2. Create a ".env" file inside the root path of the project
3. Insert the text below replacing it with your own values
```
WEBHOOK_ID=your-webhook-id-here
WEBHOOK_TOKEN=your-webhook-token-here
RATING=general
SITE=gelbooru
```
4. Create a "allowed_tags.txt" file and insert your tags separated by spaces, new lines or booth in same time. Example tags:
```
gawr_gura murasaki_shion laplus_darknesss
uruha_rushia blue_archive hoshino_(blue_archive)
arona_(blue_archive) arisu_(blue_archive) iroha_(blue_archive)
```
5. Create a "disallowed_tags.txt" file and insert your tags separated by spaces, new lines or booth in same time. Example tags:
```
guro vore scat gore pee scat
```
