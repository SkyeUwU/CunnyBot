# CunnyBot

CunnyBot is a cute and funny bot that sends an image from your favorite image board (booru) to your Discord webhook every hour :3

## Installation

1. Run `npm install` to install all the required modules. The required modules will be pulled automatically from the `package.json`.
2. Create a `.env` file in the root path of the project.
3. Insert the following text, replacing the values with your own:
    ```python
    WEBHOOK_ID=your-webhook-id-here
    WEBHOOK_TOKEN=your-webhook-token-here
    ```
4. Create two text files, `allowed_tags.txt` and `disallowed_tags.txt`, and insert your tags separated by spaces, new lines, or both. For example:
    ```
    # Example allowed tags:
    gawr_gura murasaki_shion laplus_darknesss
    uruha_rushia blue_archive hoshino_(blue_archive)
    arona_(blue_archive) arisu_(blue_archive) iroha_(blue_archive)

    # Example disallowed tags:
    guro vore scat gore pee scat
    ```
5. Optional: edit the variables between "CONFIG VARIABLES" comment inside the `index.js` file.
6. Run `node index.js` to execute the script.

## Output

Here's an example of what the output might look like: <br>
![example output](https://cdn.discordapp.com/attachments/759466522312704000/1084357219614728202/image.png)

You're free to modify the script to customize the output, such as adding embeds, modifying the schedule, and more.

## Collaboration

### How can I collaborate?
Simply make a pull request, and I will review it. I would be more than happy to have someone improve my code, as it pretty much sucks.

### What happens after I make the pull request?
I will regularly review pull requests, and if I find that your version is suitable, it will become part of the next update.


## License

This project is licensed under the terms of the [MIT License](https://github.com/SkyeUwU/CunnyBot/blob/master/LICENSE), which allows you to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the conditions specified in the license.
