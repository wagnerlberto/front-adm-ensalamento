window.onload = function() {
  const btnAdicionar = document.querySelector('#btn-adicionar');
  const painelFormulario = document.getElementById('painel-formulario');
  const formulario = document.getElementById('formulario');
  const campoDisciplina = document.getElementById('disciplina');
  const msgForm = document.getElementById('msg-form');
  const btnCancelar = document.querySelector('#btn-cancelar');
  const pesquisa = document.querySelector('#pesquisa');
  const btnPesquisar = document.querySelector('#btn-pesquisar');
  const msgListar = document.getElementById('msg-listar');
  const tbody = document.querySelector('#lista-cadastro tbody');

  rota = {
    // Usar o URL abaixo em produção
    base: "https://back-ensalamento.onrender.com",
    // base: 'http://localhost:3000',
    geral: '/matutino',
    doFiltro: '/ensalamentoM',
  };

  // Botão Adicionar da barra de pesquisa
  btnAdicionar.addEventListener('click', function(event) {
    event.preventDefault();

    formulario.setAttribute('class', "Adicionar");
    painelFormulario.style.display = 'block';
    campoDisciplina.focus();
  });

  // Botão pesquisar da barra de pesquisa
  btnPesquisar.addEventListener('click', function(event) {
    event.preventDefault();

    let endPoint = rota.base + rota.doFiltro + "/" + pesquisa.value;
    let urlAlterar = "", urlExcluir = "";
    let tr, td, button, ii;

    // Mostrar msg-listar de Carregando...
    msgListar.textContent = 'Carregando...';
    msgListar.setAttribute('class', "w3-panel w3-border w3-round-large w3-center w3-padding-large w3-pale-yellow");

    fetch(endPoint)
      .then(res => res.json())
      .then(data => {
        // Limpar a linha de carregamento
        tbody.innerHTML = "";

        // Verificar se há resultados
        if (data.length === 0) {
          // Mostrar msg-listar de Erro
          msgListar.textContent = 'Nenhuma linha encontrada.';
          msgListar.setAttribute('class', "w3-panel w3-border w3-round-large w3-center w3-padding-large w3-pale-red");
          return;
        }

        // Popular a tabela com os dados
        data.forEach( item => {  
          tr = document.createElement("tr");
          tr.innerHTML = `
            <td>
              <button class="btn-alterar w3-button w3-deep-orange w3-border w3-hover-orange w3-round-large" data-id="${item.id}" data-disciplina="${item.disciplina}" data-dia_da_semana="${item.dia_da_semana}" data-professor="${item.professor}" data-sala="${item.sala}">
                Alterar
              </button>

              <button class="btn-excluir w3-button w3-deep-orange w3-border w3-hover-orange w3-round-large" data-id="${item.id}">
                Excluir
              </button>
            </td>
            <td>${item.disciplina}</td>
            <td>${item.dia_da_semana}</td>
            <td>${item.professor}</td>
            <td>${item.sala}</td>
          `;
          tbody.appendChild(tr);
        });

        // Adicionar event listeners para botões de excluir
        document.querySelectorAll('.btn-excluir').forEach(btn => {
          btn.addEventListener('click', excluirLinhaMatutino);
        });

        // Adicionar event listeners para botões de alterar
        document.querySelectorAll('.btn-alterar').forEach(btn => {
          formulario.setAttribute('class', "Alterar");
          btn.addEventListener('click', alterarLinhaMatutino);
        });

        // Esconder msg-listar de Carregando...
        msgListar.textContent = '';
        msgListar.setAttribute('class', "");
      })
      .catch(error => {
        // Mostrar msg-listar de erro
        msgListar.textContent = 'Erro ao listar os dados: ' + error.message;
        msgListar.setAttribute('class', "w3-panel w3-border w3-round-large w3-center w3-padding-large w3-red");
        console.error(error);
      });
  });

  // Botão salvar do Formulário
  formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    if ( formulario.getAttribute('class') == 'Adicionar' ) 
      adicionar();
    else if ( formulario.getAttribute('class') == 'Alterar' )
      alterar();
  });

  // Adicionar dados do formulário
  function adicionar() {
    const endPoint = rota.base + rota.geral;
    // Pegar os dados do formulário
    const dados = {
      disciplina: document.getElementById('disciplina').value,
      diaDaSemana: document.getElementsByName('diaDaSemana').value,
      sala: document.getElementById('sala').value,
      professor: document.getElementById('professor').value
    };
    const selectedRadio = document.querySelector('input[name="diaDaSemana"]:checked');
    if ( selectedRadio ) {
      dados.diaDaSemana = selectedRadio.value;
    }

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
      
      // Mostrar msg-form de sucesso
      msgForm.textContent = 'Dados inseridos com sucesso!';
      msgForm.setAttribute('class', "w3-panel w3-border w3-round-large w3-center w3-padding-large w3-green");

      // Limpar a linha de carregamento
      tbody.innerHTML = "";

      // Mostrar msg-listar de adicionado com sucesso
      msgListar.textContent = 'Refaça sua pesquisa.';
      msgListar.setAttribute('class', "w3-panel w3-border w3-round-large w3-center w3-padding-large w3-pale-yellow");      
    })
    .catch(error => {
      // Mostrar msg-form de erro
      msgForm.textContent = 'Erro ao inserir os dados: ' + error.message;
      msgForm.setAttribute('class', "w3-panel w3-border w3-round-large w3-center w3-padding-large w3-red");
      console.error(error);
    });
  }

  // Botão cancelar do Adicionar
  btnCancelar.addEventListener('click', function(event) {
    // Limpar o formulário
    document.getElementById('formulario').reset();
    msgForm.textContent = '';
    msgForm.setAttribute('class', "");
    painelFormulario.style.display='none';
  });

  // Botão excluir da lista
  function excluirLinhaMatutino(event){
    const btn = event.target;
    const id = btn.getAttribute('data-id');
    const endPoint = rota.base + rota.geral + "/" + id;
  
    fetch(endPoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('O servidor não respondeu adequadamente.');
      }

      // Remover linha da tabela
      btn.closest('tr').remove();

      return response.json();
    })
    .then(data => {
      // Mostrar msg-listar de excluído com sucesso
      msgListar.textContent = 'Dados excluídos com sucesso!';
      msgListar.setAttribute('class', "w3-panel w3-border w3-round-large w3-center w3-padding-large w3-pale-green");
    })
    .catch(error => {
      // Mostrar msg-excluir de erro
      msgListar.textContent = 'Erro ao excluir os dados: ' + error.message;
      msgListar.setAttribute('class', "w3-panel w3-border w3-round-large w3-center w3-padding-large w3-pale-red");
      console.error(error);
    });
  }

  // Botão alterar da lista
  function alterarLinhaMatutino(event){
    const btn = event.target;

    // Pegar dados da lista
    const item = {
      id: btn.getAttribute('data-id'),
      disciplina: btn.getAttribute('data-disciplina'),
      dia_da_semana: btn.getAttribute('data-dia_da_semana'),
      professor: btn.getAttribute('data-professor'),
      sala: btn.getAttribute('data-sala')
    }

    // Colocar os dados no formulário
    document.getElementById('id').value = item.id;
    document.getElementById('disciplina').value = item.disciplina;
    document.getElementById('sala').value = item.sala;
    document.getElementById('professor').value = item.professor;
    // Define como checado pelo id
    document.getElementById(item.dia_da_semana).checked = true;

    painelFormulario.style.display = 'block';
    campoDisciplina.focus();
  }

  function alterar(){
    // Pegar os dados do formulário
    const dados = {
      id: document.getElementById('id').value,
      disciplina: document.getElementById('disciplina').value,
      diaDaSemana: document.getElementsByName('diaDaSemana').value,
      sala: document.getElementById('sala').value,
      professor: document.getElementById('professor').value
    };
    const selectedRadio = document.querySelector('input[name="diaDaSemana"]:checked');
    if ( selectedRadio ) {
      dados.diaDaSemana = selectedRadio.value;
    }
    const endPoint = rota.base + rota.geral + "/" + dados.id;

    fetch(endPoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
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
      // Mostrar msg-form de sucesso
      msgForm.textContent = 'Dados alterados com sucesso!';
      msgForm.setAttribute('class', "w3-panel w3-border w3-round-large w3-center w3-padding-large w3-green");

      // Limpar a linha de carregamento
      tbody.innerHTML = "";

      // Mostrar msg-listar de alterado com sucesso
      msgListar.textContent = 'Refaça sua pesquisa.';
      msgListar.setAttribute('class', "w3-panel w3-border w3-round-large w3-center w3-padding-large w3-pale-yellow");
    })
    .catch(error => {
      // Mostrar msg-form de erro
      msgForm.textContent = 'Erro ao alterar os dados: ' + error.message;
      msgForm.setAttribute('class', "w3-panel w3-border w3-round-large w3-center w3-padding-large w3-pale-red");
      console.error(error);
    });
  }

}
