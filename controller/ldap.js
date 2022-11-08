/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const config = require("config");
const {authenticate} = require('ldap-authentication');
const ldap = require('ldapjs');

const ldapUserDn = config.get("ldap.userDn"),
  server = ldap.createServer(),
  url = `ldap://${config.get("ldap.host")}.${config.get("app.domain")}:${config.get("ldap.port")}`;

async function authenticateAccount(username, password) {
  let options = {
    ldapOpts: {
      url: url
    },
    userDn: `cn=${username},${ldapUserDn}`,
    userPassword: password,
    userSearchBase: ldapUserDn,
    usernameAttribute: 'cn',
    username: username,
    groupsSearchBase: ldapUserDn,
    groupClass: 'groupOfNames',
    groupMemberAttribute: 'member',
    attributes: ['dn', 'sn', 'cn', 'givenName', 'mail', 'displayName']
  };

  try {
    let user = await authenticate(options);
    console.log(user);

    const result = {
      dn: user.dn,
      firstName: user['givenName'],
      lastName: user['sn'],
      displayName: user.displayName,
      account: user['cn'],
      email: user['mail'],
      isManager: user.groups.filter(group => group.dn.startsWith("cn=managers")).length > 0,
      isOps: user.groups.filter(group => group.dn.startsWith("cn=operators")).length > 0
    };

    console.log(result);
    return result;
  } catch(err) {
    console.log(`Login failed for '${err}'. Host is Host is '${url}'`);
    throw new Error("Either the account name or password was not correct.");
  }
}

function search() {
  server.search(ldapUserDn, function(req, res, next) {
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
module.exports.url = url;
