import React, { Component } from 'react';
import { AsyncStorage, PropTypes, Text } from 'react-native';
import { connect } from 'react-redux';

import { Drawer } from 'react-native-material-design';

import I18n from '../constants/Messages';
import {capitalize} from '../utils/helpers';

class Navigation extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired
    };

    static _getBaseLangCode(code) {
        return code.split('-')[0];
    }

    static _isFallback() {
        let code = Navigation._getBaseLangCode(I18n.locale);
        return !(code in I18n.translations);
    }

    static _isActiveLanguage(langCode) {
        let code = Navigation._getBaseLangCode(langCode);
        return I18n.locale.startsWith(code) ||
            (code == I18n.defaultLocale && Navigation._isFallback());
    }

    componentDidMount() {
        this._loadInitialState();
    }

    async _loadInitialState() {
        this.setState({
            region: JSON.parse(await AsyncStorage.getItem('region'))
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            route: null,
            region: null
        };
    }

    _getLanguageMenuItem(code, name, flag) {
        return {
            value: I18n.t(name),
            image: flag,
            imageStyle: {position: 'absolute', top: 8},
            active: Navigation._isActiveLanguage(code),
            onPress: () => this.changeLanguage(code),
            onLongPress: () => this.changeLanguage(code)
        };
    }

    changeLanguage(code) {
        I18n.locale = code;
        this.changeScene(this.props.route);
    }

    changeScene = (path, name, props={}) => {
        const { drawer, navigator } = this.context;
        const { dispatch } = this.props;

        navigator.to(path, name, props);
        dispatch({type: 'CHANGE_ROUTE', payload: path});
        drawer.closeDrawer();
    };
    
    render() {
        const route = this.props.route;

        if (!this.props.region) {
            return <Text>Choose location first</Text>;
        }

        return (
            <Drawer theme="light">
                <Drawer.Section
                    items={[{
                        icon: 'home',
                        value: I18n.t('HOME'),
                        active: !route || route === 'welcome',
                        onPress: () => this.changeScene('cityChoice', null, {countryId: (this.props.region) ? this.props.region.country.id : null}),
                        onLongPress: () => this.changeScene('cityChoice', null, {countryId: (this.props.region) ? this.props.region.country.id : null})
                    }]}
                    title={this.props.region && `${capitalize(this.props.region.country.name)}, ${capitalize(this.props.region.name)}`}
                />

                <Drawer.Section
                    items={[{
                        icon: 'list',
                        value: I18n.t('LIST_SERVICES'),
                        active: route === 'services',
                        onPress: () => this.changeScene('services'),
                        onLongPress: () => this.changeScene('services')
                    }, {
                        icon: 'map',
                        value: I18n.t('EXPLORE_MAP'),
                        active: route === 'map',
                        onPress: () => this.changeScene('map'),
                        onLongPress: () => this.changeScene('map')
                    }, {
                        icon: 'info',
                        value: I18n.t('GENERAL_INFO'),
                        active: route === 'info',
                        onPress: () => this.changeScene('info'),
                        onLongPress: () => this.changeScene('info')
                    }
                    ]}
                    title={I18n.t('REFUGEE_INFO')}
                />

                <Drawer.Section
                    items={[
                        this._getLanguageMenuItem('en', 'ENGLISH', require('../assets/flags/gb.png')),
                        this._getLanguageMenuItem('fr', 'FRENCH', require('../assets/flags/fr.png')),
                        this._getLanguageMenuItem('ar', 'ARABIC', require('../assets/flags/_Arab_League.png'))
                    ]}
                    title={I18n.t('LANGUAGE')}
                />
            </Drawer>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        route: state.navigation,
        region: state.region
    };
};

export default connect(mapStateToProps)(Navigation);
