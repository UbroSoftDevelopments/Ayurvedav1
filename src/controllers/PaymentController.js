const db = require("../models");
const ccav = require("../config/ccavutil.js");
const crypto = require('crypto');
const qs = require('querystring');

const workingKey = '89BF359848408F6C6B67260129E9FA4F';
const accessCode = 'AVAW49KD18AW68WAWA';

//Generate Md5 hash for the key and then convert in base64 string
const md5 = crypto.createHash('md5').update(workingKey).digest();
const keyBase64 = Buffer.from(md5).toString('base64');
//Initializing Vector and then convert in base64 string
const ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]).toString('base64');

class PaymentController {


    /* PaymentController */

   async requestPayment(request, res) {

        try {
            console.log('Request '+ request.body)
            console.log('Request '+ request.body.merchant_id +'  access_code=' + accessCode )
            var body;
            var encRequest = '',
                formbody = '';

            
           await request.on('data', function (data) {

                console.log("Data", data)
                body += data;
                encRequest = ccav.encrypt(body, keyBase64, ivBase64);
                let POST = qs.parse(body);
                formbody = '<html><head><title>Sub-merchant checkout page</title><script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script></head><body><center><!-- width required mininmum 482px --><iframe  width="482" height="500" scrolling="No" frameborder="0"  id="paymentFrame" src="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=' + POST.merchant_id + '&encRequest=' + encRequest + '&access_code=' + accessCode + '"></iframe></center><script type="text/javascript">$(document).ready(function(){$("iframe#paymentFrame").load(function() {window.addEventListener("message", function(e) {$("#paymentFrame").css("height",e.data["newHeight"]+"px"); }, false);}); });</script></body></html>';
                //Live
                //formbody = '<html><head><title>Sub-merchant checkout page</title><script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script></head><body><center><!-- width required mininmum 482px --><iframe  width="482" height="500" scrolling="No" frameborder="0"  id="paymentFrame" src="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id='+POST.merchant_id+'&encRequest='+encRequest+'&access_code='+accessCode+'"></iframe></center><script type="text/javascript">$(document).ready(function(){$("iframe#paymentFrame").load(function() {window.addEventListener("message", function(e) {$("#paymentFrame").css("height",e.data["newHeight"]+"px"); }, false);}); });</script></body></html>';
            });

           await request.on('end', function () {
            console.log("end")
                // res.writeHeader(200, { "Content-Type": "text/html" });
                res.write(formbody);
                res.end();
            });

            // res.writeHeader(200, { "Content-Type": "text/html" });
            // res.write('<html><head><title>Sub-merchant checkout page</title></head><body><h1>Request On Data Not working</h1></body></html>');
            // res.end();

        } catch (err) {
            res.writeHeader(200, { "Content-Type": "text/html" });
            res.write('<html><head><title>Sub-merchant checkout page</title></head><body><h1>Something went wrong</h1><p>'+err+'</p></body></html>');
            res.end();
        }
    }

    async responsePayment(request, res) {

        try {
            var ccavEncResponse = '',
                ccavResponse = '',
                ccavPOST = '';

           request.on('data', function (data) {
                ccavEncResponse += data;
                ccavPOST = qs.parse(ccavEncResponse);
                var encryption = ccavPOST.encResp;
                ccavResponse = ccav.decrypt(encryption, keyBase64, ivBase64);
            });

            request.on('end', function () {
                var pData = '';
                pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>'
                pData = pData + ccavResponse.replace(/=/gi, '</td><td>')
                pData = pData.replace(/&/gi, '</td></tr><tr><td>')
                pData = pData + '</td></tr></table>'
                htmlcode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>' + pData + '</center><br></body></html>';

                res.writeHeader(200, { "Content-Type": "text/html" });
                res.write(htmlcode);
                res.end();
            });


        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

}

module.exports = PaymentController;