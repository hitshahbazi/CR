import styled from 'styled-components';

const Wrapper = styled.section`
  /* Default styling */
  background-color: var(--primary-50); /* Updated to yellow background */
  padding: 0; /* Remove fixed padding */
  margin: auto; /* Center the content */

  /* Flex container for main content */
  td,
  th {
    border: 0.5px solid; /* Adjust border thickness as needed */
    padding: 2px; /* Adjust padding as needed */
    box-sizing: border-box;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 8px; /* Adjust font size as needed */
  }
  main {
    display: flex;
    flex-direction: column; /* Stack the child elements vertically */
  }

  /* Border for direct children of main */
  main > * {
    border: 1px solid;
    margin-bottom: 2px; /* Add some space between child elements */
  }

  /* Table styles */
  table {
    border-collapse: collapse;
    font-family: helvetica;
    width: 100%;
  }

  /* Container for the table with max height and scrollbars */
  .table-container {
    position: relative;
    max-height: 100vh; /* Adjust to your preference or remove if not needed */
    overflow-x: hidden;
    overflow-y: auto;
  }

  /* Sticky header for the table */
  thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--primary-500); /* Updated to yellow background */
  }

  /* Sticky first column in the header */
  thead th:first-child {
    left: 0;
    z-index: 3;
  }

  /* Sticky footer for the table */
  tfoot {
    position: sticky;
    bottom: 0;
    z-index: 2;
  }

  /* Sticky first column in the footer */
  tfoot td {
    position: sticky;
    bottom: 0;
    z-index: 2;
    background: var(--primary-500); /* Updated to yellow background */
  }

  tfoot td:first-child {
    z-index: 3;
  }

  /* Scrollable tbody */
  tbody {
    overflow-y: auto;
  }
  input {
    padding: 0;
    margin: 0;
    width: 100%;
  }
  /* Sticky first column in the tbody */
  tr > :first-child {
    position: sticky;
    background: var(--primary-500); /* Updated to yellow background */
    left: 0;
  }
`;

export default Wrapper;
