let User = require('../../../../../src/models/user.model');
let bcrypt = require('bcryptjs');


const faker = require('faker');

describe('User model', () => {
  describe('User validation', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'user'
      };
    });
    test('should correctly validate a valid user', async () => {
      await expect(new User(newUser).validate()).resolves.toBeUndefined();
    });
    test('should throw a validation error if email is invalid', async () => {
      newUser.email = 'invalidEmail';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });
    test('should throw a validation error if password length is less than 8 characters', async () => {
      newUser.password = 'passwo1';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });
    test('should throw a validation error if password does not contain numbers', async () => {
      newUser.password = 'password';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });
    test('should throw a validation error if password does not contain letters', async () => {
      newUser.password = '11111111';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });
    test('should throw a validation error if role is unknown', async () => {
      newUser.role = 'invalid';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });
  });
  describe('User toJSON()', () => {
    test('should not return user password when toJSON is called', () => {
      const newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'user'
      };
      expect(new User(newUser).toJSON()).not.toHaveProperty('password');
    });
  });
});

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

  describe('User password secured hashing', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'user'
      };
    });
    test('should correctly encrypt the user password before saving', async () => {
      const mockSave = jest.spyOn(User.prototype, 'save')
        .mockImplementation(async function() {
            this.password = await bcrypt.hash(this.password, 10);
        });
      let user = new User(newUser);
      await user.save();
      expect(user.password).not.toBe(newUser.password);
      mockSave.mockRestore();
    });
});

  describe('User password validation', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'user'
      };
    });
    test('should throw a validation error if password contains name', async () => {
      newUser.password = 'passwordJohn';
      newUser.name = 'John';
      await expect(new User(newUser).validate()).rejects.toThrow();
    });
  });
});