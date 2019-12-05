$(document).ready(function() {
    $('form[name=inputForm]').submit(function(e) {
        e.preventDefault();

        $("#resultContainer").show();
        $("#resultText").text("");
        $("#loadWrap").show();

        $("html, body").stop().animate({
					scrollTop : $("#resultContainer").offset().top
					}, 200);

        acid = $("#sugar").slider('values')[0]
        sugar20 = $("#sugar").slider('values')[1] - acid
        sugar25 = 100 - acid - sugar20

        inputData = {
          storm: $("#storm").slider('value') / 100,
          botrytis: $("#botrytis").slider('value') / 100,
          acid: acid / 100,
          sugar20: sugar20 / 100,
          sugar25: sugar25 / 100,

          rb: Math.round(Math.exp($("#rb").slider('value') / 1000)),
          rc: Math.round(Math.exp($("#rc").slider('value') / 1000)),
          dc: Math.round(Math.exp($("#dc").slider('value') / 1000)),
          sc: Math.round(Math.exp($("#sc").slider('value') / 1000)),
        }

        console.log(inputData)

        // making sure we keep the default values...
        if (inputData.rb == 149941)
          inputData.rb = 150000
        if (inputData.rc == 249946)
          inputData.rc = 250000
        if (inputData.sc == 9997)
          inputData.sc = 10000


        $.ajax({
          type: "POST",
          url: "http://34.238.45.61:8080/go",
          data: JSON.stringify(inputData),
          dataType: "json",
        }).always(function(response) {
          if (response.status == 200) {
        		$("#resultText").html(response.responseText);
          } else {
        		$("#resultText").text("An error occurred, please try again");
          }
          console.log(response)
          $("#loadWrap").hide();
        })
    });
});

function updateSliderProb(event, ui) {
  value = Math.round(ui.value)
  $("#" + ui.handle.parentNode.id + "-val").text(value + '%')
}

function updateSliderMultiProb(event, ui) {
  value0 = ui.values[0]
  value1 = ui.values[1] - value0
  value2 = 100 - value0 - value1

  value0 = Math.round(value0)
  value1 = Math.round(value1)
  value2 = Math.round(value2)

  $('#' + ui.handle.parentNode.id + "-val").text(value0 + "% chance of acid dropping, " + value1 + "% chance of 20% sugar, " + value2 + "% chance of 25% sugar")
}

function updateSliderMoney(event, ui) {
  moneyFormatter = new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'USD',
  })

  value = Math.round(Math.exp(ui.value / 1000))
  $("#" + ui.handle.parentNode.id + "-val").text(moneyFormatter.format(value))
}

$('#storm').slider({
	orientation: "horizontal",
	range: 'min',
	min:0,
	max:100,
	value: 67,
	slide: updateSliderProb,
})

$('#botrytis').slider({
	orientation: "horizontal",
	range: 'min',
	min: 0,
	max: 100,
	value: 40,
	slide: updateSliderProb,
})

$("#sugar").slider({
	orientation: "horizontal",
	range: true,
	min: 0,
	max: 100,
	values: [20, 60],
	slide: updateSliderMultiProb,
});

$("#rb").slider({
	orientation: "horizontal",
	range:"min",
	min:0,
	max:Math.log(1000000) * 1000,
	value:Math.log(150000) * 1000,
	slide: updateSliderMoney,
});

$("#rc").slider({
	orientation: "horizontal",
	range:"min",
	min:0,
	max:Math.log(1000000) * 1000,
	value:Math.log(250000) * 1000,
	slide: updateSliderMoney,
});

$("#dc").slider({
	orientation: "horizontal",
	range:"min",
	min:0,
	max:Math.log(1000000) * 1000,
	value:Math.log(1000) * 1000,
	slide: updateSliderMoney,
});

$("#sc").slider({
	orientation: "horizontal",
	range:"min",
	min:0,
	max:Math.log(1000000) * 1000,
	value:Math.log(10000) * 1000,
	slide: updateSliderMoney,
});
