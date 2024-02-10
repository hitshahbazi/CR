import styled from 'styled-components';

const Wrapper = styled.section`
  display: grid;
  align-items: center;

  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
    filter: brightness(1.5); /* Adjust brightness for better visibility on yellow background */
  }

  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-500);
    background: var(--yellow); /* Assuming you have a variable for yellow color */
    border-radius: var(--borderRadius);
    padding: 1rem;
    box-shadow: var(--shadow-2);
  }

  h3 {
    text-align: center;
    color: var(--primary-500);
  }

  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
    color: var(--grey-500);
  }

  .btn {
    margin-top: 1rem;
    background: var(--primary-500);
    color: var(--white);
    border: none;
    border-radius: var(--borderRadius);
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: var(--transition);

    &:hover {
      background: var(--primary-700);
    }
  }

  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--primary-500);
    cursor: pointer;
    letter-spacing: var(--letterSpacing);
  }
`;

export default Wrapper;
