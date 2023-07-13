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
  baseCurrency:number = 0
  targetCurrency:number = 0

  apiKey = "99d9e374d17f46f2aad02cb2186b70dc"

  baseAmount:number = 1
  targetAmount:number = 0

  baseRate:number = 0
  targetRate:number = 0

  importantCurrencies = ["USD","EUR","JPY","GBP","AUD","CAD","CHF","EGP","HKD"]
  yesterday = ""
  today = ""

  yesterdayAmoundOfBaseCurrency:any = 0
  todayAmoundOfBaseCurrency:any = 0

  dates:any
  datesValues:any = []

  baseRateOfYesterday:any
  baseRateOfMonthAgo:any
  baseRateOfYearAgo:any

  formattedYesterday:string = ""
  formattedLastMonth:string = ""
  formattedLastYear:string = ""

  /*
  **
      The following function is the constructor
  **
  */

  constructor(){
    this.initialCurrencies()
    this.getDates()
  }

  /*
  **
      The following functions to initial currencies
  **
  */

  initialCurrencies(){
    let that = this
    $.get('https://openexchangerates.org/api/latest.json', {app_id: this.apiKey}, function(data) {
      that.data = data
      that.keys = Object.keys(data.rates)
      that.values = Object.values(data.rates)

      that.baseCurrency = that.keys.indexOf("EUR")
      that.targetCurrency = that.keys.indexOf("USD")
      that.baseRate = that.values[that.baseCurrency]
      that.targetRate = that.values[that.targetCurrency]
    })
  }

  /*
  **
      The following functions to get values of the dates
  **
  */

  getDates(){
    
    var today = new Date()
    var yesterday = new Date();
    var month = new Date();
    var year = new Date();
    
    yesterday.setDate(today.getDate() - 1)
    month.setDate(today.getDate() - 30)
    year.setDate(today.getDate() - 365)

    this.formattedYesterday = yesterday.toISOString().slice(0, 10);
    this.formattedLastMonth = month.toISOString().slice(0, 10);
    this.formattedLastYear = year.toISOString().slice(0, 10);
    this.dates = [this.formattedYesterday,this.formattedLastMonth,this.formattedLastYear]
    this.dates.forEach((date) => {
    
      this.getValuesOfTheDate(date)

    })
    
  }

  getValuesOfTheDate(date){
    let that = this
    $.get('https://openexchangerates.org/api/historical/' + date + '.json', {app_id: this.apiKey}, function(data) {
      that.datesValues.push(data)
      data = null
      that.changeBaseCurrency()
    })
  }

  /*
  **
      The following functions the events of changing values
  **
  */

  changeCurrencies(baseCurrency,targetCurrency){
    this.baseCurrency = this.keys.indexOf(baseCurrency)
    this.targetCurrency = this.keys.indexOf(targetCurrency)
    this.baseRate = this.values[this.baseCurrency].toFixed(2)
    this.targetRate = this.values[this.targetCurrency].toFixed(2)
    this.targetAmount = this.baseAmount * this.targetRate / this.baseRate
  }

  changeBaseCurrency(){
    const selectedBaseCurrency:any = document.getElementById("baseCurrency")
    // key = this.keys[this.keys.indexOf(selectedBaseCurrency.value)]
    this.baseRate = this.values[this.keys.indexOf(selectedBaseCurrency.value)]
    this.targetAmount = this.baseAmount * this.targetRate / this.baseRate

    // this.baseRateOfYesterday = Object.values(this.datesValues[0].rates)[this.baseCurrency]
    
    this.baseRateOfYesterday = Object.values(this.datesValues[0].rates)[this.keys.indexOf(selectedBaseCurrency.value)]
    this.baseRateOfMonthAgo = Object.values(this.datesValues[1].rates)[this.keys.indexOf(selectedBaseCurrency.value)]
    this.baseRateOfYearAgo = Object.values(this.datesValues[2].rates)[this.keys.indexOf(selectedBaseCurrency.value)]
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
