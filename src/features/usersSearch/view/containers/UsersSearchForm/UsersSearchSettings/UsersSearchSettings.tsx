import React from 'react';
import block from 'bem-cn';

import { FormLabel } from 'shared/view/elements';
import { useTranslation, tKeys } from 'services/i18n';
import { ISelectOption } from 'shared/types/form';
import { SelectField, NumberInputField, RadioField, LanguageInputField } from 'shared/view/form';
import { IUsersSearchFilters } from 'shared/types/githubSearch';

import { perPageOptions, fieldNames } from '../constants';
import './UsersSearchSettings.scss';

const b = block('users-search-settings');
const { userSearch } = tKeys.features;

function UsersSearchSettings() {
  const { t } = useTranslation();
  const searchByOptions: Array<ISelectOption<IUsersSearchFilters['searchBy']>> = [
    { value: 'username-email', label: t(userSearch.usernameAndEmail.getKey()) || 'Username & email' },
    { value: 'login', label: t(userSearch.username.getKey()) || 'Username' },
    { value: 'email', label: t(userSearch.email.getKey()) || 'Email' },
    { value: 'fullname', label: t(userSearch.fullName.getKey()) || 'Full name' },
  ];

  return (
    <div className={b()}>
      <div className={b('row')}>
        <div className={b('item')}>
          <SelectField options={searchByOptions} label={t(userSearch.searchBy.getKey())} name={fieldNames.searchBy} />
        </div>
        <div className={b('item')}>
          <SelectField
            options={perPageOptions}
            label={t(userSearch.resultsPerPage.getKey())}
            name={fieldNames.perPage}
          />
        </div>
      </div>
      <div className={b('row')}>
        <div className={b('item')}>
          <FormLabel>
            {t(userSearch.searchType.getKey())}
            <div className={b('checkbox-group')}>
              <RadioField name={fieldNames.searchFor} value="user" label={t(userSearch.user.getKey())} />
              <RadioField name={fieldNames.searchFor} value="org" label={t(userSearch.organizations.getKey())} />
              <RadioField name={fieldNames.searchFor} value="both" label={t(userSearch.both.getKey())} />
            </div>
          </FormLabel>
        </div>
        <div className={b('settings-group')}>
          <div className={b('item')}>
            <FormLabel>
              {t(userSearch.repositoriesNumber.getKey())}
              <div className={b('repos-number')}>
                <div className={b('repos-number-input')}>
                  <NumberInputField
                    name={fieldNames.minRepos}
                    label={t(userSearch.min.getKey())}
                  />
                </div>
                <div className={b('repos-number-input')}>
                  <NumberInputField
                    name={fieldNames.maxRepos}
                    label={t(userSearch.max.getKey())}
                  />
                </div>
              </div>
            </FormLabel>
          </div>
          <div className={b('item')}>
            <LanguageInputField name={fieldNames.reposLanguage} label={t(userSearch.repositoriesLanguage.getKey())} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersSearchSettings;
