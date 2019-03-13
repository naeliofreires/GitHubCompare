/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';

import { Container, Repository } from './styles';

const CompareList = ({ repositories, onDelete, onUpdate }) => (
  <Container>
    {repositories.map(repository => (
      <Repository key={repository.id}>
        <header>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <strong>{repository.name}</strong>
          <small>{repository.owner.login}</small>
        </header>

        <ul>
          <li>
            {repository.stargazers_count}
            {' '}
            <small> stars</small>
          </li>
          <li>
            {repository.forks_count}
            {' '}
            <small> forks</small>
          </li>
          <li>
            {repository.open_issues_count}
            {' '}
            <small> issues</small>
          </li>
          <li>
            {repository.lastCommit}
            {' '}
            <small> last commit</small>
          </li>
        </ul>
        <button name="update" onClick={() => onUpdate(repository.full_name)}>
          update
        </button>
        <button name="delete" onClick={() => onDelete(repository.id)}>
          delete
        </button>
      </Repository>
    ))}
  </Container>
);

CompareList.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  repositories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      owner: PropTypes.shape({
        login: PropTypes.string,
        avatar_url: PropTypes.string,
      }),
      stargazers_count: PropTypes.number,
      open_issues_count: PropTypes.number,
      pushed_at: PropTypes.string,
    }),
  ).isRequired,
};

export default CompareList;
