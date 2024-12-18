// console.log("<<<PASSOU AQUI>>>");

window.onload = function() {
  const btnPesquisar = document.querySelector('#btn-pesquisar');
  const pesquisa = document.querySelector('#pesquisa');
  const tbody = document.querySelector('#lista-cadastro tbody');
  const painelFormulario = document.getElementById('painel-formulario');
  const formulario = document.getElementById('formulario');
  const mensagemDiv = document.getElementById('mensagem');
  const btnCancelar = document.querySelector('#btn-cancelar');
  
  btnPesquisar.addEventListener('click', montarLinhaMatutino);

  rota = {
    // Usar o URL abaixo em produção
    base: "https://back-ensalamento.onrender.com",
    // base: 'http://localhost:3000',
    geral: '/matutino',
    doFiltro: '/ensalamentoM',
  };

  function montarLinhaMatutino(){
    let endPoint = rota.base + rota.doFiltro + "/" + pesquisa.value;
    // let trs = ``;
    let urlAlterar = "", urlExcluir = "";
    let tr, td, button, ii;

    fetch(endPoint)
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        for(let i = 0; i < data.length; i++) {
          urlExcluir = rota.base + rota.geral + "/" + data[i].id;

          // trs += `
          //   <tr>
          //     <td>
          //       <button id="btn-alterar"
          //          class="w3-button w3-deep-orange w3-border w3-hover-orange w3-round-large"
          //          value="${urlAlterar}">
          //         <i class="material-icons">edit</i>
          //       </button>
          //       <button id="btn-excluir"
          //          class="w3-button w3-deep-orange w3-border w3-hover-orange w3-round-large"
          //          value="${urlExcluir}">
          //         <i class="material-icons">delete</i> 
          //       </button>
          //     </td>
          //     <td>${data[i].disciplina}</td>
          //     <td>${data[i].dia_da_semana}</td>
          //     <td>${data[i].professor}</td>
          //     <td>${data[i].sala}</td>
          //   </tr>
          // `;

          tr = document.createElement("tr");
          tbody.append(tr);
          td = document.createElement("td");
          // td.innerHTML = data[i].id;
          tr.append(td);
          button = document.createElement("button");
          td.append(button);
          button.setAttribute('id',"btn-alterar");
          button.setAttribute('class',"w3-button w3-deep-orange w3-border w3-hover-orange w3-round-large");
          // button.setAttribute('value',urlAlterar);
          ii = document.createElement("i");
          button.append(ii);
          ii.setAttribute('class',"material-icons");
          ii.innerHTML = 'edit';
          button = document.createElement("button");
          td.append(button);
          button.setAttribute('id',"btn-excluir");
          button.setAttribute('class',"w3-button w3-deep-orange w3-border w3-hover-orange w3-round-large");
          // button.setAttribute('value',urlExcluir);
          ii = document.createElement("i");
          button.append(ii);
          ii.setAttribute('class',"material-icons");
          ii.innerHTML = 'delete';
          td = document.createElement("td");
          td.innerHTML = data[i].disciplina;
          tr.append(td);
          td = document.createElement("td");
          td.innerHTML = data[i].dia_da_semana;
          tr.append(td);
          td = document.createElement("td");
          td.innerHTML = data[i].professor;
          tr.append(td);
          td = document.createElement("td");
          td.innerHTML = data[i].sala;
          tr.append(td);

          // console.log(rota.base,rota.geral,"/",data[i].id);
        }
        // tbody.innerHTML = trs;
        const btnExcluir = document.querySelector('#btn-excluir');
        btnExcluir.addEventListener('click', excluirLinhaMatutino());
      })
      .catch(err => console.log(err))
    ;
  }

  function excluirLinhaMatutino(id){
    console.log("<<<PASSOU AQUI>>>");
    console.log(id);
    // const endPoint = rota.base + rota.geral + "/" + id;
    // console.log(endPoint);  
  
    // fetch(endPoint, {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then(res => res.json())
    // .then(data => {
    //   console.log(data);
    // })
    // .catch(err => console.log(err));
  }

  formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    const endPoint = rota.base + rota.geral;

    // Preparar os dados do formulário
    const dados = {
      disciplina: document.getElementById('disciplina').value,
      diaDaSemana: document.getElementById('diaDaSemana').value,
      sala: document.getElementById('sala').value,
      professor: document.getElementById('professor').value
    };

    // Enviar dados para a API
    fetch(endPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('O servidor não respondeu adequadamente.');
      }
      return response.json();
    })
    .then(data => {
      // Limpar o formulário
      document.getElementById('formulario').reset();
      
      // Mostrar mensagem de sucesso
      mensagemDiv.textContent = 'Dados salvos com sucesso!';
      mensagemDiv.setAttribute('class', "w3-panel w3-border w3-round-large w3-center w3-padding-large w3-green");
    })
    .catch(error => {
      // Mostrar mensagem de erro
      mensagemDiv.textContent = 'Erro ao inserir os dados: ' + error.message;
      mensagemDiv.setAttribute('class', "w3-panel w3-border w3-round-large w3-center w3-padding-large w3-red");
    });
  });

  btnCancelar.addEventListener('click', function(event) {
    // Limpar o formulário
    document.getElementById('formulario').reset();
    mensagemDiv.textContent = '';
    mensagemDiv.setAttribute('class', "");
    painelFormulario.style.display='none';
  });

}
