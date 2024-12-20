window.onload = function() {
  const fileInput = document.getElementById('tsvFileInput');
  const output = document.getElementById('output');
  let tsvText;
  let jsonResult;


  rota = {
    // Usar o URL abaixo em produção
    base: "https://back-ensalamento.onrender.com",
    // base: 'http://localhost:3000',
    geral: '/matutino',
    doFiltro: '/ensalamentoM',
    truncate: '/matutinotodos'
  };

  document.getElementById('btn-importar').addEventListener('click', () => {
    carregarTSV();
    truncarTabela();
    importar();
  });

  function carregarTSV() {
    // Verifica se um arquivo foi selecionado
    if (!fileInput.files.length) {
      alert('Por favor, selecione um arquivo TSV.');
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    // Lê o arquivo como texto
    reader.readAsText(file);

    reader.onerror = function() {
      alert("Erro ao ler o arquivo.");
    };

    // Evento para processar o conteúdo do arquivo após leitura
    reader.onload = function (event) {
      const tsvText = event.target.result;
      // const jsonResult = tsvToJson(tsvText);
      jsonResult = tsvToJson(tsvText);
      // output.textContent = JSON.stringify(jsonResult, null, 2);
      textContent = JSON.stringify(jsonResult, null, 2);
    };

    // importar();
  }

  // Função para converter TSV para JSON
  function tsvToJson(tsv) {
    // Divide em linhas e remove linhas vazias
    const lines = tsv.split('\n').filter(line => line.trim() !== '');
    // Assume que a primeira linha contém os cabeçalhos
    const headers = lines[0].split('\t');
    const json = lines.slice(1).map(line => {
      const values = line.split('\t');
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim();
      });
      return obj;
    });
    return json;
  }

  // Truncar tabela
  function truncarTabela() {
    let endPoint = rota.base + rota.truncate;
    console.log(endPoint);

    // Enviar dados para a API
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
      return response.json();
    })
    .then(data => {
    })
    .catch(error => {
      console.error(error);
    });
  };

  // Importar dados do JSON
  function importar() {
    // Pegar os dados do formulário
    // const dados = JSON.parse(output.textContent);
    const dados = jsonResult;
    console.log(dados);

    for(let dado of dados) {
      let endPoint = rota.base + rota.geral;
      console.log(endPoint);
      console.log(dado);
      // Enviar dados para a API
      fetch(endPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dado)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('O servidor não respondeu adequadamente.');
        }
        return response.json();
      })
      .then(data => {
      })
      .catch(error => {
        console.error(error);
      });
    }
  };


}