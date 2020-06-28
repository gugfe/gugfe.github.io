"use strict";

/**
 * File to process the data. 
 * Uses the classes described in classes.js
 */


/**
 * Converts the data coming from the .csv into an array of Client
 *
 * @param d    CSV data
 * @param minDays     Minimum number of days to evaluate conversions
 */
function getClientList(d, minDays){

  // Initialize a client list
  var clientList = []

  // For each client (row of the file), add to clientList
  for(var i = 0; i < d.length; i++){

    // Check if this client has at least the min number of days
    if(d[i].currentDays >= minDays){

      clientList.push(new Client(d[i].clientCode, 
                                d[i].creationDate, 
                                d[i].isConverted, 
                                d[i].conversionDay, 
                                d[i].didTrial, 
                                d[i].trialStartDay, 
                                d[i].trialEndDay, 
                                d[i].country, 
                                d[i].companySize, 
                                d[i].premiumMonth, 
                                d[i].channel, 
                                d[i].currentDays))
      }
  }

  return clientList
};

/**
 * Calculates conversion rates from the ClientList
 *
 * @param clientList  List of clients and their data
 * @param minDays     Minimum number of days to evaluate conversions
 */
function getConversionRateData(clientList, minDays){

  // Initialize a vector to hold the data for each category
  var channelData = [new Cat1Dim("Website"),new Cat1Dim("Paid Search"),new Cat1Dim("Slack"),new Cat1Dim("Other Channel")]
  var countryData = [new Cat1Dim("United States"),new Cat1Dim("Canada"),new Cat1Dim("United Kingdom"),new Cat1Dim("Other Country")]
  var sizeData =    [new Cat1Dim("Very Small"),new Cat1Dim("Small"),new Cat1Dim("Medium"),new Cat1Dim("Large")]

  // Go over all clients (lines)
  for(var i = 0; i < clientList.length; i++){

    // Check if this client has at least the min number of days
    if(clientList[i].currentDays >= minDays){

      // Go over channel, country and size and increment the n
      for (let j = 0; j < channelData.length; j++) {
        if (channelData[j].nameCat == clientList[i].channel) {
          channelData[j].n += 1
      }}
      for (let j = 0; j < countryData.length; j++) {
        if (countryData[j].nameCat == clientList[i].country) {
          countryData[j].n += 1
      }}
      for (let j = 0; j < sizeData.length; j++) {
        if (sizeData[j].nameCat == clientList[i].companySize) {
          sizeData[j].n += 1
      }}

      // If this client has converted
      if(clientList[i].isConverted == 1){

        // Go over channel, country and size and increment the c
        for (let j = 0; j < channelData.length; j++) {
          if (channelData[j].nameCat == clientList[i].channel) {
            channelData[j].c += 1
          }}
        for (let j = 0; j < countryData.length; j++) {
          if (countryData[j].nameCat == clientList[i].country) {
            countryData[j].c += 1
        }}
        for (let j = 0; j < sizeData.length; j++) {
          if (sizeData[j].nameCat == clientList[i].companySize) {
            sizeData[j].c += 1
        }}
      }
    }
  }

  // Calculate the rates and the bounds
  for (let j = 0; j < channelData.length; j++) {
    channelData[j].calcRate();
    channelData[j].calcBounds();
  }
  for (let j = 0; j < countryData.length; j++) {
    countryData[j].calcRate();
    countryData[j].calcBounds();
  }
  for (let j = 0; j < sizeData.length; j++) {
    sizeData[j].calcRate();
    sizeData[j].calcBounds();
  }

  return [channelData, countryData, sizeData]
};


/**
 * Calculates conversion rates from the ClientList - 2 dimensions
 *
 * @param clientList  List of clients and their data
 * @param minDays     Minimum number of days to evaluate conversions
 */
function getConversionRateData2D(clientList, minDays){

  // Initialize a vector to hold the data for each category
  var country = ["United States", "Canada", "United Kingdom", "Other Country"]
  var channel = ["Website", "Paid Search", "Slack", "Other Channel"]
  var cSize = ["Very Small", "Small", "Medium", "Large"]

  var countrychannelData = []
  var countrysizeData = []
  var channelsizeData = []

  // Country + channel
  for (var i = 0; i < country.length; i++) {
    for (var j = 0; j < channel.length; j++) {
      countrychannelData.push(new Cat1Dim(country[i].concat(" - ", channel[j])))
    }
  }
  // Country + Size
  for (var i = 0; i < country.length; i++) {
    for (var j = 0; j < cSize.length; j++) {
      countrysizeData.push(new Cat1Dim(country[i].concat(" - ", cSize[j])))
    }
  }
  // Channel + Size
  for (var i = 0; i < channel.length; i++) {
    for (var j = 0; j < cSize.length; j++) {
      channelsizeData.push(new Cat1Dim(channel[i].concat(" - ", cSize[j])))
    }
  }

  // Go over all clients (lines)
  for(var i = 0; i < clientList.length; i++){

    // Check if this client has at least the min number of days
    if(clientList[i].currentDays >= minDays){

      // Save the category name in variables
      var textCountryChannel = clientList[i].country.concat(" - ", clientList[i].channel)
      var textCountrySize = clientList[i].country.concat(" - ", clientList[i].companySize)
      var textChannelSize = clientList[i].channel.concat(" - ", clientList[i].companySize)

      // For each pair, increment the n in the right element
      for (let j = 0; j < countrychannelData.length; j++) {
        if (countrychannelData[j].nameCat == textCountryChannel) {
          countrychannelData[j].n += 1
      }}
      for (let j = 0; j < countrysizeData.length; j++) {
        if (countrysizeData[j].nameCat == textCountrySize) {
          countrysizeData[j].n += 1
      }}
      for (let j = 0; j < channelsizeData.length; j++) {
        if (channelsizeData[j].nameCat == textChannelSize) {
          channelsizeData[j].n += 1
      }}

      // If this client has converted
      if(clientList[i].isConverted == 1){

        // For each pair, increment the c in the right element
        for (let j = 0; j < countrychannelData.length; j++) {
          if (countrychannelData[j].nameCat == textCountryChannel) {
            countrychannelData[j].c += 1
        }}
        for (let j = 0; j < countrysizeData.length; j++) {
          if (countrysizeData[j].nameCat == textCountrySize) {
            countrysizeData[j].c += 1
        }}
        for (let j = 0; j < channelsizeData.length; j++) {
          if (channelsizeData[j].nameCat == textChannelSize) {
            channelsizeData[j].c += 1
        }}
      }
    }
  }

  // Calculate the rates and the bounds
  for (let j = 0; j < countrychannelData.length; j++) {
    countrychannelData[j].calcRate();
    countrychannelData[j].calcBounds();
  }
  for (let j = 0; j < countrysizeData.length; j++) {
    countrysizeData[j].calcRate();
    countrysizeData[j].calcBounds();
  }
  for (let j = 0; j < channelsizeData.length; j++) {
    channelsizeData[j].calcRate();
    channelsizeData[j].calcBounds();
  }

  return [countrychannelData, countrysizeData, channelsizeData]
};


/**
 * Extract the data needed for the trial analysis
 *
 * @param clientList  List of clients and their data
 * @param minDays     Minimum number of days to evaluate tirals
 */
function getTrialData(clientList, minDays){

  // Initialize the array
  var trialData = [new Cat1Dim("Day0"),new Cat1Dim("Day1"),new Cat1Dim("Day2_7"),new Cat1Dim("Day8_30"),new Cat1Dim("Day31plus")]

  // Go over all clients (lines)
  for(var i = 0; i < clientList.length; i++){

    // Check if this client has at least the min number of days
    if(clientList[i].currentDays >= minDays){

      // Check if this client has registered for the trial
      if(clientList[i].didTrial == 1){

        // Find the number of days it took to register for the trial and increment n (and c if converted) in the right category
        if(clientList[i].trialStartDay == 0) {
          for (let j = 0; j < trialData.length; j++) {
            if (trialData[j].nameCat == "Day0") {
              trialData[j].n += 1
              if(clientList[i].isConverted == 1){trialData[j].c += 1}
          }}
        } else if(clientList[i].trialStartDay == 1) {
          for (let j = 0; j < trialData.length; j++) {
            if (trialData[j].nameCat == "Day1") {
              trialData[j].n += 1
              if(clientList[i].isConverted == 1){trialData[j].c += 1}
          }}
        } else if(clientList[i].trialStartDay >= 2 && clientList[i].trialStartDay <= 7) {
          for (let j = 0; j < trialData.length; j++) {
            if (trialData[j].nameCat == "Day2_7") {
              trialData[j].n += 1
              if(clientList[i].isConverted == 1){trialData[j].c += 1}
          }}
        } else if(clientList[i].trialStartDay >= 8 && clientList[i].trialStartDay <= 30) {
          for (let j = 0; j < trialData.length; j++) {
            if (trialData[j].nameCat == "Day8_30") {
              trialData[j].n += 1
              if(clientList[i].isConverted == 1){trialData[j].c += 1}
          }}
        } else if(clientList[i].trialStartDay >= 31) {
          for (let j = 0; j < trialData.length; j++) {
            if (trialData[j].nameCat == "Day31plus") {
              trialData[j].n += 1
              if(clientList[i].isConverted == 1){trialData[j].c += 1}
          }}
        }
      }
    }
  }

  // Calculate the rates and the bounds
  for (let j = 0; j < trialData.length; j++) {
    trialData[j].calcRate();
    trialData[j].calcBounds();
  }

  return trialData;
}

/**
 * Extract the data needed for the customer journey analysis
 *
 * @param clientList  List of clients and their data
 * @param minDays     Minimum number of days to evaluate tirals
 */
function getJourneyData(clientList, journeyDays){

  // Define the array that will contain the StatusStats
  var journey = []

  // For each day of the journey
  for (let i = 0; i < journeyDays; i++) { 

    // Initialize the counts
    var f_cnt = 0
    var t_cnt = 0
    var p_cnt = 0
    // For each client (line)
    for(var j = 0; j < clientList.length; j++){

      // If the client has existed at least as many days
      if(clientList[j].currentDays >= i){

        // Assign the client to the right status
        if(clientList[j].conversionDay <= i && clientList[j].isConverted == 1){ // Client is converted
          p_cnt += 1
        } else if(clientList[j].trialStartDay <= i && clientList[j].trialEndDay >= i && clientList[j].didTrial == 1){ // Client is in trial
          t_cnt += 1
        } else {f_cnt += 1} // Client is in freemium
      }
    }

    // Add an element in the array
    journey.push(new StatusStats(f_cnt, t_cnt, p_cnt))
  }

  return journey
};