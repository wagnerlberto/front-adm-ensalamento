// console.log("<<<PASSOU AQUI>>>");

window.onload = function() {
  const btnPesquisar = document.querySelector('#btn-pesquisar');
  const pesquisa = document.querySelector('#pesquisa');
  const tbody = document.querySelector('#lista-cadastro tbody');
  
  btnPesquisar.addEventListener('click', montarLinhaMatutino);

  return rota = {
    base: 'http://localhost:3000',
    geral: '/matutino',
    doFiltro: '/ensalamentoM',
  };

  function montarLinhaMatutino(){
    let endPoint = rota.base + rota.doFiltro + "/" + pesquisa.value;
    console.log(endPoint);

    let trs = ``;

    fetch(endPoint)
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        for(let i = 0; i < data.length; i++) {
          trs += `
            <tr>
              <td>
                <button id="btn-alterar" 
                        class="w3-button w3-deep-orange w3-border w3-hover-orange w3-round-large" 
                        style="padding: 0px 3px;">
                  <i class="material-icons">edit</i>
                <button id="btn-alterar" 
                        class="w3-button w3-deep-orange w3-border w3-hover-orange w3-round-large" 
                        style="padding: 0px 3px;">
                  <i class="material-icons">delete</i>
              </td>
              <td>${data[i].disciplina}</td>
              <td>${data[i].dia_da_semana}</td>
              <td>${data[i].professor}</td>
              <td>${data[i].sala}</td>
            </tr>
          `;
        }
        tbody.innerHTML = trs;
    })
    ;
  }
}
