
import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, KeyboardAvoidingView } from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import Svg, {
    Circle,
    Ellipse,
    G,
    TSpan,
    TextPath,
    Path,
    Polygon,
    Polyline,
    Line,
    Rect,
    Use,
    Symbol,
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    ClipPath,
    Pattern,
    Mask,
    Image
  } from 'react-native-svg';
const {
    Value,
    event,
    block,
    cond,
    eq,
    set,
    startClock,
    stopClock,
    debug,
    timing,
    clockRunning,
    interpolate,
    Clock,
    Extrapolate,
    concat
    
} = Animated;

const { width, height } = Dimensions.get('window');
function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };

    const config = {
        duration: 1000,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease)
    };

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        timing(clock, state, config),
        cond(state.finished, debug('stop clock', stopClock(clock))),
        state.position
    ]);
}
class MusicApp extends Component {
    constructor() {
        super();

        this.buttonOpacity = new Value(1);

        this.onStateChange = event([
            {
                nativeEvent: ({ state }) =>
                    block([
                        cond(
                            eq(state, State.END),
                            set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
                        )
                    ])
            }
       ]);

       this.onCloseState = event([
        {
            nativeEvent: ({ state }) =>
                block([
                    cond(
                        eq(state, State.END),
                        set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
                    )
                ])
        }
   ]);
        this.buttonY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [100, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.bgY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [-height / 3, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.textInputvalue = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [0, 100],
            extrapolate: Extrapolate.CLAMP
        });

        this.textInputOpacity = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.rotateCross =  interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [180, 360],
            extrapolate: Extrapolate.CLAMP
        });
    }
    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'flex-end', }} behavior="padding" enabled>
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    justifyContent: 'flex-end'
                }}
            >
                <Animated.View
                    style={{
                        ...StyleSheet.absoluteFill,
                        transform: [{ translateY: this.bgY }]
                    }}
                >
                    <Svg height={height} width={width}>
                        <ClipPath id="clip">
                                <Circle r={height} cx={width /2} y={10}></Circle>
                        </ClipPath>
                    <Image
                        href={require('../assets/bg.jpeg')}
                        x = {-500}
                        y= {-500}
                        height={1600}
                        width={1600}
                        preserveAspectRatio= "XMidYmid Slice"
                        clipPath="url(#clip)"
                    />
                    </Svg>
                   
                </Animated.View>
                <View style={{ height: height / 3, justifyContent: 'center', borderColor: 'green' }}>
                    <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                        <Animated.View
                            style={{
                                ...styles.button,
                                opacity: this.buttonOpacity,
                                transform: [{ translateY: this.buttonY }]
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
                        </Animated.View>
                    </TapGestureHandler>
                    <Animated.View
                        style={{
                            ...styles.button,
                            backgroundColor: '#2E71DC',
                            opacity: this.buttonOpacity,
                            transform: [{ translateY: this.buttonY }]
                            ,borderColor: "green"
                        }}
                    >
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                            SIGN IN WITH FACEBOOK
              </Text>
                    </Animated.View>
                   <Animated.View style={{ zIndex: this.textInputZindex, opacity: this.textInputOpacity,
                     tranform: [{translateY:this.textInput}], height: height / 3
                     ,
                      top: null, justifyContent: 'bottom', borderColor: 'black',shadowOffset: {widht: 2, height: 2},
                      shadowColor: "black",
                      shadowOpacity: 0.2 }}>
                         <TapGestureHandler>
                             <Animated.View  style={styles.closeButton}>
                                 <Animated.Text style={{ fontSize: 15, 
                                                        transform: [{ rotate: concat(this.rotateCross, 'deg')}]}}>
                                        X
                                 </Animated.Text>
                             </Animated.View>
                         </TapGestureHandler>
                        <TextInput
                            placeholder="EMAIL"
                            style={styles.textInput}
                            placeholderTextColor="black"></TextInput>
                        <TextInput
                            placeholder="PASSWORD"
                            style={styles.textInput}
                            placeholderTextColor="black" />
                        <Animated.View style={styles.button}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                SIGN IN
                </Text>

                        </Animated.View>

                    </Animated.View>
                </View>
            </View>
            </KeyboardAvoidingView>
        );
    }
}
export default MusicApp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: 'white',
        height: 70,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        shadowOffset: {widht: 2, height: 2},
        shadowColor: "black",
        shadowOpacity: 0.2
    },
    closeButton: {
        height:40,
        width:40,
        backgroundColor: 'white',
        borderRadius: 20,
        backgroundColor: 'white'
        ,alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top:-90,
        left: width/2 -20,
        shadowOffset: {widht: 2, height: 2},
        shadowColor: "black",
        shadowOpacity: 0.2
    }
    ,
    textInput: {
        height: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: 'gray'
    },

});