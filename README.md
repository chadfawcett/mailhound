# mailhound

Mailhound is a simple server side script for receiving form posts and emailing the form values.

## Installation

### Prerequisites

1. Create an account with a mail provider like [Mailgun](https://mailgun.com) or [Sendgrid](https://sendgrid.com) 

### Heroku Install (Free)

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/chadfawcett/mailhound)

1. Give your app a name: `blogemailsender`
2. Choose your server region: `United States`
3. Set your environment variables:
  1. **ADMIN**: Enter your email
  2. **SMTP**: Your smtp credentials
4. Deploy for **Free**!

### Digital Ocean Install ([$10 Credit](http://do.chadf.ca))

1. Create a new droplet using the Node application image
2. SSH into your newly created droplet
3. Install mailhound with `npm install -g mailhound`
4. Add config variable exports to the end of your `~/.profile` file
  1. `export SMTP=smtp://postmaster:pass@smtp.server.com`
  2. `export ADMIN=name@domain.com`
5. Reconnect to SSH and run the script `mailhound`

### Docker Install

1. Create the config file `.env` from `.env.example` with your environment variables
2. Run docker with `docker run --env-file=<path to the config file .env> -p 8000:8000 chadfawcett/mailhound`
3. Alternatively run- `docker-compose up`

## Usage

### Typical Setup

```html
<form method="POST" action="http://heroku.url.com?key=ADMIN">
  <input type="text" name="name" placeholder="Name">
  <input type="email" name="_replyto" placeholder="Email">
  <textarea name="message" placeholder="Message" cols="30" rows="8"></textarea>
  <input type="submit" value="Send">
</form>
```

Make sure to update the `action` url to be your Heroku app url, and the key should be `ADMIN` or a custom key that matches your config variables.

### Main Message

The main text message of your email. This field is usually a `<textarea>` with a `name="message"` set. This will default to '**No message was provided**' if the field is ommited.

```html
<textarea name="message"></textarea>
```

### Email Subject

This field allows you to set the subject of the email. Defaults to '**Email from mailhound**'. It is not always beneficial to allow the user to specify the subjet, in this case you can simply hide the field.

```html
<!-- User defined subject -->
<input type="text" name="_subject" />

<!-- Static subject -->
<input type="hidden" name="_subject" value="New message from my website!" />
```

### Reply To

The reply to field is meant for the user's email. It allows for simply replying to the email sent to you instead of having to copy the user's address to a new email.

```html
<!-- Basic reply to field -->
<input type="email" name="_replyto" />

<!-- Option for better auto completion -->
<input type="email" name="email" />
```

### Name

This field is simply for the emailer's name.

```html
<input type="text" name="name" />
```

### CC

This field allows you for the user to specify an address to get a cc'd copy of the form.

```html
<input type="text" name="_cc" />
```

### Redirect

By default, the script redirects to the page that sent the form. If you would like to redirect the user to a specific page after the form has been sent, simply specify the url in this hidden field.

```html
<input type="hidden" name="_next" value="http://example.com/thanks" />
```

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

### Spam Filtering
One of the downsides of having a contact form is that you will start receving lot's of spam (bots that automatically fill out forms). To combat this, mailhound supports a visually hidden field that when filled in, will silently fail. This will catch a lot of bots, keeping your inbox much cleaner.

Simply add the following to your form to prevent spam:
```html
  <input type="text" name="_gotcha" style="display: none">
```

## Contributing

Please feel free to create an issue with any bugs you find or any improvements you would like to share. Pull requests for new features are also very welcome!

## License

This software is free to use under the MIT license. See the [LICENSE][] file fore more details.

[License]: https://github.com/chadfawcett/mailhound/blob/master/LICENSE.md
