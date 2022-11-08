/*
 * Copyright © 2022 Anthony Software Group, LLC • All Rights Reserved
 */

const config = require("config"),
  ldap = require('ldapjs'),
  nodemailer = require('nodemailer');

async function dbConnect() {
  return new Promise((resolve, reject) => {
    const ldapClient = ldap.createClient(
      {
        url: config.ldap.host
      });

    ldapClient.bind(config.get("app.username"), config.get("app.password"), function(err) {
      if(err) return reject(err);
      return resolve(ldapClient);
    });
  });
}

module.exports.add = async({cn, sn, email, userPassword, givenName, displayName}) => {
  try {
    const conn = await dbConnect();
    if(conn) {
      return new Promise((resolve, reject) => {
        var entry = {
          sn: sn ?? cn,
          cn: cn,
          mail: email,
          userPassword: userPassword,
          objectClass: ["person", "organizationalPerson", "inetOrgPerson"]
        };
        if(givenName) {
          entry['givenName'] = givenName;
        }
        if(displayName) {
          entry['displayName'] = displayName;
        }
        let cn_user = `cn=${cn},` + config.ldap.baseDn;
        conn.add(cn_user, entry, (err, response) => {
          if(err) return reject(err);

          // add user to group
          var grpInfo = new ldap.Change(
            {
              operation: 'add',
              modification: {
                uniqueMember: cn_user
              }
            });
          let groupname = process.env.MEMBER_GROUP_DN_PATH;
          conn.modify(groupname, grpInfo, function(err) {
            if(err) return reject(err);
            return resolve(cn_user);
          });

          // return resolve(cn_user); // response
        });
      });
    }
  } catch(error) {
    console.log('Something went wrong: Service: add', error);
    throw new Error(error);
  }
};

module.exports.addUserToGroup = async({user_cn, group_type}) => {
  try {
    const conn = await connection.dbConnect();

    if(conn) {
      let user_dn = `cn=${user_cn},` + process.env.USER_DN_PATH;
      return new Promise((resolve, reject) => {
        // add user to group
        var grpInfo = new ldap.Change({
                                        operation: 'add',
                                        modification: {
                                          uniqueMember: user_dn
                                        }
                                      });
        let groupname = (group_type == 'member') ? process.env.MEMBER_GROUP_DN_PATH : process.env.MEMBER_GROUP_DN_PATH;
        conn.modify(groupname, grpInfo, function(err) {
          if(err) return reject(err);
          return resolve(user_dn);
        });
      });
    }
  } catch(error) {
    console.log('Something went wrong: User Service: addUserToGroup', error);
    throw new Error(error);
  }
};

module.exports.updatePassword = async({user_cn, passwordOld, passwordNew}) => {
  try {
    const conn = await connection.dbConnect();
    if(conn) {
      return new Promise((resolve, reject) => {
        let user_dn = `cn=${user_cn},` + process.env.USER_DN_PATH;
        let change = new ldap.Change({
                                       operation: 'replace',  //use add to add new attribute
                                       //operation: 'replace', // use replace to update the existing attribute
                                       modification: {
                                         userPassword: passwordNew
                                       }
                                     });
        conn.bind(user_dn, passwordOld, err => {
          if(err) return reject(err);
          conn.modify(user_dn, change, (err) => {
            if(err) reject(err);
            return resolve(user_dn);
          });
        });
      });
    }
  } catch(error) {
    console.log('Something went wrong: User Service: updatePassword', error);
    throw new Error(error);
  }
};

const searchUserByEmail = module.exports.searchUserByEmail = async({email, givenName, displayName}) => {
  try {
    if(!email && !givenName && !displayName) {
      throw new Error('Please enter atleast one filter condition mail/givenName/displayName');
    }
    const conn = await connection.dbConnect();
    if(conn) {
      return new Promise((resolve, reject) => {
        let mailCond = (email) ? '(mail=' + email + ')' : '';
        let gnCond = (givenName) ? '(givenName=' + givenName + ')' : '';
        let dnCond = (displayName) ? '(displayName=' + displayName + ')' : '';
        var opts = {
          // filter: '(mail='+email+')',  //simple search
          //  filter: '(objectClass=*)',  //simple search
          //  filter: '(&(uid=2)(sn=John))',// and search
          filter: '(|' + mailCond + gnCond + dnCond + ')', // or search
          scope: 'sub',
          attributes: ['cn', 'mail', 'givenName', 'displayName']
        };
        let tmpRes = [];
        conn.search(process.env.USER_DN_PATH, opts, function(err, res) {
          if(err) {
            return reject(err);
          } else {
            res.on('searchEntry', function(entry) {
              // console.log('entry: ' + JSON.stringify(entry.object));
              tmpRes.push(entry.object);
              // return resolve(entry.object);
            });
            res.on('searchReference', function(referral) {
              // console.log('referral: ' + referral.uris.join());
              tmpRes.push(referral.uris.join());
              // return resolve(referral.uris.join());
            });
            res.on('error', function(err) {
              // console.error('error: ' + err.message);
              return reject(err.message);
            });
            res.on('end', function(result) {
              // console.log('end: ' + tmpRes);
              return resolve(tmpRes);
            });
          }
        });
      });
    }
  } catch(error) {
    console.log('Something went wrong: User Service: searchUser', error);
    throw new Error(error);
  }
};

module.exports.forgotPassword = async({user_cn, email}) => {
  try {
    const conn = await connection.dbConnect();
    if(conn) {
      const userData = await searchUserByEmail({email});
      if(userData) {
        return new Promise((resolve, reject) => {
          let user_cn = userData["cn"];
          let tmpPassword = Math.floor(Math.random() * 9000000) + 1000000;
          let user_dn = `cn=${user_cn},` + process.env.USER_DN_PATH;
          let change = new ldap.Change({
                                         operation: 'replace',  //use add to add new attribute
                                         //operation: 'replace', // use replace to update the existing attribute
                                         modification: {
                                           userPassword: tmpPassword
                                         }
                                       });

          conn.modify(user_dn, change, (err) => {
            if(err) reject(err);

            //send mail
            let mail = nodemailer.createTransport({
                                                    host: process.env.SMTP_HOST,
                                                    port: process.env.SMTP_PORT,
                                                    // secure: true, // upgrade later with STARTTLS
                                                    secureConnection: false,
                                                    auth: {
                                                      user: process.env.SMTP_USERNAME,
                                                      pass: process.env.SMTP_PASSWORD
                                                    },
                                                    tls: {
                                                      // rejectUnauthorized: false
                                                      ciphers: 'SSLv3'
                                                    }
                                                  });
            let mailOptions = {
              from: process.env.SMTP_FROM_MAIL,
              to: userData["mail"],
              subject: 'New Password ',
              html: `<p>We have sent you this email in response to your request to reset your password .<br></p>
                <p>Please find your temporary password below.</p><br>
                <p>New Password : ${tmpPassword}</p>
                <p> You need to login and update password as this password is temporary`
            };

            mail.sendMail(mailOptions, function(error, info) {
              if(error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
            return resolve(user_dn);
          });
        });
      }

    }
  } catch(error) {
    console.log('Something went wrong: User Service: updatePassword', error);
    throw new Error(error);
  }
};
