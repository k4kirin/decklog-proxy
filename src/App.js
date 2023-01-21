import React, { Component } from 'react'
import Author from './Author';
import Header from './Header';
import Searchbar from './Searchbar';
import './App.css';

export default class App extends Component {
    componentDidMount(){
        document.title = "Bushiroad Decklog Proxy Tool"
    }
    render() {
        return (
            <div>
                <Author/>
                <Header/>
                <Searchbar/>
            </div>
        )
    }

}