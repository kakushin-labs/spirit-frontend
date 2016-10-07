// -------------------------------------------------------------
// This file contains a page that allows users to check domain
// registration details including expiry date.
// -------------------------------------------------------------

import React from 'react'
import recess from 'react-recess'
import GraphOuter from './shared-graph/graph-outer.jsx'
import apiLayer from '../libs/api-layer'
import _ from 'lodash'

export default class MetricsOuter extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            graphs: []
        }
    }

    newGraph (type) {
        apiLayer.graphs.createGraph({ type: type })
        .then((data) => {
            data.graph.settingsVisible = true;
            this.state.graphs.push(data.graph);
            this.setState({
                graphs: this.state.graphs
            });
        });
    }

    saveGraph (identifier, graphProps) {
        apiLayer.graphs.updateGraph(identifier, graphProps)
        .then((data) => {
            data.graph.settingsVisible = false;
            const index = _.indexOf(this.state.graphs, g => g.identifier === identifier );
            this.state.graphs[index] = data.graph;
            this.setState({
                graphs: this.state.graphs
            })
        });
    }

    deleteGraph (identifier) {
        apiLayer.graphs.deleteGraph(identifier)
        .then(() => {
            const index = _.indexOf(this.state.graphs, g => g.identifier === identifier );
            this.state.graphs.splice(index, 1)
            this.setState({ graphs: this.state.graphs })
        });
    }

    componentDidMount() {
        apiLayer.graphs.getGraphs()
        .then((data) => {
            this.setState({
                graphs: data.graphs
            })
        })
    }

    render () {
        const styles = {
            '.dashboard': {
                width: '100%',
                overflow: 'auto',
                padding: '5px',
                background: '#f8f8f8',
                display: 'flex',
                flexGrow: 1,
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                alignContent: 'flex-start',

                '.title': {
                    width: '100%',
                    font: '200 20px "Open Sans"',
                    color: '#666',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',

                    '.addGraph': {
                        marginLeft: '10px',
                        font: '400 14px "Open Sans"',
                        color: '#aaa',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',

                        'i': {
                            fontSize: '16px',
                            color: '#666',
                            marginRight: '8px'
                        },

                        ':hover': {
                            background: '#eee'
                        },

                        ':active': {
                            background: '#e5e5e5'
                        }
                    }
                }
            }
        };

        const graphs = this.state.graphs.map((graph) => {
            // New graph
            return <GraphOuter {...graph} key={graph.identifier} saveGraph={this.saveGraph.bind(this)} deleteGraph={this.deleteGraph.bind(this, graph.identifier)} />
        });

        let outer = (
            <div className='dashboard'>
                <div className='title'>
                    Upstairs Greenhouse, General Metrics
                    <div className='addGraph' onClick={this.newGraph.bind(this, 'line')}><i className='lnr lnr-plus-circle'></i>New Graph</div>
                </div>
                {graphs}
            </div>
        );

        outer = recess(outer, styles, this);
        
        return outer;
    }
};