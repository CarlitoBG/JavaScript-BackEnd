const models = require('../models');
const { validationResult } = require('express-validator');
const config = require('../config/config');

module.exports = {
  get: {
    create: function (req, res) {
      const { user } = req;
      const hbsObject = {
        pageTitle: 'Create Course',
        isLoggedIn: true,
        username: user.username
      };
      res.render('createCourse.hbs', hbsObject);
    },
    details: function (req, res, next) {
      const { courseId } = req.params;
     
      models.courseModel.findById(courseId).lean().then((course) => {
        const hbsObject = {
          pageTitle: 'Course Details',
          isCreator: req.user._id.equals(course.creator),
          isLoggedIn: req.cookies[config.cookie] !== undefined,
          isAlreadyEnrolled: course.users.some(user => user.equals(req.user._id)),
          username: req.user.username,
          course
        };
        res.render('courseDetails.hbs', hbsObject);
      }).catch(next);
    },
    edit: function (req, res, next) {
      const { courseId } = req.params;
      const user = req.user;
      models.courseModel.findOne({ _id: courseId, creator: user._id }).lean().then(course => {
        const hbsObject = {
          pageTitle: 'Edit Course',
          isLoggedIn: req.cookies[config.cookie] !== undefined,
          username: user.username,
          course
      };
        res.render('editCourse.hbs', hbsObject);
      }).catch(next);
    },
    delete: function (req, res, next) {
      const { courseId } = req.params;
    
      models.courseModel.findByIdAndRemove(courseId).then(() => {
        res.redirect('/home/')
      }).catch(next);
    },
    enroll: function(req, res, next) {
      const { courseId } = req.params;
      const user = req.user;

      Promise.all([
        models.courseModel.updateOne({ _id: courseId }, { $push: { users: user._id }}),
        models.userModel.updateOne({ _id: user._id}, { $push: { courses: courseId }})
      ]).then(() => {
        res.redirect(`/course/details/${courseId}`);
      }).catch(next);
    }
  },
  post: {
    create: function (req, res, next) {
      const { title, description, imageUrl, isPublic } = req.body;
      const userId = req.user._id;
      const isChecked = isPublic === 'on';

      const errors = validationResult(req);
      if(!errors.isEmpty()){
          return res.render('createCourse.hbs', {
            message: errors.array()[0].msg,
            oldInput: req.body
          })
      }

      models.courseModel.create({ title, description, imageUrl, isPublic: isChecked, createdAt: Date.now(), creator: userId })
      .then(() => {
        res.redirect('/home/');
      }).catch(next);
    },
    edit: function (req, res, next) {
      const { title, description, imageUrl, isPublic } = req.body;
      const { courseId } = req.params;
      const isChecked = isPublic === 'on';

      const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.render('editCourse.hbs', {
              message: errors.array()[0].msg,
              isLoggedIn: req.cookies[config.cookie] !== undefined,
              username: req.user.username,
              isCoursePublic: isChecked,
              oldInput: req.body
          })
        }

      models.courseModel.findByIdAndUpdate(courseId, { title, description, imageUrl, isPublic: isChecked}).then(() => {
        res.redirect(`/course/details/${courseId}`);
      }).catch(next);
    }
  }
};