const { Storage } = require('@google-cloud/storage');

// Configuração do Google Cloud Storage
const storage = new Storage({
  keyFilename: './service-account-key.json'  // Caminho para o arquivo JSON com as credenciais
});

const bucketName = 'my-logs-alunos';  // Nome do seu bucket

// Função para salvar log no Google Cloud Storage
async function salvarLogNaNuvem(message) {
  const fileName = `log-${Date.now()}.txt`;  // Nome único para o arquivo de log
  const file = storage.bucket(bucketName).file(fileName);

  console.log(`Iniciando o envio do log: ${fileName}`);  // Log para depuração
  
  const logStream = file.createWriteStream({
    resumable: false,
    contentType: 'text/plain',
  });

  logStream.write(message);
  logStream.end();

  logStream.on('finish', () => {
    console.log(`Log "${fileName}" enviado com sucesso para o Google Cloud Storage`);
  });

  logStream.on('error', (err) => {
    console.error('Erro ao enviar log para o Google Cloud Storage:', err);
  });
}


module.exports = { salvarLogNaNuvem };
