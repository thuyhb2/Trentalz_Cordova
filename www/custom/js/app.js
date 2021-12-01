var config = {
    baseUrl:'http://lhptravelapi.pandakis.xyz:7474'
}

function truncateText(txt, pos, sym = '…') {
    const len = txt.length;
    if (pos == undefined || len <= pos) { 
      return txt;
    } else {
      const p1 = txt.slice(0, pos - 3);
      return p1 + sym;
    }
  }


  function generateRatting(){
      let s = '';
      for(let i = 0; i < Math.floor((Math.random() * 5) + 3); i++){
          s += '<i class="fa fa-star" aria-hidden="true"></i>';
      }
      return s;
  }

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
  }