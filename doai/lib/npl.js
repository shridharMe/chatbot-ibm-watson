var NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');



var NPL = function Constructor() {
  console.log("NPL");
};

module.exports = NPL;

var npl = new NaturalLanguageClassifierV1({
  username: process.env['NPL_USERNAME'],
  password: process.env['NPL_PASSWORD']
});


var param={	
			text: '',
			classifier_id: process.env['NPL_CLASSIFIER_ID']
		  }

NPL.prototype.classifyNPL= function (message,status){
		param.text=message
		npl.classify(param, function(err, response) {
			
		    if (err)
		      console.log('error:', err);
		    else{
		    	
		    	status(response);		    
		    }
		      
		});

}
