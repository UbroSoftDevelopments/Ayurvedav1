const ccav = require('./config/ccavutil.js');
const qs = require('querystring');
const config = require("./config");


exports.postReq = async function (request, response) {
    var body = '',
        workingKey = '32C0116955567B09439F073D701B23C7',		//Put in the 32-Bit key shared by CCAvenues.
        accessCode = 'AVBN45LA89AH01NBHA',		//Put in the access code shared by CCAvenues.
        encRequest = '',
        formbody = '';
    merchantId = config.merchantId;


    request.on('data', function (data) {
        body += data;
        encRequest = ccav.encrypt(body, workingKey);
        POST = qs.parse(body);
        formbody = '<html><head><title>Sub-merchant checkout page</title><script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script></head><body><center><!-- width required mininmum 482px --><iframe  width="482" height="500" scrolling="No" frameborder="0"  id="paymentFrame" src="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=' + merchantId + '&encRequest=' + encRequest + '&access_code=' + accessCode + '"></iframe></center><script type="text/javascript">$(document).ready(function(){$("iframe#paymentFrame").load(function() {window.addEventListener("message", function(e) {$("#paymentFrame").css("height",e.data["newHeight"]+"px"); }, false);}); });</script></body></html>';
    });

    request.on('end', function () {
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(formbody);
        response.end();
    });
    return;
};

/*
merchant_id: 2305324
order_id: 
currency: INR
amount: 1.00
redirect_url: https://portal.pratyakshayurveda.in/ccavRequestHandler
cancel_url: https://pratyakshayurveda.in/#/cart
language: EN
billing_name: Peter
merchant_param1: additional Info.
customer_identifier: 

*/