
import React, { PropTypes } from 'react';
import MyCalendar from '../components/bigCalendar';
import _ from 'lodash';

MyGlobal.popOver = function(){
    $('body').on('click', function (e) {
        //did not click a popover toggle or popover
        if ($(e.target).data('toggle') !== 'popover'
            && $(e.target).parents('.popover.in').length === 0) {
            $('[data-toggle="popover"]').popover('hide');
        }
    });

    $("[data-toggle=popover]").popover({
        html : true,
        container: 'body',
        content: function() {
            var content = $(this).attr("data-popover-content");
            return $(content).children(".popover-body").html();
        },
        title: function() {
            var title = $(this).attr("data-popover-content");
            return $(title).children(".popover-heading").html();
        }
    });
}

class MyEvent extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount(){
        MyGlobal.popOver();
    }
    render(){
        return (
        <div>
            <div    className="custom_event_content"
                    data-toggle="popover"
                    data-placement="top"
                    data-popover-content={"#custom_event_" + this.props.event.id}
                    tabIndex="0"
                    >
                {this.props.event.title}
            </div>

            <div className="hidden" id={"custom_event_" + this.props.event.id} >
              <div className="popover-heading">
                {this.props.event.driver}
              </div>

              <div className="popover-body">
                {this.props.event.title}<br/>
              </div>
            </div>
        </div>
        );
    }
}

let components = {
    event: MyEvent
}

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);

        var eventsList = Object.keys(props).map(function(k){
            return props[k];
        });

        eventsList.map(function(event){
            event["start"] = new Date(event["start"])
            event["end"] = new Date(event["end"])
        })

        this.state = {
            events: eventsList
        };
    };

    render() {
        return (
            <div>
                <MyCalendar components={components} events={this.state.events}/>
            </div>
        );
    }
}