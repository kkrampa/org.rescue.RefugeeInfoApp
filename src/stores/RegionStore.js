import Dispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import EventEmitter from 'events';

let _regions = [];

const RegionStore = Object.assign({}, EventEmitter.prototype, {
    addChangeListener(callback) {
        this.on('change', callback);
    },

    removeChangeListener(callback) {
        this.removeListener('change', callback);
    },

    emitChange() {
        this.emit('change')
    },

    getRegions() {
        return _regions;
    }
});

Dispatcher.register((action) => {
    switch (action.actionType) {
    case ActionTypes.LOAD_REGIONS:
        _regions = action.regions;
        RegionStore.emitChange();
    }
});

export default RegionStore;
