import React from 'react';
import {
  Dimensions,
  ScrollView,
  Slider,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

const TEMP_SET_STATES = Object.freeze({ PRE: 1, IN_PROGRESS: 2, POST: 3 });
const DEFAULT_TEMPERATURE = 69;
const NOTIFICATION_TIMEOUT = 3;

function Temperature({ value }) {
  return (
    <View style={styles.temperatureContainer}>
      <Text style={styles.temperatureText}>{value}</Text>
      <Text style={styles.temperatureUnit}>°F</Text>
    </View>
  );
}

function BetterButton({ buttonText, handlePress }) {
  return (
    <TouchableHighlight onPress={handlePress} underlayColor="white">
      <View style={styles.button}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </View>
    </TouchableHighlight>
  );
}

class IncDecButton extends React.Component {
  handlePress = () => {
    this.props.passUpChange(this.props.displayChar)
  }

  render() {
    return (
      <TouchableHighlight onPress={this.handlePress} underlayColor="white">  
        <View style={this.props.viewStyle}>
          <Text style={styles.incDecText}>{this.props.displayChar}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

class TemperatureSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.beginningValue };
    this.props.passUpValue(this.state.value);
  }

  handleValueChange(value) {
    this.setState({ value });
    this.props.passUpValue(this.state.value);
  }

  render() {
    return (
      <View style={styles.sliderContainer}>
        <Slider
          value={this.state.value}
          onValueChange={value => this.setState({ value })}
          onSlidingComplete={this.handleValueChange.bind(this)}
          minimumValue={50}
          maximumValue={100}
          step={1}
        />
        <Text style={styles.sliderText}>Temperature will be set to <Text style={{fontWeight: "bold"}}>{this.state.value}</Text></Text>
      </View>
    );
  }
}

class Notification extends React.Component {
  state = {
    visible: true
  }

  render() {
    return (
      this.state.visible ? (
        <Text style={styles.notificationText}>{this.props.text}</Text>
      ) : null
    );
  }
}

class ControlVerbage extends React.Component {
  state = {
    tempSetState: TEMP_SET_STATES.PRE,
    notificationVisible: true,
    tempValue: DEFAULT_TEMPERATURE,
  };

  handleTempSetPress = () => {
    this.setState({ tempSetState: TEMP_SET_STATES.IN_PROGRESS, notificationVisible: true });

    // Ensure residual notification timeout is cleared
    clearTimeout(this.notificationTimeoutHandle);
  };

  handleDonePress = () => {
    this.setState({ tempSetState: TEMP_SET_STATES.POST });
    this.beginNotificationDeath();
    this.props.passUpValue(this.state.tempValue);
  };

  beginNotificationDeath = () => {
    // Stop displaying notification after NOTIFICATION_TIMEOUT seconds
    this.notificationTimeoutHandle = setTimeout(() => {
      this.setState({ notificationVisible: false });
    }, NOTIFICATION_TIMEOUT * 1000);
  }

  updateNewTempValue = (type) => {
    if (type == '-') {
      this.setState({ tempValue: this.state.tempValue - 1});
    }
    else {
      // Default to plus (+)
      this.setState({ tempValue: this.state.tempValue + 1});  
    }
  }

  render() {
    const { tempSetState } = this.state;
    const { notificationVisible } = this.state;

    return (
      <View style={styles.controlVerbage}>
        {tempSetState === TEMP_SET_STATES.PRE ? (
          <BetterButton
            buttonText="Set Temperature"
            handlePress={this.handleTempSetPress}
          />
        ) : tempSetState === TEMP_SET_STATES.IN_PROGRESS ? (
          <>
            {/*<TemperatureSlider passUpValue={this.updateNewTempValue} beginningValue={this.state.newTempValue} />*/}
            <View style={styles.incDecButtonContainer}>
              <IncDecButton passUpChange={this.updateNewTempValue} viewStyle={styles.incDecButton} displayChar='-' />
              <IncDecButton passUpChange={this.updateNewTempValue} viewStyle={styles.incDecButton}  displayChar='+' />
            </View>
            <BetterButton
              buttonText="Done"
              handlePress={this.handleDonePress}
            />
          </>
        ) : tempSetState == TEMP_SET_STATES.POST && notificationVisible ? (
          <>
            <BetterButton
              buttonText="Set Temperature"
              handlePress={this.handleTempSetPress}
            />
            <Notification text="Temperature set!" />
          </>
        ) : (
          <>
            <BetterButton
              buttonText="Set Temperature"
              handlePress={this.handleTempSetPress}
            />
          </>
        )}
      </View>
    );
  }
}

export default class HomeScreen extends React.Component {
  state = {
    temperature: DEFAULT_TEMPERATURE,
  };

  static navigationOptions = { header: null };

  updateTemperatureValue = (value) => {
    this.setState({temperature: value});
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          scrollEnabled={false}
        >
          <View style={styles.header}>
            <Temperature value={this.state.temperature}/>
          </View>

          <View style={styles.controlBody}>
            <ControlVerbage passUpValue={this.updateTemperatureValue} />
            <View style={styles.controlBackground} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  header: {
    flex: 1,
    alignItems: 'center',
  },
  temperatureContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    flexDirection: 'row',
  },
  temperatureText: {
    fontSize: 170,
  },
  temperatureUnit: {
    fontSize: 30,
    paddingTop: 45,
  },
  controlBody: {
    flex: 1,
  },
  controlVerbage: {
    position: 'absolute',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    zIndex: 1,
    paddingTop: 90,
  },
  controlBackground: {
    // Create an oval topped shape that fills the page
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    borderRadius: Dimensions.get('window').width / 2,
    borderTopColor: 'black',
    borderWidth: 1,
    backgroundColor: '#CEE2FF',
    transform: [{ scaleX: 2 }],
  },
  button: {
    marginBottom: 30,
    width: 220,
    alignItems: 'center',
    backgroundColor: '#003366',
    borderRadius: 220 / 14,
  },
  buttonText: {
    padding: 20,
    fontSize: 23,
    color: 'white',
  },
  sliderContainer: {
    flex: 1,
    width: 300,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  sliderText: {
    textAlign: 'center',
    paddingBottom: 20,
  },
  notificationText: {
    fontSize: 18,
    color: 'green',
  },
  incDecButtonContainer: {
    flex: 1,
    width: 300,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  incDecButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0052a5',
    margin: 20,
    height: 70,
    width: 70,
    borderRadius: 70,
  },
  incDecText: {
    fontSize: 30,
    color: 'white',
    paddingBottom: 40,
  },
});
