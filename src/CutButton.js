import React from 'react';
import {connect} from 'react-redux';
import {getDistanceModelsFromSlices} from './get-distance-models-from-slices'
import {getMarkupOutput} from './get-output.js'
import {setAppValue} from './redux-actions/app-actions.js'

class CutButton extends React.Component {

  constructor() {
    super();
    //set initial local state
    this.state = {
      hasBeenPressed: false
    }
  }

  handleCutButton() {
    console.log('CUT!!!');

    const {imageHeight, slices} = this.props;

    //Bail if no access token
    if (!this.props.salesforceAuthToken) {
      console.warn('No access token in `handleCutButton`')
      return;
    }

    //Update state to disable button
    this.setState({
      hasBeenPressed: true
    });


    let request = new Request('http://localhost:4000/cut', {
      method: 'POST',
      body: JSON.stringify({
        accessToken: this.props.salesforceAuthToken,
        srcImg: this.props.imageSrc,
        sliceYs: getDistanceModelsFromSlices(imageHeight, slices)
      })
    });
    fetch(request).then(response => {
      return response.json(); //baggage of Request
    }).then(response => {
      const result = response.data;
      console.log(result);

      //Sample response: [ {sliceId:"a", publishedUrl: "/a/s/asdasd.jpg"} ]
      //So we can map the new image back to the slice.

      //Get the markup and put in a new browser tab
      // launchNewBrowserTab(
      setAppValue({
        outputText: getMarkupOutput(result)
      })


      // );
    })

  }

  render() {

    if (this.state.hasBeenPressed) {
      return (
        <button disabled={true}>Working...</button>
      )
    }

    return (
      <button onClick={this.handleCutButton.bind(this)}>
        CUT!
      </button>
    )
  }
}

export default connect((state, props) => {
  return {
    salesforceAuthToken: state.app.salesforceAuthToken,
    imageSrc: state.app.imageSrc,
    slices: state.app.slices,
    imageHeight: state.app.imageHeight,
  }
})(CutButton)