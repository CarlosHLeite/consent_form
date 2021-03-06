function doGet(e) {
            try {
                var output = HtmlService.createTemplateFromFile('index');
                //https://developers.google.com/apps-script/reference/html/
                var html = output.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
                return html;
            }
            catch (e) {
                return ContentService.createTextOutput(JSON.stringify({
                    'error': e
                })).setMimeType(ContentService.MimeType.JSON);
            }
        }

function getRandom() {
    return (new Date().getTime()).toString(36);
}

function addData(data) {
    Logger.log(data);
    // {agree=true, first=name, email=fsdd@ddfs.com}
    var ss = SpreadsheetApp.openById("1ASHiE5E8S-n1kFvy2O5dqlO2kwthpfpkWX1q1V0qCiM");
    //https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#openById(String)
    var sheet = ss.getSheetByName('agree');
    var user = Session.getActiveUser().getEmail();
    var createdDate = getDate();
    var newId = getRandom();
    var holder = [data.first, data.email, createdDate, newId, data.agree, user];
    sheet.appendRow(holder);
    sendAnEmail(holder);
    confirmationEmail(holder);
    return {
        'trackingid': newId
        , 'status': true
        , 'added': holder
    }
}

function confirmationEmail(holder) {
    var emailAddress = holder[5] || Session.getActiveUser().getEmail();
    var message = 'You have a new Aplication from' + holder[0];
    MailApp.sendEmail(emailAddress, "New Aplication user" + holder[0], '', {
        htmlBody: message
    });
}

function sendAnEmail(holder) {
    var emailAddress = holder[1];
    var message = '<h1>Thank you ' + holder[0] + '</h1>, <br>Thanks Agains';
    //https://developers.google.com/apps-script/reference/mail/mail-app#sendEmail(String,String,String,String)
    MailApp.sendEmail(emailAddress, "Subject Info ID#" + holder[3], '', {
        htmlBody: message
    });
}


function getDate(){
  var d = new Date();
  return d.getDate() + "-"+ (d.getMonth()+1) + "-" + d.getFullYear();
}     


<!DOCTYPE html>
<html>
 
<head>
    <base target="_top">
    <style>
        h1 {
            color: red;
        }
    </style>
</head>
 
<body>
    <h1>Hello World</h1>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
    <p>Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.</p>
    <div class="container">
        <form id="agreeTOS"> Name:
            <input type="text" name="userName">
            <br> Email:
            <input type="email" name="email">
            <br> Agree to TOS:
            <input type="checkbox" value="true" name="terms">
            <br>
            <input type="submit" name="submit" value="Submit"> </form>
    </div>
    <script>
        const myForm = document.querySelector('#agreeTOS');
        const container = document.querySelector('.container');
        //console.log(myForm);
        myForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let myData = {
                'first': this.querySelector('input[name="userName"]').value
                , 'email': this.querySelector('input[name="email"]').value
                , 'agree': this.querySelector('input[name="terms"]').checked
            , }
            google.script.run.withSuccessHandler(onSuccess).addData(myData);
            //https://developers.google.com/apps-script/guides/html/reference/run
            //console.dir(myData);
        })
 
        function onSuccess(data) {
            if (data.status) {
                container.innerHTML = '<h1>ID ' + data.trackingid + '</h1>';
            }
            console.log(data);
        }
    </script>
</body>
 
</html>