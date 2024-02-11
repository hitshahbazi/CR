import { UnAuthenticatedError } from '../errors/index.js'

const checkPermissions = (usergroup , jobgroup ,status ) => {
  if (usergroup !== jobgroup.toString() || (usergroup.includes("MVO")) ) return

  throw new UnAuthenticatedError('Not authorized to access this route')
}

export default checkPermissions
