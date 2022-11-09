/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const {authenticate} = require('ldap-authentication'),
  config = require("config"),
  ldap = require('ldapjs'),
  ldapUserDn = config.get("ldap.userDn"),
  logger = require('./logger'),
  server = ldap.createServer(),
  url = `${config.get("ldap.scheme")}://${config.get("ldap.host")}.${config.get("ldap.domain")}:${config.get("ldap.port")}`;

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
    logger.info(user);

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

    logger.info(result);
    return result;
  } catch(err) {
    logger.error(`Login failed for '${err}'. Host is Host is '${url}'`);
    throw new Error("Either the account name or password was not correct.");
  }
}

function search() {
  server.search(ldapUserDn, function(req, res) {
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
module.exports.search = search;
module.exports.url = url;
