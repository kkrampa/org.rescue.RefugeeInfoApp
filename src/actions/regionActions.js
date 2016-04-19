import Dispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

const RegionActions = {
    async loadRegions() {
        let response = await fetch('http://api.refugee.info/v1/region/?format=json');
        let regions = await response.json();
        Dispatcher.dispatch({
            actionType: ActionTypes.LOAD_REGIONS,
            regions
        });
    }
};

export default RegionActions;
