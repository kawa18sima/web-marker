let $inputText = $('.simple_color');
let $submit = $("#submit");

createHistoryButton();

function createHistoryButton(){
  let kButtonColors = [];
  chrome.storage.local.get(["marker1", "marker2", "marker3"], function(data){
    kButtonColors = [data.marker1, data.marker2, data.marker3];
    constructOptions(kButtonColors);
  });
}

function constructOptions(kButtonColors) {
  let page = document.getElementById('buttonDiv');
  for (let item of kButtonColors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      $('.simpleColorContainer').remove();
      $inputText.val(item);
      $inputText.simpleColor({livePreview: true});
    });
    page.appendChild(button);
  }
}

chrome.storage.local.get(['markerColor'], function(data){
  $inputText.val(data.markerColor);
  $inputText.simpleColor({livePreview: true});
});

$submit.on('click', function() {
  let color = $inputText.val();
  chrome.storage.local.set({markerColor: color}, function(){});
  chrome.storage.local.get(["marker1", "marker2"], function(data){
    chrome.storage.local.set({marker1:color, marker2:data.marker1, marker3:data.marker2}, function(){});
    $('#buttonDiv button').remove();
    createHistoryButton();
  });
});
