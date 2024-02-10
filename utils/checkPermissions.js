import { UnAuthenticatedError } from '../errors/index.js'

const checkPermissions = (requestUser, resourceUserId , usergroup ,status ) => {
  if (requestUser.userId === resourceUserId.toString() || (usergroup.includes("CM") && status==='Approved') ) return

  throw new UnAuthenticatedError('Not authorized to access this route')
}

export default checkPermissions
