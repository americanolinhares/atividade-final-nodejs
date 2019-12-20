function remover(nomeArquivo){
    console.log("Remover arquivo:");
    console.log(nomeArquivo);

    fetch('/admin', {method: 'DELETE', body: JSON.stringify({ nome: nomeArquivo })})
        .then(function(response) {
        if(response.ok) {
            console.log('removido com sucesso');
            return;
        }
        throw new Error('Request failed.');
        })
        .catch(function(error) {
        console.log(error);
    });
}