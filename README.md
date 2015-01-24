# NodeMailForm

NodeMailForm is a simple server side script for receiving form posts and emailing the form values linked to a secret key.

## Installation

**Heroku install button coming soon!**

1. Clone repository
2. Start Heroku app
3. Deploy repo to Heroku
4. Sign up for Mandrill.com and get an API key
5. Populate 'Config Vars'
    1. Set key of first var to any secret alpha numeric key, set the value to `{ "email": "name@domain.com", "name": "Full Name" }`
    2. Set ket to `MANDRILL_API_KEY` and value to `your_mandrill_api_key`

## Usage

    <form method="POST" action="http://heroky.url.com?key=secret_key">
      <input type="text" name="name" placeholder="Name">
      <input type="email" name="_replyto" placeholder="Email">
      <textarea name="message" placeholder="Message" cols="30" rows="8"></textarea>
      <input type="submit" value="Send">
    </form>

Make sure to update the `action` url to be your Heroku app url, and the key should be the same as the `Config Var` you set above.

## Contributing

Please feel free to create an issue with any issues you find or any imporovements you would like to share. Pull requests for new features are also very welcome!

## License

This software is free to use under the MIT license. See the [LICENSE][] file fore more details.

[License]: https://github.com/chadfawcett/NodeMailForm/blob/master/LICENSE.md
