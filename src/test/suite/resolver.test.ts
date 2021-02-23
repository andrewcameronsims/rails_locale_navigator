import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { getRelated } from '../../resolver';

suite('Path resolution', () => {
  const testLocale = 'en';
  const codeFilenames = [
    'Users/developer/rails_app/app/components/users/profile_component.rb',
    'Users/developer/rails_app/app/components/users/profile_component.html.erb',
    'Users/developer/rails_app/app/helpers/announcements_helper.rb',
    'Users/developer/rails_app/app/models/user',
    'Users/developer/rails_app/app/views/users/index.html.erb',
    'Users/developer/rails_app/app/controllers/users_controller.rb',
    'Users/developer/rails_app/app/dashboards/account_invitation_dashboard.rb',
    'Users/developer/rails_app/app/extensions/queries/users/find_by_account_and_email.rb',
    'Users/developer/rails_app/app/extensions/charts/scores_by_month.rb',
    'Users/developer/rails_app/app/mailers/user_mailers/account_invitations_mailer.rb'
  ];
  const localeFilenames = [
    'User/developer/rails_app/config/locales/components/users/profile_component.en.yml',
    'User/developer/rails_app/config/locales/components/users/profile_component.en.yml',
    'User/developer/rails_app/config/locales/models/user.en.yml',
    'User/developer/rails_app/config/locales/views/users/index.en.yml',
    'User/developer/rails_app/config/locales/controllers/users.en.yml',
    'User/developer/rails_app/config/locales/dashboards/account_invitation_dashboard.en.yml',
    'User/developer/rails_app/config/locales/queries/users/find_by_account_and_email.en.yml',
    'User/developer/rails_app/config/locales/charts/scores_by_month.en.yml',
    'User/developer/rails_app/config/locales/mailers/account_invitations_mailer.en.yml'
  ];

	test('getRelated', () => {
    test('resolves locale filenames', () => {
      codeFilenames.forEach((codeFilename, index) => {
        assert.strictEqual(getRelated(codeFilename, testLocale), localeFilenames[index]);
      });
    });

    test('resolves code filenames', () => {
      localeFilenames.forEach((localeFilename, index) => {
        assert.strictEqual(getRelated(localeFilename, testLocale), codeFilenames[index])
      })
    });
	});
});
