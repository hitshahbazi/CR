import styled from 'styled-components';

const Wrapper = styled.section`
  .form {
    width: 100%;
    max-width: 100%;
    background: var(--yellow); /* Assuming you have a variable for yellow color */
    border-radius: var(--borderRadius);
    padding: 2rem;
    box-shadow: var(--shadow-2);
  }

  .form-input,
  .form-select,
  .btn-block {
    height: 35px;
    background: var(--yellow); /* Adjust the background color if needed */
    border-radius: var(--borderRadius);
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--grey-200);
  }

  .form-row {
    margin-bottom: 0;
  }

  .form-center {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 2rem;
    row-gap: 0.5rem;
  }

  h5 {
    font-weight: 700;
    color: var(--yellow); /* Adjust text color if needed */
  }

  .btn-block {
    align-self: end;
    margin-top: 1rem;
    background: var(--primary-500); /* Assuming you have a variable for primary color */
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

  @media (min-width: 768px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }

    .btn-block {
      margin-top: 0;
    }
  }
`;

export default Wrapper;
