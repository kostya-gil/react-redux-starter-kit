import * as React from 'react';
import block from 'bem-cn';
import * as Select from 'react-select';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { bind } from 'decko';

import { actions, selectors } from './../../../redux';

import { IAppReduxState } from 'shared/types/app';
import { ILocation, IArea, ICity } from 'shared/types/models';
import { IReduxState } from '../../../namespace';

import { FormControl } from 'react-bootstrap';
import GoogleMap, { ILocation as MapLocation } from 'shared/view/components/GoogleMap/GoogleMap';
import SelectInput from 'shared/view/elements/SelectInput/SelectInput';
import './LocationSelect.scss';

interface IOwnProps {
  onChange?(location: ILocation | null): void;
}

interface IStateProps {
  options: Select.Option[];
  selectedLocation: ILocation | null;
  showLocation: boolean;
}

interface IDispatchProps {
  loadCities: typeof actions.loadCities;
  selectLocation: typeof actions.selectLocationByAreaId;
}

type Props = IStateProps & IDispatchProps & IOwnProps;

function mapState(state: IAppReduxState): IStateProps {
  const ownState: IReduxState = selectors.getFeatureState(state);
  const selectedLocation = selectors.selectSelectedLocation(state);

  return {
    options: Object.keys(ownState.data.entities.areas).map<Select.Option>(
      (areaId: string) => {
        const area: IArea = ownState.data.entities.areas[parseInt(areaId, 10)];
        return { label: area.displayName, value: area.id };
      },
    ),
    selectedLocation: selectedLocation && {
      point: selectedLocation.point,
      area: selectors.selectAreaById(state, selectedLocation.area),
      city: selectors.selectCityById(state, selectedLocation.city),
    },
    showLocation: ownState.ui.showSelectedLocation,
  };
}

function mapDispatch(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    loadCities: actions.loadCities,
    selectLocation: actions.selectLocationByAreaId,
  }, dispatch);
}

const b = block('location-select');

class LocationSelect extends React.Component<Props> {
  public componentWillReceiveProps(nextProps: Props) {
    const { onChange } = this.props;
    // notify subscribed components (if they are exist), if selected location changed
    if (nextProps.selectedLocation !== this.props.selectedLocation) {
      if (onChange) {
        onChange(nextProps.selectedLocation);
      }
    }
  }

  public componentDidMount() {
    this.props.loadCities();
  }

  public render() {
    const { options, selectedLocation } = this.props;
    const selectedArea: IArea | null = selectedLocation ? selectedLocation.area : null;
    const selectedCity: ICity | null = selectedLocation ? selectedLocation.city : null;
    const showSelectedAreaOnMap: boolean = this.props.showLocation;

    return (
      <div className={b()}>
        <div className={b('form')()}>
          <label className={b('label')()}><b>Location:</b></label>
          <SelectInput
            className={b('input')()}
            options={options}
            value={selectedArea ? selectedArea.id : ''}
            onChange={this.onSelectLocation}
          />
          <FormControl
            value={selectedArea ? selectedArea.name : ''}
            className={b('input')()}
            type="text"
            placeholder="Area"
            disabled
          />
          <FormControl
            className={b('input')()}
            value={selectedCity ? selectedCity.name : ''}
            type="text"
            placeholder="City"
            disabled
          />
        </div>
        <div className={b('map')()}>
          <GoogleMap
            lat={selectedArea ? selectedArea.point.lat : undefined}
            lng={selectedArea ? selectedArea.point.lng : 0}
            showNewPoint={showSelectedAreaOnMap}
            onLocationSelected={this.onSelectMapLocation}
          />
        </div>
      </div>
    );
  }

  @bind
  private onSelectLocation(item: Select.Option | Select.Option[] | null) {
    if (!item || Array.isArray(item)) {
      this.props.selectLocation({ showOnMap: false });
    } else {
      this.props.selectLocation({
        location: {
          areaID: +(item.value || 0),
        },
        showOnMap: true,
      });
    }
  }

  @bind
  private onSelectMapLocation(location: MapLocation) {
    const selectedAreaName: string = `${location.locality}, ${location.area}`;
    const areas = this.props.options;

    const selectedAreaOption: Select.Option | undefined =
      areas.find((area: Select.Option) => area.label === selectedAreaName);

    if (selectedAreaOption) {
      const point = location.point ? { lat: location.point.lat(), lng: location.point.lng() } : undefined;
      this.props.selectLocation({
        location: { areaID: selectedAreaOption.value as number, point },
        showOnMap: false,
      });
    } else {
      this.props.selectLocation({ showOnMap: false });
    }
  }
}

export { Props };
export default connect(mapState, mapDispatch)(LocationSelect);