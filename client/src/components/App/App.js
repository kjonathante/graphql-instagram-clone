import React, { Component } from "react";

import Events from "../Events/Events";
import EventAdded from "../EventAdded/EventAdded";
import CreateEvent from "../CreateEvent/CreateEvent";
import UploadFile from "../UploadFile/UploadFile";

class App extends Component {
  render() {
    return (
      <div>
        <UploadFile />
        <EventAdded />
        <CreateEvent />
        <Events />
      </div>
    );
  }
}

export default App;
