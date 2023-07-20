let toJSON = require('../../../../../../src/models/plugins/toJSON.plugin');

const mongoose = require('mongoose');

describe('toJSON plugin', () => {
  let connection;
  beforeEach(() => {
    connection = mongoose.createConnection();
  });
  it('should replace _id with id', () => {
    const schema = mongoose.Schema();
    schema.plugin(toJSON);
    const Model = connection.model('Model', schema);
    const doc = new Model();
    expect(doc.toJSON()).not.toHaveProperty('_id');
    expect(doc.toJSON()).toHaveProperty('id', doc._id.toString());
  });
  it('should remove __v', () => {
    const schema = mongoose.Schema();
    schema.plugin(toJSON);
    const Model = connection.model('Model', schema);
    const doc = new Model();
    expect(doc.toJSON()).not.toHaveProperty('__v');
  });
  it('should remove createdAt and updatedAt', () => {
    const schema = mongoose.Schema({}, {
      timestamps: true
    });
    schema.plugin(toJSON);
    const Model = connection.model('Model', schema);
    const doc = new Model();
    expect(doc.toJSON()).not.toHaveProperty('createdAt');
    expect(doc.toJSON()).not.toHaveProperty('updatedAt');
  });
  it('should remove any path set as private', () => {
    const schema = mongoose.Schema({
      public: {
        type: String
      },
      private: {
        type: String,
        private: true
      }
    });
    schema.plugin(toJSON);
    const Model = connection.model('Model', schema);
    const doc = new Model({
      public: 'some public value',
      private: 'some private value'
    });
    expect(doc.toJSON()).not.toHaveProperty('private');
    expect(doc.toJSON()).toHaveProperty('public');
  });
  it('should remove any nested paths set as private', () => {
    const schema = mongoose.Schema({
      public: {
        type: String
      },
      nested: {
        private: {
          type: String,
          private: true
        }
      }
    });
    schema.plugin(toJSON);
    const Model = connection.model('Model', schema);
    const doc = new Model({
      public: 'some public value',
      nested: {
        private: 'some nested private value'
      }
    });
    expect(doc.toJSON()).not.toHaveProperty('nested.private');
    expect(doc.toJSON()).toHaveProperty('public');
  });
  it('should also call the schema toJSON transform function', () => {
    const schema = mongoose.Schema({
      public: {
        type: String
      },
      private: {
        type: String
      }
    }, {
      toJSON: {
        transform: (doc, ret) => {
          // eslint-disable-next-line no-param-reassign
          delete ret.private;
        }
      }
    });
    schema.plugin(toJSON);
    const Model = connection.model('Model', schema);
    const doc = new Model({
      public: 'some public value',
      private: 'some private value'
    });
    expect(doc.toJSON()).not.toHaveProperty('private');
    expect(doc.toJSON()).toHaveProperty('public');
  });
});

// Expanded tests using Pythagora:
describe('Extended toJSON plugin tests', () => {
  let connection;
  beforeEach(() => {
    connection = mongoose.createConnection();
  });
  it('should handle empty documents', () => {
    const schema = mongoose.Schema();
    schema.plugin(toJSON);
    const Model = connection.model('Model', schema);
    const doc = new Model();
    const json = doc.toJSON();
    expect(json).toEqual({id: json.id});
  });
  it('should not replace provided id', () => {
    const Model = connection.model('Model', mongoose.Schema());
    const doc = new Model({ _id: mongoose.Types.ObjectId() });
    const json = doc.toJSON();
    expect(json._id.toString()).toEqual(doc._id.toString());
});
  
  it('should remove private properties on deep nested paths', () => {
    const schema = mongoose.Schema({
      public: {
        type: String
      },
      nested: {
        deeply: {
          veryDeeply: {
            private: {
              type: String,
              private: true
            },
          }
        }
      }
    });
    schema.plugin(toJSON);
    const Model = connection.model('Model', schema);
    const doc = new Model({
      public: 'some public value',
      nested: {
        deeply: {
          veryDeeply: {
            private: 'should not be visible',
          }
        }
      }
    });
    expect(doc.toJSON()).not.toHaveProperty('nested.deeply.veryDeeply.private');
    expect(doc.toJSON()).toHaveProperty('public');
  });
  it('should remove multiple private properties', () => {
    const schema = mongoose.Schema({
      public: {
        type: String
      },
      privateOne: {
        type: String,
        private: true
      },
      privateTwo: {
        type: String,
        private: true
      }
    });
    schema.plugin(toJSON);
    const Model = connection.model('Model', schema);
    const doc = new Model({
      public: 'visible',
      privateOne: 'hidden',
      privateTwo: 'also hidden',
    });
    const json = doc.toJSON();
    expect(json).not.toHaveProperty('privateOne');
    expect(json).not.toHaveProperty('privateTwo');
    expect(json).toHaveProperty('public', 'visible');
  });
});