//GET /quizes/question
exports.question = funstion(req,res) {
	res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

//GET /quizes/answer
exports.answer = function(req,res) {
	if (req.query.respuesta === 'Roma'){
	  res.render('quizes/answer', {respuesta: 'Correcto' });
	} else {
	  res.render('quiz/answer', {respuesta: 'Incorrecto'});
	}
};