

    Accounts.onCreateUser( ( options, user ) => {
      user.roles = options.roles;
      user.profile = options.profile;
      console.log( user.roles );
      return;
      //user.roles = options.roles;
      //user.profile= {
        //"avatar": ""
      //}
      
      //hack to avoid necessity of user needing to verify their email
      if ( user.profile.roles == "student" ) {
        console.log('in student');
        user.emails[0].verified = true;
      } else {

        Meteor.setTimeout(function(){
          Accounts.sendVerificationEmail(user._id);
        }, 2000);
      }
      
      return user;
    });


if ( Meteor.isServer ) {

    Accounts.validateLoginAttempt(function( attemptInfo ) {
      console.log('in account validation');
      console.log(attemptInfo);
        if ( attemptInfo.type == 'resume' ) return true;

        if ( attemptInfo.methodName == 'createUser' ) return false;

        if ( attemptInfo.methodName == 'login' && attemptInfo.allowed ) {
            var verified = false;
            var email = attemptInfo.methodArguments[0].user.email;
            attemptInfo.user.emails.forEach(function( value, index ) {
                if ( email == value.address && value.verified ) verified = true;
            });
            if ( !verified ) throw new Meteor.Error( 403, 'Verify Email first!' );
        }

        return true;
    });

}

Meteor.users.allow({
    remove: function( userId ) {
        return true;
    },
    update: function( userId ) {
      return true;
    }

});

Accounts.emailTemplates.siteName = "CollectiveUniversity";
Accounts.emailTemplates.from     = "CollectiveUniversity <admin@CollectiveUniversity.com>";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "[CollectiveUniversity] Verify Your Email Address";
  },
  text( user, url ) {
    let emailAddress   = user.emails[0].address,
        name           = user.username.split(' ')[0],
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "support@collectiveUniversity.com",
        emailBody      = `Hello ${name},\n\nThanks for signing up for Corporate University, to begin setting up your platform please click here and sign-on: ${urlWithoutHash}\n\n If you should have any questions, please feel free to contact our support team: ${supportEmail}.\n\nSincerely,\n\nThe Corporate U Team`;

    return emailBody;
  }
};