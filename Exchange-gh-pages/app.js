//App backend implementation
//Database variable
let dbPromise;
window.addEventListener('load', () => {
  //Initializing  and installing service worker for  check.
 if ('serviceWorker' in navigator) {
  
    navigator.serviceWorker
      .register('sw.js', { scope: '/Exchange/' })
      .then(registration => {
        console.log("Service Worker Registered");
      })
      .catch(err => {
        console.log("Service Worker Failed to Register", err);
      })
  
}
//Fetching currencies from api.
  fetch('https://free.currencyconverterapi.com/api/v5/currencies')
   .then(response => response.json())
   .then(myJson => {
     const currency = myJson.results;
     //looping through the currency and psuhing item to the option tag of select lists.
     for(let key in currency){
         document.getElementById("lists1").innerHTML += (`<option value = "${currency[key].id}">(${currency[key].currencySymbol})${currency[key].id} - ${currency[key].currencyName}</option>`)
        
     }
     for(let list in currency){
         document.getElementById("lists2").innerHTML += (`<option value = "${currency[list].id}">(${currency[list].currencySymbol})${currency[list].id} - ${currency[list].currencyName}</option>`)
        
     }
     //Created database for currency conversion.
     dbPromise = idb.open('converter-DB', 2, upgradeDB => {
     switch(upgradeDB.oldVersion){
       case 0: 
        upgradeDB.createObjectStore('exchangeRate', {keyPath: 'id'});
      case 1: 
        const currDb =  upgradeDB.createObjectStore('currenciesName');

      }
     });
     //Stroing currencies name and id in the database.
     dbPromise.then(db => {
      const transaction =  db.transaction('currenciesName', 'readwrite');
      currDb = transaction.objectStore('currenciesName');
      for(let i in currency){
       currDb.put(`${currency[i].currencyName}`, `${currency[i].currencySymbol}`);
     }
     }).catch(db =>{
       //fetching currencies when offline.
    db.transaction('currenciesName').objectStore('currenciesName').getAll().then(allCurr => {
      console.log(allCurr);
      
    });
     });
    
    });
 });






//Retrieving the value of selected currencies in the dropdown select lists. 
 let selectedValueOfList1 = 0;
 let selectedValueOfList2 = 0;
 function processList1(){
     //Storing currency value for first lists.
      selectedValueOfList1 = document.getElementById("lists1").value;
  
     console.log(selectedValueOfList1);
 }
 
 function processList2(){
     //Storing currency value for second lists.
      selectedValueOfList2 = document.getElementById("lists2").value;
     
 }
 let conversionValue = 0;


 //Method for conversion on button click.
 function conversion(){
 
//Fetching data from the page, from currency id - to currency id and amount to convert.
 let from = document.getElementById("lists1").value;
 let to = document.getElementById("lists2").value;
 let amount = document.getElementById("input-box").value;
 
 //Using json parse ajax to fetch currency rates on convert while connected to the internet.
 if(from.length >= 0 && to.length >= 0 && amount.length >= 0){
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    //Check if there is internet connection.
      if (this.readyState == 4 && this.status == 200) {
          let obj = JSON.parse(this.responseText);
          
          //stores the currency id  format in obj2.
          let obj2 = `${from}_${to}`;

         //Stores the rate of the currency id
          let rate = obj[obj2].val;
          
          //Sets the exchange rate in a input field
          document.getElementById("rates-box").value = rate;
 
          if(rate != undefined){
              //converting the inputed amount
              let convertedAmount =  parseFloat(amount * rate);    
              document.getElementById("results-box").value = convertedAmount;
              
             }
             //Storing currencies and rates used while online in the database.
             dbPromise.then(db => {
              const tx = db.transaction('exchangeRate', 'readwrite');
              const exchangeRateStore = tx.objectStore('exchangeRate');
              exchangeRateStore.put({
                rate,
                id: obj2
              });
              return tx.complete;
              return rate;
             }).catch(db => {
               if(!Exchange_Rate){
                window.alert("Cannot convert this currencies offline");
               }
             });
             
        }
        if (this.readyState !== 4 && this.status !== 200) {
          //While there is no internet connection convert offline by fetching used rates from db.
          dbPromise.then(db => {
            //strong currency id in obj2 e.g USD_FRK.
            let obj2 = `${from}_${to}`;

            const rates = db.transaction('exchangeRate').objectStore('exchangeRate');
            rates.get(obj2).then(rateStored => {
              
               let offlineRate = rateStored.rate;
               //Sets the exchange rate in a input field
               document.getElementById("rates-box").value = offlineRate;
      
               if(offlineRate != undefined){
                   //converting the inputed amount while offline.
                    convertedAmount =  parseFloat(amount * offlineRate);       
                   document.getElementById("results-box").value = convertedAmount;
                   
                  }
            }).catch(rateStored =>{
              console.log('Rate not found in database');
            });
         
          });
         }
     }
 
  xmlhttp.open("GET", `https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=y`, true);
  xmlhttp.send();
     }

 }