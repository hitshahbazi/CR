import styled from 'styled-components';

const Wrapper = styled.section`
  margin-top: 4rem;
  text-align: center;

  button {
    background: transparent;
    border-color: transparent;
    text-transform: capitalize;
    color: var(--primary-500); /* Updated to yellow color */
    font-size: 1.25rem;
    cursor: pointer;
    transition: var(--transition);
  }

  button:hover {
    color: var(--primary-700); /* Updated to a darker shade of yellow on hover */
  }

  h4 {
    text-align: center;
    margin-bottom: 0.75rem;
    color: var(--primary-500); /* Updated to yellow color */
  }
`;

export default Wrapper;
