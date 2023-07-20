let setupTestDB = require('../../../../../../tests/utils/setupTestDB');
let paginate = require('../../../../../../src/models/plugins/paginate.plugin');

const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project'
});
projectSchema.plugin(paginate);
const Project = mongoose.model('Project', projectSchema);
const taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Project',
    required: true
  }
});
taskSchema.plugin(paginate);
const Task = mongoose.model('Task', taskSchema);
setupTestDB();
describe('paginate plugin', () => {
  describe('populate option', () => {
    test('should populate the specified data fields', async () => {
      const project = await Project.create({
        name: 'Project One'
      });
      const task = await Task.create({
        name: 'Task One',
        project: project._id
      });
      const taskPages = await Task.paginate({
        _id: task._id
      }, {
        populate: 'project'
      });
      expect(taskPages.results[0].project).toHaveProperty('_id', project._id);
    });
    test('should populate nested fields', async () => {
      const project = await Project.create({
        name: 'Project One'
      });
      const task = await Task.create({
        name: 'Task One',
        project: project._id
      });
      const projectPages = await Project.paginate({
        _id: project._id
      }, {
        populate: 'tasks.project'
      });
      const {
        tasks
      } = projectPages.results[0];
      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toHaveProperty('_id', task._id);
      expect(tasks[0].project).toHaveProperty('_id', project._id);
    });
  });
});

// Expanded tests using Pythagora:
describe('paginate plugin extended tests', () => {
  describe('limit and page options', () => {
    beforeEach(async () => {
      for(let i=0; i<5; i++){
        await Project.create({ name: 'Project ' + i });
      }
    });

    test('should return a limited amount of project', async () => {
      const projectPages = await Project.paginate({}, { limit: 2 });
      expect(projectPages.results).toHaveLength(2);
    });

    test('should correctly manage the pages', async () => {
      const firstPage = await Project.paginate({}, { limit: 2, page: 1 });
      const secondPage = await Project.paginate({}, { limit: 2, page: 2 });
      expect(firstPage.results[0]._id).not.toEqual(secondPage.results[0]._id);
    });

    test('should correctly count the total number of pages', async () => {
      const projects = await Project.paginate({}, { limit: 2, page: 2 });
      expect(projects.totalPages).toBe(3);
    });

    test('should correctly count the total number of project', async () => {
      const projects = await Project.paginate({}, { limit: 2, page: 2 });
      expect(projects.totalResults).toBe(5);
    });
  });
});