import React, {Component} from 'react'
import './Crypto.css';
import axios from 'axios';
import CryptoList from './CryptoList';
class Crypto extends Component{
    constructor(props){
        super(props);
        this.state = {
            cryptoList: [],
            filteredCryptoList: [],
        };
    }

    componentDidMount() {
        this.getCryptoData();
        this.timerID = setInterval(() => this.getCryptoData(), 5000);
    }

    coponentWillUnmount(){
        clearInterval(this.timerID);
    }
    getCryptoData = () => {
        axios.get('https://blockchain.info/pl/ticker').then(res => {
            const tickers = res.data;
            this.setState((state) => {
                let newCryptoList = [];
                for(const [ticker, cryptoRate] of Object.entries(tickers)){
                    let lastCryptoObj = state.cryptoList.find((cryptoObj) => {
                        return(cryptoObj.currency === ticker);
                    });

                    let newCryptoObj = {
                        currency: ticker,
                        symbol: cryptoRate.symbol,
                        buy: cryptoRate.buy,
                        sell: cryptoRate.sell,
                        lastRate: cryptoRate.last
                    }

                    if(lastCryptoObj !== undefined){
                        if(newCryptoObj.lastRate > lastCryptoObj.lastRate){
                            newCryptoObj.cssClass = 'green';
                            newCryptoObj.htmlArray = String.fromCharCode(8593);
                        }   else if (newCryptoObj.lastRate < lastCryptoObj.lastRate) {
                            newCryptoObj.cssClass = 'red';
                            newCryptoObj.htmlArray = String.fromCharCode(8595);
                        }   else    {
                            newCryptoObj.cssClass = 'blue';
                            newCryptoObj.htmlArray = String.fromCharCode(8596);
                        }
                    }   else    {
                        newCryptoObj.cssClass = 'blue';
                        newCryptoObj.htmlArray = String.fromCharCode(8596);
                    }

                    newCryptoList.push(newCryptoObj);
                }

                return({
                    cryptoList: newCryptoList
                });
            });
            this.filterCryptoList();
        });
    }

    filterCryptoList = () => {
        this.inputFilter.value = this.inputFilter.value.trim().toUpperCase();
        
        this.setState((state)=>{
            let newFilteredCryptoList = state.cryptoList.filter((cryptoObj)=>{
                return(cryptoObj.currency.includes(this.inputFilter.value));
            });
        

            return({
                filteredCryptoList: newFilteredCryptoList
            });
        });
    }

    render(){
        return(
            <div className="Crypto">
                <input type="text" placeholder="Filter" onChange={this.filterCryptoList} ref={(element)=>{this.inputFilter = element}} />
                <CryptoList cryptoList={this.state.filteredCryptoList} />
            </div>
        );
    }
}
export default Crypto;