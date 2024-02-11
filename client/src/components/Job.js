import React from 'react';
import moment from 'moment';
import { FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';

const Job = ({
  _id,
  jobType,
  createdAt,
  status,
  crNumber,
  startTime,
  endTime,
  jobTechnology,
}) => {
  const { setEditJob, deleteJob, user } = useAppContext();

  const isMVO = user.group === 'MVO';
  const isApproved = status.toLowerCase() === 'approved';  // Updated condition


  const disableEditButton = isMVO && isApproved;


  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{jobType.charAt(0)}</div>
        <div className='info'>
          <h5>{jobType}</h5>
        </div>
      </header>
      <div className='content'>
        <div className='content-center'>
          {/* Display additional fields */}
          <JobInfo icon={<FaBriefcase />} text={`CR Number: ${crNumber}`} />
          <JobInfo icon={<FaCalendarAlt />} text={`Start Time: ${startTime}`} />
          <JobInfo icon={<FaCalendarAlt />} text={`End Time: ${endTime}`} />
          {/* Display jobTechnology */}
          <JobInfo icon={<FaBriefcase />} text={`Technology: ${jobTechnology}`} />

          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className='actions'>
            {/* Conditionally render the Edit button based on user group and job status */}
            {disableEditButton ? (
              <button type='button' className='btn edit-btn' disabled>
                Edit
              </button>
            ) : (
              <Link
                to='/add-job'
                className='btn edit-btn'
                onClick={() => setEditJob(_id)}
              >
                Edit
              </Link>
            )}
             {disableEditButton ? (
              <button type='button' className='btn delete-btn' disabled>
                Delete
              </button>
            ) : (
            <button
              type='button'
              className='btn delete-btn'
              onClick={() => deleteJob(_id)}
            >
              Delete
            </button>)}
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
