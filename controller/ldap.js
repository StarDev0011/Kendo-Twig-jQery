/*
 * Copyright © 2023 Anthony Software Group, LLC • All Rights Reserved
 */

const {authenticate} = require('ldap-authentication'),
  config = require("config"),
  ldap = require('ldapjs'),
  ldapUserDn = config.get("ldap.userDn"),
  logger = require('./logger'),
  server = ldap.createServer();
const url = `ldap://ldap:1389`;

logger.debug(`LDAP URL: ${url}`);

async function authenticateAccount(username, password) {
  logger.debug(`Attempting to authenticate '${username}'`);

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

    logger.debug(`Authenticated '${username}' to ${JSON.stringify(result)}`);
    return result;
  } catch(err) {
    logger.error(`Authentication failed for '${err}'. Host is Host is '${url}'`);
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
