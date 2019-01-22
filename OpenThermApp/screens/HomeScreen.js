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

class Temperature extends React.Component {
  state = { temperature: 69 };

  render() {
    return (
      <View style={styles.temperatureContainer}>
        <Text style={styles.temperatureText}>{this.state.temperature}</Text>
        <Text style={styles.temperatureUnit}>°F</Text>
      </View>
    );
  }
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

class TemperatureSlider extends React.Component {
  state = { value: this.props.beginningValue };

  render() {
    return (
      <View style={styles.sliderContainer}>
        <Slider
          value={this.state.value}
          onValueChange={value => this.setState({ value })}
          minimumValue={50}
          maximumValue={100}
          step={1}
        />
        <Text>Set Temperature: {this.state.value}</Text>
      </View>
    );
  }
}

class ControlVerbage extends React.Component {
  state = {
    temp_set_state: TEMP_SET_STATES.PRE,
  };

  handleTempSetPress = () => {
    this.setState({ temp_set_state: TEMP_SET_STATES.IN_PROGRESS });
  };

  handleDonePress = () => {
    this.setState({ temp_set_state: TEMP_SET_STATES.POST });
  };

  render() {
    const { temp_set_state } = this.state;
    return (
      <View style={styles.controlVerbage}>
        {temp_set_state === TEMP_SET_STATES.PRE ? (
          <BetterButton
            buttonText="Set Temperature"
            handlePress={this.handleTempSetPress}
          />
        ) : temp_set_state === TEMP_SET_STATES.IN_PROGRESS ? (
          <>
            <TemperatureSlider beginningValue={69} />
            <BetterButton
              buttonText="Done"
              handlePress={this.handleDonePress}
            />
          </>
        ) : null}
      </View>
    );
  }
}

export default class HomeScreen extends React.Component {
  static navigationOptions = { header: null };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          scrollEnabled={false}
        >
          <View style={styles.header}>
            <Temperature />
          </View>

          <View style={styles.controlBody}>
            <ControlVerbage />
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
});
