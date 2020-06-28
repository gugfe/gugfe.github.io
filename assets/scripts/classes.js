"use strict";

/**
 * classes.js
 * This script contains classes used to store the data needed.
 */

/**
 * Client: This class represents a client (a line of the .csv input) 
 */
class Client {
    // Variables
    clientCode;
    creationDate;    
    isConverted;
    conversionDay;
    didTrial;
    trialStartDay;
    trialEndDay;
    country;
    companySize;
    premiumMonth;
    channel;
    currentDays;
  
    constructor(clientCode, creationDate, isConverted, conversionDay, didTrial, trialStartDay, trialEndDay, country, companySize, premiumMonth, channel, currentDays){
      this.clientCode = clientCode;
      this.creationDate = creationDate;      
      this.isConverted = isConverted;
      this.conversionDay = conversionDay;
      this.didTrial = didTrial;
      this.trialStartDay = trialStartDay;
      this.trialEndDay = trialEndDay;
      this.country = country;
      this.companySize = companySize;
      this.premiumMonth = premiumMonth;
      this.channel = channel;
      this.currentDays = currentDays;
    }    
};

/**
 * Cat1Dim: This class is used to store the data of a category 
 * Example: A client whose country is "canada" 
 *      -> nameCat would be "canada"
 *      -> n would be the number of clients
 *      -> c the number of clients who converted
 *      -> rate = n / c
 *      -> LB and UB the lower and upper bounds on the rate
 */
class Cat1Dim {
    // Variables
    nameCat;
    n;
    c;
    rate;
    LB;
    UB;
  
    // Methods
    constructor(nameCat){
      this.nameCat = nameCat;
      this.n = 0;
      this.c = 0;
      this.rate = 0.0;
      this.LB = 0.0;
      this.UB = 1.0;
    }
    calcRate() {
    /**
     * This function calculates the conversion rate
     */ 
      this.rate =  Math.round(this.c / this.n * 1000)/1000;
    }
    calcBounds() {
    /**
     * This function calculates the lower and upper bounds of the conversion rate
     * Details: 
     *      -> The approached used is the Wilson score interval (http://goo.gl/kgmV3g)
     *      -> Inspiration was also taken from https://github.com/msn0/wilson-score-interval
     */ 

    if (this.n != 0) { // If N = 0 don't do anything (LB and UB are already initialized at 0 and 1)
        // The rate is first calculated as the proportion of successes
        const rate = this.c / this.n;

        // z is 1-alpha/2 percentile of a standard normal distribution for error:
        // (alpha =  5% -> z = 1.960, alpha = 10% -> z = 1.645, alpha = 20% -> z = 1.282)
        const z = 1.282;

        // Implement the algorithm
        const a = rate + z * z / (2 * this.n);
        const b = z * Math.sqrt((rate * (1 - rate) + z * z / (4 * this.n)) / this.n);
        const c = 1 + z * z / this.n;
        this.LB = Math.round((a - b) / c * 1000)/1000;
        this.UB = Math.round((a + b) / c * 1000)/1000;
      }
    }
};

/**
 * StatusStats: This class is used to store the statistics of a certain day in the customer journey
 * Details: 
 *      -> The xyz_cnt variables are for counting the number of clients in each status on that day
 *      -> The percentages are calculated as a pct of all clients on that day
 */
class StatusStats {
    // Variables
    freemium_cnt;
    trial_cnt;
    premium_cnt;
    freemium_pct;
    trial_pct;
    premium_pct;
  
    // Methods
    constructor(freemium_cnt, trial_cnt, premium_cnt){
      this.freemium_cnt = freemium_cnt;
      this.trial_cnt = trial_cnt;
      this.premium_cnt = premium_cnt;
      this.freemium_pct = freemium_cnt / (this.freemium_cnt + this.trial_cnt + this.premium_cnt);
      this.trial_pct = trial_cnt / (this.freemium_cnt + this.trial_cnt + this.premium_cnt);
      this.premium_pct = premium_cnt / (this.freemium_cnt + this.trial_cnt + this.premium_cnt);
    }
};
