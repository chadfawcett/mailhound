# mailhound

Mailhound is a simple server side script for receiving form posts and emailing the form values.

## Installation

### Prerequisites

1. Create an account at [Mandrill](https://mandrill.com) and make note of your api key

### Heroku Install (Free)

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/chadfawcett/mailhound)

1. Give your app a name: `blogemailsender`
2. Choose your server region: `United States`
3. Set your environment variables:
  1. **ADMIN**: Enter your email
  2. **MANDRILL_API_KEY**: Paste in your api key
4. Deploy for **Free**!

### Digital Ocean Install ([$10 Credit](http://do.chadf.ca))

1. Create a new droplet using the Node application image
2. SSH into your newly created droplet
3. Install mailhound with `npm install -g mailhound`
4. Add config variable exports to the end of your `~/.profile` file
  1. `export MANDRILL_API_KEY=your_api_key`
  2. `export KEY:name@domain.com`
5. Reconnect to SSH and run the script `mailhound`

## Usage

```html
<form method="POST" action="http://heroku.url.com?key=ADMIN">
  <input type="text" name="name" placeholder="Name">
  <input type="email" name="_replyto" placeholder="Email">
  <textarea name="message" placeholder="Message" cols="30" rows="8"></textarea>
  <input type="submit" value="Send">
</form>
```

Make sure to update the `action` url to be your Heroku app url, and the key should be `ADMIN` or a custom key that matches your config variables.

## Advanced Usage

### Custom Keys
The key associated with your email address does not have to be ADMIN. You're also not limited to only one key/email pair per server. Setting a new key/pair anywhere in the config variables, including in the `emails.json` file, will allow you to use that key in the action url of your contact form.

Let's say you want to have a newsletter signup form but you don't want the emails going to the same place as your contact form. Simply create your `email.json` file to have a key to send to your email for signing up.

```json
{
  "newsletter": "newsletter@example.com"
}
```

Now when you create your newsletter sign up form, simply use the same action url with the new key.

```html
<form method="POST" action="http://heroku.url.com?key=newsletter">
  <input type="text" name="name" placeholder="Name">
  <input type="email" name="_replyto" placeholder="Email">
  <input type="submit" value="Sign me up!">
</form>
```

### Custom Fields
You can add custom fields to be added to the end of your email message. Usefull for address, phone number, etc. All you have to do is set the input name to `_fields.` followed by a camel case sentence.

```javascript
<input type="tel" name="_fields.cellNumber">
```

The above code will result in the following appended to the end of your email message:

```
Cell number: ### ### ####
```

## Contributing

Please feel free to create an issue with any bugs you find or any improvements you would like to share. Pull requests for new features are also very welcome!

## License

This software is free to use under the MIT license. See the [LICENSE][] file fore more details.

[License]: https://github.com/chadfawcett/mailhound/blob/master/LICENSE.md
