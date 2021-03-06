import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

import moment from 'moment';

const DATA = {
  timer: 1234567,
  laps : [12345, 2345, 34567, 98765],
}

function Timer({ interval, style }){

  const pad = (n) => n < 10 ? '0' +n :n ;
  const duration  = moment.duration(interval);
  const centiSeconds = Math.floor(duration.milliseconds() / 10);
  return (
    <View style= {styles.timerContainer}>
    <Text style={style}>{pad(duration.minutes())}:</Text>
    <Text style={style}>{pad(duration.seconds())}:</Text>
    <Text style={style}>{pad(centiSeconds)}</Text>
  </View>
  )
}

function RoundButton({ title, color, background, onPress, disabled }) {
  return (
    <TouchableOpacity 
    onPress = {() => !disabled && onPress()}
    style= {[styles.button, {backgroundColor: background}]}
    activeOpacity= {disabled ? 1: 0.7}
    >
      <View style= {styles.buttonBorder}>
      <Text style={[ styles.buttonTitle, { color }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

function ButtonsRow({ children }) {
  return (
    <View style= {styles.buttonsRow}>
    {children}
    </View>
  )
}

function Lap( { number, interval, fastest, slowest}){

  
  const lapStyle = [
    styles.lap,
    fastest && styles.fastest, 
    slowest && styles.slowest
  ]
  return (
    <View style= {styles.laps}>
      <Text style={ lapStyle} >Lap {number}</Text>
      <Timer style={ [lapStyle, styles.laptimer] } interval= {interval} />
    </View>
  )
}


function LapsTable( { laps, timer }) {
  const finishedLaps = laps.slice(1);
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;

  if( finishedLaps.length >= 2) {
    finishedLaps.forEach(lap => {
      if(lap < min ){
        min = lap;
      }
      if( lap > max) {
        max = lap;
      }
    });
  }

  return (
    <ScrollView style= {styles.scrollView}>
    { laps.map((lap, index)=> (
      <Lap 
      number={laps.length - index}
      key={laps.length - index} 
      interval={index === 0 ? timer + lap: lap} 
      slowest ={ lap === min}
      fastest ={ lap === max} />
    ))}
      </ScrollView>
  )
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start: 0,
      now: 0,
      laps : [],
    }
  }

  start = () => {
    const now = new Date().getTime();

    this.setState({
      start: now,
      now, 
      laps:[0]
    })

    this.timer = setInterval(() => {
      this.setState({now: new Date().getTime()})
    }, 100);
  }


  lap = () => {
    const timestamp = new Date().getTime()
    const  { laps, now, start } = this.state;
    const [firstLap, ...other] = laps;
    this.setState({
        laps: [0, firstLap + now - start, ...other],
        start: timestamp,
        now: timestamp
    })
  }

  stop = () => {
    clearInterval(this.timer);
    const  { laps, now, start } = this.state;
    const [firstLap, ...other] = laps;
    this.setState({
        laps: [firstLap + now - start, ...other],
        start: 0,
        now: 0
    })
  }


  resume = () => {
    const now = new Date().getTime();

    this.setState({
      start: now,
      now: now
    })

    this.timer = setInterval(() => {
      this.setState({now: new Date().getTime()})
    }, 100);

  }

  reset = () => {
    this.setState({
      laps: [],
      start:0,
      now: 0
    })
  }

  render() {
    const { now, start , laps } = this.state;
    const timer = now - start ;

    return (
      <View style={styles.container}>
       <Timer 
        interval = {laps.reduce((total, curr)=> total + curr, 0) + timer} 
        style = {styles.timer}></Timer>

       { laps.length === 0 && (
        <ButtonsRow>
          <RoundButton 
          title='Lap' 
          color='#FAFAFA' 
          background='#151515' 
          disabled/>
          <RoundButton 
            title='Start'
            color='#50D167' 
            background='#1B361F' 
            onPress= { this.start } />
        </ButtonsRow>
       )}

       { start > 0 && (

        <ButtonsRow>
        <RoundButton 
         title='Lap' 
         color='#FFFFFF' 
         background='#3D3D3D'
         onPress = { this.lap } />
        <RoundButton 
        title='Stop'
        color='#E33935' 
        background='#3C1715' 
        onPress= { this.stop }/>
     </ButtonsRow> ) 
        }
     
       { laps.length > 0 &&  start === 0 && (

       <ButtonsRow>
       <RoundButton 
        title='Reset' 
        color='#FFFFFF' 
        background='#3D3D3D'
        onPress = { this.reset } />
       <RoundButton 
        title='Start'
        color='#50D167' 
        background='#1B361F' 
       onPress= { this.resume }/>
    </ButtonsRow> ) 
       }

       <LapsTable laps={laps} timer = {timer}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    paddingTop: 130,
    paddingHorizontal: 20
  },
  timer: {
    color: '#fff',
    fontSize: 76,
    fontWeight: '200',
    width: 110,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTitle: {
    fontSize: 18
  },
  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 30,
  },
  lap: {
    color: '#fff',
    fontSize: 18,
  },
  laptimer: {
    width: 30
  },
  laps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#151515',
    borderWidth: 1,
    paddingVertical: 10,
  },
  scrollView: {
    alignSelf: 'stretch'
  },
  fastest: {
    color: '#4BC05F'
  },
  slowest: {
    color: '#CC3351'
  },
  timerContainer:{
    flexDirection: 'row'
  }
});
