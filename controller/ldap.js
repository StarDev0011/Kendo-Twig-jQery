const config = require("config");
const {authenticate} = require('ldap-authentication');
const ldap = require('ldapjs');

const ldapBaseDn = config.get("ldap.baseDn");
const ldapUsersDn = `ou=users,${ldapBaseDn}`;
const server = ldap.createServer();

async function authenticateAccount(username, password) {
  const options = {
    ldapOpts: {
      url: config.get("ldap.url")
    },
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

  try {
    const response = await authenticate(options);
    const result = {
      dn: response.dn,
      firstName: response['givenName'],
      lastName: response['sn'],
      displayName: response.displayName,
      account: response['cn'],
      email: response['mail'],
      isManager: response.groups.filter(group => group.dn.startsWith("cn=managers")).length > 0,
      isOps: response.groups.filter(group => group.dn.startsWith("cn=operators")).length > 0
    };

    console.log(result);
    return result;
  } catch(err) {
    console.log(err);
    throw new Error("Either the account name or password was not correct.");
  }
}

function search() {
  server.search(ldapUsersDn, function(req, res, next) {
    let obj = {
      dn: req.dn.toString(),
      attributes: {
        objectclass: ['organization', 'top'],
        o: 'example'
      }
    };

    if(req.filter.matches(obj.attributes))
      res.send(obj);

    res.end();
  });

}

module.exports.authenticateAccount = authenticateAccount;
