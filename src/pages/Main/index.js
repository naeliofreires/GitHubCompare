import React, { Component } from 'react';
import moment from 'moment';

import api from '../../services/api';
import logo from '../../assets/logo.png';
import { Container, Form } from './styles';

import CompareList from '../../components/CompareList';

export default class Main extends Component {
  state = {
    loading: false,
    repositories: [],
    repositoryInput: '',
    repositoryError: false,
  };

  componentDidMount() {
    const reps = localStorage.getItem('repositories');
    if (reps) {
      const repositories = JSON.parse(reps);
      this.setState({ repositories });
    }
  }

  handleAddRepository = async (e) => {
    e.preventDefault();

    this.setState({ loading: true });
    try {
      const { repositoryInput, repositories } = this.state;
      const { data: repository } = await api.get(`/repos/${repositoryInput}`);

      repository.lastCommit = moment(repository.pushed_at).fromNow();

      this.setState(
        {
          repositoryInput: '',
          repositoryError: false,
          repositories: [...repositories, repository],
        },
        () => {
          localStorage.setItem('repositories', JSON.stringify([...repositories, repository]));
        },
      );
    } catch (error) {
      this.setState({
        repositoryError: true,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  onUpdate = async (fullName) => {
    const { data: repository } = await api.get(`/repos/${fullName}`);

    const { repositories } = this.state;

    const updateRepositories = repositories.map((rep) => {
      if (rep.id === repository.id) {
        return { id: rep.id0, lastCommit: moment(repository.pushed_at).fromNow(), ...repository };
      }
      return rep;
    });

    this.setState({ repositories: updateRepositories });
    localStorage.setItem('repositories', JSON.stringify([...updateRepositories]));
  };

  onDelete = (id) => {
    const reps = localStorage.getItem('repositories');

    const repositories = JSON.parse(reps).filter(obj => id !== obj.id);

    this.setState({ repositories });
    localStorage.setItem('repositories', JSON.stringify([...repositories]));
  };

  render() {
    const {
      repositories, repositoryInput, repositoryError, loading,
    } = this.state;
    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form withError={repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            value={repositoryInput}
            placeholder="usuário/repositorio"
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">{loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}</button>
        </Form>

        <CompareList
          onUpdate={fullName => this.onUpdate(fullName)}
          onDelete={id => this.onDelete(id)}
          repositories={repositories}
        />
      </Container>
    );
  }
}
