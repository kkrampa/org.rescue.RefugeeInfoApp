import React, { Component, PropTypes, View, Picker } from 'react-native';
import RegionStore from '../stores/RegionStore';
import RegionActions from '../actions/regionActions';

export default class Welcome extends Component {

    static contextTypes = {
        navigator: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            regions: []
        }
    }

    componentDidMount() {
        RegionActions.loadRegions();
    }

    componentWillMount() {
        RegionStore.addChangeListener(this._onChange.bind(this));
    }

    componentWillUnmout() {
        RegionStore.removeChangeListener(this._onChange.bind(this));
    }

    _onChange() {
        const regions = RegionStore.getRegions();
        this.setState({
            regions
        });
    }

    getRegions() {
        return this.state.regions.map((r, idx) => {
            return <Picker.Item key={idx} label={r.name} value={r.id}/>
        });
    }

    render() {
        const { navigator } = this.context;
        return (
            <View>
                <Picker>
                    {this.getRegions()}
                </Picker>
            </View>
        );
    }
}
