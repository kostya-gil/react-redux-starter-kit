import React from 'react';
import { connect } from 'react-redux';
import { bind } from 'decko';
import * as R from 'ramda';

import { withTranslation, WithTranslation, tKeys } from 'services/i18n';
import { IAppReduxState } from 'shared/types/app';
import { SearchForm } from 'shared/view/components';
import { replaceObjectKeys } from 'shared/helpers';

import RepositoriesSearchSettings from './RepositoriesSearchSettings/RepositoriesSearchSettings';
import { selectors, actions } from './../../../redux';
import { IRepositoriesSearchFormFields } from '../../../namespace';
import { fieldNames, filtersLabels } from './constants';

interface IOwnProps {
  onSubmit(formValues: IRepositoriesSearchFormFields): void;
}

interface IStateProps {
  isRepositoriesSearchRequesting: boolean;
}

type IActionProps = typeof mapDispatch;

type IProps = IOwnProps & IStateProps & IActionProps & WithTranslation;

const mapDispatch = {
  searchRepositories: actions.searchRepositories,
  resetSearchResults: actions.resetSearchResults,
};

function mapState(state: IAppReduxState): IStateProps {
  return {
    isRepositoriesSearchRequesting: selectors.selectCommunication(state, 'searchRepositories').isRequesting,
  };
}

class RepositoriesSearchForm extends React.PureComponent<IProps> {
  public render() {
    const { isRepositoriesSearchRequesting, resetSearchResults, t } = this.props;
    return (
      <SearchForm<IRepositoriesSearchFormFields>
        searchInputName={fieldNames.searchString}
        isSearchRequesting={isRepositoriesSearchRequesting}
        submitButtonText={t(tKeys.shared.search.getKey())}
        settingsButtonText={t(tKeys.shared.settings.getKey())}
        onSubmit={this.handleFormSubmit}
        resetSearchResults={resetSearchResults}
        renderSettings={RepositoriesSearchSettings}
        getFilters={this.getFilters}
      />
    );
  }

  @bind
  private getFilters(formValues: IRepositoriesSearchFormFields) {
    const filters = R.omit([fieldNames.searchString], formValues);
    return replaceObjectKeys(filters, filtersLabels);
  }

  @bind
  private handleFormSubmit(formValues: IRepositoriesSearchFormFields) {
    const { searchRepositories, onSubmit } = this.props;
    searchRepositories({ searchOptions: formValues, page: 1 });
    onSubmit(formValues);
  }
}

const connectedComponent = connect(mapState, mapDispatch)(RepositoriesSearchForm);

export { RepositoriesSearchForm, IProps as IRepositoriesSearchFormProps };
export default withTranslation()(connectedComponent);
