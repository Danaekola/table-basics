function createTable(arr) {
  $("table tbody").empty();
  arr.map(function(val) {

    return $("table tbody").append(
      "<tr>" + "<td>" + val.sname + "</td>" +
      "<td>" + val.English + "</td>" +
      "<td>" + val.Chinese + "</td>" +
      "<td>" + val.Math + "</td>" +

      "<td>" + '<button class="delete" value="' + val.sno + '">Delete</button></td>' + "</tr>"
    );
  });

}
$(function() {
  $("thead").on("click", "th", function() {
    var $th = $(this);
    if ($th.data("id") === "sname") {
      return;
    }
    var key = $th.data("id");
    var flag = $th.data("order");
    flag = parseInt(flag);

    $.get("/score", {
        key: key,
        flag: flag
      },
      function(resq) {
        var result = resq;
        createTable(result);
      });
  });
});
$(function() {
  $("tbody").on("click", ".delete", function() {
    var self = $(this);
    var sno = $(this).val();

    $.ajax({
      url: '/delete',
      type: 'DELETE',
      data: {
        sno: sno
      },
      success: function(resp) {

        if (resp.status === 200) {
          self.closest('tr').remove();
        }
      }
    });

  });
});

$(function() {
  $("#submit").on("click", function() {

    var name = $("#name").val();

    var English = $("#English").val();
    var Chinese = $("#Chinese").val();
    var Math = $("#Math").val();
    $.post("/add", {
        name: name,
        English: English,
        Math: Math,
        Chinese: Chinese
      },
      function(resq) {
        var result = resq;
        console.log(resq.status);
      });

  });
});
