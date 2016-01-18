

var mongoose = require('mongoose');
//var notify = require('../mailer');

var Schema = mongoose.Schema;



var songSchema = new Schema({
  title: String,
  user: { type : Schema.ObjectId, ref : 'User'},
  comments: [{
    body: String,
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }],
  createdAt  : { type : Date, default : Date.now }
});


/*
sharedSchema.methods.addComment= function (user, comment) {
    this.comments.push({
      user: user._id
    });
    if (!this.user.email) this.user.email = 'email@mail.com';
    notify.comment({
      song: this,
      currentUser: user,
      comment: comment.body
    });
    return this.save();
  };

sharedSchema.methods.removeComment= function (commentId) {
    const index = this.comments.map(comment => comment.id).indexOf(commentId);

    if (~index) this.comments.splice(index, 1);
    else throw new Error('Comment not found');
    return this.save();
  };
*/
module.exports = mongoose.model('Song', songSchema);
