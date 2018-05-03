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

const navigaionOptions = (left, right, title) => {
	let options = {
		headerTitle: title == undefined ? 'Prestige' : title,
		headerStyle: {
		    backgroundColor: '#86272d',

		},
		headerTextStyle:{
			textAlign: 'center',
		},
		headerTitleStyle: {
			color: 'white',
		    flex: 1,
		    textAlign: 'center'

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