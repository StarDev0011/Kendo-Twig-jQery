const {authenticate} = require('ldap-authentication');
const ldapBaseDn = 'dc=aces,dc=anthony-sw,dc=cloud'
const ldapUsersDn = `ou=users,${ldapBaseDn}`

module.exports.authenticateAccount = async function(username, password) {
  let userDn = `cn=${username},${ldapUsersDn}`;
  let options = {
    ldapOpts: { url: 'ldap://ldap.aces.local:1389' },
    adminDn: `cn=admin,${ldapBaseDn}`,
    adminPassword: 'adminpassword',
    userDn: ldapUsersDn,
    verifyUserExists: true,
    userSearchBase: ldapUsersDn,
    usernameAttribute: 'cn',
    username: username,
    userPassword: password,
    attributes: ['dn', 'sn', 'cn', 'givenName', 'mail', 'displayName'],
    groupsSearchBase: ldapUsersDn,
    groupClass: 'groupOfNames',
    groupMemberAttribute: 'member'
  };

  let result = await authenticate(options);
  console.log(result)
  return result
}
