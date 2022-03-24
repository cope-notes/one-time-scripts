var Sentiment = require('sentiment');

console.log(getSentiment("Loved “A life with highs is one with lows. The alternative is not feeling anything at all. Even though it hurts sometimes, being alive is way better than being numb.”"));

function getSentiment(text) {    
    let reactionWords = ["loved", "liked", "emphasized"]
    try {        
        var sentChecker = new Sentiment();
        var result = sentChecker.analyze(text);
        let sentiment = null;
        //console.log(result);
        if(result && result.tokens && result.tokens.length > 0 ){
            //if the first token is a reaction word, then its a positive sentiment
            if(reactionWords.indexOf(result.tokens[0].toLowerCase()) > -1){
                console.log("reaction reply!")
                return "positive";
            }
            else{
                console.log("regular reply!")
            }
        }
        if(result.comparative >= 0.05){
            return "positive";
        }
        else if(result.comparative <= -0.05){
            return "negative";
        }
        return sentiment;        
    }
    catch (err) {
        console.error(new Error(`sentiment check Webhook Error: ${err}`))
        return null;
    }
}