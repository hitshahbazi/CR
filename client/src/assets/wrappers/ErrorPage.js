import styled from 'styled-components';

const Wrapper = styled.main`
  text-align: center;

  img {
    max-width: 600px;
    display: block;
    margin-bottom: 2rem;
  }

  display: flex;
  align-items: center;
  justify-content: center;

  h3 {
    margin-bottom: 0.5rem;
    color: var(--primary-500); /* Updated to yellow color */
  }

  p {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: var(--grey-500);
  }

  a {
    color: var(--primary-500); /* Updated to yellow color */
    text-decoration: underline;
    text-transform: capitalize;
    transition: var(--transition);
  }

  a:hover {
    color: var(--primary-700); /* Updated to a darker shade of yellow on hover */
  }
`;

export default Wrapper;
