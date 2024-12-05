const { ClickHouse } = require('clickhouse');

const clickhouse = new ClickHouse({
  url: 'http://localhost',
  port: 8123,
  protocol: 'http',
  database: 'adicionar_notas',
  format: 'json', // Define o formato padrão para JSON
});

module.exports = clickhouse;
