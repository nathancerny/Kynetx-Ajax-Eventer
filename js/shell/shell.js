// STARTING SHELL
if(typeof KY_LIBRARY.EXPEDIA_CALENDAR.default_shell === 'undefined'){
KY_LIBRARY.EXPEDIA_CALENDAR.default_shell = function (templates) {
    // define the outer div
    var shellHTML = $K('<div></div>')
                    .attr('id', 'boot');

    var innerShellHTML = $K('<div></div>');

    var htmlDiv = $K('<div></div>')
                  .addClass('twitter_html');

    var bodyDiv = $K('<div></div>')
                  .addClass('twitter_body');

    var containerDiv = $K('<div></div>')
                       .addClass('container');


    var tabsList = $K('<ul></ul>')
                   .addClass('tabs');


    var tabContentDiv = $K('<div></div>')
                        .addClass('tab-content');

    $K.each(templates, function (key, val) {
      var listTag = $K('<li></li>');
      var linkTag = $K('<a></a>');
      var templateDiv = $K('<div></div>');
      linkTag.attr('href', '#' + key);
      linkTag.html(key);
      listTag.append(linkTag);
      tabsList.prepend(listTag);
      templateDiv.attr('id', key);
      templateDiv.css('height', '330px');
      tabContentDiv.append(templateDiv);
    });
    containerDiv.prepend(tabsList);

    containerDiv.append(tabContentDiv);

    bodyDiv.append(containerDiv);

    htmlDiv.append(bodyDiv);
    innerShellHTML.append(htmlDiv)
    
    innerShellHTML.css('margin-top', '10px');

    shellHTML.append(innerShellHTML);
    shellHTML.css('float', 'right');

    

    $K('.ep-dp').before(shellHTML);

    tabsList.tabs();
    return shellHTML; 
}


}

// END SHELL
