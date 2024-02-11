import Job, { jobValidationSchema } from '../models/Job.js';
import Script from '../models/Script.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment';
const createJob = async (req, res) => {
  const { crNumber, startTime, endTime } = req.body;

  try {
    // Validate the request body against the validation schema
    await jobValidationSchema.validate(req.body);

    // If validation passes, proceed to create the job
    const jobData = {
      ...req.body,
      createdBy: req.user.userId,
      group: req.user.group, // Add the group attribute
    };

    const job = await Job.create(jobData);

    res.status(StatusCodes.CREATED).json({ job });
  } catch (error) {
    // If validation fails, throw a BadRequestError with the validation error details
    throw new BadRequestError(error.message);
  }
};
const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  // Check if the user belongs to the management group
  const isAdminOrManagement = ['ADMIN', 'MANAGEMENT'].includes(req.user.group);

  // Create the query object based on user's group and role
  let queryObject = {};

  if (!isAdminOrManagement) {
    // For non-admin and non-management users, show jobs created in their group
    queryObject = {
      ...queryObject,
      group: req.user.group,
    };

    if (status && status !== 'all') {
      queryObject.status = status;
    }
    if (jobType && jobType !== 'all') {
      queryObject.jobType = jobType;
    }
    if (search) {
      queryObject.$or = [
        { status: { $regex: search, $options: 'i' } },
        { jobType: { $regex: search, $options: 'i' } },
        { crNumber: { $regex: search, $options: 'i' } },
        // Add other fields you want to search by
      ];
    }
  }
  else {
    // For non-admin and non-management users, show jobs created in their group
    queryObject = {
      ...queryObject,
    };

    if (status && status !== 'all') {
      queryObject.status = status;
    }
    if (jobType && jobType !== 'all') {
      queryObject.jobType = jobType;
    }
    if (search) {
      queryObject.$or = [
        { status: { $regex: search, $options: 'i' } },
        { jobType: { $regex: search, $options: 'i' } },
        { crNumber: { $regex: search, $options: 'i' } },
        // Add other fields you want to search by
      ];
    }
  }

  // Add conditions for specific groups without including 'group' in queryObject
  if (req.user.group === 'CM ERICSSON') {
    queryObject = {
      ...queryObject,
      team: 'Ericsson',
      status: 'Approved', // Add this condition for 'Approved' status
    };
    delete queryObject.group; // Remove 'group' from queryObject
  } else if (req.user.group === 'CM NOKIA') {
    queryObject = {
      ...queryObject,
      team: 'Nokia',
      status: 'Approved', // Add this condition for 'Approved' status
    };
    delete queryObject.group; // Remove 'group' from queryObject
  } else if (req.user.group === 'CM HUAWEI') {
    queryObject = {
      ...queryObject,
      team: 'Huawei',
      status: 'Approved', // Add this condition for 'Approved' status
    };
    delete queryObject.group; // Remove 'group' from queryObject
  }

  

  // Construct the main query
  let result = Job.find(queryObject);

  // Chain sort conditions
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('position');
  }
  if (sort === 'z-a') {
    result = result.sort('-position');
  }

  // Setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  // Execute the query
  const jobs = await result;
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};







const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { crNumber, startTime, endTime , status} = req.body;

  // Check if the required fields are provided
  if (!crNumber || !startTime || !endTime) {
    throw new BadRequestError('Please provide all values');
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id :${jobId}`);
  }
 // console.log("checkPermission: ",req.user.group, req.job.group, status)
  // Check permissions
  //checkPermissions(req.user.group, req.job.group, status);
 
  // Update the job
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });
};
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id :${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await job.remove();

  res.status(StatusCodes.OK).json({ msg: 'Success! Job removed' });
};
const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  // Adjusted defaultStats properties based on your changes
  const defaultStats = {
    Approved: stats.Approved || 0,
    Implemented: stats.Implemented || 0,
    Cancelled: stats.Cancelled || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
const fetchJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    
       // Fetch data from the Script collection based on the crNumber
    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};


const showAtoll = async (req, res) => {
  let atolls = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  atolls = atolls.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  // Adjusted defaultAtoll properties based on your changes
  const defaultAtolls = {
    Approved: atolls.Approved || 0,
    Implemented: atolls.Implemented || 0,
    Cancelled: atolls.Cancelled || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats , fetchJobById ,showAtoll };