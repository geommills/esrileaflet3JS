function sendemail() {
    var body = "";
    $.ajax({
      url:"/sendEmail?body=" + encodeURI(body), 
      success:function(data) {
        alert(data);
      }
   });
}