import Script from '../models/Script.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';

const createScript = async (req, res) => {
  console.log("req.body: ", req.body);

  try {
    // Validate the request body against the validation schema
    // Assuming there's an array of scripts in req.body.scripts
    const { scripts } = req.body;

    if (!scripts || !Array.isArray(scripts) || scripts.length === 0) {
      throw new BadRequestError('Invalid or empty script data.');
    }

    // Create an array to store the created scripts
    const createdScripts = [];

    // Loop through each script in the array
    for (const scriptData of scripts) {
      // Create a new instance of the Script model for each script
      const script = await Script.create(scriptData);
      console.log("script in backend:", script);

      // Add the created script to the array
      createdScripts.push(script);
    }

    res.status(StatusCodes.CREATED).json({ scripts: createdScripts });
  } catch (error) {
    console.error('Error creating script:', error);
    throw new BadRequestError(error.message);
  }
};

const exportScripts = async (req, res) => {
  const { crNumber } = req.query;

  try {
    // Fetch scripts based on crNumber
    const exportedScripts = await Script.find({ crNumber });
    console.log("Exported scripts in controller:", exportedScripts);
    if (!exportedScripts || exportedScripts.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No scripts found for the provided crNumber' });
    }

    // Log the exported scripts to console.log
   

    // Send the scripts as a response
    res.status(StatusCodes.OK).json({ exportedScripts });
  } catch (error) {
    console.error('Error exporting scripts:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal Server Error' });
  }
};

const updateScript = async (req, res) => {
  console.log("req.body: ", req.body);

  try {
    // Validate the request body against the validation schema
    // Assuming there's an array of updated scripts in req.body.updatedScripts
    const { updatedScripts } = req.body;

    if (!updatedScripts || !Array.isArray(updatedScripts) || updatedScripts.length === 0) {
      throw new BadRequestError('Invalid or empty script data.');
    }

    // Create an array to store the updated scripts
    const updatedScriptIds = [];

    // Loop through each updated script in the array
    for (const updatedScriptData of updatedScripts) {
      // Find the script in the database by its rowid and crNumber and update it with the new data
      const filter = { rowid: updatedScriptData.rowid, crNumber: updatedScriptData.crNumber };
      const updatedScript = await Script.findOneAndUpdate(filter, updatedScriptData, { new: true });
      
      if (!updatedScript) {
        throw new NotFoundError(`Script not found with rowid: ${updatedScriptData.rowid} and crNumber: ${updatedScriptData.crNumber}`);
      }

      console.log("updatedScript in backend:", updatedScript);

      // Add the ID of the updated script to the array
      updatedScriptIds.push(updatedScript._id);
    }

    res.status(StatusCodes.OK).json({ updatedScriptIds });
  } catch (error) {
    console.error('Error updating script:', error);
    throw new BadRequestError(error.message);
  }
};




export { createScript, exportScripts, updateScript };
