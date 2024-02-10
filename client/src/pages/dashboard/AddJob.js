import { FormRow, FormRowSelect, Alert } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import Change from '../../components/Change';
import DateFarsiInput from '../../components/Date';
import { useEffect } from 'react';

// ... (other imports)

const AddJob = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    createJob,
    editJob,
    startTime,
    endTime,
    team,
    teamOptions,
    jobTechnology,
    jobTechnologyOptions,
    crNumber,
    user,
  } = useAppContext();

  // Check if the user belongs to the specified groups
  const isCMEricsson = user.group === 'CM ERICSSON';
  const isCMNokia = user.group  === 'CM NOKIA';
  const isCMHuawei = user.group  === 'CM HUAWEI';
  


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!crNumber || !startTime || !endTime) {
      displayAlert();
      return;
    }
    if (isEditing) {
      editJob();
      
      return;
    }
    createJob();
  };

  const handleJobInput = (e) => {
   // if (isCMEricsson || isCMNokia || isCMHuawei) {
      // If user belongs to specified groups, inputs are disabled in editing mode
     // return;
    //}

    const name = e.target.name;
    const value = e.target.value;
    handleChange({ name, value });
  };

  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing ? 'edit job' : 'add job'}</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          {/* crNumber */}
          <FormRow 
          type='text' 
          name='crNumber' 
          value={crNumber} 
          handleChange={handleJobInput} 
          isDisabled={isEditing && (isCMEricsson || isCMNokia || isCMHuawei)}
          />
          {/* team */}
          <FormRowSelect
            type='text'
            name='team'
            value={team}
            handleChange={handleJobInput}
            list={teamOptions}
            disabled={isEditing && (isCMEricsson || isCMNokia || isCMHuawei)}
          />
          {/* technology */}
          <FormRowSelect
            type='text'
            labelText='jobTechnology'
            name='jobTechnology'
            value={jobTechnology}
            handleChange={handleJobInput}
            list={jobTechnologyOptions}
            disabled={isEditing && (isCMEricsson || isCMNokia || isCMHuawei)}
          />
          {/* job status */}
          <FormRowSelect
            labelText='Status'
            name='status'
            value={status}
            handleChange={handleJobInput}
            list={statusOptions}
         
          />
          {/* job type */}
          <FormRowSelect
            name='jobType'
            labelText='job type'
            value={jobType}
            handleChange={handleJobInput}
            list={jobTypeOptions}
            disabled={isEditing && (isCMEricsson || isCMNokia || isCMHuawei)}
          />
          {/* time range input */}
          <DateFarsiInput label='startTime' value={startTime} handleChange={handleChange} disabled={isEditing && (isCMEricsson || isCMNokia || isCMHuawei)} />
          {/* time range input */}
          <DateFarsiInput label='endTime' value={endTime} handleChange={handleChange} disabled={isEditing && (isCMEricsson || isCMNokia || isCMHuawei)} />
          {/* btn container */}
          <div className='btn-container'>
            <button
              type='submit'
              className='btn btn-block submit-btn'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
            <button
              className='btn btn-block clear-btn'
              onClick={(e) => {
                e.preventDefault();
                clearValues();
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
      <Change />
    </Wrapper>
  );
};

export default AddJob;
