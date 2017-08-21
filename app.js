var _ = require('lodash');

var bittrex = require('node.bittrex.api');
bittrex.options({
  'apikey' : '98dac34661784a3283519eea64346efc ',
  'apisecret' : 'cbcb7caa282b4fdc961b17b77db9e147', 
});

	bittrex.getmarketsummaries( function( data, err ) {
	  if (err) {
		return console.error(err);
	  }
		var prevMarketSummary = data.result;
		
		setInterval(function(){
			bittrex.getmarketsummaries( function( data, err ) {
			  if (err) {
				return console.error(err);
				}
				var updatedMarketSummary = data.result;
				_.forEach(updatedMarketSummary, function(obj, index){
					//console.log("Object " + obj + " Index: " + index );
					var prevObject = prevMarketSummary[index];
					
					//Calculate percentage change in volume
					var diff = (obj.Volume - prevObject.Volume);
					var change = (obj.Volume - prevObject.Volume)/obj.Volume * 100;
					
					if(change > 2 && _.startsWith(obj.MarketName, 'BTC')){
						var now = new Date();
						console.log("Volume changed by - " + change + "% for " + obj.MarketName + " BTC val: " + diff + " Time: " + now.getHours() + ":" + now.getMinutes());
						bittrex.getticker( { market : obj.MarketName }, function( ticker ) {
						  console.log( ticker );
						});
					}
				})
				prevMarketSummary = updatedMarketSummary;
			})
		}, 60000);
	})