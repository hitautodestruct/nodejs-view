jQuery(function( $ ){

  var list = [],
      i = 0,
      docsURL = 'http://nodejs.org/api/',
      descList, globalData,
      l, item, link;
  
  var parseMarkDownURL = function( markdown ){
  
    var split = markdown.split('('), url, text;
    
    text = split[0].replace('[','').replace(']','');
    url = split[1].replace(')','');
    
    return [ text, url ];
    
  };
  
  var parseMethods = function( methods ){
  
    list = ['<ul class="nav nav-tabs nav-stacked">'];
    
    for ( i=0, l=methods.length; i<l; i++ ){
    
      list.push('<li><a href="'+ i +'">'+ methods[i].name +'</a></li>');
      
    }
    
    list.push('</ul>');
    
    return list;
    
  };
  
  $.get(docsURL + 'index.json', function( data ){
  
    descList = data.desc;
    
    for ( i=0, l=descList.length; i<l; i++ ){
    
        item = descList[i];
      
        if ( item.type === 'list_start' ) {
          
          list.push('<ul class="nav nav-tabs nav-stacked">');
          
        } else if ( item.type === 'list_item_start' ) {

          list.push('<li>');
          
        } else if ( item.type === 'list_item_end' ) {

          list.push('</li>');
          
        } else if ( item.type === 'text' ) {

          link = parseMarkDownURL( item.text );
          link = '<a href="' + docsURL + link[1].replace('.html','.json') +'">'+ link[0] +'</a>';
          
          list.push( link );
          
        } else if ( item.type === 'list_end' ) {

          list.push('</ul>');
          
        }
      
    }
    
    $('#modules')
      .html( list.join('') )
      .on('click', 'a', function( e ){
    
        e.preventDefault();
        
        $.get( $(this).attr('href'), function( data ){
        
          console.log( data );
          
          if ( data.modules )
            globalData = data.modules[0];
          else if ( data.miscs )
            globalData = data.miscs[0];
          else if ( data.globals )
            globalData = data.globals[0];
          
          var h = [
                '<h1>'+ globalData.textRaw +'</h1>',
                globalData.desc
              ];
          
          if ( data.modules ){
            var modules = parseMethods( globalData.methods );
            $('#methods').html( modules.join('') );
          }
          
          $('#output').html( h.join('') );
          
        });
      
      });
    
      $('#methods').on('click', 'a', function( e ){
      
        e.preventDefault();
        
        var item = globalData.methods[$(this).attr('href')],
            desc = item.desc,
            name = item.textRaw;
        
        $('#output').html( '<h1>'+ name +'</h1>' + desc );
        
      });
    
  });
  
});
