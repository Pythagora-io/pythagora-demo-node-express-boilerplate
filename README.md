# Pythagora Demo - Node Express Boilerplate

This is a fork of the [Node Express Boilerplate](https://github.com/hagopj13/node-express-boilerplate) project in which you have **original unit tests** written by developers and examples of **additional test cases** created with Pythagora.

## Set up

To make it super easy to try out Pythagora, we've added the pythagora dependecy and script to the repo so basically you can start right away.

1. First, you need to install dependencies

```
npm install
```

2. Then, if you want to expand already existing tests cases, you can run Pythagora expand unit tests command with

```
npm run pythagora-unit-expand
```

This command will generate expanded unit tests in the folder 

```
pythagora_tests/unit/
```

Here is an example of a generated test for the User model:

```javascript
// Expanded tests using Pythagora:
describe('User Model Extended Tests', () => {
  describe('User name validation', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'user'
      };
    });
    test('should throw a validation error if name is empty', async () => {
      newUser.name = '';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });
  });
});
```

That's basically it. If you have any questions or feedback, let us know on hi@pythagora.ai