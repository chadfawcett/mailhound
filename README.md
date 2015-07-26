# mailhound

Mailhound is a simple server side script for receiving form posts and emailing the form values to an email address linked to a secret key.

## Installation

### Heroku Install

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

1. Give your app a name: `blogemailsender`
2. Choose your server region: `United States`
3. Set your environment variables:
    1. **ADMIN**: Enter your email
    2. **MANDRILL_API_KEY**: Sign up for Mandrill and paste in your api key
4. Deploy for **Free**!

## Usage

    <form method="POST" action="http://heroku.url.com?key=ADMIN">
      <input type="text" name="name" placeholder="Name">
      <input type="email" name="_replyto" placeholder="Email">
      <textarea name="message" placeholder="Message" cols="30" rows="8"></textarea>
      <input type="submit" value="Send">
    </form>

Make sure to update the `action` url to be your Heroku app url, and the key should be `ADMIN` or a custom key that matches your config variables.

## Advanced Usage

You can add custom fields to be added to the end of your email message. Usefull for address, phone number, etc. All you have to do is set the input name to `_fields.` followed by a camel case sentence.

    <input type="tel" name="_fields.cellNumber">

The above code will result in the following appended to the end of your email message:

    Cell number: ### ### ####

## Contributing

Please feel free to create an issue with any bugs you find or any improvements you would like to share. Pull requests for new features are also very welcome!

## License

This software is free to use under the MIT license. See the [LICENSE][] file fore more details.

[License]: https://github.com/chadfawcett/mailhound/blob/master/LICENSE.md
