const Admin = require('../models/Admin');
const Partner = require('../models/Partner');

const userLogin = async (credentials, res) => {
  let { username, password } = credentials;

  // First we need to check if the user is an admin or a partner

  let adminUsernameRegex = /^(?=.{19,29}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.admin$/;
  let partnerUsernameRegex = /^(?=.{21,31}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])@ninjaco\.partner$/;

  if(adminUsernameRegex.test(username)) {
    
  } else if(partnerUsernameRegex.test(username)) {
      
  } else {
      return res.status(404).json({
          success: false,
          message: 'Username not found.',
      })
  }
};