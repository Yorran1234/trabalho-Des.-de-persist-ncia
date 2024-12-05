import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaTimes, FaEdit } from 'react-icons/fa';

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

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #6E8EB4;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 15px;
  border-radius: 10px;
  border: none;
  flex-grow: 1;
  margin-right: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  color: #333;
`;

const SearchButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #fff;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 50px;
  border-radius: 30px;
  max-width: 800px;
  width: 100%;
  position: relative;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const ButtonSave = styled.button`
  padding: 10px 20px;
  background-color: #326589;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #254a73;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  &:hover {
    color: #999;
  }
`;

function ListaAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoAluno, setNovoAluno] = useState({ nome: '', email: '' });
  const [editandoAluno, setEditandoAluno] = useState(null);

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/alunos');
      setAlunos(response.data);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  const handleIncluirAluno = () => {
    setNovoAluno({ nome: '', email: '' });
    setIsModalOpen(true);
    setEditandoAluno(null);
  };

  const handleAlterarAluno = (aluno) => {
    setNovoAluno({ nome: aluno.nome, email: aluno.email });
    setIsModalOpen(true);
    setEditandoAluno(aluno);
  };

  const handleSalvarAluno = async () => {
    const { nome, email } = novoAluno;
    if (!nome || !email) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      if (editandoAluno) {
        await axios.put(`http://localhost:5000/alunos/${editandoAluno.id}`, { nome, email });
      } else {
        await axios.post('http://localhost:5000/alunos', { nome, email });
      }
      fetchAlunos();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
    }
  };

  const excluirAluno = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/alunos/${id}`);
      fetchAlunos();
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
    }
  };

  // Filtra alunos com base na pesquisa
  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <Container>
      <Titulo>Lista de Alunos</Titulo>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Pesquise por nome"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
        <SearchButton>
          <FaSearch />
        </SearchButton>
      </SearchBar>

      <Button onClick={handleIncluirAluno}>
        <FaPlus /> Incluir Aluno
      </Button>

      <Table>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>Email</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {alunosFiltrados.map((aluno) => (
            <tr key={aluno.id}>
              <Td>{aluno.nome}</Td>
              <Td>{aluno.email}</Td>
              <Td>
                <Button onClick={() => handleAlterarAluno(aluno)}>
                  <FaEdit /> Editar
                </Button>
                <Button onClick={() => excluirAluno(aluno.id)}>
                  <FaTimes /> Excluir
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <FaTimes />
            </CloseButton>
            <h2>{editandoAluno ? 'Alterar Aluno' : 'Incluir Aluno'}</h2>
            <FormGroup>
              <Label>Nome:</Label>
              <Input
                type="text"
                value={novoAluno.nome}
                onChange={(e) => setNovoAluno({ ...novoAluno, nome: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>Email:</Label>
              <Input
                type="email"
                value={novoAluno.email}
                onChange={(e) => setNovoAluno({ ...novoAluno, email: e.target.value })}
              />
            </FormGroup>
            <ButtonSave onClick={handleSalvarAluno}>Salvar</ButtonSave>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default ListaAlunos;
