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
  console.log("Starting polling service please wait for FAF trade signals");
  var marketSummary = data.result;
  var prevMarketSummary = data.result;
  setInterval(function(){
				_.forEach(marketSummary, function(obj, index){
					//console.log("Object " + obj + " Index: " + index );
					var prevObject = prevMarketSummary[index];
					
					bittrex.getticker( { market : obj.MarketName }, function( ticker ) {
						if (err || ticker == null) {
							return ;
						  }
					if(obj.ticker){
							var change = (ticker.result.Ask - obj.ticker.Ask)/ticker.result.Ask * 100;
							var diff = ticker.result.Ask - obj.ticker.Ask;
							if(change > 10 && _.startsWith(obj.MarketName, 'BTC')){
							var now = new Date();
								console.log("Ask Price changed by - " + change + "% for " + obj.MarketName + " BTC val: " + diff + " Time: " + now.getHours() + ":" + now.getMinutes());
							}
							if(ticker != null){
								obj.ticker = ticker.result;
							}
					}else{
						//For the first run we just add the object
						if(ticker != null){
							obj.ticker = ticker.result;
						}						
					}
					});
				})
		}, 600000);
});