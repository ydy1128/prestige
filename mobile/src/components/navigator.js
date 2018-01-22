import React, { Component } from 'react';
import {
	Platform,
	StyleSheet,
	Text,
	TextInput,
	View,
	Image,
	TouchableHighlight
} from 'react-native';

const navigaionOptions = (left, right) => {
	let options = {
		headerTitle: 'Prestige',
		headerStyle: {
		    backgroundColor: '#86272d',
		},
		headerTitleStyle: {
			color: 'white',
		    alignSelf: 'center',
		},
	}
	if(right != undefined){
		options.headerRight = right;
	}
	if(left != undefined){
		options.headerLeft = left;
	}

	return options;
}

export default navigaionOptions;