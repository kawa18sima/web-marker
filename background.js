$(function(){
  let style = '<link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet">';
  $('head  link:last').after(style);

  $(document).on('click', '.removeLine i', function(){
    let parentElement = $(this).parent('.removeLine');
    parentElement.before($(this).next('span').text());
    parentElement.remove();
  });

  $(document).on({
      'mouseenter' : function(){
        $(this).find('i').css('display', 'inherit');
      },
      'mouseleave' : function(){
        $(this).find('i').css('display', 'none');
      }
    }, '.removeLine');

  $(document).on("click", function(){
    let selection = window.getSelection();
    if(selection.rangeCount > 0){
      let range = selection.getRangeAt(0);

      sanitize(range);
      checkNode(document.body, range);
    }
  });
});

function sanitize(range){
  if(range.startContainer.nodeType == Node.TEXT_NODE){
    let latter = range.startContainer.splitText(range.startOffset);
    range.setStartBefore(latter);
  }
  if(range.endContainer.nodeType == Node.TEXT_NODE){
    let latter = range.endContainer.splitText(range.endOffset);
    range.setEndBefore(latter);
  }
}

function checkNode(node, range){
  let nodeRange = new Range();
  nodeRange.selectNode(node);

  if(range.compareBoundaryPoints(Range.START_TO_START, nodeRange) <= 0 && range.compareBoundaryPoints(Range.END_TO_END, nodeRange) >= 0){
    let coloringObject;
    if(node.nodeType == Node.TEXT_NODE){
      let span = document.createElement('span');

      let Pspan = document.createElement('span');
      Pspan.classList.add("removeLine");
      node.parentNode.insertBefore(Pspan, node);
      let closeButton = document.createElement('i');
      $(closeButton).addClass("far fa-times-circle");
      $(closeButton).css({'display':'none', 'position':'absolute', 'font-size':'2px', 'opacity':'0.9',});
      Pspan.appendChild(closeButton);
      Pspan.appendChild(span);

      span.appendChild(node);
      coloringObject = span;
    }
    else{
      coloringObject = node;
    }
    chrome.storage.local.get(['markerColor'], function(data){
        coloringObject.style.backgroundColor = data.markerColor;
    });
  }
  else if(range.compareBoundaryPoints(Range.START_TO_END, nodeRange) <= 0 || range.compareBoundaryPoints(Range.END_TO_START, nodeRange) >= 0)
    return;
  else{
    for(let i=0; i<node.childNodes.length; i++){
      checkNode(node.childNodes[i], range);
    }
  }
}

