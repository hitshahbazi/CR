import styled from 'styled-components';

const Wrapper = styled.section`
  border-radius: var(--borderRadius);
  width: 100%;
  background: var(--white);
  padding: 3rem 2rem 4rem;
  box-shadow: var(--shadow-2);

  h3 {
    margin-top: 0;
    color: var(--primary-500); /* Updated to yellow color */
  }

  .common-input {
    background-color: var(--grey-50);
    height: 35px;
    width: 100%; /* Set width to 100% to ensure consistency */
    border-radius: 4px;
    font-size: 14px;
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--grey-200);
  }

  .rmdp-container {
    width: 100%;
  }

  .rmdp-top-class {
    background: var(--grey-50);
    border-radius: 4px;
  }

  .form {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-width: 100%;
    width: 100%;
  }

  .form-row {
    margin-bottom: 0;
  }

  .form-center {
    display: grid;
    row-gap: 0.5rem;
  }

  .form-center button {
    align-self: end;
    height: 35px;
    margin-top: 1rem;
    background: var(--primary-500); /* Updated to yellow color */
    color: var(--white);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: var(--transition);
  }

  .form-center button:hover {
    background: var(--primary-700); /* Updated to a darker shade of yellow on hover */
  }

  .btn-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
    align-self: flex-end;
    margin-top: 0.5rem;
    button {
      height: 35px;
    }
  }

  .clear-btn {
    background: var(--grey-500);
  }

  .clear-btn:hover {
    background: var(--black);
  }

  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }

    .btn-container {
      margin-top: 0;
    }
  }

  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }

    .form-center button {
      margin-top: 0;
    }
  }
`;

export default Wrapper;
