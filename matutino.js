$(document).ready(function(){
  const rota = {
    base: 'http://localhost:3000',
    geral: '/matutino',
    doFiltro: '/ensalamentoM',
  };

  function montarLinhaMatutino(){
    let endPoint = rota.base + rota.doFiltro + "/" + document.querySelector('#pesquisa').value;
    console.log(endPoint);
  }  


// function myFunction() {
//   var x = document.getElementById("demo");
//   if (x.className.indexOf("w3-show") == -1) {
//     x.className += " w3-show";
//   } else { 
//     x.className = x.className.replace(" w3-show", "");
//   }
// }

});