const functions = require('firebase-functions');
var cors = require('cors')({origin: true});
const stripe = require("stripe")("sk_live_7XPPRGTzVa4yaHeUvoSMw6tF");
var GoogleSpreadsheet = require('google-spreadsheet');

 // Create and Deploy Your First Cloud Functions
 // h.ttps://firebase.google.com/docs/functions/write-firebase-functions

const serviceAccoutCred = {
                  client_email: 'ticklogger@pskeventssite.iam.gserviceaccount.com',
                  private_key: `
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBNTtxz2BCZU6r
nd8YALfdm1AgjTt48/MuushdVo+1/4hdWza4HiKn46YSimF1HN7R0hOGv16OdFys
NVORF21FX788DQcqyh/k3JG0JY5E3m9P7DtlKq55BFKrT9uUSjec1oSv+dNIjkiA
4kmgd+tFmnMQjHeVbvjc9Y15qKCAnYHc2AW2ujKdi2+xM5Lyjnml1PJPm/cIg28n
1RP8oBoQlZFiRmKL1gpkID7Ev08DsqVKLAMjJfF3WeaBxF9oYaMZYX28ZBeG2GSf
38nTOVkYe9nvHDP1SxSfelUcdE3z5OuXEOtyIk1les6pUjRByD7z0xyqRDuklDZI
wQ+d00OXAgMBAAECggEAAJstF7wJxI1WQlk+nYxilYMgLLrb0ITUv1GeJMDSmn2E
ImWDXQv1YRkhdt1Q1YO6LFh1jDlJz7ZFMNQCqynPCpC7uXisU1xuM4TkFFsbzsS6
VB55VldqqUUXXmrHcb8oToJFkC//TDLr2zM2/c8O82eQQWiJMC04kFMgOo7fYLRc
ZgPVvjyWmz5XcTLZLygOsJ6ah5O6HBsWCq1p1HaMApvw5pTVSYolfHX8eOWK1HKN
oyiVnM0KK/eWYaGzZVRs4KLR+f1TB7sfDI3QVORtaXEsQEh9IefAWGLPZARUIgqC
UViVokMk/6iJDU1KWPvkk4GvLJt2RM9G2omuctINkQKBgQD0oXC/rxrcf+qSGKLV
yC4rBjGKDW6Cv9vfn8ktVzj7N263ogIZhYz2qW+zWoaNdGTaQ/I/U4V7603XA8+s
QsoKJvhmN877BFkgdFqAJhYNkczmw7F0gKG0cL4GwC1xKjYQmnq0FF+TBreYmgil
G2A9eXIutD+K+KZQvTqQK3Gv8QKBgQDKL/nwg9rhSeShBY/qmsEPdUlMx8WsYbof
SRaLSY80GMe6mK/NKQW99msK1aAXacBfRQh0aF+Kxhq0rNIC3MVWd4ZrGu4tqhTh
G2+18r8sJZnR4lnWRogAEnV6FYTcMG6QdoSIn/TCXNpCgWhK0FXgm+DyTTYGT/Hp
pkArICK0BwKBgQDe0gXOswI2gdT5SbNYIkPbMIMDCgT01yjA4dvujpn6SJ1yagCb
moexTNfPd89DHReXr3gBsmPNYaC/DlukvhklciWjhYXkIivEYfbk7sv7hCgssWb7
hQbFQkP0Bivd/eLM8Mh/Kmd7lgy41OS27t6UYABfBhMy1BU5SYMEOm4NIQKBgAko
ExGpZwg86HXCYrolOAkTLrajdXhRFLTGApdcRXf+h00UDSIlcXUg68gZ1J4609N8
tN1QvML0JdF44invBaDc2OGQ3qiCw19Odsiuram6KjUvIxJpL0+RhnB4+QNfziIM
vAPT+qmyus+4PJjmxnzdklpm1MOEa1hBhzZsxiWRAoGAY+h9+aC0k8yvevn5JEs1
e0hZVk9TLRV13+X/vFbBxMT2jSuc+GzFkzK5iZcX8nwePOHU7ZTrSUSxBtJgWFdB
jYBpL0KGBtEuyCRvAncX74m2D/A991X0RU9sbNoDfedtcOZRwIRRWU6uNdIAlLt/
2cRZPV4X7GkXdLCkKmAchwE=
-----END PRIVATE KEY-----

`}

var baseRowObject = {
    TeamName:'',
    FirstMember:'',	
    SecondMember:'',
    Email:'',
    Phone:'',
    PayMethod:'',
    StripeCode:'',
    StripeEmail:''
}

 exports.helloWorld = functions.https.onRequest((req, res) => {
//  res.status(200).send("Hello from Firebase!");
     cors(req, res, () => {
        console.log(req.body);
        res.status(200).send("Got the Data");
      });
 });

exports.onlinePay = functions.https.onRequest((req, res) =>{
    cors(req, res, () => {
        // Set your secret key: remember to change this to your live secret key in production
        // See your keys here: https://dashboard.stripe.com/account/apikeys

        var token = req.body.stripeToken; // Using Express
        // Charge the user's card:
        var charge = stripe.charges.create({
            amount: 800,
            currency: "usd",
            description: "PSK Cornhole - Sept 13 - Sign-in\n Greek Lawn - Starts at 11:00am",
            source: token,
        }, function(err, charge) {
                if(err){
                    console.error(err);
                    res.status(200).redirect('https://ritpskevents.com/reser/error.html');
                }
                else{
                    baseRowObject.TeamName = req.body.teamName;
                    baseRowObject.FirstMember = req.body.teamMember1;
                    baseRowObject.SecondMember = req.body.teamMember2;
                    baseRowObject.Email = req.body.email;
                    baseRowObject.Phone = req.body.phone;
                    baseRowObject.PayMethod = 'Online';
                    baseRowObject.StripeEmail = req.body.stripeEmail;
                    if(charge.id){
                        baseRowObject.StripeCode = charge.id;
                    }
                    else{
                        baseRowObject.StripeCode = 'Error Paying';
                    }
                    recordRow(baseRowObject, function(result){
                        if(result){
                            res.status(200).redirect('https://ritpskevents.com/reser/success.html');    
                        }
                        else{
                            res.status(200).redirect('https://ritpskevents.com/reser/error.html');
                        }
                    })
                }
        });
    });
});

exports.eventPay = functions.https.onRequest((req, res) =>{
    cors(req, res, () => {
        baseRowObject.TeamName = req.body.teamName;
        baseRowObject.FirstMember = req.body.teamMember1;
        baseRowObject.SecondMember = req.body.teamMember2;
        baseRowObject.Email = req.body.email;
        baseRowObject.Phone = req.body.phone;
        baseRowObject.PayMethod = 'Event';
        baseRowObject.StripeEmail = 'N/A';
        recordRow(baseRowObject, function(result){
            if(result){
                res.status(200).send({trans:true});    
            }
            else{
                res.status(200).send({trans:false}); 
            }
        });
    });
});

var recordRow = function(rowObject, callback){
    var ticketDoc = new GoogleSpreadsheet("1wTsstQEMhTne1ILOE7LDwPEEBzD6PlLeUhlRakmfAn8");
    ticketDoc.useServiceAccountAuth(serviceAccoutCred, function(err, data){
        if(err){
            console.error(err);
            callback(false);
        }
        else{
            ticketDoc.getInfo(function(erro, sheetInfo){
                if(erro){
                    console.error(erro);
                    callback(false);
                }
                else{
                    ticketDoc.addRow(1, rowObject, function(er, row){
                        if(er){
                            console.error(er);
                            callback(false);
                        }
                        callback(true);
                    });
                }
            
            });                                          
        };
    }
)};
