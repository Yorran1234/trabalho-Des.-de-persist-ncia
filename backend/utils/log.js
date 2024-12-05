const { Storage } = require('@google-cloud/storage');

// Configuração do Google Cloud Storage
const storage = new Storage({
  keyFilename: './service-account-key.json' // Caminho para o arquivo JSON com as credenciais
});

const bucketName = 'my-logs-alunos'; // Nome do seu bucket
const fileName = 'log-aluno-notas.txt'; // Nome fixo para o arquivo

// Função para salvar log no Google Cloud Storage
async function salvarLogNaNuvem(message) {
  try {
    const file = storage.bucket(bucketName).file(fileName);

    let existingLogs = '';

    // Verifica se o arquivo já existe no bucket
    const [exists] = await file.exists();
    if (exists) {
      // Baixa o conteúdo do arquivo existente
      const [contents] = await file.download();
      existingLogs = contents.toString(); // Conteúdo atual do arquivo
    }

    // Adiciona o novo log ao conteúdo existente
    const newLog = `[${new Date().toISOString()}] ${message}\n`;
    const updatedLogs = existingLogs + newLog;

    // Envia o arquivo atualizado para o bucket
    await file.save(updatedLogs, {
      contentType: 'text/plain',
      resumable: false,
    });

    console.log(`Log atualizado e enviado com sucesso para o arquivo: ${fileName} do Google Cloud Storage`);
  } catch (error) {
    console.error('Erro ao salvar log no Google Cloud Storage:', error);
  }
}

module.exports = { salvarLogNaNuvem };
