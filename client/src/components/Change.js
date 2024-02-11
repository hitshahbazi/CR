import React, { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/Change';
import { useAppContext } from '../context/appContext';

const Change = () => {
  const { createScript,  exportedScripts, updateScript ,crNumber} = useAppContext();
  const [tableData, setTableData] = useState([
    { rowid: '', category: '', subregion: '', siteId: '', cellId: '', mo: '', parameter: '', bl: '', pre: '', post: '' },
  ]);

  const handleInputChange = (rowid, field, value) => {
    // Update the tableData state when the user edits a cell
    setTableData((prevData) =>
      prevData.map((row) =>
        row.rowid === rowid ? { ...row, [field]: value } : row
      )
    );
  };

  const handleCellEdit = (rowid, field, value) => {
    // Find the index of the row with the specified rowid
    const rowIndex = tableData.findIndex((row) => row.rowid === rowid);
  
    if (rowIndex !== -1) {
      // Update the specific cell in the tableData state
      setTableData((prevData) => {
        const updatedData = [...prevData];
        updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: value };
        return updatedData;
      });
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text');
    const rows = pastedData.split('\n');

    // Update tableData state based on the pasted rows
    setTableData((prevData) =>
      rows.map((row, index) => {
        const values = row.split('\t');
        return {
          rowid: prevData.length + index,
          category: values[0] || '',
          subregion: values[1] || '',
          siteId: values[2] || '',
          cellId: values[3] || '',
          mo: values[4] || '',
          parameter: values[5] || '',
          bl: values[6] || '',
          pre: values[7] || '',
          post: values[8] || '',
        };
      })
    );
  };

  const generateScript = () => {
    // Convert the table data into the desired script format
    const script = tableData.map((row, index) => `${index} ${row.siteId} set ${row.mo} ${row.parameter} ${row.post}`).join('\n');

    // Create a new tab with the generated script
    const newTab = window.open();
    newTab.document.write('<pre>' + script + '</pre>');
  };

  const saveData = () => {
    // Check if the last row is completely empty
    const lastRow = tableData[tableData.length - 1];
    const isLastRowEmpty = Object.keys(lastRow)
      .filter(key => key !== 'rowid')  // Exclude 'rowid' from the check
      .every(key => lastRow[key] === '');

    // Create a new array without the last row if it's empty
    const dataToSave = isLastRowEmpty
      ? tableData.slice(0, -1)
      : tableData;
    console.log("sssssd:", dataToSave);
    // Call the createScript function from appContext with the modified data
    createScript(dataToSave);

    // You can also add additional logic or display an alert if needed
  };
  const handleUpdateScript = () => {
    // Create an array to store modified fields for each row
    const modifiedFieldsArray = [];
  
    // Loop through all rows in tableData
    tableData.forEach((row) => {
      const modifiedFieldsForRow = {
        crNumber: crNumber,
        rowid: row.rowid,
        category: row.category,
        subregion: row.subregion,
        siteId: row.siteId,
        cellId: row.cellId,
        mo: row.mo,
        parameter: row.parameter,
        bl: row.bl,
        pre: row.pre,
        post: row.post,
      };
  
      // Add modified fields for the current row to the modifiedFieldsArray
      modifiedFieldsArray.push(modifiedFieldsForRow);
    });
  
    // Call the updateScript function from appContext with the modifiedFieldsArray
    updateScript(modifiedFieldsArray);
  
    // Display an alert or perform any other action as needed
  };
  





  useEffect(() => {
    // Update the tableData when exportedScripts change
    if (exportedScripts && exportedScripts.length > 0) {
      const newTableData = exportedScripts.map((script, index) => ({
        rowid: index + 1,
        category: script.category,
        subregion: script.subregion,
        siteId: script.siteId,
        cellId: script.cellId,
        mo: script.mo,
        parameter: script.parameter,
        bl: script.bl,
        pre: script.pre,
        post: script.post,
      }));
      setTableData(newTableData);
    }
  }, [exportedScripts]);


  return (
    <Wrapper>
      <div className='employees'>
        <div className="table-wrapper">
          <h2>Copy and Paste Your Excel Input</h2>
          <table className="fl-table">
            <thead>
              <tr>
                <th>Row ID</th>
                <th>Category</th>
                <th>Subregion</th>
                <th>Site Id</th>
                <th>Cell Id</th>
                <th>MO</th>
                <th>Parameter</th>
                <th>BL/DEB Require</th>
                <th>Pre</th>
                <th>Post</th>
              </tr>
            </thead>
            <tbody>
            {tableData.map((row, index) => (
  <tr key={index}>
    <td>{index + 1}</td>
    <td>
      <input
        type="text"
        value={row.category}
        onChange={(e) => handleCellEdit(row.rowid, 'category', e.target.value)}
        onPaste={handlePaste}
      />
    </td>
    <td>
      <input
        type="text"
        value={row.subregion}
        onChange={(e) => handleCellEdit(row.rowid, 'subregion', e.target.value)}
        onPaste={handlePaste}
      />
    </td>
    <td>
      <input
        type="text"
        value={row.siteId}
        onChange={(e) => handleCellEdit(row.rowid, 'siteId', e.target.value)}
        onPaste={handlePaste}
      />
    </td>
    <td>
      <input
        type="text"
        value={row.cellId}
        onChange={(e) => handleCellEdit(row.rowid, 'cellId', e.target.value)}
        onPaste={handlePaste}
      />
    </td>
    <td>
      <input
        type="text"
        value={row.mo}
        onChange={(e) => handleCellEdit(row.rowid, 'mo', e.target.value)}
        onPaste={handlePaste}
      />
    </td>
    <td>
      <input
        type="text"
        value={row.parameter}
        onChange={(e) => handleCellEdit(row.rowid, 'parameter', e.target.value)}
        onPaste={handlePaste}
      />
    </td>
    <td>
      <input
        type="text"
        value={row.bl}
        onChange={(e) => handleCellEdit(row.rowid, 'BL/DEB Require', e.target.value)}
        onPaste={handlePaste}
      />
    </td>
    <td>
      <input
        type="text"
        value={row.pre}
        onChange={(e) => handleCellEdit(row.rowid, 'pre', e.target.value)}
        onPaste={handlePaste}
      />
    </td>
    <td>
      <input
        type="text"
        value={row.post}
        onChange={(e) => handleCellEdit(row.rowid, 'post', e.target.value)}
        onPaste={handlePaste}
      />
    </td>
  </tr>
))}
            </tbody>
          </table>
        </div>
        <button onClick={generateScript}>Generate Script</button>
        <button onClick={saveData}>Save Data</button>
        <button onClick={handleUpdateScript}>Update Script</button> {/* Add this button */}
      </div>
    </Wrapper>
  );
};

export default Change;
