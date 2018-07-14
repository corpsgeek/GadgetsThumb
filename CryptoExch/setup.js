fetch('https://api.coinmarketcap.com/v2/listings/')
.then(function(response) {
  return response.json();
})
.then(function(myJson) {
    let coins = myJson.data;
    for(var i = 0; i < 250; i++) {
        var hashedCoins = coins[i];
        document.getElementById('list1').innerHTML += (`<option value="${hashedCoins.symbol}">${hashedCoins.name}</option>`);
        document.getElementById('list2').innerHTML += (`<option value="${hashedCoins.symbol}">${hashedCoins.name}</option>`);
        
    } 
});

function convertCrypto(){
 alert('Processing!!');
    let fromSymbol = document.getElementById('list1').value;
 let toSymbol = document.getElementById('list2').value;
 let convertingAmount = document.getElementById('amount').value;

 
 let y = 'toSymbol';
 fetch(`https://min-api.cryptocompare.com/data/price?fsym=${fromSymbol}&tsyms=${toSymbol}`)
 .then(function(response) {
   return response.json();
 })
 .then(function(results) {
    let rate = results;
    for(let val in rate){
        let conversionRate = rate[val];
        //calculation process
        let conversionResults = convertingAmount * conversionRate;
        document.getElementById('results').value = conversionResults;
       
    }
     
 });
}

//News implementation
fetch('https://newsapi.org/v2/everything?q=crypto&language=en&apiKey=2a6df0e098064a59888d5887b2ed9b6e')
.then(function(response) {
  return response.json();
})
.then(function(results){
    let news = results.articles;
    
    for(let i = 3; i <= 6; i++ ){
        let hashedNews = news[i];
        

            document.getElementById('postLand').innerHTML += `<div class="cul-4">
            <div class="card" >
                    <img class="card-img-top" src="${hashedNews.urlToImage}" alt="Post-Image">
                    <div class="card-body">
                      <h5 class="card-title">${hashedNews.title}</h5>
                      <p class="card-text">${hashedNews.description}.</p>
                      <a href="${hashedNews.url}" class="btn btn-primary">Read More</a>
                    </div>
                  </div>
    </div>`;
        
    }
});
//News implementation
fetch('https://newsapi.org/v2/everything?q=blockchain&language=en&apiKey=2a6df0e098064a59888d5887b2ed9b6e')
.then(function(response) {
  return response.json();
})
.then(function(results){
    let news = results.articles;
    
    for(let i = 4; i <= 5; i++ ){
        let hashedNews = news[i];
        

            document.getElementById('postLand').innerHTML += `<div class="cul-4">
            <div class="card" >
                    <img class="card-img-top" src="${hashedNews.urlToImage}" alt="Post-Image">
                    <div class="card-body">
                      <h5 class="card-title">${hashedNews.title}</h5>
                      <p class="card-text">${hashedNews.description}.</p>
                      <a href="${hashedNews.url}" class="btn btn-primary">Read More</a>
                    </div>
                  </div>
    </div>`;
        
    }
});
