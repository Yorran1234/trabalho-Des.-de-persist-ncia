import React, { useState, useEffect } from 'react'; 
import styled from 'styled-components';
import axios from 'axios';

// Estilização com styled-components
const Container = styled.div`
  padding: 20px;
  background-color: #A0B3D5;
  border-radius: 10px;
  max-width: 1300px;
  margin: 80px auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Titulo = styled.h2`
  text-align: center;
  color: #2F509D;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  background-color: #dff1fb;
  border-radius: 10px;
  overflow: hidden;
`;

const Th = styled.th`
  background-color: #9ED1F5;
  padding: 15px;
  text-align: left;
  border: 1px solid #ddd;
  color: #fff;
  font-size: 1rem;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 15px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 1rem;
  color: #555;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #F7F9FB;
  border: 2px solid #326589;
  color: #326589;
  font-size: 16px;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #326589;
    color: white;
  }
`;

const InputNota = styled.input`
  padding: 5px;
  width: 60px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  margin: 5px;
`;

const NotaQuadrado = styled.span`
  display: inline-block;
  width: 50px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  line-height: 40px;
  margin: 3px;
`;

const Status = styled.span`
  color: ${props => (props.status === 'Aprovado' ? 'green' : props.status === 'Reprovado' ? 'red' : 'gray')};
  font-weight: bold;
`;

const Notas = () => {
  const [alunos, setAlunos] = useState([]);
  const [notaTemp, setNotaTemp] = useState('');
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const alunosResponse = await axios.get('http://localhost:5000/alunos');
      const notasResponse = await axios.get('http://localhost:5000/notas/notas-clickhouse');

      const alunosComNotas = alunosResponse.data.map((aluno) => {
        const alunoNotas = notasResponse.data.find((nota) => nota.id === aluno.id);
        return {
          ...aluno,
          notas: alunoNotas ? alunoNotas.notas : [],
        };
      });

      setAlunos(alunosComNotas);
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    }
  };

  const handleAddNota = async (alunoId) => {
    if (!notaTemp || isNaN(notaTemp) || notaTemp < 0 || notaTemp > 100) {
      alert('Por favor, insira uma nota válida entre 0 e 100.');
      return;
    }

    const aluno = alunos.find((aluno) => aluno.id === alunoId);

    if (aluno.notas.length >= 3) {
      alert('Você não pode adicionar mais de 3 notas. Por favor, exclua uma antes de adicionar outra.');
      return;
    }

    const data = { alunoId, nota: parseFloat(notaTemp) };

    try {
      await axios.post('http://localhost:5000/notas/add', data);
      alert('Nota adicionada com sucesso');
      setNotaTemp('');
      setIsEditing(null);
      await carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar a nota:', error);
    }
  };

  const handleDeleteNota = async (alunoId) => {
    if (!window.confirm('Tem certeza que deseja excluir todas as notas deste aluno?')) return;

    try {
      await axios.delete(`http://localhost:5000/notas/delete/${alunoId}`);
      alert('Notas excluídas com sucesso');
      await carregarDados();
    } catch (error) {
      console.error('Erro ao excluir as notas:', error);
    }
  };

  const handleCloseAddNota = () => {
    setIsEditing(null);
    setNotaTemp('');
  };

  return (
    <Container>
      <Titulo>Notas dos Alunos</Titulo>
      <Table>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>Notas</Th>
            <Th>Média Final</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((aluno) => {
            const notas = aluno.notas.slice(0, 3); // Considera no máximo 3 notas
            const mediaFinal = notas.length === 3 ? notas.reduce((acc, nota) => acc + nota, 0) / 3 : 0;
            const notasText = notas.length > 0
              ? notas.map((nota, index) => (
                  <NotaQuadrado key={index}>{nota}</NotaQuadrado>
                ))
              : 'Sem notas cadastradas';

            const statusMedia = mediaFinal >= 60 ? 'Aprovado' : mediaFinal > 0 ? 'Reprovado' : '';

            return (
              <tr key={aluno.id}>
                <Td>{aluno.nome}</Td>
                <Td>{notasText}</Td>
                <Td>{mediaFinal.toFixed(2)}</Td>
                <Td><Status status={statusMedia}>{statusMedia}</Status></Td>
                <Td>
                  {isEditing === aluno.id ? (
                    <>
                      <InputNota
                        type="number"
                        value={notaTemp}
                        onChange={(e) => setNotaTemp(e.target.value)}
                      />
                      <Button onClick={() => handleAddNota(aluno.id)}>Salvar</Button>
                      <Button onClick={handleCloseAddNota}> X </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => setIsEditing(aluno.id)}>Adicionar</Button>
                      <Button onClick={() => handleDeleteNota(aluno.id)}>Excluir</Button>
                    </>
                  )}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default Notas;
