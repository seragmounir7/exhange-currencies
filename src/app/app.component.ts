import { Component } from '@angular/core';
import * as $ from 'jquery'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'exchange';
  data:any = {}
  keys:any = []
  values:any = []
  euro:number = 46
  usd:number = 149
  baseCurrency:number = 1 //euro
  targetCurrency:number = 20 //euro

  baseAmount:number = 0
  targetAmount:number = 0

  baseRate:number = 0
  targetRate:number = 0

  importantCurrencies = ["USD","EUR","JPY","GBP","AUD","CAD","CHF","CNH","HKD"]

  constructor(){
    this.initialCurrencies()
  }

  initialCurrencies(){
    let that = this
    $.get('https://openexchangerates.org/api/latest.json', {app_id: '99d9e374d17f46f2aad02cb2186b70dc'}, function(data) {
      that.data = data
      that.keys = Object.keys(data.rates)
      that.values = Object.values(data.rates)

      that.baseCurrency = that.keys.indexOf("EUR")
      that.targetCurrency = that.keys.indexOf("USD")
      that.baseRate = that.values[that.baseCurrency]
      that.targetRate = that.values[that.targetCurrency]
      
      that.getImportantCurrencies();
    })
  }

  changeCurrencies(baseCurrency,targetCurrency){
    this.baseCurrency = this.keys.indexOf(baseCurrency)
    this.targetCurrency = this.keys.indexOf(targetCurrency)
    this.baseRate = this.values[this.baseCurrency]
    this.targetRate = this.values[this.targetCurrency]
    this.targetAmount = this.baseAmount * this.targetRate / this.baseRate
  }

  getImportantCurrencies(){
  }

  changeBaseCurrency(){
    const selectedBaseCurrency:any = document.getElementById("baseCurrency")
    // key = this.keys[this.keys.indexOf(selectedBaseCurrency.value)]
    this.baseRate = this.values[this.keys.indexOf(selectedBaseCurrency.value)]
    this.targetAmount = this.baseAmount * this.targetRate / this.baseRate
  }

  changeTargetCurrency(){
    const selectedTargetCurrency:any = document.getElementById("targetCurrency")
    // key = this.keys[this.keys.indexOf(selectedBase.value)]
    this.targetRate = this.values[this.keys.indexOf(selectedTargetCurrency.value)]
    this.baseAmount = this.targetAmount * this.baseRate / this.targetRate
  }

  changeBaseAmount(e:any){
    //changed amount is = e.target.value
    this.targetAmount = parseFloat((this.baseAmount * this.targetRate / this.baseRate).toFixed(2).toString())
  }

  changeTargetAmount(e:any){
    //changed amount is = e.target.value
    this.baseAmount = parseFloat((this.targetAmount * this.baseRate / this.targetRate).toFixed(2).toString())
  }
}
