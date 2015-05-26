var models = require('../models/models.js');

// MW que permite acciones solamente si el quiz al que pertenece el comentario objeto pertenece al usuario logeado o si es cuenta admin
exports.ownershipRequired = function(req, res, next){
   models.Quiz.find({
          where: {
             id: Number(req.comment.QuizId)
          }
      }).then(function(quiz) {
      if (quiz) {
           var objQuizOwner = quiz.UserId;
	         var logUser = req.session.user.id;
	         var isAdmin = req.session.user.isAdmin;

           console.log(objQuizOwner, logUser, isAdmin);

           if (isAdmin || objQuizOwner === logUser) {
              next();
           } else {
                res.redirect('/');
           }
       } else{next(new Error('No existe quizId=' + quizId))}
      }
    ).catch(function(error){next(error)});
};

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId){
  models.Comment.find({
          where: {
             id: Number(commentId)
           }
        }).then(function(comment) {
       if (comment) {
         req.comment = comment;
         next();
        } else {next(new Error('No existe commentId=' + commentId))}
      }
    ).catch(function(error){next(error)});
};
 
// GET /quizes/:quizId/comments/new
exports.new = function(req, res){
  res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

//POST /quizes/:quizId/comments
exports.create = function(req, res){
   var comment = models.Comment.build(
      { texto: req.body.comment.texto, 
        QuizId: req.params.quizId 
        });
   
    comment
    .validate()
    .then(
      function(err){
       if (err) {
         res.render('comments/new.ejs', {comment: comment, errors: err.errors});
       } else {
         comment //save: guarda en DB campo texto de comment
         .save()
         .then( function(){ res.redirect('/quizes/'+req.params.quizId)})
        }    //res.redirect: Redireccion HTTP a lista de preguntas
       }
      ).catch(function(error){next(error)});

};

//GET/quizes/statistics
exports.statistics = function(req,res){
 var conComentarios = [];
 var sinComentarios;
 models.Quiz.count().then(function(quizes){
  models.Comment.findAll(
   {where:{publicado:true}}).then(function(comments){
     sinComentarios = quizes;
     for(var i=0; i<comments.length; i++){
      if(conComentarios[comments[i].QuizId] === undefined){
        sinComentarios--;
       }
      conComentarios[comments[i].QuizId]= 1;
      }
      res.render('quizes/statistics', {
         quizes: quizes,
         comentarios:comments.length,
         mediaComentarios:comments.length/quizes,
         pregSinComentarios: sinComentarios,
         pregConComentarios: quizes-sinComentarios,
         errors:[]
       });
      });
   });
};


//GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req,res) {
   req.comment.publicado = true;
 
   req.comment.save( {fields: ["publicado"]})
     .then( function(){ res.redirect('/quizes/'+req.params.quizId);})
     .catch(function(error){next(error)});
};
