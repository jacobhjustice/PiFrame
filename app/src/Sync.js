import React from 'react';
const images = require.context('../public/img/icon', true);

// Sync triggers a full reload of the Frame
export class Sync  extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div id="sync" className={this.props.isHidden ? "hidden" : "button"} onClick={this.props.updateCallback}>
                <img src={images('./refresh.svg') } alt=""/>
                <div className="header">Sync</div>                
            </div>
        );
    }
}
